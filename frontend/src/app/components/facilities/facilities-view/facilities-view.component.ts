import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  FacilitiesService,
  RestaurantFacility,
} from '../../../Services/facilities.service';

interface Facility {
  facilitiesId: number;
  name: string;
}

@Component({
  selector: 'app-facilities-view',
  imports: [CommonModule, TranslateModule],
  templateUrl: './facilities-view.component.html',
  styleUrl: './facilities-view.component.css',
})
export class FacilitiesViewComponent implements OnChanges {
  @Input() facilities!: RestaurantFacility[];

  myFacilities: Facility[] = [];

  icons: { [key: string]: string } = {
    Wifi: 'bi bi-wifi',
    Parking: 'bi bi-p-circle',
    View: 'bi bi-sun',
  };

  facilitiesService = inject(FacilitiesService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['facilities']) {
      this.myFacilities = [];

      this.fetchFacilities();
    }
  }

  fetchFacilities() {
    this.facilitiesService.getAllFacilities().subscribe((facilities) => {
      this.myFacilities = facilities
        .filter((f) =>
          this.facilities.some(
            (facility) => f.facilitiesID == facility.facilitiesID
          )
        )
        .map((f) => {
          return { facilitiesId: f.facilitiesID, name: f.name };
        });
    });
  }
}
