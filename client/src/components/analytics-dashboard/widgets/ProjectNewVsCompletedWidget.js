import React, { Component } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
class ProjectNewVsCompletedWidget extends Component {
    render() {
        const {orgProjectStatus} =this.props;

        const options = {
            chart: {
                type: 'line'
            },
            title: {
                text: 'New Vs Closed'
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {
                title: {
                    text: 'Milestones'
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: false
                }
            },
            series: [{
                name: 'New',
                data: [7, 6, 9, 14, 18, 21, 25, 26, 23, 18, 13, 9]
            }, {
                name: 'Closed',
                data: [3, 4, 5, 8, 11, 15, 17, 16, 14, 10, 6, 4]
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
export default ProjectNewVsCompletedWidget;