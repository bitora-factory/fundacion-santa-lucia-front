import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
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

@Component({
  selector: 'app-create',
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
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnChanges {
  @Output() created = new EventEmitter<void>();
  @Input() selected: ResidentModel | null = null;

  public visible: boolean = false;
  public name: string = '';
  public residetForm!: FormGroup;
  public accomodationOptions: EnumInterface[] = [];
  public paymentOptions: EnumInterface[] = [];
  public statusOptions: EnumInterface[] = [];

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private userService: UsersService,
    private residentService: ResidentService,
    private enumService: EnumService
  ) {
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
  }

  confirmSave() {
    if (this.residetForm.valid) {
      this.saveResident();
    } else {
      this.alertService.error('Formulario inválido, por favor corrige los errores.');
    }
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
      phone: [null, [required, Validators.pattern('^\\+?[0-9 ]{7,15}$')]],
      months: [{ value: 0, disabled: true }, [required, Validators.min(0)]],
      payment: [null, [required]],
      status: [1, [required]]
    });
  }

  private saveResident() {
    const residentData = this.residetForm.getRawValue();
    this.residentService.create(residentData).subscribe({
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
