/**
* Project: valueinfinity-mvp
* File:    function json getName.sql   
* Date:    9/29/19
* Descr:   Get mindmap name of a node from a node id.
*
*/
DELIMITER $$
CREATE FUNCTION getJsonName(jsonData varchar(1000), id varchar(50), mindMapId integer)
RETURNS varchar(100)
begin
    declare jsonPath varchar(100);
    declare jsonNamePath varchar(100);
    declare jsonName varchar(100);
    declare path1 varchar(100);
    declare notFound INTEGER DEFAULT 0;
    declare jsonCursor cursor for
        SELECT json_search(mapdata, 'one', id)  from Mindmaps where id = mindMapId
        order by updatedAt desc limit 1;
    declare CONTINUE HANDLER
        FOR NOT FOUND SET notFound = 1;

    open jsonCursor;
    FETCH jsonCursor INTO jsonPath;
    CLOSE jsonCursor;
    select 'jsonPath = ' + jsonPath;
    -- jsonPath will be something like "$.children[2].id"
    set jsonNamePath = replace(jsonPath, '.id', '.name');

    select json_extract(mapData, jsonNamePath) into jsonName
    from Mindmaps m where m.id = mindMapId
    limit 1;
    -- select 'jsonName = ' + jsonName;

    return jsonName;
end $$
-- delimiter;
