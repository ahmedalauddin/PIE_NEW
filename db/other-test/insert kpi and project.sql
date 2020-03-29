/**
 * Project:  valueinfinity-mvp
 * File:     /db/insert kpi and project.sql
 * Created:  2019-09-02
 * Descr:    Stored procedure to insert a kpi and then insert a project with it.
 * Author:   Brad Kaufman
 * -----
 * Modified:
 * Changes:
 */
 create definer = viadmin@`%` procedure mvp2.insert_kpi_with_project(IN p_org_id int, IN p_kpi_title varchar(100), IN p_kpi_descr varchar(300),
        IN p_mindmap_node_id varchar(30), IN p_proj_title varchar(100), IN p_proj_descr varchar(300))
BEGIN
    set @kpiId = 0;

    insert into Kpis (orgId, title, description, mindmapNodeId)
    values (p_org_id, p_kpi_title, p_kpi_descr, p_mindmap_node_id);
    -- insert into Kpis (orgId, title, description, mindmapNodeId, active, projectId, formulaDescription)
    -- values (orgId, title, description, mindmapNodeId, active, projectId, formulaDescription);

    -- Get the inserted value for the new kpi ID.
    set @kpiId = LAST_INSERT_ID();
    SELECT concat('kpi id = ', @kpiId);

    insert into Projects (orgId, title, description, mainKpiId)
    values (p_org_id, p_proj_title, p_proj_descr, @kpiId);

END;
