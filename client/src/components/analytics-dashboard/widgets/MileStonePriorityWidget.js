import React, { Component } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import variablePie from "highcharts/modules/variable-pie.js";

variablePie(Highcharts);

class MileStonePriorityWidget extends Component {
    render() {
        const { orgProjectMilstonePriority } = this.props;
        let high=orgProjectMilstonePriority['1'];
        let normal=orgProjectMilstonePriority['2'];
        let low=orgProjectMilstonePriority['3'];
       
        const  data= [{
                    name: 'High',
                    y: high,
                    color:'rgb(124, 181, 236)'
                }, {
                    name: 'Normal',
                    y: normal,
                    color:'rgb(144, 237, 125)'
                }, {
                    name: 'Low',
                    y: low,
                    color: 'rgb(128, 133, 233)'
                }]
        const options = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Priority wise Milestones'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y:.1f}</b>'
            },
          
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.y}'
                    }
                }
            },
            series: [{
                name: 'Milstones',
                colorByPoint: true,
                data
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
export default MileStonePriorityWidget;