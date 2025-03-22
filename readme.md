# Dashboard de Visualización de Datos - Juegos Android

Este proyecto es una aplicación web para visualizar y analizar datos de juegos Android, mostrando tendencias de ventas, instalaciones, categorías populares y distribución regional. El dashboard utiliza Google Charts para crear visualizaciones interactivas y dinámicas.

![Dashboard Preview](./img/img.png)

## Características

- **Visualizaciones Interactivas**: Gráficos dinámicos que permiten explorar los datos desde múltiples perspectivas
- **Análisis por Categoría**: Filtros por categorías de juegos para análisis detallado
- **Correlaciones**: Visualización de relaciones entre instalaciones, valoraciones y ventas
- **Diseño Responsive**: Adaptado para dispositivos móviles y de escritorio
- **Arquitectura Modular**: Código organizado siguiendo principios SOLID

## Visualizaciones Incluidas

1. **Top 10 Categorías de Juegos**: Muestra las categorías más populares por número de juegos
2. **Top Ventas por Categoría**: Presenta los juegos con mayores ventas en cada categoría
3. **Distribución Porcentual por Región**: Análisis de ventas por región (US, EU, JP) para categorías seleccionadas
4. **Instalaciones vs. Total Ratings**: Correlación entre número de instalaciones y valoraciones recibidas
5. **Top 10 Instalaciones por Categoría**: Juegos más instalados en cada categoría seleccionada
6. **Instalaciones vs Ventas Globales**: Análisis de la relación entre instalaciones y ventas

## Tecnologías Utilizadas

- **Frontend**:
  - HTML5, CSS3, JavaScript
  - Bootstrap 5.3 para diseño responsive
  - Google Charts para visualizaciones
  - Papa Parse para procesamiento de CSV

- **Arquitectura**:
  - Patrón Módulo para encapsulamiento
  - Principios SOLID para mantenibilidad
  - Diseño orientado a componentes

## Estructura del Proyecto

```
proyecto-visualizacion/
├── index.html                   # Página principal que aloja todas las visualizaciones
├── css/
│   └── styles.css               # Estilos personalizados
├── js/
│   ├── data.js                  # Funciones para cargar y procesar datos
│   ├── charts.js                # Implementación de todos los gráficos
│   └── main.js                  # Inicialización y configuración
└── data/
    └── android_games_clean.csv  # Dataset procesado
```

## Instalación y Uso

1. Clona este repositorio:
   ```
   git clone https://github.com/tu-usuario/dashboard-juegos-android.git
   ```

2. Navega al directorio del proyecto:
   ```
   cd dashboard-juegos-android
   ```

3. Puedes ejecutar el proyecto de varias formas:
   - Abriendo `index.html` directamente en un navegador (solo funcionará con algunos navegadores debido a restricciones CORS)
   - Utilizando un servidor web local como Live Server de VS Code
   - Con Python:
     ```
     python -m http.server
     ```
   - Con Node.js:
     ```
     npx serve
     ```

4. Accede a la aplicación en tu navegador (típicamente en `http://localhost:8000` o similar dependiendo del servidor utilizado)

## Origen de los Datos

Los datos utilizados en este dashboard provienen de un dataset limpio y procesado de juegos Android. El conjunto de datos incluye información sobre:

- Títulos de juegos
- Categorías
- Valoraciones de usuarios
- Instalaciones
- Ventas por región (US, EU, JP)
- Ventas globales
- Precios y modelo de monetización (gratuito/pago)

El proceso de limpieza y preparación de los datos está documentado en los archivos `limpieza_datos_output.txt` y `exploracion_datos_android_games_20250322_140624.txt`.

## Contribuciones

Las contribuciones son bienvenidas. Para contribuir:

1. Haz un fork del proyecto
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Haz commit de tus cambios (`git commit -m 'Añadir nueva característica'`)
4. Haz push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Si tienes preguntas o sugerencias, no dudes en contactar a través de [tu-email@ejemplo.com](mailto:tu-email@ejemplo.com) o abrir un issue en este repositorio.