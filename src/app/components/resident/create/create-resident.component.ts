import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, Form } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { AlertService } from '../../../services/alert.service';
import { UsersService } from '../../../services/user.service';
import { ResidentService } from '../../../services/resident.service';
import { EnumService } from '../../../services/enum.service';
import { EnumInterface } from '../../../models/interfaces/enum.interface';
import { ResidentModel } from '../../../models/resident.model';
import { Subject, takeUntil } from 'rxjs';
import { AbstractComponent } from '../../../abstract-component';
import { FormCreateResident, RESIDENT_FORM_CONTROL_NAMES, ResidentKey } from '../../../models/interfaces/form.interface';
import { Logger } from 'html2canvas/dist/types/core/logger';
import { ConfirmService } from '../../../services/confirm.service';

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
    MultiSelectModule,
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
  public formResident!: FormGroup<FormCreateResident>;
  public accomodationOptions: EnumInterface[] = [];
  public paymentOptions: EnumInterface[] = [];
  public statusOptions: EnumInterface[] = [];
  public baseResidentOptions: any[] = [];
  public isRelation: boolean = false;
  public formSubmitted: boolean = false; // Para controlar cuándo mostrar errores
  formControlName = RESIDENT_FORM_CONTROL_NAMES;

  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);
  private userService = inject(UsersService);
  private residentService = inject(ResidentService);
  private enumService = inject(EnumService);
  private confirmService = inject(ConfirmService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    this.setAllEnumOptions();
    // this.loadBaseResidentOptions();
  }

  /**
   * Validador personalizado para arrays no vacíos
   */
  private requiredArray(control: AbstractControl): ValidationErrors | null {
    return control.value && Array.isArray(control.value) && control.value.length > 0 ? null : { required: true };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selected'] && this.selected) {
      // Resetear estado de relación cuando se edita
      // this.loadBaseResidentOptions();
      this.isRelation = this.selected.relationship ? true : false;
      this.enableAllFields();

      const formData = {
        ...this.selected,
        entryDate: this.selected.entryDate,
        paymentMethod: this.enumService.parsePaymentMethodIds(this.selected.paymentMethod as string),
        baseResident: this.selected.relationship
      };
      this.formResident.patchValue(formData);
      this.formResident.get('status')?.enable(); // Habilitar status para edición
      console.log('formData', formData);

      this.visible = true;
    }
  }

  /* todo: implementar validaciones */
  private initForm() {
    const { required } = Validators;
    const currentDate = new Date();

    this.formResident = this.fb.group<FormCreateResident>({
      id: this.fb.control<number | null>(null),
      name: this.fb.control<string | null>(null, [required]),
      dni: this.fb.control<string | null>(null, [required]),
      name2: this.fb.control<string | null>(null),
      dni2: this.fb.control<string | null>(null),
      accomodation: this.fb.control<number | null>(null, [required]),
      guardian: this.fb.control<string | null>(null, [required]),
      guardianDni: this.fb.control<string | null>(null, [required]),
      address: this.fb.control<string | null>(null, [required]),
      value: this.fb.control<number | null>(null, [required, Validators.min(1)]),
      entryDate: this.fb.control<Date | null>(currentDate, [required]),
      phone: this.fb.control<string | null>(null, [required]),
      months: this.fb.control<number | null>({ value: 0, disabled: true }, [required, Validators.min(0)]),
      paymentMethod: this.fb.control<string | null>(null, [this.requiredArray]),
      status: this.fb.control<number | null>(1, [required]),
      residentId: this.fb.control<number | null>(null),
      relationship: this.fb.control<number | null>(null),
    });
  }

  showDialog() {
    // Limpiar selected cuando se abre para crear nuevo residente
    this.selected = null;
    this.visible = true;
  }

  onResidentFormHide() {
    this.formResident.reset();
    this.formSubmitted = false; // Resetear el estado de envío
    this.selected = null; // Limpiar la referencia al residente seleccionado
    this.isRelation = false; // Resetear el tipo de registro
    this.enableAllFields(); // Habilitar todos los campos
    // Resetear payment como array vacío
    // this.formResident.patchValue({ payment: [] });
  }

  // Método para verificar si un campo es inválido y debe mostrarse en rojo
  isFieldInvalid(fieldName: ResidentKey): boolean {
    const field = this.formResident.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.formSubmitted));
  }

  // Método para obtener el mensaje de error de un campo
  getFieldError(fieldName: ResidentKey): string {
    const field = this.formResident.get(fieldName);
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
  private getFieldLabel(fieldName: ResidentKey): string {
    const labels: Record<ResidentKey, string> = {
      name: 'Nombres y apellidos',
      dni: 'Cédula',
      name2: 'Nombres y apellidos 2',
      dni2: 'Cédula 2',
      accomodation: 'Acomodación',
      guardian: 'Acudiente',
      guardianDni: 'Cédula acudiente',
      address: 'Dirección',
      value: 'Valor unitario',
      entryDate: 'Fecha de ingreso',
      phone: 'Teléfono',
      months: 'Meses',
      paymentMethod: 'Forma de pago',
      status: 'Estado',
      residentId: 'ID Residente',
      relationship: 'Relación',
      id: 'ID'
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

  confirmSave(event: Event) {
    let message = '¿Estás seguro de guardar este residente?';
    this.formSubmitted = true;

    if (this.formResident.invalid) {
      this.alertService.error('Formulario inválido, por favor corrige los errores.');
      this.markFormGroupTouched(this.formResident);
      return;
    }

    if (!this.isRelation && this.formResident.get('relationship')?.value) {
      message = 'La relación se ha deshabilitado. ¿Deseas continuar?';
    }

    this.confirmService.showSave(
      event,
      message,
      this.saveResident.bind(this)
    );
  }

  private saveResident() {
    const { months, name2, dni2, ...cleanedData } = this.formResident.getRawValue();
    console.log('resident data', this.formResident.getRawValue());

    const isEditing = cleanedData.id && cleanedData.id > 0;

    const enpointOperations = [
      {
        condition: !isEditing && !this.isRelation, // Nuevo residente simple
        action: () => this.residentService.create(cleanedData)
      },
      {
        condition: isEditing && !this.isRelation && !this.selected?.relationship, // Editar residente simple
        action: () => this.residentService.update(cleanedData.id as number, cleanedData)
      },
      {
        condition: this.isRelation, // Nuevo/editar residente con relación
        action: () => this.residentService.createResidentRelation({ name2, dni2, ...cleanedData })
      },
      {
        condition: isEditing && !this.isRelation && !!this.selected?.relationship, // Editar residente para eliminar relación
        action: () => this.residentService.deleteResidentRelation({ dni2, ...cleanedData })
      }
    ];

    console.log('condiciones', enpointOperations);


    const operation = enpointOperations.find(op => op.condition)?.action;
    if (!operation) return;

    operation()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          const message = isEditing ? 'Residente actualizado exitosamente' : 'Residente guardado exitosamente';
          this.alertService.success(message);
          this.formResident.reset();
          this.formResident.patchValue({ paymentMethod: [] });
          this.isRelation = false;
          this.enableAllFields();
          this.created.emit();
          this.visible = false;
        },
        error: () => {
          const errorMessage = isEditing ? 'Error al actualizar el residente' : 'Error al guardar el residente';
          this.alertService.error(errorMessage);
        }
      });
  }


  private setAllEnumOptions() {
    this.accomodationOptions = this.enumService.getEnum('accomodation');
    this.paymentOptions = this.enumService.getEnum('paymentMethod');
    this.statusOptions = this.enumService.getEnum('status');
  }

  /**
   * Carga las opciones de residentes base para relaciones
   */
  // private loadBaseResidentOptions() {
  //   this.residentService.findAll()
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(residents => {
  //       console.log('Selected resident_id for filtering:', this.selected);

  //       this.baseResidentOptions = residents.filter(
  //         r => (r.relation === null || r.id === Number(this.selected?.relation)) && r.id !== this.selected?.id
  //       ).map(resident => ({
  //         label: `${resident.resident_id} - ${resident.name} (${resident.guardian})`,
  //         value: resident.resident_id,
  //         resident: resident
  //       }));
  //     });
  // }

  /**
   * Maneja el cambio de tipo de registro (nuevo vs relación)
   */
  onRegistrationTypeChange(isRelation: boolean) {
    this.isRelation = isRelation;

    if (!isRelation && this.selected && this.selected.relationship) {
      this.formResident.disable();
      return;
    }

    this.enableAllFields();
  }

  /**
   * Maneja la selección del residente base
   */
  onBaseResidentChange(event: any) {
    if (!event.value) return;

    const selectedResidentId = event.value;
    const selectedOption = this.baseResidentOptions.find(option => option.value === selectedResidentId);

    if (selectedOption) {
      const baseResident = selectedOption.resident;

      // Llenar todos los campos excepto name, dni, months y status
      this.formResident.patchValue({
        accomodation: baseResident.accomodation,
        guardian: baseResident.guardian,
        guardianDni: baseResident.guardianDni,
        address: baseResident.address,
        value: baseResident.value,
        entryDate: new Date(baseResident.entryDate),
        phone: baseResident.phone,
        // payment: this.enumService.parsePaymentMethodIds(baseResident.paymentMethod || baseResident.payment || '')
        // months y status mantienen sus valores por defecto (0 y 1 respectivamente)
      });

      // Deshabilitar campos compartidos, solo permitir editar name y dni
      this.disableSharedFields();
    }
  }

  /**
   * Deshabilita los campos que se comparten entre registros relacionados
   */
  private disableSharedFields() {
    const sharedFields = ['accomodation', 'guardian', 'guardianDni', 'address', 'value',
      'entryDate', 'phone', 'payment'];

    sharedFields.forEach(field => {
      this.formResident.get(field)?.disable();
    });
    // months y status siempre están disabled, no necesitan cambios
  }

  /**
   * Habilita todos los campos del formulario excepto months y status que siempre están disabled
   */
  private enableAllFields() {
    const excepciontFields = ['months'];
    const fields = Object.keys(this.formResident.getRawValue()).filter(f => !excepciontFields.includes(f));
    fields.forEach(field => {
      this.formResident.get(field)?.enable();
    });
    // months y status siempre permanecen disabled
  }

}
