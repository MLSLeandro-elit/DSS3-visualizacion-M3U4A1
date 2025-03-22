/**
 * Módulo de gráficos para visualizar datos de juegos Android
 * Implementado siguiendo principios SOLID con separación clara de responsabilidades
 */
const ChartsModule = (function () {
    // Cargamos Google Charts
    google.charts.load('current', {
        'packages': ['corechart', 'bar', 'scatter', 'table']
    });

    // Definimos los colores para las diferentes categorías y regiones
    const COLORS = {
        categories: ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#8064A2', '#9C27B0',
            '#FF9800', '#795548', '#607D8B', '#3F51B5', '#009688', '#673AB7'],
        regions: {
            US: '#4285F4',
            EU: '#34A853',
            JP: '#EA4335'
        }
    };

    // Opciones comunes para los gráficos
    const COMMON_OPTIONS = {
        fontName: 'Segoe UI',
        backgroundColor: 'transparent',
        chartArea: {
            width: '85%',
            height: '75%'
        },
        animation: {
            duration: 1000,
            easing: 'out',
            startup: true
        },
        legend: {
            position: 'bottom',
            alignment: 'center'
        }
    };

    /**
     * 1. Gráfico de Top 10 Categorías
     */
    function drawTopCategoriesChart() {
        const data = DataModule.getGameCountByCategory().slice(0, 10);

        if (data.length === 0) {
            displayNoDataMessage('chart-top-categories');
            return;
        }

        const chartData = new google.visualization.DataTable();
        chartData.addColumn('string', 'Categoría');
        chartData.addColumn('number', 'Número de Juegos');

        data.forEach(item => {
            // Simplificamos el nombre de la categoría eliminando "GAME_"
            const categoryName = item.category.replace('GAME_', '');
            chartData.addRow([categoryName, item.count]);
        });

        const options = {
            ...COMMON_OPTIONS,
            title: 'Top 10 Categorías de Juegos',
            colors: COLORS.categories,
            hAxis: {
                title: 'Número de Juegos',
                minValue: 0
            },
            vAxis: {
                title: 'Categoría'
            },
            bars: 'horizontal'
        };

        const chart = new google.visualization.BarChart(document.getElementById('chart-top-categories'));
        chart.draw(chartData, options);
    }

    /**
     * 2. Gráfico de Top Ventas por Categoría
     */
    function drawTopSalesByCategoryChart() {
        const topCategories = DataModule.getGameCountByCategory().slice(0, 5);

        if (topCategories.length === 0) {
            displayNoDataMessage('chart-top-sales-by-category');
            return;
        }

        const chartData = new google.visualization.DataTable();
        chartData.addColumn('string', 'Categoría');
        chartData.addColumn('number', 'Ventas Globales');
        chartData.addColumn({ type: 'string', role: 'tooltip' });

        // Para cada categoría, obtenemos los 3 juegos con más ventas
        topCategories.forEach(category => {
            const catName = category.category.replace('GAME_', '');
            const topGames = DataModule.getTopN('globalSales', 3, item => item.category === category.category);

            topGames.forEach(game => {
                const tooltip = `${game.title}\nCategoría: ${catName}\nVentas Globales: ${game.globalSales.toLocaleString()}`;
                chartData.addRow([catName, game.globalSales, tooltip]);
            });
        });

        const options = {
            ...COMMON_OPTIONS,
            title: 'Top 3 Juegos con Mayores Ventas por Categoría',
            colors: COLORS.categories,
            hAxis: {
                title: 'Categoría'
            },
            vAxis: {
                title: 'Ventas Globales'
            },
            seriesType: 'bars',
            isStacked: false
        };

        const chart = new google.visualization.ColumnChart(document.getElementById('chart-top-sales-by-category'));
        chart.draw(chartData, options);
    }

    /**
     * Función auxiliar para mostrar mensaje cuando no hay datos
     */
    function displayNoDataMessage(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '<div class="alert alert-warning text-center mt-5">No hay datos disponibles para esta visualización</div>';
        }
    }

    /**
 * Módulo de gráficos para visualizar datos de juegos Android - Parte 2
 * Implementación de los gráficos restantes
 */

    // Continuando con el módulo ChartsModule existente, agregamos estas funciones dentro del cierre

    // Agregar dentro del módulo, antes del return final:

    /**
     * 3. Gráfico de Distribución Porcentual por Región
     */
    function drawRegionalDistributionChart(category) {
        if (!category) {
            const categories = DataModule.getCategories();
            if (categories && categories.length > 0) {
                category = categories[0];
            } else {
                displayNoDataMessage('chart-region-distribution');
                return;
            }
        }

        const distribution = DataModule.getRegionalDistribution(category);

        const chartData = new google.visualization.DataTable();
        chartData.addColumn('string', 'Región');
        chartData.addColumn('number', 'Ventas');

        chartData.addRow(['US', distribution.US.value]);
        chartData.addRow(['EU', distribution.EU.value]);
        chartData.addRow(['JP', distribution.JP.value]);

        const options = {
            ...COMMON_OPTIONS,
            title: `Distribución de Ventas por Región: ${category.replace('GAME_', '')}`,
            pieHole: 0.4,
            colors: [COLORS.regions.US, COLORS.regions.EU, COLORS.regions.JP],
            tooltip: {
                text: 'percentage'
            },
            slices: {
                0: { color: COLORS.regions.US },
                1: { color: COLORS.regions.EU },
                2: { color: COLORS.regions.JP }
            }
        };

        const chart = new google.visualization.PieChart(document.getElementById('chart-region-distribution'));
        chart.draw(chartData, options);
    }

    /**
     * 4. Gráfico de Instalaciones vs. Total Ratings
     */
    function drawInstallsVsRatingsChart() {
        const scatterData = DataModule.getScatterData('installs', 'totalRatings');

        if (scatterData.length === 0) {
            displayNoDataMessage('chart-installs-vs-ratings');
            return;
        }

        const chartData = new google.visualization.DataTable();
        chartData.addColumn('number', 'Instalaciones');
        chartData.addColumn('number', 'Valoraciones Totales');
        chartData.addColumn({ type: 'string', role: 'tooltip' });

        scatterData.forEach(item => {
            const tooltip = `${item.title}\nInstalaciones: ${item.x.toLocaleString()}\nValoraciones: ${item.y.toLocaleString()}\nCategoría: ${item.category.replace('GAME_', '')}`;
            chartData.addRow([item.x, item.y, tooltip]);
        });

        const options = {
            ...COMMON_OPTIONS,
            title: 'Relación entre Instalaciones y Valoraciones Totales',
            hAxis: {
                title: 'Instalaciones',
                logScale: true
            },
            vAxis: {
                title: 'Valoraciones Totales',
                logScale: true
            },
            trendlines: {
                0: {
                    type: 'exponential',
                    color: 'red',
                    lineWidth: 2,
                    opacity: 0.3,
                    showR2: true,
                    visibleInLegend: true,
                    labelInLegend: 'Tendencia'
                }
            },
            pointSize: 5
        };

        const chart = new google.visualization.ScatterChart(document.getElementById('chart-installs-vs-ratings'));
        chart.draw(chartData, options);
    }
    /**
     * Función para inicializar el selector de categorías para el gráfico de distribución regional
     */
    function initCategorySelector() {
        const categories = DataModule.getCategories();
        if (!categories || categories.length === 0) return;

        const selector = document.getElementById('category-select-region');
        if (selector) {
            // Limpiar opciones existentes
            selector.innerHTML = '';

            // Agregar nuevas opciones
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category.replace('GAME_', '');
                selector.appendChild(option);
            });

            // Configurar evento de cambio
            selector.addEventListener('change', function () {
                drawRegionalDistributionChart(this.value);
            });
        }
    }

    // API pública que exportaremos (continuará en la siguiente parte)
    return {
        drawAllCharts: function () {
            google.charts.setOnLoadCallback(() => {
                // Dibujamos los gráficos iniciales
                drawTopCategoriesChart();
                drawTopSalesByCategoryChart();
                drawRegionalDistributionChart();
                drawInstallsVsRatingsChart();

                // Inicializamos el selector de categoría para la distribución regional
                initCategorySelector();
            });
        },

        // Métodos individuales para cada gráfico
        drawTopCategoriesChart: drawTopCategoriesChart,
        drawTopSalesByCategoryChart: drawTopSalesByCategoryChart,
        drawRegionalDistributionChart: drawRegionalDistributionChart,
        drawInstallsVsRatingsChart: drawInstallsVsRatingsChart
    };
})();