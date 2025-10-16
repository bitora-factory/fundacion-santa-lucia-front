import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { RESIDENT_COLUMNS } from '../../metadata/resident.metadata';
import { CreateResidentComponent } from "./create/create-resident.component";
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { ResidentService } from '../../services/resident.service';
import { EnumService } from '../../services/enum.service';
import { DocumentGeneratorService } from '../../services/document-generator.service';
import { AlertService } from '../../services/alert.service';
import { ResidentModel } from '../../models/resident.model';
import { TableInterface } from '../../models/interfaces/table.interface';
import { AbstractComponent } from '../../abstract-component';
import { takeUntil } from 'rxjs';
import { CalendarModule } from 'primeng/calendar';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, SortEvent } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-list-resident',
  imports: [
    CommonModule,
    TableModule,
    CreateResidentComponent,
    TooltipModule,
    ButtonModule,
    CalendarModule,
    SelectModule,
    MultiSelectModule,
    FormsModule,
    ConfirmDialogModule,
    TooltipModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TagModule
  ],
  templateUrl: './resident.component.html',
  styleUrl: './resident.component.scss'
})
export class ResidentComponent extends AbstractComponent implements OnInit {
  @ViewChild('dt2') table!: Table;

  residents: ResidentModel[] = [];
  initialValue: ResidentModel[] = [];
  columns: TableInterface[] = RESIDENT_COLUMNS;
  selectedResident: ResidentModel | null = null;
  selectedResidents: ResidentModel[] = [];
  currentFilteredData: ResidentModel[] = [];
  visible: boolean = false;
  countActiveResidents: number = 0;
  isSorted: boolean | null = null;
  statusSelected: number[] = [1];

  // Opciones para filtros dropdown - usando enum service
  accommodationOptions: { label: string; value: number; }[] = [];
  statusOptions: { label: string; value: number; }[] = [];

  // Mapa para controlar rowspan de residentId
  residentGroupMap = new Map<number, { count: number; firstIndex: number }>();

  private residentService = inject(ResidentService);
  private documentGeneratorService = inject(DocumentGeneratorService);
  private alertService = inject(AlertService);
  private confirmationService = inject(ConfirmationService);
  enumService = inject(EnumService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.initializeEnumOptions();
    this.loadResidents();
    // Cargar estado seleccionado desde localStorage
    const savedStatus = localStorage.getItem('residentStatusFilter');
    if (savedStatus) {
      this.statusSelected = JSON.parse(savedStatus);
    }
  }

  /**
   * Inicializa las opciones de los dropdowns usando el enum service
   */
  private initializeEnumOptions(): void {
    // Inicializar opciones de acomodación
    this.accommodationOptions = this.enumService.getEnum('accomodation').map(item => ({
      label: this.capitalizeFirstLetter(item.name),
      value: item.id
    }));

    // Inicializar opciones de estado
    this.statusOptions = this.enumService.getEnum('status').map(item => ({
      label: this.capitalizeFirstLetter(item.name),
      value: item.id
    }));
  }

