# AgenTek Site

Deployable Vite + React website for AgenTek Labs.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Form configuration

Create a `.env` file using `.env.example` and set:

```bash
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your_form_id
```

Without this variable, the contact form and blueprint form will render but show a configuration error instead of submitting.
