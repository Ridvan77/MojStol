import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-working-hours-delete-modal',
  imports: [CommonModule, TranslateModule],
  templateUrl: './working-hours-delete-modal.component.html',
  styleUrl: './working-hours-delete-modal.component.css',
})
export class WorkingHoursDeleteModalComponent {
  @Input() openModal!: boolean;

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
