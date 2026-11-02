"""Independent solid checks using conservative actual-CAD slab certificates."""
from pathlib import Path
import itertools,json
import manifold3d as m
import numpy as np
import trimesh

out=Path('dist/slim-housing-review')
assessment=json.loads((out/'fit-assessment.json').read_text())
raw=json.loads((out/'world-triangles.json').read_text())
def solid(triangles):
    t=np.asarray(triangles)
    mesh=trimesh.Trimesh(vertices=t.reshape(-1,3),faces=np.arange(t.size//3).reshape(-1,3),process=True)
    assert mesh.is_watertight and mesh.is_winding_consistent
    g=m.Manifold(m.Mesh(np.asarray(mesh.vertices,dtype=np.float32),np.asarray(mesh.faces,dtype=np.uint32)))
    assert g.status()==m.Error.NoError
    return g
parts={k:solid(v) for k,v in raw.items()}
certificates={}
for side,b in assessment['sides'].items():
    y0,y1=b['cadBoundsMm'][0][1],b['cadBoundsMm'][1][1]
    boxes=[]
    for r in b['cadSlabCertificate']:
        size=[r['x1']-r['x0'],y1-y0,r['z1']-r['z0']]
        boxes.append(m.Manifold.cube(size,True).translate([(r['x0']+r['x1'])/2,(y0+y1)/2,(r['z0']+r['z1'])/2]))
    certificates[side]=m.Manifold.batch_boolean(boxes,m.OpType.Add)
intersection=[]
for name,g in parts.items():
    for side,certificate in certificates.items():
        v=(g^certificate).volume()
        assert v<1e-4,(name,side,v)
        intersection.append({'part':name,'cadSide':side,'intersectionVolumeMm3':v})
for a,b in itertools.combinations(parts,2):
    v=(parts[a]^parts[b]).volume()
    assert v<1e-4,(a,b,v)
front=json.loads(Path('dist/mechanical/glasses/world-triangles.json').read_text())
for name in ['front-frame','brow-cover','camera-cover']:
    g=solid(front[name])
    for part,body in parts.items():
        v=(body^g).volume()
        assert v<1e-4,(part,name,v)
review={'method':'Actual transformed CAD triangles clipped into slabs; conservative containing solids checked against exported housing CSG solids.',
        'parts':4,'exportedStlsClosedAndOriented':True,'componentSlabIntersections':intersection,
        'housingPartIntersections':0,'referenceFrontIntersections':0,
        'minimumWallNormalMm':min(assessment['settings']['wallY'],assessment['settings']['wallX']/(1+assessment['settings']['maxProfileSlope']**2)**.5),
        'minimumCoverSeamNormalMm':assessment['settings']['seamGap']/(1+assessment['settings']['maxProfileSlope']**2)**.5,
        'notValidated':['physical fit','retention/fasteners/front attachment','component and antenna mating tolerances','actual harness','camera/pack integration','thermal/acoustic/hinge behavior','manufacturing process']}
(out/'fit-check.json').write_text(json.dumps(review,indent=2)+'\n')
print(json.dumps(review))
