import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { registerSharedUiElements } from '@poc/ui-components/shared-elements';
import 'zone.js';

registerSharedUiElements();

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
  ],
}).catch(err => console.error(err));
