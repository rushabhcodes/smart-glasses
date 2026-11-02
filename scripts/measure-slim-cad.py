"""Measure transformed native CAD meshes; this is not a physical fit test."""
import json
from pathlib import Path

import numpy as np
import trimesh

out = Path('dist/slim-review')
result = {'normalAxis': 'glTF world Y', 'units': 'mm',
          'scope': 'Flat populated CAD, including backing and model underhang; excludes cable harness, antenna, pack and housing.',
          'boards': {}}
for side in ['main', 'secondary']:
    scene = trimesh.load(out / f'{side}-flat.glb', force='scene')
    refs = {}
    for node in scene.graph.nodes_geometry:
        transform, key = scene.graph[node]
        mesh = scene.geometry[key].copy()
        mesh.apply_transform(transform)
        ref = node.rsplit('_', 1)[0]
        bounds = mesh.bounds
        if ref not in refs:
            refs[ref] = bounds
        else:
            refs[ref] = np.array([np.minimum(refs[ref][0], bounds[0]),
                                  np.maximum(refs[ref][1], bounds[1])])
    span = scene.bounds[1] - scene.bounds[0]
    assert abs(span[2] - 17) < 1e-4, 'Actual CAD width changed'
    if side == 'secondary':
        for ref in ['J2', 'J3', 'J4']:
            assert abs(refs[ref][1][1]-refs[ref][0][1]-1.4) < 1e-4, 'ACH mated envelope height/orientation'
        assert span[1] < 4.36, 'Secondary CAD thickness regression'
    result['boards'][side] = {
        'worldBoundsMm': scene.bounds.tolist(),
        'flatLengthMm': float(span[0]), 'widthMm': float(span[2]),
        'populatedNormalSpanMm': float(span[1]),
        'partBoundsMm': {k: v.tolist() for k, v in refs.items()},
        'normalSpanIncludesModelUnderhang': True,
        'achModel': 'nominal mated bounding envelope, not detailed vendor CAD' if side == 'secondary' else None,
    }
    if side == 'secondary':
        intersections = []
        for ref in ['J2', 'J3', 'J4']:
            for other, bounds in refs.items():
                if other == ref or other == 'PCB' or other.startswith('STIFF_'):
                    continue
                depth = np.minimum(refs[ref][1], bounds[1]) - np.maximum(refs[ref][0], bounds[0])
                if np.min(depth) > 1e-4:
                    intersections.append({'connector': ref, 'other': other,
                                          'overlapDepthMm': depth.tolist()})
        assert not intersections, intersections
        result['newConnectorEnvelopeAabbIntersections'] = intersections
(out/'cad-measurements.json').write_text(json.dumps(result, indent=2)+'\n')
print(json.dumps({side:{k:v for k,v in b.items() if k != 'partBoundsMm'} for side,b in result['boards'].items()}))
