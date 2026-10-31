#include "ov5640_sequence.h"
#include <assert.h>
#include <stdio.h>
#include <string.h>
typedef struct { unsigned t, stable[3], pwdn_at, reset_at, clock_at; int on_order, off_order, fail_rail;
 bool rails[3], dvp, sccb, reset, pwdn, clock, busy, stuck, af_powered; } model;
static void en(void *p,sg_cam_rail r,bool on) { model *m=p;
 if(on){assert((int)r==m->on_order++); if(r>0) assert(m->rails[r-1]); m->stable[r]=m->t+300;}
 m->rails[r]=on;
}
static bool range(void *p,sg_cam_rail r){model *m=p;return m->rails[r] && (int)r!=m->fail_rail && m->t>=m->stable[r];}
static bool below(void *p,sg_cam_rail r){model *m=p;return !m->rails[r] && !m->stuck;}
static void dvp(void *p,bool x){model *m=p;if(x) assert(m->t>=m->stable[2]+5000);m->dvp=x;}
static void sccb(void *p,bool x){model *m=p;if(x){assert(m->reset && m->t>=m->reset_at+20000 && m->t>=m->clock_at+1000);}m->sccb=x;}
static bool idle(void *p){return !((model*)p)->busy;}
static bool af_off(void *p){return !((model*)p)->af_powered;}
static void pwdn(void *p,bool x){model *m=p;if(!x){assert(m->dvp && m->t>=m->stable[2]+5000);m->pwdn_at=m->t;}m->pwdn=x;}
static void reset(void *p,bool x){model *m=p;if(x){assert(!m->pwdn && m->t>=m->pwdn_at+1000);m->reset_at=m->t;}m->reset=x;}
static void clock_en(void *p,bool x){model *m=p;if(x)m->clock_at=m->t;m->clock=x;}
static void delay(void *p,uint32_t us){((model*)p)->t+=us;}
static sg_cam_ops ops(model *m){return (sg_cam_ops){m,en,range,below,dvp,sccb,idle,af_off,pwdn,reset,clock_en,delay};}
int main(void){
 model m={.fail_rail=-1};sg_cam_ops o=ops(&m);
 sg_cam_ops missing={0};assert(!sg_ov5640_power_on(&missing));
 assert(!sg_ov5640_power_on(NULL));assert(sg_ov5640_power_on(&o));assert(m.sccb);
 assert(sg_ov5640_power_off(&o));assert(!m.rails[0]&&!m.rails[1]&&!m.rails[2]&&!m.dvp&&!m.sccb&&m.pwdn&&!m.reset&&!m.clock);
 for(int fail=0;fail<3;++fail){memset(&m,0,sizeof m);m.fail_rail=fail;o=ops(&m);assert(!sg_ov5640_power_on(&o));assert(!m.dvp&&!m.sccb&&m.pwdn&&!m.reset&&!m.clock);assert(!m.rails[0]&&!m.rails[1]&&!m.rails[2]);}
 memset(&m,0,sizeof m);m.fail_rail=-1;m.busy=true;o=ops(&m);assert(!sg_ov5640_power_on(&o));assert(!m.sccb&&!m.dvp);
 memset(&m,0,sizeof m);m.fail_rail=-1;m.stuck=true;o=ops(&m);assert(!sg_ov5640_power_on(&o));assert(m.on_order==0&&!m.dvp&&!m.sccb);
 memset(&m,0,sizeof m);m.fail_rail=-1;m.af_powered=true;o=ops(&m);assert(!sg_ov5640_power_on(&o));assert(m.on_order==0&&!m.dvp&&!m.sccb);
 puts("PASS: sequence timing/order, each rail-rise timeout, busy SCCB and discharge failure; host simulation only");
}
