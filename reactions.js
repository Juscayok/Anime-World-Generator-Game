(function(root){
'use strict';
// Original fan dialogue, not quotations from the shows. Ratings describe the player's benefit.
const voices={
Yuji:{bad:['Okay. Nobody panic. Especially me.','We can fix this with training. A lot of training.','I was hoping for something less life-threatening.','Please tell me there is a tutorial for this.'],good:['Now that is something we can use to protect people!','Nice! I would absolutely want you on my team.','Look at you! That training is paying off.','That is a serious upgrade. Let’s put it to good use.'],neutral:['I want to see what you do with that.','That makes your story a little more interesting.','I’m listening. What happens next?','Hey, everybody starts somewhere.']},
Gojo:{bad:['Good thing you have an excellent teacher. Me.','That is adorable. Concerning, but adorable.','We may need to extend your training indefinitely.','I would laugh, but I should probably prepare a lesson.'],good:['Careful. Keep improving and I might have competition.','Not bad. Obviously I make it look easier.','Now you are giving me something interesting to teach.','A promising student! Try not to let it go to your head.'],neutral:['Interesting. I have several very annoying ideas for that.','I could make that work. Your results may vary.','That should make the next lesson entertaining.','Let’s see whether you have the imagination to use it.']},
Naruto:{bad:['Don’t give up! We train again tomorrow!','Believe me, looking hopeless is not the end of the story.','Okay, that one hurt. Ramen first, training next.','You need a comeback arc. I can help with that.'],good:['That’s what I’m talking about!','You are going to make your whole village proud!','Now we’re getting somewhere. Don’t waste it!','I knew you had something big in you!'],neutral:['Your story is just getting started!','I’m not judging. My own start was pretty messy.','What matters is what you choose to do next.','Come on, show me how you make that your own.']},
Sasuke:{bad:['Hmph. More training. Less celebrating.','You cannot intimidate anyone with potential alone.','That weakness will cost you if you ignore it.','I suggest you stop posing and start practicing.'],good:['Not bad. Try to keep up.','Finally. A result worth taking seriously.','That might actually force me to pay attention.','Useful. Don’t mistake it for a guarantee.'],neutral:['I will judge it when I see you use it.','A name on a character sheet proves nothing.','Interesting. Keep your intentions clear.','We will see whether it suits you.']},
Luffy:{bad:['Let’s eat first. Then try again!','That looks difficult. Want me to punch it?','You are not quitting over one bad spin!','Okay! We need food and a really good plan.'],good:['That’s awesome! You’re coming with us!','Show me again! That was so cool!','We are definitely having a feast after this!','Now that looks like an adventure!'],neutral:['Can you do something funny with it?','Sounds interesting! Let’s go find out!','I don’t really get it, but I like your attitude.','As long as you are free to choose your own path!']},
Zoro:{bad:['You lost the fight before I lost the directions.','Stop making excuses. Pick up the weight.','I’ve seen training dummies put up more resistance.','That needs work. Preferably before the next fight.'],good:['Good. Now make it count.','That is worth testing against a real opponent.','Keep that up and we might have a proper spar.','Useful. Just don’t get comfortable.'],neutral:['Does it help in a fight? Then I’ll listen.','Wake me when you are ready to test it.','I care more about discipline than labels.','Fine. Pick a direction and commit to it.']},
Ichigo:{bad:['Okay. We’ve got some work to do.','I’m not letting you walk into a fight like that.','Please stop treating danger like a personality trait.','You need practice, not another dramatic entrance.'],good:['That’s a power worth protecting people with.','Good. Now you can actually back someone up.','I would feel better with you watching my back.','That should make the next fight less one-sided.'],neutral:['As long as you know who you are fighting for.','I didn’t exactly choose a normal life either.','Another complication. Sure. Why not?','Make it your own. That part matters.']},
Rukia:{bad:['Back to the basics. Pay attention this time.','I should draw you a training diagram. A very simple one.','Your enthusiasm is getting ahead of your ability.','That is not a strategy. That is a rescue mission.'],good:['Your training is finally showing.','Good. I might not have to explain this twice.','You have earned a little confidence. Only a little.','That is promising. Keep your composure.'],neutral:['I will explain the important part with a drawing.','Unusual, but not beyond training.','Do not confuse an interesting origin with experience.','We should assess this before you improvise.']},
Goku:{bad:['You just need a stronger training partner!','That is a rough start. Let’s practice together.','Maybe we should warm up before the dangerous part.','Even I think we need a little more preparation.'],good:['Wow! I want to fight you now!','That looks strong! How much further can you take it?','You’ve got me excited for our next spar!','Great! Now let’s see what happens after more training.'],neutral:['I wonder how strong you could get with that.','Interesting! Can you show me how it works?','I’ve met all kinds of fighters. Surprise me!','Sounds like a good reason to train somewhere new.']},
Vegeta:{bad:['Pathetic. Start training.','You call that preparation?','Your confidence is doing work your power cannot.','I refuse to lose because you skipped the basics.'],good:['Finally, a power worth acknowledging.','Do not let one good result make you insufferable.','Acceptable. You still have a long way to go.','Hmph. Perhaps this will not be a complete waste of time.'],neutral:['I will reserve judgment until you demonstrate it.','Your ancestry does not earn my respect. Your training might.','Another unusual fighter. Try to be useful.','I have no interest in your title. Show me your discipline.']}
};
const contexts={
enemyBad:['{enemy} at {value}? That is THEIR advantage, not yours.','The opponent gets {value}. Your odds just took a hit.','I would not cheer for {value} on the enemy’s side.','{value} means {enemy} is more dangerous. Prepare accordingly.'],
enemyGood:['{enemy} is {value}. Take the opening, but stay alert.','A {value} opponent gives you breathing room. Use it.','{value} helps your chances. It does not make you invincible.','Better to face {enemy} like this than at their best.'],
enemyNeutral:['{enemy} in {value}. Don’t assume that means harmless.','{value} is the baseline. We still need a plan for {enemy}.','No extra enemy boost this time. Keep your guard up.','{enemy} is starting in {value}. Let’s see how your build compares.'],
enemy:['You drew {value}. I would study their weaknesses first.','{value} is your opponent. This just got personal.','Against {value}, your build needs more than a dramatic name.','So we are fighting {value}. Let’s make the preparation count.'],
age:['{value} years old. Plenty of story left to write.','At {value}, I would invest in training before posing.','{value}? I am more interested in what you have learned.','Age: {value}. Experience is a separate wheel, apparently.'],
range:['{value}. We still need your exact age before judging the backstory.','An age range of {value}? Let’s narrow that down.','{value}. The birthday reveal gets its own dramatic episode.','Somewhere in {value}. Even the narrator needs more details.'],
ability:['{value}. I want to see the mastery roll before celebrating.','With {value}, creativity could matter as much as raw strength.','You have {value}. Now earn the right to make it look effortless.','{value} is a tool, not an automatic victory. Learn its limits.'],
mastery:['{ability}, but only {value} mastery? Read the manual.','You unlocked {ability} before learning the controls. Classic.','{value} with {ability}. We are doing supervised practice.','That {ability} needs training, not a victory speech.'],
leak:['Huge reserves, {value} control. Full tank, massive leak.','All that energy and {value} control? Stop wasting it.','You have enough energy. What you need is an instruction manual.','Power without control is making your own life harder.'],
iq:['Strong arms, {value} IQ. Please let somebody else plan.','Your muscles are carrying the strategy meeting.','That strength needs a better plan than “hit it again.”','We have the muscle. Now we need someone to read the map.'],
win:['You won. Now tell me you learned something.','Victory! That build actually held together.','You survived the final fight. Enjoy the ending.','The enemy is down. You earned a moment to breathe.'],
loss:['All those spins, and the enemy gets the final speech.','Defeat. Keep the lesson and try another life.','The build had a story. Unfortunately, this was its ending.','We are calling that a very expensive training session.'],
neutral:['{label}: {value}. Let’s see what you make of it.','You got {value}. That adds a new wrinkle to your story.','{value} is part of your build now. The next choice matters.','The wheel picked {value}. Your decisions give it meaning.'],
stat:['{label}: {value}.','You rolled {value} for {label}.','Your {label} came out {value}.','So, {value} {label}.']
};
const specials={
frieza:{Goku:['That Frieza connection looks familiar. Please leave the planet intact.','You remind me of Frieza. I’m hoping the personality is optional.','Frieza-related powers? Let’s use them for sparring, not conquering.','Another fighter with Frieza’s kind of power. This could be interesting.'],Vegeta:['Wonderful. Another Frieza. One was irritating enough.','If you start giving orders like Frieza, this partnership is over.','Frieza’s power without his attitude would be an improvement.','I spent enough time dealing with Frieza. Do not make this nostalgic.']},
limitless:{Yuji:['Limitless? Gojo is going to make this about himself.','You got Limitless. Please tell me the training comes included.','That is Gojo-level homework. I would take notes.','Limitless sounds great. Learning it sounds exhausting.'],Gojo:['Limitless? Excellent taste. The skill is sold separately.','You picked my specialty. I expect very impressive homework.','Another Limitless user? Finally, someone to understand my explanations.','The technique is familiar. Let’s see whether the talent follows.']},
uchiha:{Naruto:['An Uchiha? Great. Please communicate more than Sasuke does.','That clan comes with serious talent. Try smiling occasionally.','Another Uchiha! I’m scheduling friendship and training.','Uchiha, huh? I’m expecting big things and very short conversations.'],Sasuke:['An Uchiha name is a responsibility, not a shortcut.','You carry that clan name. Do something worthy of it.','Being an Uchiha does not excuse poor training.','Another Uchiha. Keep your focus and your own judgment.']},
gum:{Luffy:['That fruit sounds familiar! Show me what you can stretch!','You got my kind of power! Let’s do something ridiculous with it.','Stretchy powers? We are definitely having fun now.','That fruit needs imagination. Fortunately, weird ideas are free.'],Zoro:['Great. More stretching. Try not to launch me anywhere.','Another rubber fighter. The ship is going to suffer.','I already train around one stretchy idiot. Be the careful one.','That fruit is useful. Just keep the experiments away from my nap.']}
};
const lore={
 "Ten Shadows": {
  "Yuji": [
   "That is Megumi’s technique! His shikigami have saved me more than once. Treat them like partners.",
   "Megumi makes Ten Shadows look tactical. I would probably start by making friends with the dogs."
  ],
  "Gojo": [
   "Megumi’s technique has tremendous potential. I expect you to use your head before summoning trouble.",
   "Ten Shadows? I have high expectations for Megumi, and you just volunteered for similar homework."
  ]
 },
 "Boogie Woogie": {
  "Yuji": [
   "Todo’s technique! Fighting beside him taught me how much a well-timed switch can change.",
   "If you can coordinate like Todo, I want you on my team. Please spare me the surprise interview."
  ],
  "Gojo": [
   "Todo has a wonderfully troublesome technique. Timing matters more than a dramatic clap.",
   "Boogie Woogie rewards a sharp mind. Todo would certainly have opinions about your rhythm."
  ]
 },
 "Rasengan": {
  "Naruto": [
   "Jiraiya helped me learn that! I know exactly how much practice goes into making it work.",
   "That technique connects me to my dad and my teacher. Put some heart into learning it."
  ],
  "Sasuke": [
   "Naruto has made that technique very difficult to ignore. Watch your opening before charging.",
   "A Rasengan. I know what Naruto can do with one; now show me your control."
  ]
 },
 "Chidori": {
  "Naruto": [
   "That is Sasuke’s technique! I have been on the wrong end of that rivalry enough times.",
   "Sasuke makes that look effortless. I would rather see you use it beside a friend than against one."
  ],
  "Sasuke": [
   "Kakashi taught me Chidori. Speed without perception leaves you dangerously exposed.",
   "That technique is familiar. Do not imitate my confidence before you develop the control."
  ]
 },
 "Flame-Flame": {
  "Luffy": [
   "That reminds me of Ace and Sabo. That power means a lot more to me than a flashy attack.",
   "Fire like Ace’s? Look after the people beside you. That matters to me."
  ],
  "Zoro": [
   "The captain has family tied to that flame. Treat it with some respect.",
   "A powerful fruit. Ace still had to be a fighter, and so do you."
  ]
 },
 "Op-Op": {
  "Luffy": [
   "That is like Law’s power! His plans are complicated, but I trust him in a fight.",
   "Law does all sorts of strange things with that ability. Can you do something cool too?"
  ],
  "Zoro": [
   "Law uses that fruit with precision. Randomly moving things around is not a strategy.",
   "That reminds me of Law. I appreciate a useful ally who can keep up in a fight."
  ]
 },
 "Petal Storm": {
  "Ichigo": [
   "Byakuya’s blade taught me not to mistake beauty for safety. Watch every angle.",
   "That reminds me of fighting Byakuya. I would take those petals very seriously."
  ],
  "Rukia": [
   "Those petals remind me of my brother’s power. His precision is the part you should study first.",
   "That brings Byakuya’s Senbonzakura to mind. I respect his discipline; I expect you to train carefully."
  ]
 },
 "Ice Prison": {
  "Ichigo": [
   "Ice like that reminds me of Rukia’s sword! I trust her, and I know there is more to that ice than appearances.",
   "Rukia would make you practice the basics before letting you show that off. Listen to her."
  ],
  "Rukia": [
   "Ice brings my Sode no Shirayuki to mind. Beauty does not excuse careless control. Pay attention.",
   "That reminds me of my blade. I will explain the technique, and you will follow the instructions."
  ]
 },
 "Kamehameha": {
  "Goku": [
   "Master Roshi taught me that! I still love seeing what training can do with a familiar technique.",
   "That takes me back to Roshi’s lessons. Show me your stance, then we can practice."
  ],
  "Vegeta": [
   "Kakarot uses that beam constantly. I am interested in whether you can actually aim it.",
   "Another Kamehameha. Do not expect Kakarot’s results just because you copied the technique."
  ]
 },
 "Final Flash": {
  "Goku": [
   "Vegeta puts a lot of power into that! I would definitely give him room to charge it.",
   "That is Vegeta’s attack. He will pretend not to care how well you use it."
  ],
  "Vegeta": [
   "My Final Flash. If you are going to use it, commit to your training.",
   "You chose one of my techniques. I will not tolerate a halfhearted demonstration."
  ]
 },
 "Ice-Make Lance": {
  "Natsu": [
   "Gray’s ice? Great, now I have another person arguing with me about temperature.",
   "That reminds me of Gray. We argue, but I trust him when the guild needs us."
  ],
  "Lucy": [
   "Gray makes that look easy because he has trained hard. Please copy his control, not his clothing habits.",
   "Ice-Make like Gray’s could be a great fit for our team. Natsu will complain anyway."
  ]
 },
 "Celestial Gate": {
  "Natsu": [
   "Lucy’s kind of magic! Her spirits are our friends, so treat them properly.",
   "That reminds me of Lucy. She always finds a way to help when a mission gets messy."
  ],
  "Lucy": [
   "Celestial spirits are partners, not disposable tools. I want you to understand that first.",
   "My kind of magic! The relationship behind a gate matters as much as the power coming through it."
  ]
 },
 "Half-Cold Half-Hot": {
  "Deku": [
   "Todoroki’s quirk! Balancing the two sides gives you options, but it takes real control.",
   "That reminds me of Todoroki. I respect how hard he works to make that power his own."
  ],
  "Bakugo": [
   "Half-and-half’s quirk. Both sides are useful if you stop hesitating.",
   "Todoroki is a serious rival. Having his kind of power does not mean you have earned his skill."
  ]
 },
 "Zero Gravity": {
  "Deku": [
   "Uraraka’s quirk! She finds clever rescue uses for it. I would study those first.",
   "That makes me think of Uraraka. Timing and teamwork can make that ability incredible."
  ],
  "Bakugo": [
   "Round Face made me take that quirk seriously. Do not underestimate what good planning can do.",
   "Zero Gravity? I have seen Uraraka turn falling debris into a real problem. Use your head."
  ]
 },
 "Armored Titan": {
  "Eren": [
   "Reiner’s Titan. I know how dangerous that armor is; I would look for the joints.",
   "That form reminds me of Reiner. I have complicated feelings about the person inside it."
  ],
  "Mikasa": [
   "Reiner’s armor is difficult to cut. The weak points matter more than your anger.",
   "The Armored Titan. I would coordinate the squad before committing to an attack."
  ]
 },
 "Colossal Titan": {
  "Eren": [
   "That Titan changed my life. I cannot look at its power without thinking about the people below it.",
   "The Colossal Titan is overwhelming. Decide who you are protecting before you transform."
  ],
  "Mikasa": [
   "Keep your allies away from the transformation. Power that large demands planning.",
   "That form reminds me of Bertholdt. Heat and scale make approaching it dangerous."
  ]
 },
 "Godspeed": {
  "Gon": [
   "Killua’s technique! He is amazingly fast, and I trust him to watch my back.",
   "Godspeed makes me think of Killua. I want to train harder so I can keep up with him."
  ],
  "Killua": [
   "My Godspeed. You need more than a flashy name to handle electricity properly.",
   "That is my technique. Practice your timing before you start bragging about speed."
  ]
 },
 "Bungee Gum": {
  "Gon": [
   "Hisoka’s ability! It looks simple until he uses it in a way you did not expect.",
   "That reminds me of Hisoka. I want to understand the trick before I get caught by it again."
  ],
  "Killua": [
   "Hisoka’s power. The dangerous part is how he sets traps with it.",
   "Bungee Gum? I would rather understand where Hisoka attached it than listen to him explain it."
  ]
 }
};
const cameoLines={
jjk:[['Which way to the ship?','Gojo','You crossed into another anime and still won’t ask for directions?'],['This school isn’t on my map.','Yuji','Who is this guy, and why does he have three swords?'],['I was following the road.','Gojo','That road crossed a franchise boundary. Impressive.'],['Is the captain here?','Yuji','Wrong team. Wrong school. Possibly wrong universe.']],
naruto:[['This isn’t Wano?','Naruto','Who are you? And how did you get into the village?'],['I took a shortcut.','Sasuke','Through another universe? Your navigation needs work.'],['Which way to the port?','Naruto','We’re a hidden village, not a pirate harbor!'],['The road was straight.','Sasuke','Apparently the dimensions were not.']],
bleach:[['Is this the way back to the ship?','Ichigo','Who is this swordsman? How do you get lost into the afterlife?'],['Nice swords. Wrong harbor, though.','Rukia','Harbor? This is Soul Society. Who let you in?'],['I followed the guy in black.','Ichigo','That describes half the people here!'],['Do you have a map?','Rukia','I can draw one. Will you actually follow it?']],
dragonball:[['This isn’t Wano?','Vegeta','Who let this swordsman onto our planet?'],['Where is the ship?','Goku','Which ship? Wait, how did you even get here?'],['I took the left turn.','Vegeta','You took a turn out of your own universe.'],['I’m looking for a blond cook.','Goku','I know some blond fighters, but I wouldn’t ask them to cook.']]
};
const extra=typeof module!=='undefined'?require('./reactions-extra.js'):root.AWGReactionExtra;
Object.assign(voices,extra.voices);Object.assign(cameoLines,extra.cameos);
const variety=typeof module!=='undefined'?require('./reaction-variety.js'):root.AWGReactionVariety;
for(const [name,moods] of Object.entries(variety.voices)){
 if(!voices[name])voices[name]={bad:[],good:[],neutral:[]};
 for(const mood of ['bad','good','neutral'])voices[name][mood].push(...moods[mood]);
}
specials.frieza.Piccolo=['Frieza’s people taught us what careless preparation costs. Keep your guard up.','A Frost demon’s power deserves a plan. I remember Frieza on Namek.'];
specials.frieza.Bulma=['Frieza again? I am packing extra sensors and an escape vehicle.','A Frost demon like Frieza? I want readings before another planetary incident.'];
function pick(state,key,list,rng){state.dialogueHistory??=[];let choices=list.map((line,i)=>({line,id:key+':'+i})).filter(x=>!state.dialogueHistory.includes(x.id));if(!choices.length){const last=state.dialogueHistory.filter(x=>x.startsWith(key+':')).at(-1);state.dialogueHistory=state.dialogueHistory.filter(x=>!x.startsWith(key+':'));choices=list.map((line,i)=>({line,id:key+':'+i})).filter(x=>list.length===1||x.id!==last);}const choice=choices[Math.floor(rng()*choices.length)%choices.length];state.dialogueHistory.push(choice.id);state.dialogueHistory=state.dialogueHistory.slice(-40);return choice.line;}
function react(state,s,r,pairs,rng=Math.random){
 const pair=pairs[state.world],turn=state.reactionCount||0;state.reactionCount=turn+1;
 const selected=state.results.findLast(x=>x.id==='enemy')?.label;
 const enemy=s.id==='enemy'?r.label:selected||'your enemy';
 const enemyTurn=!!enemy&&enemy!=='your enemy'&&(s.id==='enemy'||(selected&&turn%2===0));
 const speaker=enemyTurn?enemy:pair[turn%pair.length];
 let score=r.score,kind=s.neutral?'neutral':'stat',tag='',frame;
 if(s.id==='enemyLevel'){score=r.label==='Weakened'?5:r.label==='Base form'?3:1;kind=score<3?'enemyBad':score>3?'enemyGood':'enemyNeutral';tag=score<3?'ENEMY ADVANTAGE':score>3?'OPENING FOR YOU':'STAY ALERT';}
 else if(s.id==='enemy'){score=r.score>=4?2:3;kind='enemy';tag=r.score>=4?'DANGEROUS OPPONENT':'OPPONENT REVEALED';}
 else if(s.id==='win'){kind=r.label==='VICTORY'?'win':'loss';frame=r.label==='VICTORY'?10:11;tag=r.label==='VICTORY'?'VICTORY':'DEFEAT';}
 else if(s.id==='exactAge')kind='age';else if(['age','ancientAge'].includes(s.id))kind='range';
 else if(s.id.startsWith('ability'))kind='ability';
 else if(s.id.startsWith('mastery')&&score<=2){kind='mastery';frame=9;}
 else if(s.id==='control'&&score<=2&&(state.results.find(x=>x.id==='energy')?.score||0)>=5){kind='leak';frame=9;}
 else if(s.id==='iq'&&score<=2&&(state.results.find(x=>x.id==='strength')?.score||0)>=4)kind='iq';
 const neutral=['neutral','age','range','ability','enemyNeutral'].includes(kind);
 const mood=neutral?'neutral':score<=2?'bad':score>=4?'good':'neutral';
 if(frame===undefined)frame=!neutral&&score>=6?8:turn%2*4+(mood==='bad'?(score<=1?0:1):mood==='good'?3:2);
 tag=tag||(neutral?'LORE UNLOCKED':score>=6?'MAIN CHARACTER ENERGY':score>=4?'LET THEM COOK':score<=2?'TRAINING ARC NEEDED':'WE TAKE THOSE');
 const ability=state.results.find(x=>x.id==='ability'+s.id.replace('mastery',''))?.label||'that technique';
 const vars={value:r.label,label:s.label||s.id,enemy,ability};
 let line=pick(state,kind,contexts[kind],rng).replace(/\{(\w+)\}/g,(_,k)=>vars[k]);
 const value=r.label.toLowerCase();let special=value.includes('frieza')||value.includes('frost demon')?'frieza':value.includes('limitless')?'limitless':value.includes('uchiha')?'uchiha':value.includes('gum-gum')?'gum':null;
 const reference=Object.keys(lore).find(key=>value.includes(key.toLowerCase())&&lore[key][speaker]);
 if(reference)line+=' '+pick(state,'lore'+reference+speaker,lore[reference][speaker],rng);
 else if(special&&specials[special][speaker])line+=' '+pick(state,special+speaker,specials[special][speaker],rng);
 else if(kind==='enemyBad'&&speaker==='Goku')line+=' '+pick(state,'gokuDanger',['I’m excited for the challenge, but your odds are worse.','I want a good fight too, but we should prepare first.','That sounds exciting to me. It is still bad news for your chances.','Even a fun challenge needs a plan.'],rng);
 else line+=' '+pick(state,speaker+mood,(voices[speaker]||variety.voices[pair[0]])[mood],rng);
 const result={tile:frame>=8?(frame===9?5:4):frame%4,frame,tag,speaker,text:line,benefit:s.id==='enemyLevel'?(score<3?'bad':score>3?'good':'neutral'):mood};
 const named=pair.find(name=>extra.personal[name]?.aliases.some(alias=>r.label.toLowerCase()===alias.toLowerCase()));
 if(named){const p=extra.personal[named];const own=s.id==='enemy'?pick(state,'self'+named,p.own,rng):pick(state,'selfOther'+named,['That is my name on your roll. Let’s see what you do with it.','You got my name? Now I am paying attention.'],rng)+' '+pick(state,'selfVoice'+named,voices[named].neutral,rng);const partner=s.id==='enemy'?pick(state,'partner'+named,p.partner,rng):pair.find(n=>n!==named)+': '+pick(state,'otherPartner'+named,voices[pair.find(n=>n!==named)].neutral,rng);result.text=(s.id==='enemy'?'The wheel chose '+named+' as your opponent.':s.label+': '+r.label+'.')+'\n'+named+': '+own+'\n'+partner;result.speaker=pair.join(' & ');result.frame=score<=2?9:8;result.recognized=named;}
 // Cosmetic only: the cameo never changes a roll, score, or combat odds.
 if(enemyTurn){
  const roster=(typeof module!=='undefined'?require('./battle.js'):root.AWGBattle).roster[state.world];
  const index=roster.indexOf(enemy),trait=variety.enemyTraits[state.world][index]||'my next attack';
  const openings={enemy:['So you drew me. Prepare for '+trait+'.','You are facing '+trait+'. Show me your plan.','We have our matchup. I will make you work for every opening.'],enemyLevel:r.label==='Weakened'?['I am weakened, but '+trait+' can still catch you.','Take the opening if you can. I can still counter.','My condition gives you an advantage. Do not waste it.']:['At '+r.label+', you will need an answer to '+trait+'.','You know my condition. Now show me your preparation.','I am bringing '+trait+' to this fight. Stay alert.'],field:['At '+r.label+', watch the space around '+trait+'.','This battlefield changes our approach. I am watching your footing.','Use the terrain if you like. I am planning around it too.'],advantage:['Your starting condition is '+r.label+'. Let’s see how you adapt.','I noticed your preparation. Can it handle '+trait+'?','The opening exchange will test that setup.'],win:r.label==='VICTORY'?['You won this round. You found an answer to '+trait+'.','I lost the exchange. Your preparation paid off.','You earned that victory. I will remember your approach.']:['I won this round. Train an answer to '+trait+'.','My pressure found the gap in your defense.','The battle is mine. Learn from the opening I used.']};
  result.text=pick(state,'enemy:'+enemy+':'+s.id,openings[s.id]||['You rolled '+r.label+'. I am measuring it against '+trait+'.','That part of your build changes how I approach you.','Show me how '+r.label+' holds up under pressure.'],rng);
  result.speaker=enemy;result.enemySpeaker=true;result.enemyIndex=index;result.recognized=s.id==='enemy'?enemy:undefined;delete result.cameo;
 }else{
  const topics=s.id.startsWith('mastery')?'mastery':s.id.startsWith('ability')?'ability':s.id;
  const details={origin:['Your '+r.label+' background is only the beginning.','A '+r.label+' still has to choose what to stand for.'],tool:['Try the balance of '+r.label+' before the fight.','Practice a recovery after each move with '+r.label+'.'],ability:['Test the range of '+r.label+' before trusting it.','Build a combination around '+r.label+' instead of using it alone.'],mastery:['Practice your timing under pressure.','Consistency matters when the first attempt fails.'],field:['At '+r.label+', keep a route back to your team.','Use '+r.label+' to control where the exchange happens.'],win:r.label==='VICTORY'?['You earned a rest after that victory.','Remember which preparation made the difference.']:['We can review the mistake and train again.','A defeat gives us a specific gap to work on.']};
  if(details[topics])result.text+=' '+pick(state,'detail:'+speaker+':'+topics,details[topics],rng);
  const portrait=variety.portraits.indexOf(speaker);if(portrait>=0)result.portraitIndex=portrait;
 }
 const eligible=!enemyTurn&&!named&&pair.indexOf(speaker)<2&&s.id!=='win'&&state.world!=='onepiece'&&turn>=2&&turn-(state.lastZoroCameo??-100)>=8;
 if(eligible&&rng()<.05){const exchange=pick(state,'cameo'+state.world,cameoLines[state.world].filter(x=>x[1]===speaker),rng);state.lastZoroCameo=turn;result.cameo={guest:'Zoro',host:exchange[1],guestLine:exchange[0],hostLine:exchange[2]};result.frame=pair.indexOf(exchange[1])*4+1;result.speaker=exchange[1];}
 return result;
}
root.AWGDialogue={react};if(typeof module!=='undefined')module.exports=root.AWGDialogue;
})(typeof window!=='undefined'?window:globalThis);
