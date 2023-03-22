import { Provider } from 'react-redux';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import Rollbar from 'rollbar';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { io } from 'socket.io-client';

import AuthProvider from './providers/AuthProvider.jsx';
import ServerProvider from './providers/ServerProvider.jsx';
import App from './components/App.jsx';
import resources from './locales/index.js';
import store from './slices/index.js';

const DEFAULT_LANGUAGE = 'ru';

const init = async () => {
  const rollbar = new Rollbar({
    accessToken: 'c3ffc3965ed246f392ac08ff37c8bd46',
    environment: process.env.NODE_ENV,
  });

  const i18n = i18next.createInstance();

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: DEFAULT_LANGUAGE,
      fallbackLng: ['en', 'ru'],
    });

  const socket = io('/', { autoConnect: false });

  return (
    <RollbarProvider instance={rollbar}>
      <ErrorBoundary>
        <I18nextProvider i18n={i18n}>
          <Provider store={store}>
            <AuthProvider>
              <ServerProvider socket={socket}>
                <App />
              </ServerProvider>
            </AuthProvider>
          </Provider>
        </I18nextProvider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

export default init;
