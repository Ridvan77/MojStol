import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  PaymentMethod,
  PaymentMethodService,
  RestaurantPaymentMethod,
} from '../../../Services/payment-method.service';
import {
  RestaurantPaymentMethodCreateDto,
  RestaurantPaymentMethodService,
} from '../../../Services/restaurant-payment-method.service';

@Component({
  selector: 'app-payment-methods-modal',
  imports: [CommonModule, TranslateModule],
  templateUrl: './payment-methods-modal.component.html',
  styleUrl: './payment-methods-modal.component.css',
})
export class PaymentMethodsModalComponent implements OnChanges {
  @Input() restaurantId!: number;

  @Input() openModal!: boolean;
  @Input() selectedPaymentMethods!: RestaurantPaymentMethod[];

  @Output() onSave = new EventEmitter();
  @Output() onClose = new EventEmitter();

  allPaymentMethods: PaymentMethod[] = [];
  removePaymentMethods: number[] = [];
  removeRestaurantPaymentMethods: number[] = [];
  newPaymentMethods: number[] = [];

  paymentMethodService = inject(PaymentMethodService);
  restaurantPaymentMethodService = inject(RestaurantPaymentMethodService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['openModal'] && this.openModal) {
      console.log(this.selectedPaymentMethods);
      this.removePaymentMethods = [];
      this.removeRestaurantPaymentMethods = [];
      this.newPaymentMethods = [];

      this.fetchPaymentMethods();
    }
  }

  isPaymentMethodChosen(paymentMethodId: number): boolean {
    return this.selectedPaymentMethods.some(
      (st) => st.paymentMethodID === paymentMethodId
    );
  }

  selectPaymentMethod(paymentMethodId: number) {
    const restaurantPaymentMethodId = this.selectedPaymentMethods.find(
      (spm) => spm.paymentMethodID == paymentMethodId
    )?.paymentMethodRestaurantId;
    console.log('restaurantTagId: ', restaurantPaymentMethodId);

    if (this.newPaymentMethods.includes(paymentMethodId)) {
      this.newPaymentMethods = this.newPaymentMethods.filter(
        (paymentMethodID) => paymentMethodID != paymentMethodId
      );
    } else if (this.removePaymentMethods.includes(paymentMethodId)) {
      this.removePaymentMethods = this.removePaymentMethods.filter(
        (paymentMethodID) => paymentMethodID != paymentMethodId
      );
      this.removeRestaurantPaymentMethods =
        this.removeRestaurantPaymentMethods.filter(
          (rpmId) => rpmId != restaurantPaymentMethodId!
        );
    } else if (
      this.selectedPaymentMethods.some(
        (st) => st.paymentMethodID == paymentMethodId
      )
    ) {
      this.removePaymentMethods.push(paymentMethodId);
      this.removeRestaurantPaymentMethods.push(restaurantPaymentMethodId!);
    } else if (!this.newPaymentMethods.includes(paymentMethodId)) {
      this.newPaymentMethods.push(paymentMethodId);
    }

    console.log('New PaymentMethods:', this.newPaymentMethods);
    console.log('Removed PaymentMethods:', this.removePaymentMethods);
    console.log(
      'Removed Restaurant PaymentMethods:',
      this.removeRestaurantPaymentMethods
    );
    console.log('Selected PaymentMethods:', this.selectedPaymentMethods);
  }

  fetchPaymentMethods() {
    this.paymentMethodService.getAll().subscribe((paymentMethods) => {
      this.allPaymentMethods = paymentMethods;
      console.log(this.allPaymentMethods);
    });
  }

  closeModal() {
    this.onClose.emit();
  }

  saveModal() {
    this.onSave.emit();
  }

  saveChanges() {
    if (this.newPaymentMethods.length > 0) {
      let newCounter = 0;
      for (let i = 0; i < this.newPaymentMethods.length; i++) {
        const paymentMethodId = this.newPaymentMethods[i];

        const restaurantTagToSend: RestaurantPaymentMethodCreateDto = {
          restaurantID: this.restaurantId,
          paymentMethodID: paymentMethodId,
        };
        this.restaurantPaymentMethodService
          .create(restaurantTagToSend)
          .subscribe((x) => {
            newCounter++;
            console.log('Adding paymentMethod: ', paymentMethodId);
            if (newCounter == this.newPaymentMethods.length) {
              this.saveModal();
            }
          });
      }
    }
    if (this.removeRestaurantPaymentMethods.length > 0) {
      let removeCounter = 0;
      for (let i = 0; i < this.removeRestaurantPaymentMethods.length; i++) {
        const restaurantPaymentMethodId =
          this.removeRestaurantPaymentMethods[i];

        this.restaurantPaymentMethodService
          .delete(restaurantPaymentMethodId)
          .subscribe((x) => {
            removeCounter++;
            console.log('Removing paymentMethod: ', restaurantPaymentMethodId);
            if (removeCounter == this.removePaymentMethods.length) {
              this.saveModal();
            }
          });
      }
    }

    this.closeModal();
  }

  enableSave() {
    return (
      this.newPaymentMethods.length > 0 ||
      this.removeRestaurantPaymentMethods.length > 0
    );
  }
}
