import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SocialMediasService } from '../../../Services/social-media.service';
import {
  RestaurantSocialMediaService,
  RestaurantSocialMedia,
} from '../../../Services/restaurant-social-media.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// interface SocialMedia {
//   socialMediaId: number;
//   name: string;
// }

@Component({
  selector: 'app-social-media-view',
  imports: [CommonModule, TranslateModule],
  templateUrl: './social-medias-view.component.html',
  styleUrl: './social-medias-view.component.css',
})
export class SocialMediasViewComponent implements OnChanges, OnInit {
  @Input() socialMedias!: RestaurantSocialMedia[];

  restaurantId = 0;
  mySocialMedias: RestaurantSocialMedia[] = [];

  icons: { [key: string]: string } = {
    Facebook: 'bi bi-facebook',
    Instagram: 'bi bi-instagram',
    TikTok: 'bi bi-tiktok',
  };

  socialMediasService = inject(SocialMediasService);
  restauranSocialMediasService = inject(RestaurantSocialMediaService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  ngOnInit(): void {
    this.restaurantId = this.route.snapshot.params['id'];
    this.fetchSocialMedias();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['socialMedias']) {
      this.mySocialMedias = [];

      this.fetchSocialMedias();
    }
  }

  fetchSocialMedias() {
    this.restauranSocialMediasService
      .getRestaurantSocialMediaByRestaurant(this.restaurantId)
      .subscribe((socialMedias) => {
        this.mySocialMedias = socialMedias.filter((sm) =>
          this.socialMedias.some(
            (socialMedia) =>
              sm.restaurantSocialMediaID == socialMedia.restaurantSocialMediaID
          )
        );
      });
  }
}
