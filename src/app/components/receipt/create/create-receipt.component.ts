import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { PaymentDetailModel } from '../../../models/payment-detail.model';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { ReceiptInterface } from '../../../models/interfaces/receipt.interface';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumber } from "primeng/inputnumber";
import { ResidentService } from '../../../services/resident.service';
import { AlertService } from '../../../services/alert.service';
import { LoadingService } from '../../../services/loading.service';
import { reduce, takeUntil } from 'rxjs';
import { ResidentModel } from '../../../models/resident.model';
import { SelectModule } from 'primeng/select';
import { AbstractComponent } from '../../../abstract-component';
import { PaymentService } from '../../../services/payment.service';
import { EnumService } from '../../../services/enum.service';
import { ReceiptService } from '../../../services/receipt.service';

@Component({
  selector: 'app-create-receipt',
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    TableModule,
    InputTextModule,
    FormsModule,
    SelectModule,
    InputNumber,
    InputTextModule
  ],
  templateUrl: './create-receipt.component.html',
  styleUrls: ['./create-receipt.component.scss']
})
export class CreateReceiptComponent extends AbstractComponent implements OnInit {
  @Output() created = new EventEmitter<void>();
  @ViewChild('receiptContainer') receiptContainer!: ElementRef;

  visible: boolean = false;
  paymentDetails: PaymentDetailModel[] = [
    {
      id: null,
      paymentId: null,
      code: 'Mensualidad',
      detail: '',
      units: null,
      unitPrice: null,
      total: null
    },
    {
      id: null,
      paymentId: null,
      code: 'Otros cargos',
      detail: '',
      units: null,
      unitPrice: null,
      total: null
    }
  ];
  receiptData: ReceiptInterface | null = null;
  residentId: number | null = null;
  residents: ResidentModel[] = [];
  consecutiveNumber: number | null = null;

