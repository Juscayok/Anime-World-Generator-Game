const assert=require('node:assert/strict'),G=require('./game.js'),P=require('./portrait.js'),E=require('./dialogue-expansion.js'),art=require('./identity-art.js');
const seeded=()=>{let n=14587;return()=>((n=Math.imul(n,1664525)+1013904223>>>0)/4294967296)};
for(const world of Object.keys(G.worlds)){
 const manual=G.fresh(world),simulated=JSON.parse(JSON.stringify(manual)),a=seeded(),b=seeded();
 while(!manual.finished){const s=G.current(manual);manual.pending={...s.options[G.weighted(s.options,a())]};manual.reaction=G.reaction(manual,s,manual.pending,a);G.commit(manual);}
 while(!simulated.finished)G.simulateChapter(simulated,b);
 assert.deepEqual(simulated.results,manual.results,world+' simulation must match the exact manual roll/commit sequence');
 assert.deepEqual(simulated.queue,manual.queue);assert.equal(simulated.index,manual.index);
}
let runs=0;
for(const world of Object.keys(G.worlds))for(const random of [()=>0,()=>.999999,Math.random])for(let n=0;n<8;n++){
 const run=G.fresh(world),rerolls=run.rerolls;
 if(n%2){const s=G.current(run);run.pending={...s.options[0]};run.reaction=G.reaction(run,s,run.pending,random);}
 let count=0;
 while(!run.finished){
  const chapter=G.current(run).chapter,pending=run.pending?.label,index=run.results.length;
  const report=G.simulateChapter(run,random);assert.equal(report.chapter,chapter);assert(report.results.length>0);
  assert(report.results.every(r=>r.chapter===chapter&&r.reaction.text));
  assert.equal(run.results.length,index+report.results.length);assert.equal(run.pending,null);assert.equal(run.rerolls,rerolls);
  if(pending){assert.equal(report.results[0].label,pending);assert(report.results[0].kept);}
  if(!run.finished)assert.equal(G.current(run).chapter,chapter+1);
  assert(++count<=6);assert(run.simulationPaused);
 }
 assert.equal(new Set(run.results.filter(r=>/^ability\d/.test(r.id)).map(r=>r.label)).size,Number(run.results.find(r=>r.id==='count').label));
 assert(run.results.some(r=>r.id==='exactAge'));assert(run.results.some(r=>r.id==='win'));runs++;
}
for(const [world,w] of Object.entries(G.worlds))for(const power of w.powers){assert(E.optionDetails[power],power+' needs specific technique dialogue');for(const name of G.reactionPairs[world]){const lines=E.contextualCandidates(G.fresh(world),{id:'ability1',label:w.ability},{label:power,score:3},name,'neutral');assert(lines.length>=8);assert(lines.every(x=>!/[{}]/.test(x)));}}
for(const [identity,entry] of Object.entries(art))for(const gender of ['male','female']){
 const worlds={majin:'dragonball',exceed:'fairytail',namekian:'dragonball',frost:'dragonball',fishman:'onepiece',mink:'onepiece',lunarian:'onepiece',spirit:'jjk',chimera:'hxh',arrancar:'bleach',saiyan:'dragonball',android:'dragonball',giant:'onepiece',visored:'bleach'};
 const origins={majin:'Majin',exceed:'Exceed',namekian:'Namekian',frost:'Frost demon',fishman:'Fish-man',mink:'Mink',lunarian:'Lunarian',spirit:'Cursed spirit',chimera:'Chimera Ant',arrancar:'Arrancar',saiyan:'Saiyan',android:'Android',giant:'Giant',visored:'Visored'};
 const run=G.fresh(worlds[identity]||'aot',gender);run.pending={label:origins[identity]||'Scout recruit',score:3};
 assert.equal(P.model(run,0,true).identity,origins[identity]?identity:undefined);
 G.commit(run);if(!worlds[identity])run.results.push({id:'extra1',name:'Titan form',label:identity});
 for(let pose=0;pose<6;pose++){const m=P.model(run,pose);assert.equal(m.identity,identity);assert.equal(m.sheet,entry.sheet);assert(m.rect[2]>20&&m.rect[3]>35);assert(m.relativeHeight>.15&&m.relativeHeight<2);assert.equal(P.model(JSON.parse(JSON.stringify(run)),pose).identity,identity);}
}
const {setup}=require('./test-mobile.cjs');
for(const mobile of [true,false]){
 const t=setup(mobile);t.run("state=G.fresh('fairytail','female');state.pending={...G.current(state).options.find(x=>x.label==='Exceed')};state.reaction=G.reaction(state,G.current(state),state.pending);prefs.autoSpin='on';render()");
 t.get('simulateStep').click();assert.equal(t.run('G.current(state).chapter'),1);assert.equal(t.run('state.results[0].label'),'Exceed');assert(t.get('dialog').open);assert(t.get('dialogBody').children.some(x=>x.className==='simulation-results'));
 t.get('closeDialog').click();assert.equal(t.run('state.pending'),null,'Auto-spin must pause at chapter boundary');
 assert.match(t.get('buildPortrait').className,/identity-exceed/);
 t.get('spin').click();assert(t.run('state.pending'),'Manual spinning resumes');
 for(let chapter=1;chapter<6;chapter++){t.get('simulateStep').click();t.get('closeDialog').click();}
 assert(t.run('state.finished'));assert(t.get('simulateStep').disabled);assert.equal(t.run('archive.length'),1);
 t.get('spin').click();const scene=t.get('dialogBody').children[0];assert(scene.children.some(x=>x.className==='battle-backdrop'));const player=scene.children.find(x=>x.className.includes('battle-player'));assert.match(player.children[0].className,/identity-exceed/);
}
console.log(`${runs} simulated runs: chapter boundaries, pending preservation, same odds/branches, no reroll cost, 23 identities, all signature techniques, save restoration, desktop/mobile controls, auto-spin pause, archive and battle rendering passed.`);
