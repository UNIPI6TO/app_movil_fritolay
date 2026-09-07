# Plan de Pruebas y Casos de Uso (QA)

**Proyecto:** Backend de Gestión de Pedidos Móviles  
**Tecnología:** C# ASP.NET Core API  
**Fecha:** 2026-05-11  
**Versión:** 2.0  
**Autor:** Equipo QA  
**Revisión:** Mejorada con cobertura extendida

---

## 1. Introducción
El objetivo de este documento es definir los escenarios de prueba para validar la funcionalidad, seguridad y lógica de negocio del backend. Se cubrirán los módulos de Autenticación (JWT), Catálogo (Imágenes e Impuestos), Pedidos (Cálculos) y Seguridad.

**Niveles de Prioridad:**
* 🔴 **Alta:** Bloqueante. Si falla, no se puede salir a producción.
* 🟡 **Media:** Funcionalidad importante con errores menores o flujos alternativos.
* 🟢 **Baja:** Estética o casos muy poco probables.

**Tipos de Prueba:**
* **Funcionales:** Validación de requisitos funcionales
* **De Seguridad:** Validación de vulnerabilidades y accesos
* **De Rendimiento:** Validación de tiempos de respuesta
* **De Integración:** Validación entre módulos

---

## 2. Módulo de Autenticación y Cuenta

| ID Caso | Título | Pre-condiciones | Pasos de Prueba (Input) | Resultado Esperado | Prioridad |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CP-001** | Registro de Usuario Exitoso | BD Limpia | Enviar POST a `/api/cuenta/registrar` con JSON válido (nombre, correo nuevo, pass). | HTTP 200 OK. El usuario se crea en la tabla `Clientes`. La contraseña en BD no es legible (Hash). | 🔴 |
| **CP-002** | Validación de Correo Duplicado | Usuario "A" ya existe | Enviar POST a `/api/cuenta/registrar` con el mismo correo del Usuario "A". | HTTP 400 Bad Request. Mensaje: "El correo ya está registrado". | 🟡 |
| **CP-003** | Inicio de Sesión Correcto (Login) | Usuario registrado | Enviar POST a `/api/cuenta/login` con credenciales correctas. | HTTP 200 OK. Respuesta incluye `tokenAcceso` (JWT) válido y datos del usuario. | 🔴 |
| **CP-004** | Inicio de Sesión Incorrecto | N/A | Enviar POST a `/api/cuenta/login` con contraseña errónea. | HTTP 401 Unauthorized. No se devuelve ningún token. | 🔴 |
| **CP-005** | Solicitar Recuperación de Clave | Usuario existe | Enviar POST a `/api/cuenta/recuperar` con el correo del usuario. | HTTP 200 OK. Se genera un código en la columna `CodigoRecuperacion` en la BD. | 🟡 |
| **CP-006** | Restablecer Clave con Código | Código generado | Enviar POST a `/api/cuenta/restablecer` con correo, código correcto y nueva pass. | HTTP 200 OK. La contraseña en BD se actualiza (nuevo Hash). El código se borra/invalida. | 🔴 |

---

## 3. Módulo de Catálogo de Productos

| ID Caso | Título | Pre-condiciones | Pasos de Prueba (Input) | Resultado Esperado | Prioridad |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CP-007** | Listar Productos (Público) | Existen productos en BD | Enviar GET a `/api/productos` sin Header de Autorización. | HTTP 200 OK. Devuelve JSON array con productos. | 🔴 |
| **CP-008** | Visualización de Imágenes | Producto tiene imágenes | Verificar nodo `listaUrlImagenes` en el JSON de respuesta. | El array debe contener exactamente 3 strings (URLs) validas. | 🟡 |
| **CP-009** | Validación de Datos Numéricos | Producto configurado | Verificar `precioBase`, `porcentajeDescuento` y `porcentajeImpuesto`. | Los valores deben ser decimales (ej: 12.00) y no strings. | 🟡 |

---

## 4. Módulo de Pedidos (Lógica Crítica)

Este es el módulo más importante. Se debe validar que el backend **no confíe** en los cálculos del frontend, sino que los recalcule.