  private residentService = inject(ResidentService);
  private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);
  private paymentService = inject(PaymentService);
  private receiptService = inject(ReceiptService);
  private enumService = inject(EnumService);

  constructor() {
    super();
  }

  ngOnInit(): void {

  }

  showDialog() {
    this.visible = true;
    this.getResidents();
    this.getConsecutiveNumber();
  }

  private getConsecutiveNumber() {
    this.paymentService.getConsecutive()
      .pipe(takeUntil(this.destroy$))
      .subscribe(consecutiveNumber => {
        this.consecutiveNumber = consecutiveNumber;
      });
  }

  private getResidents() {
    this.residentService.findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(residents => {
        this.residents = residents.map(resident => {
          if (resident.residentId === null) {
            return {
              ...resident,
              idName: `${resident.residentId} - ${resident.name}`,
            };
          } else {
            const relationship = residents.find(r => r.residentId === resident.residentId && r.id !== resident.id);
            return {
              ...resident,
              idName: `${resident.residentId} - ${resident.name} ${relationship ? '(Relación: ' + relationship.name + ')' : ''}`,
            };
          }
        });
        const set = new Set();
        this.residents = this.residents.filter(resident => {
          const duplicate = set.has(resident.residentId);
          set.add(resident.residentId);
          return !duplicate;
        });
      });
  }

  private addMonths(date: Date, months: number): Date {
    const d = new Date(date);
    const originalDay = d.getDate();

    // Cambiar al primer día del mes para evitar problemas con días que no existen
    d.setDate(1);
    d.setMonth(d.getMonth() + months); // Sin sumar 1 extra

    // Obtener el último día del mes destino
    const lastDayOfTargetMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

    // Usar el día original o el último día del mes, el que sea menor
    const targetDay = Math.min(originalDay, lastDayOfTargetMonth);
    d.setDate(targetDay);

    return d;
  }

  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  findResident() {
    console.log('findResident called with residentId:', this.residentId);

    if (!this.residentId) {
      this.resetReceiptData();
      return;
    }

    this.residentService.findOne(this.residentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(resident => {
        if (!resident) {
          this.alertService.warn(`Residente No. ${this.residentId} no existe`);
          return;
        }

        this.alertService.success(`Residente encontrado`);
        console.log('Residente encontrado:', resident);
        const entryDate = new Date(resident.entryDate as Date);
        const sinceDate = this.addMonths(entryDate, resident.months as number);
        const untilDate = this.addMonths(sinceDate, 1);
        const accomodation = this.enumService.getEnumName('accomodation', resident.accomodation);

        this.receiptData = {
          payment: {
            id: null,
            receiptNumber: this.consecutiveNumber as number,
            date: new Date(),
            totalAmount: resident.value as number,
            resident: this.residents.find(r => r.id === this.residentId) as ResidentModel,
          },
          paymentDetails: [
            {
              id: -1,
              paymentId: null,
              code: 'Mensualidad',
              detail: `Acomodación ${accomodation} del \n${this.formatDate(sinceDate)} al ${this.formatDate(untilDate)}`,
              units: 1,
              unitPrice: resident.value,
              total: resident.value
            },
            {
              id: -2,
              paymentId: null,
              code: 'Otros cargos',
              detail: '',
              units: null,
              unitPrice: null,
              total: null
            }
          ]
        }
        console.log('Datos del recibo inicializados:', this.receiptData);
      });

  }

  async downloadReceipt() {
    this.loadingService.show(); // Activar pantalla de carga

    try {
      const { default: html2canvas } = await import('html2canvas');
      const { jsPDF } = await import('jspdf');

      const receiptElement = this.receiptContainer.nativeElement;
      if (receiptElement) {
        // Pequeña pausa para que se muestre la pantalla de carga
        await new Promise(resolve => setTimeout(resolve, 100));

        // Capturar el recibo original
        const canvas = await html2canvas(receiptElement, {
          useCORS: true,
          allowTaint: true,
          height: receiptElement.scrollHeight,
          width: receiptElement.scrollWidth
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        // Dimensiones de la página A4
        const pageWidth = 210;
        const pageHeight = 297;

        // Calcular dimensiones para cada recibo (cada uno ocupa la mitad de la página)
        const receiptWidth = pageWidth - 10; // Margen de 5mm a cada lado
        const receiptHeight = (pageHeight - 15) / 2; // Dividir en 2 con espacios

        // Calcular las dimensiones proporcionales
        const originalRatio = canvas.width / canvas.height;
        let finalWidth = receiptWidth;
        let finalHeight = receiptWidth / originalRatio;

        // Si la altura calculada es mayor que el espacio disponible, ajustar por altura
        if (finalHeight > receiptHeight) {
          finalHeight = receiptHeight;
          finalWidth = receiptHeight * originalRatio;
        }

        // Posiciones para centrar los recibos
        const xPosition = (pageWidth - finalWidth) / 2;
        const firstReceiptY = 5; // Margen superior
        const secondReceiptY = firstReceiptY + receiptHeight + 5; // Segundo recibo + espacio

        // Agregar el primer recibo (original)
        pdf.addImage(imgData, 'PNG', xPosition, firstReceiptY, finalWidth, finalHeight);

        // Agregar el segundo recibo (copia)
        pdf.addImage(imgData, 'PNG', xPosition, secondReceiptY, finalWidth, finalHeight);

        // Agregar una línea de separación entre los dos recibos
        const separatorY = firstReceiptY + receiptHeight + 2.5;
        pdf.setLineWidth(0.5);
        pdf.setDrawColor(150, 150, 150); // Color gris
        pdf.line(10, separatorY, pageWidth - 10, separatorY);

        // Agregar texto opcional para diferenciar los recibos
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text('ORIGINAL', xPosition, firstReceiptY - 1);
        pdf.text('COPIA', xPosition, secondReceiptY + 1);

        const today = new Date();
        const day = today.getDate().toString().padStart(2, '0');
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const year = today.getFullYear();
        const dateStr = `${day}-${month}-${year}`;

        // Pequeña pausa antes de la descarga para mostrar progreso
        await new Promise(resolve => setTimeout(resolve, 200));

        pdf.save(`recibo-fundacion-santa-lucia-${dateStr}.pdf`);

        // Mostrar mensaje de éxito
        this.alertService.success('PDF descargado exitosamente');
        this.visible = false; // Cerrar el diálogo después de descargar el PDF
        this.created.emit(); // Notificar que se creó un recibo
      }
    } catch (error) {
      console.error('Error al generar PDF:', error);
      this.alertService.error('Error al generar el PDF. Por favor, intenta nuevamente.');
    } finally {
      this.loadingService.hide(); // Desactivar pantalla de carga
    }
  }

  resetReceiptData(): void {
    this.receiptData = null;
    this.residentId = null;
  }

  calculateTotal(paymentDetail: PaymentDetailModel) {
    if (paymentDetail.units && paymentDetail.unitPrice) {
      paymentDetail.total = paymentDetail.unitPrice * paymentDetail.units;
    } else {
      paymentDetail.total = null; // Si no hay unidades o precio, total es nulo
    }
    this.calculateTotalAmount(); // Recalcular el total del recibo
  }

  calculateTotalAmount() {
    if (this.receiptData) {
      this.receiptData.payment.totalAmount = this.receiptData.paymentDetails.reduce((total, item) => {
        return total + (item.total || 0);
      }, 0);
    }
  }

  savePayment() {
    console.log(this.receiptData);
    // return
    this.receiptService.save(this.receiptData as any)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (receipt) => {
          this.alertService.success('Pago guardado exitosamente');
          this.downloadReceipt(); // Descargar el recibo después de guardar el pago
          // this.savePaymentDetails(payment.id);
        },
        error: (error) => {
          this.alertService.error('Error al guardar el pago');
        }
      });
  }
}
