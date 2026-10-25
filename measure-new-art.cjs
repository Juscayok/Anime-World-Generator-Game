const fs=require('node:fs'),assert=require('node:assert/strict');
const readPNG=new Function('require',fs.readFileSync(__dirname+'/measure-character-art.cjs','utf8').split('const worlds=')[0]+'return readPNG;')(require);
function measure(file,columns,rows,enemy=false,rowLimits=null){
 const {width,height,pixels}=readPNG(__dirname+'/'+file),seen=new Uint8Array(width*height),figures=Array(columns*rows).fill(null);
 assert.equal(pixels[3],0,file+' must be transparent');
 for(let at=0;at<width*height;at++){
  if(seen[at]||pixels[at*4+3]<160)continue;
  const q=[at],occupancy=Array(figures.length).fill(0);seen[at]=1;
  for(let i=0;i<q.length;i++){const p=q[i],x=p%width,y=Math.floor(p/width),col=Math.min(columns-1,Math.floor(x*columns/width)),row=rowLimits?rowLimits.findIndex((v,j)=>j<rows&&y>=v*height/1536&&y<rowLimits[j+1]*height/1536):Math.min(rows-1,Math.floor(y*rows/height));occupancy[row*columns+col]++;for(const [dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy;if(xx<0||xx>=width||yy<0||yy>=height)continue;const n=yy*width+xx;if(!seen[n]&&pixels[n*4+3]>=160){seen[n]=1;q.push(n);}}}
  const tile=occupancy.indexOf(Math.max(...occupancy));if(q.length>(figures[tile]?.length||0))figures[tile]=q;
 }
 const frames=Array(24).fill(null),masks=Array(24).fill(null);
 for(let raw=0;raw<figures.length;raw++){
  const tile=enemy&&columns===10?(raw<10?raw:raw+2):raw;
  if(enemy&&[10,11,22,23].includes(tile))continue;
  const q=figures[raw]||[];assert(q.length>400,file+' missing sprite '+tile);
  let l=width,t=height,r=0,b=0;for(const p of q){l=Math.min(l,p%width);r=Math.max(r,p%width);t=Math.min(t,Math.floor(p/width));b=Math.max(b,Math.floor(p/width));}
  l=Math.max(0,l-2);t=Math.max(0,t-2);r=Math.min(width-1,r+2);b=Math.min(height-1,b+2);const w=r-l+1,h=b-t+1,mask=new Uint8Array(w*h);
  for(const p of q){const x=p%width,y=Math.floor(p/width);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const xx=x+dx,yy=y+dy;if(xx>=l&&xx<=r&&yy>=t&&yy<=b&&pixels[(yy*width+xx)*4+3])mask[(yy-t)*w+xx-l]=1;}}
  let path='';for(let y=0;y<h;y++){let x=0;while(x<w){if(!mask[y*w+x]){x++;continue;}const from=x;while(x<w&&mask[y*w+x])x++;path+='M'+from+' '+y+'h'+(x-from)+'v1h-'+(x-from)+'z';}}
  frames[tile]=[l,t,w,h];masks[tile]='url("data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+w+' '+h+'"><path fill="white" d="'+path+'"/></svg>')+'")';
 }
 console.log(file+': '+frames.filter(Boolean).length+' complete silhouettes');return {width,height,frames,masks};
}
const data={players:{cowboy:measure('character-models-cowboy.png',6,4),opm:measure('character-models-opm.png',6,4)},enemies:{cowboy:measure('battle-enemies-cowboy.png',4,6,true,[0,330,640,930,1140,1340,1536]),opm:measure('battle-enemies-opm.png',6,4,true)}};
fs.writeFileSync(__dirname+'/new-art.js',"(function(root){const data="+JSON.stringify(data)+";root.AWGNewArt=data;if(typeof module!=='undefined')module.exports=data;})(typeof window!=='undefined'?window:globalThis);\n");
