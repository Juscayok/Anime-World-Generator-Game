(function(root){
'use strict';
const themes={jjk:'#b28bff',naruto:'#ffac55',onepiece:'#5adddf',bleach:'#8fbbff',dragonball:'#f6cf51',fairytail:'#ff8964',mha:'#70e6b1',aot:'#99b791',hxh:'#94e279'};
const outfits={jjk:4,naruto:5,onepiece:6,bleach:7,dragonball:8,fairytail:9,mha:10,aot:11,hxh:12};
function describe(run,preview=true){
 const rows=[...run.results];const step=run.queue?.[run.index];
 if(preview&&run.pending&&step)rows.push({id:step.id,name:step.name||step.label,...run.pending});
 const get=id=>rows.findLast(x=>x.id===id),named=name=>rows.findLast(x=>x.name===name);
 const age=Number(get('exactAge')?.label)||Number(get('age')?.label.split(/[–-]/)[0])||(get('age')?.label==='Ancient'?100:21);
 const origin=get('origin')?.label||'Unrevealed origin',faction=get('faction')?.label||'Affiliation unrevealed';
 const abilities=rows.filter(x=>/^ability\d+$/.test(x.id)).map(x=>x.label);
 const effects=[...abilities,...rows.filter(x=>x.id.startsWith('extra')&&!['No','None'].includes(x.label)).map(x=>x.label)].join(' ');
 const element=/fire|flame|explosion/i.test(effects)?'flame':/lightning|godspeed|electri|chidori/i.test(effects)?'lightning':/ice|water|cold/i.test(effects)?'ice':/shadow|dark/i.test(effects)?'shadow':'aura';
 const color={flame:'#ff8750',lightning:'#91d9ff',ice:'#74e9ed',shadow:'#ad88ff'}[element]||themes[run.world];
 const weapon=get('tool')?.label||'';const equipment=/key/i.test(weapon)?15:/staff|pole|rod|kanabo|cloud/i.test(weapon)?14:/sword|katana|blade|zanpakuto|spear|dagger|kunai|samehada|cutlass|lance/i.test(weapon)?13:null;
 const transformed=named('Titan form')?.label||(named('Transformation potential')?.label==='Yes'?'Awakened potential':null);
 const skin=/namekian/i.test(origin)?'namekian':/majin/i.test(origin)?'majin':/frost demon|cursed spirit|arrancar|chimera ant/i.test(origin)?'otherworld':'human';
 const factionHue=faction==='Affiliation unrevealed'?0:[...faction].reduce((a,c)=>a+c.charCodeAt(0),0)%71-35;
 const seed=[...(run.id||run.world)].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,0);
 return {gender:run.gender==='female'?'female':'male',age,base:age<=20?0:age<=40?1:age<=64?2:3,origin,faction,abilities,element,color,equipment,weapon,skin,transformed,factionHue,seed,modelVariant:age>=40?1:Math.floor(seed/3)%2,outfit:get('origin')||get('faction')?outfits[run.world]:null,intensity:get('energy')?.score||0,mastery:Math.max(0,...rows.filter(x=>/^mastery\d+$/.test(x.id)).map(x=>x.score)),preview:!!(preview&&run.pending)};
}
const extraArt=typeof module!=='undefined'?require('./new-art.js'):root.AWGNewArt;
const artwork={...(typeof module!=='undefined'?require('./character-art.js'):root.AWGCharacterArt),...extraArt.players};
const tournament=typeof module!=='undefined'?require('./tournament.js'):root.AWGTournament;
const identityArtwork=typeof module!=='undefined'?require('./identity-art.js'):root.AWGIdentityArt;
function identityKey(run,preview=false){
 if(run.world==='tournament'){const p=describe(run,preview);if(p.transformed?.includes('Titan'))return p.transformed;return identityKey({...run,world:tournament.sourceWorld(run,preview)},preview);}
 if(run.world==='opm'&&describe(run,preview).origin==='Monster')return 'spirit';
 if((run.world==='opm'&&describe(run,preview).origin==='Cyborg')||(run.world==='cowboy'&&describe(run,preview).origin==='Cybernetic specialist'))return 'android';
 const p=describe(run,preview);
 const origins={dragonball:{Majin:'majin',Namekian:'namekian','Frost demon':'frost',Saiyan:'saiyan',Android:'android'},fairytail:{Exceed:'exceed'},onepiece:{'Fish-man':'fishman',Mink:'mink',Giant:'giant',Lunarian:'lunarian'},jjk:{'Cursed spirit':'spirit'},bleach:{Arrancar:'arrancar',Visored:'visored'},hxh:{'Chimera Ant':'chimera'}};
 if(run.world==='aot'&&p.transformed)return p.transformed;
 return origins[run.world]?.[p.origin]||null;
}
function model(run,pose=0,preview=false){
 const p=describe(run,preview),variant=p.modelVariant;
 const identity=identityKey(run,preview),entry=identityArtwork?.[identity];
 if(entry){
  const female=p.gender==='female',defeated=pose>=3;
  const row=entry.rows?entry.rows[female?1:0]:entry.row;
  const column=entry.poses===6?Math.max(0,Math.min(5,pose)):entry.poses===2?(defeated?entry.column+1:entry.column):(defeated?2:0)+(female?1:0);
  const atlas=entry.atlas,tile=row*atlas.columns+column,rect=atlas.frames[tile];
  const standing=atlas.frames[row*atlas.columns+(entry.poses===6?0:entry.poses===2?entry.column:female?1:0)];
  return {world:run.world,row,column,tile,variant:0,identity,sheet:entry.sheet,rect,atlas,relativeHeight:rect[3]/standing[3]};
 }
 const row=(p.gender==='female'?2:0)+variant;
 const column=Number.isInteger(pose)&&pose>=0&&pose<6?pose:0;
 const modelWorld=run.world==='tournament'?tournament.sourceWorld(run,preview):run.world;
 const atlas=artwork[modelWorld],tile=row*6+column,rect=atlas?.frames[tile];
 return {world:run.world,row,column,tile,variant,sheet:'character-models-'+modelWorld+'.png',rect,atlas,relativeHeight:rect?rect[3]/atlas.frames[row*6][3]:1};
}
function render(target,run,preview=true,options={}){
 const p=describe(run,preview),m=model(run,options.pose||0,preview);
 target.replaceChildren();target.className='portrait-art cohesive '+p.gender+' skin-'+p.skin+(p.transformed?' transformed':'')+(m.identity?' identity-model identity-'+m.identity.toLowerCase().replaceAll(' ','-'):'');
 target.setAttribute('role','img');target.setAttribute('aria-label',`Complete ${p.gender} ${m.identity||'human'} character, ${options.pose>=3?'defeated':'ready'}. Build: ${p.origin}, age ${p.age}, ${p.faction}.`);
 target.style.background='#0c1427';
 if(m.rect){
  const [x,y,w,h]=m.rect,body=document.createElement('span');body.className='character-fullbody';
  body.style.backgroundImage="url('"+m.sheet+"')";body.style.backgroundSize=(m.atlas.width/w*100)+'% '+(m.atlas.height/h*100)+'%';
  body.style.backgroundPosition=(x/(m.atlas.width-w)*100)+'% '+(y/(m.atlas.height-h)*100)+'%';body.style.aspectRatio=w+'/'+h;
  body.style.setProperty?.('--model-ratio',String(w/h));
  body.style.maskImage=m.atlas.masks[m.tile];body.style.webkitMaskImage=m.atlas.masks[m.tile];body.style.maskSize='100% 100%';body.style.webkitMaskSize='100% 100%';body.style.maskRepeat='no-repeat';body.style.webkitMaskRepeat='no-repeat';
  body.setAttribute('data-model',run.world+':'+m.row);body.setAttribute('data-pose',String(m.column));target.append(body);
 }else{const missing=document.createElement('span');missing.className='art-missing';missing.textContent='Character artwork unavailable';target.append(missing);}
 if(p.transformed){const form=document.createElement('span');form.className='portrait-form';form.textContent=p.transformed;target.append(form);}
 return p;
}
root.AWGPortrait={describe,identityKey,model,render};if(typeof module!=='undefined')module.exports=root.AWGPortrait;
})(typeof window!=='undefined'?window:globalThis);
