import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  Restaurant,
  Restaurant2Service,
  RestaurantUpdateDto,
} from '../../Services/restaurant2.service';
import {
  customEmailValidator,
  noWhitespaceValidator,
} from '../../shared/validators';

@Component({
  selector: 'app-restaurant-modal',
  imports: [CommonModule, TranslateModule, ReactiveFormsModule],
  templateUrl: './restaurant-modal.component.html',
  styleUrl: './restaurant-modal.component.css',
})
export class RestaurantModalComponent implements OnChanges {
  @Input() restaurant!: Restaurant | null;

  @Output() onSave = new EventEmitter();
  @Output() onClose = new EventEmitter();

  form: FormGroup;
  restaurantService = inject(Restaurant2Service);
  cdr = inject(ChangeDetectorRef);

  prevName: string = '';
  prevDescription: string = '';
  prevContactNumber: string = '';
  prevContactEmail: string = '';
  prevStreet: string = '';
  prevWebSite: string | null = '';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, noWhitespaceValidator()]],
      description: ['', [Validators.maxLength(500), noWhitespaceValidator()]],
      contactNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(\+?[0-9]{1,3})?([ -]?)\(?[0-9]{1,4}\)?([ -]?)\(?[0-9]{1,4}\)?([ -]?)\(?[0-9]{1,4}\)?$/
          ),
        ],
      ],
      contactEmail: [
        '',
        [Validators.required, Validators.email, customEmailValidator()],
      ],
      street: ['', [Validators.required, noWhitespaceValidator()]],
      webSite: [
        '',
        [
          Validators.pattern(
            /^www\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}(\.[a-zA-Z]{2})?$/
          ),
        ],
      ],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['restaurant'] && this.restaurant) {
      console.log(this.restaurant);
      this.form.patchValue({
        name: this.restaurant.name,
        description: this.restaurant.description,
        contactNumber: this.restaurant.contactNumber,
        contactEmail: this.restaurant.contactEmail,
        street: this.restaurant.street,
        webSite: this.restaurant.webSite,
      });
      this.prevName = this.restaurant.name;
      this.prevDescription = this.restaurant.description;
      this.prevContactNumber = this.restaurant.contactNumber;
      this.prevContactEmail = this.restaurant.contactEmail;
      this.prevStreet = this.restaurant.street;
      this.prevWebSite = this.restaurant.webSite;
      console.log(this.prevWebSite == '');
      this.cdr.detectChanges();
    }
  }

  closeModal() {
    this.form.reset();
    this.onClose.emit();
  }
  saveModal() {
    this.onSave.emit();
  }

  isInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return control?.invalid && (control?.dirty || control?.touched);
  }

  saveChanges() {
    console.log(this.form.invalid);

    if (this.form.invalid) {
      console.log('Forma nije validna!');
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;

    const restaurantToSend: RestaurantUpdateDto = {
      name: formValue.name.trim(),
      description: formValue.description.trim(),
      contactNumber: formValue.contactNumber,
      contactEmail: formValue.contactEmail,
      street: formValue.street.trim(),
      webSite: formValue.webSite || null,

      ownerId: this.restaurant?.ownerId!,
      cityId: this.restaurant?.cityId!,
      restaurantTypeId: this.restaurant?.restaurantTypeId!,
    };

    console.log(restaurantToSend);

    this.restaurantService
      .update(Number(this.restaurant?.id), restaurantToSend)
      .subscribe((x) => {
        console.log('spasene izmjene restorana');
        this.closeModal();
        this.saveModal();
      });
  }

  enableSave() {
    return (
      this.form.valid &&
      (this.prevName != this.form.value.name.trim() ||
        this.prevDescription != this.form.value.description.trim() ||
        this.prevContactNumber != this.form.value.contactNumber ||
        this.prevContactEmail != this.form.value.contactEmail ||
        this.prevStreet != this.form.value.street.trim() ||
        this.prevWebSite != (this.form.value.webSite || null))
    );
  }
}
