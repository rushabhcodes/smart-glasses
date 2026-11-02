"""Fit a static provisional envelope to the actual transformed slim CAD.

Clips every CAD triangle into Z slabs; no component mesh repair or invented part.
The result is an editable tsCircuit/JSCAD envelope, not a finished wearable shell.
"""
from pathlib import Path
import hashlib
import json
import math

import numpy as np
import trimesh

source=Path('dist/slim-review/assembled.glb')
scene=trimesh.load(source,force='scene')
settings=dict(wallMinimum=1.6,wallX=1.64,wallY=1.6,clearanceX=.62,clearanceY=.6,
              cableReserveX=1.0,seamGap=.25,maxProfileSlope=.22,slabLength=2.0,
              frontZ=18.6,rearService=6.0,usage='static envelope study; not measured wearer fit')
triangles={}
for side in ['main','secondary']:
    groups=[]
    for node in scene.graph.nodes_geometry:
        if not node.startswith(side+':'):continue
        transform,key=scene.graph[node]
        mesh=scene.geometry[key].copy();mesh.apply_transform(transform)
        groups.append(mesh.triangles)
    triangles[side]=np.concatenate(groups)
back=max(float(t[:,:,2].max()) for t in triangles.values())+settings['rearService']
settings['backZ']=back
zs=np.linspace(settings['frontZ'],back,math.ceil((back-settings['frontZ'])/settings['slabLength'])+1)

def clip(poly,z,above):
    out=[]
    for a,b in zip(poly,poly[1:]+poly[:1]):
        ina=a[2]>=z if above else a[2]<=z
        inb=b[2]>=z if above else b[2]<=z
        if ina:out.append(a)
        if ina!=inb:out.append(a+(b-a)*((z-a[2])/(b[2]-a[2])))
    return out

def expand_slope(values,lower):
    v=values.copy();s=settings['maxProfileSlope']
    for i in range(1,len(v)):
        v[i]=min(v[i],v[i-1]+s*(zs[i]-zs[i-1])) if lower else max(v[i],v[i-1]-s*(zs[i]-zs[i-1]))
    for i in range(len(v)-2,-1,-1):
        v[i]=min(v[i],v[i+1]+s*(zs[i+1]-zs[i])) if lower else max(v[i],v[i+1]-s*(zs[i+1]-zs[i]))
    return v

report={'settings':settings,'inputGlbSHA256':hashlib.sha256(source.read_bytes()).hexdigest(),'sides':{}}
for side,tris in triangles.items():
    zlo=tris[:,:,2].min(1);zhi=tris[:,:,2].max(1);slabs=[]
    for z0,z1 in zip(zs,zs[1:]):
        candidate=tris[(zlo<=z1)&(zhi>=z0)];points=[]
        for t in candidate:
            p=clip(list(t),z0,True)
            if p:p=clip(p,z1,False)
            points.extend(p)
        a=np.asarray(points)
        slabs.append((float(a[:,0].min()),float(a[:,0].max())) if len(a) else None)
    for i,v in enumerate(slabs):
        if v is None:
            nearest=min((j for j,q in enumerate(slabs) if q is not None),key=lambda j:abs(j-i))
            slabs[i]=slabs[nearest]
    low=np.array([min(slabs[max(0,i-1)][0],slabs[min(len(slabs)-1,i)][0]) for i in range(len(zs))])
    high=np.array([max(slabs[max(0,i-1)][1],slabs[min(len(slabs)-1,i)][1]) for i in range(len(zs))])
    low-=settings['clearanceX']+(settings['cableReserveX'] if side=='secondary' else 0)
    high+=settings['clearanceX']+(settings['cableReserveX'] if side=='main' else 0)
    low=expand_slope(low,True);high=expand_slope(high,False)
    vertices=tris.reshape(-1,3)
    idx=np.clip(np.searchsorted(zs,vertices[:,2],side='right')-1,0,len(zs)-2)
    ratio=(vertices[:,2]-zs[idx])/(zs[idx+1]-zs[idx])
    lx=low[idx]+ratio*(low[idx+1]-low[idx]);hx=high[idx]+ratio*(high[idx+1]-high[idx])
    ls=(low[idx+1]-low[idx])/(zs[idx+1]-zs[idx]);hs=(high[idx+1]-high[idx])/(zs[idx+1]-zs[idx])
    clearance=min(float(np.min((vertices[:,0]-lx)/np.sqrt(1+ls*ls))),
                  float(np.min((hx-vertices[:,0])/np.sqrt(1+hs*hs))))
    assert clearance>=.6-1e-5,(side,clearance)
    slab_clearance=min(min(v[0]-max(low[i],low[i+1]),min(high[i],high[i+1])-v[1])
                       /math.sqrt(1+settings['maxProfileSlope']**2) for i,v in enumerate(slabs))
    assert slab_clearance>=.6-1e-5,(side,slab_clearance)
    bounds=np.array([vertices.min(0),vertices.max(0)])
    inner_y=[float(bounds[0,1]-.6),float(bounds[1,1]+.6)]
    # Earlier authored rigid-tray nominal cavities, before service cutouts.
    old_x=[70.5,76.8] if side=='main' else [-80.7,-69.2]
    old_z=[20.6,113.4] if side=='main' else [20.6,133.4]
    report['sides'][side]={'points':[dict(z=float(z),x0=float(a),x1=float(b)) for z,a,b in zip(zs,low,high)],
        'cavityY':inner_y,'cadBoundsMm':bounds.tolist(),
        'minimumNominalNormalClearanceMm':clearance,
        'minimumConservativeTriangleSlabClearanceMm':slab_clearance,
        'cadSlabCertificate':[dict(z0=float(z0),z1=float(z1),x0=float(v[0]),x1=float(v[1]))
                              for z0,z1,v in zip(zs,zs[1:],slabs)
                              if z1>=bounds[0,2] and z0<=bounds[1,2]],
        'minimumVerticalClearanceMm':.6,
        'minimumEndClearanceMm':min(float(bounds[0,2]-(zs[0]+settings['wallMinimum'])),float((zs[-1]-settings['wallMinimum'])-bounds[1,2])),
        'outerHeightMm':inner_y[1]-inner_y[0]+2*settings['wallY'],
        'maxLocalOuterWorldXSpanMm':float(np.max(high-low)+2*settings['wallX']),
        'overallOuterWorldXSpanMm':float(high.max()-low.min()+2*settings['wallX']),
        'oldCavityMm':{'x':old_x,'y':[2.4,21.6],'z':old_z},
        'oldMinimumSideClearanceMm':min(float(bounds[0,0]-old_x[0]),float(old_x[1]-bounds[1,0])),
        'oldRearOverrunMm':max(0,float(bounds[1,2]-old_z[1])),
        'oldCavityFit':False}
Path('src/slim/housing-profile.json').write_text(json.dumps(report,indent=2)+'\n')
Path('dist/slim-housing-review').mkdir(exist_ok=True)
Path('dist/slim-housing-review/fit-assessment.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({s:{k:v for k,v in b.items() if k not in ['points','cadSlabCertificate']} for s,b in report['sides'].items()}))
