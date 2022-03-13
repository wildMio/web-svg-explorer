import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'match',
})
export class MatchPipe implements PipeTransform {
  transform<T>(value: T, target: T): boolean {
    return value === target;
  }
}
