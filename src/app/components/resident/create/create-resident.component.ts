import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { AlertService } from '../../../services/alert.service';
import { UsersService } from '../../../services/user.service';
import { ResidentService } from '../../../services/resident.service';
import { EnumService } from '../../../services/enum.service';
import { EnumInterface } from '../../../models/interfaces/enum.interface';
import { ResidentModel } from '../../../models/resident.model';
import { Subject, takeUntil } from 'rxjs';
import { AbstractComponent } from '../../../abstract-component';

@Component({
  selector: 'app-create-resident',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    FloatLabelModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    ReactiveFormsModule,
    DatePickerModule
  ],
  templateUrl: './create-resident.component.html',
  styleUrls: ['./create-resident.component.scss']
})
export class CreateResidentComponent extends AbstractComponent implements OnInit, OnChanges {
  @Output() created = new EventEmitter<void>();
  @Input() selected: ResidentModel | null = null;

  public visible: boolean = false;
  public name: string = '';
  public residetForm!: FormGroup;
  public accomodationOptions: EnumInterface[] = [];
  public paymentOptions: EnumInterface[] = [];
  public statusOptions: EnumInterface[] = [];
  public formSubmitted: boolean = false; // Para controlar cuándo mostrar errores

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private userService: UsersService,
    private residentService: ResidentService,
    private enumService: EnumService
  ) {
    super();
  }

  ngOnInit(): void {
    this.createForm();
    this.setAllEnumOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selected'] && this.selected) {
      this.residetForm.patchValue({
        ...this.selected,
        entryDate: new Date(this.selected.entryDate),
      });
      this.visible = true;
    }
  }

  showDialog() {
    this.visible = true;
  }

  onResidentFormHide() {
    this.residetForm.reset();
    this.formSubmitted = false; // Resetear el estado de envío
  }

  confirmSave() {
    this.formSubmitted = true; // Marcar que se intentó enviar el formulario
    
    if (this.residetForm.valid) {
      this.saveResident();
    } else {
      this.alertService.error('Formulario inválido, por favor corrige los errores.');
      // Marcar todos los campos como touched para mostrar errores
      this.markFormGroupTouched(this.residetForm);
    }
  }

  // Método para verificar si un campo es inválido y debe mostrarse en rojo
  isFieldInvalid(fieldName: string): boolean {
    const field = this.residetForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.formSubmitted));
  }

  // Método para obtener el mensaje de error de un campo
  getFieldError(fieldName: string): string {
    const field = this.residetForm.get(fieldName);
    if (field && field.errors && this.isFieldInvalid(fieldName)) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} es requerido`;
      }
      if (field.errors['min']) {
        return `${this.getFieldLabel(fieldName)} debe ser mayor a ${field.errors['min'].min}`;
      }
    }
    return '';
  }

  // Método para obtener la etiqueta del campo
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Nombres y apellidos',
      dni: 'Cédula',
      accomodation: 'Acomodación',
      guardian: 'Acudiente',
      guardianDni: 'Cédula acudiente',
      address: 'Dirección',
      value: 'Valor unitario',
      entryDate: 'Fecha de ingreso',
      phone: 'Teléfono',
      months: 'Meses',
      payment: 'Forma de pago',
      status: 'Estado'
    };
    return labels[fieldName] || fieldName;
  }

  // Método para marcar todos los campos como touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  /* todo: implementar validaciones */
  private createForm() {
    const { required } = Validators;

    this.residetForm = this.fb.group({
      id: [null],
      name: ['', [required]],
      dni: [null, [required]],
      accomodation: [null, [required]],
      guardian: [null, [required]],
      guardianDni: [null, [required]],
      address: [null, [required]],
      value: [null, [required, Validators.min(0)]],
      entryDate: [null, [required]],
      phone: [null, [required]],
      months: [{ value: 0, disabled: true }, [required, Validators.min(0)]],
      payment: [null, [required]],
      status: [1, [required]]
    });
  }

  private saveResident() {
    const residentData = this.residetForm.getRawValue();
    this.residentService.create(residentData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.alertService.success('Residente guardado exitosamente');
          this.residetForm.reset();
          this.created.emit();
          this.visible = false;
        },
        error: (error) => {
          this.alertService.error('Error al guardar el residente');
        }
      });
  }

  private setAllEnumOptions() {
    this.accomodationOptions = this.enumService.getEnum('accomodation');
    this.paymentOptions = this.enumService.getEnum('payment');
    this.statusOptions = this.enumService.getEnum('status');
  }

}
