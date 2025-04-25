import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FacilitiesService,
  Facility,
  RestaurantFacility,
} from '../../../Services/facilities.service';
import {
  RestaurantFacilitiesService,
  RestaurantFacilityCreateDto,
} from '../../../Services/restaurant-facilities.service';

@Component({
  selector: 'app-facilities-modal',
  imports: [CommonModule, TranslateModule],
  templateUrl: './facilities-modal.component.html',
  styleUrl: './facilities-modal.component.css',
})
export class FacilitiesModalComponent implements OnChanges {
  @Input() restaurantId!: number;

  @Input() openModal!: boolean;
  @Input() selectedFacilities!: RestaurantFacility[];

  @Output() onSave = new EventEmitter();
  @Output() onClose = new EventEmitter();

  allFacilities: Facility[] = [];
  removeFacilities: number[] = [];
  removeRestaurantFacilities: number[] = [];
  newFacilities: number[] = [];

  facilitiesService = inject(FacilitiesService);
  restaurantFacilitiesService = inject(RestaurantFacilitiesService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['openModal'] && this.openModal) {
      console.log(this.selectedFacilities);
      this.removeFacilities = [];
      this.removeRestaurantFacilities = [];
      this.newFacilities = [];

      this.fetchFacilities();
    }
  }

  isFacilityChosen(facilitiesId: number): boolean {
    return this.selectedFacilities.some(
      (sf) => sf.facilitiesID === facilitiesId
    );
  }

  selectFacility(facilitiesId: number) {
    const restaurantFacilitiesId = this.selectedFacilities.find(
      (sf) => sf.facilitiesID == facilitiesId
    )?.restaurantFacilitiesID;
    console.log('restaurantTagId: ', restaurantFacilitiesId);

    if (this.newFacilities.includes(facilitiesId)) {
      this.newFacilities = this.newFacilities.filter(
        (facilitiesID) => facilitiesID != facilitiesId
      );
    } else if (this.removeFacilities.includes(facilitiesId)) {
      this.removeFacilities = this.removeFacilities.filter(
        (facilitiesID) => facilitiesID != facilitiesId
      );
      this.removeRestaurantFacilities = this.removeRestaurantFacilities.filter(
        (rfId) => rfId != restaurantFacilitiesId!
      );
    } else if (
      this.selectedFacilities.some((sf) => sf.facilitiesID == facilitiesId)
    ) {
      this.removeFacilities.push(facilitiesId);
      this.removeRestaurantFacilities.push(restaurantFacilitiesId!);
    } else if (!this.newFacilities.includes(facilitiesId)) {
      this.newFacilities.push(facilitiesId);
    }

    console.log('New Facilities:', this.newFacilities);
    console.log('Removed Facilities:', this.removeFacilities);
    console.log(
      'Removed Restaurant Facilities:',
      this.removeRestaurantFacilities
    );
    console.log('Selected Facilities:', this.selectedFacilities);
  }

  fetchFacilities() {
    this.facilitiesService.getAllFacilities().subscribe((facilities) => {
      this.allFacilities = facilities;
      console.log(this.allFacilities);
    });
  }

  closeModal() {
    this.onClose.emit();
  }

  saveModal() {
    this.onSave.emit();
  }

  saveChanges() {
    if (this.newFacilities.length > 0) {
      let newCounter = 0;
      for (let i = 0; i < this.newFacilities.length; i++) {
        const facilitiesId = this.newFacilities[i];

        const restaurantTagToSend: RestaurantFacilityCreateDto = {
          restaurantID: this.restaurantId,
          facilitiesID: facilitiesId,
          isActive: true,
        };
        this.restaurantFacilitiesService
          .create(restaurantTagToSend)
          .subscribe((x) => {
            newCounter++;
            console.log('Adding facility: ', facilitiesId);
            if (newCounter == this.newFacilities.length) {
              this.saveModal();
            }
          });
      }
    }
    if (this.removeRestaurantFacilities.length > 0) {
      let removeCounter = 0;
      for (let i = 0; i < this.removeRestaurantFacilities.length; i++) {
        const restaurantFacilityId = this.removeRestaurantFacilities[i];

        this.restaurantFacilitiesService
          .delete(restaurantFacilityId)
          .subscribe((x) => {
            removeCounter++;
            console.log('Removing facility: ', restaurantFacilityId);
            if (removeCounter == this.removeFacilities.length) {
              this.saveModal();
            }
          });
      }
    }

    this.closeModal();
  }
}
