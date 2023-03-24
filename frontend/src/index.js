import { createRoot } from 'react-dom/client';

import init from './init.jsx';

const app = async () => {
  const mountNode = document.getElementById('chat');
  const root = createRoot(mountNode);
  root.render(await init());
};

app();
