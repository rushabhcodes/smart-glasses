"""Make the main-core backing one connected, windowed FR4 pattern.

Uses the existing pinned optional enclosure geometry tools; never changes the
electrical placement, outline, bend geometry, camera or battery requirements.
"""
import json
import struct
import sys
from pathlib import Path

import manifold3d as m
import numpy as np

path = Path(sys.argv[1] if len(sys.argv) > 1 else 'src/flex/layout.json')
plan = json.loads(path.read_text())
board = plan['boards']['main']
island = next(i for i in board['islands'] if i['name'] == 'core')
settings = plan['settings']
margin = settings['stiffenerEdgeMargin']
half_height = settings['islandHeight'] / 2 - margin
web = settings['minStiffenerWeb']


def rect(x0, x1, y0, y1):
    return m.CrossSection([[(x0, y0), (x1, y0), (x1, y1), (x0, y1)]])


plate = rect(island['left'] + margin, island['right'] - margin,
             -half_height, half_height)
windows = m.CrossSection.compose([
    rect(h['x0'], h['x1'], h['y0'], h['y1']) for h in island['stiffenerWindows']
])
available = plate - windows
# Opening removes webs narrower than the specified structural spine while
# preserving every component/drill exclusion. Miter joins stay rectilinear,
# permitting exact native pcbstiffener rectangle decomposition with no holes API.
spine = available.offset(-web / 2, m.JoinType.Miter)
pieces = spine.decompose()
discarded = []
if len(pieces) != 1 and '--connected-core' in sys.argv:
    # The narrower local variant exposes a small peninsula joined only through
    # a web below the chosen structural width. Omit that FR4 peninsula rather
    # than bridge any underside component clearance or change a land pattern.
    pieces.sort(key=lambda p: p.area(), reverse=True)
    assert pieces[0].area() / spine.area() > .95, 'Major backing redesign required'
    discarded = [p.area() for p in pieces[1:]]
    spine = pieces[0]
assert len(spine.decompose()) == 1, 'Backing needs a reviewed support redesign'
backing = m.CrossSection.batch_boolean(
    [spine.offset(web / 2, m.JoinType.Miter), available], m.OpType.Intersect
).simplify(1e-6)
assert len(backing.decompose()) == 1, 'Disconnected backing after refinement'
assert (backing - available).area() < 1e-6, 'Backing entered a clearance window'
contours = [[[float(x), float(y)] for x, y in c] for c in backing.to_polygons()]

# Sweep polygon boundaries into rectangles. Small slab widths are legitimate
# tessellation boundaries; structural width is checked on the union, not tiles.
xs = sorted(set(round(x, 8) for c in contours for x, _ in c))
tiles, active = [], {}
for x0, x1 in zip(xs, xs[1:]):
    if x1 - x0 < 1e-7:
        continue
    mid = (x0 + x1) / 2
    ys = []
    for c in contours:
        for a, b in zip(c, c[1:] + c[:1]):
            assert abs(a[0]-b[0]) < 1e-6 or abs(a[1]-b[1]) < 1e-6
            if min(a[0], b[0]) < mid < max(a[0], b[0]):
                ys.append(round(a[1], 8))
    ys.sort()
    assert len(ys) % 2 == 0
    next_active = {}
    for y0, y1 in zip(ys[::2], ys[1::2]):
        key = (y0, y1)
        if key in active and abs(active[key]['x1']-x0) < 1e-7:
            tile = active[key]
            tile['x1'] = x1
        else:
            tile = dict(x0=x0, x1=x1, y0=y0, y1=y1)
            tiles.append(tile)
        next_active[key] = tile
    active = next_active

native = m.CrossSection.compose([rect(t['x0'], t['x1'], t['y0'], t['y1']) for t in tiles])
assert len(native.decompose()) == 1
assert (native-backing).area() + (backing-native).area() < 1e-5
assert len(native.offset(-web/2+1e-5, m.JoinType.Miter).decompose()) == 1

board['stiffeners'] = [t for t in board['stiffeners'] if t['island'] != 'core'] + [
    dict(name=f'core_{i}', island='core', **t) for i, t in enumerate(tiles)
]
island['stiffenerCoverage'] = native.area() / plate.area()
island['stiffenerContours'] = contours
island['stiffenerRefinement'] = {
    'method': 'rectilinear morphological opening; no per-tile width filtering',
    'structuralSpineWidthMm': web,
    'connectedPatches': 1,
    'contours': len(contours),
    'areaMm2': native.area(),
    'nativeTileCount': len(tiles),
    'componentClearanceMm': settings['undersideClearance'],
    'omittedWeakPeninsulaSpineAreasMm2': discarded,
    'note': 'Connected manufacturable-pattern intent, not a stiffness or supplier capability qualification.'
}
path.write_text(json.dumps(plan, indent=2)+'\n')

out = Path(sys.argv[2] if len(sys.argv) > 2 else 'mechanical/flex')
out.mkdir(parents=True, exist_ok=True)
svg_path = ' '.join('M '+' L '.join(f'{x:.8f},{-y:.8f}' for x, y in c)+' Z' for c in contours)
min_x, max_x = min(xs), max(xs)
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{max_x-min_x:.8f}mm" height="{2*half_height:.8f}mm" viewBox="{min_x:.8f} {-half_height:.8f} {max_x-min_x:.8f} {2*half_height:.8f}">
<title>Main core single-piece windowed FR4 backing; 0.20 mm FR4 + 0.05 mm adhesive; supplier review required</title>
<path d="{svg_path}" fill="#cdd3a2" fill-rule="evenodd" stroke="none"/>
</svg>\n'''
(out/'main-core-stiffener.svg').write_text(svg)

# Independent closed solid for mechanical review. Not an instruction to print FR4.
solid = native.extrude(settings['stiffenerThickness'])
mesh = solid.to_mesh()
vertices = np.asarray(mesh.vert_properties)[:, :3]
faces = np.asarray(mesh.tri_verts)
with (out/'main-core-stiffener.stl').open('wb') as f:
    f.write(b'Connected FR4 backing review; mm; not fabrication approval'.ljust(80, b'\0'))
    f.write(struct.pack('<I', len(faces)))
    for face in faces:
        pts = vertices[face]
        n = np.cross(pts[1]-pts[0], pts[2]-pts[0])
        n /= np.linalg.norm(n)
        f.write(struct.pack('<12fH', *n, *pts.flatten(), 0))
print(json.dumps(island['stiffenerRefinement']))
