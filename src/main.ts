import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from 'environments/environment';
import { AppModule } from 'app/app.module';
//import 'angular2-notifications/dist';

if (environment.production) {
  enableProdMode();
}
enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule);
