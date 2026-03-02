# Guía de Contribución

## Flujo de ramas (Git Flow)

Este repositorio aplica un flujo de ramas estricto. Los PRs que no respeten las reglas son **cerrados automáticamente** por el workflow `validate-flow`.

### Estructura de ramas

```
feature/* ──┐
fix/*    ──►  develop ──► release ──► main
hotfix/* ──┘
```

| Rama origen | Rama destino permitida |
|---|---|
| `feature/*`, `fix/*`, `hotfix/*` | `develop` |
| `develop` | `release` |
| `release` | `main` |

> ⚠️ Cualquier otro flujo es rechazado automáticamente.

---

## Workflow: `validate-flow` (`branchesProtection.yml`)

### ¿Qué hace?

Se ejecuta en cada Pull Request (apertura, sincronización o reapertura) y valida que la rama origen sea la correcta para la rama destino. Si el flujo es inválido:

1. Publica un **comentario explicativo** en el PR indicando el motivo del rechazo.
2. **Cierra el PR automáticamente**.
3. Marca el check como fallido (`core.setFailed`).

### Reglas validadas

| Destino (`base`) | Origen permitido (`head`) | Si se viola |
|---|---|---|
| `main` | Solo `release` | PR cerrado con comentario |
| `release` | Solo `develop` | PR cerrado con comentario |
| `develop` | Cualquiera | ✅ Sin restricción |

### Permisos requeridos

| Permiso | Motivo |
|---|---|
| `pull-requests: write` | Publicar comentario y cerrar el PR |
| `contents: read` | Leer el contexto del repositorio |

---

## Cómo contribuir correctamente

### 1. Nueva funcionalidad
```bash
git checkout develop
git checkout -b feature/nombre-funcionalidad
# ... desarrollar ...
git push origin feature/nombre-funcionalidad
# Crear PR: feature/nombre-funcionalidad → develop
```

### 2. Corrección de bug
```bash
git checkout develop
git checkout -b fix/descripcion-bug
# ... corregir ...
git push origin fix/descripcion-bug
# Crear PR: fix/descripcion-bug → develop
```

### 3. Preparar release
```bash
# Crear PR: develop → release
# Solo responsables del proyecto
```

### 4. Publicar a producción
```bash
# Crear PR: release → main
# Solo responsables del proyecto
```

---

## Workflows de CI disponibles

| Workflow | Archivo | Trigger | Descripción |
|---|---|---|---|
| Validación de flujo | `branchesProtection.yml` | Todo PR | Verifica que el flujo de ramas sea correcto |
| Tests Backend | `backend-tests.yml` | PR a `develop` con cambios en `src/backend/**` | Ejecuta tests unitarios .NET y reporta cobertura |
| Tests Frontend | `frontend-tests.yml` | PR a `develop` con cambios en `src/fritolay-app/**` | Ejecuta tests Karma/Angular y reporta cobertura |
| Escaneo de seguridad | `codeql-scan.yml` | PR a `develop`, `main`, `feature/*`, `fix/*` | Análisis CodeQL de C# y TypeScript |
