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
            if(data.status=='New'){
                approved+=data.total
            }else  if(data.status=='Cancelled'){
                notApproved+=data.total
            }else  if(data.status=='In Progress'){
                inProgress+=data.total
            }else  if(data.status=='Completed'){
                completed+=data.total
            }else  if(data.status=='On Hold'){
                postponed+=data.total
            }
        })


        const series =[{
            name: 'Project Status',
            data: [
                {
                    name:'New',
                    y:approved,
                    color:'rgb(124, 181, 236)'
                },
                {
                    name:'Cancelled',
                    y:notApproved,
                    color:'rgb(247, 163, 92)'
                },
                {
                    name:'In Progress',
                    y:inProgress,
                    color:'rgb(144, 237, 125)'
                },
                {
                    name:'Completed',
                    y:completed,
                    color: 'rgb(128, 133, 233)'
                },
                {
                    name:'On Hold',
                    y:postponed,
                    color:'rgb(67, 67, 72)'
                }                
            ],
            dataLabels: {
                enabled: false,
            }
        }]

        const options = {
            credits: {
                enabled: false
              },
            chart: {
                type: 'column'
            },
            title: {
                text: 'Project Status'
            },
            xAxis: {
                type: 'category',
                labels: {
                    rotation: -20,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
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
                headerFormat: '<b>{point.key}</b>: ',
                pointFormat: '{point.stackTotal}'
            },
            legend:{
                enabled: false
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series
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