# Especificación de Requisitos de Software (SRS) - Frontend Móvil

**Proyecto:** Aplicación Móvil de Pedidos Frito Lay  
**Tecnología:** Angular 20 + Ionic 7 + Capacitor 8  
**Plataformas Objetivo:** iOS, Android, Web (PWA)  
**Versión del Documento:** 1.1.0-pre.1  
**Fecha:** 22 de febrero de 2026  
**Estado:** Pre-Release

---

## 📋 Tabla de Contenidos

1. [Introducción](#1-introducción)
2. [Requisitos Funcionales](#2-requisitos-funcionales)
3. [Requisitos No Funcionales](#3-requisitos-no-funcionales)
4. [Casos de Uso](#4-casos-de-uso)
5. [Interfaces de Usuario](#5-interfaces-de-usuario)
6. [Integración con Backend](#6-integración-con-backend)
7. [Almacenamiento Local](#7-almacenamiento-local)
8. [Seguridad](#8-seguridad)
9. [Criterios de Aceptación](#9-criterios-de-aceptación)

---

## 1. Introducción

### 1.1 Propósito

Este documento define los requisitos de software para la aplicación móvil de pedidos Frito Lay, destinada a distribuidores y clientes para realizar pedidos de productos mediante dispositivos móviles iOS y Android.

### 1.2 Alcance

La aplicación móvil incluye:
- **Autenticación de usuarios** con JWT
- **Catálogo de productos** con imágenes y filtros
- **Carrito de compras** con persistencia local
- **Proceso de checkout** con múltiples métodos de pago
- **Captura de GPS** para ubicación de entrega
- **Historial de pedidos** con visualización de detalles
- **Gestión de cuenta** de usuario

### 1.3 Audiencia

- **Desarrolladores:** Implementación técnica
- **QA Team:** Casos de prueba y validación
- **Product Owner:** Alineación con objetivos de negocio
- **Stakeholders:** Entendimiento de funcionalidades

---

## 2. Requisitos Funcionales

### 2.1 Módulo de Autenticación

**RF-MOV-001: Login de Usuario**
- **Descripción:** Permitir al usuario iniciar sesión con cédula y contraseña
- **Entrada:** 
  - Cédula (10 dígitos, numérico, requerido)
  - Contraseña (mínimo 6 caracteres, requerido)
- **Proceso:**
  1. Validar formato de cédula (solo números)
  2. Enviar credenciales al backend vía POST `/api/cuenta/login`
  3. Almacenar JWT en Capacitor Preferences si es exitoso
  4. Redirigir a página principal (Home)
- **Salida:**
  - Mensaje de éxito y navegación a Home
  - Mensaje de error si credenciales inválidas
- **Errores:**
  - "Cédula o contraseña incorrecta"
  - "Error de conexión. Intente nuevamente"

**RF-MOV-002: Registro de Usuario**
- **Descripción:** Permitir registro de nuevos usuarios
- **Entrada:**
  - Nombre completo (requerido)
  - Cédula (10 dígitos, único, requerido)
  - Correo electrónico (formato válido, único, requerido)
  - Teléfono (opcional)
  - Contraseña (mínimo 6 caracteres, requerido)
  - Confirmar contraseña (debe coincidir)
- **Validaciones:**
  - Email debe tener formato válido
  - Cédula debe ser numérica de 10 dígitos
  - Contraseñas deben coincidir
- **Proceso:**
  1. Validar todos los campos en frontend
  2. Enviar POST a `/api/cuenta/registrar`
  3. Mostrar mensaje de éxito
  4. Redirigir a Login

**RF-MOV-003: Logout**
- **Descripción:** Cerrar sesión del usuario
- **Proceso:**
  1. Eliminar JWT de Capacitor Preferences
  2. Limpiar datos de sesión (cédula, tokens)
  3. Redirigir a pantalla de Login
  4. Limpiar carrito de compras (opcional)

**RF-MOV-004: Recuperación de Contraseña**
- **Descripción:** Permitir recuperar contraseña olvidada
- **Flujo:**
  1. Usuario ingresa correo electrónico
  2. Sistema envía código OTP al correo
  3. Usuario ingresa código + nueva contraseña
  4. Sistema valida código y actualiza contraseña

### 2.2 Módulo de Catálogo de Productos

**RF-MOV-005: Listar Productos**
- **Descripción:** Mostrar catálogo completo de productos disponibles
- **Fuente:** GET `/api/productos`
- **Visualización:**
  - Grid de tarjetas de productos
  - Cada tarjeta muestra: imagen, nombre, precio, botón "Agregar"
- **Filtros:**
  - Búsqueda por nombre (tiempo real)
  - Filtro por categoría/línea (si aplica)
- **Datos Mostrados:**
  - Imagen principal del producto
  - Nombre del producto
  - Precio unitario (formateado con 2 decimales)
  - Indicador de impuesto (% IVA)
  - Stock disponible (opcional)

**RF-MOV-006: Ver Detalle de Producto**
- **Descripción:** Mostrar información completa de un producto
- **Visualización:**
  - Carrusel de hasta 3 imágenes
  - Nombre completo
  - Descripción detallada
  - Precio unitario
  - Porcentaje de impuesto
  - SKU (si existe)
  - Línea/categoría
  - Botón "Agregar al Carrito"

**RF-MOV-007: Búsqueda de Productos**
- **Descripción:** Buscar productos por nombre o descripción
- **Características:**
  - Búsqueda en tiempo real (filtrado local)
  - Coincidencia parcial (case-insensitive)
  - Búsqueda en nombre y descripción
  - Limpiar búsqueda con botón X

### 2.3 Módulo de Carrito de Compras

**RF-MOV-008: Agregar Producto al Carrito** *(v1.1.0)*
- **Descripción:** Agregar productos al carrito desde el catálogo
- **Proceso:**
  1. Usuario hace clic en botón "Agregar"
  2. Si producto ya existe: incrementar cantidad en 1
  3. Si producto es nuevo: agregar con cantidad = 1
  4. Actualizar carrito en memoria (BehaviorSubject)
  5. Persistir carrito en Capacitor Preferences
  6. Mostrar toast de confirmación
- **Validación:**
  - No permitir cantidad mayor a stock disponible

**RF-MOV-009: Visualizar Carrito**
- **Descripción:** Ver lista de productos agregados al carrito
- **Visualización:**
  - Lista de productos con:
    - Imagen miniatura
    - Nombre
    - Precio unitario
    - Cantidad (con controles +/-)
    - Subtotal por producto
    - Botón eliminar
  - Resumen financiero:
    - Subtotal general
    - Impuestos (desglosados por producto)
    - Total a pagar
  - Botón "Ir a Checkout"

**RF-MOV-010: Modificar Cantidad en Carrito**
- **Descripción:** Ajustar cantidad de productos
- **Controles:**
  - Botón "+" para incrementar
  - Botón "-" para decrementar
  - Campo numérico editable
- **Validaciones:**
  - Cantidad mínima: 1
  - Al llegar a 0, eliminar producto del carrito
  - No exceder stock disponible

**RF-MOV-011: Eliminar Producto del Carrito**
- **Descripción:** Remover producto completamente
- **Proceso:**
  1. Usuario hace clic en icono de eliminar
  2. Confirmar acción (opcional)
  3. Eliminar producto del array
  4. Actualizar totales
  5. Persistir cambios en Preferences

**RF-MOV-012: Vaciar Carrito** *(v1.1.0)*
- **Descripción:** Limpiar todos los productos del carrito
- **Cuándo se ejecuta:**
  - Después de crear un pedido exitosamente
  - Manualmente por el usuario (opcional)
- **Proceso:**
  1. Limpiar array de productos en memoria
  2. Eliminar clave `carrito_compras` de Preferences
  3. Actualizar observable del carrito

### 2.4 Módulo de Checkout

**RF-MOV-013: Proceso de Checkout** *(v1.1.0)*
- **Descripción:** Finalizar compra y crear pedido
- **Pasos:**
  1. Validar que el carrito no esté vacío
  2. Solicitar datos de entrega:
     - Dirección completa (textarea, requerido)
     - Capturar GPS automáticamente
  3. Seleccionar método de pago:
     - Tarjeta de crédito/débito
     - Efectivo contra entrega
     - Transferencia bancaria
  4. Si "Transferencia": solicitar número de referencia (opcional)
  5. Mostrar resumen del pedido:
     - Lista de productos
     - Subtotal, impuestos, total
  6. Botón "Confirmar Pedido"

**RF-MOV-014: Captura de Ubicación GPS** *(v1.1.0)*
- **Descripción:** Obtener coordenadas de ubicación para entrega
- **Plugin:** Capacitor Geolocation
- **Proceso:**
  1. Solicitar permisos de ubicación al usuario
  2. Obtener coordenadas (latitud, longitud)
  3. Mostrar indicador de GPS capturado
  4. Permitir visualización en mapa (opcional)
- **Manejo de Errores:**
  - Si usuario rechaza permisos: continuar sin GPS (opcional)
  - Si GPS no disponible: mostrar advertencia

**RF-MOV-015: Confirmación de Pedido** *(v1.1.0)*
- **Descripción:** Enviar pedido al backend y procesar respuesta
- **Proceso:**
  1. Construir objeto DtoCrearPedido:
     - direccionEntrega
     - latitudEntrega, longitudEntrega (si disponibles)
     - metodoPago
     - referenciaTransferencia (si aplica, sino enviar ' ')
     - productos: [{ idProducto, cantidad }]
  2. Limpiar valores undefined/null con ApiService.cleanObject()
  3. Enviar POST a `/api/ControladorPedidos/crear`
  4. Si éxito:
     - Si metodoPago == "Tarjeta": registrar pago automáticamente
     - Vaciar carrito completamente
     - Limpiar todas las preferencias de checkout
     - Mostrar mensaje de éxito
     - Navegar a "Mis Pedidos"
  5. Si error:
     - Mostrar mensaje de error amigable
     - Mantener datos del formulario

**RF-MOV-016: Registro Automático de Pago** *(v1.1.0)*
- **Descripción:** Registrar pago automáticamente para método "Tarjeta"
- **Condición:** Solo si `metodoPago === "Tarjeta"`
- **Proceso:**
  1. Obtener idPedido de respuesta de creación
  2. Enviar POST a `/api/ControladorPedidos/registrar-pago`
  3. No bloquear flujo si falla (el pago puede registrarse manualmente después)

**RF-MOV-017: Limpieza Post-Orden** *(v1.1.0)*
- **Descripción:** Limpiar todos los datos temporales después de crear pedido
- **Preferencias a eliminar:**
  - `carrito_compras`
  - `checkout_delivery_data`
  - `checkout_pago_data`
  - `checkout_pedido_data`
  - `checkout_cache`
- **Resultado:** Estado limpio para próximo pedido

### 2.5 Módulo de Historial de Pedidos *(NUEVO v1.1.0)*

**RF-MOV-018: Listar Mis Pedidos** *(v1.1.0)*
- **Descripción:** Mostrar historial de pedidos del usuario autenticado
- **Fuente:** GET `/api/ControladorPedidos/mis-pedidos`
- **Visualización:**
  - Lista ordenada por fecha descendente (más reciente primero)
  - Cada item muestra:
    - ID del pedido (#42)
    - Fecha de creación (formato amigable)
    - Dirección de entrega (resumida)
    - Método de pago con icono
    - Estado con color distintivo
    - Total del pedido
  - Icono de pago registrado (✓) si aplica
  - Al hacer clic: abrir detalle completo
- **Estados Visuales:**
  - Pendiente: amarillo/warning
  - En Proceso: azul/primary
  - Enviado: morado/secondary
  - Completado: verde/success
  - Cancelado: rojo/danger

**RF-MOV-019: Ver Detalle de Pedido** *(v1.1.0)*
- **Descripción:** Mostrar información completa de un pedido específico
- **Fuente:** GET `/api/ControladorPedidos/{id}`
- **Visualización en Modal:**
  - **Información General:**
    - ID del pedido
    - Fecha y hora de creación
    - Estado actual del pedido
    - Método de pago
    - Referencia bancaria (si aplica)
  - **Ubicación:**
    - Dirección completa de entrega
    - Mapa con marcador GPS (si coordenadas disponibles)
  - **Lista de Productos:**
    - Nombre del producto
    - Cantidad
    - Precio unitario
    - Subtotal por producto
    - Impuesto por producto
    - Total por producto
  - **Resumen Financiero:**
    - Subtotal general
    - Impuestos totales
    - Total pagado
  - **Estado de Pago:**
    - Indicador de pago registrado (Sí/No)
  - Botón "Cerrar"

**RF-MOV-020: Actualización de Pedidos**
- **Descripción:** Refrescar lista de pedidos manualmente
- **Implementación:**
  - Pull-to-refresh en lista de pedidos
  - Botón de actualización
  - Recarga automática al entrar a la página

### 2.6 Módulo de Perfil de Usuario

**RF-MOV-021: Ver Perfil**
- **Descripción:** Mostrar información del usuario
- **Datos Mostrados:**
  - Nombre completo
  - Cédula
  - Correo electrónico
  - Teléfono
  - Fecha de registro

**RF-MOV-022: Editar Perfil**
- **Descripción:** Actualizar información personal
- **Campos Editables:**
  - Nombre completo
  - Teléfono
  - Dirección predeterminada
- **Campos No Editables:**
  - Cédula (identificador único)
  - Correo (requiere verificación si se cambia)

---

## 3. Requisitos No Funcionales

### 3.1 Usabilidad

**RNF-MOV-001: Interfaz Intuitiva**
- La navegación debe ser clara con máximo 3 niveles de profundidad
- Botones principales deben ser fácilmente accesibles
- Mensajes de error deben ser descriptivos y en español

**RNF-MOV-002: Feedback Visual**
- Todas las acciones deben tener feedback inmediato:
  - Spinners durante carga
  - Toasts para confirmaciones
  - Alertas para errores críticos

**RNF-MOV-003: Accesibilidad**
- Tamaño de fuente mínimo: 14px
- Contraste de colores según WCAG 2.1 AA
- Etiquetas descriptivas en campos de formulario

### 3.2 Performance

**RNF-MOV-004: Tiempo de Carga**
- La app debe cargar en menos de 3 segundos en conexión 4G
- El catálogo debe renderizar en menos de 1 segundo
- Las imágenes deben usar lazy loading

**RNF-MOV-005: Optimización de Imágenes**
- Imágenes deben estar comprimidas (WebP preferido)
- Tamaño máximo por imagen: 500KB
- Implementar caché de imágenes

**RNF-MOV-006: Responsividad**
- La app debe funcionar en pantallas desde 4" hasta tablets
- Layouts adaptativos según orientación (portrait/landscape)

### 3.3 Seguridad

**RNF-MOV-007: Almacenamiento Seguro**
- JWT debe almacenarse en Capacitor Preferences (cifrado nativo)
- Contraseñas nunca deben guardarse en el dispositivo
- Datos sensibles no deben ir en logs de producción

**RNF-MOV-008: Comunicación Segura**
- Todas las peticiones HTTP deben usar HTTPS
- Validar certificados SSL
- Timeout de peticiones: 30 segundos

**RNF-MOV-009: Sesión Segura**
- Implementar auto-logout después de 30 minutos de inactividad
- Limpiar datos sensibles al cerrar sesión
- Validar token JWT en cada petición crítica

**RNF-MOV-010: Permisos del Dispositivo** *(v1.1.0)*
- Solicitar permiso de ubicación con mensaje claro
- Funcionar sin GPS (ubicación opcional)
- No acceder a otros permisos innecesarios

### 3.4 Confiabilidad

**RNF-MOV-011: Manejo de Errores de Conexión**
- Detectar pérdida de conexión a internet
- Mostrar mensaje amigable: "Sin conexión a internet"
- Permitir reintentos automáticos

**RNF-MOV-012: Persistencia de Datos**
- El carrito debe persistir aunque se cierre la app
- Los datos de checkout deben recuperarse si hay interrupciones
- Limpieza automática de datos temporales post-orden *(v1.1.0)*

**RNF-MOV-013: Validación de Datos**
- Validar todos los formularios antes de enviar al backend
- Sanitizar entradas del usuario
- Eliminar valores undefined/null antes de HTTP requests *(v1.1.0)*

### 3.5 Mantenibilidad

**RNF-MOV-014: Código Limpio**
- No incluir console.log() en producción *(v1.1.0)*
- Usar solo console.error() para errores críticos
- Comentarios en español para lógica compleja

**RNF-MOV-015: Arquitectura Modular**
- Separación clara entre componentes, servicios y modelos
- Servicios reutilizables con responsabilidad única
- DTOs para comunicación con backend

### 3.6 Compatibilidad

**RNF-MOV-016: Plataformas Soportadas**
- iOS 13+
- Android 8.0+ (API 26+)
- Navegadores modernos (Chrome, Safari, Firefox) para PWA

**RNF-MOV-017: Versiones de Tecnología**
- Angular 20.x
- Ionic 7.x
- Capacitor 8.x
- TypeScript 5.x

---

## 4. Casos de Uso

### 4.1 CU-001: Realizar Pedido Completo

**Actor:** Cliente autenticado

**Precondiciones:**
- Usuario ha iniciado sesión
- Existen productos disponibles en catálogo

**Flujo Principal:**
1. Usuario navega al catálogo de productos
2. Usuario busca y selecciona productos
3. Usuario agrega productos al carrito (2+ productos)
4. Usuario ajusta cantidades si es necesario
5. Usuario hace clic en "Ir a Checkout"
6. Sistema captura ubicación GPS automáticamente
7. Usuario ingresa dirección de entrega
8. Usuario selecciona método de pago "Tarjeta"
9. Usuario revisa resumen del pedido
10. Usuario confirma pedido
11. Sistema crea pedido en backend
12. Sistema registra pago automáticamente (método Tarjeta)
13. Sistema limpia carrito y preferencias
14. Sistema muestra confirmación y navega a "Mis Pedidos"
15. Usuario visualiza su pedido en el historial

**Postcondiciones:**
- Pedido creado en base de datos
- Pago registrado (métodoPago == "Tarjeta")
- Carrito vacío
- Preferencias de checkout eliminadas

**Flujos Alternativos:**
- **4a.** Si método de pago es "Efectivo" o "Transferencia":
  - No registrar pago automáticamente
  - Marcar pedido como "Pendiente pago"

### 4.2 CU-002: Consultar Historial de Pedidos *(v1.1.0)*

**Actor:** Cliente autenticado

**Precondiciones:**
- Usuario ha iniciado sesión
- Usuario ha realizado al menos un pedido previamente

**Flujo Principal:**
1. Usuario navega a "Mis Pedidos" desde el menú
2. Sistema carga lista de pedidos del backend
3. Sistema muestra lista ordenada por fecha descendente
4. Usuario visualiza resumen de cada pedido
5. Usuario hace clic en un pedido específico
6. Sistema abre modal con detalles completos:
   - Información del pedido
   - Lista de productos con precios
   - Ubicación GPS en mapa (si disponible)
   - Resumen financiero
7. Usuario revisa la información
8. Usuario cierra el modal

**Postcondiciones:**
- Usuario ha visualizado sus pedidos históricos

**Flujos Alternativos:**
- **2a.** Si no hay pedidos:
  - Mostrar mensaje: "Aún no has realizado pedidos"
  - Mostrar botón "Ir al Catálogo"

### 4.3 CU-003: Manejo de Pérdida de Conexión

**Actor:** Cliente

**Precondiciones:**
- Usuario está usando la app

**Flujo Principal:**
1. Usuario está en proceso de checkout
2. Usuario pierde conexión a internet
3. Usuario intenta crear pedido
4. Sistema detecta falta de conexión
5. Sistema muestra mensaje: "Sin conexión a internet. Verifica tu conexión."
6. Sistema mantiene datos del formulario
7. Usuario recupera conexión
8. Usuario reintenta crear pedido
9. Sistema procesa pedido exitosamente

**Postcondiciones:**
- Datos del usuario no se pierden
- Pedido se crea cuando hay conexión

---

## 5. Interfaces de Usuario

### 5.1 Diseño Visual

**Paleta de Colores:**
- Primario: Azul Frito Lay (#0066CC)
- Secundario: Amarillo (#FFD700)
- Success: Verde (#28A745)
- Warning: Amarillo (#FFC107)
- Danger: Rojo (#DC3545)
- Fondo: Gris claro (#F8F9FA)

**Tipografía:**
- Familia: Roboto, sans-serif
- Títulos: 18-24px, bold
- Subtítulos: 16px, medium
- Cuerpo: 14px, regular
- Caption: 12px, regular

### 5.2 Componentes UI Ionic

**Componentes Principales:**
- `<ion-header>` con toolbar
- `<ion-content>` para páginas
- `<ion-card>` para productos y pedidos
- `<ion-list>` para listas de items
- `<ion-button>` para acciones
- `<ion-input>` para formularios
- `<ion-modal>` para detalles de pedido
- `<ion-toast>` para notificaciones
- `<ion-loading>` para indicadores de carga
- `<ion-searchbar>` para búsqueda

### 5.3 Navegación

**Estructura de Menú:**
```
├── Home (Catálogo)
├── Carrito
├── Mis Pedidos (v1.1.0)
├── Perfil
└── Cerrar Sesión
```

**Tabs (Navegación Inferior):**
- Home (icono: home)
- Carrito (icono: cart, badge con cantidad)
- Pedidos (icono: document-text)
- Perfil (icono: person)

---

## 6. Integración con Backend

### 6.1 Endpoints Consumidos

| Método | Endpoint | Página/Servicio | Descripción |
|--------|----------|-----------------|-------------|
| POST | `/api/cuenta/login` | LoginPage + AuthService | Autenticación |
| POST | `/api/cuenta/registrar` | RegisterPage + AuthService | Registro |
| GET | `/api/productos` | HomePage + ProductoService | Catálogo |
| POST | `/api/ControladorPedidos/crear` | CheckoutPage + PedidoService | Crear pedido |
| POST | `/api/ControladorPedidos/registrar-pago` | CheckoutPage + PedidoService | Registrar pago |
| **GET** | `/api/ControladorPedidos/mis-pedidos` | **MisPedidosPage + PedidoService** | **Historial (v1.1.0)** |
| **GET** | `/api/ControladorPedidos/{id}` | **DetallePedidoModal + PedidoService** | **Detalle (v1.1.0)** |

### 6.2 Manejo de Respuestas

**Códigos HTTP Esperados:**
- `200 OK`: Operación exitosa (GET)
- `201 Created`: Recurso creado (POST)
- `400 Bad Request`: Error de validación
- `401 Unauthorized`: Token inválido o ausente
- `403 Forbidden`: Acceso denegado
- `404 Not Found`: Recurso no encontrado
- `500 Server Error`: Error interno del servidor

**Formato de Error del Backend:**
```json
{
  "mensaje": "Error de validación",
  "errores": [
    "El campo DireccionEntrega es requerido"
  ]
}
```

**Manejo en Frontend:**
- Extraer mensaje con `ApiService.extractErrorMessage()`
- Mostrar en toast o alert según severidad
- Loggear errores críticos con console.error()

### 6.3 Limpieza de Datos (v1.1.0)

**Método cleanObject() en ApiService:**
- Elimina propiedades `undefined` del body
- Elimina propiedades `null` del body
- Recursivo para objetos anidados y arrays
- Previene errores 400 Bad Request del backend

**Ejemplo:**
```typescript
// Antes de cleanObject()
{
  direccionEntrega: "Calle 123",
  latitudEntrega: -0.1807,
  longitudEntrega: undefined,  // ← Problema
  referenciaTransferencia: null // ← Problema
}

// Después de cleanObject()
{
  direccionEntrega: "Calle 123",
  latitudEntrega: -0.1807
}
```

---

## 7. Almacenamiento Local

### 7.1 Capacitor Preferences

**Claves Utilizadas:**

| Clave | Tipo | Contenido | Persistencia |
|-------|------|-----------|--------------|
| `token_jwt` | string | JWT de autenticación | Hasta logout |
| `user_cedula` | string | Cédula del usuario | Hasta logout |
| `carrito_compras` | JSON | Array de productos | Hasta pedido completado |
| `checkout_delivery_data` | JSON | Dirección y GPS | Hasta pedido completado |
| `checkout_pago_data` | JSON | Método de pago seleccionado | Hasta pedido completado |
| `checkout_pedido_data` | JSON | Resumen pre-confirmación | Hasta pedido completado |
| `checkout_cache` | JSON | Datos temporales | Hasta pedido completado |

### 7.2 Estrategia de Limpieza (v1.1.0)

**Cuándo Limpiar:**
- Después de crear pedido exitosamente
- Al cerrar sesión (opcional: mantener carrito)
- Al cambiar de usuario

**Método de Limpieza:**
```typescript
async limpiarTodasLasPreferencias() {
  await Preferences.remove({ key: 'checkout_delivery_data' });
  await Preferences.remove({ key: 'checkout_pago_data' });
  await Preferences.remove({ key: 'checkout_pedido_data' });
  await Preferences.remove({ key: 'checkout_cache' });
  await Preferences.remove({ key: 'carrito_compras' });
}
```

### 7.3 Sincronización de Estado

**Patrón Utilizado:**
- BehaviorSubject en servicios
- Componentes suscritos a observables
- Actualización automática de vistas

**Ejemplo CarritoService:**
```typescript
private carritoSubject = new BehaviorSubject<Producto[]>([]);
public carrito$ = this.carritoSubject.asObservable();

// Al agregar producto
agregarProducto(producto: Producto) {
  const carrito = this.carritoSubject.value;
  carrito.push(producto);
  this.carritoSubject.next(carrito);
  this.guardarStorage();  // Persistir
}
```

---

## 8. Seguridad

### 8.1 Protección de JWT

**Almacenamiento:**
- Usar Capacitor Preferences (cifrado nativo del OS)
- Nunca almacenar en localStorage web
- No exponer token en logs

**Transmisión:**
- Enviar en header: `Authorization: Bearer {token}`
- Incluir en todas las peticiones autenticadas
- Validar expiración antes de enviar

### 8.2 Validación de Datos

**Frontend:**
- Validar formato de cédula (10 dígitos)
- Validar formato de email (regex)
- Validar longitud de contraseña (mínimo 6)
- Sanitizar inputs de formularios

**Envío a Backend:**
- Limpiar valores undefined/null *(v1.1.0)*
- No enviar precios calculados (Zero Trust)
- Solo enviar IDs de productos y cantidades

### 8.3 Permisos GPS (v1.1.0)

**Solicitud de Permisos:**
- Mostrar diálogo nativo del OS
- Explicar por qué se necesita ubicación
- Permitir continuar sin GPS (opcional)

**Uso de Coordenadas:**
- Solo capturar cuando el usuario está en checkout
- No rastrear ubicación en tiempo real
- No compartir ubicación con terceros

---

## 9. Criterios de Aceptación

### 9.1 Para Gestión de Carrito (RF-MOV-008 a RF-MOV-012)

- ✅ Agregar producto incrementa cantidad si ya existe
- ✅ Carrito persiste después de cerrar y abrir la app
- ✅ Totales (subtotal, impuesto, total) se calculan correctamente
- ✅ Eliminar producto actualiza totales inmediatamente
- ✅ Vaciar carrito elimina todos los productos y la preferencia

### 9.2 Para Checkout (RF-MOV-013 a RF-MOV-017) *(v1.1.0)*

- ✅ GPS se captura automáticamente al entrar a checkout
- ✅ Si usuario rechaza GPS, el flujo continúa sin coordenadas
- ✅ Validación impide crear pedido sin dirección de entrega
- ✅ Si método es "Transferencia", campo de referencia se muestra
- ✅ Si método es "Tarjeta", pago se registra automáticamente post-creación
- ✅ Después de crear pedido, carrito queda completamente vacío
- ✅ Todas las preferencias de checkout se eliminan post-orden
- ✅ Usuario es redirigido a "Mis Pedidos" automáticamente

### 9.3 Para Historial de Pedidos (RF-MOV-018 a RF-MOV-020) *(v1.1.0)*

- ✅ Lista de pedidos se ordena por fecha descendente (más reciente primero)
- ✅ Cada pedido muestra color distintivo según estado
- ✅ Al hacer clic en pedido, se abre modal con detalles completos
- ✅ Modal muestra lista de productos con precios históricos
- ✅ Si hay coordenadas GPS, se muestra mapa con marcador
- ✅ Si no hay pedidos, se muestra mensaje amigable
- ✅ Pull-to-refresh actualiza la lista correctamente

### 9.4 Para Seguridad de Datos (v1.1.0)

- ✅ ApiService.cleanObject() elimina valores undefined antes de POST
- ✅ ApiService.cleanObject() elimina valores null antes de POST
- ✅ No hay console.log() en código de producción
- ✅ Solo console.error() para errores críticos
- ✅ JWT se elimina al cerrar sesión

### 9.5 Para UX y Performance

- ✅ Todos los botones muestran loading spinner durante peticiones
- ✅ Mensajes de error son descriptivos en español
- ✅ Toasts de confirmación aparecen para acciones exitosas
- ✅ Imágenes de productos cargan con lazy loading
- ✅ Navegación entre páginas es fluida sin retrasos perceptibles

---

## 10. Trazabilidad de Cambios

| Versión | Fecha | Cambios Principales |
|---------|-------|---------------------|
| 1.0.0 | 2026-01-27 | Versión inicial: Login, Catálogo, Carrito, Checkout básico |
| 1.1.0-pre.1 | 2026-02-22 | ✅ RF-MOV-018: Historial de pedidos<br>✅ RF-MOV-019: Detalle de pedido con productos<br>✅ RF-MOV-014: Captura de GPS en checkout<br>✅ RF-MOV-012: Método vaciarCarrito()<br>✅ RF-MOV-017: Limpieza automática post-orden<br>✅ ApiService.cleanObject() para valores undefined/null<br>✅ Registro automático de pagos con Tarjeta<br>✅ Eliminación de console.log() de debug |

---

## 11. Glosario

| Término | Definición |
|---------|------------|
| **JWT** | JSON Web Token - Token de autenticación cifrado |
| **Capacitor** | Runtime nativo para acceder a APIs del dispositivo |
| **Preferences** | API de Capacitor para almacenamiento clave-valor persistente |
| **Observable** | Objeto RxJS que emite valores en el tiempo |
| **BehaviorSubject** | Tipo de Observable que mantiene un valor actual |
| **DTO** | Data Transfer Object - Objeto para transferir datos entre capas |
| **GPS** | Global Positioning System - Sistema de geolocalización |
| **Toast** | Notificación temporal en pantalla |
| **Modal** | Ventana flotante sobre la vista actual |
| **Zero Trust** | Principio de seguridad: no confiar en datos del cliente |
| **Snapshot** | Copia histórica de datos en un momento específico |

---

**Última Actualización:** 22 de febrero de 2026  
**Versión del Documento:** 1.1.0-pre.1  
**Aprobado por:** Product Owner + Tech Lead + UX Designer
