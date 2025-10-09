import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { BuildingComponent } from "../building/building.component";
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CreateReceiptComponent } from './create/create-receipt.component';
import { PaymentModel } from '../../models/payment.model';
import { PaymentService } from '../../services/payment.service';
import { AbstractComponent } from '../../abstract-component';
import { takeUntil } from 'rxjs';
import { TableInterface } from '../../models/interfaces/table.interface';
import { RECEIPT_COLUMNS } from '../../metadata/receipt.metadata';
import { TooltipModule } from 'primeng/tooltip';
import { PaymentDetailModel } from '../../models/payment-detail.model';
import { PaymentDetailService } from '../../services/payment-detail.service';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-receipt',
  imports: [
    CommonModule,
    // BuildingComponent,
    TableModule,
    ButtonModule,
    CreateReceiptComponent,
    TooltipModule,
    DialogModule,
    IconFieldModule,
    InputIconModule,
    CalendarModule
  ],
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.scss'
})
export class ReceiptComponent extends AbstractComponent implements OnInit {
  @ViewChild('dt2') table!: Table;
  payments: PaymentModel[] = [];
  columns: TableInterface[] = RECEIPT_COLUMNS;
  paymentDetails: PaymentDetailModel[] = [];
  visibleDialogDetail: boolean = false;
  paymentSelected: PaymentModel | null = null;
  
  private paymentService = inject(PaymentService);
  private paymentDetailService = inject(PaymentDetailService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments() {
    this.paymentService.findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(payments => {
        this.payments = payments.map(payment => {
          const paymentDate = typeof payment.date === 'string' ? new Date(payment.date) : payment.date;
          return {
            ...payment,
            date: paymentDate
          };
        });
        console.log('Payments with Date objects:', this.payments);
      });
  }

  getRegularColumns(): TableInterface[] {
    return this.columns.filter(col => !col.frozen);
  }

  getFrozenColumns(): TableInterface[] {
    return this.columns.filter(col => col.frozen);
  }

  getDetails(payment: PaymentModel) {
    this.paymentDetailService.getDetailsByPaymentId(payment.id as number)
      .pipe(takeUntil(this.destroy$))
      .subscribe(details => {
        this.paymentSelected = payment;
        this.paymentDetails = details;
        this.visibleDialogDetail = true;
      });
  }

  onInput(event: any) {
    const target = event.target as HTMLInputElement;
    this.table.filterGlobal(event.target.value, 'contains');
  }

  // Método personalizado para filtrar fechas
  filterByDate(value: any, filter: any): boolean {
    if (filter === undefined || filter === null || filter === '') {
      return true;
    }
    if (value === undefined || value === null) {
      return false;
    }
    
    // Convertir ambas fechas al formato dd/mm/yyyy para comparar
    const valueDate = new Date(value);
    const filterDate = new Date(filter);
    
    return valueDate.toDateString() === filterDate.toDateString();
  }

}
