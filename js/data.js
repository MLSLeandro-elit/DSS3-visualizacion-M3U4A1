/**
 * Módulo para cargar y procesar los datos de juegos Android
 * Implementa una estructura basada en el patrón Singleton y principios SOLID
 */
const DataModule = (function () {
    // Almacén privado de datos
    let _data = null;
    let _categories = null;
    let _isLoading = false;

    // Función para cargar los datos desde un archivo CSV
    async function loadData() {
        if (_isLoading) return;

        _isLoading = true;

        try {
            const response = await fetch('data/android_games_clean.csv');
            const csvText = await response.text();

            // Procesamos el CSV utilizando Papa Parse
            const parsedData = Papa.parse(csvText, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true
            });

            // Limpiamos y transformamos los datos
            _data = processData(parsedData.data);

            // Extraemos las categorías únicas
            _categories = [...new Set(_data.map(item => item.category))].sort();

            return _data;
        } catch (error) {
            console.error('Error al cargar los datos:', error);
            throw error;
        } finally {
            _isLoading = false;
        }
    }

    // Función para procesar y limpiar los datos
    function processData(rawData) {
        return rawData.map(item => {
            // Aseguramos que valores críticos son numéricos
            return {
                title: item.title || '',
                rank: Number(item.rank) || 0,
                totalRatings: Number(item.total_ratings) || 0,
                installs: Number(item.installs) || 0,
                averageRating: Number(item['average rating']) || 0,
                growth30: Number(item['growth (30 days)']) || 0,
                growth60: Number(item['growth (60 days)']) || 0,
                price: Number(item.price) || 0,
                category: item.category || 'Unknown',
                star5: Number(item['5_star_ratings']) || 0,
                star4: Number(item['4 star ratings']) || 0,
                star3: Number(item['3 star ratings']) || 0,
                star2: Number(item['2 star ratings']) || 0,
                star1: Number(item['1 star ratings']) || 0,
                paid: item.paid === 'TRUE',
                usSales: Number(item.US_Sales) || 0,
                euSales: Number(item.EU_Sales) || 0,
                jpSales: Number(item.JP_Sales) || 0,
                globalSales: Number(item.Global_Sales) || 0
            };
        }).filter(item => {
            // Filtramos datos inconsistentes (por ejemplo, categorías no válidas)
            return item.category &&
                !isNaN(item.installs) &&
                !isNaN(item.globalSales) &&
                item.category.startsWith('GAME_');
        });
    }

    // Función para obtener datos por categoría
    function getDataByCategory(category) {
        if (!_data) return [];
        return _data.filter(item => item.category === category);
    }

    // Función para obtener top N elementos según cierta propiedad
    function getTopN(property, n = 10, filterFn = null) {
        if (!_data) return [];

        let filteredData = filterFn ? _data.filter(filterFn) : [..._data];

        return filteredData
            .sort((a, b) => b[property] - a[property])
            .slice(0, n);
    }

    // Función para obtener la distribución por región para una o más categorías
    function getRegionalDistribution(categories) {
        if (!_data) return {};

        const catArray = Array.isArray(categories) ? categories : [categories];
        const filteredData = _data.filter(item => catArray.includes(item.category));

        // Sumamos las ventas por región
        const totalUS = filteredData.reduce((sum, item) => sum + item.usSales, 0);
        const totalEU = filteredData.reduce((sum, item) => sum + item.euSales, 0);
        const totalJP = filteredData.reduce((sum, item) => sum + item.jpSales, 0);
        const globalTotal = totalUS + totalEU + totalJP;

        return {
            US: {
                value: totalUS,
                percentage: globalTotal > 0 ? (totalUS / globalTotal * 100) : 0
            },
            EU: {
                value: totalEU,
                percentage: globalTotal > 0 ? (totalEU / globalTotal * 100) : 0
            },
            JP: {
                value: totalJP,
                percentage: globalTotal > 0 ? (totalJP / globalTotal * 100) : 0
            },
            total: globalTotal
        };
    }

    // Función para contar juegos por categoría
    function getGameCountByCategory() {
        if (!_data || !_categories) return [];

        return _categories.map(category => {
            const count = _data.filter(item => item.category === category).length;
            return { category, count };
        }).sort((a, b) => b.count - a.count);
    }

    // Función para obtener datos para gráfico de dispersión
    function getScatterData(xProperty, yProperty, maxPoints = 100) {
        if (!_data) return [];

        // Tomamos una muestra representativa si hay muchos puntos
        let sampleData = _data.length > maxPoints
            ? _data.filter((_, index) => index % Math.ceil(_data.length / maxPoints) === 0)
            : [..._data];

        return sampleData.map(item => ({
            x: item[xProperty],
            y: item[yProperty],
            title: item.title,
            category: item.category
        }));
    }

    // API pública
    return {
        loadData,
        getData: () => _data,
        getCategories: () => _categories,
        getDataByCategory,
        getTopN,
        getRegionalDistribution,
        getGameCountByCategory,
        getScatterData,
        isDataLoaded: () => !!_data
    };
})();