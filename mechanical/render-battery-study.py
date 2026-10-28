from pathlib import Path
import re,json,hashlib,datetime
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
import numpy as np
r=Path(__file__).resolve().parents[1];fig=plt.figure(figsize=(13,5),facecolor='white');metadata=[]
for i,(part,title,limit) in enumerate([('jauch1900','LP103450JH · 52 × 34.5 × 10 mm','1C discharge; conditional external candidate'),('jauch2050','LP504783JU · 84.5 × 47.5 × 5.2 mm','2.1 A discharge; cold charge setting must change'),('jauch350','LP561836JU · 38.5 × 18.5 × 5.6 mm','370 mA maximum: excluded from current budget')]):
 txt=(r/f'dist/mechanical/{part}-envelope.stl').read_text();v=np.array([[float(n) for n in p] for p in re.findall(r'vertex\s+([\-\d.eE]+)\s+([\-\d.eE]+)\s+([\-\d.eE]+)',txt)]);triangles=v.reshape((-1,3,3));hi=v.max(0)
 ax=fig.add_subplot(1,3,i+1,projection='3d');ax.add_collection3d(Poly3DCollection(triangles,facecolor='#f1bf74' if i<2 else '#d8a4a4',edgecolor='#685344',linewidths=.35,alpha=.85))
 y=hi[1]+9;z=1.6;bx=np.array([[0,y,0],[100,y,0],[100,y+18,0],[0,y+18,0],[0,y,z],[100,y,z],[100,y+18,z],[0,y+18,z]])
 faces=[[bx[j] for j in ids] for ids in [[0,1,2,3],[4,5,6,7],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7]]];ax.add_collection3d(Poly3DCollection(faces,facecolor='#609b7b',edgecolor='#315842',linewidths=.4))
 ax.set_xlim(0,100);ax.set_ylim(0,80);ax.set_zlim(0,20);ax.set_box_aspect([100,80,20]);ax.view_init(30,-58);ax.set_axis_off();ax.set_title(title,fontsize=10,pad=7)
 ax.text2D(.03,.05,limit,transform=ax.transAxes,fontsize=8)
 metadata.append({'model':part,'listedEnvelopeMm':hi.tolist(),'STLsha256':hashlib.sha256(txt.encode()).hexdigest()})
fig.suptitle('Battery packaging study — actual CAD bounding volumes, no installed assembly',fontsize=14)
fig.text(.5,.10,'Green: separate 100 × 18 × 1.6 mm PCB reference. Colored: manufacturer-listed pack body envelopes.',ha='center',fontsize=10)
fig.text(.5,.045,'Leads, connectors, NTC, swelling/tolerances and frame fit are not modeled. No pack selected or ordered.',ha='center',fontsize=9)
out=r/'docs/progress/2026-10-28-battery-envelope-study.png';fig.savefig(out,dpi=130,bbox_inches='tight');meta={'generatedAtUTC':datetime.datetime.now(datetime.timezone.utc).isoformat(),'note':'Actual OpenSCAD bounding-volume meshes. Not a detailed battery model or an assembled frame.','models':metadata,'imageSHA256':hashlib.sha256(out.read_bytes()).hexdigest()};(r/'docs/progress/2026-10-28-battery-envelope-study.json').write_text(json.dumps(meta,indent=2)+'\n');print(out)
