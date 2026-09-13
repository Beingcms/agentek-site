const tour = [
  ['Describe the task','Explain the result you want.','“Turn a message into a short answer that follows our policy.” Your task can be different. Tell us what the AI receives, what it should return and what a mistake would mean.','You bring','A task, a few representative examples and someone who knows the right answer.'],
  ['Show good examples','Show us how your team gets it right.','Pair a typical input with the correct answer. Include unusual cases and times when the AI should ask for help. AgenTek helps prepare the examples and keeps final tests separate from training.','You review','The examples, correct answers and rules. Synthetic examples are labelled and need review too.'],
  ['Compare the answers','Decide using evidence.','Try the same task on a baseline and a candidate. If customisation is useful, fine-tune a supported model, then compare on the reserved tests. Check actual answers, critical errors and the assumptions behind cost estimates.','You receive','Before-and-after evidence. A result below the agreed standard stays blocked from release.'],
  ['Use it in your work','Choose how your team will use it.','Try the saved model in the Studio first. For business use, AgenTek scopes an endpoint your software can call or a package your technical team can run. Further changes go through another review and test cycle.','We agree together','Hosting, integration, access, infrastructure costs and support. Production deployment is a separate qualification step.']
];
document.querySelectorAll('[data-tour]').forEach(button=>button.addEventListener('click',()=>{
  const i=Number(button.dataset.tour),item=tour[i],panel=document.querySelector('#tour-panel');
  document.querySelectorAll('[data-tour]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  panel.replaceChildren();
  const add=(tag,value,className,parent=panel)=>{const el=document.createElement(tag);el.textContent=value;if(className)el.className=className;parent.append(el);return el;};
  add('span',`0${i+1} / ${item[0]}`,'eyebrow text-purple');add('h3',item[1]);add('p',item[2]);
  const example=add('div','','tour-example');add('span',item[3],'',example);add('strong',item[4],'',example);
  add('p','This is an illustrated walkthrough, not a live model response. No data is uploaded here.','studio-caption');
}));
