/* AgenTek's public website interactions. Scenario text is authored fiction.
   Only the enquiry form contacts a service; examples never invoke a model. */
document.documentElement.classList.add('js');

document.querySelectorAll('[data-current-year]').forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});

const menuButton = document.querySelector('[data-nav-toggle]');
const menu = document.querySelector('[data-nav-links]');
if (menuButton && menu) {
  const closeMenu = () => {
    menu.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = 'Menu';
  };
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? 'Close' : 'Menu';
    menu.classList.toggle('is-open', open);
  });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  menuButton.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
  menu.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { closeMenu(); menuButton.focus(); }
  });
}

const scenarioTabs = [...document.querySelectorAll('[data-scenario-tab]')];
function selectScenario(tab, focus = false) {
  scenarioTabs.forEach((candidate) => {
    const selected = candidate === tab;
    candidate.setAttribute('aria-selected', String(selected));
    candidate.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(candidate.getAttribute('aria-controls'));
    if (panel) panel.hidden = !selected;
  });
  if (focus) tab.focus();
}
scenarioTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectScenario(tab));
  tab.addEventListener('keydown', (event) => {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % scenarioTabs.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + scenarioTabs.length) % scenarioTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = scenarioTabs.length - 1;
    selectScenario(scenarioTabs[next], true);
  });
});

// Preserve the existing endpoint and its four-field delivery contract.
// A failed submission retains entered details and offers a user-initiated fallback.
document.querySelectorAll('[data-enquiry-form]').forEach((form) => {
  const status = form.querySelector('[data-form-status]');
  const submit = form.querySelector('button[type="submit"]');
  const defaultLabel = submit.textContent;
  submit.disabled = false;
  let sending = false;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    sending = true;
    const fields = new FormData(form);
    const payload = Object.fromEntries(['name', 'email', 'phone', 'company'].map((key) => [key, String(fields.get(key) || '').trim()]));
    submit.disabled = true;
    submit.textContent = 'Sending your request…';
    form.setAttribute('aria-busy', 'true');
    status.className = 'form-status';
    status.textContent = 'Sending…';
    try {
      const response = await fetch('/api/book-strategy-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok !== true) throw new Error('delivery_failed');
      form.reset();
      status.className = 'form-status is-success';
      status.textContent = 'Thank you. Your request has been sent to AgenTek. We’ll be in touch to discuss the fit.';
    } catch {
      status.className = 'form-status is-error';
      status.textContent = 'We could not confirm delivery. Your details are still here. You can try again, email chandra@agentek.co.uk, or ';
      const fallback = document.createElement('a');
      const message = [
        `Hello AgenTek, I would like to discuss ${form.dataset.enquiryForm || 'a model pilot'}.`,
        `Name: ${payload.name}`, `Email: ${payload.email}`,
        `Phone: ${payload.phone || 'Not provided'}`, `Company: ${payload.company || 'Not provided'}`,
      ].join('\n');
      fallback.href = `sms:+447534524985?body=${encodeURIComponent(message)}`;
      fallback.textContent = 'open a text message draft';
      status.append(fallback, '. You choose whether to send it.');
    } finally {
      sending = false;
      submit.disabled = false;
      submit.textContent = defaultLabel;
      form.removeAttribute('aria-busy');
    }
  });
});
