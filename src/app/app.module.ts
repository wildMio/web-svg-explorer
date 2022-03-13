import { A11yModule } from '@angular/cdk/a11y';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { CompressSettingComponent } from './compress-setting/compress-setting.component';
import { InjectHTMLDirective } from './directive/inject-html.directive';
import { VirtualElementDirective } from './directive/virtual-element.directive';
import { MatchPipe } from './pipe/match.pipe';
import { SvgCardComponent } from './svg-card/svg-card.component';

@NgModule({
  declarations: [
    AppComponent,
    SvgCardComponent,
    InjectHTMLDirective,
    VirtualElementDirective,
    CompressSettingComponent,
    MatchPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    A11yModule,
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
