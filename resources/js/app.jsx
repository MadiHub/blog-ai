import '../css/app.css';
import './bootstrap';

import React from 'react';
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'

createInertiaApp({
  resolve: async name => {
    const pages = import.meta.glob('./Pages/**/*.jsx');
    const page = await pages[`./Pages/${name}.jsx`]();
    return page.default;
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
    progress: false,

});
