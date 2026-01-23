# Conversor de Moneda - Backend Python + Frontend Vue.js 3

Proyecto universitario de conversor de moneda con arquitectura cliente-servidor. El backend en Python (Flask) consume la API externa de conversión, y el frontend Vue.js 3 consume el servicio backend.

## Arquitectura del Proyecto

```
Frontend (Vue.js 3) → Backend (Python/Flask) → API Externa (ExchangeRate-API)
```

### Flujo de Datos:
1. El usuario ingresa datos en la interfaz Vue.js
2. Vue.js envía petición POST al backend Python usando Fetch API
3. Flask procesa la petición y consulta la API externa
4. Flask retorna el resultado en formato JSON
5. Vue.js renderiza reactivamente el resultado en la interfaz

## Características

- **Backend Python (Flask)**:
  - API REST con endpoints para conversión
  - Sistema de caché para optimizar peticiones (5 minutos)
  - Manejo robusto de errores
  - CORS configurado para desarrollo
  - Validaciones de datos en servidor

- **Frontend Vue.js 3**:
  - Framework reactivo con Composition API
  - Data binding bidireccional (v-model)
  - Interfaz moderna y responsive con TailwindCSS
  - Conversión en tiempo real
  - Soporta 16+ monedas principales
  - Validación reactiva de entrada
  - Transiciones y animaciones suaves
  - Manejo de estado centralizado
  - Computed properties para endpoints dinámicos
  - Watchers para auto-conversión

## Tecnologías Utilizadas

### Backend:
- **Python 3.8+**: Lenguaje de programación
- **Flask**: Framework web ligero
- **Flask-CORS**: Manejo de CORS
- **Requests**: Consumo de API externa

### Frontend:
- **Vue.js 3**: Framework JavaScript progresivo (CDN)
- **HTML5**: Estructura semántica
- **TailwindCSS**: Diseño moderno y responsive
- **JavaScript (ES6+)**: Lógica reactiva
- **Font Awesome**: Iconos

### API Externa:
- **ExchangeRate-API**: Tasas de cambio en tiempo real

## Instalación y Ejecución

### Requisitos Previos:
- Python 3.8 o superior
- pip (gestor de paquetes de Python)
- Navegador web moderno

### Paso 1: Clonar o Descargar el Proyecto

```bash
git "[https://github.com/wizardblack19/moneda-currency.git](https://github.com/wizardblack19/moneda-currency.git)"
```

### Paso 2: Crear Entorno Virtual (Recomendado)

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Paso 3: Instalar Dependencias

```bash
pip install -r requirements.txt
```

### Paso 4: Ejecutar el Servidor

```bash
python app.py
```

El servidor se iniciará en: `http://localhost:5000`

### Paso 5: Acceder a la Aplicación

Abre tu navegador y ve a: `http://localhost:5000`

## Estructura del Proyecto

```
Guia 1/
│
├── app.py              # Servidor Flask (Backend)
├── index.html          # Interfaz web (Frontend)
├── script.js           # Lógica del cliente
├── requirements.txt    # Dependencias Python
└── README.md          # Este archivo
```

## Endpoints del API Backend

### 1. GET `/`
Sirve la página principal (index.html)

### 2. POST `/api/convert`
Convierte monedas

**Request:**
```json
{
    "amount": 100,
    "from_currency": "USD",
    "to_currency": "EUR"
}
```

**Response:**
```json
{
    "result": 92.50,
    "rate": 0.925,
    "from_currency": "USD",
    "to_currency": "EUR",
    "timestamp": "2026-01-19T10:30:00",
    "last_update": "2026-01-19T00:00:00"
}
```

### 3. GET `/api/currencies`
Obtiene lista de monedas disponibles

**Response:**
```json
{
    "USD": "Dólar Estadounidense",
    "EUR": "Euro",
    "GBP": "Libra Esterlina",
    ...
}
```

### 4. GET `/api/health`
Verifica el estado del servidor

