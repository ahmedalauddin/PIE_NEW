import React, { Component } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import variablePie from "highcharts/modules/variable-pie.js";

variablePie(Highcharts);

class ActionWidget extends Component {
    render() {
        const options = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'All Actions'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    }
                }
            },
            series: [{
                name: 'Brands',
                colorByPoint: true,
                data: [{
                    name: 'Action 1',
                    y: 61.41
                }, {
                    name: 'Action 2',
                    y: 11.84
                }, {
                    name: 'Action 3',
                    y: 10.85
                }, {
                    name: 'Action 4',
                    y: 4.67
                }, {
                    name: 'Action 5',
                    y: 4.18
                }]
            }]
        }
        return (
            <div className="line-series">
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options} />
            </div>
        );
    }
}
export default ActionWidget;