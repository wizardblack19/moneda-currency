from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
from datetime import datetime, timedelta
import os

app = Flask(__name__)
CORS(app)  # Permitir peticiones desde el frontend

# Configuración de la API externa
API_URL = 'https://api.exchangerate-api.com/v4/latest/'

# Cache en memoria para optimizar peticiones
cache = {}
CACHE_DURATION = timedelta(minutes=5)


def get_exchange_rates(base_currency):
    """
    Obtiene las tasas de cambio desde la API externa o desde caché
    """
    current_time = datetime.now()

    # Verificar si existe en caché y es válido
    if base_currency in cache:
        cached_data, timestamp = cache[base_currency]
        if current_time - timestamp < CACHE_DURATION:
            return cached_data

    try:
        # Realizar petición a la API externa
        response = requests.get(f"{API_URL}{base_currency}", timeout=10)
        response.raise_for_status()

        data = response.json()

        # Guardar en caché
        cache[base_currency] = (data, current_time)

        return data

    except requests.exceptions.RequestException as e:
        raise Exception(f"Error al conectar con la API de conversión: {str(e)}")


@app.route('/')
def index():
    """
    Sirve el archivo HTML principal
    """
    return send_from_directory('.', 'index.html')


@app.route('/<path:path>')
def serve_static(path):
    """
    Sirve archivos estáticos (JS, CSS, etc.)
    """
    return send_from_directory('.', path)


@app.route('/api/convert', methods=['POST'])
def convert_currency():
    """
    Endpoint principal para convertir monedas
    Recibe: {amount, from_currency, to_currency}
    Retorna: {result, rate, from_currency, to_currency, timestamp}
    """
    try:
        # Obtener datos del request
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No se recibieron datos'}), 400

        amount = data.get('amount')
        from_currency = data.get('from_currency')
        to_currency = data.get('to_currency')

        # Validaciones
        if not all([amount, from_currency, to_currency]):
            return jsonify({'error': 'Faltan parámetros requeridos'}), 400

        try:
            amount = float(amount)
            if amount <= 0:
                return jsonify({'error': 'La cantidad debe ser mayor a 0'}), 400
        except ValueError:
            return jsonify({'error': 'Cantidad inválida'}), 400

        # Validar códigos de moneda (3 letras)
        if len(from_currency) != 3 or len(to_currency) != 3:
            return jsonify({'error': 'Códigos de moneda inválidos'}), 400

        from_currency = from_currency.upper()
        to_currency = to_currency.upper()

        # Caso especial: misma moneda
        if from_currency == to_currency:
            return jsonify({
                'result': amount,
                'rate': 1.0,
                'from_currency': from_currency,
                'to_currency': to_currency,
                'timestamp': datetime.now().isoformat()
            })

        # Obtener tasas de cambio
        rates_data = get_exchange_rates(from_currency)

        # Verificar que existe la moneda destino
        if to_currency not in rates_data['rates']:
            return jsonify({'error': f'Moneda {to_currency} no soportada'}), 400

        # Realizar conversión
        rate = rates_data['rates'][to_currency]
        result = amount * rate

        # Retornar resultado
        return jsonify({
            'result': round(result, 2),
            'rate': rate,
            'from_currency': from_currency,
            'to_currency': to_currency,
            'timestamp': datetime.now().isoformat(),
            'last_update': datetime.fromtimestamp(rates_data['time_last_updated']).isoformat()
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Monedas disponibles con nombres
CURRENCIES = {
    'USD': 'Dólar Estadounidense',
    'EUR': 'Euro',
    'GBP': 'Libra Esterlina',
    'JPY': 'Yen Japonés',
    'CAD': 'Dólar Canadiense',
    'AUD': 'Dólar Australiano',
    'CHF': 'Franco Suizo',
    'CNY': 'Yuan Chino',
    'MXN': 'Peso Mexicano',
    'GTQ': 'Quetzal Guatemalteco',
    'BRL': 'Real Brasileño',
    'ARS': 'Peso Argentino',
    'COP': 'Peso Colombiano',
    'CLP': 'Peso Chileno',
    'PEN': 'Sol Peruano',
    'INR': 'Rupia India',
    'KRW': 'Won Surcoreano',
    'RUB': 'Rublo Ruso',
    'ZAR': 'Rand Sudafricano',
    'SGD': 'Dólar de Singapur',
    'HKD': 'Dólar de Hong Kong',
    'NZD': 'Dólar Neozelandés',
    'SEK': 'Corona Sueca',
    'NOK': 'Corona Noruega',
    'DKK': 'Corona Danesa',
    'PLN': 'Zloty Polaco',
    'THB': 'Baht Tailandés',
    'MYR': 'Ringgit Malayo',
    'PHP': 'Peso Filipino',
    'IDR': 'Rupia Indonesia',
    'TWD': 'Dólar Taiwanés',
    'AED': 'Dirham de Emiratos Árabes',
    'SAR': 'Riyal Saudí',
    'TRY': 'Lira Turca',
    'ILS': 'Nuevo Shekel Israelí',
    'EGP': 'Libra Egipcia'
}


@app.route('/api/currencies', methods=['GET'])
def get_currencies():
    """
    Endpoint para obtener la lista de monedas disponibles
    Retorna: [{code, name}, ...]
    """
    try:
        # Convertir a formato de lista para el frontend
        currencies_list = [
            {'code': code, 'name': name}
            for code, name in CURRENCIES.items()
        ]
        return jsonify(currencies_list)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Endpoint para verificar el estado del servidor
    """
    return jsonify({
        'status': 'ok',
        'timestamp': datetime.now().isoformat(),
        'cache_size': len(cache)
    })


# Manejo de errores
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint no encontrado'}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Error interno del servidor'}), 500


if __name__ == '__main__':
    # Configuración para desarrollo
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'True') == 'True'

    print(f"🚀 Servidor iniciado en http://localhost:{port}")
    print(f"📊 Conversor de Moneda - Backend Python")
    print(f"🔧 Modo: {'Desarrollo' if debug else 'Producción'}")

    app.run(host='0.0.0.0', port=port, debug=debug)
