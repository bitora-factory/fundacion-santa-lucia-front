# 🔍 DIAGNÓSTICO: Por qué no se descarga el .docx

## 📋 **Pasos para Verificar el Problema**

### 1. **Verificar Consola del Navegador**
1. Abre el navegador (Chrome/Firefox)
2. Ve a la aplicación (http://localhost:4201)
3. Abre las **Herramientas de Desarrollo** (F12)
4. Ve a la pestaña **Console**
5. Haz clic en el botón verde de "Generar documentos"
6. **Revisa los logs** - deberías ver mensajes como:
   ```
   🔄 Iniciando generación de contrato para: [Nombre]
   ✅ Librerías importadas correctamente
   🔍 Buscando plantilla en: /assets/templates/CONSENTIMIENTO-INFORMADO.docx
   📄 Respuesta de fetch: 200 OK
   ✅ Plantilla Word encontrada, procesando...
   📊 Tamaño del buffer: [número] bytes
   📝 Datos preparados para el documento: [número] variables
   🔄 Documento renderizado con datos
   📦 Blob generado, tamaño: [número] bytes
   💾 Descargando archivo: [nombre-archivo]
   ✅ Descarga iniciada exitosamente
   ```

### 2. **Posibles Errores y Soluciones**

#### ❌ **Error 404: Archivo no encontrado**
```
📄 Respuesta de fetch: 404 Not Found
```
**Solución:** Verificar que el archivo esté en `src/assets/templates/CONSENTIMIENTO-INFORMADO.docx`

#### ❌ **Error de CORS**
```
Access to fetch at 'file://...' from origin 'http://localhost:4201' has been blocked by CORS
```
**Solución:** El archivo está en lugar correcto, problema de servidor de desarrollo

#### ❌ **Error de librerías**
```
❌ Error con plantilla Word: Cannot find module 'pizzip'
```
**Solución:** Ejecutar `npm install pizzip docxtemplater file-saver @types/file-saver`

#### ❌ **Archivo vacío o corrupto**
```
📊 Tamaño del buffer: 0 bytes
```
**Solución:** El archivo .docx está corrupto o vacío

#### ❌ **Problema con variables**
```
Error: Multi error object
```
**Solución:** Variables en la plantilla Word no coinciden con las enviadas

### 3. **Verificaciones Manuales**

#### **A. Verificar Archivo en Carpeta**
```bash
dir "src\\assets\\templates"
```
Debe mostrar: `CONSENTIMIENTO-INFORMADO.docx`

#### **B. Verificar Tamaño del Archivo**
- El archivo debe tener más de 0 KB
- Un archivo Word típico tiene al menos 10-20 KB

#### **C. Probar Descarga Manual**
- Ir directamente a: `http://localhost:4201/assets/templates/CONSENTIMIENTO-INFORMADO.docx`
- Si funciona: el archivo está accesible
- Si no: problema de configuración de Angular

### 4. **Prueba de Red en Navegador**
1. Abrir **Herramientas de Desarrollo** (F12)
2. Ir a pestaña **Network/Red**
3. Hacer clic en generar documento
4. Buscar request a `CONSENTIMIENTO-INFORMADO.docx`
5. Ver el **Status Code**:
   - 200 = ✅ Éxito
   - 404 = ❌ Archivo no encontrado
   - 500 = ❌ Error del servidor

## 🔧 **Soluciones Rápidas**

### **Solución 1: Verificar Nombre del Archivo**
El servicio busca: `CONSENTIMIENTO-INFORMADO.docx`
Verificar que el nombre sea **exactamente igual** (mayúsculas, guiones, etc.)

### **Solución 2: Reiniciar Servidor**
```bash
Ctrl+C  # Detener servidor
ng serve --port 4201  # Reiniciar
```

### **Solución 3: Forzar Recarga del Navegador**
- Ctrl+Shift+R (recarga forzada)
- O limpiar caché del navegador

### **Solución 4: Verificar Permisos**
- Verificar que el archivo no esté bloqueado
- Verificar permisos de lectura

## 🎯 **Lo que Deberías Ver**

**En la consola cuando funciona correctamente:**
```
🔄 Iniciando generación de contrato para: JUAN PÉREZ
✅ Librerías importadas correctamente
🔍 Buscando plantilla en: /assets/templates/CONSENTIMIENTO-INFORMADO.docx
📄 Respuesta de fetch: 200 OK
✅ Plantilla Word encontrada, procesando...
📊 Tamaño del buffer: 45123 bytes
📝 Datos preparados para el documento: 15 variables
🔄 Documento renderizado con datos
📦 Blob generado, tamaño: 47892 bytes
💾 Descargando archivo: contrato-juan-pérez-1692834567890.docx
✅ Descarga iniciada exitosamente
```

## 📞 **Siguiente Paso**
1. Probar con la aplicación ejecutándose
2. Abrir consola del navegador
3. Generar documento
4. **Compartir los logs de la consola** para diagnóstico específico
