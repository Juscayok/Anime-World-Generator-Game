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
 return {age,base:age<=20?0:age<=40?1:age<=64?2:3,origin,faction,abilities,element,color,equipment,weapon,skin,transformed,factionHue,outfit:get('origin')||get('faction')?outfits[run.world]:null,intensity:get('energy')?.score||0,mastery:Math.max(0,...rows.filter(x=>/^mastery\d+$/.test(x.id)).map(x=>x.score)),preview:!!(preview&&run.pending)};
}
// Atlas rectangles are measured from the generated source; no runtime image service.
function sprite(tile,cls){const el=document.createElement('span');el.className='portrait-layer '+cls;const col=tile%4;let x=col*313.5,y=0,w=313.5,h=375;
 if(tile>=4){const row=Math.floor(tile/4);y=[0,395,670,949][row];h=[375,267,276,305][row];}
 el.style.backgroundImage="url('portrait-atlas.png')";el.style.backgroundSize=`${1254/w*100}% ${1254/h*100}%`;el.style.backgroundPosition=`${x/(1254-w)*100}% ${y/(1254-h)*100}%`;return el;}
function equipmentAccent(weapon){
 const el=document.createElement('span');el.className='portrait-gear-accent';
 const paths=/bow/i.test(weapon)?'<path d="M72 8 Q98 50 72 94 L72 8 M70 52 H96"/>':/rifle|gun/i.test(weapon)?'<path d="M75 85 L80 60 L84 59 L85 22 L90 22 L92 62 L84 67 L81 89 Z"/>':/yo-yo|chain|whip/i.test(weapon)?'<path d="M80 32 Q61 57 86 62 Q104 75 79 88"/><circle cx="79" cy="88" r="7"/>':/gauntlet/i.test(weapon)?'<path d="M12 80 Q18 77 27 80 L29 98 Q20 101 13 98 Z M74 80 Q82 77 89 80 L88 98 Q80 101 72 98 Z M13 85 L28 85 M74 85 L89 85 M17 88 L18 96 M83 88 L82 96"/>':/fan/i.test(weapon)?'<path d="M82 90 L63 45 Q84 25 98 45 Z M82 90 L78 39 M82 90 L90 37"/>':/scarf/i.test(weapon)?'<path d="M33 42 Q48 47 66 42 L68 49 L36 49 L26 88 L23 77 Z"/>':/armor|suit|gear|belt|boot/i.test(weapon)?'<path d="M16 57 L31 50 L33 66 L18 70 Z M69 50 L85 57 L83 70 L68 66 Z M31 83 L69 83 L69 91 L31 91 Z"/>':'<circle cx="82" cy="72" r="10"/><path d="M82 57 L88 72 L82 87 L76 72 Z"/>';
 const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="metal"><stop stop-color="#71869d"/><stop offset=".4" stop-color="#263649"/><stop offset="1" stop-color="#53677e"/></linearGradient></defs><g fill="url(#metal)" stroke="#99aec4" stroke-width=".8" stroke-linejoin="round">'+paths+'</g></svg>';
 el.style.backgroundImage='url("data:image/svg+xml,'+encodeURIComponent(svg)+'")';return el;
}
function render(target,run,preview=true){const p=describe(run,preview);target.replaceChildren();target.className='portrait-art skin-'+p.skin+(p.transformed?' transformed':'');target.setAttribute('role','img');target.setAttribute('aria-label',`${p.origin}, age ${p.age}, ${p.faction}${p.weapon?', '+p.weapon:''}${p.abilities.length?', '+p.abilities.join(', '):''}`);
 target.style.background=`radial-gradient(ellipse at 50% 70%,${p.color}66,#0c1427 75%)`;
 const aura=document.createElement('span');aura.className='portrait-aura '+p.element;aura.style.color=p.color;aura.style.opacity=p.intensity?String(.18+p.intensity*.1):'0';target.append(aura);
 const base=sprite(p.base,'portrait-base');if(p.outfit!==null)base.style.clipPath='inset(0 0 55% 0)';target.append(base);
 if(p.outfit!==null){const coat=sprite(p.outfit,'portrait-outfit');coat.style.filter=`hue-rotate(${p.factionHue}deg)`;target.append(coat);}
 if(p.equipment!==null){const tool=sprite(p.equipment,'portrait-equipment');tool.style.left=p.equipment===15?'0':p.equipment===14?'7%':'18%';target.append(tool);}
 if(p.weapon&&p.equipment===null)target.append(equipmentAccent(p.weapon));
 if(p.skin==='otherworld'){const mark=document.createElement('span');mark.className='portrait-mark';mark.textContent='◆';target.append(mark);}
 if(p.mastery>=5){const ring=document.createElement('span');ring.className='portrait-mastery';ring.style.borderColor=p.color;target.append(ring);}
 if(p.transformed){const form=document.createElement('span');form.className='portrait-form';form.textContent=p.transformed;target.append(form);}
 return p;
}
root.AWGPortrait={describe,render};if(typeof module!=='undefined')module.exports=root.AWGPortrait;
})(typeof window!=='undefined'?window:globalThis);
