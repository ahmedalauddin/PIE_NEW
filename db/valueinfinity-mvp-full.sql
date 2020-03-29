create schema if not exists mvp2 collate utf8mb4_0900_ai_ci;

create table if not exists KpiTags
(
	kpiId int not null,
	tag varchar(60) not null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	primary key (kpiId, tag)
);

create index kpiId
	on KpiTags (kpiId);

create table if not exists Organizations
(
	id int auto_increment
		primary key,
	name varchar(255) not null,
	owningOrg tinyint(1) default 0 null,
	lockPrioritization tinyint(1) default 0 null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP
);

create table if not exists DataSources
(
	id int auto_increment
		primary key,
	orgId int not null,
	title varchar(255) not null,
	description varchar(255) null,
	sourceFile varchar(512) null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	constraint DataSources_ibfk_1
		foreign key (orgId) references Organizations (id)
			on delete cascade
);

create index DataSources_organization_ind
	on DataSources (orgId);

create index DataSources_title_ind
	on DataSources (title);

create table if not exists Departments
(
	id int auto_increment
		primary key,
	name varchar(100) null,
	description varchar(255) null,
	orgId int null,
	createdAt datetime null,
	updatedAt timestamp not null on update CURRENT_TIMESTAMP,
	disabled tinyint(1) default 0 null,
	disabledAt datetime null,
	constraint Departments_Organizations_id_fk
		foreign key (orgId) references Organizations (id)
			on delete cascade
)
comment 'Organization departments';

create fulltext index name
	on Departments (name, description);

create table if not exists Ideas
(
	id int auto_increment
		primary key,
	name varchar(255) null,
	ideaText text null,
	nodeId varchar(20) null,
	orgId int not null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	constraint Ideas_Organizations_id_fk
		foreign key (orgId) references Organizations (id)
);

create table if not exists Kpis
(
	id int auto_increment
		primary key,
	orgId int not null,
	deptId int null,
	title varchar(255) not null,
	description varchar(255) null,
	level int null,
	mindmapNodeId varchar(20) null,
	type varchar(255) null,
	orgPriority int null,
	status varchar(255) null,
	active tinyint default 1 null,
	projectId int null,
	formulaDescription varchar(255) null,
	departmentId int null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	constraint Kpis_Departments_id_fk
		foreign key (deptId) references Departments (id),
	constraint Kpis_ibfk_1
		foreign key (orgId) references Organizations (id)
			on delete cascade
);

create index Kpis_Organizations_ind
	on Kpis (orgId);

create index kpis_title_ind
	on Kpis (title);

create fulltext index title
	on Kpis (title, description, formulaDescription, type);

create definer = viadmin@`%` trigger trg_ins_kpis
	after insert
	on Kpis
	for each row
	begin
            declare thetitle varchar(100);
            select title from Projects where id = NEW.projectId into thetitle;
            insert into SearchData (orgId, foreignId, title, description, project, source)
            values (NEW.orgId, NEW.id, NEW.title, NEW.description, thetitle, 'Kpis');
        end;

create definer = viadmin@`%` trigger trg_upd_kpis
	after update
	on Kpis
	for each row
	begin
            declare thetitle varchar(100);
            select title from Projects where id = NEW.projectId into thetitle;
            insert into SearchData (orgId, foreignId, title, description, project, source)
            values (NEW.orgId, NEW.id, NEW.title, NEW.description, thetitle, 'Kpis')
            on duplicate key update
                title = NEW.title,
                description = NEW.description,
                project = thetitle;
        end;

create table if not exists Mindmaps
(
	id int auto_increment
		primary key,
	orgId int not null,
	mapData json null comment 'JSON data representing the nodes of the mind map.',
	mapName varchar(200) null comment 'Descriptive name for the map we can display when a user selects from the mind maps for their org.',
	mapDescription varchar(500) null comment 'Description of the mind map.',
	active tinyint default 1 null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	constraint Mindmaps_ibfk_1
		foreign key (orgId) references Organizations (id)
			on delete cascade
);

