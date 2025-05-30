import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { AuthInterceptor } from './app/auth/auth.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  ...appConfig, // ← здесь все маршруты
  providers: [
    ...appConfig.providers,
    provideHttpClient(
      withInterceptors([AuthInterceptor])
    )
  ]
})
  .catch((err) => console.error(err));
