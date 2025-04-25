import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { WorkingHours } from '../../../Services/working-hours.service';

@Component({
  selector: 'app-working-hours-view',
  imports: [CommonModule, TranslateModule],
  templateUrl: './working-hours-view.component.html',
  styleUrl: './working-hours-view.component.css',
})
export class WorkingHoursViewComponent implements OnChanges {
  @Input() workingDays!: WorkingHours[];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['workingDays'] && this.workingDays.length != 0) {
      this.sortWorkingDays();
    }
  }

  sortWorkingDays() {
    this.workingDays?.sort((a, b) => {
      if (a.day === 0) return 1;
      if (b.day === 0) return -1;
      return a.day - b.day;
    });
    console.log(this.workingDays);
  }

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

  getDayOfWeek() {
    const date = new Date();
    return date.getDay();
  }
}
