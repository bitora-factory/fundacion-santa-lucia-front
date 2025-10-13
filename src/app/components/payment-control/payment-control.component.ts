import { Component, inject, OnInit } from '@angular/core';
import { BuildingComponent } from "../building/building.component";
import { ResidentService } from '../../services/resident.service';
import { CommonModule } from '@angular/common';
import { ResidentModel, ResidentPaymentControl } from '../../models/resident.model';
import { map } from 'rxjs';
import { TableModule } from 'primeng/table';
import { EnumService } from '../../services/enum.service';

@Component({
  selector: 'app-payment-control',
  imports: [CommonModule, TableModule],
  templateUrl: './payment-control.component.html',
  styleUrl: './payment-control.component.scss'
})
export class PaymentControlComponent implements OnInit {
  residentsTable: any[] = [];
  private residentService = inject(ResidentService);
  enumService = inject(EnumService);

  ngOnInit() {
    this.residentService.findAll()
      .pipe(
        map(residents => residents.filter(resident => resident.status === 1))
      )
      .subscribe(residents => {
        const allDays = this.getAllDays(residents);
        const residentList = new Map<number, ResidentPaymentControl[]>();

        allDays.forEach(day => {
          const residentsForDay = residents.filter(resident => new Date(resident.entryDate as Date).getDate() === day);
          const residentsCleaned = residentsForDay.map(resident => ({
            name: resident.name,
            value: resident.value,
            paymentMethod: resident.paymentMethod,
            entryDate: resident.entryDate
          })) as ResidentPaymentControl[];

          residentList.set(day, residentsCleaned);
        });

        console.log(`Residents for day:`, residentList);
        this.residentsTable = Array.from(residentList, ([day, residents]) => ({ day, residents }));
      });
  }

  private getAllDays(residents: ResidentModel[]): number[] {
    const daysSet = new Set<number>();
    residents.forEach(resident => {
      daysSet.add(new Date(resident.entryDate as Date).getDate());
    });
    return Array.from(daysSet).sort((a, b) => a - b);
  }

  getTotalValue(): number {
    return this.residentsTable.flatMap(day => day.residents).reduce((total, resident) => total + (resident.value || 0), 0);
  }
}

