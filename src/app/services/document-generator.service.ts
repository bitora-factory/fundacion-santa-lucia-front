import { Injectable } from '@angular/core';
import { ResidentModel } from '../models/resident.model';
import { EnumService } from './enum.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentGeneratorService {

  constructor(private enumService: EnumService) { }

  /**
   * Genera contrato de residencia
   */
  async generateContract(resident: ResidentModel): Promise<void> {
    console.log('🔄 Generando contrato para:', resident.name);
    
    try {
      await this.generateWordDocument('CONSENTIMIENTO-INFORMADO.docx', resident, 'contrato');
    } catch (error) {
      console.warn('❌ Error con plantilla Word, usando HTML:', error);
      await this.generateHTMLDocument('contrato-demo.html', resident, `Contrato-${resident.name}.html`);
    }
  }

  /**
   * Genera autorización médica
   */
  async generateAuthorization(resident: ResidentModel): Promise<void> {
    console.log('🔄 Generando autorización para:', resident.name);
    
    try {
      await this.generateWordDocument('autorizacion-template.docx', resident, 'autorizacion');
    } catch (error) {
      console.warn('❌ Error con plantilla Word, usando HTML:', error);
      await this.generateHTMLDocument('autorizacion-demo.html', resident, `Autorizacion-${resident.name}.html`);
    }
  }

  /**
   * Genera documento Word genérico
   */
  private async generateWordDocument(templateName: string, resident: ResidentModel, docType: string): Promise<void> {
    // Importar librerías dinámicamente
    const { default: PizZip } = await import('pizzip');
    const { default: Docxtemplater } = await import('docxtemplater');
    const { saveAs } = await import('file-saver');
    
    // Cargar plantilla
    const response = await fetch(`./assets/templates/${templateName}`);
    if (!response.ok) {
      throw new Error(`Plantilla ${templateName} no encontrada`);
    }
    
    const templateBuffer = await response.arrayBuffer();
    
    // Procesar documento
    const zip = new PizZip(templateBuffer);
    console.log('llega por acá', zip);
    
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: { start: '{{', end: '}}' }
    });
    console.log('llega por acá', doc);
    
    // Preparar datos
    const data = this.prepareDocumentData(resident);
    
    // Renderizar
    doc.render(data);

    // Generar archivo
    const output = doc.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    // Descargar
    const fileName = `${docType}-${resident.name?.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.docx`;
    saveAs(output, fileName);
    
    console.log('✅ Documento generado:', fileName);
  }

  /**
   * Genera documento HTML de respaldo
   */
  private async generateHTMLDocument(templateName: string, resident: ResidentModel, fileName: string): Promise<void> {
    const { saveAs } = await import('file-saver');
    
    const response = await fetch(`/assets/templates/${templateName}`);
    if (!response.ok) {
      throw new Error(`Plantilla HTML ${templateName} no encontrada`);
    }
    
    let content = await response.text();
    const data = this.prepareDocumentData(resident);
    
    // Reemplazar variables
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(regex, data[key]);
    });
    
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    saveAs(blob, fileName);
    
    console.log('✅ Documento HTML generado:', fileName);
  }

  /**
   * Prepara datos del residente para las plantillas
   */
  private prepareDocumentData(resident: ResidentModel): Record<string, string> {
    const today = new Date();
    
    // Datos con valores por defecto seguros
    return {
      // Información básica del residente
      NOMBRE: resident.name || '',
      RESIDENT_NAME: resident.name || '',
      CEDULA: resident.dni?.toString() || '',
      RESIDENT_ID: resident.dni?.toString() || '',
      DNI: resident.dni?.toString() || '',
      
      // Información del responsable
      RESPONSABLE: resident.guardian || '',
      GUARDIAN_NAME: resident.guardian || '',
      ACUDIENTE: resident.guardian || '',
      CEDULA_RESPONSABLE: resident.guardianDni?.toString() || '',
      GUARDIAN_DNI: resident.guardianDni?.toString() || '',
      GUARDIAN_ID: resident.guardianDni?.toString() || '',
      
      // Información de contacto
      DIRECCION: resident.address || '',
      ADDRESS: resident.address || '',
      TELEFONO: resident.phone || '',
      PHONE: resident.phone || '',
      
      // Información de servicio
      // ACOMODACION: this.enumService.getEnumName('accomodation', resident.accomodation) || '',
      // ACCOMMODATION: this.enumService.getEnumName('accomodation', resident.accomodation) || '',
      // ACCOMMODATION_TYPE: this.enumService.getEnumName('accomodation', resident.accomodation) || '',
      
      // Información financiera
      VALOR: resident.value?.toLocaleString('es-CO') || '',
      VALUE: resident.value?.toLocaleString('es-CO') || '',
      VALOR_MENSUAL: resident.value?.toLocaleString('es-CO') || '',
      MONTHLY_VALUE: resident.value?.toLocaleString('es-CO') || '',
      MONTHLY_COST: resident.value?.toLocaleString('es-CO') || '',
      COSTO_MENSUAL: resident.value?.toLocaleString('es-CO') || '',
      
      // Fechas
      FECHA_INGRESO: this.formatDate(resident.entryDate),
      ENTRY_DATE: this.formatDate(resident.entryDate),
      FECHA_ACTUAL: this.formatDate(today),
      CURRENT_DATE: this.formatDate(today),
      ANO_ACTUAL: today.getFullYear().toString(),
      CURRENT_YEAR: today.getFullYear().toString(),
      
      // Información adicional
      MESES: resident.months?.toString() || '0',
      MONTHS: resident.months?.toString() || '0',
      // TIPO_PAGO: this.enumService.getPaymentMethodNames(resident.paymentMethod || resident.payment || '') || '',
      // PAYMENT_TYPE: this.enumService.getPaymentMethodNames(resident.paymentMethod || resident.payment || '') || '',
      // ESTADO: this.enumService.getEnumName('status', resident.status) || '',
      // STATUS: this.enumService.getEnumName('status', resident.status) || '',
      
      // Información de la fundación
      FUNDACION: 'FUNDACIÓN CASA SANTA LUCÍA',
      FOUNDATION_NAME: 'FUNDACIÓN CASA SANTA LUCÍA',
      NIT: '901381837-1',
      FOUNDATION_NIT: '901381837-1'
    };
  }

  /**
   * Formatea fecha a dd/MM/yyyy
   */
  private formatDate(date: Date | string | null): string {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    
    return `${day}/${month}/${year}`;
  }
}
