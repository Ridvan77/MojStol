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
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  MenuCategory,
  MenuCategoryService,
} from '../../../Services/menu-category.service';
import { noWhitespaceValidator } from '../../../shared/validators';

@Component({
  selector: 'app-menu-category-modal',
  imports: [CommonModule, FormsModule, TranslateModule, ReactiveFormsModule],
  templateUrl: './menu-category-modal.component.html',
  styleUrl: './menu-category-modal.component.css',
})
export class MenuCategoryModalComponent implements OnChanges {
  @Input() restaurantId!: number;
  @Input() menuCategory!: MenuCategory | null;

  @Output() onSave = new EventEmitter();
  @Output() onClose = new EventEmitter();

  form: FormGroup;
  menuCategoryService = inject(MenuCategoryService);
  cdr = inject(ChangeDetectorRef);

  prevCategoryName: string = '';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      categoryName: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          noWhitespaceValidator(),
        ],
      ],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['menuCategory'] && this.menuCategory) {
      console.log(this.menuCategory);
      this.form.patchValue({
        categoryName: this.menuCategory.name,
      });
      this.prevCategoryName = this.menuCategory.name;
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

    const menuCategoryToSend: MenuCategory = {
      id: this.menuCategory?.id!,
      name: formValue.categoryName.trim(),
      categoryType: this.menuCategory?.categoryType!,
    };

    console.log(menuCategoryToSend);

    if (this.menuCategory?.id == 0) {
      this.menuCategoryService
        .create(this.restaurantId, menuCategoryToSend)
        .subscribe((x) => {
          this.closeAndSave();
        });
    } else if (this.menuCategory?.id != 0) {
      this.menuCategoryService
        .update(this.restaurantId, this.menuCategory?.id!, menuCategoryToSend)
        .subscribe((x) => {
          this.closeAndSave();
        });
    }
  }

  enableSave() {
    return (
      this.form.valid &&
      this.prevCategoryName != this.form.value.categoryName.trim()
    );
  }
}
