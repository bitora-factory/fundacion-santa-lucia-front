import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { AlertService } from '../../../services/alert.service';
import { UsersService } from '../../../services/user.service';
import { ResidentService } from '../../../services/resident.service';
import { EnumService } from '../../../services/enum.service';
import { EnumInterface } from '../../../models/interfaces/enum.interface';
import { ResidentModel } from '../../../models/resident.model';
import { takeUntil } from 'rxjs';
import { AbstractComponent } from '../../../abstract-component';
import { FormCreateResident, RESIDENT_FORM_CONTROL_NAMES, ResidentKey } from '../../../models/interfaces/form.interface';
import { ConfirmService } from '../../../services/confirm.service';
import { FieldsetModule } from 'primeng/fieldset';
import { CardModule } from 'primeng/card';
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
    DatePickerModule,
    FieldsetModule,
    CardModule
  ],
  templateUrl: './create-resident.component.html',
  styleUrls: ['./create-resident.component.scss']
})
export class CreateResidentComponent extends AbstractComponent implements OnInit, OnChanges {
  @Output() created = new EventEmitter<void>();
  @Input() selected: ResidentModel | null = null;
  @Input() residents: ResidentModel[] = [];

  public visible: boolean = false;
  public name: string = '';
  public formResident!: FormGroup<FormCreateResident>;
  public accomodationOptions: EnumInterface[] = [];
  public paymentOptions: EnumInterface[] = [];
  public statusOptions: EnumInterface[] = [];
  public baseResidentOptions: any[] = [];
  public isRelation: boolean = false;
  public formSubmitted: boolean = false;
  formControlName = RESIDENT_FORM_CONTROL_NAMES;
  lastStatus: number | null = null;
  disabledRadioBtn: boolean = false;

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
  }


  private requiredArray(control: AbstractControl): ValidationErrors | null {
    return control.value && Array.isArray(control.value) && control.value.length > 0 ? null : { required: true };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selected'] && this.selected) {

      this.lastStatus = this.selected.status;
      this.isRelation = this.selected.relationship ? true : false;
      this.enableAllFields();

      const formData = {
        ...this.selected,
        entryDate: this.selected.entryDate,
        paymentMethod: this.enumService.parsePaymentMethodIds(this.selected.paymentMethod as string),
        baseResident: this.selected.relationship
      };
      this.formResident.patchValue(formData);

      if (this.selected.status === 2 || this.selected.status === 3) {
        this.formResident.disable();
        this.disabledRadioBtn = true;
        if (this.selected.status === 2) this.formResident.get('status')?.enable();
      } else {
        this.formResident.enable();
        this.disabledRadioBtn = false;
      }
      this.resident2RequiredValidator();

      console.log('formData', formData);
      this.visible = true;
    }
  }

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
      status: this.fb.control<number | null>({ value: 1, disabled: true }, [required]),
      residentId: this.fb.control<number | null>(null),
      relationship: this.fb.control<number | null>(null),
    });

  }

  private resident2RequiredValidator() {
    if (this.isRelation) {
      this.formResident.get('name2')?.setValidators([Validators.required]);
      this.formResident.get('dni2')?.setValidators([Validators.required]);
      this.formResident.get('name2')?.disable();
      this.formResident.get('dni2')?.disable();
    } else {
      this.formResident.get('name2')?.clearValidators();
      this.formResident.get('dni2')?.clearValidators();
      this.formResident.patchValue({ name2: null, dni2: null });
    }
  }

  showDialog() {
    this.selected = null;
    this.visible = true;
  }

  onResidentFormHide() {
    console.log('onResidentHide');

    this.formResident.reset();
    this.formSubmitted = false; // Resetear el estado de envío
    this.selected = null; // Limpiar la referencia al residente seleccionado
    this.isRelation = false; // Resetear el tipo de registro
    this.enableAllFields(); // Habilitar todos los campos
    this.disabledRadioBtn = false;
    this.lastStatus = null;
    this.visible = false;

  }

  isFieldInvalid(fieldName: ResidentKey): boolean {
    const field = this.formResident.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.formSubmitted));
  }

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

  onRegistrationTypeChange(isRelation: boolean) {
    this.isRelation = isRelation;
    const isDeleteRelation = !this.isRelation && !!this.selected && !!this.selected.relationship;

    this.checkFormState();
    this.resident2RequiredValidator();
  }

  onStatusChange(event: SelectChangeEvent) {
    const isRelationAndActiveToOther = !!this.selected?.relationship && this.lastStatus === 1 && event.value !== 1;

    if (isRelationAndActiveToOther) { this.isRelation = false; }

    this.checkFormState();
  }

  private checkFormState() {
    const controlStatus = this.formResident.get(this.formControlName.status);
    const isDeleteRelation = !this.isRelation && !!this.selected && !!this.selected.relationship;
    const isRelationAndChangeStatus = !!this.selected?.relationship && this.lastStatus === 1 &&
      controlStatus?.value !== 1;
    const isNotRelationAndChangeToInactive = !this.isRelation && !this.selected?.relationship &&
      this.lastStatus === 1 && controlStatus?.value === 2;
    const isNotRelationAndChangeToDied = !this.isRelation && !this.selected?.relationship &&
      this.lastStatus === 1 && controlStatus?.value === 3;

    const formStatus = [
      {
        description: 'Eliminar relación',
        condition: isDeleteRelation || isRelationAndChangeStatus,
        action: () => {
          this.formResident.disable();
          this.alertService.warn(`Al guardar, se eliminará la relación con el residente ${this.selected?.name2 || ''}.`);
        }
      },
      {
        description: 'Cambiar estado a inactivo o fallecido',
        condition: isNotRelationAndChangeToInactive || isNotRelationAndChangeToDied,
        action: () => {
          const message = isNotRelationAndChangeToInactive
            ? 'Al guardar, se marcará el residente como inactivo. Luego podrá cambiar su estado nuevamente.'
            : 'Al guardar, se marcará el residente como fallecido. No podrá cambiar su estado nuevamente.';
          this.formResident.disable();
          this.disabledRadioBtn = true;
          controlStatus?.enable();
          this.alertService.warn(message);
        }
      },
    ];

    console.log('formStatus', formStatus);


    for (const status of formStatus) {
      if (status.condition) {
        status.action();
        return;
      }
    }
    this.enableAllFields();
    this.disabledRadioBtn = false;
  }

  onBaseResidentChange(event: any) {
    if (!event.value) return;

    const selectedResidentId = event.value;
    const selectedOption = this.baseResidentOptions.find(option => option.value === selectedResidentId);

    if (selectedOption) {
      const baseResident = selectedOption.resident;

      this.formResident.patchValue({
        accomodation: baseResident.accomodation,
        guardian: baseResident.guardian,
        guardianDni: baseResident.guardianDni,
        address: baseResident.address,
        value: baseResident.value,
        entryDate: new Date(baseResident.entryDate),
        phone: baseResident.phone,
      });

      this.disableSharedFields();
    }
  }

  private disableSharedFields() {
    const sharedFields = ['accomodation', 'guardian', 'guardianDni', 'address', 'value',
      'entryDate', 'phone', 'payment'];

    sharedFields.forEach(field => {
      this.formResident.get(field)?.disable();
    });
  }

  private enableAllFields() {
    const excepciontFields = ['months'];
    const fields = Object.keys(this.formResident.getRawValue()).filter(f => !excepciontFields.includes(f));
    fields.forEach(field => {
      this.formResident.get(field)?.enable();
    });
    if (this.selected === null) {
      this.formResident.get('status')?.setValue(1);
      this.formResident.get('status')?.disable();

    }
  }

}
