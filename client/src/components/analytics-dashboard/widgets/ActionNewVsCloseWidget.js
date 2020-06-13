import React, { Component } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
class ActionNewVsCloseWidget extends Component {
    render() {
        const {actionNewVsClose} =this.props;
        const categories=actionNewVsClose.montes;


        const newList=[]; 
        const closeList=[]; 
        let newCounter=0;
        let closeCounter=0;
        categories.forEach(c=>{
            if(actionNewVsClose.newObject[c]){
                newCounter+=actionNewVsClose.newObject[c];
            }
            if(actionNewVsClose.closeObject[c]){
                closeCounter+=actionNewVsClose.closeObject[c];
            }

            newList.push(newCounter);
            closeList.push(closeCounter);
        });


        const options = {
            credits: {
                enabled: false
              },
            chart: {
                type: 'line',
                height:"250px"
            },
            title: {
                text: ''
            },
            xAxis: {
                categories
            },
            yAxis: {
                title: {
                    text: 'Actions'
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: false
                    },
                    enableMouseTracking: true
                }
            },
            series: [{
                name: 'New',
                data: newList
            }, {
                name: 'Completed',
                data: closeList
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
export default ActionNewVsCloseWidget;