create index Mindmaps_Organizations_ind
	on Mindmaps (orgId);

create fulltext index mapName_mapDescription
	on Mindmaps (mapName, mapDescription);

create fulltext index name
	on Organizations (name);

create table if not exists Persons
(
	id int auto_increment
		primary key,
	orgId int not null,
	firstName varchar(128) null,
	lastName varchar(128) null,
	username varchar(255) null,
	allowLogin tinyint(1) default 0 null,
	email varchar(255) not null,
	deptId int null,
	role varchar(50) null,
	pwdhash varchar(255) not null,
	disabled tinyint(1) default 0 null,
	lastLogin datetime null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	disabledAt datetime null,
	fullName varchar(255) as (concat(`lastName`,_utf8mb4', ',`firstName`)),
	constraint persons_email
		unique (email),
	constraint Persons_Departments_id_fk
		foreign key (deptId) references Departments (id),
	constraint Persons_ibfk_1
		foreign key (orgId) references Organizations (id)
			on delete cascade
);

create table if not exists OrganizationPersons
(
	id int auto_increment,
	organizationId int not null,
	personId int not null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	constraint id
		unique (id),
	constraint organizationId_personId
		unique (organizationId, personId),
	constraint OrganizationPersons_ibfk_1
		foreign key (organizationId) references Organizations (id)
			on delete cascade,
	constraint OrganizationPersons_ibfk_2
		foreign key (personId) references Persons (id)
			on delete cascade
);

create index personId
	on OrganizationPersons (personId);

alter table OrganizationPersons
	add primary key (organizationId, personId);

create index Persons_Organizations_ind
	on Persons (orgId);

create index Persons_login_ind
	on Persons (email, pwdhash, disabled);

create fulltext index firstName_lastName_username_email_role
	on Persons (firstName, lastName, username, email, role);

create definer = viadmin@`%` trigger trg_ins_persons
	after insert
	on Persons
	for each row
	begin
            insert into SearchData (orgId, foreignId, title, description, project, source)
            values (NEW.orgId, NEW.id, NEW.fullName, NEW.email, '', 'Persons')
            on duplicate key update
                title = NEW.fullName,
                description = NEW.email;
        end;

create definer = viadmin@`%` trigger trg_upd_persons
	after update
	on Persons
	for each row
	begin
            insert into SearchData (orgId, foreignId, title, description, project, source)
            values (NEW.orgId, NEW.id, NEW.fullName, NEW.email, '', 'Persons')
            on duplicate key update
                title = NEW.fullName,
                description = NEW.email;
        end;

create table if not exists ProjectStatuses
(
	id int not null
		primary key,
	label varchar(30) null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null
)
comment 'List of project statuses';

create table if not exists Projects
(
	id int auto_increment
		primary key,
	orgId int not null,
	title varchar(255) not null,
	startAt datetime default CURRENT_TIMESTAMP null,
	summary text null,
	businessGoal varchar(255) null,
	progress int default 0 null,
	currentTaskId int null,
	description varchar(512) null,
	endAt date null,
	mindmapId int null,
	nodeId varchar(16) null,
	statusId int default 2 null,
	deptId int null,
	mainKpiId int null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	constraint Projects_Departments_id_fk
		foreign key (deptId) references Departments (id),
	constraint Projects_ibfk_1
		foreign key (orgId) references Organizations (id)
			on delete cascade,
	constraint Projects_ibfk_2
		foreign key (mainKpiId) references Kpis (id)
			on delete cascade,
	constraint Projects_ibfk_3
		foreign key (statusId) references ProjectStatuses (id)
);

create table if not exists DataSets
(
	id int auto_increment
		primary key,
	dataSourceId int not null,
	projectId int not null,
	title varchar(255) not null,
	description varchar(255) null,
	sourceFile varchar(512) null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	constraint DataSets_ibfk_1
		foreign key (dataSourceId) references DataSources (id)
			on delete cascade,
	constraint DataSets_ibfk_2
		foreign key (projectId) references Projects (id)
			on delete cascade
);

