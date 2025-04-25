import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { TranslateModule } from '@ngx-translate/core';
import { RestaurantLocation } from '../../../Services/restaurant2.service';

@Component({
  selector: 'app-map-view',
  imports: [CommonModule, TranslateModule],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.css',
})
export class MapViewComponent implements OnChanges {
  @Input() location!: RestaurantLocation | null;

  hasLocation() {
    return (
      this.location != null &&
      this.location.latitude != 0 &&
      this.location.longitude != 0
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['location'] && this.location && this.hasLocation()) {
      console.log(this.location);
      const loader = new Loader({
        apiKey: 'AIzaSyCDpw-Qon63nvQoN37hinNp9fBEnQ_GISw',
        version: 'weekly',
        libraries: ['maps', 'marker'],
      });

      loader
        .load()
        .then(() => {
          this.initializeMap();
        })
        .catch((e) => {
          console.error('Greška pri učitavanju Google Maps API-a', e);
        });
    }
  }

  initializeMap(): void {
    const position = {
      lat: this.location!.latitude,
      lng: this.location!.longitude,
    };

    // Proveri da li su latitude i longitude validni brojevi
    if (isNaN(position.lat) || isNaN(position.lng)) {
      console.error(
        'Invalid latitude or longitude values:',
        position.lat,
        position.lng
      );
      return;
    }

    const othersOptions: google.maps.MapOptions = {
      disableDefaultUI: true,
      zoomControl: true,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: false,
    };

    const map = new google.maps.Map(
      document.getElementById('map-view') as HTMLElement,
      {
        center: position,
        zoom: 16,
        mapId: 'DEMO_MAP_ID',
        ...othersOptions,
      }
    );

    map.setOptions({
      mapTypeControlOptions: {
        mapTypeIds: [
          google.maps.MapTypeId.ROADMAP,
          google.maps.MapTypeId.SATELLITE,
        ],
      },
    });

    // Proveri da li je 'google.maps.marker' učitan i koristi AdvancedMarkerElement
    if (google.maps && google.maps.marker) {
      const { AdvancedMarkerElement } = google.maps.marker;

      const marker = new AdvancedMarkerElement({
        map,
        position,
        title: 'Restoran',
      });
    } else {
      console.error('AdvancedMarkerElement nije dostupan.');
    }
  }
}
