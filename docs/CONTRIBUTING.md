# Guía de Contribución

Gracias por tu interés en contribuir a Moneda Currency. Esta guía te ayudará a configurar tu entorno de desarrollo y entender el proceso de contribución.

## Código de Conducta

- Sé respetuoso con otros contribuidores
- Acepta críticas constructivas
- Enfócate en lo mejor para la comunidad
- Muestra empatía hacia otros miembros

## Cómo Contribuir

### Reportar Bugs

1. Verifica que el bug no haya sido reportado previamente
2. Abre un nuevo issue con:
   - Título descriptivo
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Capturas de pantalla (si aplica)
   - Información del entorno (OS, Python, navegador)

**Plantilla de Bug Report:**
```markdown
## Descripción
[Descripción clara del bug]

## Pasos para Reproducir
1. Ir a '...'
2. Hacer clic en '...'
3. Ver error

## Comportamiento Esperado
[Qué debería suceder]

## Comportamiento Actual
[Qué sucede realmente]

## Entorno
- OS: [ej. Windows 10]
- Python: [ej. 3.10]
- Navegador: [ej. Chrome 120]
```

### Sugerir Mejoras

1. Verifica que la sugerencia no exista
2. Abre un issue con etiqueta "enhancement"
3. Describe la mejora propuesta
4. Explica el caso de uso

### Contribuir Código

#### 1. Fork del Repositorio

```bash
# Clonar tu fork
git clone https://github.com/TU-USUARIO/moneda-currency.git
cd moneda-currency

# Agregar upstream
git remote add upstream https://github.com/ORIGINAL/moneda-currency.git
```

#### 2. Crear Branch

```bash
# Actualizar master
git checkout master
git pull upstream master

# Crear branch para tu feature
git checkout -b feature/nombre-descriptivo
```

**Convención de nombres de branch:**
- `feature/` - Nueva funcionalidad
- `fix/` - Corrección de bug
- `docs/` - Documentación
- `refactor/` - Refactorización
- `test/` - Tests

#### 3. Desarrollar

```bash
# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Linux/macOS
.\venv\Scripts\activate   # Windows

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor de desarrollo
python app.py
```

#### 4. Commit

**Formato de commit (Conventional Commits):**

```
<tipo>(<alcance>): <descripción>

[cuerpo opcional]

[footer opcional]
```

**Tipos:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Formato (sin cambios de código)
- `refactor`: Refactorización
- `test`: Tests
- `chore`: Tareas de mantenimiento

**Ejemplos:**
```bash
git commit -m "feat(api): agregar endpoint para historial de conversiones"
git commit -m "fix(ui): corregir dropdown que no cierra en móvil"
git commit -m "docs: actualizar guía de instalación"
```

#### 5. Push y Pull Request

```bash
git push origin feature/nombre-descriptivo
```

Crear Pull Request en GitHub con:
- Título descriptivo
- Descripción de cambios
- Screenshots (si hay cambios de UI)
- Referencias a issues relacionados

## Estándares de Código

### Python (Backend)

**Estilo:** PEP 8

```python
# Imports ordenados
import os
from datetime import datetime

from flask import Flask, request, jsonify
from flask_cors import CORS

# Constantes en MAYÚSCULAS
CACHE_DURATION = 300
API_BASE_URL = "https://api.exchangerate-api.com/v4/latest/"

# Funciones con docstrings
def get_exchange_rates(base_currency):
    """
    Obtiene tasas de cambio para una moneda base.

    Args:
        base_currency (str): Código ISO 4217 de la moneda

    Returns:
        dict: Tasas de cambio o None si hay error
    """
    pass

# Nombres descriptivos
def calculate_conversion(amount, rate):
    converted_amount = amount * rate
    return round(converted_amount, 2)
```

**Herramientas recomendadas:**
- `black` - Formateo automático
- `flake8` - Linting
- `isort` - Ordenar imports

### JavaScript (Frontend)

**Estilo:** Airbnb JavaScript Style Guide (adaptado)

```javascript
// Usar const/let, no var
const apiBaseUrl = window.location.origin;
let loading = false;

// Funciones con JSDoc
/**
 * Convierte moneda usando la API
 * @param {number} amount - Cantidad a convertir
 * @param {string} from - Moneda origen
 * @param {string} to - Moneda destino
 * @returns {Promise<Object>} Resultado de conversión
 */
async function convertCurrency(amount, from, to) {
    // ...
}

// Nombres descriptivos
const filteredCurrencies = currencies.filter(c =>
    c.code.includes(searchTerm)
);
```

### HTML/CSS

- HTML5 semántico
- Clases de TailwindCSS
- Accesibilidad (ARIA labels)

```html
<!-- Usar elementos semánticos -->
<header role="banner">
    <h1>Título</h1>
</header>

<main role="main">
    <section aria-label="Formulario de conversión">
        <!-- Formulario -->
    </section>
</main>

<!-- Accesibilidad en inputs -->
<label for="amount">Cantidad</label>
<input
    id="amount"
    type="number"
    aria-describedby="amount-help"
>
<span id="amount-help">Ingrese la cantidad a convertir</span>
```

## Estructura de Archivos

```
moneda-currency/
├── app.py              # Backend - mantener < 300 líneas
├── index.html          # Frontend - estructura y estilos
├── script.js           # Frontend - lógica Vue.js
├── requirements.txt    # Dependencias Python
├── docs/               # Documentación
│   ├── README.md
│   ├── API.md
│   └── ...
└── tests/              # Tests (por implementar)
    ├── test_app.py
    └── test_api.py
```

## Tests

> **Nota:** Los tests están pendientes de implementación.

### Estructura Propuesta

```python
# tests/test_app.py
import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    response = client.get('/api/health')
    assert response.status_code == 200
    assert response.json['status'] == 'healthy'

def test_convert_valid(client):
    response = client.post('/api/convert', json={
        'amount': 100,
        'from_currency': 'USD',
        'to_currency': 'EUR'
    })
    assert response.status_code == 200
    assert response.json['success'] == True

def test_convert_invalid_amount(client):
    response = client.post('/api/convert', json={
        'amount': -100,
        'from_currency': 'USD',
        'to_currency': 'EUR'
    })
    assert response.status_code == 400
```

### Ejecutar Tests

```bash
pip install pytest
pytest tests/ -v
```

## Proceso de Review

1. **Checks automáticos:** CI/CD verifica tests y linting
2. **Review de código:** Al menos 1 aprobación requerida
3. **Merge:** Squash and merge a master

## Versionado

Seguimos [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Cambios incompatibles
- **MINOR** (0.1.0): Nueva funcionalidad compatible
- **PATCH** (0.0.1): Correcciones de bugs

## Contacto

- **Autor:** Marvin Lopez - 201115879
- **Institución:** EFPEM - USAC

## Licencia

Al contribuir, aceptas que tus contribuciones serán licenciadas bajo la misma licencia del proyecto (MIT).
