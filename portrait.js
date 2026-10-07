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
const artwork=typeof module!=='undefined'?require('./character-art.js'):root.AWGCharacterArt;
function model(run,pose=0,preview=false){
 const p=describe(run,preview),variant=p.modelVariant;
 const row=(p.gender==='female'?2:0)+variant;
 const column=Number.isInteger(pose)&&pose>=0&&pose<6?pose:0;
 const atlas=artwork[run.world],tile=row*6+column,rect=atlas?.frames[tile];
 return {world:run.world,row,column,tile,variant,sheet:'character-models-'+run.world+'.png',rect,atlas,relativeHeight:rect?rect[3]/atlas.frames[row*6][3]:1};
}
function render(target,run,preview=true,options={}){
 const p=describe(run,preview),m=model(run,options.pose||0,preview);
 target.replaceChildren();target.className='portrait-art cohesive '+p.gender+' skin-'+p.skin+(p.transformed?' transformed':'');
 target.setAttribute('role','img');target.setAttribute('aria-label',`Complete ${p.gender} character, ${run.world} outfit, ${['standing','celebrating','confident','kneeling','seated','resting on one knee'][m.column]}. Build: ${p.origin}, age ${p.age}, ${p.faction}.`);
 target.style.background=`radial-gradient(ellipse at 50% 70%,${p.color}66,#0c1427 75%)`;
 const aura=document.createElement('span');aura.className='portrait-aura '+p.element;aura.style.color=p.color;aura.style.opacity=p.intensity?String(.18+p.intensity*.1):'0';target.append(aura);
 if(m.rect){
  const [x,y,w,h]=m.rect,body=document.createElement('span');body.className='character-fullbody';
  body.style.backgroundImage="url('"+m.sheet+"')";body.style.backgroundSize=(m.atlas.width/w*100)+'% '+(m.atlas.height/h*100)+'%';
  body.style.backgroundPosition=(x/(m.atlas.width-w)*100)+'% '+(y/(m.atlas.height-h)*100)+'%';body.style.aspectRatio=w+'/'+h;
  body.setAttribute('data-model',run.world+':'+m.row);body.setAttribute('data-pose',String(m.column));target.append(body);
 }else{const missing=document.createElement('span');missing.className='art-missing';missing.textContent='Character artwork unavailable';target.append(missing);}
 if(p.transformed){const form=document.createElement('span');form.className='portrait-form';form.textContent=p.transformed;target.append(form);}
 return p;
}
root.AWGPortrait={describe,model,render};if(typeof module!=='undefined')module.exports=root.AWGPortrait;
})(typeof window!=='undefined'?window:globalThis);
