select P.id, P.orgId, P.title as `projectTitle`, PS.label as `status`, K.title as `mainKpi`, O.name as organization,
       P.progress, P.startAt, P.endAt,
       (select group_concat(concat(' ', Per.firstName, ' ', Per.lastName))
       from ProjectPersons PP,
       Persons Per
       where P.id = PP.projectId and Per.id = PP.personId and PP.owner = '1') as owners
from Projects P left outer join ProjectStatuses PS on P.statusId = PS.id
    left outer join Organizations O on P.orgId = O.id
    left outer join Kpis K on P.mainKpiId = K.id
where P.orgId = 9
order by P.title;