  /**
   * Capitaliza la primera letra de cada palabra
   */
  private capitalizeFirstLetter(str: string): string {
    return str.toLowerCase().split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  loadResidents() {
    this.residentService.findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(residents => {
        this.residents = residents.map(resident => ({
          ...resident,
          entryDate: typeof resident.entryDate === 'string' ? new Date(resident.entryDate) : resident.entryDate,
          // paymentFormatted: this.enumService.getPaymentMethodNames(resident.paymentMethod || '')
        }));
        this.initialValue = [...this.residents];
        // Contar residentes activos
        this.countActiveResidents = this.residents.filter(r => r.status === 1).length;

        // Inicializar datos filtrados
        this.currentFilteredData = this.residents;

        // Calcular agrupaciones por residentId
        this.calculateResidentGroups();

        console.log('Residents loaded with Date objects:', this.residents);
        console.log('Resident groups:', this.residentGroupMap);
      });
  }

  /**
   * Calcula los grupos de residentes por residentId para manejar rowspan
   */
  private calculateResidentGroups(dataToUse: ResidentModel[] = this.residents) {
    this.residentGroupMap.clear();

    // Contar ocurrencias de cada residentId
    const counts = new Map<number, number>();
    dataToUse.forEach(resident => {
      const id = resident.residentId;
      if (id) counts.set(id, (counts.get(id) || 0) + 1);
    });

    // Encontrar el primer índice de cada grupo
    const firstIndexes = new Map<number, number>();
    dataToUse.forEach((resident, index) => {
      const id = resident.residentId;
      if (id && !firstIndexes.has(id)) {
        firstIndexes.set(id, index);
      }
    });

    // Crear el mapa final
    counts.forEach((count, residentId) => {
      this.residentGroupMap.set(residentId, {
        count: count,
        firstIndex: firstIndexes.get(residentId) || 0
      });
    });
  }

  handleResidentCreated(resident: ResidentModel) {
    const formattedResident = {
      ...resident,
      // paymentFormatted: this.enumService.getPaymentMethodNames(resident.paymentMethod || resident.payment || '')
    };
    this.residents.push(formattedResident);
    // Recalcular grupos cuando se agrega un nuevo residente
    this.calculateResidentGroups();
  }

  /**
   * Maneja el evento de filtrado de la tabla
   * Se ejecuta cuando PrimeNG filtra los datos
   */
  onTableFilter(event: any) {
    // Guardar los datos filtrados actuales
    this.currentFilteredData = event.filteredValue || this.residents;

    // Recalcular grupos basándose en los datos filtrados
    this.calculateResidentGroups(this.currentFilteredData);

    // Actualizar la selección para mantener solo elementos visibles
    this.selectedResidents = this.selectedResidents.filter(selected =>
      this.currentFilteredData.some(visible => visible.id === selected.id)
    );
  }

  editResident(item: ResidentModel) {
    this.selectedResident = Object.assign({}, item);
    this.visible = true;
    console.log('Editing resident:', this.selectedResident);

    // Aquí podrías abrir un modal o realizar alguna acción para editar el residente
  }

  async generateDocuments(resident: ResidentModel) {
    try {
      this.alertService.info('Generando documentos...');

      // Generar contrato
      await this.documentGeneratorService.generateContract(resident);

      // Generar autorización médica
      // await this.documentGeneratorService.generateAuthorization(resident);

      this.alertService.success('Documentos generados y descargados exitosamente');
    } catch (error) {
      console.error('Error generando documentos:', error);
      this.alertService.error('Error al generar los documentos. Verifique que las plantillas estén disponibles.');
    }
  }

  getRegularColumns(): TableInterface[] {
    return this.columns.filter(col => !col.frozen);
  }

  getFrozenColumns(): TableInterface[] {
    return this.columns.filter(col => col.frozen);
  }

  confirmSave(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Save',
      },
      accept: () => {
      }
    });
  }

  getColConfig(field: keyof ResidentModel): TableInterface {
    const colConfig = RESIDENT_COLUMNS.find(col => col.field === field);
    return colConfig || {} as TableInterface;
  }

  onInput(event: any) {
    const target = event.target as HTMLInputElement;
    this.table.filterGlobal(event.target.value, 'contains');
  }

  customSort(event: SortEvent) {
    if (this.isSorted == null || this.isSorted === undefined) {
      this.isSorted = true;
      this.sortTableData(event);
    } else if (this.isSorted == true) {
      this.isSorted = false;
      this.sortTableData(event);
    } else if (this.isSorted == false) {
      this.isSorted = null;
      this.residents = [...this.initialValue];
      this.table.reset();
    }
  }

  sortTableData(event: SortEvent) {
    event.data!.sort((data1, data2) => {
      let value1 = data1[event.field!];
      let value2 = data2[event.field!];
      let result = null;
      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return event.order! * result;
    });
  }

  onStatusFilterChange(selectedValues: number[]) {
    // guardar selectedValues en localStorage
    localStorage.setItem('residentStatusFilter', JSON.stringify(selectedValues));
  }
}
