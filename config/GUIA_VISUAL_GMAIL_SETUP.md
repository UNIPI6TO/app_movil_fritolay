# 📕 Guía Visual: Generar Contraseña de Aplicación en Gmail

## Requisito Previo
Debes tener **autenticación de 2 factores (2FA)** activada en tu cuenta Google.

### Activar 2FA (si aún no está activado)
1. Ve a: https://myaccount.google.com/security
2. Busca "Verificación en dos pasos" en la izquierda
3. Sigue los pasos (puedes usar tu teléfono)

---

## Paso a Paso: Generar App Password

### 1️⃣ Ve a myaccount.google.com

Abre en tu navegador:
```
https://myaccount.google.com/apppasswords
```

**Nota:** Si no ves esta opción, significa que 2FA no está activado.

### 2️⃣ Selecciona tu Aplicación

En los dropdowns, elige:

**Dropdown 1 (Aplicación):**
```
▼ Selecciona aquí
  - Gmail ✓ [SELECCIONA ESTO]
  - Calendar
  - Chrome
  - etc.
```

**Dropdown 2 (Dispositivo):**
```
▼ Selecciona aquí
  - Windows ✓ [O tu sistema operativo]
  - Mac
  - iPhone
  - Linux
  - etc.
```

### 3️⃣ Genera la Contraseña

- Haz clic en el botón **"Generar"**
- Google mostrará una contraseña de **16 caracteres**
- Ejemplo visual:
```
┌─────────────────────────┐
│ abcd efgh ijkl mnop     │
└─────────────────────────┘
    ↑ Con espacios
```

### 4️⃣ Copia la Contraseña

- Selecciona **toda** la contraseña (con espacios)
- Presiona **Ctrl+C** para copiar
- La contraseña se borrará después que cierres

---

## Actualizar Configuración

**Archivo a editar:**
```
src/backend/appsettings.json
```

**Busca esta sección:**
```json
"Smtp": {
  "Servidor": "smtp.gmail.com",
  "Puerto": 587,
  "EmailOrigen": "app.movil.pedidos6to@gmail.com",
  "Usuario": "app.movil.pedidos6to@gmail.com",
  "Contrasena": "PedidosApp",              ← CAMBIA ESTO
  "NombreOrigen": "Frito Lay - Sistema de Pedidos",
  "UsarSSL": true
}
```

**Actualiza a:**
```json
"Smtp": {
  "Servidor": "smtp.gmail.com",
  "Puerto": 587,
  "EmailOrigen": "app.movil.pedidos6to@gmail.com",
  "Usuario": "app.movil.pedidos6to@gmail.com",
  "Contrasena": "abcd efgh ijkl mnop",      ← TU NUEVA CONTRASEÑA
  "NombreOrigen": "Frito Lay - Sistema de Pedidos",
  "UsarSSL": true
}
```

---

## Verificación

✅ Guardaste el archivo
✅ Reiniciaste el backend (`dotnet run`)
✅ Sin errores en la consola

**Ahora prueba el email:**

```
POST http://localhost:5000/api/prueba-email/enviar-prueba/tuemail@gmail.com
```

Deberías recibir un email en unos segundos ✅

---

## ⚠️ Notas Importantes

| Pregunta | Respuesta |
|----------|-----------|
| ¿Con espacios? | **Sí**, los espacios forman parte de la contraseña |
| ¿Mayúsculas/minúsculas? | **Tal cual** como aparece en Google |
| ¿Se borra después? | **Sí**, cópiala inmediatamente |
| ¿Puedo recuperarla? | **Vuelve a generar** una nueva en apppasswords |
| ¿Funciona con contraseña normal? | **NO**, must be App Password |

---

## Solución de Problemas

### "No veo la opción de App Passwords"
→ **Activa 2FA primero:** https://myaccount.google.com/security

### "Aún recibo error 5.7.0"
1. Copia NUEVAMENTE la contraseña desde Gmail
2. Verifica que NO haya espacios al inicio/final
3. Reinicia el backend

### "El email no llega"
- Revisa SPAM/Correo No Deseado
- Espera 30 segundos (SMTP tarda)
- Mira los logs del backend (busca "✅" o "❌")
