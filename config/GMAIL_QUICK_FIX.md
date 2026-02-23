# 🚀 QUICK FIX: Gmail SMTP Error 5.7.0

## Error Actual
```
System.Net.Mail.SmtpException: 'The SMTP server requires a secure connection or the client was not authenticated. 
The server response was: 5.7.0 Authentication Required'
```

## Causa
✗ Estás usando la contraseña normal de Gmail
✓ Gmail requiere "Contraseña de Aplicación" especial

---

## ✅ Solución en 3 Minutos

### Paso 1: Generar Contraseña de Aplicación

```
🌐 URL: https://myaccount.google.com/apppasswords
```

**Qué verás:**
- Dropdown 1: Selecciona **"Mail"**
- Dropdown 2: Selecciona tu SO (**Windows**, Linux, Mac, etc.)
- Botón: **Generar**

**Resultado:**
- Google mostrará una contraseña de **16 caracteres con espacios**
- Ejemplo: `abcd efgh ijkl mnop`
- Cópiala completamente

### Paso 2: Actualizar Configuración

**Archivo:** `src/backend/appsettings.json`

```json
{
  "Smtp": {
    "Servidor": "smtp.gmail.com",
    "Puerto": 587,
    "EmailOrigen": "app.movil.pedidos6to@gmail.com",
    "Usuario": "app.movil.pedidos6to@gmail.com",
    "Contrasena": "AQUI_PEGA_LOS_16_CARACTERES",
    "NombreOrigen": "Frito Lay - Sistema de Pedidos",
    "UsarSSL": true
  }
}
```

### Paso 3: Reiniciar Backend

```bash
# Detenr la aplicación actual (Ctrl+C)
# Ejecutar de nuevo:
dotnet run
```

---

## 🧪 Probar que Funciona

**Opción 1: HTTP Client (VS Code)**

```http
POST http://localhost:5000/api/prueba-email/enviar-prueba/tuemail@gmail.com
```

**Opción 2: cURL**

```bash
curl -X POST http://localhost:5000/api/prueba-email/enviar-prueba/tuemail@gmail.com
```

**Resultado Esperado:**
```json
{
  "mensaje": "✅ Email de prueba enviado exitosamente",
  "email": "tuemail@gmail.com",
  "timestamp": "2026-02-22T10:30:45.123Z"
}
```

---

## ❓ Preguntas Frecuentes

### P: ¿Dónde veo la Contraseña de Aplicación?
**R:** https://myaccount.google.com/apppasswords (necesitas tener 2FA activado)

### P: ¿Qué pasa si no puedo ver esa opción?
**R:** Activa autenticación de 2 factores primero:
- https://myaccount.google.com/security
- Busca "Verificación en dos pasos"

### P: ¿La contraseña incluye espacios?
**R:** Sí, los espacios son normales. Cópiala exactamente como aparece.

### P: ¿Puedo usar mi contraseña normal?
**R:** No. Gmail rechaza contraseñas normales por razones de seguridad. Debe ser Contraseña de Aplicación.

### P: ¿Dónde están los logs de error?
**R:** Mira la consola donde ejecutas `dotnet run`. Verás líneas como:
```
❌ Error SMTP: 5.7.0 - ...
   Servidor: smtp.gmail.com:587
   SSL: True
```

---

## ✅ Checklist de Verificación

- [ ] Activé 2FA en mi cuenta Google
- [ ] Generé Contraseña de Aplicación en Gmail
- [ ] Copié la contraseña de 16 caracteres
- [ ] Actualicé `appsettings.json` con la nueva contraseña
- [ ] Reinicié el backend
- [ ] Probé con POST `/api/prueba-email/enviar-prueba/{email}`
- [ ] Recibí el email ✅

---

## 📞 Si aún no funciona

1. **Verifica los logs:** Busca "❌ Error SMTP" en la consola
2. **Revisa appsettings.json:** ¿Los datos coinciden con tu cuenta?
3. **Reinicia el backend:** A veces es necesario restart
4. **Genera nueva contraseña:** En caso de duda, genera una nueva en Gmail
