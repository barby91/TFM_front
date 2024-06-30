import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule, provideHttpClient, withFetch, withInterceptors, } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { spinnerInterceptor } from './shared/services/interceptors/spinner.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
              importProvidersFrom(HttpClientModule), 
              provideAnimationsAsync(),
              provideHttpClient(
                withFetch(),
                withInterceptors([spinnerInterceptor])
              )
             ]
};
