"""Compile serialized tsCircuit JSCAD CSG plans using Manifold3D; no mesh hole filling.
The source plan stays authoritative. Different tessellation from browser JSCAD is explicit.
"""
from pathlib import Path
from functools import lru_cache
import sys, json, math, itertools, hashlib
import numpy as np
import manifold3d as md
import trimesh
out=Path(sys.argv[1])
M=md.Manifold
@lru_cache(maxsize=128)
def rounded(size,r):
    offsets=np.array(list(itertools.product(*[(-v/2+r,v/2-r) for v in size])))
    # Convex hull of sphere samples at the 8 inset corners: rounded cuboid.
    sphere=np.asarray(M.sphere(r,32).to_mesh().vert_properties)[:,:3]
    return M.hull_points(np.concatenate([sphere+v for v in offsets]))
def hull(gs):
    return M.hull_points(np.concatenate([np.asarray(g.to_mesh().vert_properties)[:,:3] for g in gs]))
def run(p):
    t=p['type']
    if t=='cuboid':return M.cube(p['size'],True).translate(p.get('center',[0,0,0]))
    if t=='roundedCuboid':return rounded(tuple(p['size']),p['roundRadius']).translate(p.get('center',[0,0,0]))
    if t=='sphere':return M.sphere(p['radius'],32).translate(p.get('center',[0,0,0]))
    if t=='cylinder':return M.cylinder(p['height'],p['radius'],circular_segments=32,center=True).translate(p.get('center',[0,0,0]))
    if t=='translate':return run(p['shape']).translate(p['vector'])
    if t=='rotate':return run(p['shape']).rotate(np.degrees(p['angles']).tolist())
    if t in ['union','subtract','intersect']:
        return M.batch_boolean([run(q) for q in p['shapes']],{'union':md.OpType.Add,'subtract':md.OpType.Subtract,'intersect':md.OpType.Intersect}[t])
    if t=='hull':return hull([run(q) for q in p['shapes']])
    if t=='hullChain':
        gs=[run(q) for q in p['shapes']]
        return M.batch_boolean([hull(gs[i:i+2]) for i in range(len(gs)-1)],md.OpType.Add)
    raise ValueError('Unsupported CSG operation: '+t)
def mesh(g):
    r=g.to_mesh();return trimesh.Trimesh(vertices=np.asarray(r.vert_properties)[:,:3],faces=r.tri_verts,process=False)
def review(m):
    # Independent indexed-edge audit; no scipy/networkx graph dependency.
    edges=m.edges_sorted;unique,counts=np.unique(edges,axis=0,return_counts=True)
    return dict(watertight=bool(m.is_watertight),windingConsistent=bool(m.is_winding_consistent),volumeMm3=float(m.volume),boundaryEdges=int(np.sum(counts==1)),nonManifoldEdges=int(np.sum(counts!=2)),triangles=len(m.faces),vertices=len(m.vertices),finite=bool(np.isfinite(m.vertices).all()))
manifest=json.loads((out/'part-manifest.json').read_text());parts={};reports=[];world={}
for p in manifest:
    g=run(json.loads((out/'plans'/f"{p['name']}.jscad.json").read_text())).simplify(0.0001)
    if g.status()!=md.Error.NoError:raise ValueError((p['name'],g.status()))
    parts[p['name']]=g;m=mesh(g);row={'name':p['name'],'boundsMm':m.bounds.tolist(),'sizeMm':m.extents.tolist(),'connectedSolids':len(g.decompose()),**review(m)}
    if not(row['watertight'] and row['windingConsistent'] and row['finite'] and row['volumeMm3']>0 and row['connectedSolids']==1):raise ValueError(row)
    world[p['name']]=m.triangles.tolist()
    printable=g
    if p.get('printTransform'):
        t=p['printTransform'];printable=g.translate(t['translate']).rotate([0,t['rotateYDegrees'],0])
    pm=mesh(printable);pm.apply_translation(-pm.bounds[0]);raw=pm.export(file_type='stl');(out/'stl'/f"{p['name']}.stl").write_bytes(raw)
    # Reload the exact binary STL to validate exported coordinates/float32 topology too.
    saved=trimesh.load(out/'stl'/f"{p['name']}.stl",force='mesh');row['stlReview']=review(saved);row['stlSHA256']=hashlib.sha256(raw).hexdigest();row['printBoundsMm']=saved.bounds.tolist()
    if not(saved.is_watertight and saved.is_winding_consistent and saved.volume>0):raise ValueError(('Binary STL failed',p['name'],row))
    reports.append(row);print(p['name'],row['triangles'],'triangles; closed, oriented, 1 solid',flush=True)
(out/'world-triangles.json').write_text(json.dumps(world,separators=(',',':')))
interference=[]
def overlap(a,b):return all(min(a[1][i],b[1][i])-max(a[0][i],b[0][i])>0.005 for i in range(3))
if '--check' in sys.argv:
    for a,b in itertools.combinations(parts,2):
        ma,mb=mesh(parts[a]),mesh(parts[b])
        if overlap(ma.bounds,mb.bounds):
            v=(parts[a]^parts[b]).volume()
            if v>.02:interference.append(dict(a=a,b=b,volumeMm3=v,kind='printed-parts'))
    for b in json.loads((out/'component-bounds.json').read_text()):
        bb=np.asarray(b['bounds']);sz=bb[1]-bb[0]
        if np.min(sz)<.005:continue
        for name,g in parts.items():
            if not overlap(mesh(g).bounds,bb):continue
            v=(g^M.cube(sz.tolist(),True).translate(bb.mean(axis=0).tolist())).volume()
            if v>.02:interference.append(dict(a=name,b=f"{b['side']}:{b['label']}",volumeMm3=v,kind='component-AABB-conservative'))
review_out=dict(backend='Manifold3D 3.3.2; same tsCircuit/JSCAD CSG plan; simplify tolerance 0.0001 mm; no hole filling',validation='Trimesh 4.9.0 validates exact reloaded binary STL',parts=reports,interference=interference,interferenceChecked='--check' in sys.argv)
(out/'solid-mesh-review.json').write_text(json.dumps(review_out,indent=2)+'\n')
print('INTERFERENCE',json.dumps(interference),flush=True)
