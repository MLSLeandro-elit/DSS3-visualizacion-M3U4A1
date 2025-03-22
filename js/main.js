/**
 * Archivo principal para inicializar la aplicación de visualización de datos
 * Implementa el patrón de diseño Singleton para la aplicación principal
 */
const AppModule = (function () {
    // Estado de la aplicación
    let _isInitialized = false;
    let _isDataLoaded = false;

    /**
     * Función para inicializar la aplicación
     */
    async function initialize() {
        if (_isInitialized) return;

        try {
            // Mostramos indicadores de carga en todos los gráficos
            showLoadingIndicators();

            // Cargamos los datos
            await loadAppData();

            // Inicializamos los gráficos
            initializeCharts();

            // Inicializamos los selectores
            initializeCategorySelectors();

            // Marcamos la app como inicializada
            _isInitialized = true;

            // Ocultamos los indicadores de carga
            hideLoadingIndicators();
        } catch (error) {
            console.error('Error al inicializar la aplicación:', error);
            showErrorMessage(error);
        }
    }

    /**
     * Función para cargar los datos
     */
    async function loadAppData() {
        try {
            await DataModule.loadData();
            _isDataLoaded = DataModule.isDataLoaded();

            if (!_isDataLoaded) {
                throw new Error('No se pudieron cargar los datos correctamente');
            }
        } catch (error) {
            console.error('Error al cargar datos:', error);
            throw error;
        }
    }

    /**
     * Función para inicializar los gráficos
     */
    function initializeCharts() {
        if (!_isDataLoaded) {
            console.warn('No se pueden inicializar los gráficos sin datos');
            return;
        }

        // Iniciamos los gráficos con Google Charts
        ChartsModule.drawAllCharts();
    }

    /**
     * Función para inicializar los selectores de categoría
     */
    function initializeCategorySelectors() {
        if (!_isDataLoaded) return;

        const categories = DataModule.getCategories();
        if (!categories || categories.length === 0) return;

        // Inicializamos el selector de instalaciones por categoría
        const installsSelector = document.getElementById('category-select-installs');
        if (installsSelector) {
            // Limpiar opciones existentes
            installsSelector.innerHTML = '';

            // Agregar nuevas opciones
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category.replace('GAME_', '');
                installsSelector.appendChild(option);
            });

            // Configurar evento de cambio
            installsSelector.addEventListener('change', function () {
                drawTopInstallsByCategoryChart(this.value);
            });

            // Dibujar el gráfico inicial con la primera categoría
            drawTopInstallsByCategoryChart(categories[0]);
        }
    }

    /**
     * Función para dibujar el gráfico de Top Instalaciones por Categoría
     */
    function drawTopInstallsByCategoryChart(category) {
        if (!category) return;

        const topGames = DataModule.getTopN('installs', 10, item => item.category === category);

        if (topGames.length === 0) {
            displayNoDataMessage('chart-top-installs');
            return;
        }

        google.charts.setOnLoadCallback(() => {
            const chartData = new google.visualization.DataTable();
            chartData.addColumn('string', 'Juego');
            chartData.addColumn('number', 'Instalaciones');
            chartData.addColumn({ type: 'string', role: 'tooltip' });

            topGames.forEach(game => {
                const tooltip = `${game.title}\nCategoría: ${game.category.replace('GAME_', '')}\nInstalaciones: ${game.installs.toLocaleString()}`;
                // Truncamos el título si es muy largo
                const shortTitle = game.title.length > 20 ? game.title.substring(0, 17) + '...' : game.title;
                chartData.addRow([shortTitle, game.installs, tooltip]);
            });

            const options = {
                fontName: 'Segoe UI',
                backgroundColor: 'transparent',
                title: `Top 10 Juegos por Instalaciones en ${category.replace('GAME_', '')}`,
                hAxis: {
                    title: 'Juego',
                    textStyle: {
                        fontSize: 10
                    }
                },
                vAxis: {
                    title: 'Instalaciones',
                    format: 'short',
                    logScale: true
                },
                animation: {
                    duration: 1000,
                    easing: 'out',
                    startup: true
                },
                legend: {
                    position: 'none'
                },
                chartArea: {
                    width: '80%',
                    height: '70%'
                },
                colors: ['#8064A2']
            };

            const chart = new google.visualization.ColumnChart(document.getElementById('chart-top-installs'));
            chart.draw(chartData, options);
        });
    }

    /**
     * Función para dibujar el gráfico de Instalaciones vs Ventas Globales
     */
    function drawInstallsVsSalesChart() {
        const scatterData = DataModule.getScatterData('installs', 'globalSales', 100);

        if (scatterData.length === 0) {
            displayNoDataMessage('chart-installs-vs-sales');
            return;
        }

        google.charts.setOnLoadCallback(() => {
            const chartData = new google.visualization.DataTable();
            chartData.addColumn('number', 'Instalaciones');
            chartData.addColumn('number', 'Ventas Globales');
            chartData.addColumn({ type: 'string', role: 'tooltip' });

            scatterData.forEach(item => {
                const tooltip = `${item.title}\nInstalaciones: ${item.x.toLocaleString()}\nVentas Globales: ${item.y.toLocaleString()}\nCategoría: ${item.category.replace('GAME_', '')}`;
                chartData.addRow([item.x, item.y, tooltip]);
            });

            const options = {
                fontName: 'Segoe UI',
                backgroundColor: 'transparent',
                title: 'Relación entre Instalaciones y Ventas Globales',
                hAxis: {
                    title: 'Instalaciones',
                    logScale: true
                },
                vAxis: {
                    title: 'Ventas Globales',
                    logScale: false
                },
                trendlines: {
                    0: {
                        type: 'linear',
                        color: 'red',
                        lineWidth: 2,
                        opacity: 0.3,
                        showR2: true,
                        visibleInLegend: true,
                        labelInLegend: 'Tendencia'
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'out',
                    startup: true
                },
                pointSize: 5,
                chartArea: {
                    width: '80%',
                    height: '70%'
                },
                colors: ['#EA4335']
            };

            const chart = new google.visualization.ScatterChart(document.getElementById('chart-installs-vs-sales'));
            chart.draw(chartData, options);
        });
    }

    /**
     * Función para mostrar indicadores de carga
     */
    function showLoadingIndicators() {
        const chartContainers = document.querySelectorAll('[id^="chart-"]');
        chartContainers.forEach(container => {
            container.innerHTML = '<div class="loading"></div>';
        });
    }

    /**
     * Función para ocultar indicadores de carga
     */
    function hideLoadingIndicators() {
        const loadingElements = document.querySelectorAll('.loading');
        loadingElements.forEach(element => {
            element.style.display = 'none';
        });
    }

    /**
     * Función para mostrar mensajes de error
     */
    function showErrorMessage(error) {
        const chartContainers = document.querySelectorAll('[id^="chart-"]');
        chartContainers.forEach(container => {
            container.innerHTML = `<div class="alert alert-danger text-center mt-5">Error: ${error.message}</div>`;
        });
    }

    /**
     * Función para mostrar mensaje cuando no hay datos
     */
    function displayNoDataMessage(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '<div class="alert alert-warning text-center mt-5">No hay datos disponibles para esta visualización</div>';
        }
    }

    // API pública
    return {
        initialize: initialize,
        drawInstallsVsSalesChart: drawInstallsVsSalesChart,
        drawTopInstallsByCategoryChart: drawTopInstallsByCategoryChart
    };
})();

// Iniciamos la aplicación cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function () {
    // Inicializamos la aplicación
    AppModule.initialize().then(() => {
        // Una vez inicializada, dibujamos el gráfico de instalaciones vs ventas
        AppModule.drawInstallsVsSalesChart();
    });
});