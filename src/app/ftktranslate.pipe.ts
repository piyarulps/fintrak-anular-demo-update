import { Pipe, PipeTransform } from '@angular/core';
import languages from './shared/models/languages';
import { AppConfigService } from './shared/services/app.config.service';

@Pipe({
  name: 'ftktranslate'
})
export class FtktranslatePipe implements PipeTransform {
  defaultLang = 'en';
  constructor(private appConfigServ: AppConfigService) {
    this.defaultLang = this.appConfigServ.LANG;
  }

  transform(value: any, ...args: any[]): any {
    value= value.trim();
    const translated_word = typeof languages[this.defaultLang][value] !== 'undefined'
      ? languages[this.defaultLang][value] : value;
    return translated_word;
  }

}
