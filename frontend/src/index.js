import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';

import './i18n.js';
import App from './App.jsx';

const mountNode = document.getElementById('chat');
const root = createRoot(mountNode);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
