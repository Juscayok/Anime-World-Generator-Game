const assert=require('node:assert/strict'),fs=require('node:fs'),G=require('./game.js'),V=require('./reaction-variety.js'),{setup}=require('./test-mobile.cjs');
let frames=0;
for(const world of Object.keys(G.worlds))for(let host=2;host<4;host++)for(const [score,expression] of [[1,0],[3,1],[4,2],[7,3]]){
 const s=G.fresh(world);s.reactionCount=host;
 const r=G.reaction(s,{id:'strength',label:'Strength'},{label:'Test',score},()=>.5);
 assert.equal(r.speaker,G.reactionPairs[world][host]);assert.equal(r.portraitExpression,expression);
 const style=V.portraitStyle(r.portraitIndex,r.portraitExpression);assert(style.backgroundImage.includes('reaction-expressions-'));assert.equal(style.aspectRatio,'256/256');
 const restored=JSON.parse(JSON.stringify(r));assert.deepEqual(V.portraitStyle(restored.portraitIndex,restored.portraitExpression),style);frames++;
}
for(const outcome of ['VICTORY','DEFEAT']){const s=G.fresh('fairytail');s.reactionCount=2;const r=G.reaction(s,{id:'win'},{label:outcome,score:outcome==='VICTORY'?7:1},()=>.5);assert.equal(r.portraitExpression,outcome==='VICTORY'?3:0);}
for(const a of V.expressionAtlases){const png=fs.readFileSync(a.file);assert.equal(png.readUInt32BE(16),a.width);assert.equal(png.readUInt32BE(20),a.height);assert.equal(a.columns.length,7);assert.equal(a.rows.length,5);}
for(const world of Object.keys(G.worlds).filter(w=>w!=='onepiece')){const s=G.fresh(world);s.reactionCount=4;s.lastZoroCameo=-100;const r=G.reaction(s,{id:'strength'},{label:'Low',score:1},()=>0);assert(r.cameo);assert.equal(r.cameo.guest,'Zoro');assert(!r.conversation);assert.equal(r.portraitExpression,undefined);}
for(const mobile of [false,true]){
 const t=setup(mobile);for(const [score,expression] of [[1,0],[3,1],[4,2],[7,3]]){t.run("state.reactionCount=2;state.pending={label:'Test',score:"+score+"};state.reaction=G.reaction(state,{id:'strength'},state.pending,()=>.5);render();showMobileReaction()");assert.equal(t.get('reactionImage').style.backgroundPosition,'0% '+expression/3*100+'%');if(mobile)assert.equal(t.get('mobileArt').style.backgroundPosition,t.get('reactionImage').style.backgroundPosition);}
 t.run("state.reactionCount=2;state.reaction=G.reaction(state,{id:'strength'},{label:'Low',score:1},()=>.08);render()");assert(!t.get('zoroGuest').hidden);
 assert.equal(t.run("state.reaction.partnerArt.portraitExpression"),0);
 assert.match(t.get('zoroGuest').style.backgroundImage,/reaction-expressions/);
 t.run("state.reactionCount=4;state.lastZoroCameo=-100;state.reaction=G.reaction(state,{id:'strength'},{label:'Low',score:1},()=>0);render()");assert.match(t.get('zoroGuest').style.backgroundImage,/reactions-onepiece/);assert(!t.get('zoroGuest').hidden);
}
console.log('Expressions: '+frames+' host/emotion combinations, saved routing, outcome expressions, desktop/mobile paired artwork and all eight lost-Zoro cameo worlds passed.');
