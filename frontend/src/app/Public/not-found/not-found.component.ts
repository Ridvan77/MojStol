import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, TranslateModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent implements OnInit {
  translateService = inject(TranslateService);

  ngOnInit(): void {
    const savedLanguage = localStorage.getItem('language');

    if (savedLanguage) {
      this.translateService.use(savedLanguage);
      console.log('izabrani jezik:', savedLanguage);
    } else {
      const userLocale = navigator.language.startsWith('bs') ? 'bs' : 'en';
      this.translateService.use(userLocale);
      console.log('izabrani jezik:', userLocale);
    }
  }
}
