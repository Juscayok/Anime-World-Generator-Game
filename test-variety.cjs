const assert=require('node:assert/strict'),G=require('./game.js'),B=require('./battle.js'),P=require('./portrait.js'),V=require('./reaction-variety.js');
const {setup}=require('./test-mobile.cjs');
let opponents=0;
for(const [world,w] of Object.entries(G.worlds)){
 assert.equal(G.reactionPairs[world].length,4);
 const before=G.fresh(world),speakers=[];
 for(let i=0;i<12;i++){const r=G.reaction(before,{id:'strength',label:'Strength'},{label:'High',score:4},()=>.5);assert(!r.enemySpeaker);speakers.push(r.speaker);}
 assert.deepEqual([...new Set(speakers)],G.reactionPairs[world]);
 for(const name of V.additions[world]){assert(V.voices[name]);assert(V.portraits.includes(name));}
 for(const enemy of w.enemies){
  const s=G.fresh(world),pick={id:'enemy',neutral:true};
  const revealed=G.reaction(s,pick,{label:enemy,score:5},()=>.5);
  assert.equal(revealed.speaker,enemy);assert(revealed.enemySpeaker);assert.equal(revealed.enemyIndex,B.roster[world].indexOf(enemy));
  // Rerolling a pending opponent must not retain the previous enemy.
  const other=w.enemies.find(n=>n!==enemy);assert.equal(G.reaction(s,pick,{label:other,score:3},()=>.5).speaker,other);
  s.results.push({id:'enemy',label:enemy});
  const condition={id:'enemyLevel',neutral:true};s.reactionCount=2;
  const boosted=G.reaction(s,condition,{label:'Prime',score:7},()=>.5);assert.equal(boosted.speaker,enemy);assert.equal(boosted.benefit,'bad');assert(boosted.text.length>30);
  const weak=G.reaction({...s,reactionCount:2},condition,{label:'Weakened',score:2},()=>.5);assert.equal(weak.benefit,'good');
  for(const outcome of ['VICTORY','DEFEAT']){s.reactionCount=2;const r=G.reaction(s,{id:'win'},{label:outcome,score:outcome==='VICTORY'?7:1},()=>.5);assert.equal(r.speaker,enemy);assert.match(r.text,outcome==='VICTORY'?/lost|won|victory/:/won|mine|pressure/);}
  const restored=JSON.parse(JSON.stringify(s));restored.reactionCount=2;assert.equal(G.reaction(restored,{id:'field'},{label:'City ruins',score:3},()=>.5).speaker,enemy);
  opponents++;
 }
 const varied=G.fresh(world),lines=[];for(let n=0;n<28;n++)lines.push(G.reaction(varied,{id:'tool',label:'Weapon'},{label:'Sword',score:4},()=>.5).text);assert(new Set(lines).size>=20);
}
for(const mobile of [false,true]){
 const t=setup(mobile);t.run("state.reactionCount=2;state.reaction=G.reaction(state,{id:'strength'},{label:'High',score:4},()=>.5);render()");assert.match(t.get('reactionImage').style.backgroundImage,/reaction-cast-v2/);
 t.run("state.results.push({id:'enemy',label:'Sukuna'});state.reactionCount=2;state.pending={label:'Prime',score:7};state.reaction=G.reaction(state,{id:'enemyLevel'},state.pending,()=>.5);render();showMobileReaction()");assert.match(t.get('reactionImage').style.backgroundImage,/battle-enemies-jjk/);if(mobile)assert.equal(t.get('mobileArt').style.backgroundImage,t.get('reactionImage').style.backgroundImage);
}
const appearances=new Set();for(let n=0;n<100;n++){const s=G.fresh('jjk');s.id='appearance-'+n;const p=P.describe(s);assert.deepEqual(P.describe(JSON.parse(JSON.stringify(s))),p);appearances.add(P.model(s).row);}assert.equal(appearances.size,2);
console.log(`Variety: 36 hosts, ${opponents} selected enemies, reveal/reroll gating, condition/outcome dialogue, repeat avoidance, save stability, appearance diversity and desktop/mobile artwork passed.`);
