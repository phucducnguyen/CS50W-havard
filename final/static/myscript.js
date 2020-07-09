am4core.ready(function() {

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

// Create map instance
var chart = am4core.create("chartdiv", am4maps.MapChart);

// Set map definition
chart.geodata = am4geodata_worldHigh;

// Set projection
chart.projection = new am4maps.projections.Mercator();

// Center on the groups by default
chart.homeZoomLevel = 6;
chart.homeGeoPoint = { longitude: 10, latitude: 51 };

// Polygon series
var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
polygonSeries.exclude = ["AQ"];
polygonSeries.useGeodata = true;
polygonSeries.nonScalingStroke = true;
polygonSeries.strokeOpacity = 0.5;

chart.seriesContainer.events.on("hit", function(ev) {
	console.log(chart.svgPointToGeo(ev.svgPoint));
	coords = chart.svgPointToGeo(ev.svgPoint);
	getWeatherData(coords['latitude'], coords['longitude']);
});

// Texts
var labelsContainer = chart.createChild(am4core.Container);
labelsContainer.isMeasured = false;
// labelsContainer.x = 80;
// labelsContainer.y = 27;
labelsContainer.layout = "horizontal";
labelsContainer.zIndex = 10;

var title = labelsContainer.createChild(am4core.Label);
title.text = "Air Quality App";
// title.fill = am4core.color("#cc0000");
title.fontSize = 50;
title.valign = "middle";
title.dy = 2;
title.marginLeft = window.innerWidth*0.33;


/**
 * Define SVG path for target icon
 */
var targetSVG = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";

// create capital markers
var imageSeries = chart.series.push(new am4maps.MapImageSeries());

// define template
var imageSeriesTemplate = imageSeries.mapImages.template;
var circle = imageSeriesTemplate.createChild(am4core.Sprite);
circle.scale = 0.4;
circle.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
circle.path = targetSVG;
// what about scale...

// set propertyfields
imageSeriesTemplate.propertyFields.latitude = "latitude";
imageSeriesTemplate.propertyFields.longitude = "longitude";

imageSeriesTemplate.horizontalCenter = "middle";
imageSeriesTemplate.verticalCenter = "middle";
imageSeriesTemplate.align = "center";
imageSeriesTemplate.valign = "middle";
imageSeriesTemplate.width = 8;
imageSeriesTemplate.height = 8;
imageSeriesTemplate.nonScaling = true;
imageSeriesTemplate.tooltipText = "{title}";
imageSeriesTemplate.fill = am4core.color("#000");
imageSeriesTemplate.background.fillOpacity = 0;
imageSeriesTemplate.background.fill = am4core.color("#ffffff");
imageSeriesTemplate.setStateOnChildren = true;
imageSeriesTemplate.states.create("hover");

imageSeries.data = capitals;

}); // end am4core.ready()

function getWeatherData(lat, lon) {
    request = new XMLHttpRequest();
    request.open('GET', '/api_call/'+String(lat)+'/'+String(lon)); 

	request.onload = function () {
		if (request.status >= 200 && request.status < 400) {
			data = JSON.parse(this.response)

			var text = '<h2 id="title" align="right"> ' + data['city'] + ' - ' + data['country'] + ' </h2>';
			document.getElementById("cityname").innerHTML = text;

			var el = document.getElementById("buttondiv");
  		    el.className = "grid-item styled-select black rounded";
  		    el.innerHTML = '<select id="selectButton" onchange="plotWeatherData(data, this.value)"></select>';

  		    var el = document.getElementById("selectButton"); 
			values = ['aqi', 'co', 'no2', 'o3', 'pm10', 'pm25', 'so2'];
			names = ['Air Quality Index',
					 'Concentration of CO',
					 'Concentration of NO2',
					 'Concentration of O3',
					 'Particulate matter < 10 micron',
					 'Particulate matter < 2.5 micron',
					 'Concentration of SO2'];

			for (var i = 0; i < names.length; i++) {
				var option = document.createElement("option");
				option.text = names[i];
				option.value = values[i]
				el.add(option);
			}

			plotWeatherData(data, 'aqi');
			console.log(data['city'], data['country'])
		} else {
		console.log('error')
		}
	}
  	request.send()
};