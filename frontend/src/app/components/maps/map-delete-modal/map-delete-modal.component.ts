import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-map-delete-modal',
  imports: [CommonModule, TranslateModule],
  templateUrl: './map-delete-modal.component.html',
  styleUrl: './map-delete-modal.component.css',
})
export class MapDeleteModalComponent {
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
