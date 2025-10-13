import { Routes } from '@angular/router';
import { AppLayout } from './layouts/app.layout';
import { ReceiptComponent } from './components/receipt/receipt.component';
import { PaymentControlComponent } from './components/payment-control/payment-control.component';
import { ResidentComponent } from './components/resident/resident.component';

export const routes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: 'resident', component: ResidentComponent },
            { path: 'receipt', component: ReceiptComponent },
            { path: 'payment-control', component: PaymentControlComponent }
        ]
    }
];
