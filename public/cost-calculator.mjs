import {estimateCosts} from './cost-model.mjs';
const calculator = document.querySelector('[data-cost-calculator]');
if (calculator) {
  const inputs = {volume:'task-volume',input:'input-tokens',output:'output-tokens',hours:'gpu-hours',replicas:'gpu-replicas'};
  const money = value=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(value).replace(/\.00$/, '');
  const refresh = () => {
    const values = Object.fromEntries(Object.entries(inputs).map(([key,id])=>[key,document.getElementById(id).valueAsNumber]));
    document.getElementById('task-volume-label').textContent = values.volume.toLocaleString('en-GB');
    let valid = true;
    for (const id of Object.values(inputs)) {
      const field = document.getElementById(id);
      field.setAttribute('aria-invalid',String(!field.validity.valid || !Number.isFinite(field.valueAsNumber)));
      valid &&= field.validity.valid && Number.isFinite(field.valueAsNumber);
    }
    try {
      if (!valid) throw new Error('invalid');
      const costs = estimateCosts(values);
      calculator.querySelectorAll('[data-cost]').forEach(el=>{el.textContent=money(costs[el.dataset.cost]);});
      const compare = key => costs.open===costs[key] ? `equal to ${key==='sol'?'Sol':'Luna'} usage` : `${money(Math.abs(costs.open-costs[key]))} ${costs.open<costs[key]?'below':'above'} ${key==='sol'?'Sol':'Luna'} usage`;
      calculator.querySelector('[data-cost-insight]').textContent = `At these assumptions, server rental is ${compare('sol')} and ${compare('luna')}. This is not a whole-service saving.`;
      calculator.querySelector('[data-cost-validation]').textContent = '';
    } catch {
      calculator.querySelectorAll('[data-cost]').forEach(el=>{el.textContent='Check inputs';});
      calculator.querySelector('[data-cost-validation]').textContent = 'Enter whole numbers within the ranges shown by each field.';
      calculator.querySelector('[data-cost-insight]').textContent = 'Complete the assumptions to see an estimate.';
    }
  };
  Object.values(inputs).forEach(id=>document.getElementById(id).addEventListener('input',refresh));
  refresh();
}
