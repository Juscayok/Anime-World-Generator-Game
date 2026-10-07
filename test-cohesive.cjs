const assert=require('node:assert/strict'),fs=require('node:fs'),G=require('./game.js'),P=require('./portrait.js'),A=require('./character-art.js');
const {setup}=require('./test-mobile.cjs');
let frames=0;const identities=new Set();
for(const world of Object.keys(G.worlds)){
 const atlas=A[world];assert(atlas);assert.equal(atlas.frames.length,24);assert(fs.statSync('character-models-'+world+'.png').size>1000);
 for(const [i,rect] of atlas.frames.entries()){
  const [x,y,w,h]=rect;assert(x>=0&&y>=0&&w>30&&h>80&&x+w<=atlas.width&&y+h<=atlas.height,world+' frame '+i);assert.match(atlas.masks[i],/^url\("data:image\/svg\+xml,/);frames++;
 }
 for(const gender of ['male','female'])for(let n=0;n<24;n++){
  const run=G.fresh(world,gender);run.id='cohesive-'+n;const neutral=P.model(run);
  identities.add(world+':'+neutral.row);
  for(let pose=0;pose<6;pose++){
   const m=P.model(run,pose);assert.equal(m.row,neutral.row,'Same face/outfit identity across poses');assert.equal(m.column,pose);assert.deepEqual(P.model(JSON.parse(JSON.stringify(run)),pose),m);assert(m.relativeHeight>.25&&m.relativeHeight<1.5);
  }
  run.results=[{id:'enemy',label:G.worlds[world].enemies[0]},{id:'win',label:'VICTORY'}];assert.equal(P.model(run).row,neutral.row,'Opponent and outcome cannot change character identity');
 }
}
assert.equal(identities.size,36);assert.equal(frames,216);
for(const mobile of [false,true]){
 const t=setup(mobile);
 for(const world of Object.keys(G.worlds))for(const outcome of ['VICTORY','DEFEAT']){
  t.run(`state=G.fresh('${world}','female');state.finished=true;state.results=[{id:'enemy',label:G.worlds[state.world].enemies[0]},{id:'win',label:'${outcome}'}];showCharacter(state)`);
  const scene=t.get('dialogBody').children[0],player=scene.children.find(x=>x.className.includes('battle-player'));
  assert.equal(player.children.length,1,'Player is one whole model, no assembled upper body/legs/hands');
  const body=player.children[0].children.find(x=>x.className==='character-fullbody');assert(body);assert.match(body.style.backgroundImage,new RegExp('character-models-'+world));assert.equal(body.style.aspectRatio.split('/').length,2);assert.match(body.style.maskImage,/data:image\/svg/);assert(!player.children[0].children.some(x=>x.className.includes('portrait-aura')),'No ghost-like aura behind the player');
  assert.equal(t.run('AWGPortrait.model(state).row'),t.run('AWGPortrait.model(JSON.parse(JSON.stringify(state))).row'));
 }
}
console.log('Cohesive artwork: 36 stable identities, 216 complete pose frames, nine worlds, serialized saves, opponent isolation and desktop/mobile single-model rendering passed.');
