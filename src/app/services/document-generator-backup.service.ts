import { Injectable } from '@angular/core';
import { ResidentModel } from '../models/resident.model';
import { EnumService } from './enum.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentGeneratorService {

  constructor(private enumService: EnumService) { }

  /**
   * Genera documentos PDF a partir de plantillas y datos del residente
   */
  async generateContract(resident: ResidentModel): Promise<void> {
    try {
      console.log('🔄 Iniciando generación de contrato para:', resident);

      // Importar las librerías dinámicamente
      const { default: PizZip } = await import('pizzip');
      const { default: Docxtemplater } = await import('docxtemplater');
      const { saveAs } = await import('file-saver');
      console.log('✅ Librerías importadas correctamente');

      try {
        // Intentar cargar la plantilla Word
        console.log('🔍 Buscando plantilla en: /assets/templates/CONSENTIMIENTO-INFORMADO.docx');
        const templateResponse = await fetch('/assets/templates/CONSENTIMIENTO-INFORMADO.docx');
        console.log('📄 Respuesta de fetch:', templateResponse.status, templateResponse.statusText);

        if (!templateResponse.ok) {
          throw new Error(`Plantilla Word no encontrada. Status: ${templateResponse.status}`);
        }

        console.log('✅ Plantilla Word encontrada, procesando...');
        const templateBuffer = await templateResponse.arrayBuffer();
        console.log('📊 Tamaño del buffer:', templateBuffer.byteLength, 'bytes');

        // Limpiar plantilla antes de procesarla
        const cleanedBuffer = await this.cleanWordTemplate(templateBuffer);

        const zip = new PizZip(cleanedBuffer);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
          delimiters: {
            start: '{{',
            end: '}}'
          }
        });

        // Extraer variables de la plantilla para debugging
        const templateVariables = this.extractTemplateVariables(zip);
        console.log('🏷️  Variables encontradas en la plantilla:', templateVariables);

        const documentData = this.prepareDocumentData(resident);
        console.log('📝 Datos preparados para el documento:', documentData);

        doc.render(documentData);
        console.log('🔄 Documento renderizado con datos');

        const output = doc.getZip().generate({
          type: 'blob',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });
        console.log('📦 Blob generado, tamaño:', output.size, 'bytes');

        const fileName = `contrato-${resident.name?.replace(/\s+/g, '-').toLowerCase()}-${new Date().getTime()}.docx`;
        console.log('💾 Descargando archivo:', fileName);

        saveAs(output, fileName);
        console.log('✅ Descarga iniciada exitosamente');

      } catch (wordError: any) {
        console.error('❌ Error con plantilla Word:', wordError);

        // Si es un error de Docxtemplater, mostrar detalles específicos
        if (wordError.name === 'TemplateError') {
          console.error('🔍 Detalles del error de plantilla:');

          if (wordError.properties && wordError.properties.errors) {
            wordError.properties.errors.forEach((error: any, index: number) => {
              console.error(`Error ${index + 1}:`, {
                type: error.name,
                explanation: error.explanation,
                part: error.part,
                scope: error.scope,
                context: error.context,
                xtag: error.xtag
              });

              // Sugerencias específicas para errores comunes
              if (error.id === 'duplicate_open_tag') {
                console.error(`💡 Sugerencia: El tag "${error.xtag}" tiene llaves de apertura duplicadas. Busca en tu documento Word algo como "{{${error.xtag.replace(/[{}]/g, '')}" y cámbialo a "{${error.xtag.replace(/[{}]/g, '')}}"`);
              } else if (error.id === 'duplicate_close_tag') {
                console.error(`💡 Sugerencia: El tag "${error.xtag}" tiene llaves de cierre duplicadas. Busca en tu documento Word algo como "${error.xtag}}}" y cámbialo a "${error.xtag}}"`);
              }
            });
          } else if (wordError.message.includes('Duplicate open tag')) {
            console.error('💡 El documento tiene tags con llaves de apertura duplicadas como {{{{ en lugar de {{');
            console.error('💡 Revisa tu documento Word y busca variables que tengan más de dos llaves al inicio');
          } else if (wordError.message.includes('Duplicate close tag')) {
            console.error('💡 El documento tiene tags con llaves de cierre duplicadas como }}}} en lugar de }}');
            console.error('💡 Revisa tu documento Word y busca variables que tengan más de dos llaves al final');
          }
        }

        throw new Error('Error al generar el documento. Por favor intenta nuevamente.');
        // await this.generateHTMLDocument('contrato-demo.html', resident, `Contrato-${resident.name}.html`);
      }

    } catch (error) {
      console.error('Error generando documento:', error);
      throw new Error('Error al generar el documento. Por favor intenta nuevamente.');
    }
  }

  /**
   * Genera múltiples documentos para un residente
   */
  async generateAllDocuments(resident: ResidentModel): Promise<void> {
    const documentTypes = [
      { type: 'contrato', method: () => this.generateContract(resident) },
      { type: 'autorizacion', method: () => this.generateAuthorization(resident) },
      { type: 'ficha-medica', method: () => this.generateMedicalForm(resident) }
    ];

    for (const doc of documentTypes) {
      try {
        await doc.method();
        console.log(`${doc.type} generado exitosamente`);
      } catch (error) {
        console.error(`Error generando ${doc.type}:`, error);
      }
    }
  }

  /**
   * Genera autorización médica
   */
  async generateAuthorization(resident: ResidentModel): Promise<void> {
    try {
      // Importar las librerías dinámicamente
      const { default: PizZip } = await import('pizzip');
      const { default: Docxtemplater } = await import('docxtemplater');
      const { saveAs } = await import('file-saver');

      try {
        // Intentar cargar la plantilla Word
        const templateResponse = await fetch('/assets/templates/autorizacion-template.docx');
        if (!templateResponse.ok) throw new Error('Plantilla Word no encontrada');

        const templateBuffer = await templateResponse.arrayBuffer();
        const zip = new PizZip(templateBuffer);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        });

        const documentData = this.prepareDocumentData(resident);
        doc.render(documentData);

        const output = doc.getZip().generate({
          type: 'blob',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });

        const fileName = `autorizacion-${resident.name?.replace(/\s+/g, '-').toLowerCase()}-${new Date().getTime()}.docx`;
        saveAs(output, fileName);

      } catch (wordError) {
        console.warn('Plantilla Word no encontrada, usando plantilla HTML de demostración');
        await this.generateHTMLDocument('autorizacion-demo.html', resident, `Autorizacion-${resident.name}.html`);
      }

    } catch (error) {
      console.error('Error generando autorización:', error);
      throw new Error('Error al generar la autorización. Por favor intenta nuevamente.');
    }
  }

  /**
   * Genera ficha médica
   */
  async generateMedicalForm(resident: ResidentModel): Promise<void> {
    try {
      // Importar las librerías dinámicamente
      const { default: PizZip } = await import('pizzip');
      const { default: Docxtemplater } = await import('docxtemplater');
      const { saveAs } = await import('file-saver');

      const templateResponse = await fetch('/assets/templates/ficha-medica-template.docx');
      const templateBuffer = await templateResponse.arrayBuffer();

      const zip = new PizZip(templateBuffer);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      const documentData = this.prepareDocumentData(resident);
      doc.render(documentData);

      const output = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      const fileName = `ficha-medica-${resident.name?.replace(/\s+/g, '-').toLowerCase()}-${new Date().getTime()}.docx`;
      saveAs(output, fileName);

    } catch (error) {
      console.error('Error generando ficha médica:', error);
      throw new Error('Error al generar la ficha médica. Por favor intenta nuevamente.');
    }
  }

  /**
   * Genera documentos HTML como alternativa cuando no hay plantillas Word
   */
  private async generateHTMLDocument(templateName: string, resident: ResidentModel, fileName: string): Promise<void> {
    try {
      const { saveAs } = await import('file-saver');

      // Cargar plantilla HTML
      const templateResponse = await fetch(`/assets/templates/${templateName}`);
      if (!templateResponse.ok) {
        throw new Error(`Plantilla HTML ${templateName} no encontrada`);
      }

      let htmlContent = await templateResponse.text();

      // Preparar datos y reemplazar variables en HTML
      const documentData = this.prepareDocumentData(resident);

      // Reemplazar todas las variables en el contenido HTML
      Object.keys(documentData).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        htmlContent = htmlContent.replace(regex, documentData[key]);
      });

      // Crear blob y descargar
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      saveAs(blob, fileName);

    } catch (error) {
      console.error('Error generando documento HTML:', error);
      throw new Error('Error al generar el documento HTML.');
    }
  }

  /**
   * Prepara los datos del residente para el documento
   */
  private prepareDocumentData(resident: ResidentModel): any {
    const today = new Date();

    // Datos base con múltiples variaciones de nombres de variables
    const data: any = {
      // Variaciones del nombre del residente
      RESIDENT_NAME: resident.name || '[NOMBRE NO PROPORCIONADO]',
      RESIDENTE_NOMBRE: resident.name || '[NOMBRE NO PROPORCIONADO]',
      NOMBRE_RESIDENTE: resident.name || '[NOMBRE NO PROPORCIONADO]',
      NOMBRE: resident.name || '[NOMBRE NO PROPORCIONADO]',

      // Variaciones de la cédula del residente
      RESIDENT_DNI: resident.dni?.toString() || '[CÉDULA NO PROPORCIONADA]',
      RESIDENT_ID: resident.dni?.toString() || '[CÉDULA NO PROPORCIONADA]',
      CEDULA_RESIDENTE: resident.dni?.toString() || '[CÉDULA NO PROPORCIONADA]',
      CEDULA: resident.dni?.toString() || '[CÉDULA NO PROPORCIONADA]',
      DNI: resident.dni?.toString() || '[CÉDULA NO PROPORCIONADA]',

      // Variaciones del nombre del responsable/tutor
      GUARDIAN_NAME: resident.guardian || '[RESPONSABLE NO PROPORCIONADO]',
      RESPONSABLE_NOMBRE: resident.guardian || '[RESPONSABLE NO PROPORCIONADO]',
      TUTOR_NOMBRE: resident.guardian || '[RESPONSABLE NO PROPORCIONADO]',
      ACUDIENTE: resident.guardian || '[RESPONSABLE NO PROPORCIONADO]',

      // Variaciones de la cédula del responsable
      GUARDIAN_DNI: resident.guardianDni?.toString() || '[CÉDULA RESPONSABLE NO PROPORCIONADA]',
      GUARDIAN_ID: resident.guardianDni?.toString() || '[CÉDULA RESPONSABLE NO PROPORCIONADA]',
      CEDULA_RESPONSABLE: resident.guardianDni?.toString() || '[CÉDULA RESPONSABLE NO PROPORCIONADA]',
      CEDULA_TUTOR: resident.guardianDni?.toString() || '[CÉDULA RESPONSABLE NO PROPORCIONADA]',

      // Información de contacto
      ADDRESS: resident.address || '[DIRECCIÓN NO PROPORCIONADA]',
      DIRECCION: resident.address || '[DIRECCIÓN NO PROPORCIONADA]',
      PHONE: resident.phone || '[TELÉFONO NO PROPORCIONADO]',
      TELEFONO: resident.phone || '[TELÉFONO NO PROPORCIONADO]',

      // Información de residencia
      ACCOMMODATION: this.enumService.getEnumName('accomodation', resident.accomodation) || '[ACOMODACIÓN NO ESPECIFICADA]',
      ACOMODACION: this.enumService.getEnumName('accomodation', resident.accomodation) || '[ACOMODACIÓN NO ESPECIFICADA]',
      ACCOMMODATION_TYPE: this.enumService.getEnumName('accomodation', resident.accomodation) || '[ACOMODACIÓN NO ESPECIFICADA]',

      // Información financiera
      VALUE: resident.value?.toLocaleString('es-CO') || '[VALOR NO ESPECIFICADO]',
      VALOR: resident.value?.toLocaleString('es-CO') || '[VALOR NO ESPECIFICADO]',
      MONTHLY_VALUE: resident.value?.toLocaleString('es-CO') || '[VALOR NO ESPECIFICADO]',
      VALOR_MENSUAL: resident.value?.toLocaleString('es-CO') || '[VALOR NO ESPECIFICADO]',
      MONTHLY_COST: resident.value?.toLocaleString('es-CO') || '[VALOR NO ESPECIFICADO]',
      COSTO_MENSUAL: resident.value?.toLocaleString('es-CO') || '[VALOR NO ESPECIFICADO]',
      ANNUAL_VALUE: resident.value ? (resident.value * 12).toLocaleString('es-CO') : '[VALOR NO ESPECIFICADO]',

      // Fechas
      ENTRY_DATE: this.formatDate(resident.entryDate) || '[FECHA DE INGRESO NO ESPECIFICADA]',
      FECHA_INGRESO: this.formatDate(resident.entryDate) || '[FECHA DE INGRESO NO ESPECIFICADA]',
      CURRENT_DATE: this.formatDate(today),
      FECHA_ACTUAL: this.formatDate(today),
      CURRENT_YEAR: today.getFullYear().toString(),
      ANO_ACTUAL: today.getFullYear().toString(),

      // Información adicional
      MONTHS: resident.months?.toString() || '0',
      MESES: resident.months?.toString() || '0',
      PAYMENT_TYPE: this.enumService.getEnumName('payment', resident.payment) || '[TIPO DE PAGO NO ESPECIFICADO]',
      TIPO_PAGO: this.enumService.getEnumName('payment', resident.payment) || '[TIPO DE PAGO NO ESPECIFICADO]',
      STATUS: this.enumService.getEnumName('status', resident.status) || '[ESTADO NO ESPECIFICADO]',
      ESTADO: this.enumService.getEnumName('status', resident.status) || '[ESTADO NO ESPECIFICADO]',

      // Información de la fundación
      FOUNDATION_NAME: 'FUNDACIÓN CASA SANTA LUCÍA',
      NOMBRE_FUNDACION: 'FUNDACIÓN CASA SANTA LUCÍA',
      FOUNDATION_NIT: '901381837-1',
      NIT_FUNDACION: '901381837-1',
      FOUNDATION_ADDRESS: 'Km 7 vía a Altagracia - Pereira / Risaralda',
      DIRECCION_FUNDACION: 'Km 7 vía a Altagracia - Pereira / Risaralda',

      // Información de edad (si hay fecha de nacimiento)
      AGE: '[EDAD NO CALCULADA]',
      EDAD: '[EDAD NO CALCULADA]',
      BIRTH_DATE: '[FECHA DE NACIMIENTO NO PROPORCIONADA]',
      FECHA_NACIMIENTO: '[FECHA DE NACIMIENTO NO PROPORCIONADA]'
    };

    // Agregar variaciones con guiones bajos y diferentes formatos
    const variations = { ...data };
    Object.keys(data).forEach(key => {
      // Crear versiones con guiones bajos
      const underscoreKey = key.replace(/([A-Z])/g, '_$1').toUpperCase().replace(/^_/, '');
      variations[underscoreKey] = data[key];

      // Crear versiones en minúsculas
      variations[key.toLowerCase()] = data[key];
    });

    return variations;
  }

  /**
   * Limpia una plantilla Word corrigiendo tags mal formateados
   */
  private async cleanWordTemplate(templateBuffer: ArrayBuffer): Promise<ArrayBuffer> {
    try {
      const PizZip = (await import('pizzip')).default;
      const zip = new PizZip(templateBuffer);

      // Leer el contenido del documento principal
      const documentXml = zip.files['word/document.xml'];
      if (!documentXml) {
        console.warn('No se encontró word/document.xml en la plantilla');
        return templateBuffer;
      }

      let content = documentXml.asText();
      console.log('🧹 Limpiando tags mal formateados en la plantilla...');

      // Patrones de limpieza para corregir tags duplicados o mal formateados
      const cleaningPatterns = [
        // Corregir llaves cuádruples: {{{{ -> {{
        { pattern: /\{\{\{\{/g, replacement: '{{' },
        { pattern: /\}\}\}\}/g, replacement: '}}' },

        // Corregir llaves triples: {{{ -> {{
        { pattern: /\{\{\{/g, replacement: '{{' },
        { pattern: /\}\}\}/g, replacement: '}}' },

        // Corregir espacios dentro de tags: {{ VARIABLE }} -> {{VARIABLE}}
        { pattern: /\{\{\s+/g, replacement: '{{' },
        { pattern: /\s+\}\}/g, replacement: '}}' },

        // Corregir tags partidos por XML (común en Word)
        { pattern: /<\/w:t><w:t[^>]*>\s*<\/w:t><w:t[^>]*>/g, replacement: '' },
        { pattern: /<\/w:r><w:r[^>]*><w:t[^>]*>/g, replacement: '' },

        // Limpiar caracteres especiales dentro de tags
        { pattern: /\{\{([^}]*?)[^\w\s}]([^}]*?)\}\}/g, replacement: '{{$1$2}}' }
      ];

      let originalContent = content;
      cleaningPatterns.forEach((pattern, index) => {
        const beforeLength = content.length;
        content = content.replace(pattern.pattern, pattern.replacement);
        const afterLength = content.length;
        if (beforeLength !== afterLength) {
          console.log(`✅ Aplicado patrón ${index + 1}: ${beforeLength - afterLength} caracteres corregidos`);
        }
      });

      // Verificar si se hicieron cambios
      if (originalContent !== content) {
        console.log('🔧 Plantilla limpiada, aplicando cambios...');

        // Actualizar el contenido en el ZIP
        zip.file('word/document.xml', content);

        // Generar nuevo buffer
        const cleanedBuffer = zip.generate({
          type: 'arraybuffer',
          compression: 'DEFLATE'
        });

        return cleanedBuffer;
      } else {
        console.log('✨ Plantilla ya está limpia, no se requieren cambios');
        return templateBuffer;
      }

    } catch (error) {
      console.warn('⚠️ No se pudo limpiar la plantilla, usando original:', error);
      return templateBuffer;
    }
  }

  /**
   * Extrae las variables de una plantilla Word para debugging
   */
  private extractTemplateVariables(zip: any): string[] {
    try {
      const content = zip.files['word/document.xml']?.asText();
      if (!content) return [];

      const regex = /\{\{([^}]+)\}\}/g;
      const variables: string[] = [];
      let match;

      while ((match = regex.exec(content)) !== null) {
        if (!variables.includes(match[1])) {
          variables.push(match[1]);
        }
      }

      return variables.sort();
    } catch (error) {
      console.warn('No se pudieron extraer variables de la plantilla:', error);
      return [];
    }
  }

  /**
   * Formatea una fecha al formato dd/MM/yyyy
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

  /**
   * Valida que el residente tenga los datos mínimos necesarios
   */
  private validateResidentData(resident: ResidentModel): boolean {
    const requiredFields = ['name', 'dni', 'guardian', 'guardianDni'];
    return requiredFields.every(field => resident[field as keyof ResidentModel]);
  }
}
