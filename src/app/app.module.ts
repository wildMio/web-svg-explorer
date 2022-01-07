import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { SvgCardComponent } from './svg-card/svg-card.component';
import { InjectHTMLDirective } from './directive/inject-html.directive';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [AppComponent, SvgCardComponent, InjectHTMLDirective],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule,
    MatCheckboxModule,
    OverlayModule,
    ClipboardModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
