import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  MenuCategory,
  MenuCategoryService,
} from '../../../Services/menu-category.service';

@Component({
  selector: 'app-menu-category-delete-modal',
  imports: [CommonModule, TranslateModule],
  templateUrl: './menu-category-delete-modal.component.html',
  styleUrl: './menu-category-delete-modal.component.css',
})
export class MenuCategoryDeleteModalComponent {
  modalTitle: string = '';
  @Input() menuCategory!: MenuCategory | null;
  @Input() restaurantId!: number;

  @Output() onSave = new EventEmitter();
  @Output() onClose = new EventEmitter();

  menuCategoryService = inject(MenuCategoryService);

  closeModal() {
    this.onClose.emit();
  }
  saveChanges() {
    this.menuCategoryService
      .delete(this.restaurantId, this.menuCategory?.id!)
      .subscribe((x) => {
        this.onClose.emit();
        this.onSave.emit();
      });
  }
}
