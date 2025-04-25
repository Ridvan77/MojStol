import { Component, OnInit, Inject, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '../../Services/token.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface Language {
  symbol: string;
  name: string;
  image: string;
}

@Component({
  selector: 'app-owner-layout',
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './owner-layout.component.html',
  styleUrl: './owner-layout.component.css',
})
export class OwnerLayoutComponent {
  languages: Language[] = [
    {
      symbol: 'en',
      name: 'english',
      image: 'assets/images/flags/united-kingdom-24px.png',
    },
    {
      symbol: 'bs',
      name: 'bosnian',
      image: 'assets/images/flags/bosnia-and-herzegovina-24px.png',
    },
  ];
  selectedLanguage: Language = this.languages[0];

  translateService = inject(TranslateService);

  isLoggedIn: boolean = false;
  userName: string = '';
  userId: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    // Check if running in the browser
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');

      if (token && !this.tokenService.isTokenExpired(token)) {
        this.isLoggedIn = true;
        const decodedToken = this.tokenService.decodeToken(token);

        this.userName = decodedToken.Name || 'User';
        this.userId = decodedToken.sub;
      } else {
        this.isLoggedIn = false;
      }
    }

    const savedLanguage = localStorage.getItem('language');

    if (savedLanguage) {
      this.translateService.use(savedLanguage);
      console.log('izabrani jezik:', savedLanguage);
    } else {
      const userLocale = navigator.language.startsWith('bs') ? 'bs' : 'en';
      this.translateService.use(userLocale);
      console.log('izabrani jezik:', userLocale);
    }

    this.selectedLanguage =
      this.languages.find(
        (lang) =>
          lang.symbol ===
          (savedLanguage || this.translateService.getBrowserLang())
      ) || this.languages[0];
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      this.isLoggedIn = false;
    }
    this.router.navigate(['/']);
  }

  selectLanguage(languageSymbol: string): void {
    if (this.selectedLanguage.symbol == languageSymbol) {
      return;
    }

    this.translateService.use(languageSymbol);
    localStorage.setItem('language', languageSymbol);
    this.selectedLanguage = this.languages.find(
      (l) => l.symbol == languageSymbol
    )!;

    console.log('izabrani jezik:', this.selectedLanguage.symbol);
  }
}
