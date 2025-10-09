# Instalación de dependencias para generación de documentos

Para habilitar la generación automática de documentos, ejecuta los siguientes comandos:

```bash
# Instalar dependencias principales
npm install pizzip docxtemplater file-saver

# Instalar tipos de TypeScript
npm install --save-dev @types/file-saver

# Para generar PDFs directamente (opcional)
npm install jspdf html2canvas
```

## Estructura de carpetas necesaria

Crea la siguiente estructura en tu carpeta `src/assets/`:

```
src/assets/
  templates/
    contrato-template.docx
    autorizacion-template.docx
    ficha-medica-template.docx
```

## Cómo crear las plantillas

1. Abre Microsoft Word
2. Crea tu documento con el formato deseado
3. Usa marcadores de posición con doble llaves: {{NOMBRE_VARIABLE}}
4. Guarda como .docx en la carpeta templates

## Variables disponibles

- {{RESIDENT_NAME}} - Nombre del residente
- {{RESIDENT_DNI}} - Cédula del residente
- {{GUARDIAN_NAME}} - Nombre del acudiente
- {{GUARDIAN_DNI}} - Cédula del acudiente
- {{ADDRESS}} - Dirección
- {{PHONE}} - Teléfono
- {{VALUE}} - Valor mensual
- {{ACCOMMODATION}} - Tipo de acomodación
- {{ENTRY_DATE}} - Fecha de ingreso
- {{CURRENT_DATE}} - Fecha actual
- {{FOUNDATION_NAME}} - Nombre de la fundación
- {{FOUNDATION_NIT}} - NIT de la fundación

Y muchas más... consulta el servicio DocumentGeneratorService para ver todas las variables disponibles.
