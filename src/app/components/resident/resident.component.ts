import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { RESIDENT_COLUMNS } from '../../metadata/resident.metadata';
import { CreateResidentComponent } from "./create/create-resident.component";
import { TooltipModule } from 'primeng/tooltip';
import { Button, ButtonModule } from 'primeng/button';
import { ResidentService } from '../../services/resident.service';
import { EnumService } from '../../services/enum.service';
import { ResidentModel } from '../../models/resident.model';
import { TableInterface } from '../../models/interfaces/table.interface';
import { AbstractComponent } from '../../abstract-component';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-list-resident',
  imports: [
    CommonModule,
    TableModule,
    CreateResidentComponent,
    TooltipModule,
    ButtonModule
  ],
  templateUrl: './resident.component.html',
  styleUrl: './resident.component.scss'
})
export class ResidentComponent extends AbstractComponent implements OnInit {
  residents: ResidentModel[] = [];
  columns: TableInterface[] = RESIDENT_COLUMNS;
  selectedResident: ResidentModel | null = null;

  constructor(
    private residentService: ResidentService,
    readonly enumService: EnumService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadResidents();
  }

  loadResidents() {
    this.residentService.findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(residents => {
        this.residents = residents;
        residents.forEach(resident => {
          console.log('resident type:', typeof resident.entryDate);
        });
      });
  }

  handleResidentCreated(resident: ResidentModel) {
    this.residents.push(resident);
  }

  editResident(item: ResidentModel) {
    this.selectedResident = Object.assign({}, item);
    // Aquí podrías abrir un modal o realizar alguna acción para editar el residente
  }

  getRegularColumns(): TableInterface[] {
    return this.columns.filter(col => !col.frozen);
  }

  getFrozenColumns(): TableInterface[] {
    return this.columns.filter(col => col.frozen);
  }
}
