import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';

import { SvgoService } from '../service/svgo.service';

@Component({
  selector: 'app-compress-setting',
  templateUrl: './compress-setting.component.html',
  styleUrls: ['./compress-setting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompressSettingComponent {
  @HostBinding('class') class = 'grid gap-4';

  multipass$ = this.svgoService.multipass$;
  floatPrecision$ = this.svgoService.floatPrecision$;
  pretty$ = this.svgoService.pretty$;
  plugins$ = this.svgoService.plugins$;

  constructor(private readonly svgoService: SvgoService) {}

  updateMultipass(multipass: boolean) {
    this.multipass$.next(multipass);
  }
  updateFloatPrecision(floatPrecision: number | null) {
    this.floatPrecision$.next(floatPrecision ?? 0);
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