create index DataSets_DataSources_ind
	on DataSets (dataSourceId);

create index DataSets_Projects_ind
	on DataSets (projectId);

create index DataSets_title_ind
	on DataSets (title);

create table if not exists Gantt
(
	id int auto_increment
		primary key,
	orgId int not null,
	projectId int null,
	jsonData json null comment 'JSON data representing the milestones for the Gantt chart.',
	active tinyint default 1 null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	constraint Gantt_ibfk_1
		foreign key (orgId) references Organizations (id)
			on delete cascade,
	constraint Gantt_ibfk_2
		foreign key (projectId) references Projects (id)
			on delete cascade
);

create index Gantt_Organizations_ind
	on Gantt (orgId);

create definer = viadmin@`%` trigger trg_ins_actions
	after insert
	on Gantt
	for each row
	begin
    DECLARE jsonText,TaskId VARCHAR(255);
    DECLARE json_data,json,product LONGTEXT;

    declare thetitle varchar(100);
    DECLARE i INT DEFAULT 0;
  select title from Projects where id = NEW.projectId into thetitle;
    SELECT jsonData from Gantt where id=NEW.id INTO json;
    SELECT json->"$.data" INTO json_data;
    WHILE i < JSON_LENGTH(json_data) DO

    SELECT JSON_EXTRACT(json_data,CONCAT('$[',i,']')) INTO product;
    SELECT REPLACE(product->"$.text",'"','') INTO jsonText;
    SELECT REPLACE(product->"$.id",'"','') INTO TaskId;
    insert into SearchData (orgId,foreignId, title, project, summary, source) values (NEW.orgId,NEW.projectId, jsonText, thetitle,'GantId-'+NEW.orgId+'|TaskId-'+TaskId, 'Actions');

        SELECT i + 1 INTO i;
    END WHILE;
            end;

create definer = viadmin@`%` trigger trg_upd_actions
	after update
	on Gantt
	for each row
	begin
    DECLARE jsonText, TaskId VARCHAR(255);
    DECLARE json_data,json,product LONGTEXT;

    declare thetitle varchar(100);
    DECLARE i INT DEFAULT 0;
   select title from Projects where id = NEW.projectId into thetitle;
    SELECT jsonData from Gantt where id=NEW.id INTO json;
    SELECT json->"$.data" INTO json_data;
    WHILE i < JSON_LENGTH(json_data) DO

    SELECT JSON_EXTRACT(json_data,CONCAT('$[',i,']')) INTO product;
    SELECT REPLACE(product->"$.text",'"','') INTO jsonText;
SELECT REPLACE(product->"$.id",'"','') INTO TaskId;
    insert into SearchData (orgId,foreignId, title, project, summary, source) values (NEW.orgId,NEW.projectId, jsonText, thetitle,'GantId-'+NEW.orgId+'|TaskId-'+TaskId, 'Actions')
    on duplicate key update
                title = NEW.id;


        SELECT i + 1 INTO i;
    END WHILE;
            end;

create table if not exists KpiProjects
(
	projectId int not null,
	kpiId int not null,
	active tinyint default 1 null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	primary key (projectId, kpiId),
	constraint KpiProjects_ibfk_1
		foreign key (kpiId) references Kpis (id)
			on delete cascade,
	constraint KpiProjects_ibfk_2
		foreign key (projectId) references Projects (id)
			on delete cascade
);

create index kpiId
	on KpiProjects (kpiId);

create table if not exists ProjectPersons
(
	projectId int not null,
	personId int not null,
	inProject tinyint(1) default 0 null,
	owner tinyint(1) default 0 null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	primary key (projectId, personId),
	constraint ProjectPersons_ibfk_1
		foreign key (projectId) references Projects (id)
			on delete cascade,
	constraint ProjectPersons_ibfk_2
		foreign key (personId) references Persons (id)
			on delete cascade
);

