const assert=require('node:assert/strict');
const {setup}=require('./test-mobile.cjs');
for(const mobile of [true,false]){
 const {get,run}=setup(mobile);
 get('settings').click();
 const select=get('dialogBody').children[0].children[1];select.value='on';select.onchange();
 assert.equal(run('state.pending'),null);get('closeDialog').click();
 assert(run('state.pending'));assert(get('reactionDialog').open);
 get('rerollReaction').click();assert.equal(run('state.index'),0);assert.equal(run('state.rerolls'),2);
 get('continueReaction').click();assert.equal(run('state.index'),1);assert(run('state.pending'));assert(get('reactionDialog').open);
 get('closeReaction').click();assert.equal(run('state.index'),1);
 run("prefs.autoSpin='off'");get('spin').click();assert.equal(run('state.index'),2);assert.equal(run('state.pending'),null);
 run("prefs.autoSpin='on';state.index=state.queue.length-1");get('spin').click();get('continueReaction').click();
 assert(run('state.finished'));assert(get('dialog').open);assert.equal(run('archive.length'),1);
}
console.log('Auto-spin: desktop/mobile, settings start, wait for Continue, reroll, dismissal, manual mode and final scene passed.');
