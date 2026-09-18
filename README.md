# Finance Tracker

A responsive personal finance tracker built with React and Vite.

## Features

- Dashboard with income, expenses, balance, and budget overview
- Add, edit, delete, search, filter, and sort transactions
- Budget management
- Analytics with spending and monthly trend charts
- Multi-currency display and exchange-rate conversion
- Browser persistence with localStorage
- Responsive layout

## Tech stack

- React
- Vite
- React Router
- Recharts
- Axios
- React Hook Form + Yup
- Framer Motion
- React Toastify

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Deployment

The current app stores transactions and budgets in the browser using localStorage. This means data is tied to the browser/device and is not shared across devices.

If a backend is added later, configure `VITE_API_BASE_URL` in the hosting provider's environment variables.
