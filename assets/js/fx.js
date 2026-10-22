// Motion engine: levels, universe backdrop, orbit physics sandbox, reveal, tilt + magnetic springs. Initialised once; re-bound per render.
window.FX=(()=>{"use strict";const D=document,H=D.documentElement,mq=matchMedia("(prefers-reduced-motion: reduce)");
const get=()=>{try{return localStorage.getItem("scope-motion")}catch(e){return null}};
const level=()=>get()||(mq.matches?"reduced":((navigator.hardwareConcurrency||4)<4||innerWidth<760||(navigator.connection&&navigator.connection.saveData))?"balanced":"full");
let started=false,offOrbit=null,io=null,api={R:"",bodies:[]};
function backdrop(){const L=level(),cv=D.createElement("canvas");cv.id="cosmos";cv.setAttribute("aria-hidden","true");D.body.prepend(cv);const x=cv.getContext("2d");
let W=0,V=0,py=0,mx=0,my=0,sh=null,next=3000,fr=0,raf=0;const st=Array.from({length:L==="full"?200:80},()=>({x:Math.random(),y:Math.random(),z:Math.random()*.9+.1,p:Math.random()*6.3}));
const neb=[[.2,.3,"22,184,166",.15,4e-4],[.8,.2,"23,105,194",.24,3e-4],[.55,.9,"23,105,194",.16,5e-4]];
function draw(t){x.fillStyle="#071525";x.fillRect(0,0,W,V);neb.forEach((n,i)=>{const cx=(n[0]+Math.sin(t*n[4]+i)*.08)*W,cy=(n[1]+Math.cos(t*n[4]*1.3+i)*.06)*V-py*.05*(i+1),r=Math.max(W,V)*.5,g=x.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,`rgba(${n[2]},${n[3]})`);g.addColorStop(1,`rgba(${n[2]},0)`);x.fillStyle=g;x.fillRect(0,0,W,V)});
for(const a of st){const X=((a.x*W-mx*30*a.z)%W+W)%W,Y=((a.y*V-py*.25*a.z-my*30*a.z)%V+V)%V;x.globalAlpha=(.55+.45*Math.sin(t*.002*a.z+a.p))*(.3+.7*a.z);x.fillStyle=a.z>.8?"#9ff3e6":"#EAF1F7";x.fillRect(X,Y,a.z*2,a.z*2)}x.globalAlpha=1;
if(L==="full"){if(!sh&&t>next){sh={x:Math.random()*W*.7,y:Math.random()*V*.4,t0:t};next=t+7000+Math.random()*6000}if(sh){const p=(t-sh.t0)/800;if(p>1)sh=null;else{const hx=sh.x+p*420,hy=sh.y+p*230,g=x.createLinearGradient(hx,hy,hx-110,hy-60);g.addColorStop(0,"#fff");g.addColorStop(1,"#fff0");x.strokeStyle=g;x.lineWidth=2;x.beginPath();x.moveTo(hx,hy);x.lineTo(hx-110,hy-60);x.stroke()}}}}
const size=()=>{W=cv.width=innerWidth;V=cv.height=innerHeight;draw(0)},loop=t=>{if(D.hidden)return;if(L!=="balanced"||(fr++&1))draw(t);raf=requestAnimationFrame(loop)};
addEventListener("resize",size);addEventListener("scroll",()=>{py=scrollY},{passive:true});if(L==="full")addEventListener("pointermove",e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5},{passive:true});
size();if(L!=="reduced"){raf=requestAnimationFrame(loop);D.addEventListener("visibilitychange",()=>{cancelAnimationFrame(raf);if(!D.hidden)raf=requestAnimationFrame(loop)})}}
function orbit(tt){
 if(offOrbit){offOrbit();offOrbit=null} api.bodies=[];
 const cv=D.getElementById("orbit"); if(!cv)return;
 const L=level(),x=cv.getContext("2d"),dpr=Math.min(devicePixelRatio,2);
 const orbitalData=[
  {a:.387,e:.2056,P:.2408,d:.383,color:"#aaa49b",arg:.3},
  {a:.723,e:.0068,P:.6152,d:.949,color:"#e5ae72",arg:1.7},
  {a:1,e:.0167,P:1,d:1,color:"#4287df",arg:2.5},
  {a:1.524,e:.0934,P:1.8808,d:.532,color:"#d66c4c",arg:4.4},
  {a:5.203,e:.0489,P:11.862,d:11.21,color:"#d6a875",arg:1.3},
  {a:9.537,e:.0565,P:29.457,d:9.45,color:"#e7d19a",arg:3.5,ring:true}
 ];
 const courses=SCOPE.courses.slice(0,orbitalData.length),B=courses.map((c,i)=>({...orbitalData[i],name:c[H.lang==="bn"?"bn":"en"][0],slug:c.slug,cat:c.cat,M:i/courses.length*6.283,rad:Math.max(3,Math.min(10,3.3*Math.pow(orbitalData[i].d,.45)))}));
 api.bodies=B; let W=0,Hh=0,raf=0,vis=true,last=0;
 const orbitPoint=(b,E)=>{const sa=b.screenA,xx=sa*(Math.cos(E)-b.e),yy=sa*Math.sqrt(1-b.e*b.e)*Math.sin(E),c=Math.cos(b.arg),s=Math.sin(b.arg);return [W/2+(xx*c-yy*s),Hh/2+(xx*s+yy*c)]};
 function eccentricAnomaly(M,e){let E=M;for(let i=0;i<5;i++)E-=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));return E}
 function resize(){W=cv.clientWidth;Hh=cv.clientHeight;cv.width=Math.round(W*dpr);cv.height=Math.round(Hh*dpr);x.setTransform(dpr,0,0,dpr,0,0);B.forEach(b=>b.screenA=Math.min(W,Hh)*.45*Math.log1p(b.a/.387)/Math.log1p(30.07/.387));draw()}
 function draw(){x.clearRect(0,0,W,Hh);const cx=W/2,cy=Hh/2;
  x.fillStyle="#EAF1F7";for(let i=0;i<55;i++){const sx=(i*97%997)/997*W,sy=(i*193%991)/991*Hh;x.globalAlpha=.18+(i%4)*.09;x.fillRect(sx,sy,1.2,1.2)}x.globalAlpha=1;
  for(const b of B){x.beginPath();for(let i=0;i<=180;i++){const E=i/180*6.283,[px,py]=orbitPoint(b,E);i?x.lineTo(px,py):x.moveTo(px,py)}x.closePath();x.strokeStyle="#ffffff30";x.lineWidth=1;x.stroke()}
  const glow=x.createRadialGradient(cx,cy,2,cx,cy,42);glow.addColorStop(0,"#fff5b2");glow.addColorStop(.18,"#ffd34e");glow.addColorStop(.48,"#ff9c22aa");glow.addColorStop(1,"#ff9c2200");x.fillStyle=glow;x.beginPath();x.arc(cx,cy,42,0,6.283);x.fill();x.fillStyle="#ffe078";x.beginPath();x.arc(cx,cy,12,0,6.283);x.fill();x.font="700 10px Sora,sans-serif";x.textAlign="center";x.lineWidth=3;x.strokeStyle="#071525";x.strokeText("SCOPE",cx,cy+28);x.fillStyle="#fff";x.fillText("SCOPE",cx,cy+28);
  for(const b of B){const [px,py]=orbitPoint(b,eccentricAnomaly(b.M,b.e));b.x=px;b.y=py;
   if(b.ring){x.save();x.translate(px,py);x.rotate(-.25);x.strokeStyle="#e8d5a9bb";x.lineWidth=3;x.beginPath();x.ellipse(0,0,b.rad*1.75,b.rad*.6,0,0,6.283);x.stroke();x.restore()}
   const g=x.createRadialGradient(px-b.rad*.35,py-b.rad*.35,1,px,py,b.rad);g.addColorStop(0,"#ffffff");g.addColorStop(.2,b.color);g.addColorStop(1,"#19253a");x.fillStyle=g;x.beginPath();x.arc(px,py,b.rad,0,6.283);x.fill();x.strokeStyle="#ffffffaa";x.lineWidth=.8;x.stroke();
   x.font="600 9px 'Noto Sans Bengali',Sora,sans-serif";x.textAlign="center";x.lineWidth=3;x.strokeStyle="#071525";const maxLabel=Math.min(190,W*.38),words=b.name.split(/\s+/),lines=[];let line="";for(const word of words){const next=line?line+" "+word:word;if(x.measureText(next).width>maxLabel&&line){lines.push(line);line=word}else line=next}if(line)lines.push(line);let labelY=py+b.rad+11;if(labelY+lines.length*11>Hh-5)labelY=py-b.rad-5-lines.length*11;lines.forEach((part,j)=>{const yy=labelY+j*11;x.strokeText(part,px,yy);x.fillStyle="#fff";x.fillText(part,px,yy)})
  }
 }
 function loop(t){cancelAnimationFrame(raf);if(!vis||D.hidden)return;const dt=Math.min(.05,(t-last)/1000||.016);last=t;
  // Kepler's third law: each body's mean anomaly advances using its real orbital period.
  B.forEach(b=>b.M=(b.M+dt*6.283/(b.P*30))%6.283);draw();raf=requestAnimationFrame(loop)}
 const hit=e=>{const r=cv.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;return B.find(b=>Math.hypot(b.x-mx,b.y-my)<b.rad+8)};
 const click=e=>{const b=hit(e);if(b)location.href=api.R+"courses/"+encodeURIComponent(b.slug)+"/index.html"};
 cv.addEventListener("click",click);const ro=new ResizeObserver(resize);ro.observe(cv);
 const io2=new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis&&L!=="reduced")raf=requestAnimationFrame(loop)});io2.observe(cv);
 const vc=()=>{if(!D.hidden&&vis&&L!=="reduced")raf=requestAnimationFrame(loop)};D.addEventListener("visibilitychange",vc);
 resize();if(L!=="reduced")raf=requestAnimationFrame(loop);
 offOrbit=()=>{cancelAnimationFrame(raf);ro.disconnect();io2.disconnect();D.removeEventListener("visibilitychange",vc);cv.removeEventListener("click",click)}
}
function reveal(){if(io)io.disconnect();const els=D.querySelectorAll(".rv:not(.in)");if(!("IntersectionObserver"in window)||level()==="reduced"){els.forEach(e=>e.classList.add("in"));return}
io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.08});els.forEach(e=>io.observe(e))}
const sp=new WeakMap();function pull(el,tx,ty){let s=sp.get(el);if(!s)sp.set(el,s={x:0,y:0,vx:0,vy:0,on:false});s.tx=tx;s.ty=ty;if(s.on)return;s.on=true;(function f(){s.vx=(s.vx+(s.tx-s.x)*.18)*.72;s.vy=(s.vy+(s.ty-s.y)*.18)*.72;s.x+=s.vx;s.y+=s.vy;el.style.translate=`${s.x}px ${s.y}px`;if(Math.abs(s.vx)+Math.abs(s.vy)+Math.abs(s.tx-s.x)+Math.abs(s.ty-s.y)>.05)requestAnimationFrame(f);else{s.on=false;if(!s.tx&&!s.ty)el.style.translate=""}})()}
function pointerFx(){let cur=null;D.addEventListener("pointermove",e=>{if(level()!=="full"||e.pointerType!=="mouse")return;const b=e.target.closest&&e.target.closest(".btn");if(cur&&cur!==b)pull(cur,0,0);cur=b;if(b){const r=b.getBoundingClientRect();pull(b,(e.clientX-r.left-r.width/2)*.2,(e.clientY-r.top-r.height/2)*.28)}
const c=e.target.closest&&e.target.closest(".card");D.querySelectorAll(".card.tilt").forEach(k=>{if(k!==c){k.classList.remove("tilt");k.style.transform=""}});if(c){const r=c.getBoundingClientRect();c.classList.add("tilt");c.style.transform=`perspective(800px) rotateY(${((e.clientX-r.left)/r.width-.5)*8}deg) rotateX(${-((e.clientY-r.top)/r.height-.5)*8}deg) translateY(-4px)`}},{passive:true})}
Object.assign(api,{level,init(tt,R){H.dataset.motion=level();api.R=R;if(!started){started=true;backdrop();pointerFx()}reveal();orbit(tt)},cycle(){const o=["full","balanced","reduced"];try{localStorage.setItem("scope-motion",o[(o.indexOf(level())+1)%3])}catch(e){}location.reload()}});return api})();
