const { createApp } = Vue;

// Crear la aplicación Vue.js 3
createApp({
    data() {
        return {
            // Configuración de API
            apiBaseUrl: window.location.origin,

            // Datos del formulario
            amount: 1,
            fromCurrency: 'USD',
            toCurrency: 'EUR',

            // Lista de monedas (se carga desde el backend)
            currencies: [],

            // Estado de la aplicación
            loading: false,
            result: null,
            error: null,
            lastUpdate: null,
            serverStatus: false,

            // Estado de los selectores con búsqueda
            fromSearch: '',
            toSearch: '',
            showFromDropdown: false,
            showToDropdown: false
        }
    },

    computed: {
        // Endpoint de conversión
        convertEndpoint() {
            return `${this.apiBaseUrl}/api/convert`;
        },

        // Endpoint de health check
        healthEndpoint() {
            return `${this.apiBaseUrl}/api/health`;
        },

        // Endpoint de monedas
        currenciesEndpoint() {
            return `${this.apiBaseUrl}/api/currencies`;
        },

        // Verificar si el botón de convertir debe estar deshabilitado
        isConvertDisabled() {
            return this.loading || !this.serverStatus || this.currencies.length === 0;
        },

        // Filtrar monedas para el selector "De"
        filteredFromCurrencies() {
            if (!this.fromSearch) return this.currencies;
            const search = this.fromSearch.toLowerCase();
            return this.currencies.filter(c =>
                c.code.toLowerCase().includes(search) ||
                c.name.toLowerCase().includes(search)
            );
        },

        // Filtrar monedas para el selector "A"
        filteredToCurrencies() {
            if (!this.toSearch) return this.currencies;
            const search = this.toSearch.toLowerCase();
            return this.currencies.filter(c =>
                c.code.toLowerCase().includes(search) ||
                c.name.toLowerCase().includes(search)
            );
        },

        // Obtener nombre de moneda seleccionada "De"
        selectedFromCurrency() {
            const currency = this.currencies.find(c => c.code === this.fromCurrency);
            return currency ? `${currency.code} - ${currency.name}` : 'Seleccionar...';
        },

        // Obtener nombre de moneda seleccionada "A"
        selectedToCurrency() {
            const currency = this.currencies.find(c => c.code === this.toCurrency);
            return currency ? `${currency.code} - ${currency.name}` : 'Seleccionar...';
        }
    },

    methods: {
        // Convertir moneda
        async convertCurrency() {
            // Limpiar mensajes anteriores
            this.error = null;
            this.result = null;

            // Validar entrada
            if (!this.amount || this.amount <= 0) {
                this.error = 'Por favor, ingresa una cantidad válida mayor a 0';
                return;
            }

            // Mostrar estado de carga
            this.loading = true;

            try {
                // Llamar al backend Python
                const response = await fetch(this.convertEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        amount: this.amount,
                        from_currency: this.fromCurrency,
                        to_currency: this.toCurrency
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Error al realizar la conversión');
                }

                const data = await response.json();

                // Guardar resultado
                this.result = data;

                // Actualizar última fecha de actualización
                if (data.last_update) {
                    this.lastUpdate = data.last_update;
                }

            } catch (err) {
                this.error = err.message || 'Error al conectar con el servidor';
                console.error('Error en conversión:', err);
            } finally {
                this.loading = false;
            }
        },

        // Intercambiar monedas
        swapCurrencies() {
            const temp = this.fromCurrency;
            this.fromCurrency = this.toCurrency;
            this.toCurrency = temp;

            // Si ya hay un resultado, reconvertir
            if (this.result) {
                this.convertCurrency();
            }
        },

        // Verificar estado del servidor
        async checkServerHealth() {
            try {
                const response = await fetch(this.healthEndpoint);
                if (response.ok) {
                    const data = await response.json();
                    this.serverStatus = data.status === 'ok';
                    console.log('✅ Servidor conectado:', data);
                }
            } catch (err) {
                this.serverStatus = false;
                console.error('⚠️ No se pudo conectar con el servidor backend');
                this.error = 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.';
            }
        },

        // Cargar lista de monedas desde el backend
        async loadCurrencies() {
            try {
                const response = await fetch(this.currenciesEndpoint);
                if (response.ok) {
                    this.currencies = await response.json();
                    console.log('💰 Monedas cargadas:', this.currencies.length);
                }
            } catch (err) {
                console.error('⚠️ Error al cargar monedas:', err);
            }
        },

        // Seleccionar moneda "De"
        selectFromCurrency(code) {
            this.fromCurrency = code;
            this.showFromDropdown = false;
            this.fromSearch = '';
        },

        // Seleccionar moneda "A"
        selectToCurrency(code) {
            this.toCurrency = code;
            this.showToDropdown = false;
            this.toSearch = '';
        },

        // Cerrar dropdowns al hacer clic fuera
        closeDropdowns(event) {
            if (!event.target.closest('.currency-select')) {
                this.showFromDropdown = false;
                this.showToDropdown = false;
            }
        },

        // Formatear números
        formatNumber(value) {
            if (!value) return '0.00';
            return parseFloat(value).toLocaleString('es-ES', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        },

        // Formatear tasa de cambio
        formatRate(value) {
            if (!value) return '0.0000';
            return parseFloat(value).toLocaleString('es-ES', {
                minimumFractionDigits: 4,
                maximumFractionDigits: 4
            });
        },

        // Formatear fecha
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    },

    // Lifecycle hook - se ejecuta cuando el componente es montado
    mounted() {
        // Verificar estado del servidor al cargar
        this.checkServerHealth();
        // Cargar lista de monedas desde el backend
        this.loadCurrencies();

        // Listener para cerrar dropdowns al hacer clic fuera
        document.addEventListener('click', this.closeDropdowns);

        console.log('🚀 Aplicación Vue.js 3 iniciada');
        console.log('📊 Conversor de Moneda cargado correctamente');
    },

    // Lifecycle hook - se ejecuta antes de desmontar
    beforeUnmount() {
        document.removeEventListener('click', this.closeDropdowns);
    },

    // Watch para auto-convertir cuando cambian las monedas (opcional)
    watch: {
        fromCurrency(newVal, oldVal) {
            if (this.result && newVal !== oldVal) {
                this.convertCurrency();
            }
        },
        toCurrency(newVal, oldVal) {
            if (this.result && newVal !== oldVal) {
                this.convertCurrency();
            }
        }
    }
}).mount('#app');
