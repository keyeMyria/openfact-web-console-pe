import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private translate: TranslateService) {
    this.translate.addLangs(["en", "es"]);
    this.translate.setDefaultLang("en");
    this.translate.use("es");
  }

}
