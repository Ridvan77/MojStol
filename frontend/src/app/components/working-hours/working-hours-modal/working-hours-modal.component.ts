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
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  WorkingHours,
  WorkingHoursService,
} from '../../../Services/working-hours.service';
import { WorkingHoursDeleteModalComponent } from '../working-hours-delete-modal/working-hours-delete-modal.component';

@Component({
  selector: 'app-working-hours-modal',
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    WorkingHoursDeleteModalComponent,
  ],
  templateUrl: './working-hours-modal.component.html',
  styleUrl: './working-hours-modal.component.css',
})
export class WorkingHoursModalComponent implements OnChanges {
  @Input() workingDays!: WorkingHours[] | null;
  @Input() restaurantId!: number;

  @Output() onSave = new EventEmitter();
  @Output() onClose = new EventEmitter();

  hasWorkingHours: boolean = false;
  prevWorkingDays: WorkingHours[] = [];

  isValidTime: boolean = true;

  openDeleteModal: boolean = false;

  workingHoursService = inject(WorkingHoursService);
  cdr = inject(ChangeDetectorRef);

  getDayName(dayIndex: number): string {
    const days = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    return days[dayIndex];
  }

  getDefaultWorkingHoursSorted(): WorkingHours[] {
    return Array(7)
      .fill(null)
      .map((_, index) => ({
        id: 0,
        day: index,
        openTime: '08:00:00',
        closeTime: '16:00:00',
        isClosed: false,
      }))
      .sort((a, b) => {
        if (a.day === 0) return 1;
        if (b.day === 0) return -1;
        return a.day - b.day;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['workingDays'] && this.workingDays) {
      this.hasWorkingHours = this.workingDays.length != 0 ? true : false;
      if (this.hasWorkingHours == false) {
        this.workingDays = this.getDefaultWorkingHoursSorted();
      }
      console.log(this.hasWorkingHours);
      this.prevWorkingDays = this.workingDays.map((hour) => ({
        ...hour,
      }));
      this.isValidTime = true;
      console.log(this.workingDays);
      console.log(this.getDefaultWorkingHoursSorted());
      this.cdr.detectChanges();
    }
  }

  closeModal() {
    this.onClose.emit();
  }

  closeAndSave() {
    this.onSave.emit();
    this.onClose.emit();
  }

  formatTime(day: WorkingHours, timeType: 'openTime' | 'closeTime') {
    if (timeType === 'openTime') {
      day.openTime = day.openTime + ':00'; // Convert to HH:mm:ss format
    } else if (timeType === 'closeTime') {
      day.closeTime = day.closeTime + ':00'; // Convert to HH:mm:ss format
    }
    const openTime = this.timeToMinutes(day.openTime);
    const closeTime = this.timeToMinutes(day.closeTime);

    console.log(openTime);
    console.log(closeTime);

    if (openTime == 0 && closeTime == 0) {
      this.isValidTime = true;
    } else {
      this.isValidTime = openTime < closeTime;
    }

    console.log(this.isValidTime);

    console.log(day);
  }

  timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  changeIsClosed(day: WorkingHours) {
    console.log(day);
  }

  saveChanges() {
    console.log(this.workingDays);
    if (this.hasWorkingHours == true) {
      this.workingHoursService
        .update(this.restaurantId, this.workingDays!)
        .subscribe((x) => {
          this.closeAndSave();
        });
    }

    if (this.hasWorkingHours == false) {
      this.workingHoursService
        .create(this.restaurantId, this.workingDays!)
        .subscribe((x) => {
          this.closeAndSave();
        });
    }
  }

  deleteWorkingHours() {
    this.openDeleteModal = true;
  }

  closeAndConfirmDelete() {
    console.log('closeAndConfirmDelete');
    this.workingHoursService.delete(this.restaurantId).subscribe((x) => {
      this.closeAndSave();
    });
  }

  enableSave() {
    return (
      this.hasWorkingHours == false ||
      (this.isWorkingHoursChanged() && this.isValidTime)
    );
  }

  isWorkingHoursChanged(): boolean {
    return !this.areArraysEqual(this.prevWorkingDays, this.workingDays!);
  }

  areArraysEqual(arr1: WorkingHours[], arr2: WorkingHours[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      const item1 = arr1[i];
      const item2 = arr2[i];

      if (
        item1.day !== item2.day ||
        item1.openTime !== item2.openTime ||
        item1.closeTime !== item2.closeTime ||
        item1.isClosed !== item2.isClosed
      ) {
        return false;
      }
    }

    return true;
  }
}
