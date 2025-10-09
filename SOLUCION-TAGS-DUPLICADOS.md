# 🔧 SOLUCIÓN: Tags Duplicados en Plantilla Word

## 🎯 **Problema Identificado**
Tu plantilla `CONSENTIMIENTO-INFORMADO.docx` tiene **tags con llaves duplicadas**:
- ❌ **`{{{{RESIDENT_NAME}}}}`** (4 llaves - INCORRECTO)
- ✅ **`{{RESIDENT_NAME}}`** (2 llaves - CORRECTO)

## 🔍 **Errores Específicos Detectados**
1. **Tag `{{RESI`** - Llaves de apertura duplicadas
2. **Tag `AME }}`** - Llaves de cierre duplicadas

Esto sugiere que en tu documento hay algo como: **`{{{{RESIDENT_NAME}}}}`**

## 🛠️ **Soluciones Implementadas**

### 1. **Limpieza Automática**
El sistema ahora:
- ✅ Detecta tags mal formateados automáticamente
- ✅ Corrige llaves cuádruples `{{{{` → `{{`
- ✅ Corrige llaves triples `{{{` → `{{`
- ✅ Elimina espacios dentro de tags
- ✅ Corrige fragmentación XML de Word

### 2. **Diagnóstico Mejorado**
Ahora verás mensajes específicos como:
```
💡 Sugerencia: El tag "{{RESI" tiene llaves de apertura duplicadas
💡 Busca en tu documento Word algo como "{{{{RESIDENT_NAME" 
💡 y cámbialo a "{{RESIDENT_NAME}}"
```

## ⚡ **Prueba la Corrección Automática**

1. **Recarga la página** (Ctrl+Shift+R)
2. **Abre la consola** (F12)
3. **Genera documento** - deberías ver:
```
🧹 Limpiando tags mal formateados en la plantilla...
✅ Aplicado patrón 1: X caracteres corregidos
🔧 Plantilla limpiada, aplicando cambios...
```

## 📝 **Si Aún No Funciona - Corrección Manual**

### **Paso 1: Abrir el Documento Word**
1. Abre `CONSENTIMIENTO-INFORMADO.docx` en Microsoft Word
2. Usa **Ctrl+H** para "Buscar y Reemplazar"

### **Paso 2: Buscar y Corregir Tags Duplicados**

| **Buscar** | **Reemplazar con** | **Descripción** |
|---|---|---|
| `{{{{` | `{{` | Corrige 4 llaves de apertura |
| `}}}}` | `}}` | Corrige 4 llaves de cierre |
| `{{{` | `{{` | Corrige 3 llaves de apertura |
| `}}}` | `}}` | Corrige 3 llaves de cierre |

### **Paso 3: Verificar Variables Comunes**
Asegúrate de que tus variables se vean así:
- ✅ `{{NOMBRE}}`
- ✅ `{{CEDULA}}`
- ✅ `{{RESPONSABLE}}`
- ✅ `{{FECHA_ACTUAL}}`

❌ **NO así:**
- `{{{{NOMBRE}}}}`
- `{{{CEDULA}}}`
- `{{ RESPONSABLE }}` (con espacios)

### **Paso 4: Guardar y Probar**
1. Guarda el documento Word
2. Recarga la aplicación web
3. Genera documento nuevamente

## 🎯 **Variables Disponibles para tu Plantilla**

Puedes usar cualquiera de estas variables en tu documento:

| **Variable** | **Descripción** | **Ejemplo** |
|---|---|---|
| `{{NOMBRE}}` | Nombre del residente | JUAN PÉREZ |
| `{{CEDULA}}` | Cédula del residente | 12345678 |
| `{{RESPONSABLE}}` | Nombre del responsable | MARÍA GARCÍA |
| `{{CEDULA_RESPONSABLE}}` | Cédula del responsable | 87654321 |
| `{{DIRECCION}}` | Dirección | CALLE 123 #45-67 |
| `{{TELEFONO}}` | Teléfono | 3001234567 |
| `{{FECHA_ACTUAL}}` | Fecha de hoy | 13/08/2025 |
| `{{FECHA_INGRESO}}` | Fecha de ingreso | 01/08/2025 |
| `{{VALOR}}` | Valor mensual | $1.500.000 |
| `{{ACOMODACION}}` | Tipo de acomodación | Individual |

## 🚨 **Error Común en Word**

Word a veces **fragmenta las variables** cuando:
- Escribes `{{NOMBRE}}` y después lo editas
- Copias y pegas variables
- Cambias formato (negrita, cursiva) en medio de una variable

**Solución:** Vuelve a escribir la variable completa de una vez.

## ✅ **Resultado Esperado**

Cuando funcione verás:
```
🧹 Limpiando tags mal formateados en la plantilla...
✨ Plantilla ya está limpia, no se requieren cambios
🏷️ Variables encontradas en la plantilla: ["NOMBRE", "CEDULA", "RESPONSABLE"]
📝 Datos preparados para el documento: {NOMBRE: "JUAN PÉREZ", ...}
🔄 Documento renderizado con datos
📦 Blob generado, tamaño: 47892 bytes
💾 Descargando archivo: contrato-juan-pérez-1692834567890.docx
✅ Descarga iniciada exitosamente
```

**¡Y tu documento .docx se descargará con todos los datos llenados!** 🎊
