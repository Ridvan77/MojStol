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
import {
  LogoImage,
  Restaurant2Service,
} from '../../Services/restaurant2.service';

@Component({
  selector: 'app-logo-modal',
  imports: [CommonModule, TranslateModule],
  templateUrl: './logo-modal.component.html',
  styleUrl: './logo-modal.component.css',
})
export class LogoModalComponent implements OnChanges {
  @Input() restaurantId!: number;

  @Input() restaurantLogo!: string | null;
  prevRestaurantLogo: string = '';

  operation: string = '';

  @Output() onSave = new EventEmitter();
  @Output() onClose = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['restaurantLogo'] && this.restaurantLogo) {
      this.prevRestaurantLogo = this.restaurantLogo;
      this.operation = '';
      console.log(this.restaurantLogo);
      console.log(this.operation);
    }
  }

  restaurantService = inject(Restaurant2Service);

  // Method to handle the image file selection
  displaySelectedImage(event: Event): void {
    this.operation = 'add';
    console.log(this.operation);

    const fileInput = event.target as HTMLInputElement;

    if (fileInput?.files && fileInput.files[0]) {
      const file = fileInput.files[0];

      if (!file.type.startsWith('image/')) {
        alert('Molimo izaberite sliku.');
        return;
      }

      const MAX_SIZE = 2 * 1024 * 1024; // 2MB
      if (file.size > MAX_SIZE) {
        alert('Slika je prevelika. Maksimalna veličina slike je 2MB.');
        return;
      }

      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.restaurantLogo = e.target?.result as string;
      };

      reader.readAsDataURL(fileInput.files[0]);
    }
  }

  removeSelectedImage() {
    this.operation = 'remove';
    console.log(this.operation);
    this.restaurantLogo = '/assets/images/restaurant/default-logo.png';
  }

  closeModal() {
    this.onClose.emit();
  }

  closeAndSaveModal() {
    this.onClose.emit();
    this.onSave.emit();
  }

  saveChanges() {
    if (this.operation == 'remove') {
      console.log('obrisano');

      this.restaurantService.deleteLogo(this.restaurantId).subscribe((x) => {
        this.closeAndSaveModal();
      });
    }
    if (this.operation == 'add') {
      console.log('dodano');
      const restaurantLogoDto: LogoImage = {
        base64Image: this.restaurantLogo!,
      };
      console.log(restaurantLogoDto);

      this.restaurantService
        .updateLogo(this.restaurantId, restaurantLogoDto)
        .subscribe((x) => {
          this.closeAndSaveModal();
        });
    }
    this.closeModal();
  }

  defaultLogo() {
    return this.restaurantLogo == '/assets/images/restaurant/default-logo.png';
  }
  showLogoAndRemoveButton() {
    return !this.defaultLogo();
  }
  enableSaveButton() {
    return (
      (this.prevRestaurantLogo !=
        '/assets/images/restaurant/default-logo.png' &&
        this.operation == 'remove') ||
      this.operation == 'add'
    );
  }
}
