(function(root){
'use strict';
const roundNames=['Quarterfinal','Semifinal','Final'];
const representatives={jjk:['Yuji','Gojo'],naruto:['Naruto','Sasuke'],onepiece:['Luffy','Zoro'],bleach:['Ichigo','Rukia'],dragonball:['Goku','Vegeta'],fairytail:['Natsu','Erza'],mha:['Deku','Bakugo'],aot:['Eren','Mikasa'],hxh:['Gon','Killua'],cowboy:['Spike','Faye'],opm:['Saitama','Genos']};
const talents={jjk:'Domain Expansion',naruto:'Sage Mode',onepiece:'Armament Haki',bleach:'Ultimate release',dragonball:'Regeneration',fairytail:'Second Origin',mha:'Awakening',aot:'Titan shifter',hxh:'Nen restriction',cowboy:'Cybernetic upgrade',opm:'Limiter breakthrough'};
const titanForms=['Attack Titan','Armored Titan','Colossal Titan','Female Titan','Beast Titan','Jaw Titan','Cart Titan','War Hammer Titan','Founding Titan'];
function definition(worlds){return {name:'Tournament',energy:'Mixed energy',ability:'Cross-world technique',origin:[],clans:[],groups:[],powers:[],enemies:[],extras:[],weapons:[],mixed:true};}
function pool(worlds,field){return Object.entries(worlds).flatMap(([world,w])=>{
 const values=field==='energy'?[w.energy]:field==='talent'?[talents[world]]:w[field];
 const weights=values.map((_,i)=>field==='origin'?(i===values.length-1?5:24):1),sum=weights.reduce((a,b)=>a+b,0);
 return values.map((label,i)=>({label,weight:100*weights[i]/sum,score:field==='origin'&&i===values.length-1?6:3,world}));
});}
function mixed(id,label,chapter,worlds,field,extra={}){return {id,label,chapter,options:pool(worlds,field),mixed:true,...extra};}
function makeQueue(worlds,step,power,tiers){return [
 mixed('origin','Who will you become?',0,worlds,'origin',{name:'Identity'}),step('age','How old are you?',0,['16–20','21–30','31–45','46–70','Ancient'],{neutral:true}),mixed('clan','Your cross-world roots',0,worlds,'clans',{neutral:true}),mixed('faction','Who do you stand with?',0,worlds,'groups',{neutral:true}),step('potential','Your natural potential',0,power),
 mixed('energySystem','Your source of power',1,worlds,'energy',{neutral:true}),...['energy','control','output','recovery'].map((id,i)=>step(id,['Mixed energy reserves','Mixed energy control','Mixed energy output','Mixed energy recovery'][i],1,i%2?tiers:power)),
 step('count','How many cross-world techniques?',2,[['1',40,3],['2',35,4],['3',18,5],['4',6,6],['5',1,7]]),mixed('talent','Your special talent',2,worlds,'talent',{neutral:true}),step('talentmaster','Special talent mastery',2,tiers),
 ...['Strength','Durability','Speed','Stamina','Reflexes'].map(x=>step(x.toLowerCase(),x,3,power)),...['Combat skill','Weapon skill','IQ','Battle IQ'].map(x=>step(x.toLowerCase(),x,4,tiers)),mixed('tool','Your cross-world equipment',4,worlds,'weapons',{neutral:true}),step('toolmaster','Equipment mastery',4,tiers)
];}
function nextRandom(t){t.seed=(Math.imul(t.seed,1664525)+1013904223)>>>0;return t.seed/4294967296;}
function initialize(state,worlds,rng){
 const t=state.tournament={seed:Math.floor(rng()*4294967296)>>>0,round:0,rounds:[],initial:[],active:[],champion:null,eliminated:false};
 const keys=Object.keys(representatives);for(let i=keys.length-1;i>0;i--){const j=Math.floor(nextRandom(t)*(i+1));[keys[i],keys[j]]=[keys[j],keys[i]];}
 const opponents=keys.slice(0,7).map((world,i)=>{const names=representatives[world],name=names[Math.floor(nextRandom(t)*names.length)],index=worlds[world].enemies.indexOf(name);return {id:'rival-'+i,world,name,score:3+Math.max(0,index)*.19};});
 t.initial=[{id:'player',name:'YOU',world:'tournament',score:3},...opponents];t.active=t.initial.map(x=>({...x}));
 const first=opponents[0];state.reaction={speaker:first.name,artWorld:first.world,frame:representatives[first.world].indexOf(first.name)*4+2,tag:'RIVAL WATCHING',text:'You’re in my bracket. Show me what you’re bringing.',benefit:'neutral',rival:true};
 state.queue.push(...encounter(state));
}
function rival(state){return state.tournament?.active.find(x=>x.id!=='player')||state.tournament?.initial[1];}
function encounter(state){const t=state.tournament,r=rival(state);return [
 {id:'enemy',label:roundNames[t.round]+' rival',chapter:5,neutral:true,fixed:true,options:[{label:r.name,weight:1,score:r.score,world:r.world}]},
 {id:'enemyLevel',label:'Your rival’s condition',chapter:5,neutral:true,options:[{label:'Weakened',weight:25,score:2},{label:'Base form',weight:43,score:3},{label:'Full power',weight:25,score:5},{label:'Prime',weight:7,score:7}]},
 {id:'field',label:'The tournament battlefield',chapter:5,neutral:true,options:['City ruins','Open plains','Dense forest','Underground arena','Mountain summit'].map(label=>({label,weight:1,score:3}))},
 {id:'advantage',label:'Your starting conditions',chapter:5,options:[['Ambushed',20,1],['Exhausted',15,2],['Even footing',40,3],['Prepared',20,5],['Perfect setup',5,7]].map(([label,weight,score])=>({label,weight,score}))},
 {id:'win',label:'Do you win the '+roundNames[t.round].toLowerCase()+'?',chapter:5,options:[{label:'VICTORY',weight:50,score:7},{label:'DEFEAT',weight:50,score:1}]}
];}
function chance(state){
 const stats=state.results.filter(x=>x.chapter<5&&!x.neutral&&x.id!=='count'),avg=stats.reduce((n,x)=>n+x.score,0)/(stats.length||1),last=id=>state.results.findLast(x=>x.id===id),opponent=last('enemy')?.score||rival(state)?.score||3;
 return Math.max(5,Math.min(95,Math.round(55+(avg-opponent)*12+(3-(last('enemyLevel')?.score||3))*4+((last('advantage')?.score||3)-3)*5)));
}
function settle(t,playerWon,hasPlayer=true){const matches=[],winners=[];for(let i=0;i<t.active.length;i+=2){const a=t.active[i],b=t.active[i+1],player=a.id==='player'||b.id==='player';const winner=player&&hasPlayer?(playerWon?(a.id==='player'?a:b):(a.id==='player'?b:a)):(nextRandom(t)<a.score/(a.score+b.score)?a:b);matches.push({a:{...a},b:{...b},winner:{...winner},player});winners.push({...winner});}t.rounds.push({name:roundNames[t.round],matches});t.active=winners;t.round++;if(winners.length===1)t.champion={...winners[0]};}
function afterCommit(state,s,result,step){
 if(s.id==='talent'&&result.label==='Titan shifter')state.queue.splice(state.index+1,0,step('titanForm','Titan form',2,titanForms,{name:'Titan form',neutral:true}));
 if(s.id!=='win')return;
 const t=state.tournament;settle(t,result.label==='VICTORY');state.simulationPaused=true;
 if(result.label==='DEFEAT'){t.eliminated=true;while(!t.champion)settle(t,false,false);state.queue.length=state.index+1;}
 else if(!t.champion)state.queue.push(...encounter(state));
}
function playerWon(state){return state.world==='tournament'?state.tournament?.champion?.id==='player':state.results.findLast(x=>x.id==='win')?.label==='VICTORY';}
function sourceWorld(state,preview=true){const step=state.queue?.[state.index];return preview&&step?.id==='origin'&&state.pending?.world?state.pending.world:state.results.findLast(x=>x.id==='origin')?.world||'jjk';}
root.AWGTournament={definition,pool,makeQueue,initialize,rival,encounter,chance,afterCommit,playerWon,sourceWorld,roundNames,representatives};if(typeof module!=='undefined')module.exports=root.AWGTournament;
})(typeof window!=='undefined'?window:globalThis);
