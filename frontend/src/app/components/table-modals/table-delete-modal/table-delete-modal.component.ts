import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-table-delete-modal',
  imports: [CommonModule, TranslateModule],
  templateUrl: './table-delete-modal.component.html',
  styleUrl: './table-delete-modal.component.css',
})
export class TableDeleteModalComponent {
  @Input() openModal!: boolean;
  @Input() tableNumber!: number;

  @Output() onSave = new EventEmitter();
  @Output() onClose = new EventEmitter();

  closeModal() {
    this.onClose.emit();
  }

  saveChanges() {
    this.onClose.emit();
    this.onSave.emit();
  }
}
