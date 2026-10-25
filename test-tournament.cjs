const assert=require('node:assert/strict'),G=require('./game.js'),P=require('./portrait.js'),B=require('./battle.js'),R=require('./rival-dialogue.js'),V=require('./reaction-variety.js');
const seeded=seed=>()=>((seed=Math.imul(seed,1664525)+1013904223>>>0)/4294967296);
assert.equal(Object.keys(G.worlds).length,11);assert(G.worlds.cowboy&&G.worlds.opm&&G.worlds.tournament);
for(let n=1;n<=100;n++){
 const s=G.fresh('tournament','female',seeded(n)),t=s.tournament;assert.equal(t.initial.length,8);assert.equal(new Set(t.initial.map(x=>x.id)).size,8);assert.equal(new Set(t.initial.slice(1).map(x=>x.world)).size,7);
 while(G.current(s).chapter<5){const step=G.current(s);if(step.mixed){const totals={};for(const x of step.options)totals[x.world]=(totals[x.world]||0)+x.weight;assert.equal(Object.keys(totals).length,11);for(const total of Object.values(totals))assert(Math.abs(total-100)<1e-7);}
  s.pending={...step.options[G.weighted(step.options,seeded(n+s.index)())]};s.reaction=G.reaction(s,step,s.pending,()=>.5);G.commit(s);
 }
 const serialized=JSON.parse(JSON.stringify(s));assert.deepEqual(serialized.tournament,s.tournament);assert.equal(P.model(serialized).sheet,P.model(s).sheet);
 for(let round=0;round<3&&!s.finished;round++){
  s.rerolls=1;const startRound=t.round,opponent=G.tournament.rival(s);assert(s.queue[s.index].fixed);
  while(!s.finished&&t.round===startRound){const step=G.current(s),outcome=n%4===0&&round===1?'DEFEAT':'VICTORY';s.pending={...step.options.find(x=>x.label===outcome)||step.options[0]};s.reaction=G.reaction(s,step,s.pending,()=>.5);assert.equal(s.reaction.speaker,opponent.name);assert(!/[{}]/.test(s.reaction.text));assert(s.reaction.artWorld);if(step.id==='win'&&s.reaction.portraitExpression!==undefined)assert.equal(s.reaction.portraitExpression,outcome==='VICTORY'?0:3);G.commit(s);}
  assert(t.round>startRound);assert.equal(s.rerolls,1,'Round progression never regenerates rerolls');if(!s.finished)assert.equal(s.queue[s.index].id,'enemy');
 }
 assert(s.finished);assert.equal(t.rounds.length,3);assert.equal(t.rounds.reduce((n,r)=>n+r.matches.length,0),7);assert.equal(t.champion.id==='player',n%4!==0);assert.equal(G.playerWon(s),n%4!==0);assert.deepEqual(B.describe(JSON.parse(JSON.stringify(s))),B.describe(s));assert(B.describe(s).tile!==null);
}
const mixed=G.fresh('tournament');mixed.pending={...G.current(mixed).options.find(x=>x.label==='Exceed')};assert.equal(P.model(mixed,0,true).identity,'exceed');G.commit(mixed);mixed.results.push({id:'ability1',label:'Kamehameha',world:'dragonball'});assert.equal(P.model(mixed).identity,'exceed');assert.equal(G.tournament.sourceWorld(mixed),'fairytail');
for(const [world,names] of Object.entries(G.tournament.representatives))for(const name of names){assert(R.voices[name]);assert(B.roster[world].includes(name));const s=G.fresh('tournament');s.tournament.active[1]={id:'test-rival',name,world};s.results.push({id:'origin',label:'Majin',world:'dragonball'},{id:'ability1',label:'Requip Armor',world:'fairytail'});const lines=[];for(let i=0;i<4;i++)lines.push(G.reaction(s,{id:'mastery1',label:'Mastery'},{label:'Beginner',score:1},()=>.5).text);assert(lines.every(x=>x.includes('Requip Armor')||x.includes('Beginner')));assert.notEqual(lines[0],lines[1]);}
for(const world of ['cowboy','opm']){const s=G.fresh(world);for(let turn=0;turn<4;turn++){s.reactionCount=turn;const r=G.reaction(s,{id:'strength',label:'Strength'},{label:'High',score:4},()=>.5);assert(V.portraitStyle(r.portraitIndex).backgroundImage.includes('new-reactions'));}}
const {setup}=require('./test-mobile.cjs');
for(const mobile of [false,true]){
 const t=setup(mobile);t.get('tournamentTab').click();if(t.get('dialog').open)t.get('dialogBody').children.at(-1).click();assert.equal(t.run('state.world'),'tournament');assert(t.run('state.tournament.initial.length===8'));assert(t.get('viewBracket').hidden===false);
 t.get('viewBracket').click();assert.equal(t.get('dialogTitle').textContent,'Tournament bracket');t.get('closeDialog').click();
 for(let chapter=0;chapter<5;chapter++){t.get('simulateStep').click();t.get('closeDialog').click();}
 assert.equal(t.run('G.current(state).chapter'),5);assert.equal(t.run('state.tournament.round'),0);t.get('simulateStep').click();assert(t.get('dialogTitle').textContent.includes('Quarterfinal'));assert(t.run('state.finished||state.tournament.round===1'));t.get('closeDialog').click();assert.equal(t.run('state.pending'),null);
}
console.log('Tournament: 100 seeded brackets, all 11 source pools, equal world odds, mixed identity artwork, 22 rival personalities, repeat avoidance, three-round progression, loss elimination, saved replay and mobile/desktop flow passed.');
