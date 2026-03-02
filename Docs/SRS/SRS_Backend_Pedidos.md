# Especificación de Requisitos de Software (SRS) - Backend

**Proyecto:** Backend API REST - Gestión de Pedidos Móviles Frito Lay  
**Tecnología:** C# ASP.NET Core 8.0 Web API (Patrón MVC)  
**Seguridad:** JWT (JSON Web Token) Bearer  
**Versión del Documento:** 1.1.0-pre.1  
**Fecha:** 22 de febrero de 2026  
**Idioma del Código:** Español (Clases, Métodos, Variables)

---

## 1. Introducción
### 1.1 Propósito
Este documento define los requisitos para el backend de una aplicación de pedidos. Gestionará el ciclo de vida completo del usuario (registro, login, recuperación de clave), catálogo multimedia, lógica de impuestos dinámicos y procesamiento de pedidos seguros mediante JWT.

### 1.2 Alcance
El backend en **C# (MVC)** expondrá una API REST.
* **Público:** Registro, Login, Recuperación de Contraseña, Catálogo.
* **Privado (JWT):** Cambiar Contraseña, Crear Pedidos, Ver Historial.

---

## 2. Arquitectura y Seguridad
* **Autenticación:** Cabecera HTTP `Authorization: Bearer <token_jwt>`.
* **Nomenclatura C#:** Español (Ej: `ControladorCuenta`, `RestablecerClave`).
* **Base de Datos:** Relacional (SQL Server / MySQL).

---

## 3. Requisitos Funcionales (RF)

### 3.1 Módulo de Gestión de Cuentas y Seguridad

**RF-001: Crear Cuenta de Cliente (Registro)**
* **Controlador:** `ControladorCuenta`
* **Método:** `RegistrarCliente(ModeloRegistro registro)`
* **Validación:** Verificar que el `correoElectronico` no exista previamente en la base de datos.
* **Seguridad:** La contraseña se debe encriptar (Hash) antes de guardar.

**RF-002: Inicio de Sesión (Login)**
* **Controlador:** `ControladorCuenta`
* **Método:** `IniciarSesion(ModeloLogin login)`
* **Proceso:** Verifica credenciales (correo y hash de contraseña). Si es correcto, genera y retorna el Token JWT.

**RF-010: Cambiar Contraseña (Usuario Logueado)**
* **Acceso:** Privado (Requiere Token JWT activo).
* **Controlador:** `ControladorCuenta`
* **Método:** `CambiarContrasena(ModeloCambioContrasena datos)`
* **Entradas:** `contrasenaActual`, `nuevaContrasena`.
* **Lógica:**
    1.  Validar que `contrasenaActual` coincida con la almacenada.
    2.  Hashear la `nuevaContrasena`.
    3.  Actualizar en BD.

**RF-011: Solicitar Recuperación de Contraseña (Olvido)**
* **Acceso:** Público.
* **Controlador:** `ControladorCuenta`
* **Método:** `SolicitarRecuperacion(string correoElectronico)`
* **Lógica:**
    1.  Buscar si el correo existe.
    2.  Generar un **Código de Verificación** numérico (ej: 6 dígitos) o alfanumérico temporal.
    3.  Guardar el código en BD con una expiración (ej: 15 minutos).
    4.  Enviar el código por correo electrónico (Simulado o SMTP real).

**RF-012: Restablecer Contraseña (Confirmación)**
* **Acceso:** Público.
* **Controlador:** `ControladorCuenta`
* **Método:** `RestablecerContrasena(ModeloRestablecer datos)`
* **Entradas:** `correoElectronico`, `codigoVerificacion`, `nuevaContrasena`.
* **Lógica:**
    1.  Validar que el código coincida y no haya expirado.
    2.  Actualizar la contraseña con el nuevo hash.
    3.  Invalidar el código usado.

### 3.2 Módulo de Catálogo (Público)

**RF-003: Listado Multimedia de Productos**
* **Modelo (`ModeloProducto`):**
    * `idProducto`, `nombreProducto`, `descripcion`
    * `precioBase`, `porcentajeDescuento`, `porcentajeImpuesto` (Dinámico).
    * `listaUrlImagenes` (List<string>): Lista obligatoria de 3 URLs para carrusel.

### 3.3 Módulo de Pedidos (Privado - Requiere JWT)

