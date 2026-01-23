# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [Unreleased]

### Por Hacer
- Implementar tests unitarios
- Agregar soporte para criptomonedas
- Historial de conversiones
- Gráficos de tendencias
- Modo offline con PWA
- Autenticación de usuarios

---

## [1.1.0] - 2024-01-15

### Agregado
- Branding para EFPEM - USAC
- Información del autor en footer
- Créditos institucionales

### Modificado
- Título de la aplicación actualizado
- Subtítulo informativo agregado

### Commits
- `66bd79b` - Update project info and branding for EFPEM - USAC

---

## [1.0.0] - 2024-01-15

### Agregado

#### Backend (Flask)
- Servidor Flask con API REST
- Endpoint `/api/convert` para conversión de monedas
- Endpoint `/api/currencies` para listar monedas disponibles
- Endpoint `/api/health` para verificar estado del servidor
- Sistema de caché en memoria (5 minutos)
- Integración con ExchangeRate-API
- Validación de parámetros de entrada
- Soporte CORS para desarrollo
- Manejo de errores con mensajes descriptivos

#### Frontend (Vue.js)
- Interfaz responsive con TailwindCSS
- Aplicación Vue.js 3 con Composition API
- Selectores de moneda con búsqueda filtrable
- Botón de intercambio de monedas (swap)
- Auto-reconversión al cambiar selección
- Indicador de carga durante conversión
- Mensajes de error amigables
- Indicador de estado del servidor
- Formato de números localizado (es-ES)
- Animaciones y transiciones suaves

#### Monedas Soportadas (36)
- **América:** USD, CAD, MXN, GTQ, BRL, ARS, COP, CLP, PEN
- **Europa:** EUR, GBP, CHF, SEK, NOK, DKK, PLN
- **Asia-Pacífico:** JPY, AUD, CNY, INR, KRW, SGD, HKD, NZD, THB, MYR, PHP, IDR, TWD
- **Medio Oriente/África:** RUB, ZAR, AED, SAR, TRY, ILS, EGP

#### Documentación
- README.md con instrucciones básicas
- Archivo .gitignore configurado
- requirements.txt con dependencias

### Seguridad
- Validación en cliente y servidor
- Sanitización de códigos de moneda
- Timeout en llamadas a API externa
- Manejo seguro de errores sin exposición de datos

### Commits
- `ea2ed17` - Initial commit: currency converter app (Flask + Vue.js)

---

## Tipos de Cambios

- **Agregado** - para nuevas funcionalidades
- **Modificado** - para cambios en funcionalidades existentes
- **Obsoleto** - para funcionalidades que serán eliminadas
- **Eliminado** - para funcionalidades eliminadas
- **Corregido** - para corrección de bugs
- **Seguridad** - para vulnerabilidades

---

## Enlaces

- [Repositorio](https://github.com/usuario/moneda-currency)
- [Comparar versiones](https://github.com/usuario/moneda-currency/compare)

[Unreleased]: https://github.com/usuario/moneda-currency/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/usuario/moneda-currency/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/usuario/moneda-currency/releases/tag/v1.0.0
