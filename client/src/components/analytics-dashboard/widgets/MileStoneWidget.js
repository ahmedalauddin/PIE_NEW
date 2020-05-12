import React, { Component } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import variablePie from "highcharts/modules/variable-pie.js";

variablePie(Highcharts);

class MileStoneWidget extends Component {
    render() {
        const options = {
            chart: {
                type: 'variablepie'
            },
            title: {
                text: 'Milstones'
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
                    'Project: <b>Project Name</b><br/>' +
                    'Progress: <b>{point.z}</b><br/>'
            },
            series: [{
                minPointSize: 10,
                innerSize: '20%',
                zMin: 0,
                name: 'milestones',
                data: [{
                    name: 'APM Benefit',
                    y: 505370,
                    z: 90
                }, {
                    name: 'Predictive Analytics',
                    y: 551500,
                    z: 50
                }, {
                    name: 'Consolidate and Automate Asset Reporting',
                    y: 312685,
                    z: 80
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
export default MileStoneWidget;