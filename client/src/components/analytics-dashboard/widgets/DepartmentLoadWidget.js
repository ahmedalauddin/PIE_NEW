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

            if(data.status=='Approved'){
                deptload[data.department].approved+=data.total
            }
            if(data.status=='Not Approved'){
                deptload[data.department].notApproved+=data.total
            }
            if(data.status=='In Progress'){
                deptload[data.department].inProgress+=data.total
            }
            if(data.status=='Completed'){
                deptload[data.department].completed+=data.total
            }
            
            if(data.status=='Postponed'){
                deptload[data.department].postponed+=data.total
            }
        })

        console.log(deptload);
        const categories=Object.keys(deptload);

        const notApprovedArray=[];
        const approvedArray=[];
        const inProgressArray=[];
        const completedArray=[];
        const postponedArray=[];

        categories.forEach(c=>{
            notApprovedArray.push(deptload[c].notApproved);
            approvedArray.push(deptload[c].approved);
            inProgressArray.push(deptload[c].inProgress);
            completedArray.push(deptload[c].completed);
            postponedArray.push(deptload[c].postponed);

        })

        const options = {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Department Load'
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
                reversed: true
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            series: [
                {
                    name: 'Not Approved',
                    data: notApprovedArray,
                    color:'rgb(247, 163, 92)'
                },
                {
                    name: 'Approved',
                    data: approvedArray,
                    color:'rgb(124, 181, 236)'
                },
                {
                    name: 'Inprogress',
                    data: inProgressArray,
                    color:'rgb(144, 237, 125)'
                }, 
                {
                    name: 'Completed',
                    data: completedArray,
                    color: 'rgb(128, 133, 233)'
                }, 
                {
                    name: 'Postponed',
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