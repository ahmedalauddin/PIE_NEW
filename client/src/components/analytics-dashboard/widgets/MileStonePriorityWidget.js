import React, { Component } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import variablePie from "highcharts/modules/variable-pie.js";
import drilldown from "highcharts/modules/drilldown";
variablePie(Highcharts);
drilldown(Highcharts)
class MileStonePriorityWidget extends Component {

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
        const {orgProjectStatus} = this.props;

        
       

        const orgProjectMilstoneStatus={};

        
        orgProjectStatus && orgProjectStatus.forEach(p => {
            p.jsonData && p.jsonData.data.forEach(t=>{
                    
                   const priority=['1','2','3'].indexOf(t.priority)>-1?t.priority:'3';
                    
                    if(!orgProjectMilstoneStatus[priority]){
                        orgProjectMilstoneStatus[priority]={};
                        orgProjectMilstoneStatus[priority].projects=[];
                        orgProjectMilstoneStatus[priority].projectsAdded=[];
                        orgProjectMilstoneStatus[priority].total=1;
                        orgProjectMilstoneStatus[priority].projectsAdded.push(p.title);
                        orgProjectMilstoneStatus[priority].projects.push({
                            name: p.title,
                            y: this.getProgress(p.jsonData)
                        })
                    }else{
                        orgProjectMilstoneStatus[priority].total=1+orgProjectMilstoneStatus[priority].total;
                        if(orgProjectMilstoneStatus[priority].projectsAdded.indexOf(p.title)===-1){
                            orgProjectMilstoneStatus[priority].projectsAdded.push(p.title);
                            orgProjectMilstoneStatus[priority].projects.push({
                                name: p.title,
                                y: this.getProgress(p.jsonData)
                            })
                        }
                    }  

                    
              });
        });
        const  dataFormat= {"1":{
                    name: 'High',
                    y:  orgProjectMilstoneStatus["1"] && orgProjectMilstoneStatus["1"].total,
                    color:'rgb(124, 181, 236)'
                },"2": {
                    name: 'Normal',
                    y: orgProjectMilstoneStatus["2"] && orgProjectMilstoneStatus["2"].total,
                    color:'rgb(144, 237, 125)'
                },"3": {
                    name: 'Low',
                    y: orgProjectMilstoneStatus["3"] && orgProjectMilstoneStatus["3"].total,
                    color: 'rgb(128, 133, 233)'
                }}
                const drilldownSeries=[];
                const data=[];

                console.log("orgProjectMilstoneStatus",orgProjectMilstoneStatus,dataFormat)
                Object.keys(orgProjectMilstoneStatus).forEach(p=>{
                    data.push({
                        name: dataFormat[p].name,
                        y: orgProjectMilstoneStatus[p].total,
                        color:dataFormat[p].color,
                        drilldown: p
                    });
                    drilldownSeries.push({
                        name: p,
                        id: p,
                        data:orgProjectMilstoneStatus[p].projects
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
                name: 'Milstones',
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
export default MileStonePriorityWidget;