**RF-005: Creación de Pedido Seguro**
* **Seguridad:** Obtener `idCliente` desde los "Claims" del Token JWT.
* **Controlador:** `ControladorPedidos`
* **Método:** `CrearPedido(ModeloPedidoSolicitud solicitud)`
* **Validación:** Recalcular totales (Descuento + Impuesto Variable) en el servidor.
* **Entrada:** 
    * `direccionEntrega` (string, requerido)
    * `latitudEntrega` (decimal, opcional) - **NUEVO v1.1.0**
    * `longitudEntrega` (decimal, opcional) - **NUEVO v1.1.0**
    * `metodoPago` (string, requerido)
    * `referenciaTransferencia` (string, opcional)
    * `productos` (lista de { idProducto, cantidad })
* **Lógica:**
    1. Validar autenticación JWT y extraer `idCliente`
    2. Validar existencia de productos en BD
    3. Recalcular precios e impuestos desde BD (Zero Trust)
    4. Crear registro de Pedido con coordenadas GPS si están disponibles
    5. Crear registros de DetallePedido con snapshot de precios
    6. Retornar `idPedido` y `total` calculado

**RF-013: Consultar Historial de Pedidos del Usuario** *(NUEVO v1.1.0)*
* **Acceso:** Privado (Requiere Token JWT activo).
* **Controlador:** `ControladorPedidos`
* **Método:** `ObtenerMisPedidos()`
* **Lógica:**
    1. Extraer `idCliente` desde el claim del JWT
    2. Consultar todos los pedidos del cliente ordenados por fecha descendente
    3. Retornar lista con: id, fechaPedido, direccionEntrega, metodoPago, estado, subtotal, impuesto, total, pagoRegistrado
* **Respuesta:** Array de objetos Pedido (sin detalles de productos)

**RF-014: Consultar Detalle Completo de Pedido** *(NUEVO v1.1.0)*
* **Acceso:** Privado (Requiere Token JWT activo).
* **Controlador:** `ControladorPedidos`
* **Método:** `ObtenerPedidoPorId(int id)`
* **Lógica:**
    1. Extraer `idCliente` desde el claim del JWT
    2. Validar que el pedido pertenezca al cliente autenticado (seguridad)
    3. Incluir lista completa de productos con detalles:
        * idProducto, nombre, cantidad, precioUnitario, subtotal, impuesto, total
    4. Incluir coordenadas GPS si están disponibles
* **Respuesta:** Objeto Pedido completo con array de productos
* **Validación:** Si el pedido no pertenece al usuario, retornar 403 Forbidden

### 3.4 Módulo de Pagos

**RF-007: Métodos de Pago**
* Soporte: `EfectivoContraEntrega`, `TransferenciaBancaria`, `DepositoBancario`, `TarjetaCreditoDebito`.

---

## 4. Requisitos No Funcionales (RNF)

**RNF-001: Seguridad en Credenciales**
* Las contraseñas nunca viajan en texto plano en la respuesta.
* Se debe implementar limitación de intentos (Rate Limiting) en el Login para evitar fuerza bruta.

**RNF-002: Gestión de Sesión**
* El Token JWT debe expirar en un tiempo razonable.
* Para "Cambiar Contraseña", el sistema debe invalidar sesiones previas si fuera posible (Blacklist de tokens opcional).

**RNF-003: Disponibilidad de Imágenes**
* Las 3 imágenes del producto deben estar alojadas en un servidor de contenido estático (CDN) para carga rápida en móviles.

**RNF-004: Seguridad de Datos GPS** *(NUEVO v1.1.0)*
* Las coordenadas de GPS deben almacenarse con precisión decimal(10,7) para audit trail.
* El almacenamiento de coordenadas es opcional pero recomendado para validación de entregas.
* No se deben exponer coordenadas GPS en logs o respuestas públicas.

**RNF-005: Performance en Consultas de Pedidos** *(NUEVO v1.1.0)*
* La consulta de historial de pedidos debe responder en menos de 500ms para listas de hasta 100 pedidos.
* Se debe implementar paginación si el usuario tiene más de 50 pedidos.
* Las consultas deben incluir índices en las columnas `IdCliente` y `FechaPedido`.

**RNF-006: Integridad de Precios (Zero Trust)** *(NUEVO v1.1.0)*
* El backend NUNCA debe confiar en precios enviados por el cliente.
* Todos los cálculos de subtotal, impuesto y total deben realizarse en el servidor usando precios de BD.
* Se debe guardar un snapshot histórico de precios en DetallePedido para prevenir cambios retroactivos.

