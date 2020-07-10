import React, { Component } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import variablePie from "highcharts/modules/variable-pie.js";
import drilldown from "highcharts/modules/drilldown";
variablePie(Highcharts);
drilldown(Highcharts)
class ActionWidget extends Component {

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
        const { orgProjectActionStatus } = this.props;


        const projectActionStatusData={};

        
        orgProjectActionStatus && orgProjectActionStatus.forEach(p => {
            const status=p.status;
            
            if(!projectActionStatusData[status]){
                projectActionStatusData[status]={};
                projectActionStatusData[status].projects=[];
                projectActionStatusData[status].projectsAdded=[];
                projectActionStatusData[status].total=1;
                projectActionStatusData[status].projectsAdded.push(p.title);
                projectActionStatusData[status].projects.push({
                    name: p.title,
                    y: this.getProgress(p.jsonData)
                })
            }else{
                projectActionStatusData[status].total=1+projectActionStatusData[status].total;
                if(projectActionStatusData[status].projectsAdded.indexOf(p.title)===-1){
                    projectActionStatusData[status].projectsAdded.push(p.title);
                    projectActionStatusData[status].projects.push({
                        name: p.title,
                        y: this.getProgress(p.jsonData)
                    })
                }
            }
        });


    
        const  dataFormat= {'New':{
                    name: 'New',
                    color:'rgb(124, 181, 236)'
                }, 'In Progress':{
                    name: 'In Progress',
                    color:'rgb(144, 237, 125)'
                }, 'Completed':{
                    name: 'Completed',
                    color: 'rgb(128, 133, 233)'
                }, 'On Hold':{
                    name: 'On Hold',
                    color: 'rgb(67, 67, 72)'
                }, 'Cancelled':{
                    name: 'Cancelled',
                    color: 'rgb(247, 163, 92)'
                }}


                const drilldownSeries=[];
                const data=[];

                Object.keys(projectActionStatusData).forEach(p=>{
                    data.push({
                        name: dataFormat[p].name,
                        y: projectActionStatusData[p].total,
                        color:dataFormat[p].color,
                        drilldown: p
                    });
                    drilldownSeries.push({
                        name: p,
                        id: p,
                        data:projectActionStatusData[p].projects
                    }) 
                })

                const drilldown={
                    series: drilldownSeries
                }
        const options = {
            credits: {
                enabled: false
              },
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                height:"250px"
            },
            title: {
                text: ''
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
            }],
            drilldown
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