| ID Caso | Título | Pre-condiciones | Pasos de Prueba (Input) | Resultado Esperado | Prioridad |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CP-010** | Crear Pedido Sin Token | N/A | Enviar POST a `/api/pedidos/crear` sin Header `Authorization`. | HTTP 401 Unauthorized. | 🔴 |
| **CP-011** | Crear Pedido Exitoso | Token válido (Bearer) | Enviar POST `/api/pedidos/crear` con lista de productos `[{id:1, cantidad:2}]`. | HTTP 200/201. Retorna `idPedido`. Se crea registro en tabla `Pedidos` y `Detalles`. | 🔴 |
| **CP-012** | **Cálculo de Impuestos (Matemática)** | Prod A: $100, Desc: 10%, Imp: 15% | Crear pedido con 1 unidad del Prod A. | **Validación Backend:** <br>Base: 100 <br>Desc: -10 <br>Subtotal: 90 <br>Impuesto: +13.50 (90 * 0.15) <br>**Total Pagar: 103.50** | 🔴 |
| **CP-013** | Cálculo con Múltiples Productos | Prod A (IVA 12%), Prod B (IVA 0%) | Crear pedido con ambos productos. | El sistema suma correctamente las líneas con impuesto y las líneas sin impuesto por separado. | 🔴 |
| **CP-014** | Asignación de Cliente | Usuario ID 5 logueado | Crear pedido. Verificar en BD la columna `IdCliente`. | El `IdCliente` en la tabla `Pedidos` debe ser 5. (No se debe enviar el ID en el JSON, se extrae del Token). | 🔴 |
| **CP-015** | Historial de Pedidos | Usuario tiene pedidos | Enviar GET a `/api/pedidos/mis-pedidos`. | HTTP 200 OK. Devuelve solo los pedidos pertenecientes al ID del usuario del token. | 🟡 |

---

## 5. Módulo de Pagos y Estados

| ID Caso | Título | Pre-condiciones | Pasos de Prueba (Input) | Resultado Esperado | Prioridad |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CP-016** | Método de Pago Válido | N/A | Crear pedido con `metodoPago: "EfectivoContraEntrega"`. | Pedido creado con estado inicial correcto (ej: "Pendiente"). | 🟡 |
| **CP-017** | Validación Enum Pago | N/A | Crear pedido con `metodoPago: "MonedasDeChocolate"`. | HTTP 400 Bad Request. Error de validación de modelo. | 🟢 |
| **CP-021** | Validación de Stock | Producto sin stock | Intentar crear pedido con producto agotado. | HTTP 400 Bad Request. Mensaje: "Producto sin stock disponible". | 🟡 |
| **CP-022** | Límite de Carrito | Más de 50 ítems | Intentar crear pedido con más de 50 productos. | HTTP 400 Bad Request. Mensaje: "Límite de productos excedido". | 🟢 |

---

## 6. Pruebas de Seguridad (RNF)

| ID Caso | Título | Descripción | Resultado Esperado | Prioridad |
| :--- | :--- | :--- | :--- | :--- |
| **CP-018** | Expiración del Token | Usar un token generado hace más de 7 días (o tiempo configurado). | HTTP 401 Unauthorized. El sistema obliga a hacer login de nuevo. | 🟡 |
| **CP-019** | Inyección SQL en Login | Enviar en usuario: `' OR 1=1 --`. | El sistema no debe permitir el acceso. Debe retornar 401 o 400. (Entity Framework protege esto por defecto). | 🔴 |
| **CP-020** | Acceso Cruzado (IDOR) | Usuario A intenta ver el pedido del Usuario B (`/api/pedidos/105` donde 105 es de B). | HTTP 403 Forbidden o 404 Not Found. El usuario solo puede ver sus propios recursos. | 🔴 |
| **CP-023** | Rate Limiting | Múltiples requests rápidos | Enviar 100 requests en 1 minuto al endpoint de login. | HTTP 429 Too Many Requests después del límite configurado. | 🟡 |
| **CP-024** | Validación de Input | XSS attempt | Enviar `<script>alert('xss')</script>` en campo nombre. | HTTP 400 Bad Request. Input sanitizado o rechazado. | 🔴 |
| **CP-025** | CORS Headers | Request desde origen no autorizado | Enviar request con Origin diferente. | Headers CORS correctos o rechazo según configuración. | 🟡 |

