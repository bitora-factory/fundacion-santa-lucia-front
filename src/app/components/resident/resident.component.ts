import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { COLUMNS } from '../../metadata/resident.metadata';
import { CreateComponent } from "./create/create.component";
import { TooltipModule } from 'primeng/tooltip';
import { Button, ButtonModule } from 'primeng/button';
import { ResidentService } from '../../services/resident.service';
import { EnumService } from '../../services/enum.service';
import { ResidentModel } from '../../models/resident.model';
import { TableInterface } from '../../models/interfaces/table.interface';

@Component({
  selector: 'app-resident',
  imports: [
    CommonModule,
    TableModule,
    CreateComponent,
    TooltipModule,
    ButtonModule
  ],
  templateUrl: './resident.component.html',
  styleUrl: './resident.component.scss'
})
export class ResidentComponent implements OnInit {
  residents: ResidentModel[] = [];
  columns: TableInterface[] = COLUMNS;
  selectedResident: ResidentModel | null = null;

  constructor(
    private residentService: ResidentService,
    readonly enumService: EnumService
  ) { }

  ngOnInit(): void {
    this.loadResidents();
  }

  loadResidents() {
    this.residentService.findAll().subscribe(residents => {
      this.residents = residents;
      residents.forEach(resident => {
        console.log('resident type:', typeof resident.entryDate);
        
      })
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