---

## 5. Definición de Estructuras de Datos (C#)

### 5.1 Clases de Cuenta y Seguridad

```csharp
public class ModeloRegistro
{
    public string nombreCompleto { get; set; }
    public string correoElectronico { get; set; }
    public string contrasena { get; set; }
    public string telefono { get; set; }
    public string direccionPredeterminada { get; set; }
}

public class ModeloLogin
{
    public string correoElectronico { get; set; }
    public string contrasena { get; set; }
}

public class ModeloCambioContrasena
{
    public string contrasenaActual { get; set; }
    public string nuevaContrasena { get; set; }
}

public class ModeloRestablecer
{
    public string correoElectronico { get; set; }
    public string codigoVerificacion { get; set; } // El código recibido por email
    public string nuevaContrasena { get; set; }
}
```

### 5.2 Clases de Pedidos (Actualizado v1.1.0)

```csharp
// DTO para crear pedido (Request)
public class DtoCrearPedido
{
    [Required]
    public string DireccionEntrega { get; set; }
    
    // NUEVO v1.1.0: Coordenadas GPS opcionales
    public decimal? LatitudEntrega { get; set; }
    public decimal? LongitudEntrega { get; set; }
    
    [Required]
    public string MetodoPago { get; set; }  // Tarjeta, Efectivo, Transferencia
    
    public string? ReferenciaTransferencia { get; set; }
    
    [Required]
    public List<DtoProductoPedido> Productos { get; set; }
}

public class DtoProductoPedido
{
    [Required]
    public int IdProducto { get; set; }
    
    [Required]
    [Range(1, int.MaxValue)]
    public int Cantidad { get; set; }
}

// DTO de respuesta para historial (NUEVO v1.1.0)
public class DtoPedidoResumen
{
    public int Id { get; set; }
    public DateTime FechaPedido { get; set; }
    public string DireccionEntrega { get; set; }
    public string MetodoPago { get; set; }
    public string Estado { get; set; }
    public decimal Subtotal { get; set; }
    public decimal Impuesto { get; set; }
    public decimal Total { get; set; }
    public bool PagoRegistrado { get; set; }
}

// DTO de respuesta para detalle completo (NUEVO v1.1.0)
public class DtoPedidoDetalle
{
    public int Id { get; set; }
    public DateTime FechaPedido { get; set; }
    public string DireccionEntrega { get; set; }
    
    // Coordenadas GPS (pueden ser null)
    public decimal? LatitudEntrega { get; set; }
    public decimal? LongitudEntrega { get; set; }
    
    public string MetodoPago { get; set; }
    public string? ReferenciaTransferencia { get; set; }
    public string Estado { get; set; }
    public decimal Subtotal { get; set; }
    public decimal Impuesto { get; set; }
    public decimal Total { get; set; }
    public bool PagoRegistrado { get; set; }
    
    // Lista de productos con detalles
    public List<DtoDetallePedido> Productos { get; set; }
}

public class DtoDetallePedido
{
    public int IdProducto { get; set; }
    public string Nombre { get; set; }
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }  // Snapshot histórico
    public decimal Subtotal { get; set; }
    public decimal Impuesto { get; set; }
    public decimal Total { get; set; }
}
```

### 5.3 Entidad de Base de Datos - Pedido (Actualizado v1.1.0)

```csharp
public class Pedido
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int IdCliente { get; set; }
    
    [ForeignKey("IdCliente")]
    public Cliente Cliente { get; set; }
    
    public DateTime FechaPedido { get; set; } = DateTime.UtcNow;
    
    [Required]
    [StringLength(500)]
    public string DireccionEntrega { get; set; }
    
    // NUEVO v1.1.0: Coordenadas GPS para audit trail
    [Column(TypeName = "decimal(10,7)")]
    public decimal? LatitudEntrega { get; set; }
    
    [Column(TypeName = "decimal(10,7)")]
    public decimal? LongitudEntrega { get; set; }
    
    [Required]
    [StringLength(50)]
    public string MetodoPago { get; set; }
    
    [StringLength(100)]
    public string? ReferenciaTransferencia { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Estado { get; set; } = "Pendiente";
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Subtotal { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Impuesto { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Total { get; set; }
    
    public bool PagoRegistrado { get; set; } = false;
    
    // Relaciones
    public ICollection<DetallePedido> Detalles { get; set; } = new List<DetallePedido>();
}
```

