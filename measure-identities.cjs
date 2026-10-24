// Read generated alpha; derive display crops and masks without editing source art.
const fs=require('node:fs'),assert=require('node:assert/strict');
const readPNG=new Function('require',fs.readFileSync(__dirname+'/measure-character-art.cjs','utf8').split('const worlds=')[0]+'return readPNG;')(require);
const sources=[
 {sheet:'identity-majin-exceed.png',columns:6,rows:[0,300,600,810,1024],types:[['majin',{rows:[0,1],poses:6}],['exceed',{rows:[2,3],poses:6}]]},
 {sheet:'identity-species.png',columns:4,types:['namekian','frost','fishman','mink']},
 {sheet:'identity-species-extra.png',columns:4,types:['lunarian','spirit','chimera','arrancar']},
 {sheet:'identity-species-more.png',columns:4,types:['saiyan','android','giant','visored']},
 {sheet:'identity-titans.png',columns:6,types:['Attack Titan','Armored Titan','Colossal Titan','Female Titan','Beast Titan','Jaw Titan','Cart Titan','War Hammer Titan','Founding Titan'],titans:true}
];
const atlases={},identities={};
for(const source of sources){
 const {width,height,pixels}=readPNG(__dirname+'/'+source.sheet);
 assert.equal(pixels[3],0,source.sheet+' needs actual transparent alpha');
 const rows=source.rows?.map(v=>Math.round(v*height/1024))||Array.from({length:(source.titans?3:4)+1},(_,i)=>Math.round(i*height/(source.titans?3:4)));
 const frames=[],masks=[],cols=source.columns,seen=new Uint8Array(width*height),figures=Array(cols*(rows.length-1)).fill(null);
 // A generated figure may cross a nominal cell boundary. Identify it globally,
 // assign it by its largest occupied cell, then retain its entire silhouette.
 for(let at=0;at<width*height;at++){
   if(seen[at]||pixels[at*4+3]<160)continue;
   const queue=[at];seen[at]=1;const occupancy=Array(figures.length).fill(0);
   for(let i=0;i<queue.length;i++){
    const p=queue[i],px=p%width,py=Math.floor(p/width);
    const col=Math.min(cols-1,Math.floor(px*cols/width)),row=rows.findIndex((v,j)=>j<rows.length-1&&py>=v&&py<rows[j+1]);occupancy[row*cols+col]++;
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
     const nx=px+dx,ny=py+dy;if(nx<0||nx>=width||ny<0||ny>=height)continue;
     const n=ny*width+nx;
     if(!seen[n]&&pixels[n*4+3]>=160){seen[n]=1;queue.push(n);}
    }
   }
   const tile=occupancy.indexOf(Math.max(...occupancy));if(queue.length>(figures[tile]?.length||0))figures[tile]=queue;
 }
 for(let row=0;row<rows.length-1;row++)for(let col=0;col<cols;col++){
  const largest=figures[row*cols+col]||[];
  assert(largest.length>500,source.sheet+' empty sprite '+row+','+col);
  let x0=width,y0=height,x1=0,y1=0;
  for(const p of largest){const x=p%width,y=Math.floor(p/width);x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
  x0=Math.max(0,x0-2);y0=Math.max(0,y0-2);x1=Math.min(width-1,x1+2);y1=Math.min(height-1,y1+2);
  const w=x1-x0+1,h=y1-y0+1,mask=new Uint8Array(w*h);
  for(const p of largest){const x=p%width,y=Math.floor(p/width);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;if(nx>=x0&&nx<=x1&&ny>=y0&&ny<=y1&&pixels[(ny*width+nx)*4+3]>0)mask[(ny-y0)*w+nx-x0]=1;}}
  let path='';for(let y=0;y<h;y++){let x=0;while(x<w){if(!mask[y*w+x]){x++;continue;}const start=x;while(x<w&&mask[y*w+x])x++;path+='M'+start+' '+y+'h'+(x-start)+'v1h-'+(x-start)+'z';}}
  frames.push([x0,y0,w,h]);masks.push('url("data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+w+' '+h+'"><path fill="white" d="'+path+'"/></svg>')+'")');
 }
 atlases[source.sheet]={width,height,columns:cols,frames,masks};
 source.types.forEach((entry,i)=>{const [key,settings]=Array.isArray(entry)?entry:[entry,source.titans?{row:Math.floor(i/3),column:i%3*2,poses:2}:{row:i,poses:4}];identities[key]={sheet:source.sheet,atlas:source.sheet,...settings};});
 console.log(source.sheet+': '+frames.length+' alpha-isolated sprites');
}
const out="(function(root){'use strict';const atlases="+JSON.stringify(atlases)+",data="+JSON.stringify(identities)+";for(const entry of Object.values(data))entry.atlas=atlases[entry.atlas];root.AWGIdentityArt=data;if(typeof module!=='undefined')module.exports=data;})(typeof window!=='undefined'?window:globalThis);\n";
fs.writeFileSync(__dirname+'/identity-art.js',out);
