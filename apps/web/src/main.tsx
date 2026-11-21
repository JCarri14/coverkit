import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';
import { parseLocation } from './routing';

const { mode, locale } = parseLocation(window.location.pathname);
hydrateRoot(document.getElementById('root')!, <React.StrictMode><App initialMode={mode} initialLocale={locale}/></React.StrictMode>);
