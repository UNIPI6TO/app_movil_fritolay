# Plan de Gestión de Cambios (Change Management Plan)

**Proyecto:** Aplicación de Pedidos Móviles Frito Lay  
**Versión del Documento:** 1.1  
**Fecha de Última Actualización:** 22 de febrero de 2026  
**Responsable:** Equipo de Desarrollo

---

## 📋 Tabla de Contenidos

1. [Propósito](#propósito)
2. [Alcance](#alcance)
3. [Control de Versiones](#control-de-versiones)
4. [Registro de Cambios Recientes](#registro-de-cambios-recientes)
5. [Procesos de Cambio](#procesos-de-cambio)
6. [Clasificación de Cambios](#clasificación-de-cambios)
7. [Evaluación de Impacto](#evaluación-de-impacto)
8. [Aprobaciones](#aprobaciones)

---

## 🎯 Propósito

Este documento define el plan de gestión de cambios para el proyecto de Aplicación de Pedidos Móviles Frito Lay, asegurando que todos los cambios en el sistema sean evaluados, documentados, aprobados e implementados de manera controlada.

---

## 📦 Alcance

Este plan aplica a todos los cambios realizados en:

- **Frontend Móvil:** Aplicación Ionic/Angular
- **Backend API:** Servicios REST en .NET 8
- **Base de Datos:** Esquema SQL Server y migraciones
- **Infraestructura:** Configuraciones de deployment y entornos
- **Documentación:** Cambios en documentación técnica y de usuario

---

## 🔢 Control de Versiones

El proyecto utiliza **Semantic Versioning** (SemVer):

```
MAJOR.MINOR.PATCH[-PRERELEASE]
```

### Convenciones

- **MAJOR (1.x.x):** Cambios incompatibles con versiones anteriores
- **MINOR (x.1.x):** Nuevas funcionalidades compatibles hacia atrás
- **PATCH (x.x.1):** Correcciones de bugs compatibles
- **PRERELEASE (-pre.1):** Versiones en desarrollo/pruebas

### Versión Actual
**v1.1.0-pre.1** (22 de febrero de 2026)

---

## 📝 Registro de Cambios Recientes

### Release v1.1.0-pre.1 (2026-02-22)

#### ✅ Nuevas Funcionalidades

| ID | Componente | Descripción | Prioridad | Estado |
|---|---|---|---|---|
| FEAT-001 | Frontend | Página "Mis Pedidos" | Alta | ✅ Completado |
| FEAT-002 | Frontend | Modal de Detalles de Pedido | Alta | ✅ Completado |
| FEAT-003 | Frontend | Registro automático de pagos con Tarjeta | Alta | ✅ Completado |
| FEAT-004 | Frontend | Captura de GPS en checkout | Media | ✅ Completado |
| FEAT-005 | Frontend | Limpieza automática de carrito post-orden | Alta | ✅ Completado |
| FEAT-006 | Backend | Endpoint GET `/mis-pedidos` | Alta | ✅ Completado |
| FEAT-007 | Backend | Endpoint GET `/pedidos/{id}` | Alta | ✅ Completado |

#### 🔧 Mejoras Técnicas

| ID | Componente | Descripción | Impacto | Estado |
|---|---|---|---|---|
| TECH-001 | Frontend | Método `cleanObject()` en ApiService | Medio | ✅ Completado |
| TECH-002 | Frontend | Método `vaciarCarrito()` en CarritoService | Alto | ✅ Completado |
| TECH-003 | Frontend | Limpieza de preferencias post-checkout | Alto | ✅ Completado |
| TECH-004 | Frontend | Validación de datos GPS (lat/lng) | Bajo | ✅ Completado |

#### 🗑️ Eliminaciones

| ID | Componente | Descripción | Justificación | Estado |
|---|---|---|---|---|
| REM-001 | Frontend | Console.log() de debugging (~20+) | Preparación para producción | ✅ Completado |
| REM-002 | Frontend | Valores undefined en HTTP requests | Prevención de errores de validación | ✅ Completado |

#### 🔒 Seguridad

| ID | Componente | Descripción | Nivel | Estado |
|---|---|---|---|---|
| SEC-001 | Backend | Almacenamiento de coordenadas GPS | Audit Trail | ✅ Completado |
| SEC-002 | Frontend | Validación de referencia bancaria opcional | Medio | ✅ Completado |
| SEC-003 | Frontend | Limpieza segura de Preferences | Alto | ✅ Completado |

---

## 🔄 Procesos de Cambio

### 1. Identificación del Cambio

**Origen de Cambios:**
- Solicitudes de nuevas funcionalidades
- Reportes de bugs
- Mejoras de rendimiento
- Actualizaciones de seguridad
- Refactorización técnica

**Responsable:** Product Owner / Tech Lead

### 2. Evaluación del Cambio

**Criterios de Evaluación:**
- Impacto en funcionalidad existente
- Compatibilidad con versiones anteriores
- Riesgos técnicos y de negocio
- Esfuerzo estimado (Story Points)
- Dependencias con otros componentes

**Responsable:** Equipo Técnico

### 3. Planificación

**Actividades:**
- Diseño técnico detallado
- Estimación de tiempos
- Asignación de recursos
- Definición de criterios de aceptación
- Plan de testing

**Responsable:** Tech Lead / Arquitecto

### 4. Implementación

**Pasos:**
1. Desarrollo en rama feature
2. Code review (peer review)
3. Testing unitario y de integración
4. Actualización de documentación
5. Merge a rama develop

**Responsable:** Desarrolladores

### 5. Verificación

**Actividades:**
- Testing funcional
- Testing de regresión
- Validación de seguridad
- Revisión de documentación

**Responsable:** QA Team

### 6. Aprobación

**Autorización por:**
- Tech Lead (cambios técnicos)
- Product Owner (cambios funcionales)
- Security Officer (cambios de seguridad)

### 7. Deployment

**Ambientes:**
1. **Desarrollo (DEV):** Testing inicial
2. **Staging (STG):** Pre-producción
3. **Producción (PROD):** Release final

**Responsable:** DevOps Team

### 8. Documentación

**Archivos a Actualizar:**
- `CHANGELOG.md` - Registro cronológico
- `CM_PLAN.md` - Este documento
- `README.md` - Documentación de usuario
- Docs técnicos (`/Docs/SDD`, `/Docs/SRS`)

**Responsable:** Tech Lead / Documentador

---

## 📊 Clasificación de Cambios

### Por Urgencia

| Clasificación | Tiempo de Respuesta | Aprobación | Ejemplos |
|---|---|---|---|
| **Crítico** | Inmediato (< 4h) | CTO + Security Officer | Vulnerabilidad de seguridad |
| **Alto** | < 24 horas | Tech Lead + PO | Bug bloqueante en producción |
| **Medio** | < 1 semana | Tech Lead | Nueva funcionalidad planificada |
| **Bajo** | Próximo sprint | Tech Lead | Mejoras de UX/UI |

### Por Tipo

| Tipo | Código | Descripción | Versionado |
|---|---|---|---|
| **Feature** | FEAT | Nueva funcionalidad | MINOR bump |
| **Bug Fix** | BUG | Corrección de errores | PATCH bump |
| **Security** | SEC | Parche de seguridad | PATCH bump (urgente) |
| **Performance** | PERF | Optimización | PATCH/MINOR |
| **Refactor** | REFACT | Mejora de código | PATCH |
| **Breaking Change** | BREAK | Cambio incompatible | MAJOR bump |
| **Documentation** | DOC | Actualización de docs | No afecta versión |

---

## 🎯 Evaluación de Impacto

### Matriz de Impacto

| Componente | v1.1.0-pre.1 | Impacto | Riesgo | Mitigación |
|---|---|---|---|---|
| **Frontend - Checkout** | ✅ Modificado | Alto | Medio | Testing exhaustivo de flujo completo |
| **Frontend - ApiService** | ✅ Modificado | Medio | Bajo | cleanObject() no afecta datos válidos |
| **Frontend - CarritoService** | ✅ Modificado | Alto | Bajo | Método vaciarCarrito() independiente |
| **Backend - ControladorPedidos** | ✅ Extendido | Medio | Bajo | Endpoints nuevos, no modifican existentes |
| **Base de Datos** | ❌ Sin cambios | N/A | N/A | N/A |
| **Autenticación JWT** | ❌ Sin cambios | N/A | N/A | N/A |

### Componentes Afectados - v1.1.0-pre.1

#### Frontend (8 archivos modificados)
```
src/app/pages/checkout/checkout.page.ts
src/app/pages/mis-pedidos/mis-pedidos.page.ts
src/app/components/detalle-pedido-modal/detalle-pedido-modal.component.ts
src/app/components/mapa-entrega/mapa-entrega.component.ts
src/app/services/api.service.ts
src/app/services/pedido.service.ts
src/app/services/carrito.ts
src/app/pages/carrito-modal/carrito-modal.page.ts
```

#### Backend (1 archivo modificado)
```
src/backend/Controllers/Pedido/ControladorPedidos.cs
```

#### Configuración (2 archivos)
```
src/fritolay-app/package.json (versión)
src/backend/backend.csproj (versión)
```

---

## ✅ Aprobaciones

### v1.1.0-pre.1

| Rol | Nombre | Aprobación | Fecha | Observaciones |
|---|---|---|---|---|
| Tech Lead | [Pendiente] | ✅ Aprobado | 2026-02-22 | Testing completo exitoso |
| Product Owner | [Pendiente] | ⏳ Pendiente | - | Revisión de funcionalidades |
| Security Officer | [Pendiente] | ⏳ Pendiente | - | Validación de GPS storage |
| QA Lead | [Pendiente] | ✅ Aprobado | 2026-02-22 | Build exitoso sin errores |

### Criterios de Aprobación Cumplidos

- ✅ Código compila sin errores
- ✅ Tests unitarios pasan (si aplica)
- ✅ No hay regresiones en funcionalidad existente
- ✅ Documentación actualizada
- ✅ Changelog registrado
- ✅ Code review completado
- ⏳ Testing de usuario (UAT) - Pendiente
- ⏳ Performance testing - Pendiente

---

## 📈 Métricas de Cambio

### Release v1.1.0-pre.1

| Métrica | Valor |
|---|---|
| **Archivos Modificados** | 11 |
| **Líneas Agregadas** | ~850 |
| **Líneas Eliminadas** | ~120 |
| **Nuevos Endpoints** | 2 |
| **Bugs Corregidos** | 3 |
| **Tiempo de Desarrollo** | 5 días |
| **Code Review Time** | 2 horas |
| **Testing Time** | 3 horas |

---

## 🔮 Próximos Cambios Planificados

### v1.1.0 (Release Estable)

| ID | Descripción | Prioridad | Sprint Target |
|---|---|---|---|
| FEAT-008 | Testing de usuario (UAT) | Alta | Sprint 6 |
| FEAT-009 | Optimización de carga de pedidos | Media | Sprint 6 |
| DOC-001 | Guía de usuario final | Media | Sprint 6 |

### v1.2.0 (Futuro)

| ID | Descripción | Prioridad | Estado |
|---|---|---|---|
| FEAT-010 | Notificaciones push con Firebase | Alta | Planeado |
| FEAT-011 | Modo offline con sincronización | Alta | Planeado |
| FEAT-012 | Dashboard de métricas para admin | Media | Planeado |
| FEAT-013 | Exportación de reportes PDF | Media | Planeado |

---

## 📚 Referencias

- [CHANGELOG.md](CHANGELOG.md) - Historial completo de cambios
- [README.md](README.md) - Documentación técnica del proyecto
- [Docs/SRS](Docs/SRS/) - Especificaciones de requisitos
- [Docs/SDD](Docs/SDD/) - Documentación de diseño

---

## ✍️ Control de Versiones del Documento

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 1.0 | 2026-01-27 | Equipo Dev | Creación inicial del plan |
| 1.1 | 2026-02-22 | Equipo Dev | Actualización con release v1.1.0-pre.1 |

---

**Última Actualización:** 22 de febrero de 2026  
**Próxima Revisión:** 01 de marzo de 2026
