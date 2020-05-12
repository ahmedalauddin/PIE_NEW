import React, { Component } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
class ProjectStatusWidget extends Component {
    render() {
        const {orgProjectStatus} =this.props;
        let approved=0;
        let notApproved=0;
        let inProgress=0;
        let completed=0;
        let postponed=0;

        orgProjectStatus.forEach(data=>{
            if(data.status=='Approved'){
                approved+=data.total
            }else  if(data.status=='Not Approved'){
                notApproved+=data.total
            }else  if(data.status=='In Progress'){
                inProgress+=data.total
            }else  if(data.status=='Completed'){
                completed+=data.total
            }else  if(data.status=='Postponed'){
                postponed+=data.total
            }
        })

        const options = {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Project Status'
            },
            xAxis: {
                categories: ['Approved', 'Not Approved', 'In Progress','Completed','Postponed']
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: ( // theme
                            Highcharts.defaultOptions.title.style &&
                            Highcharts.defaultOptions.title.style.color
                        ) || 'gray'
                    }
                }
            },
           
            tooltip: {
                headerFormat: '<b>{point.x}</b>: ',
                pointFormat: '{point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [{
                name: 'Approved',
                data: [approved, 0, 0, 0, 0]
            }, {
                name: 'Not Approved',
                data: [0, notApproved, 0, 0, 0 ]
            }, {
                name: 'In Progress',
                data: [0, 0, inProgress, 0, 0 ]
            }, {
                name: 'Completed',
                data: [0, 0, 0, completed, 0 ]
            }, {
                name: 'Postponed',
                data: [0, 0, 0, 0, postponed ]
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
export default ProjectStatusWidget;