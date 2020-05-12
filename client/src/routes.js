// Main routes component for react Router..
import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import HighlightDashboard from "./components/dashboard/HighlightDashboard";
import OrgDashboard from "./components/organization/OrgDashboard";
import Cards from "./components/cards/Cards";
import ScrollToTop from "./components/ScrollTop";
import EditPerson from "./components/person/EditPerson";
import ListPersons from "./components/person/ListPersons";
import ListActions from "./components/actions/ListActions";
import ListKpis from "./components/kpi/ListKpis";
import ListOrgs from "./components/organization/ListOrgs";
import Main from "./components/Main";
import Signup from "./components/auth/Signup";
import ChangePassword from "./components/auth/ChangePassword";
import RestPassword from "./components/auth/RestPassword";
import Logout from "./components/auth/Logout";
import Login from "./components/auth/Login";
import UserInfo from "./components/person/UserInfo";
import ClientOrg from "./components/organization/ClientOrg";
import ProjectPersons from "./components/project/ProjectPersons";
import Project from "./components/project/Project";
import NewProject from "./components/project/NewProject";
import Action from "./components/actions/Action";
import ProjectDashboard from "./components/dashboard/ProjectDashboard";
import PanelDashboard from "./components/dashboard/PanelDashboard";
import About from "./components/about/About";
import Organization from "./components/organization/Organization";
import Person from "./components/person/Person";
import Kpi from "./components/kpi/Kpi";
import Milestone from "./components/milestone/Milestone";
import Analytics from "./components/analytics/Analytics";
import withAuth from "./components/withAuth.jsx";
import ListDepartments from "./components/department/ListDepartments";
import Department from "./components/department/Department";
import MindMap from "./components/d3-mindmap/MindMap";
import MindMapList from "./components/d3-mindmap/MindmapList";
import Search from "./components/search/Search";
import Gantt from "./components/gantt/Gantt";
import KpiSearch from "./components/kpi/KpiSearch";
import ProjectAction from "./components/project/ProjectAction";
import ProjectDocument from "./components/project/ProjectDocument";
import ProjectDocumentUpdate from "./components/project/ProjectDocumentUpdate";
import OrganizationAction from "./components/organization/OrganizationAction";


import OrganizationDocument from "./components/dashboard/OrganizationDocument";
import OrganizationDocumentUpdate from "./components/dashboard/OrganizationDocumentUpdate";
import OrganizationActionTable from "./components/dashboard/OrganizationActionTable";
import ProjectComment from "./components/project/ProjectComment";
import RoleManagment from "./components/role/RoleManagment";
import AnalyticsDashboard from "./components/analytics-dashboard/AnalyticsDashboard";

export default props => (
  <BrowserRouter>
    <ScrollToTop>
      <Switch>
        <Route exact path="/dashboard" component={withAuth(ProjectDashboard)} />
        <Route exact path="/analytics-dashboard" component={withAuth(AnalyticsDashboard)} />
        <Route exact path="/paneldashboard" component={withAuth(PanelDashboard)} />
        <Route exact path="/orgdashboard" component={withAuth(OrgDashboard)} />
        <Route exact path="/highlight" component={withAuth(HighlightDashboard)} />
        <Route exact path="/logout" component={Logout} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/mindmap" component={MindMap} />
        <Route exact path="/resetpassword" component={RestPassword} />
        <Route exact path="/password" component={withAuth(ChangePassword)} />
        <Route exact path="/search" component={withAuth(Search)} />
        <Route exact path="/gantt" component={Gantt} />
        <Route exact path="/about" component={About} />
        <Route exact path="/" component={Login} />
        <Route exact path="/userinfo" component={UserInfo} />
        <Route exact path="/clientorg" component={withAuth(ClientOrg)} />
        <Route exact path="/analytics" component={withAuth(Analytics)} />
        <Route exact path="/project" component={withAuth(Project)} />
        <Route exact path="/department" component={withAuth(Department)} />
        <Route path="/mindmap/:id" component={withAuth(MindMap)} />
        <Route path="/project/:id" component={withAuth(Project)} />
        <Route path="/projectpersons/:id" component={withAuth(ProjectPersons)} />
        <Route path="/organization/:id" component={withAuth(Organization)} />
        <Route path="/organization" component={withAuth(Organization)} />
        <Route path="/editperson/:id" component={withAuth(EditPerson)} />
        <Route path="/listkpis/:id" component={withAuth(ListKpis)} />
        <Route path="/listdepartments/:id" component={withAuth(ListDepartments)} />
        <Route path="/department/:id" component={withAuth(Department)} />
        <Route path="/listactions/:id" component={withAuth(ListActions)} />
        <Route exact path="/projectdashboard" component={withAuth(ProjectDashboard)} />
        <Route exact path="/newproject" component={withAuth(NewProject)} />
        <Route exact path="/person/:id" component={withAuth(Person)} />
        <Route exact path="/person" component={withAuth(Person)} />
        <Route exact path="/kpi/:id" component={withAuth(Kpi)} />
        <Route exact path="/kpi" component={withAuth(Kpi)} />
        <Route exact path="/kpisearch" component={withAuth(KpiSearch)} />
        <Route exact path="/milestone" component={withAuth(Milestone)} />
        <Route exact path="/action/:id" component={withAuth(Action)} />
        <Route exact path="/action" component={withAuth(Action)} />
        <Route exact path="/mindmaplist" component={withAuth(MindMapList)} />
        <Route exact path="/listpersons" component={withAuth(ListPersons)} />
        <Route exact path="/listkpis" component={withAuth(ListKpis)} />
        <Route exact path="/listorgs" component={withAuth(ListOrgs)} />
        <Route exact path="/cards" component={Cards} />
        <Route exact path="/ProjectAction/:id" component={withAuth(ProjectAction)} />
        <Route exact path="/ProjectAction" component={withAuth(ProjectAction)} />
        <Route exact path="/ProjectDocument" component={withAuth(ProjectDocument)} />
        <Route exact path="/ProjectDocumentUpdate" component={withAuth(ProjectDocumentUpdate)} />

        <Route exact path="/OrganizationDocument" component={withAuth(OrganizationDocument)} />
        <Route exact path="/OrganizationDocumentUpdate" component={withAuth(OrganizationDocumentUpdate)} />

        
        <Route exact path="/organizationactions" component={withAuth(OrganizationActionTable)} />
        <Route exact path="/OrganizationAction/:id" component={withAuth(OrganizationAction)} />
        <Route exact path="/OrganizationAction" component={withAuth(OrganizationAction)} />

        <Route exact path="/ProjectComment" component={withAuth(ProjectComment)} />

        <Route exact path="/rolemgt" component={withAuth(RoleManagment)} />
      </Switch>
    </ScrollToTop>
  </BrowserRouter>
);
