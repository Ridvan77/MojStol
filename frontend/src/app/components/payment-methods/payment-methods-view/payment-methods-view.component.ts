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
  PaymentMethodService,
  RestaurantPaymentMethod,
} from '../../../Services/payment-method.service';

interface PaymentMethod {
  name: string;
}

@Component({
  selector: 'app-payment-methods-view',
  imports: [CommonModule, TranslateModule],
  templateUrl: './payment-methods-view.component.html',
  styleUrl: './payment-methods-view.component.css',
})
export class PaymentMethodsViewComponent implements OnChanges {
  @Input() paymentMethods!: RestaurantPaymentMethod[];

  myPaymentMethods: PaymentMethod[] = [];

  icons: { [key: string]: string } = {
    Cash: 'bi bi-cash-coin',
    'Debit Card': 'bi bi-credit-card',
    'Credit Card': 'bi bi-credit-card-2-back',
    Bitcoin: 'bi bi-currency-bitcoin',
    'American Express': 'bi bi-credit-card-2-front',
  };

  paymentMethodService = inject(PaymentMethodService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['paymentMethods']) {
      this.myPaymentMethods = [];

      this.fetchPaymentMethods();
    }
  }

  fetchPaymentMethods() {
    this.paymentMethodService.getAll().subscribe((paymentMethods) => {
      this.myPaymentMethods = paymentMethods
        .filter((pm) =>
          this.paymentMethods.some(
            (paymentMethod) =>
              pm.paymentMethodID == paymentMethod.paymentMethodID
          )
        )
        .map((pm) => {
          return { name: pm.name };
        });
    });
  }
}
