import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  ApplicationConfig,
  isDevMode,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { inject } from '@vercel/analytics';
import { APP_ROUTES } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(APP_ROUTES),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    provideAppInitializer(() => {
      inject({ mode: isDevMode() ? 'development' : 'production' });
    }),
  ],
};
