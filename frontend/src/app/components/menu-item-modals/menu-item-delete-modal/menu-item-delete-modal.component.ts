import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MenuItem, MenuItemService } from '../../../Services/menu-item.service';

@Component({
  selector: 'app-menu-item-delete-modal',
  imports: [CommonModule, TranslateModule],
  templateUrl: './menu-item-delete-modal.component.html',
  styleUrl: './menu-item-delete-modal.component.css',
})
export class MenuItemDeleteModalComponent {
  @Input() menuItem!: MenuItem | null;
  @Input() restaurantId!: number;

  @Output() onSave = new EventEmitter();
  @Output() onClose = new EventEmitter();

  menuItemService = inject(MenuItemService);

  closeModal() {
    this.onClose.emit();
  }
  saveChanges() {
    this.menuItemService
      .delete(this.restaurantId, this.menuItem?.id!)
      .subscribe((x) => {
        this.onSave.emit();
        this.onClose.emit();
      });
  }
}
