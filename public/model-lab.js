for(const select of document.querySelectorAll('[data-filter]'))select.addEventListener('change',()=>{
 const cards=[...document.querySelectorAll('[data-case]')].filter(x=>x.dataset.case===select.dataset.filter);
 for(const card of cards)card.hidden=select.value!=='all'&&card.dataset[select.value]!=='true';
 const label=[...document.querySelectorAll('[data-count]')].find(x=>x.dataset.count===select.dataset.filter);
 if(label)label.textContent=`${cards.filter(x=>!x.hidden).length} tests shown`;
});
