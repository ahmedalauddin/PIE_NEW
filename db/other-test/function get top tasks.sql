/**
* Project: valueinfinity-mvp
* File:    function json getName.sql   
* Date:    9/29/19
* Descr:   Get mindmap name of a node from a node id.
*
*/
DELIMITER $$
CREATE FUNCTION getTopTasks(in_numTasks integer, in_projectId integer)
RETURNS varchar(500)
begin
    declare jsonPath varchar(100);
    declare tasks varchar(500);
    declare path1 varchar(100);
    declare notFound INTEGER DEFAULT 0;

    select group_concat(concat(' ', title, ': ', description, ', due: ', targetDate, '; ')) into tasks
    from
     (select title, description, targetDate from vw_OrderedTasks
        where projectId = in_projectId limit in_numTasks) V
    limit 1;


    return tasks;
end $$
-- delimiter;



create function getTopTasks (in_numTasks integer, in_projectId integer)
returns varchar(300)
select group_concat(concat(' ', title, ': ', description, ', due: ', targetDate, '; ')) from
     (select title, description, targetDate from vw_OrderedTasks
        where projectId = in_projectId limit in_numTasks) V;