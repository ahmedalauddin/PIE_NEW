import React, { Component } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
class DepartmentLoadWidget extends Component {
    
    render() {
        const {orgProjectStatus} =this.props;
        const deptload={};

        orgProjectStatus.filter(d=> d.department!=null).forEach(data=>{
            if(!deptload[data.department]){
                deptload[data.department]={
                    approved:0,
                    notApproved:0,
                    inProgress:0,
                    completed:0,
                    postponed:0,
                };
            }

            if(data.status=='New'){
                deptload[data.department].approved+=1
            }
            if(data.status=='Cancelled'){
                deptload[data.department].notApproved+=1
            }
            if(data.status=='In Progress'){
                deptload[data.department].inProgress+=1
            }
            if(data.status=='Completed'){
                deptload[data.department].completed+=1
            }
            
            if(data.status=='On Hold'){
                deptload[data.department].postponed+=1
            }
        })

        const categories=Object.keys(deptload);

        const notApprovedArray=[];
        const approvedArray=[];
        const inProgressArray=[];
        const completedArray=[];
        const postponedArray=[];

        categories.forEach(c=>{
            approvedArray.push(deptload[c].approved);
            notApprovedArray.push(deptload[c].notApproved);
            inProgressArray.push(deptload[c].inProgress);
            completedArray.push(deptload[c].completed);
            postponedArray.push(deptload[c].postponed);

        })

        const options = {
            credits: {
                enabled: false
              },
            chart: {
                type: 'bar',
                height:"250px",
            },
            title: {
                text: ''
            },
            xAxis: {
                categories
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Total Projects'
                }
            },
            legend: {
                reversed: false,
                align: 'right',
                verticalAlign: 'top',
                layout: 'vertical',
                enabled: false
                
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            series: [
                {
                    name: 'New',
                    data: approvedArray,
                    color:'rgb(124, 181, 236)'
                },
                {
                    name: 'Cancelled',
                    data: notApprovedArray,
                    color:'rgb(247, 163, 92)'
                },
                {
                    name: 'In Progress',
                    data: inProgressArray,
                    color:'rgb(144, 237, 125)'
                }, 
                {
                    name: 'Completed',
                    data: completedArray,
                    color: 'rgb(128, 133, 233)'
                }, 
                {
                    name: 'On Hold',
                    data: postponedArray,
                    color:'rgb(67, 67, 72)'
                    
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
export default DepartmentLoadWidget;