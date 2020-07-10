import React, { Component } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import variablePie from "highcharts/modules/variable-pie.js";
import drilldown from "highcharts/modules/drilldown";

variablePie(Highcharts);
drilldown(Highcharts)
const slices={
    '0%': 352685,
    '10%': 352685,
    '20%': 352685,
    '30%': 352685,
    '40%': 402685,
    '50%': 502685,
    '60%': 502685,
    '70%': 502685,
    '80%': 502685,
    '90%': 602685,
    '100%':602685
}
class MileStoneWidget extends Component {

    progressTxt(progress){
        const progressToken=(progress+"").split(".");
         if(progressToken[0] && progressToken[0]==1){
           return "100%";
         }else if(progressToken[1] && progressToken[1].substring(0,1)>0){
           return progressToken[1].substring(0,1)+"0%";
         }
         return "0%";
      }
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

        const  data=[];

        
        orgProjectStatus && orgProjectStatus.forEach(p => {
            p.jsonData && p.jsonData.data.forEach(t=>{
                const progressKey= this.progressTxt(t.progress);
                    if(!orgProjectMilstoneStatus[progressKey]){
                        orgProjectMilstoneStatus[progressKey]={};
                        orgProjectMilstoneStatus[progressKey].projects=[];
                        orgProjectMilstoneStatus[progressKey].projectsAdded=[];
                        orgProjectMilstoneStatus[progressKey].total=1;
                        orgProjectMilstoneStatus[progressKey].projectsAdded.push(p.title);
                        orgProjectMilstoneStatus[progressKey].projects.push({
                            name: p.title,
                            y: this.getProgress(p.jsonData),
                            z: slices[progressKey]
                        })
                    }else{
                        orgProjectMilstoneStatus[progressKey].total=1+orgProjectMilstoneStatus[progressKey].total;
                        if(orgProjectMilstoneStatus[progressKey].projectsAdded.indexOf(p.title)===-1){
                            orgProjectMilstoneStatus[progressKey].projectsAdded.push(p.title);
                            orgProjectMilstoneStatus[progressKey].projects.push({
                                name: p.title,
                                y: this.getProgress(p.jsonData),
                                z: slices[progressKey]
                            })
                        }
                    }  

                    
              });
        });

        const drilldownSeries=[];

        Object.keys(orgProjectMilstoneStatus).forEach(p=>{
            data.push({
                name: p,
                y: orgProjectMilstoneStatus[p].total,
                z: slices[p],
                drilldown: p
            });
            drilldownSeries.push({
                name: p,
                id: p,
                minPointSize: 10,
                innerSize: '30%',
                zMin: 0,
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
                type: 'variablepie',
                height:"250px"
            },
            title: {
                text: ''
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
                data:data
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
export default MileStoneWidget;