---

## 7. Scripts de Prueba Sugeridos (JSON Examples)

Para ejecutar **CP-012 (Cálculo Matemático)**, usar este JSON en Postman/Insomnia:

**Request (POST /api/pedidos/crear):**
```json
{
  "metodoPago": "TransferenciaBancaria",
  "direccionEntrega": "Av. Amazonas y Naciones Unidas",
  "productos": [
    {
      "idProducto": 1,
      "cantidad": 2
    },
    {
      "idProducto": 5,
      "cantidad": 1
    }
  ]
}
```

**Request (POST /api/cuenta/registrar):**
```json
{
  "nombre": "Juan Pérez",
  "correo": "juan.perez@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!"
}
```

**Request (POST /api/cuenta/login):**
```json
{
  "correo": "juan.perez@example.com",
  "password": "Password123!"
}
```

---

## 8. Scripts de Prueba Automatizados

### 8.1. Script PowerShell para Pruebas Básicas
```powershell
# test-api.ps1
$baseUrl = "http://localhost:5000/api"

# Test 1: Registro de usuario
Write-Host "Test CP-001: Registro de Usuario" -ForegroundColor Green
$response = Invoke-RestMethod -Uri "$baseUrl/cuenta/registrar" -Method POST -ContentType "application/json" -Body '{
  "nombre": "Test User",
  "correo": "test@example.com",
  "password": "TestPass123!",
  "confirmPassword": "TestPass123!"
}'
Write-Host "Response: $response"

# Test 2: Login
Write-Host "Test CP-003: Login" -ForegroundColor Green
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/cuenta/login" -Method POST -ContentType "application/json" -Body '{
  "correo": "test@example.com",
  "password": "TestPass123!"
}'
$token = $loginResponse.tokenAcceso
Write-Host "Token obtenido correctamente"

# Test 3: Listar productos
Write-Host "Test CP-007: Listar Productos" -ForegroundColor Green
$productos = Invoke-RestMethod -Uri "$baseUrl/productos" -Method GET
Write-Host "Productos encontrados: $($productos.Count)"
```

### 8.2. Script Postman Collection (JSON)
```json
{
  "info": {
    "name": "API Pedidos Test Suite",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\"nombre\":\"Test User\",\"correo\":\"test@example.com\",\"password\":\"TestPass123!\",\"confirmPassword\":\"TestPass123!\"}"
            },
            "url": {"raw": "{{baseUrl}}/api/cuenta/registrar", "host": ["{{baseUrl}}"], "path": ["api", "cuenta", "registrar"]}
          }
        }
      ]
    }
  ]
}
```

---

## 9. Métricas y KPIs de Prueba

**Métricas a Monitorear:**
- **Coverage:** Porcentaje de código cubierto por pruebas (objetivo: >80%)
- **Pass Rate:** Porcentaje de pruebas que pasan (objetivo: >95%)
- **Execution Time:** Tiempo promedio de ejecución del suite de pruebas
- **Defect Density:** Número de defectos encontrados por línea de código

**Criterios de Aceptación:**
- Todos los casos 🔴 deben pasar 100%
- Mínimo 90% de casos 🟡 deben pasar
- No vulnerabilidades críticas de seguridad
- Tiempos de respuesta < 2 segundos para endpoints principales

---

## 10. Checklist Pre-Producción

- [ ] Todos los casos de prueba 🔴 ejecutados exitosamente
- [ ] Pruebas de seguridad completadas sin vulnerabilidades críticas
- [ ] Pruebas de carga con 100 usuarios concurrentes
- [ ] Validación de backup y recuperación de datos
- [ ] Documentación de API actualizada (Swagger/OpenAPI)
- [ ] Logs y monitoreo configurados
- [ ] Environment variables validadas
- [ ] Certificados SSL configurados
- [ ] Base de datos optimizada (índices, consultas)
- [ ] Deploy automatizado probado en staging