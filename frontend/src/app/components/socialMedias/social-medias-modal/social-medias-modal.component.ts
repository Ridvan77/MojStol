import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  RestaurantSocialMedia,
  SocialMedia,
  SocialMediasService,
} from '../../../Services/social-media.service';
import {
  RestaurantSocialMediaService,
  RestaurantSocialMediaCreateDto,
} from '../../../Services/restaurant-social-media.service';

@Component({
  selector: 'app-social-medias-modal',
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './social-medias-modal.component.html',
  styleUrl: './social-medias-modal.component.css',
})
export class SocialMediasModalComponent implements OnChanges {
  @Input() restaurantId!: number;

  @Input() openModal!: boolean;
  @Input() selectedSocialMedias!: RestaurantSocialMedia[];

  @Output() onSave = new EventEmitter();
  @Output() onClose = new EventEmitter();

  allSocialMedias: SocialMedia[] = [];
  removeSocialMedias: number[] = [];
  removeRestaurantSocialMedias: number[] = [];
  newSocialMedias: number[] = [];

  links: { [key: number]: string } = {
    1: '',
    2: '',
    3: '',
  };

  socialMediasService = inject(SocialMediasService);
  restaurantSocialMediasService = inject(RestaurantSocialMediaService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['openModal'] && this.openModal) {
      this.removeSocialMedias = [];
      this.removeRestaurantSocialMedias = [];
      this.newSocialMedias = [];

      this.fetchSocialMedias();
    }
  }

  isSocialMediaChosen(socialMediaId: number): boolean {
    return this.selectedSocialMedias.some(
      (ssm) => ssm.socialMediaID === socialMediaId
    );
  }

  selectSocialMedia(socialMediaId: number) {
    const restaurantSocialMediasId = this.selectedSocialMedias.find(
      (ssm) => ssm.socialMediaID == socialMediaId
    )?.restaurantSocialMediaID;
    console.log('restaurantTagId: ', restaurantSocialMediasId);

    if (this.newSocialMedias.includes(socialMediaId)) {
      this.newSocialMedias = this.newSocialMedias.filter(
        (socialMediaID) => socialMediaID != socialMediaId
      );
    } else if (this.removeSocialMedias.includes(socialMediaId)) {
      this.removeSocialMedias = this.removeSocialMedias.filter(
        (socialMediaID) => socialMediaID != socialMediaId
      );
      this.removeRestaurantSocialMedias =
        this.removeRestaurantSocialMedias.filter(
          (rsmId) => rsmId != restaurantSocialMediasId!
        );
    } else if (
      this.selectedSocialMedias.some(
        (ssm) => ssm.socialMediaID == socialMediaId
      )
    ) {
      this.removeSocialMedias.push(socialMediaId);
      this.links[socialMediaId] = '';
      this.removeRestaurantSocialMedias.push(restaurantSocialMediasId!);
    } else if (!this.newSocialMedias.includes(socialMediaId)) {
      this.newSocialMedias.push(socialMediaId);
    }

    console.log('New SocialMedias:', this.newSocialMedias);
    console.log('Removed SocialMedias:', this.removeSocialMedias);
    console.log(
      'Removed Restaurant Social Medias:',
      this.removeRestaurantSocialMedias
    );
    console.log('Selected Social Medias:', this.selectedSocialMedias);
  }

  fetchSocialMedias() {
    this.socialMediasService.getAllSocialMedias().subscribe((socialMedias) => {
      this.allSocialMedias = socialMedias;
      console.log(this.allSocialMedias);
    });
  }

  closeModal() {
    this.onClose.emit();
  }

  saveModal() {
    this.onSave.emit();
  }

  saveChanges() {
    if (this.newSocialMedias.length > 0) {
      let newCounter = 0;
      for (let i = 0; i < this.newSocialMedias.length; i++) {
        const socialMediasId = this.newSocialMedias[i];

        const restaurantTagToSend: RestaurantSocialMediaCreateDto = {
          restaurantID: this.restaurantId,
          socialMediaID: socialMediasId,
          link: this.links[socialMediasId],
        };
        this.restaurantSocialMediasService
          .create(restaurantTagToSend)
          .subscribe((x) => {
            newCounter++;
            console.log('Adding social media: ', socialMediasId);
            if (newCounter == this.newSocialMedias.length) {
              this.saveModal();
            }
          });
      }
    }
    if (this.removeRestaurantSocialMedias.length > 0) {
      let removeCounter = 0;

      for (let i = 0; i < this.removeRestaurantSocialMedias.length; i++) {
        const restaurantSocialMediaId = this.removeRestaurantSocialMedias[i];
        this.restaurantSocialMediasService
          .delete(restaurantSocialMediaId)
          .subscribe((x) => {
            removeCounter++;
            console.log('Removing social media: ', restaurantSocialMediaId);
            if (removeCounter == this.removeSocialMedias.length) {
              this.saveModal();
            }
          });
      }
    }

    this.closeModal();
  }
}
