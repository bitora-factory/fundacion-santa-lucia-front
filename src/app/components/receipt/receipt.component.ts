import { Component } from '@angular/core';
import { BuildingComponent } from "../building/building.component";
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CreateReceiptComponent } from './create/create-receipt.component';

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
export class ReceiptComponent {

  payments: any[] = []; // Replace with actual type if available


  constructor() {
    // Initialize or fetch payments data here
  }
/* 
  getRegularColumns(): TableInterface[] {
    return this.columns.filter(col => !col.frozen);
  }

  getFrozenColumns(): TableInterface[] {
    return this.columns.filter(col => col.frozen);
  } */


}
