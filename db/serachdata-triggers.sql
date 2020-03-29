-- ValueInfinity triggers for SearchData 

CREATE  TRIGGER trg_ins_projects after INSERT ON Projects
   FOR EACH ROW
        begin
            insert into SearchData (orgId, foreignId, title, description, summary, project, source)
            values (NEW.orgId, NEW.id, NEW.title, NEW.description, NEW.summary, NEW.title, 'Projects');
        end;

drop trigger trg_ins_projects;


CREATE TRIGGER trg_upd_projects after update ON Projects
   FOR EACH ROW
        begin
            insert into SearchData (orgId, foreignId, title, description, summary, project, source)
            values (NEW.orgId, NEW.id, NEW.title, NEW.description, NEW.summary, NEW.title, 'Projects')
            on duplicate key update
                title = NEW.title,
                description = NEW.description,
                summary = NEW.summary;
        end;

drop trigger trg_upd_projects;

CREATE  TRIGGER trg_ins_kpis after INSERT ON Kpis
   FOR EACH ROW
        begin
            declare thetitle varchar(100);
            select title from Projects where id = NEW.projectId into thetitle;
            insert into SearchData (orgId, foreignId, title, description, project, source)
            values (NEW.orgId, NEW.id, NEW.title, NEW.description, thetitle, 'Kpis');
        end;

CREATE  TRIGGER trg_upd_kpis after UPDATE ON Kpis
   FOR EACH ROW
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
