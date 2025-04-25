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
import { MenuItem, MenuItemService } from '../../../Services/menu-item.service';
import { noWhitespaceValidator } from '../../../shared/validators';

@Component({
  selector: 'app-menu-item-modal',
  imports: [CommonModule, TranslateModule, ReactiveFormsModule],
  templateUrl: './menu-item-modal.component.html',
  styleUrl: './menu-item-modal.component.css',
})
export class MenuItemModalComponent implements OnChanges {
  @Input() restaurantId!: number;
  @Input() menuItem!: MenuItem | null;

  @Output() onSave = new EventEmitter();
  @Output() onClose = new EventEmitter();

  form: FormGroup;
  menuItemService = inject(MenuItemService);
  cdr = inject(ChangeDetectorRef);

  prevName: string = '';
  prevDescription: string | null = '';
  prevPrice: number = 0;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          noWhitespaceValidator(),
        ],
      ],
      description: ['', [Validators.maxLength(255)]],
      price: [null, [Validators.required, Validators.min(0.1)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['menuItem'] && this.menuItem) {
      console.log(this.menuItem);
      this.form.patchValue({
        name: this.menuItem.name,
        description: this.menuItem.description,
        price: this.menuItem.price,
      });
      this.prevName = this.menuItem.name;
      this.prevDescription = this.menuItem.description;
      console.log(this.prevDescription == '');
      this.prevPrice = this.menuItem.price;
      this.cdr.detectChanges();
    }
  }

  closeModal() {
    this.form.reset();
    this.onClose.emit();
  }

  closeAndSave() {
    this.onSave.emit();
    this.onClose.emit();
    this.form.reset();
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

    const menuToSend: MenuItem = {
      id: this.menuItem?.id!,
      name: formValue.name.trim(),
      description: formValue.description?.trim() || null,
      price: formValue.price,
      menuCategoryId: this.menuItem?.menuCategoryId!,
    };

    console.log(menuToSend);
    if (this.menuItem?.id == 0) {
      this.menuItemService
        .create(this.restaurantId, menuToSend)
        .subscribe((x) => {
          this.closeAndSave();
        });
    } else if (this.menuItem?.id != 0) {
      this.menuItemService
        .update(this.restaurantId, this.menuItem?.id!, menuToSend)
        .subscribe((x) => {
          this.closeAndSave();
        });
    }
  }

  enableSave() {
    return (
      this.form.valid &&
      (this.prevName != this.form.value.name.trim() ||
        this.prevDescription != (this.form.value.description?.trim() || null) ||
        this.prevPrice != this.form.value.price)
    );
  }
}
