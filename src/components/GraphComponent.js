import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_dark from '@amcharts/amcharts4/themes/dark';
am4core.useTheme(am4themes_dark);
am4core.useTheme(am4themes_animated);

const GraphComponent = ({ data }) => {
    const [packages, setPackage] = useState([]);
    const [colors, setColors] = useState([]);
    const [points, setPoints] = useState([]);
    const chart = useRef(null);
    const temp = [];

    useEffect(() => {
        var arr = [];

        for (var i = 0; i < data.length; ++i) {
            var json_data = {
                OderID: data[i].gsx$orderid.$t,
                TimeTaken: data[i].gsx$timetaken.$t,
                Priority: data[i].gsx$priority.$t
            };
            arr.push(json_data);
            setPackage(arr);
        }
    }, [data]);

    useEffect(() => {
        if (JSON.stringify(points) !== JSON.stringify(packages)) {
            setPoints(packages);
            //console.log('not same');
        }
        const bar_color = [];
        var color;
        for (var j in packages) {
            if (packages[j].Priority === 'HP') {
                color = '#ef476f';
            } else if (packages[j].Priority === 'MP') {
                color = '#ffd166';
            } else if (packages[j].Priority === 'LP') {
                color = '#06d6a0';
            }
            bar_color.push(color);
            setColors(bar_color);
        }
    }, [packages]);

    useLayoutEffect(() => {
        var x = am4core.create('chartdiv', am4charts.XYChart);
        x.scrollbarX = new am4core.Scrollbar();
        x.scrollbarX.paddingRight = 10;
        x.scrollbarX.height = 3;
        x.scrollbarX.marginBottom = 30;
        x.scrollbarX.startGrip.icon.disabled = true;
        x.scrollbarX.endGrip.icon.disabled = true;
        x.data = points;

        var categoryAxis = x.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = 'OderID';
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.renderer.labels.template.horizontalCenter = 'right';
        categoryAxis.renderer.labels.template.verticalCenter = 'middle';
        categoryAxis.renderer.labels.template.rotation = 270;
        categoryAxis.tooltip.disabled = true;
        categoryAxis.renderer.minHeight = 100;

        var valueAxis = x.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.minWidth = 50;

        var series = x.series.push(new am4charts.ColumnSeries());
        series.sequencedInterpolation = true;
        series.dataFields.valueY = 'TimeTaken';
        series.dataFields.categoryX = 'OderID';
        // series.dataFields.categoryX.fontcolor = '#fff';

        series.tooltipText = '[{categoryX}: bold]{valueY}[/]';
        series.columns.template.strokeWidth = 0;

        series.tooltip.pointerOrientation = 'vertical';
        series.columns.template.column.cornerRadiusTopLeft = 10;
        series.columns.template.column.cornerRadiusTopRight = 10;
        series.columns.template.column.fillOpacity = 0.8;

        // on hover, make corner radiuses bigger
        var hoverState = series.columns.template.column.states.create('hover');
        hoverState.properties.cornerRadiusTopLeft = 0;
        hoverState.properties.cornerRadiusTopRight = 0;
        hoverState.properties.fillOpacity = 1;

        series.columns.template.adapter.add('fill', function (fill, target) {
            return am4core.color(colors[target.dataItem.index]); //x.colors.getIndex(target.dataItem.index);
        });
        x.cursor = new am4charts.XYCursor();
        chart.current = x;

        return () => {
            x.dispose();
        };
    }, [points]);

    if (data.length === null) return <div>Loading</div>;
    else {
        return (
            <div
                className="GraphContainer"
                style={{
                    height: '45vh'
                }}
                id="chartdiv"
            ></div>
        );
    }
};
export default GraphComponent;
