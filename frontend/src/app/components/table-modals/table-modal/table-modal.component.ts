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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Table, TableService } from '../../../Services/table.service';
import { TableDeleteModalComponent } from '../table-delete-modal/table-delete-modal.component';

@Component({
  selector: 'app-table-modal',
  imports: [
    CommonModule,
    FormsModule,
    TableDeleteModalComponent,
    TranslateModule,
    ReactiveFormsModule,
  ],
  templateUrl: './table-modal.component.html',
  styleUrl: './table-modal.component.css',
})
export class TableModalComponent implements OnChanges {
  @Input() restaurantId!: number;
  @Input() table!: Table | null;

  @Output() onSave = new EventEmitter();
  @Output() onClose = new EventEmitter();

  maxTableNumber: number = 0;

  tableSeats: number[] = [4, 6, 8, 10, 12, 14];
  tablesNumber: number[] = [...Array(10)].map((_, index) => index + 1);
  numberOfTables: number = 1;

  tableService = inject(TableService);
  cdr = inject(ChangeDetectorRef);

  openDeleteModal: boolean = false;
  prevSeats: number = 0;
  prevIsFunctional: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['table'] && this.table) {
      console.log(this.table);
      if (this.table?.id == 0) {
        this.tableService.getAll(this.restaurantId).subscribe((x) => {
          this.maxTableNumber = Math.max(
            ...x.resultList.map((t) => t.tableNumber)
          );
        });
        this.numberOfTables = 1;
      }
      this.prevSeats = this.table.seats;
      this.prevIsFunctional = this.table.isFunctional;

      console.log(this.prevSeats);
      console.log(this.prevIsFunctional);
      this.cdr.detectChanges();
    }
  }

  closeModal() {
    this.onClose.emit();
  }

  closeAndSave() {
    this.onClose.emit();
    this.onSave.emit();
  }

  saveChanges() {
    if (this.table?.id == 0) {
      console.log(this.numberOfTables);
      console.log(this.maxTableNumber);
      const tablesDto: Table[] = Array.from(
        { length: this.numberOfTables },
        (_, index) => {
          return {
            ...this.table!,
            tableNumber: this.maxTableNumber + index + 1,
          };
        }
      );
      console.log(tablesDto);
      this.tableService
        .createMultiple(this.restaurantId, tablesDto)
        .subscribe((x) => {
          this.closeAndSave();
        });
    } else if (this.table?.id != 0) {
      this.tableService
        .update(this.restaurantId, this.table?.id!, this.table!)
        .subscribe((x) => {
          this.closeAndSave();
        });
    }
  }

  deleteTable() {
    this.openDeleteModal = true;
  }

  closeAndConfirmDelete() {
    console.log('closeAndConfirmDelete');
    this.tableService
      .delete(this.restaurantId, this.table?.id!)
      .subscribe((x) => {
        this.closeAndSave();
      });
  }

  enableSave() {
    return (
      this.table?.id == 0 ||
      (this.table?.id != 0 &&
        (this.table?.seats != this.prevSeats ||
          this.table.isFunctional != this.prevIsFunctional))
    );
  }
}
