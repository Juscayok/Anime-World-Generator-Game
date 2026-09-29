const assert=require('node:assert/strict');const G=require('./game.js');
let runs=0,min=100,max=0;
for(const world of Object.keys(G.worlds))for(let n=0;n<200;n++){
 const s=G.fresh(world);let spins=0;
 while(!s.finished){const step=G.current(s);assert(step&&step.options.length);assert(++spins<100);if(step.requires){const prereq=s.results.find(x=>x.name===step.requires);assert(prereq&&!['None','No'].includes(prereq.label));}const i=G.weighted(step.options);s.pending={...step.options[i]};assert(G.reaction(s,step,s.pending).text);G.commit(s);}
 const count=Number(s.results.find(x=>x.id==='count').label);const powers=s.results.filter(x=>x.id.startsWith('ability'));assert.equal(powers.length,count);assert.equal(new Set(powers.map(x=>x.label)).size,count);assert.equal(s.results.filter(x=>x.id.startsWith('mastery')).length,count);assert(['VICTORY','DEFEAT'].includes(s.results.at(-1).label));assert(G.chance(s)>=5&&G.chance(s)<=95);assert.deepEqual(JSON.parse(JSON.stringify(s)),s);min=Math.min(min,spins);max=Math.max(max,spins);runs++;
}
assert.equal(G.weighted([{weight:1},{weight:3}],0),0);assert.equal(G.weighted([{weight:1},{weight:3}],.25),1);assert.equal(G.weighted([{weight:1},{weight:3}],.999),1);
console.log(`${runs} full runs passed across five anime; ${min}–${max} spins. Branch prerequisites, unique techniques, per-technique mastery, reactions, battle odds and save serialization passed.`);
