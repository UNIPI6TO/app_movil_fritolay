# Configuración de Secrets para GitHub Actions

Este archivo documenta los secrets que pueden configurarse en GitHub para mejorar los workflows de CI/CD.

## 🔐 Secrets Opcionales

### Para Codecov (Reportes de Cobertura)

Si deseas usar Codecov para visualizar reportes de cobertura en PRs:

**CODECOV_TOKEN**
- **Descripción:** Token de autenticación de Codecov
- **Cómo obtenerlo:** 
  1. Crear cuenta en https://codecov.io
  2. Conectar el repositorio
  3. Copiar el token del dashboard
- **Dónde configurarlo:** Settings → Secrets and variables → Actions → New repository secret
- **Nombre del secret:** `CODECOV_TOKEN`
- **Uso:** Los workflows ya están configurados para usar este token automáticamente

### Para SonarQube/SonarCloud (Análisis de Código)

**SONAR_TOKEN**
- **Descripción:** Token para análisis de calidad de código
- **Cómo obtenerlo:**
  1. Crear cuenta en https://sonarcloud.io
  2. Importar el repositorio
  3. Generar token en Account → Security
- **Uso:** Requiere agregar workflow adicional (no incluido actualmente)

## ⚙️ Variables de Entorno Públicas

Estas variables pueden configurarse en Settings → Secrets and variables → Actions → Variables:

**NODE_VERSION**
- Valor por defecto: `20.x`
- Descripción: Versión de Node.js a usar en workflows de frontend

**DOTNET_VERSION**
- Valor por defecto: `8.0.x`
- Descripción: Versión de .NET a usar en workflows de backend

## ✅ Secrets Automáticos de GitHub

Los workflows ya usan estos secrets automáticos (no requieren configuración):

**GITHUB_TOKEN**
- Proporcionado automáticamente por GitHub Actions
- Usado para:
  - Comentar resultados de cobertura en PRs
  - Publicar reportes de tests
  - Crear checks en PRs

## 🚀 Configuración Actual

**Estado:** Los workflows funcionan **sin necesidad de secrets adicionales** 🎉

- ✅ Tests de backend ejecutan sin secrets
- ✅ Tests de frontend ejecutan sin secrets
- ✅ Reportes básicos funcionan con GITHUB_TOKEN
- ⚠️ Reportes de cobertura en Codecov requieren `CODECOV_TOKEN` (opcional)

## 📖 Más Información

- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Codecov GitHub Action](https://github.com/codecov/codecov-action)
- [GitHub Token Permissions](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)
