"""Check actual built backing solids, independent of the tile planner."""
import json
import sys
from pathlib import Path

import manifold3d as m
import numpy as np
import trimesh

plan = json.loads(Path(sys.argv[1] if len(sys.argv) > 1 else 'src/flex/layout.json').read_text())
variant = sys.argv[2] if len(sys.argv) > 2 else 'flex'
out = Path(sys.argv[3] if len(sys.argv) > 3 else 'mechanical/flex')


def rect(x0, x1, y0, y1):
    return m.CrossSection([[(x0, y0), (x1, y0), (x1, y1), (x0, y1)]])


review = {}
for side, board in plan['boards'].items():
    circuit = json.loads(Path(f'dist/src/{variant}/{side}-{variant}/circuit.json').read_text())
    for island in board['islands']:
        tiles = [x for x in circuit if x['type'] == 'pcb_stiffener'
                 and x['name'].startswith(f"STIFF_{island['name']}_")]
        solid = m.CrossSection.compose([
            rect(t['center']['x']-t['width']/2, t['center']['x']+t['width']/2,
                 t['center']['y']-t['height']/2, t['center']['y']+t['height']/2)
            for t in tiles
        ])
        windows = m.CrossSection.compose([
            rect(h['x0'], h['x1'], h['y0'], h['y1']) for h in island['stiffenerWindows']
        ])
        overlap = m.CrossSection.batch_boolean([solid, windows], m.OpType.Intersect).area()
        assert overlap < 1e-4, f'{side}:{island["name"]} enters component/drill window'
        assert len(solid.decompose()) == 1, 'Backing must be one connected piece'
        spine = solid.offset(-plan['settings']['minStiffenerWeb']/2+1e-5, m.JoinType.Miter)
        assert len(spine.decompose()) == 1 and spine.area() > 0
        if 'stiffenerContours' in island:
            contour = m.CrossSection(island['stiffenerContours'])
            assert (solid-contour).area()+(contour-solid).area() < 1e-4
        review[f'{side}:{island["name"]}'] = {
            'connectedPieces':1, 'areaMm2':solid.area(),
            'structuralSpineWidthMm':plan['settings']['minStiffenerWeb'],
            'erodedSpineConnectedPieces':1, 'componentWindowOverlapMm2':overlap,
        }

mesh = trimesh.load(out/'main-core-stiffener.stl', force='mesh')
assert mesh.is_watertight and mesh.is_winding_consistent
parents = list(range(len(mesh.faces)))
def find(i):
    if parents[i] != i:
        parents[i] = find(parents[i])
    return parents[i]
edge_faces = {}
for i, face in enumerate(mesh.faces):
    for a, b in zip(face, np.roll(face, -1)):
        edge = tuple(sorted((int(a), int(b))))
        if edge in edge_faces:
            parents[find(i)] = find(edge_faces[edge])
        else:
            edge_faces[edge] = i
assert len(set(find(i) for i in range(len(mesh.faces)))) == 1
core = review['main:core']
assert abs(mesh.volume-core['areaMm2']*.2) < .001
assert np.allclose(mesh.bounds[:,2], [0,.2], atol=1e-6)
core['reviewSTL'] = {'closed':True,'consistentWinding':True,'bodies':1,
                     'volumeMm3':float(mesh.volume),'thicknessMm':.2}
(out/'backing-review.json').write_text(json.dumps(review,indent=2)+'\n')
print(json.dumps(review))