create index personId
	on ProjectPersons (personId);

create index Projects_Mindmap_ind
	on Projects (mindmapId, nodeId);

create index Projects_Organizations_ind
	on Projects (orgId);

create index Projects_startAt_ind
	on Projects (startAt);

create index Projects_title_ind
	on Projects (title);

create fulltext index title
	on Projects (title, description, summary, businessGoal);

create definer = viadmin@`%` trigger setProjectStatus
	before insert
	on Projects
	for each row
	SET NEW.statusId =
    (select id from ProjectStatuses
where label = 'Not Approved');

create definer = viadmin@`%` trigger trg_ins_projects
	after insert
	on Projects
	for each row
	begin
            insert into SearchData (orgId, foreignId, title, description, summary, project, source)
            values (NEW.orgId, NEW.id, NEW.title, NEW.description, NEW.summary, NEW.title, 'Projects');
        end;

create definer = viadmin@`%` trigger trg_upd_projects
	after update
	on Projects
	for each row
	begin
            insert into SearchData (orgId, foreignId, title, description, summary, project, source)
            values (NEW.orgId, NEW.id, NEW.title, NEW.description, NEW.summary, NEW.title, 'Projects')
            on duplicate key update
                title = NEW.title,
                description = NEW.description,
                summary = NEW.summary;
        end;

create table if not exists SearchData
(
	id int auto_increment
		primary key,
	orgId int null,
	foreignId int not null,
	title varchar(100) null,
	description varchar(255) null,
	summary varchar(255) null,
	project varchar(100) null,
	source varchar(50) null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP
)
comment 'For building our fulltext search index.';

create fulltext index title
	on SearchData (title, description, summary);

create table if not exists SequelizeMeta
(
	name varchar(255) not null,
	constraint name
		unique (name)
)
collate=utf8_unicode_ci;

alter table SequelizeMeta
	add primary key (name);

create table if not exists TaskPriorities
(
	id int not null
		primary key,
	label varchar(30) null,
	priority int null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null
);

create table if not exists TaskStatuses
(
	id int not null
		primary key,
	label varchar(30) null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null
)
comment 'List of task statuses';

create table if not exists Milestones
(
	id int auto_increment
		primary key,
	title varchar(255) not null,
	startDate date null,
	targetDate date null,
	description varchar(255) null,
	orgId int not null,
	statusId int default 1 null,
	active tinyint default 1 null,
	projectId int null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	constraint Milestones_Projects_id_fk
		foreign key (projectId) references Projects (id),
	constraint Milestones_TaskStatuses_id_fk
		foreign key (statusId) references TaskStatuses (id)
);

create fulltext index title
	on Milestones (title, description);

create table if not exists Tasks
(
	id int auto_increment
		primary key,
	projectId int not null,
	assignedTo int not null,
	title varchar(255) not null,
	description varchar(255) null,
	comments varchar(255) null,
	priorityId int default 3 null,
	milestoneId int null,
	statusId int default 1 null,
	startDate date null,
	endDate date null,
	createdAt datetime default CURRENT_TIMESTAMP null,
	updatedAt datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	constraint Tasks_ibfk_1
		foreign key (projectId) references Projects (id)
			on delete cascade,
	constraint Tasks_ibfk_2
		foreign key (assignedTo) references Persons (id)
			on delete cascade,
	constraint Tasks_ibfk_3
		foreign key (statusId) references TaskStatuses (id)
			on delete cascade,
	constraint Tasks_ibfk_4
		foreign key (priorityId) references TaskPriorities (id)
			on delete cascade,
	constraint Tasks_ibfk_5
		foreign key (milestoneId) references Milestones (id)
);

alter table Projects
	add constraint Projects_ibfk_4
		foreign key (currentTaskId) references Tasks (id);

create index Tasks_Projects_ind
	on Tasks (projectId);

