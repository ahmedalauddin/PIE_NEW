import React, { Component } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import drilldown from "highcharts/modules/drilldown";

drilldown(Highcharts);

class ProjectStatusWidget extends Component {

    getProgress(jsonData){
      if(!jsonData || !Array.isArray(jsonData.data)){
          return 100;
      }
      let total=0;
      let counter=0;
      jsonData.data.forEach(t=>{
        total+=t.progress; 
        counter++;      
      });
      const progress=(total/counter)*100;
      return Number(progress.toFixed(2));
    }
    render() {
        const {orgProjectStatus} =this.props;
        let newData=0;
        let cancelled=0;
        let inProgress=0;
        let completed=0;
        let postponed=0;

        const newDrilDown=[];
        const cancelledDrilDown=[];
        const inProgressDrilDown=[];
        const completedDrilDown=[];
        const postponedDrilDown=[];
        orgProjectStatus.forEach(data=>{
            if(data.status=='New'){
                newData+=1;
                newDrilDown.push([data.title, this.getProgress(data.jsonData) ])
            }else  if(data.status=='Cancelled'){
                cancelled+=1;
                cancelledDrilDown.push([data.title, this.getProgress(data.jsonData) ])
            }else  if(data.status=='In Progress'){
                inProgress+=1;
                inProgressDrilDown.push([data.title, this.getProgress(data.jsonData) ])
            }else  if(data.status=='Completed'){
                completed+=1;
                completedDrilDown.push([data.title, this.getProgress(data.jsonData) ])
            }else  if(data.status=='On Hold'){
                postponed+=1;
                postponedDrilDown.push([data.title, this.getProgress(data.jsonData) ])
            }
        })


        const drilldown = {
            series: [
                {
                    name: "New",
                    id: "New",
                    data: newDrilDown
                }, {
                    name: "Cancelled",
                    id: "Cancelled",
                    data: cancelledDrilDown
                }, {
                    name: "In Progress",
                    id: "In Progress",
                    data: inProgressDrilDown
                }, {
                    name: "Completed",
                    id: "Completed",
                    data: completedDrilDown
                }, {
                    name: "On Hold",
                    id: "On Hold",
                    data: postponedDrilDown
                }
            ]
        }
        const series =[{
            name: 'Project Status',
            data: [
                {
                    name:'New',
                    y:newData,
                    color:'rgb(124, 181, 236)',
                    drilldown: 'New'
                },
                {
                    name:'Cancelled',
                    y:cancelled,
                    color:'rgb(247, 163, 92)',
                    drilldown: 'Cancelled'
                },
                {
                    name:'In Progress',
                    y:inProgress,
                    color:'rgb(144, 237, 125)',
                    drilldown: 'In Progress'
                },
                {
                    name:'Completed',
                    y:completed,
                    color: 'rgb(128, 133, 233)',
                    drilldown: 'Completed'
                },
                {
                    name:'On Hold',
                    y:postponed,
                    color:'rgb(67, 67, 72)',
                    drilldown: 'On Hold'
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
          
            title: {
                // text: 'Project Status',
                text: ''
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
            series,
            drilldown,
            chart:{
                type: 'column',
                height:"250px",
            }
        }

       
        return (
            <div className="line-series" >
                <HighchartsReact
                    
                    highcharts={Highcharts}
                    options={options} />
            </div>
        );
    }
}
export default ProjectStatusWidget;