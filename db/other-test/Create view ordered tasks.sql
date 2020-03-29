/**
* Project: valueinfinity-mvp
* File:    create view ordered tasks.sql   
* Date:    9/29/19
* Descr:   View for tasks ordered by upcoming milestone due date.  We will use this for our dashboard view in the app
*          and get the three most recent tasks.
*
*/
create view vw_orderedTasks as
select T.title, T.description, M.targetDate, P.id, P.title as projectTitle, S.label as status, M.title as milestone
from Tasks T, Projects P, Milestones M, ProjectStatuses S
where T.projectId = P.id
  and S.id = T.statusId
  and S.label <> 'Postponed' and S.label <> 'Completed'
and T.milestoneId = M.id
order by M.targetDate, T.title;