create index Tasks_assignedTo_ind
	on Tasks (assignedTo);

create fulltext index title
	on Tasks (title, description);

create or replace definer = viadmin@`%` view vw_GanttTasks as select `G1`.`taskId`          AS `taskId`,
       `G1`.`startDate`       AS `startDate`,
       `G1`.`endDate`         AS `endDate`,
       `G1`.`duration`        AS `duration`,
       `G1`.`taskDescription` AS `taskDescription`,
       `G`.`id`               AS `chartId`,
       `G`.`projectId`        AS `projectId`,
       `P`.`orgId`            AS `orgId`
from `mvp2`.`Gantt` `G`
         join `mvp2`.`Projects` `P`
         join json_table(`G`.`jsonData`, '$.data[*]'
                         columns (taskId varchar(20) path '$.id', startDate date path '$.start_date', endDate date path '$.end_date', duration int path '$.duration', taskDescription varchar(100) path '$.text')) `G1`
where ((`G`.`projectId` is not null) and (`P`.`id` = `G`.`projectId`))
order by `G`.`projectId`, `G1`.`startDate`;

create or replace definer = viadmin@`%` view vw_Kpis as select `K`.`id`                                                                                                   AS `id`,
       `K`.`orgId`                                                                                                AS `orgId`,
       `K`.`deptId`                                                                                               AS `deptId`,
       `K`.`title`                                                                                                AS `title`,
       `K`.`description`                                                                                          AS `description`,
       `K`.`level`                                                                                                AS `level`,
       `K`.`type`                                                                                                 AS `type`,
       `K`.`orgPriority`                                                                                          AS `orgPriority`,
       `K`.`active`                                                                                               AS `active`,
       `K`.`status`                                                                                               AS `status`,
       `K`.`projectId`                                                                                            AS `projectId`,
       `K`.`formulaDescription`                                                                                   AS `formulaDescription`,
       `K`.`departmentId`                                                                                         AS `departmentId`,
       `P`.`title`                                                                                                AS `projectTitle`,
       `O`.`name`                                                                                                 AS `orgName`,
       (select group_concat(`KT`.`tag` separator ',')
        from `mvp2`.`KpiTags` `KT`
        where (`KT`.`kpiId` = `K`.`id`))                                                                          AS `tags`
from ((`mvp2`.`Projects` `P` join `mvp2`.`Organizations` `O`)
         join `mvp2`.`Kpis` `K`)
where ((`K`.`projectId` = `P`.`id`) and (`K`.`orgId` = `O`.`id`));

create or replace definer = viadmin@`%` view vw_OrderedTasks as select `G1`.`text`     AS `description`,
       `G1`.`type`     AS `type`,
       `G1`.`end_date` AS `targetDate`,
       'open'          AS `status`,
       `P`.`id`        AS `projectId`,
       `P`.`title`     AS `projectTitle`
from `mvp2`.`Gantt` `G`
         join json_table(`G`.`jsonData`, '$.data[*]'
                         columns (start_date date path '$.start_date', end_date date path '$.end_date', type varchar(60) path '$.type', duration int path '$.duration', text varchar(120) path '$.text')) `G1`
         join `mvp2`.`Projects` `P`
where (`P`.`id` = `G`.`projectId`)
order by `P`.`id`, `G1`.`start_date`, `G1`.`duration`;

create or replace definer = viadmin@`%` view vw_ProjectPersonsTemp as select `Pe`.`id` AS `personId`, `Pr`.`id` AS `projectId`, `O`.`id` AS `orgId`
from `mvp2`.`Persons` `Pe`
         join `mvp2`.`Organizations` `O`
         join `mvp2`.`Projects` `Pr`
where ((`Pe`.`orgId` = `O`.`id`) and (`Pr`.`orgId` = `O`.`id`));

