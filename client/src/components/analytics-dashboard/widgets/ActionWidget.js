import React, { Component } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import variablePie from "highcharts/modules/variable-pie.js";

variablePie(Highcharts);

class ActionWidget extends Component {
    render() {
        const { orgProjectActionStatus } = this.props;
        let newActions=0;
        let openActions=0;
        let closeActions=0;
        let cancelledActions=0;
        let onHoldActions=0;
        orgProjectActionStatus.forEach(a=>{
            if(a.status=="New"){
                newActions=a.total;

            }else if(a.status=="In Progress"){
                openActions=a.total;

            }else if(a.status=="Completed"){
                closeActions=a.total;
            }
            else if(a.status=="On Hold"){
                onHoldActions=a.total;
            }
            else if(a.status=="Cancelled"){
                cancelledActions=a.total;
            }
        })
        const  data= [{
                    name: 'New',
                    y: newActions,
                    color:'rgb(124, 181, 236)'
                }, {
                    name: 'In Progress',
                    y: openActions,
                    color:'rgb(144, 237, 125)'
                }, {
                    name: 'Completed',
                    y: closeActions,
                    color: 'rgb(128, 133, 233)'
                }, {
                    name: 'On Hold',
                    y: closeActions,
                    color: 'rgb(67, 67, 72)'
                }, {
                    name: 'Cancelled',
                    y: closeActions,
                    color: 'rgb(247, 163, 92)'
                }]
        const options = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Actions Status'
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
                name: 'Actions',
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
export default ActionWidget;