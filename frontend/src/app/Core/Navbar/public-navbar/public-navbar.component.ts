import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TokenService } from '../../../Services/token.service';

interface Language {
  symbol: string;
  name: string;
  image: string;
}

@Component({
  selector: 'app-public-navbar',
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './public-navbar.component.html',
  styleUrls: ['./public-navbar.component.css'],
})
export class PublicNavbarComponent implements OnInit {
  isLoggedIn = false;
  userName = '';
  userRole = '';
  userId = '';

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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    // Check if running in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn = !!this.tokenService.getToken();
      if (this.isLoggedIn) {
        const user = this.tokenService.getUser();
        console.log(user, 'FROM NAVBAR');
        this.userId = user.sub;
        this.userName = user.Name;
        this.userRole = this.tokenService.getUserRole(
          this.tokenService.getToken() || ''
        );
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
      this.tokenService.signOut();
      this.isLoggedIn = false;
      this.ngOnInit();
    }
    this.router.navigate(['/login']);
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
