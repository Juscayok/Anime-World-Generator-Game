// Inspect generated PNG alpha components without editing the image pixels.
const fs=require('node:fs'),zlib=require('node:zlib'),assert=require('node:assert/strict');
function readPNG(path){
 const b=fs.readFileSync(path),parts=[];let width,height,channels;
 for(let off=8;off<b.length;){const n=b.readUInt32BE(off),type=b.toString('ascii',off+4,off+8),data=b.subarray(off+8,off+8+n);off+=n+12;
  if(type==='IHDR'){width=data.readUInt32BE(0);height=data.readUInt32BE(4);assert.equal(data[8],8);assert.equal(data[9],6,'Expected RGBA PNG');assert.equal(data[12],0);channels=4;}else if(type==='IDAT')parts.push(data);
 }
 const raw=zlib.inflateSync(Buffer.concat(parts)),stride=width*channels,pixels=Buffer.alloc(height*stride);
 const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
 for(let y=0;y<height;y++){const f=raw[y*(stride+1)];for(let i=0;i<stride;i++){const at=y*stride+i,a=i>=channels?pixels[at-channels]:0,up=y?pixels[at-stride]:0,corner=y&&i>=channels?pixels[at-stride-channels]:0;pixels[at]=(raw[y*(stride+1)+1+i]+(f===0?0:f===1?a:f===2?up:f===3?Math.floor((a+up)/2):paeth(a,up,corner)))&255;}}
 return {width,height,pixels};
}
const worlds=process.argv.slice(2);if(!worlds.length)worlds.push('jjk','naruto','onepiece','bleach','dragonball','fairytail','mha','aot','hxh');
const data={};
for(const world of worlds){
 const {width,height,pixels}=readPNG('character-models-'+world+'.png'),count=width*height,seen=new Uint8Array(count),queue=new Int32Array(count),components=[];let detached=0,detachedPixels=0;
 for(let at=0;at<count;at++){
  if(seen[at]||pixels[at*4+3]<128)continue;
  let read=0,write=1,minX=width,minY=height,maxX=0,maxY=0;queue[0]=at;seen[at]=1;
  while(read<write){const p=queue[read++],x=p%width,y=Math.floor(p/width);minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);
   for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;if(nx<0||nx>=width||ny<0||ny>=height)continue;const np=ny*width+nx;if(!seen[np]&&pixels[np*4+3]>=128){seen[np]=1;queue[write++]=np;}}
  }
  if(write<=1500){detached++;detachedPixels+=write;}
  if(write>150)components.push({x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1,area:write,members:write>1500?Int32Array.from(queue.subarray(0,write)):null});
 }
 const large=components.filter(c=>c.area>1500),frames=Array(24).fill(null),masks=Array(24).fill(null);
 for(const c of large){
  const col=Math.max(0,Math.min(5,Math.round((c.x+c.w/2)/(width/6)-.5))),row=Math.max(0,Math.min(3,Math.round((c.y+c.h)/(height/4))-1)),tile=row*6+col;
  assert(!frames[tile],world+' overlapping components in cell '+tile);
  const x=Math.max(0,c.x-2),y=Math.max(0,c.y-2),r=Math.min(width,c.x+c.w+2),bottom=Math.min(height,c.y+c.h+2);frames[tile]=[x,y,r-x,bottom-y];
  // A native vector display mask isolates this connected figure without editing
  // the source PNG. Retain one pixel of original antialiasing around its edge.
  const mw=r-x,mh=bottom-y,mask=new Uint8Array(mw*mh);
  for(const p of c.members){const sx=p%width,sy=Math.floor(p/width);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=sx+dx,ny=sy+dy;if(nx>=x&&nx<r&&ny>=y&&ny<bottom&&pixels[(ny*width+nx)*4+3]>0)mask[(ny-y)*mw+nx-x]=1;}}
  let path='';for(let yy=0;yy<mh;yy++){let xx=0;while(xx<mw){if(!mask[yy*mw+xx]){xx++;continue;}const from=xx;while(xx<mw&&mask[yy*mw+xx])xx++;path+='M'+from+' '+yy+'h'+(xx-from)+'v1h-'+(xx-from)+'z';}}
  masks[tile]='url("data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+mw+' '+mh+'"><path fill="white" d="'+path+'"/></svg>')+'")';
 }
 assert(frames.every(Boolean),world+' missing whole body sprites');
 assert.equal(pixels[3],0,'Atlas must be transparent');
 data[world]={width,height,frames,masks};console.log(world+': isolated 24 whole-body silhouettes; masked '+detached+' detached fragments ('+detachedPixels+' pixels)');
}
const old=fs.existsSync('character-bounds.json')?JSON.parse(fs.readFileSync('character-bounds.json','utf8')):{};Object.assign(old,data);fs.writeFileSync('character-bounds.json',JSON.stringify(old));
fs.writeFileSync('character-art.js',"(function(root){'use strict';const data="+JSON.stringify(old)+";root.AWGCharacterArt=data;if(typeof module!=='undefined')module.exports=data;})(typeof window!=='undefined'?window:globalThis);\n");
