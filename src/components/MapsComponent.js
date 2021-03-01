import React, { useEffect, useState } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import am4geodata_data_countries2 from '@amcharts/amcharts4-geodata/data/countries2';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

function MapsComponent({ data }) {
    const [places, setPlaces] = useState([]);
    const [points, setPoints] = useState([]);

    useEffect(() => {
        var arr = [];
        for (var i = 0; i < data.length; ++i) {
            var json_data = {
                City: data[i].gsx$city.$t,
                OrderID: data[i].gsx$orderid.$t,
                Item: data[i].gsx$item.$t,
                Dispatched: data[i].gsx$orderdispatched.$t,
                Shipped: data[i].gsx$ordershipped.$t,
                Latitude: parseFloat(data[i].gsx$latitude.$t),
                Longitude: parseFloat(data[i].gsx$longitude.$t),
                color:
                    data[i].gsx$ordershipped.$t === 'YES' &&
                    data[i].gsx$orderdispatched.$t === 'YES'
                        ? '#06d6a0'
                        : data[i].gsx$orderdispatched.$t === 'YES' &&
                          data[i].gsx$ordershipped.$t !== 'YES'
                        ? '#ffd166'
                        : '#ef476f'
            };
            arr.push(json_data);
            setPlaces(arr);
        }
    }, [data]);

    useEffect(() => {
        if (JSON.stringify(points) !== JSON.stringify(places)) {
            setPoints(places);
            //console.log('not same');
        }
    }, [places]);

    useEffect(() => {
        //console.log(points);
        var chart = am4core.create('mapdiv', am4maps.MapChart);
        chart.homeZoomLevel = 4;
        chart.homeGeoPoint = {
            latitude: 33,
            longitude: 77
        };

        chart.projection = new am4maps.projections.Miller();

        // Create map polygon series for world map
        var worldSeries = chart.series.push(new am4maps.MapPolygonSeries());
        worldSeries.useGeodata = true;
        worldSeries.geodata = am4geodata_worldLow;
        worldSeries.exclude = ['AQ'];

        var worldPolygon = worldSeries.mapPolygons.template;
        worldPolygon.tooltipText = '{name}';
        worldPolygon.nonScalingStroke = true;
        worldPolygon.stroke = am4core.color('#42426A');
        worldPolygon.strokeOpacity = 0.7;
        worldPolygon.fill = am4core.color('#333343');
        worldPolygon.propertyFields.fill = 'color';

        var hs = worldPolygon.states.create('hover');
        hs.properties.fill = am4core.color('#42426A');

        // Create country specific series (but hide it for now)
        var countrySeries = chart.series.push(new am4maps.MapPolygonSeries());
        countrySeries.useGeodata = true;
        countrySeries.hide();

        countrySeries.geodataSource.events.on('done', function (ev) {
            worldSeries.hide();
            countrySeries.show();
            countrySeries.zoomLevel = 10;
        });

        var countryPolygon = countrySeries.mapPolygons.template;
        countryPolygon.tooltipText = '{name}';
        countryPolygon.nonScalingStroke = true;
        countryPolygon.stroke = am4core.color('#42426A');
        countryPolygon.strokeOpacity = 0.4;

        countryPolygon.fill = am4core.color('#333343');

        var hsc = countryPolygon.states.create('hover');
        hsc.properties.fill = am4core.color('#42426A');

        // Set up click events
        worldPolygon.events.on('hit', function (ev) {
            ev.target.series.chart.zoomToMapObject(ev.target);
            //var coords = chart.svgPointToGeo(ev.svgPoint);
            ev.target.series.chart.zoomLevel = 10;
            ev.target.series.zoomLevel = 10;
            //ev.target.series = 10;
            var map = ev.target.dataItem.dataContext.map;
            if (map) {
                ev.target.isHover = false;

                countrySeries.geodataSource.url =
                    'https://www.amcharts.com/lib/4/geodata/json/' +
                    map +
                    '.json';
                countrySeries.geodataSource.load();
            }
        });

        // Set up data for countries
        var data = [];
        for (var id in am4geodata_data_countries2) {
            if (am4geodata_data_countries2.hasOwnProperty(id)) {
                var country = am4geodata_data_countries2[id];
                if (country.maps.length) {
                    data.push({
                        id: id,
                        map: country.maps[0]
                    });
                }
            }
        }
        worldSeries.data = data;

        // Zoom control
        chart.zoomControl = new am4maps.ZoomControl();

        var homeButton = new am4core.Button();
        homeButton.events.on('hit', function () {
            worldSeries.show();
            countrySeries.hide();
            chart.goHome();
        });

        homeButton.icon = new am4core.Sprite();
        homeButton.padding(7, 5, 7, 5);
        homeButton.width = 30;
        homeButton.icon.path =
            'M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8';
        homeButton.marginBottom = 20;
        homeButton.parent = chart.zoomControl;
        homeButton.insertBefore(chart.zoomControl.plusButton);

        // // Configure series
        countryPolygon.tooltipText = '{name}';
        countryPolygon.polygon.fillOpacity = 0.6;

        // Add image series
        var imageSeries = chart.series.push(new am4maps.MapImageSeries());
        imageSeries.mapImages.template.propertyFields.longitude = 'Longitude';
        imageSeries.mapImages.template.propertyFields.latitude = 'Latitude';
        imageSeries.mapImages.template.tooltipText =
            'Order ID: ' +
            `{OrderID}` +
            ' | Dispatched: ' +
            (`{Dispatched}` === '#N/A' ? 'NO' : `{Dispatched}`) +
            ' | Shipped: ' +
            (`{Shipped}` === '#N/A' ? 'NO' : `{Shipped}`);

        imageSeries.mapImages.template.propertyFields.url = 'url';

        var circle = imageSeries.mapImages.template.createChild(am4core.Circle);
        circle.radius = 1;
        circle.propertyFields.fill = 'color';

        var circle2 = imageSeries.mapImages.template.createChild(
            am4core.Circle
        );
        circle2.radius = 1;
        circle2.propertyFields.fill = 'color';

        circle2.events.on('inited', function (event) {
            animateBullet(event.target);
        });

        function animateBullet(circle) {
            var animation = circle.animate(
                [
                    { property: 'scale', from: 1, to: 2.5 },
                    { property: 'opacity', from: 1, to: 0 }
                ],
                1000,
                am4core.ease.circleOut
            );
            animation.events.on('animationended', function (event) {
                animateBullet(event.target.object);
            });
        }

        imageSeries.data = points;
        chart.current = chart;

        return () => {
            chart.dispose();
        };
    }, [points]);

    if (data.length === null) {
        return <div style={{ height: '100vh' }}>map component</div>;
    } else {
        return <div id="mapdiv" />;
    }
}

export default MapsComponent;
