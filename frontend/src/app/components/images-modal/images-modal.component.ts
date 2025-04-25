import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../environments/environment.development';
import {
  RestaurantImage,
  RestaurantImageDto,
  RestaurantImageService,
} from '../../Services/restaurant-image.service';

@Component({
  selector: 'app-images-modal',
  imports: [CommonModule, TranslateModule],
  templateUrl: './images-modal.component.html',
  styleUrl: './images-modal.component.css',
})
export class ImagesModalComponent implements OnChanges {
  @Input() openModal!: boolean;

  @Input() restaurantImages!: RestaurantImage[];
  @Input() restaurantId!: number;

  @Output() onSave = new EventEmitter();
  @Output() onClose = new EventEmitter<string>();

  selectedImages: RestaurantImage[] = [];
  newImages: RestaurantImageDto[] = [];
  deleteImages: number[] = [];

  restaurantImageService = inject(RestaurantImageService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['openModal'] && this.openModal) {
      this.selectedImages = [];
      this.newImages = [];
      this.deleteImages = [];

      this.fetchImages();
    }
  }

  fetchImages() {
    this.restaurantImageService.getAll(this.restaurantId).subscribe((x) => {
      this.selectedImages = x.resultList.map((si) => {
        return {
          id: si.id,
          imageUrl: `${environment.serverAddress}/${si.imageUrl}`,
        };
      });
      console.log(this.selectedImages);
    });
  }

  displaySelectedImages(event: Event): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput?.files) {
      const files = Array.from(fileInput.files);

      files.forEach((file) => {
        if (!file.type.startsWith('image/')) {
          alert('Molimo izaberite sliku.');
          return;
        }

        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
          alert('Slika je prevelika. Maksimalna veličina slike je 5MB.');
          return;
        }

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          this.selectedImages.push({
            id: 0,
            imageUrl: e.target?.result as string,
          });
          this.newImages.push({
            base64Image: e.target?.result as string,
          });
        };
        reader.readAsDataURL(file);
      });

      console.log('nove dodate slike', this.newImages);
    }
  }

  removeImage(index: number, imageId: number, imageString: string): void {
    if (imageId != 0) {
      this.deleteImages.push(imageId);
      console.log('stare slike za brisanje', this.deleteImages);
    } else {
      this.newImages = this.newImages.filter(
        (i) => i.base64Image != imageString
      );
      console.log('ostale nove slike nakon brisanje', this.newImages);
    }
    this.selectedImages.splice(index, 1);
  }

  closeModal() {
    this.onClose.emit();
  }

  saveModal() {
    this.onSave.emit();
  }

  saveChanges() {
    console.log('Slike koje ostaju', this.selectedImages);

    if (this.newImages.length > 0) {
      this.restaurantImageService
        .create(this.restaurantId, this.newImages)
        .subscribe((x) => {
          console.log('Saving images: ', this.newImages);
          this.saveModal();
        });
    }
    if (this.deleteImages.length > 0) {
      this.restaurantImageService
        .delete(this.restaurantId, this.deleteImages)
        .subscribe((x) => {
          console.log('Deleting images: ', this.deleteImages);
          this.saveModal();
        });
    }

    this.closeModal();
  }

  enableSave() {
    return this.newImages.length > 0 || this.deleteImages.length > 0;
  }
}
