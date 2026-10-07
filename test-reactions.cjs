const assert=require('node:assert/strict'),G=require('./game.js');
for(const world of Object.keys(G.worlds)){
 const s=G.fresh(world);s.results.push({id:'enemy',label:G.worlds[world].enemies.at(-1),score:7,neutral:true});
 for(const label of ['Full power','Prime']){const r=G.reaction(s,{id:'enemyLevel',label:'Enemy condition',neutral:true},{label,score:7},()=>.5);assert.equal(r.benefit,'bad');assert.equal(r.tag,'ENEMY ADVANTAGE');assert([0,4].includes(r.frame));}
 assert.equal(G.reaction(s,{id:'enemyLevel',neutral:true},{label:'Weakened',score:2},()=>.5).benefit,'good');
 const varied=G.fresh(world),lines=[];for(let n=0;n<16;n++)lines.push(G.reaction(varied,{id:'strength',label:'Strength'},{label:'High',score:4},()=>.5).text);assert(new Set(lines).size>=8);for(let n=2;n<lines.length;n++)assert.notEqual(lines[n],lines[n-2]);
 const cameo=G.fresh(world);cameo.reactionCount=4;const before=G.chance(cameo);const r=G.reaction(cameo,{id:'strength',label:'Strength'},{label:'High',score:4},()=>0);assert.equal(Boolean(r.cameo),world!=='onepiece');assert.equal(G.chance(cameo),before);if(r.cameo){assert.equal(r.cameo.host,r.speaker);for(let n=0;n<7;n++)assert(!G.reaction(cameo,{id:'strength',label:'Strength'},{label:'High',score:4},()=>0).cameo);assert(G.reaction(cameo,{id:'strength',label:'Strength'},{label:'High',score:4},()=>0).cameo);}
}
const db=G.fresh('dragonball');for(let i=0;i<8;i++){const r=G.reaction(db,{id:'origin',label:'Identity'},{label:'Frost demon',score:3},()=>.5);assert.match(r.text,/Frieza/)}
const saved=JSON.parse(JSON.stringify(db));assert(saved.dialogueHistory.length>0);assert.equal(saved.reactionCount,8);
console.log('Enemy-benefit ratings, character variety, repeat avoidance, Frieza opinions, cameo eligibility/cooldown and unchanged battle odds passed.');