---

## 6. Reglas de Negocio

### 6.1 Cálculo de Impuestos
* Cada producto tiene su propio `PorcentajeImpuesto` (puede ser 0%, 12%, 15%)
* El impuesto se calcula por producto: `subtotalProducto * (porcentajeImpuesto / 100)`
* El impuesto total del pedido es la suma de impuestos de todos los productos

### 6.2 Estados de Pedidos
| Estado | Descripción | Siguiente Estado |
|--------|-------------|------------------|
| Pendiente | Creado, esperando pago | En Proceso / Cancelado |
| En Proceso | Pago confirmado | Enviado |
| Enviado | En ruta de entrega | Completado |
| Completado | Entregado exitosamente | (Final) |
| Cancelado | Pedido cancelado | (Final) |

### 6.3 Registro Automático de Pagos (v1.1.0)
* Si `metodoPago == "Tarjeta"`, el frontend debe llamar automáticamente al endpoint `/registrar-pago` post-creación
* Si `metodoPago == "Efectivo"` o `"Transferencia"`, el `pagoRegistrado` permanece en `false` hasta confirmación manual

---

## 7. Endpoints API REST

### 7.1 Tabla de Endpoints

| Método | Endpoint | Descripción | Auth | Versión |
|--------|----------|-------------|------|---------|
| POST | `/api/cuenta/registrar` | Registro de usuario | No | 1.0.0 |
| POST | `/api/cuenta/login` | Autenticación | No | 1.0.0 |
| POST | `/api/cuenta/recuperar-password` | Solicitar código OTP | No | 1.0.0 |
| POST | `/api/cuenta/restablecer-password` | Actualizar contraseña | No | 1.0.0 |
| GET | `/api/productos` | Listar productos | Opcional | 1.0.0 |
| POST | `/api/ControladorPedidos/crear` | Crear pedido | JWT | 1.0.0 |
| POST | `/api/ControladorPedidos/registrar-pago` | Registrar pago | JWT | 1.0.0 |
| **GET** | **/api/ControladorPedidos/mis-pedidos** | **Historial de pedidos** | **JWT** | **1.1.0** |
| **GET** | **/api/ControladorPedidos/{id}** | **Detalle de pedido** | **JWT** | **1.1.0** |

---

## 8. Criterios de Aceptación

### 8.1 Para RF-013 (Historial de Pedidos)
- ✅ El endpoint debe retornar solo pedidos del usuario autenticado
- ✅ Los pedidos deben estar ordenados por fecha descendente (más reciente primero)
- ✅ La respuesta no debe incluir detalles de productos (solo resumen)
- ✅ Debe funcionar correctamente con 0 pedidos (retornar array vacío)

### 8.2 Para RF-014 (Detalle de Pedido)
- ✅ El endpoint debe validar que el pedido pertenezca al usuario autenticado
- ✅ Debe retornar 404 si el pedido no existe
- ✅ Debe retornar 403 si el pedido existe pero no pertenece al usuario
- ✅ La lista de productos debe incluir todos los detalles guardados (snapshot)
- ✅ Las coordenadas GPS deben incluirse si están disponibles

### 8.3 Para Seguridad de Precios (Zero Trust)
- ✅ El backend debe ignorar cualquier precio enviado por el cliente
- ✅ Todos los cálculos deben basarse en precios de BD
- ✅ Los detalles de pedido deben guardar snapshot de precios para histórico

---

## 9. Trazabilidad de Cambios

| Versión | Fecha | Cambios Principales |
|---------|-------|---------------------|
| 1.0.0 | 2026-01-27 | Versión inicial con autenticación, catálogo y creación de pedidos |
| 1.1.0-pre.1 | 2026-02-22 | ✅ Agregados RF-013 y RF-014 para consulta de pedidos<br>✅ Agregados campos GPS (latitud, longitud) en Pedido<br>✅ Nuevos DTOs de respuesta (DtoPedidoResumen, DtoPedidoDetalle)<br>✅ Requisitos no funcionales para GPS y performance |

---

**Última Actualización:** 22 de febrero de 2026  
**Versión del Documento:** 1.1.0-pre.1  
**Aprobado por:** Product Owner + Tech Lead