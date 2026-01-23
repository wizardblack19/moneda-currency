# Moneda Currency - Documentación

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0.0-green.svg)](https://flask.palletsprojects.com)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-brightgreen.svg)](https://vuejs.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](../LICENSE)

## Descripción General

**Moneda Currency** es un conversor de divisas en tiempo real desarrollado para EFPEM - USAC. La aplicación permite convertir entre 36 monedas internacionales utilizando tasas de cambio actualizadas.

## Índice de Documentación

| Documento | Descripción |
|-----------|-------------|
| [README.md](README.md) | Este archivo - Índice principal |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Arquitectura del sistema y diagramas |
| [API.md](API.md) | Documentación de endpoints REST |
| [INSTALLATION.md](INSTALLATION.md) | Guía de instalación y configuración |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Guía para contribuidores |
| [CHANGELOG.md](CHANGELOG.md) | Historial de cambios |

## Stack Tecnológico

### Backend
- **Python 3.8+** - Lenguaje de programación
- **Flask 3.0.0** - Framework web
- **Flask-CORS 4.0.0** - Gestión de CORS
- **Requests 2.31.0** - Cliente HTTP

### Frontend
- **Vue.js 3** - Framework JavaScript reactivo
- **TailwindCSS** - Framework CSS utility-first
- **Font Awesome 6.4** - Iconografía

### API Externa
- **ExchangeRate-API** - Proveedor de tasas de cambio

## Características Principales

- Conversión entre 36 monedas internacionales
- Interfaz responsive y moderna
- Búsqueda filtrable de monedas
- Intercambio rápido de monedas (swap)
- Auto-reconversión al cambiar selección
- Sistema de caché (5 minutos)
- Validación en cliente y servidor
- Indicadores de estado del servidor

## Monedas Soportadas

### América
`USD` `CAD` `MXN` `GTQ` `BRL` `ARS` `COP` `CLP` `PEN`

### Europa
`EUR` `GBP` `CHF` `SEK` `NOK` `DKK` `PLN`

### Asia-Pacífico
`JPY` `AUD` `CNY` `INR` `KRW` `SGD` `HKD` `NZD` `THB` `MYR` `PHP` `IDR` `TWD`

### Medio Oriente/África
`RUB` `ZAR` `AED` `SAR` `TRY` `ILS` `EGP`

## Inicio Rápido

```bash
# Clonar repositorio
git clone <repository-url>
cd moneda-currency

# Crear entorno virtual
python -m venv venv

# Activar entorno (Windows)
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar
python app.py
```

Acceder a: `http://localhost:5000`

## Estructura del Proyecto

```
moneda-currency/
├── docs/                   # Documentación
│   ├── README.md          # Este archivo
│   ├── ARCHITECTURE.md    # Arquitectura
│   ├── API.md             # Documentación API
│   ├── INSTALLATION.md    # Instalación
│   ├── CONTRIBUTING.md    # Contribución
│   └── CHANGELOG.md       # Cambios
├── app.py                 # Backend Flask
├── index.html             # Frontend HTML
├── script.js              # Lógica Vue.js
├── requirements.txt       # Dependencias Python
├── .gitignore            # Exclusiones Git
└── README.md             # README principal
```

## Autor

**Marvin Lopez** - 201115879
EFPEM - Universidad de San Carlos de Guatemala (USAC)

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](../LICENSE) para más detalles.