create or replace definer = viadmin@`%` view vw_SearchData as select `mvp2`.`Projects`.`id`          AS `id`,
       `mvp2`.`Projects`.`orgId`       AS `orgid`,
       `mvp2`.`Projects`.`title`       AS `title`,
       `mvp2`.`Projects`.`description` AS `description`,
       `mvp2`.`Projects`.`summary`     AS `summary`,
       `mvp2`.`Projects`.`title`       AS `project`,
       'Projects'                      AS `source`
from `mvp2`.`Projects`
union
select `mvp2`.`Kpis`.`id`          AS `id`,
       `mvp2`.`Kpis`.`orgId`       AS `orgid`,
       `mvp2`.`Kpis`.`title`       AS `title`,
       `mvp2`.`Kpis`.`description` AS `description`,
       ''                          AS `summary`,
       `mvp2`.`Projects`.`title`   AS `project`,
       'Kpis'                      AS `source`
from (`mvp2`.`Kpis`
         join `mvp2`.`Projects`)
where (`mvp2`.`Kpis`.`projectId` = `mvp2`.`Projects`.`id`)
union
select `mvp2`.`Persons`.`id`       AS `id`,
       `mvp2`.`Persons`.`orgId`    AS `orgid`,
       `mvp2`.`Persons`.`fullName` AS `title`,
       ''                          AS `description`,
       ''                          AS `summary`,
       ''                          AS `project`,
       'Persons'                   AS `source`
from `mvp2`.`Persons`
union
select `mvp2`.`Mindmaps`.`id`             AS `id`,
       `mvp2`.`Mindmaps`.`orgId`          AS `orgid`,
       `mvp2`.`Mindmaps`.`mapName`        AS `title`,
       `mvp2`.`Mindmaps`.`mapDescription` AS `description`,
       ''                                 AS `summary`,
       ''                                 AS `project`,
       'Mindmaps'                         AS `source`
from `mvp2`.`Mindmaps`
union
select `vw_GanttTasks`.`projectId`       AS `id`,
       `vw_GanttTasks`.`orgId`           AS `orgid`,
       `vw_GanttTasks`.`taskDescription` AS `title`,
       `vw_GanttTasks`.`taskDescription` AS `description`,
       `vw_GanttTasks`.`taskDescription` AS `summary`,
       `mvp2`.`Projects`.`title`         AS `project`,
       'Actions'                         AS `source`
from (`mvp2`.`vw_GanttTasks`
         join `mvp2`.`Projects`)
where (`vw_GanttTasks`.`projectId` = `mvp2`.`Projects`.`id`);

create or replace definer = viadmin@`%` view vw_Tasks as select `T`.`id`                                     AS `id`,
       `T`.`projectId`                              AS `projectId`,
       `T`.`assignedTo`                             AS `assignedTo`,
       `T`.`title`                                  AS `title`,
       `T`.`description`                            AS `description`,
       `T`.`status`                                 AS `status`,
       `T`.`createdAt`                              AS `createdAt`,
       `T`.`updatedAt`                              AS `updatedAt`,
       concat(`P`.`firstName`, ' ', `P`.`lastName`) AS `fullName`
from `mvp2`.`Tasks` `T`
         join `mvp2`.`Persons` `P`
where (`T`.`assignedTo` = `P`.`id`);

-- comment on view vw_Tasks not supported: View 'mvp2.vw_Tasks' references invalid table(s) or column(s) or function(s) or definer/invoker of view lack rights to use them

create definer = viadmin@`%` function getMindmapJsonNode(mindmapId int, id varchar(50)) returns json
begin
    declare
        json_out json;
    -- Replace ".id" with "" to get the full node.
    set json_out = (select json_unquote(json_extract(mapData,
        replace(json_unquote(json_search(mapData, 'one', id)), '.id', '')))
       from Mindmaps m where m.id = mindmapId limit 1);
    return json_out;
END;

create definer = viadmin@`%` function getProjectListForPerson(inPersonId int) returns varchar(500)
begin
    declare projectList varchar(500);

    select group_concat(title) into projectList
            from Projects Pr,
                 ProjectPersons PP
            where Pr.id = PP.projectId
              and PP.personId = inPersonId
            order by Pr.title
    limit 1;

    return projectList;
