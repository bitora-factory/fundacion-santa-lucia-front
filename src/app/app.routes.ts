import { Routes } from '@angular/router';
import { AppLayout } from './layouts/app.layout';
import { ReceiptComponent } from './components/receipt/receipt.component';
import { PaymentHistoryComponent } from './components/payment-history/payment-history.component';
import { ResidentComponent } from './components/resident/resident.component';

export const routes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: 'resident', component: ResidentComponent },
            { path: 'receipt', component: ReceiptComponent },
            { path: 'payment-history', component: PaymentHistoryComponent }
        ]
    }
];
