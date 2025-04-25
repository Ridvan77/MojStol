import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stars-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stars-rating.component.html',
  styleUrl: './stars-rating.component.css',
})
export class StarsRatingComponent {
  @Input() rating!: number | undefined;

  getFullStars(): number[] {
    return Array(Math.floor(this.rating!)).fill(0);
  }

  hasHalfStars(): boolean {
    return this.rating! % 1 != 0;
  }
  getEmptyStars(): number[] {
    return Array(5 - Math.ceil(this.rating!)).fill(0);
  }
}
