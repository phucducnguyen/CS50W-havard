## Final Project
### The air quality app

This is the final project for the CS50's Web Programming with Python and JavaScript course.

My project in an app that allows to see air quality data for any location in the globe.

To get the data it laverages the weatherbit.io API. This api, in the free version that I am using, allows to retrive the last 72 hours of data and has a forecast of 120 hours. It give data for various air quality measurement plus an air quality index. The api call is done in the backend via flask.

Tha app consists of one page. We have a map of the world, with capitals highlighted. The map is fully clickable and the click triggers the api call to get the data. The data is then visualized in a graph, allowing to move to different measures.

For the map visualization I used the amcharts javascript package, which allows different type of map visualizations. The data plotting is done via the d3 javascript package, a very flexible package that allows to do different types of visualizations.