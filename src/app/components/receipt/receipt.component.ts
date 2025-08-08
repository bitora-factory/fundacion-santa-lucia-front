import { Component, inject, OnInit } from '@angular/core';
import { BuildingComponent } from "../building/building.component";
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CreateReceiptComponent } from './create/create-receipt.component';
import { PaymentService } from '../../services/payment.service';
import { takeUntil } from 'rxjs';
import { AbstractComponent } from '../../abstract-component';

@Component({
  selector: 'app-receipt',
  imports: [
    CommonModule,
    // BuildingComponent,
    TableModule,
    ButtonModule,
    CreateReceiptComponent
  ],
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.scss'
})
export class ReceiptComponent extends AbstractComponent implements OnInit {

  payments: any[] = []; // Replace with actual type if available
  private paymentService = inject(PaymentService)


  constructor() {
    super();
  }

  ngOnInit(): void {
    this.loadPayments();
  }

  private loadPayments() {
    this.paymentService.findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(payments => {
        this.payments = payments
      });
  }
  /* 
    getRegularColumns(): TableInterface[] {
      return this.columns.filter(col => !col.frozen);
    }
  
    getFrozenColumns(): TableInterface[] {
      return this.columns.filter(col => col.frozen);
    } */


}
