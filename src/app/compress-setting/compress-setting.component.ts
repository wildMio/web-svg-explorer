import { AsyncPipe } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  HostBinding,
  inject,
} from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';

import { SvgoService } from '../service/svgo.service';

@Component({
  selector: 'app-compress-setting',
  templateUrl: './compress-setting.component.html',
  styleUrls: ['./compress-setting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatSlideToggle, MatSlider, MatSliderThumb, AsyncPipe],
})
export class CompressSettingComponent {
  private readonly svgoService = inject(SvgoService);

  @HostBinding('class') class = 'grid gap-4';

  multipass$ = this.svgoService.multipass$;
  floatPrecision$ = this.svgoService.floatPrecision$;
  transformPrecision$ = this.svgoService.transformPrecision$;
  pretty$ = this.svgoService.pretty$;
  plugins$ = this.svgoService.plugins$;

  updateMultipass(multipass: boolean) {
    this.multipass$.next(multipass);
  }
  updateFloatPrecision(floatPrecision: number | null) {
    this.floatPrecision$.next(floatPrecision ?? 0);
  }
  updateTransformPrecision(transformPrecision: number | null) {
    this.transformPrecision$.next(transformPrecision ?? 0);
  }
  updatePretty(pretty: boolean) {
    this.pretty$.next(pretty);
  }
  updatePlugin(
    plugin: { id: string; name: string },
    active: boolean,
    index: number
  ) {
    this.plugins$.getValue().splice(index, 1, { ...plugin, active });
    this.plugins$.next(this.plugins$.getValue());
  }
}
