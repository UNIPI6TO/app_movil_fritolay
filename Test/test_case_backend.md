# Plan de Pruebas y Casos de Uso - Backend API (QA)
**Proyecto:** Backend de Gestión de Pedidos Móviles  
**Tecnología:** C# ASP.NET Core 8.0 Web API  
**Framework de Pruebas:** xUnit + Moq + FluentAssertions  
**Base de Datos:** SQL Server + Entity Framework Core  
**Fecha:** 22 de febrero de 2026  
**Versión:** 1.1.0-pre.1

---

## 📋 Tabla de Contenidos

1. [Introducción](#1-introducción)
2. [Módulo de Autenticación](#2-módulo-de-autenticación-y-cuenta)
3. [Módulo de Productos](#3-módulo-de-catálogo-de-productos)
4. [Módulo de Pedidos](#4-módulo-de-pedidos-lógica-crítica)
5. [Módulo de Pagos](#5-módulo-de-pagos-y-estados)
6. [GPS y Geolocalización](#6-gps-y-geolocalización-v110)
7. [Seguridad](#7-pruebas-de-seguridad-rnf)
8. [Performance](#8-pruebas-de-performance)
9. [Matriz de Cobertura](#9-matriz-de-cobertura)

---

## 1. Introducción

El objetivo de este documento es definir los escenarios de prueba para validar la funcionalidad, seguridad y lógica de negocio del backend API. Se cubrirán:
- **Autenticación JWT** con cédula
- **Catálogo de Productos** con imágenes e impuestos
- **Gestión de Pedidos** con GPS (v1.1.0)
- **Cálculos Zero Trust** (backend no confía en frontend)
- **Seguridad** (IDOR, SQL Injection, Token expiration)

**Niveles de Prioridad:**
* 🔴 **Alta:** Bloqueante. Si falla, no se puede salir a producción.
* 🟡 **Media:** Funcionalidad importante con errores menores o flujos alternativos.
* 🟢 **Baja:** Estética o casos muy poco probables.

**Tipos de Prueba:**
* **Unit:** Pruebas unitarias de servicios y lógica de negocio aislada
* **Integration:** Pruebas de controladores con base de datos en memoria
* **E2E:** Pruebas end-to-end con TestServer completo
* **Security:** Pruebas de seguridad y vulnerabilidades


---

## 2. Módulo de Autenticación y Cuenta

| ID Caso | Título | Pre-condiciones | Pasos de Prueba (Input) | Resultado Esperado | Tipo | Prioridad |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-BE-001** | Registro de Usuario Exitoso | BD con tabla Clientes | POST `/api/ControladorCuenta/registrar` con JSON válido:<br>`{ Cedula: "1234567890", NombreCompleto: "Juan Pérez", CorreoElectronico: "juan@test.com", Contrasena: "Pass123!" }` | ✅ HTTP 200 OK<br>✅ Usuario creado en BD<br>✅ Contraseña hasheada con BCrypt<br>✅ Cédula única | Integration | 🔴 |
| **TC-BE-002** | Validación de Cédula Duplicada | Usuario con cédula "1234567890" existe | POST `/api/ControladorCuenta/registrar` con misma cédula | ✅ HTTP 400 Bad Request<br>✅ Mensaje: "La cédula ya está registrada" | Integration | 🔴 |
| **TC-BE-003** | Validación de Correo Duplicado | Usuario con correo "test@test.com" existe | POST `/api/ControladorCuenta/registrar` con mismo correo | ✅ HTTP 400 Bad Request<br>✅ Mensaje: "El correo ya está registrado" | Integration | 🟡 |
| **TC-BE-004** | Login Exitoso con Cédula | Usuario registrado | POST `/api/ControladorCuenta/login` con:<br>`{ CorreoElectronico: "juan@test.com", Contrasena: "Pass123!" }` | ✅ HTTP 200 OK<br>✅ Incluye `tokenAcceso` (JWT válido)<br>✅ Token contiene claim "cedula"<br>✅ Token expira en 7 días | Integration | 🔴 |
| **TC-BE-005** | Login con Contraseña Incorrecta | Usuario existe | POST login con contraseña errónea | ✅ HTTP 401 Unauthorized<br>✅ No devuelve token<br>✅ Mensaje: "Credenciales inválidas" | Integration | 🔴 |
| **TC-BE-006** | Login con Usuario Inexistente | Usuario no existe | POST login con correo no registrado | ✅ HTTP 401 Unauthorized<br>✅ No expone si usuario existe (seguridad) | Integration | 🔴 |
| **TC-BE-007** | Recuperar Contraseña | Usuario existe | POST `/api/ControladorCuenta/recuperar` con:<br>`{ CorreoElectronico: "juan@test.com" }` | ✅ HTTP 200 OK<br>✅ Genera código de 6 dígitos<br>✅ Guarda en columna `CodigoRecuperacion`<br>✅ Retorna `codigoDebug` (solo dev) | Integration | 🟡 |
| **TC-BE-008** | Restablecer Contraseña con Código Válido | Código generado existe | POST `/api/ControladorCuenta/restablecer` con código correcto | ✅ HTTP 200 OK<br>✅ Contraseña actualizada (nuevo hash)<br>✅ Código invalidado en BD | Integration | 🔴 |
| **TC-BE-009** | Restablecer con Código Inválido | N/A | POST restablecer con código incorrecto | ✅ HTTP 400 Bad Request<br>✅ Mensaje: "Código inválido" | Integration | 🟡 |
| **TC-BE-010** | Validación de Token JWT | Token válido | Incluir header: `Authorization: Bearer {token}` | ✅ Middleware valida token<br>✅ Extrae cédula del claim<br>✅ Permite acceso al endpoint | Unit | 🔴 |
| **TC-BE-011** | Token Expirado | Token generado hace 8 días | Usar token expirado en request | ✅ HTTP 401 Unauthorized<br>✅ Mensaje: "Token expirado" | Integration | 🟡 |
| **TC-BE-012** | Token con Firma Inválida | Token manipulado | Modificar payload del token | ✅ HTTP 401 Unauthorized<br>✅ Rechaza token | Security | 🔴 |

---

## 3. Módulo de Catálogo de Productos

| ID Caso | Título | Pre-condiciones | Pasos de Prueba (Input) | Resultado Esperado | Tipo | Prioridad |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-BE-013** | Listar Productos (Endpoint Público) | Productos en BD | GET `/api/productos` (sin token) | ✅ HTTP 200 OK<br>✅ Array de productos<br>✅ Cada producto tiene: id, nombre, precioBase, precioFinal, ivaPercent, descuentoPercent | Integration | 🔴 |
| **TC-BE-014** | Producto con Imágenes | Producto tiene 3 imágenes | GET `/api/productos` | ✅ Campo `listaUrlImagenes` es array de 3 strings<br>✅ URLs válidas | Integration | 🟡 |
| **TC-BE-015** | Cálculo de Precio Final | Producto: Base $100, Desc 10%, IVA 15% | GET producto por ID | ✅ `precioFinal` = 103.50<br>✅ Fórmula: (100 - 10) * 1.15 = 103.50 | Unit | 🔴 |
| **TC-BE-016** | Producto sin Descuento | Producto: Base $50, Desc 0%, IVA 12% | GET producto | ✅ `precioFinal` = 56.00<br>✅ Fórmula: 50 * 1.12 = 56.00 | Unit | 🟡 |
| **TC-BE-017** | Producto sin IVA | Producto: Base $80, Desc 0%, IVA 0% | GET producto | ✅ `precioFinal` = 80.00 | Unit | 🟡 |
| **TC-BE-018** | Validación de Tipos Numéricos | Producto en BD | Verificar JSON response | ✅ `precioBase` es number (no string)<br>✅ `ivaPercent` es number<br>✅ Formato decimal con 2 decimales | Integration | 🟢 |
| **TC-BE-019** | Filtrar por Categoría/Línea | Productos con línea "Snacks" | GET `/api/productos?linea=Snacks` | ✅ Solo productos de línea "Snacks" | Integration | 🟢 |
| **TC-BE-020** | Producto con SKU | Producto tiene SKU | GET producto | ✅ Campo `sku` presente<br>✅ Formato válido | Integration | 🟢 |

---

## 4. Módulo de Pedidos (Lógica Crítica - Zero Trust)

Este es el módulo **más importante**. El backend **NUNCA** debe confiar en los cálculos del frontend, sino **recalcular todo**.

| ID Caso | Título | Pre-condiciones | Pasos de Prueba (Input) | Resultado Esperado | Tipo | Prioridad |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-BE-021** | Crear Pedido Sin Token | N/A | POST `/api/ControladorPedidos/crear` sin header Authorization | ✅ HTTP 401 Unauthorized | Integration | 🔴 |
| **TC-BE-022** | Crear Pedido Exitoso *(v1.1.0)* | Token válido, productos existen | POST crear con:<br>`{ metodoPago: "Efectivo", direccionEntrega: "Calle 123", latitudEntrega: -0.1807, longitudEntrega: -78.4678, productos: [{idProducto: 1, cantidad: 2}] }` | ✅ HTTP 201 Created<br>✅ Retorna `idPedido`<br>✅ GPS guardado en BD<br>✅ Cédula extraída del token<br>✅ Estado inicial: "Pendiente" | Integration | 🔴 |
| **TC-BE-023** | **Zero Trust: Backend Calcula Precios** | Producto: $100, Desc 10%, IVA 15% | Crear pedido con 1 unidad (frontend NO envía precios) | ✅ Backend consulta BD para precios<br>✅ Subtotal: $90.00<br>✅ Impuesto: $13.50<br>✅ Total: $103.50<br>✅ Frontend no puede manipular precios | Unit | 🔴 |
| **TC-BE-024** | Cálculo con Múltiples Productos | Prod A ($100, IVA 15%), Prod B ($50, IVA 0%) | Crear pedido con 2 de A y 1 de B | ✅ Total A: 2 × 103.50 = $207.00<br>✅ Total B: 1 × 50.00 = $50.00<br>✅ **Total Pedido: $257.00** | Unit | 🔴 |
| **TC-BE-025** | Validación de Producto Inexistente | N/A | Crear pedido con `idProducto: 99999` | ✅ HTTP 400 Bad Request<br>✅ Mensaje: "Producto no encontrado" | Integration | 🔴 |
| **TC-BE-026** | Validación de Cantidad Negativa | N/A | Crear pedido con `cantidad: -5` | ✅ HTTP 400 Bad Request<br>✅ Validación de modelo | Integration | 🟡 |
| **TC-BE-027** | Validación de Dirección Vacía | N/A | Crear pedido con `direccionEntrega: ""` | ✅ HTTP 400 Bad Request<br>✅ Mensaje: "Dirección requerida" | Integration | 🔴 |
| **TC-BE-028** | Asignación de Cliente desde Token | Usuario cédula "1234567890" logueado | Crear pedido | ✅ `IdCliente` en BD coincide con usuario del token<br>✅ Frontend NO envía IdCliente | Integration | 🔴 |
| **TC-BE-029** | Coordenadas GPS Opcionales *(v1.1.0)* | GPS no disponible | Crear pedido sin `latitudEntrega`, `longitudEntrega` | ✅ Pedido creado correctamente<br>✅ Coordenadas quedan NULL en BD | Integration | 🟡 |
| **TC-BE-030** | Validación de Coordenadas GPS *(v1.1.0)* | GPS inválido | Enviar `latitudEntrega: 999` (fuera de rango) | ✅ HTTP 400 Bad Request<br>✅ Validación: -90 ≤ lat ≤ 90 | Integration | 🟡 |
| **TC-BE-031** | Referencia Transferencia Opcional | Método: "Transferencia" | Crear pedido con/sin `referenciaTransferencia` | ✅ Acepta con referencia<br>✅ Acepta sin referencia (espacios en blanco aceptados) | Integration | 🟡 |
| **TC-BE-032** | Detalles de Pedido en BD | Pedido creado | Verificar tabla `DetallesPedido` | ✅ Cada producto tiene registro<br>✅ Precio capturado es histórico (snapshot)<br>✅ No se afecta si producto cambia precio después | Integration | 🔴 |

---

## 5. Módulo de Pagos y Estados

| ID Caso | Título | Pre-condiciones | Pasos de Prueba | Resultado Esperado | Tipo | Prioridad |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-BE-033** | Registrar Pago Exitoso *(v1.1.0)* | Pedido existe, no tiene pago | POST `/api/ControladorPedidos/registrar-pago` con:<br>`{ idPedido: 42, montoPagado: 103.50, metodoPagoUtilizado: "Tarjeta" }` | ✅ HTTP 200 OK<br>✅ Pago registrado en BD<br>✅ Estado pedido actualizado | Integration | 🔴 |
| **TC-BE-034** | Validar Pago Duplicado | Pedido ya tiene pago | Intentar registrar pago nuevamente | ✅ HTTP 400 Bad Request<br>✅ Mensaje: "El pedido ya tiene pago registrado" | Integration | 🟡 |
| **TC-BE-035** | Registrar Pago con Monto Incorrecto | Pedido total $103.50 | Registrar pago con `montoPagado: 50.00` | ✅ HTTP 400 Bad Request<br>✅ Mensaje: "El monto no coincide con el total" | Integration | 🟡 |
| **TC-BE-036** | Métodos de Pago Válidos | N/A | Crear pedido con: "Efectivo", "Tarjeta", "Transferencia" | ✅ Todos aceptados<br>✅ Guardados correctamente | Integration | 🟡 |
| **TC-BE-037** | Método de Pago Inválido | N/A | Crear pedido con `metodoPago: "Criptomonedas"` | ✅ HTTP 400 Bad Request<br>✅ Validación de enum | Integration | 🟢 |
| **TC-BE-038** | Estados de Pedido | N/A | Verificar estados disponibles | ✅ Pendiente, En Proceso, Enviado, Completado, Cancelado | Unit | 🟡 |

---

## 6. GPS y Geolocalización (v1.1.0 - NUEVO)

| ID Caso | Título | Pre-condiciones | Pasos de Prueba | Resultado Esperado | Tipo | Prioridad |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-BE-039** | Guardar Coordenadas GPS | Token válido | POST crear pedido con GPS válido:<br>`latitudEntrega: -0.1807, longitudEntrega: -78.4678` | ✅ Coordenadas guardadas en BD<br>✅ Tipo decimal(10,7) | Integration | 🔴 |
| **TC-BE-040** | Recuperar Coordenadas en Detalle *(v1.1.0)* | Pedido con GPS | GET `/api/ControladorPedidos/{id}` | ✅ Response incluye `latitudEntrega`, `longitudEntrega`<br>✅ Frontend puede mostrar mapa | Integration | 🔴 |
| **TC-BE-041** | Validación de Latitud | N/A | Enviar `latitudEntrega: 95` | ✅ HTTP 400 Bad Request<br>✅ Validación: -90 ≤ lat ≤ 90 | Integration | 🟡 |
| **TC-BE-042** | Validación de Longitud | N/A | Enviar `longitudEntrega: 200` | ✅ HTTP 400 Bad Request<br>✅ Validación: -180 ≤ lon ≤ 180 | Integration | 🟡 |

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
---

## 7. Historial y Consulta de Pedidos (v1.1.0 - NUEVO)

| ID Caso | T�tulo | Pre-condiciones | Pasos de Prueba | Resultado Esperado | Tipo | Prioridad |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-BE-044** | Listar Mis Pedidos *(v1.1.0)* | Usuario tiene 3 pedidos | GET `/api/ControladorPedidos/mis-pedidos` con token | ? HTTP 200 OK<br>? Array con 3 pedidos<br>? Solo pedidos del usuario del token<br>? Ordenados por fecha DESC | Integration | ?? |
| **TC-BE-045** | Pedidos Vac�os | Usuario nuevo sin pedidos | GET mis-pedidos | ? HTTP 200 OK<br>? Array vac�o `[]` | Integration | ?? |
| **TC-BE-046** | Detalle Completo de Pedido *(v1.1.0)* | Pedido ID 42 existe | GET `/api/ControladorPedidos/42` con token | ? HTTP 200 OK<br>? Incluye: info pedido, productos, GPS, resumen financiero<br>? Productos con snapshot de precios hist�ricos | Integration | ?? |
| **TC-BE-047** | Detalle de Pedido Inexistente | N/A | GET `/api/ControladorPedidos/99999` | ? HTTP 404 Not Found | Integration | ?? |
| **TC-BE-048** | IDOR: Acceso a Pedido de Otro Usuario | Usuario A logueado, Pedido 10 es de Usuario B | GET `/api/ControladorPedidos/10` | ? HTTP 403 Forbidden o 404<br>? No expone datos de otros usuarios | Security | ?? |
| **TC-BE-049** | Detalle Incluye Lista de Productos | Pedido con 3 productos | GET detalle pedido | ? Array `productos` con 3 items<br>? Cada item: nombre, cantidad, precioUnitario, subtotal, impuesto, total | Integration | ?? |
| **TC-BE-050** | Detalle Incluye Coordenadas GPS *(v1.1.0)* | Pedido tiene GPS | GET detalle pedido | ? Campos `latitudEntrega`, `longitudEntrega` presentes<br>? Frontend puede mostrar en mapa | Integration | ?? |
| **TC-BE-051** | Pedidos Sin Token | N/A | GET mis-pedidos sin Authorization header | ? HTTP 401 Unauthorized | Integration | ?? |

---

## 8. Pruebas de Seguridad (RNF)

| ID Caso | T�tulo | Descripci�n | Resultado Esperado | Tipo | Prioridad |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-BE-052** | Expiraci�n del Token JWT | Token generado hace 8 d�as | Usar token expirado en cualquier endpoint protegido | ? HTTP 401 Unauthorized<br>? Mensaje: \"Token expirado\" | Integration | ?? |
| **TC-BE-053** | Token con Firma Manipulada | Token modificado manualmente | Modificar payload y usar token | ? HTTP 401 Unauthorized<br>? Rechaza token inv�lido | Security | ?? |
| **TC-BE-054** | Inyecci�n SQL en Login | N/A | POST login con:<br>`CorreoElectronico: \"' OR 1=1 --\"` | ? HTTP 401 Unauthorized<br>? EF Core protege autom�ticamente<br>? No permite SQL injection | Security | ?? |
| **TC-BE-055** | IDOR: Pedido de Otro Usuario | Usuario A logueado | GET `/api/ControladorPedidos/{idPedidoDeB}` | ? HTTP 403 o 404<br>? Solo puede ver propios pedidos | Security | ?? |
| **TC-BE-056** | XSS en Direcci�n de Entrega | N/A | Crear pedido con:<br>`direccionEntrega: \"<script>alert('xss')</script>\"` | ? Pedido creado<br>? Script no ejecutado (sanitizado)<br>? Guardado como texto plano | Security | ?? |
| **TC-BE-057** | Mass Assignment Attack | N/A | Enviar campos extra en POST:<br>`{ ..., isAdmin: true }` | ? Campos no permitidos ignorados<br>? Solo DTO properties aceptadas | Security | ?? |
| **TC-BE-058** | CORS Configurado Correctamente | Frontend en localhost:4200 | Request desde frontend | ? Headers CORS correctos<br>? Permite origen configurado | Integration | ?? |
| **TC-BE-059** | Rate Limiting (Opcional) | N/A | Hacer 100 requests en 1 segundo | ?? Opcional: HTTP 429 Too Many Requests<br>? Protege contra DDoS | Security | ?? |
| **TC-BE-060** | Passwords Hasheadas en BD | Usuario registrado | Verificar columna `Contrasena` en BD | ? Valor es hash BCrypt<br>? NO es texto plano<br>? Formato: `$$2a$$10$...` | Unit | ?? |

---

## 9. Pruebas de Performance

| ID Caso | T�tulo | Condiciones | Resultado Esperado | Tipo | Prioridad |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-BE-061** | Tiempo de Respuesta - Listar Productos | BD con 100 productos | Response time < 500ms | Performance | ?? |
| **TC-BE-062** | Tiempo de Respuesta - Crear Pedido | Request normal | Response time < 500ms | Performance | ?? |
| **TC-BE-063** | Tiempo de Respuesta - Mis Pedidos | Usuario con 50 pedidos | Response time < 1s | Performance | ?? |
| **TC-BE-064** | Carga Concurrente | 50 usuarios simult�neos | Todos requests exitosos<br>Sin errores 500 | Performance | ?? |

---

## 10. Matriz de Cobertura de Pruebas

### Por M�dulo:

| M�dulo | ID Casos | Unit | Integration | Security | Performance | Total |
|--------|----------|------|-------------|----------|-------------|-------|
| **Autenticaci�n** | TC-BE-001 a 012 | 2 | 9 | 1 | 0 | 12 |
| **Productos** | TC-BE-013 a 020 | 4 | 4 | 0 | 0 | 8 |
| **Pedidos** | TC-BE-021 a 032 | 3 | 9 | 0 | 0 | 12 |
| **Pagos** | TC-BE-033 a 038 | 1 | 5 | 0 | 0 | 6 |
| **GPS** | TC-BE-039 a 043 | 0 | 5 | 0 | 0 | 5 |
| **Historial** | TC-BE-044 a 051 | 0 | 7 | 1 | 0 | 8 |
| **Seguridad** | TC-BE-052 a 060 | 1 | 4 | 4 | 0 | 9 |
| **Performance** | TC-BE-061 a 064 | 0 | 0 | 0 | 4 | 4 |
| **TOTAL** | **64 Casos** | **11** | **43** | **6** | **4** | **64** |

### Por Prioridad:

| Prioridad | Cantidad | Porcentaje |
|-----------|----------|------------|
| ?? Alta | 42 casos | 66% |
| ?? Media | 18 casos | 28% |
| ?? Baja | 4 casos | 6% |

---

## 11. Estrategia de Ejecuci�n

### Fase 1: Pruebas Unitarias (Unit Tests)
- **Framework:** xUnit
- **Mocking:** Moq
- **Assertions:** FluentAssertions
- **Cobertura M�nima:** 80%
- **Ejecutar:** `dotnet test --filter Category=Unit`

### Fase 2: Pruebas de Integraci�n (Integration Tests)
- **Framework:** xUnit + WebApplicationFactory
- **Base de Datos:** In-Memory Database (SQLite)
- **Ejecutar:** `dotnet test --filter Category=Integration`

### Fase 3: Pruebas de Seguridad (Security Tests)
- **Herramientas:** OWASP ZAP, SQL Injection tests
- **Ejecutar:** `dotnet test --filter Category=Security`

### Fase 4: Pruebas de Performance
- **Herramientas:** Apache JMeter, k6, dotnet-counters
- **Ejecutar:** Scripts de carga espec�ficos

---

## 12. Criterios de Salida (Release)

Para liberar v1.1.0-pre.1 a producci�n:

? **Pruebas Alta Prioridad (??):** 100% pasadas (42/42)  
? **Pruebas Media Prioridad (??):** M�nimo 90% pasadas (16/18)  
? **Cobertura de C�digo:** M�nimo 80%  
? **Zero Bugs Cr�ticos:** No bloqueantes pendientes  
? **Pruebas de Seguridad:** TC-BE-054, TC-BE-055, TC-BE-060 validados  
? **Performance:** Todos los endpoints < 500ms (95 percentil)

---

**�ltima Actualizaci�n:** 22 de febrero de 2026  
**Prep arado por:** QA Team + Backend Team  
**Aprobado por:** Tech Lead + Product Owner  
**Status:** ? Listo para implementaci�n