**Response:**
```json
{
    "status": "ok",
    "timestamp": "2026-01-19T10:30:00",
    "cache_size": 3
}
```

## Monedas Soportadas

- USD - Dólar Estadounidense
- EUR - Euro
- GBP - Libra Esterlina
- JPY - Yen Japonés
- CAD - Dólar Canadiense
- AUD - Dólar Australiano
- CHF - Franco Suizo
- CNY - Yuan Chino
- MXN - Peso Mexicano
- BRL - Real Brasileño
- ARS - Peso Argentino
- COP - Peso Colombiano
- CLP - Peso Chileno
- PEN - Sol Peruano

## Configuración

### Variables de Entorno (Opcional):

Puedes crear un archivo `.env` para configuración personalizada:

```bash
PORT=5000
DEBUG=True
```

### Modificar Puerto:

Edita `app.py` línea final:

```python
app.run(host='0.0.0.0', port=8080, debug=True)
```

## Despliegue en Servidor

### Opción 1: PythonAnywhere (Recomendado para estudiantes)

1. Crea cuenta en [pythonanywhere.com](https://www.pythonanywhere.com/)
2. Sube los archivos del proyecto
3. Configura un Web App con Flask
4. Instala dependencias: `pip install -r requirements.txt`
5. Configura WSGI file apuntando a `app.py`

### Opción 2: Heroku

```bash
# Crear archivo Procfile
echo "web: python app.py" > Procfile

# Desplegar
heroku login
heroku create nombre-conversor
git push heroku main
```

### Opción 3: Railway

1. Conecta tu repositorio en [railway.app](https://railway.app/)
2. Railway detectará Flask automáticamente
3. Deploy automático

### Opción 4: Render

1. Crea cuenta en [render.com](https://render.com/)
2. Nuevo Web Service desde repositorio
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `python app.py`

## Solución de Problemas

### Error: "ModuleNotFoundError: No module named 'flask'"
```bash
pip install -r requirements.txt
```

### Error: "Address already in use"
El puerto 5000 está ocupado. Cambia el puerto en `app.py` o cierra la aplicación que lo usa.

### Error: "CORS policy"
Verifica que Flask-CORS esté instalado y configurado correctamente en `app.py`.

### Frontend no se conecta al backend
Asegúrate de que el servidor Python esté corriendo en `http://localhost:5000`

## Pruebas

### Probar el Backend (sin frontend):

**Con cURL:**
```bash
curl -X POST http://localhost:5000/api/convert \
  -H "Content-Type: application/json" \
  -d "{\"amount\": 100, \"from_currency\": \"USD\", \"to_currency\": \"EUR\"}"
```

**Con Python:**
```python
import requests

response = requests.post('http://localhost:5000/api/convert', json={
    'amount': 100,
    'from_currency': 'USD',
    'to_currency': 'EUR'
})

print(response.json())
```

## Mejoras Futuras (Opcional)

- [ ] Autenticación de usuarios
- [ ] Base de datos para historial de conversiones
- [ ] Gráficos de tendencia de tasas
- [ ] Soporte para criptomonedas
- [ ] API key propia para mayor límite de peticiones
- [ ] Tests unitarios y de integración
- [ ] Docker containerization
- [ ] Rate limiting

## Notas Técnicas

- El backend implementa un sistema de caché de 5 minutos para reducir llamadas a la API externa
- Las tasas de cambio se actualizan cada 24 horas en la API externa
- El servidor está configurado para aceptar peticiones desde cualquier origen (desarrollo)
- Para producción, configurar CORS con dominios específicos

## Seguridad

- Validación de entrada en frontend y backend
- Sanitización de parámetros
- Manejo seguro de errores sin exponer información sensible
- HTTPS recomendado en producción

## Licencia

Proyecto educativo de código abierto para el curso de Programación VI EFPEM - USAC

## Autor

Proyecto desarrollado par Marvin Lopez

## Contacto y Soporte

Es solo un proyecto universitario, no tiene soporte use solo como demostración de las capacidades de python