end;

create definer = viadmin@`%` function getTopTasks(in_numTasks int, in_projectId int) returns varchar(500)
begin
    declare jsonPath varchar(100);
    declare tasks varchar(500);
    declare path1 varchar(100);
    declare notFound INTEGER DEFAULT 0;

    select group_concat(concat(description, ' - Due: ', targetDate) ORDER BY description ASC) into tasks
    from
     (select projectTitle as title, description, targetDate from vw_OrderedTasks
        where projectId = in_projectId limit in_numTasks) V

    limit 1;


    return tasks;
end;

create definer = viadmin@`%` procedure insert_kpi_with_project(IN p_org_id int, IN p_kpi_title varchar(255), IN p_kpi_descr varchar(255), IN p_kpi_formula varchar(255), IN p_mindmap_node_id varchar(30), IN p_proj_title varchar(100), IN p_proj_descr varchar(300))
BEGIN
    set @kpiId = 0;

    insert into Kpis (orgId, title, description, formulaDescription, mindmapNodeId, active)
    values (p_org_id, p_kpi_title, p_kpi_descr, p_kpi_formula, p_mindmap_node_id, 1);
    -- insert into Kpis (orgId, title, description, mindmapNodeId, active, projectId, formulaDescription)
    -- values (orgId, title, description, mindmapNodeId, active, projectId, formulaDescription);

    -- Get the inserted value for the new kpi ID.
    set @kpiId = LAST_INSERT_ID();
    SELECT concat('kpi id = ', @kpiId);

    insert into Projects (orgId, title, description, mainKpiId)
    values (p_org_id, p_proj_title, p_proj_descr, @kpiId);

END;

create definer = viadmin@`%` procedure setProject(IN kpiId int, IN organizationId int, IN projectTitle varchar(100), IN projectDescription varchar(300), OUT message varchar(200))
begin
    declare projectId integer;
    declare notFound INTEGER DEFAULT 0;
    declare projectCursor cursor for select id from Projects where mainKpiId = kpiId
        and orgId = organizationId;


    declare CONTINUE HANDLER
        FOR NOT FOUND SET notFound = 1;
    open projectCursor;

    FETCH projectCursor INTO projectId;
    select 'project id = ' + projectId;

    close projectCursor;

    IF notFound = 1 THEN
        -- add project
        insert into Projects (title, description, mainKpiId, orgId)
        values (projectTitle, projectDescription, kpiId, organizationId);
        set message = concat('Project ''', projectTitle, ''' has been created.');
    else
        update Projects
        set title = projectTitle,
            description = projectDescription
            where id = projectId and orgId = organizationId;
        set message = concat('Project ''', projectTitle, ''' has been updated.');
    END IF;
END;

create definer = viadmin@`%` procedure sp_MostRecentProjects()
begin
    select id, title as ProjTitle, Pdate as ProjectUpdated,
          greatest(Pdate,
                  COALESCE(Tdate, '2000-01-01'),
                  COALESCE(TCdate, '2000-01-01'),
                  COALESCE(Kdate, '2000-01-01'),
                  COALESCE(KCdate, '2000-01-01')
            ) as MostRecent from
  (
  select  P.id as id, P.title , P.updatedAt as Pdate ,
       (select max(T.updatedAt) from Tasks T where
         T.projectId = P.id) as Tdate,
       (select max(T.createdAt) from Tasks T where
         T.projectId = P.id) as TCdate,
      (select max(K.updatedAt) from Kpis K, KpiProjects KP where
          K.id = KP.kpiId
          and P.id = KP.projectId) as Kdate,
      (select max(K.createdAt) from Kpis K, KpiProjects KP where
          K.id = KP.kpiId
          and P.id = KP.projectId) as KCdate
   from Projects P) as Proj
  order by MostRecent desc;
end;

