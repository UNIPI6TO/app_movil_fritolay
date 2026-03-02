# 📧 Servicio de Email - Guía de Configuración

## 🚨 ERROR: 5.7.0 Authentication Required

Si recibes este error al intentar enviar emails:
```
System.Net.Mail.SmtpException: 'The SMTP server requires a secure connection or the client was not authenticated. 
The server response was: 5.7.0 Authentication Required'
```

### ✅ SOLUCIÓN RÁPIDA (3 pasos)

**1. Ve a:** https://myaccount.google.com/apppasswords
- Necesitas tener 2FA activado (si no lo tienes, actívalo primero)

**2. Genera contraseña de aplicación:**
- Selecciona: **Mail** y tu **tipo de dispositivo** (Windows, Linux, etc.)
- Google generará una contraseña de **16 caracteres** con espacios
- Copia la contraseña completa

**3. Actualiza `appsettings.json`:**
```json
"Smtp": {
  "Servidor": "smtp.gmail.com",
  "Puerto": 587,
  "EmailOrigen": "app.movil.pedidos6to@gmail.com",
  "Usuario": "app.movil.pedidos6to@gmail.com",
  "Contrasena": "xxxx xxxx xxxx xxxx",  // ← Tu contraseña de 16 caracteres aquí
  "NombreOrigen": "Frito Lay - Sistema de Pedidos",
  "UsarSSL": true
}
```

**4. Reinicia el backend** → Email funcionará ✅

---

## 🎯 Descripción

El sistema implementa un servicio de email para enviar:
- **Confirmación de registro:** Bienvenida a nuevos usuarios
- **Recuperación de contraseña:** Envío de código de 6 dígitos

## 🔧 Configuración SMTP

### Opción 1: Gmail (Recomendado para desarrollo)

1. **Habilitar "Contraseñas de aplicación":**
   - Ir a https://myaccount.google.com/apppasswords
   - Contraseñas de aplicaciones
   - Seleccionar "Mail" y "Windows" (u otro dispositivo)
   - Copiar la contraseña generada

2. **Configurar en `appsettings.json`:**
   ```json
   "Smtp": {
     "Servidor": "smtp.gmail.com",
     "Puerto": 587,
     "EmailOrigen": "tu_email@gmail.com",
     "Usuario": "tu_email@gmail.com",
     "Contrasena": "tu_contraseña_app_aqui",
     "NombreOrigen": "Frito Lay - Sistema de Pedidos",
     "UsarSSL": true
   }
   ```

### Opción 2: Microsoft 365 / Outlook

```json
"Smtp": {
  "Servidor": "smtp.office365.com",
  "Puerto": 587,
  "EmailOrigen": "tu_email@empresa.com",
  "Usuario": "tu_email@empresa.com",
  "Contrasena": "tu_contraseña",
  "NombreOrigen": "Frito Lay - Sistema de Pedidos",
  "UsarSSL": true
}
```

### Opción 3: SendGrid

```json
"Smtp": {
  "Servidor": "smtp.sendgrid.net",
  "Puerto": 587,
  "EmailOrigen": "noreply@fritolayapp.com",
  "Usuario": "apikey",
  "Contrasena": "tu_sendgrid_api_key",
  "NombreOrigen": "Frito Lay - Sistema de Pedidos",
  "UsarSSL": true
}
```

## 📝 Variables de Configuración

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| **Servidor** | Host SMTP | smtp.gmail.com |
| **Puerto** | Puerto SMTP | 587 (TLS) o 465 (SSL) |
| **EmailOrigen** | Email que envía | noreply@app.com |
| **Usuario** | Usuario SMTP | tu_email@gmail.com |
| **Contrasena** | Contraseña o App Password | *** |
| **NombreOrigen** | Nombre visible en email | "Frito Lay" |
| **UsarSSL** | Usar encriptación SSL/TLS | true |

## 🔐 Seguridad

### ⚠️ IMPORTANTE:
- **NUNCA** hardcodear contraseñas en el código
- Usar `appsettings.Development.json` (no versionado)
- En producción, usar **variables de environment** o **Azure Key Vault**

### Variables de Environment en Production:

```bash
export SMTP_SERVIDOR=smtp.gmail.com
export SMTP_PUERTO=587
export SMTP_EMAIL_ORIGEN=noreply@app.com
export SMTP_USUARIO=tu_email@gmail.com
export SMTP_CONTRASENA=tu_contraseña_app
export SMTP_NOMBRE_ORIGEN="Frito Lay"
export SMTP_USAR_SSL=true
```

Actualizar `Program.cs`:
```csharp
builder.Configuration.AddEnvironmentVariables("SMTP_");
```

## 📧 Métodos del Servicio

### EnviarCodigoRecuperacionAsync
```csharp
var resultado = await _servicioEmail.EnviarCodigoRecuperacionAsync(
    "usuario@example.com",
    "Juan Pérez",
    "123456"
);
```

### EnviarConfirmacionRegistroAsync
```csharp
var resultado = await _servicioEmail.EnviarConfirmacionRegistroAsync(
    "usuario@example.com",
    "Juan Pérez"
);
```

## 📧 Plantillas de Email

### Recuperación de Contraseña
- Título: "🔐 Recuperación de Contraseña"
- Muestra código de 6 dígitos
- Color: Amarillo Frito Lay (#FDB913)
- Aviso de expiración: 5 minutos

### Confirmación de Registro
- Título: "✅ ¡Bienvenido a Frito Lay!"
- Lista de beneficios de la app
- Botón para iniciar sesión
- Color: Verde (#28a745)

## 🧪 Pruebas

### Prueba local en Postman/Bruno:

```http
POST http://localhost:5000/api/usuario/recuperar
Content-Type: application/json

{
  "correoElectronico": "usuario@example.com"
}
```

### Verificar en logs:
```csharp
// Los logs mostrarán:
// [Information] Email enviado exitosamente a usuario@example.com
// [Warning] Email de confirmación no pudo ser enviado a usuario@example.com
```

## ⚠️ Problemas Comunes

### "Authentication failed"
- ✓ Verificar usuario y contraseña
- ✓ Para Gmail, usar App Password
- ✓ Verificar que 2FA está habilitado en Gmail

### "Connection timeout"
- ✓ Verificar servidor SMTP (ej: smtp.gmail.com)
- ✓ Verificar puerto (587 para TLS, 465 para SSL)
- ✓ Revisar firewall/proxy

### "Invalid email address"
- ✓ Verificar formato de correo destino
- ✓ Validar que no sea null o vacío

### Email no llega a bandeja de entrada
- ✓ Revisar carpeta de spam
- ✓ Verificar dominio SPF/DKIM configurado
- ✓ Para producción, usar SendGrid o similar

## 📚 Referencias

- [Sistema de Recuperación](../SRS/SRS_Backend_Pedidos.md)
- [Archivos de Configuración](./example.appsettings.json)
- [Controlador de Cuenta](../Controllers/Usuario/ControladorCuenta.cs)

## 🚀 Próximos Pasos

- [ ] Implementar reintentos con exponential backoff
- [ ] Agregar auditoría de emails enviados
- [ ] Implementar plantillas dinámicas
- [ ] Soporte para adjuntos
- [ ] Análisis de entregas con SendGrid/Mailgun

---

*Versión: 1.1.0 - 22/02/2026*
