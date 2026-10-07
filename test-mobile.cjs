const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
class Element {
 constructor(){this.children=[];this.style={};this.dataset={};this.open=false;this.classList={remove(){},add(){}}}
 append(...items){this.children.push(...items)} replaceChildren(...items){this.children=items} setAttribute(){}
 showModal(){this.open=true} close(){this.open=false;this.onclose?.()} click(){if(!this.disabled)this.onclick?.()}
 getContext(){return new Proxy({createRadialGradient(){return{addColorStop(){}}}},{get:(o,k)=>o[k]||(()=>{})})}
}
function setup(mobile=true,firstVisit=false){const nodes=new Map(),get=id=>{if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id)};let tick=0;const storage=new Map();if(!firstVisit)storage.set("anime-world-generator-v1-prefs",JSON.stringify({tutorialSeen:true,sound:false,speed:"normal",reactions:"full"}));const context={console,Math,Date,JSON,Blob,URL,setTimeout,document:{body:new Element(),getElementById:get,createElement:()=>new Element(),querySelector:get},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},matchMedia:q=>({matches:q.includes('max-width')?mobile:true}),requestAnimationFrame:fn=>fn(tick+=100)};context.window=context;vm.createContext(context);for(const name of ['reaction-variety.js','worlds-extra.js','reactions-extra.js','character-art.js','portrait.js','reactions.js','game.js','battle-art.js','battle.js','app.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+name,'utf8'),context);return{get,run:code=>vm.runInContext(code,context)}}
const {get,run}=setup();get('spin').click();assert(get('reactionDialog').open);const pending=run('state.pending.label');get('closeReaction').click();assert(!get('reactionDialog').open);assert.equal(run('state.pending.label'),pending);assert.equal(run('state.index'),0);
get('settings').click();get('closeDialog').click();assert(!get('reactionDialog').open,'Dismissed verdict must not reopen after settings');
get('reroll').click();assert(get('reactionDialog').open);assert.equal(run('state.rerolls'),2);get('rerollReaction').click();assert.equal(run('state.rerolls'),1);get('rerollReaction').click();assert.equal(run('state.rerolls'),0);assert(get('rerollReaction').disabled);get('rerollReaction').click();assert.equal(run('state.rerolls'),0);
get('continueReaction').click();assert(!get('reactionDialog').open);assert.equal(run('state.index'),1);assert.equal(run('state.results.length'),1);assert.equal(run('document.body.dataset.panel'),'wheel');
run("prefs.reactions='off'");get('spin').click();assert(!get('reactionDialog').open);
const desktop=setup(false);desktop.get('spin').click();assert(!desktop.get('reactionDialog').open);
const deferred=setup();deferred.get('dialog').showModal();deferred.get('spin').click();assert(!deferred.get('reactionDialog').open);deferred.get('dialog').close();assert(deferred.get('reactionDialog').open);
const final=setup();final.run("state.index=state.queue.length-1");final.get('spin').click();final.get('continueReaction').click();assert(final.run('state.finished'));assert.equal(final.run('archive.length'),1);
console.log('Mobile verdict: automatic reveal, close preservation, reroll exhaustion, continue, reaction-Off, desktop exclusion, deferred dialog and final archive passed.');
module.exports={setup};
