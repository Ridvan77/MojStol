import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Loader } from '@googlemaps/js-api-loader';
import { TranslateModule } from '@ngx-translate/core';
import { RestaurantLocation } from '../../../Services/restaurant2.service';
import { MapDeleteModalComponent } from '../map-delete-modal/map-delete-modal.component';

@Component({
  selector: 'app-map-modal',
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    MapDeleteModalComponent,
  ],
  templateUrl: './map-modal.component.html',
  styleUrl: './map-modal.component.css',
})
export class MapModalComponent implements OnChanges {
  @Input() location!: RestaurantLocation | null;

  @Output() onSave = new EventEmitter<RestaurantLocation>();
  @Output() onClose = new EventEmitter();

  map: google.maps.Map | undefined;
  draggableMarker: google.maps.marker.AdvancedMarkerElement | undefined;
  clickMarker: google.maps.marker.AdvancedMarkerClickEvent | undefined;
  infoWindow: google.maps.InfoWindow | undefined;

  prevLatitude: number | undefined;
  prevLongitude: number | undefined;

  openDeleteModal: boolean = false;
  hasLocation: boolean = false;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      latitude: [
        null,
        [Validators.required, Validators.min(-90), Validators.max(90)],
      ],
      longitude: [
        null,
        [Validators.required, Validators.min(-180), Validators.max(180)],
      ],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['location'] && this.location) {
      console.log(this.location);
      this.prevLatitude = this.location.latitude;
      this.prevLongitude = this.location.longitude;
      this.form.patchValue({
        latitude: this.location.latitude,
        longitude: this.location.longitude,
      });
      this.hasLocation =
        this.location.latitude != 0 || this.location.longitude != 0;
      console.log(this.hasLocation);
      this.initializeMap();
    }
  }

  async initializeMap() {
    const loader = new Loader({
      apiKey: 'AIzaSyCDpw-Qon63nvQoN37hinNp9fBEnQ_GISw',
      version: 'weekly',
      libraries: ['maps', 'marker'],
    });

    await loader.load();

    // Import libraries
    const { Map, InfoWindow } = (await google.maps.importLibrary(
      'maps'
    )) as google.maps.MapsLibrary;
    const { AdvancedMarkerElement } = (await google.maps.importLibrary(
      'marker'
    )) as google.maps.MarkerLibrary;

    // Set default map position
    const initialPosition = {
      lat: this.location?.latitude!,
      lng: this.location?.longitude!,
    };

    const othersOptions: google.maps.MapOptions = {
      disableDefaultUI: true,
      zoomControl: true,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: false,
    };

    this.map = new Map(document.getElementById('map-modal') as HTMLElement, {
      center: initialPosition,
      zoom: 16,
      mapId: 'DEMO_MAP_ID',
      ...othersOptions,
    });

    this.map.setOptions({
      mapTypeControlOptions: {
        mapTypeIds: [
          google.maps.MapTypeId.ROADMAP,
          google.maps.MapTypeId.SATELLITE,
        ],
      },
    });

    // Initialize the InfoWindow
    this.infoWindow = new InfoWindow();

    // Create draggable marker
    this.draggableMarker = new AdvancedMarkerElement({
      map: this.map,
      position: initialPosition,
      gmpDraggable: true,
    });

    // Add listener for dragend to update position
    this.draggableMarker.addListener('dragend', () => {
      const position = this.draggableMarker!.position;

      const lat = parseFloat((position?.lat as number).toFixed(5));
      const lng = parseFloat((position?.lng as number).toFixed(5));

      this.form.patchValue({
        latitude: lat,
        longitude: lng,
      });

      this.infoWindow?.close();
      this.infoWindow?.setContent(`Pin dropped at: ${lat}, ${lng}`);
      this.infoWindow?.open(this.draggableMarker!.map, this.draggableMarker!);
    });

    this.map.addListener('click', (event: any) => {
      const latLng = event.latLng;

      this.draggableMarker!.position = latLng;

      const lat = parseFloat(latLng.lat().toFixed(5));
      const lng = parseFloat(latLng.lng().toFixed(5));

      this.form.patchValue({
        latitude: lat,
        longitude: lng,
      });

      this.infoWindow?.close();
      this.infoWindow?.setContent(`Pin moved to: ${lat}, ${lng}`);
      this.infoWindow?.open(this.draggableMarker!.map, this.draggableMarker!);
    });
  }

  // Method to update marker position based on input fields
  updateMarkerPosition(): void {
    if (this.form.valid && this.draggableMarker) {
      const lat = this.form.value.latitude;
      const lng = this.form.value.longitude;
      const latLng = new google.maps.LatLng(lat, lng);

      this.draggableMarker.position = latLng;
      this.map?.panTo(latLng);
    }
  }

  isInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return control?.invalid && (control?.dirty || control?.touched);
  }

  closeModal() {
    this.onClose.emit();
  }

  saveChanges() {
    console.log(this.form.invalid);
    if (this.form.invalid) {
      console.log('Forma nije validna!');
      this.form.markAllAsTouched();
      return;
    }

    if (
      this.prevLatitude != this.form.value.latitude ||
      this.prevLongitude != this.form.value.longitude
    ) {
      this.onSave.emit({
        latitude: this.form.value.latitude,
        longitude: this.form.value.longitude,
      });
    }
    this.closeModal();
  }

  deleteWorkingHours() {
    this.openDeleteModal = true;
  }

  closeAndConfirmDelete() {
    console.log('closeAndConfirmDelete');
    this.onSave.emit({
      latitude: 0,
      longitude: 0,
    });
    this.closeModal();
  }

  enableSave() {
    return (
      this.form.valid &&
      (this.form.value.latitude != this.prevLatitude ||
        this.form.value.longitude != this.prevLongitude)
    );
  }
}
