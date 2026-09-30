(function(root){
'use strict';
const artwork=typeof module!=='undefined'?require('./battle-art.js'):root.AWGBattleArt;
// Explicit artwork order: never substitute a reaction host for an opponent.
const roster={jjk:['Yuji','Megumi','Todo','Jogo','Mahito','Toji','Yuta','Kenjaku','Gojo','Sukuna'],naruto:['Rock Lee','Neji','Gaara','Kakashi','Orochimaru','Itachi','Pain','Sasuke','Obito','Madara','Naruto'],onepiece:['Buggy','Arlong','Crocodile','Rob Lucci','Doflamingo','Katakuri','Zoro','Kizaru','Luffy','Kaido','Shanks'],bleach:['Renji','Ikkaku','Rukia','Grimmjow','Byakuya','Ulquiorra','Kenpachi','Shunsui','Aizen','Ichigo','Yhwach'],dragonball:['Yamcha','Tien','Piccolo','Android 18','Frieza','Cell','Majin Buu','Vegeta','Goku','Beerus'],fairytail:['Wendy','Gray','Lucy','Gajeel','Erza','Natsu','Laxus','Jellal','Zeref','Acnologia'],mha:['Mineta','Iida','Uraraka','Kirishima','Todoroki','Deku','Bakugo','Dabi','Shigaraki','All For One'],aot:['Pure Titan','Abnormal Titan','Military Police squad','Warrior squad','Jaw Titan','Mikasa','Armored Titan','Eren','Beast Titan','Colossal Titan'],hxh:['Tonpa','Genthru','Gon','Killua','Knuckle','Feitan','Hisoka','Chrollo','Neferpitou','Meruem']};
function describe(run){
 const enemy=run.results.findLast(x=>x.id==='enemy')?.label;
 const outcome=run.results.findLast(x=>x.id==='win')?.label;
 if(!run.finished||!enemy||!['VICTORY','DEFEAT'].includes(outcome))return null;
 const index=roster[run.world]?.indexOf(enemy)??-1;
 return {enemy,outcome,won:outcome==='VICTORY',index,tile:index<0?null:index+(outcome==='VICTORY'?12:0),sheet:'battle-enemies-'+run.world+'.png',condition:run.results.findLast(x=>x.id==='enemyLevel')?.label||'Base form',field:run.results.findLast(x=>x.id==='field')?.label||'Open plains',gender:run.gender==='female'?'female':'male'};
}
function render(target,run){
 const d=describe(run);target.replaceChildren();target.className='battle-scene';
 if(!d){const empty=document.createElement('p');empty.textContent='Complete the final battle to reveal this scene.';target.append(empty);return null;}
 const field={'City ruins':'city','Open plains':'plains','Dense forest':'forest','Underground arena':'arena','Mountain summit':'mountain'}[d.field]||'plains';
 target.className='battle-scene '+field+(d.won?' player-won':' player-lost');target.setAttribute('role','img');target.setAttribute('aria-label',(d.won?'Your character stands victorious over defeated ':'Your character kneels defeated beneath ')+d.enemy+'. '+d.field+'. Opponent condition: '+d.condition+'.');
 const ground=document.createElement('span');ground.className='battle-ground';target.append(ground);
 const player=document.createElement('div');player.className='battle-player '+(d.won?'standing':'kneeling');
 const legs=document.createElement('span');legs.className='battle-legs';const legTile=(d.won?0:2)+(d.gender==='female'?1:0);legs.style.backgroundPosition=(legTile%2*100)+'% '+Math.floor(legTile/2)*100+'%';player.append(legs);
 const upper=document.createElement('div');upper.className='battle-upper';const art=document.createElement('div');const portrait=root.AWGPortrait.render(art,run,false);upper.append(art);for(const side of ['left','right']){const hand=document.createElement('span');hand.className='battle-hand '+side+' '+portrait.skin;upper.append(hand);}player.append(upper);target.append(player);
 const opponent=document.createElement('div');opponent.className='battle-opponent '+(d.won?'kneeling':'standing');opponent.setAttribute('aria-label',d.enemy+(d.won?' defeated':' victorious'));opponent.setAttribute('data-opponent',d.enemy);
 if(d.tile!==null){opponent.style.backgroundImage="url('"+d.sheet+"')";const atlas=artwork[run.world],rect=atlas.frames[d.tile];if(rect){const [x,y,w,h]=rect;opponent.style.backgroundSize=(atlas.width/w*100)+'% '+(atlas.height/h*100)+'%';opponent.style.backgroundPosition=(x/(atlas.width-w)*100)+'% '+(y/(atlas.height-h)*100)+'%';opponent.style.width='calc(var(--enemy-height) * '+(w/h)+')';}if(d.enemy.includes('squad'))opponent.className+=' squad';}
 else{opponent.className+=' art-missing';opponent.textContent='Artwork unavailable: '+d.enemy;}
 if(['Full power','Prime'].includes(d.condition))opponent.className+=' powered';target.append(opponent);
 const caption=document.createElement('div');caption.className='battle-caption';const title=document.createElement('strong');title.textContent=d.outcome;const names=document.createElement('span');names.textContent='You vs '+d.enemy;caption.append(title,names);target.append(caption);
 return d;
}
root.AWGBattle={roster,describe,render};if(typeof module!=='undefined')module.exports=root.AWGBattle;
})(typeof window!=='undefined'?window:globalThis);
