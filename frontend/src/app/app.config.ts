import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi   } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptorProvider } from './services/auth.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptorsFromDi() // Habilita interceptores DI tradicionales
    ),
    authInterceptorProvider,
    provideAnimations(),
  ]
};
