import React, { Component } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import variablePie from "highcharts/modules/variable-pie.js";

variablePie(Highcharts);
const slices={
    '0%': 205370,
    '10%': 255370,
    '20%': 305370,
    '30%': 352685,
    '40%': 402685,
    '50%': 502685,
    '60%': 602685,
    '70%': 702685,
    '80%': 901500,
    '90%': 1001500,
    '100%':1301500
}
class MileStoneWidget extends Component {
    render() {
        const {orgProjectMilstoneStatus} = this.props;
        console.log(orgProjectMilstoneStatus);
        const  data=[]; /*[{
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
                    }]*/

        
        Object.keys(orgProjectMilstoneStatus).forEach(p=>{
            data.push({
                name: p,
                y: orgProjectMilstoneStatus[p],
                z: slices[p]
            }); 
        })
        const options = {
            chart: {
                type: 'variablepie'
            },
            title: {
                text: 'Milstones Status'
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
                             'Total Milstones: <b>{point.y}</b><br/>'
            },
            series: [{
                minPointSize: 10,
                innerSize: '30%',
                zMin: 0,
                name: 'milestones',
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
export default MileStoneWidget;