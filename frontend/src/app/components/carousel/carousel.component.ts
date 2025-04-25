import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../environments/environment.development';
import { RestaurantImageService } from '../../Services/restaurant-image.service';

@Component({
  selector: 'app-carousel',
  imports: [CommonModule, TranslateModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css',
})
export class CarouselComponent implements OnChanges {
  @Input() restaurantId!: number;
  @Input() imagesChanged!: boolean;

  activeIndex: number = 0;

  imagesString: string[] = [];

  restaurantImageService = inject(RestaurantImageService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imagesChanged']) {
      this.imagesString = [];

      this.fetchImages();

      this.activeIndex = 0;
    }
  }

  fetchImages() {
    this.restaurantImageService.getAll(this.restaurantId).subscribe((x) => {
      this.imagesString = x.resultList.map(
        (r) => `${environment.serverAddress}/${r.imageUrl}`
      );
    });
  }

  prevSlide(): void {
    this.activeIndex =
      (this.activeIndex - 1 + this.imagesString.length) %
      this.imagesString.length;
  }

  nextSlide(): void {
    this.activeIndex = (this.activeIndex + 1) % this.imagesString.length;
  }
}
