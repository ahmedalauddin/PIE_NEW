DROP TABLE IF EXISTS `mvp2`.`ProjectComments`;
CREATE TABLE  `mvp2`.`ProjectComments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `projId` int NOT NULL,
  `personId` int DEFAULT NULL,
  `personName` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `projId` (`projId`),
  KEY `personId` (`personId`),
  CONSTRAINT `ProjectComments_ibfk_1` FOREIGN KEY (`projId`) REFERENCES `Projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ProjectComments_ibfk_2` FOREIGN KEY (`personId`) REFERENCES `Persons` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


ALTER TABLE `mvp2`.`ProjectComments` 
ADD COLUMN `disabled` TINYINT(1) NULL DEFAULT 0 AFTER `updatedAt`,
ADD COLUMN `disabledAt` DATETIME NULL DEFAULT NULL AFTER `disabled`;

ALTER TABLE `mvp2`.`ProjectComments` MODIFY COLUMN `description` VARCHAR(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL;


DROP TABLE IF EXISTS `mvp2`.`ProjectKpis`;
CREATE TABLE  `mvp2`.`ProjectKpis` (
  `id` int NOT NULL AUTO_INCREMENT,
  `projId` int NOT NULL,
  `kpiId` int NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `disabled` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`projId`,`kpiId`),
  UNIQUE KEY `organizationId_personId` (`projId`,`kpiId`),
  UNIQUE KEY `id` (`id`),
  KEY `projId` (`projId`),
  CONSTRAINT `ProjectKpis_ibfk_1` FOREIGN KEY (`projId`) REFERENCES `Projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ProjectKpis_ibfk_2` FOREIGN KEY (`kpiId`) REFERENCES `Kpis` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


insert into ProjectKpis ( kpiId, projId,createdAt, updatedAt) SELECT id,projectId,now(),now() FROM Kpis where active= 1 and projectId >0; 


ALTER TABLE Persons ADD COLUMN `isCustomerAdmin` TINYINT(1) UNSIGNED DEFAULT NULL;


DROP TABLE IF EXISTS `mvp2`.`TaskComments`;
CREATE TABLE  `mvp2`.`TaskComments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(50) DEFAULT NULL,
  `taskId` varchar(50) NOT NULL,
  `projectId` int NOT NULL,
  `personName` varchar(50) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `disabled` tinyint(1) DEFAULT '0',
  `disabledAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `taskId-projectId` (`taskId`,`projectId`)
);


ALTER TABLE `mvp2`.`OrganizationActions` MODIFY COLUMN `description` VARCHAR(1000) ;
ALTER TABLE `mvp2`.`OrganizationActions` ADD COLUMN `dateAdded` VARCHAR(45) DEFAULT NULL,ADD INDEX dateAddedQuery(`dateAdded`,`orgId`,`disabled`);

update `mvp2`.`OrganizationActions` set dateAdded=date(createdAt);

ALTER TABLE `mvp2`.`TaskComments` MODIFY COLUMN `description` VARCHAR(100)  NOT NULL;

DROP TABLE IF EXISTS `mvp2`.`Acls`;
CREATE TABLE  `mvp2`.`Acls` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orgId` int NOT NULL,
  `jsonData` json DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `acls_org_ind` (`orgId`),
  CONSTRAINT `acls_org_ind_fk` FOREIGN KEY (`orgId`) REFERENCES `Organizations` (`id`) ON DELETE CASCADE
) ;


DROP TABLE IF EXISTS `mvp2`.`Roles`;
CREATE TABLE  `mvp2`.`Roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orgId` int NOT NULL,
  `description` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roles_org_ind` (`orgId`),
  CONSTRAINT `roles_org_ind_fk` FOREIGN KEY (`orgId`) REFERENCES `Organizations` (`id`) ON DELETE CASCADE
) ;

insert into `mvp2`.`Roles` 
(`orgId`,`description`) values
( 1,  'Chief Operating Officer'),
( 1,  'VP Operations'),
( 1,  'Sr. Director'),
( 1,  'Director'),
( 1,  'Manager'),
( 1,  'Engineer'),
( 1,  'Analyst'),
( 1,  'Consultant'),
( 2,  'Chief Operating Officer'),
( 2,  'VP Operations'),
( 2,  'Sr. Director'),
( 2,  'Director'),
( 2,  'Manager'),
( 2,  'Engineer'),
( 2,  'Analyst'),
( 2,  'Consultant'),
( 3,  'Chief Operating Officer'),
( 3,  'VP Operations'),
( 3,  'Sr. Director'),
( 3,  'Director'),
( 3,  'Manager'),
( 3,  'Engineer'),
( 3,  'Analyst'),
( 3,  'Consultant'),
( 4,  'Chief Operating Officer'),
( 4,  'VP Operations'),
( 4,  'Sr. Director'),
( 4,  'Director'),
( 4,  'Manager'),
( 4,  'Engineer'),
( 4,  'Analyst'),
( 4,  'Consultant'),
( 7,  'Chief Operating Officer'),
( 7,  'VP Operations'),
( 7,  'Sr. Director'),
( 7,  'Director'),
( 7,  'Manager'),
( 7,  'Engineer'),
( 7,  'Analyst'),
( 7,  'Consultant'),
( 9,  'Chief Operating Officer'),
( 9,  'VP Operations'),
( 9,  'Sr. Director'),
( 9,  'Director'),
( 9,  'Manager'),
( 9,  'Engineer'),
( 9,  'Analyst'),
( 9,  'Consultant'),
( 10,  'Chief Operating Officer'),
( 10,  'VP Operations'),
( 10,  'Sr. Director'),
( 10,  'Director'),
( 10,  'Manager'),
( 10,  'Engineer'),
( 10,  'Analyst'),
( 10,  'Consultant'),
( 55,  'Chief Operating Officer'),
( 55,  'VP Operations'),
( 55,  'Sr. Director'),
( 55,  'Director'),
( 55,  'Manager'),
( 55,  'Engineer'),
( 55,  'Analyst'),
( 55,  'Consultant');


ALTER TABLE ProjectActions MODIFY COLUMN `status` ENUM('Open','Closed','New') DEFAULT 'New';



ALTER TABLE Projects ADD COLUMN `completedAt` DATETIME DEFAULT NULL;


ALTER TABLE ProjectActions ADD COLUMN `priority` ENUM('High','Medium','Low') DEFAULT 'Medium';

ALTER TABLE ProjectActions ADD COLUMN `comments` json DEFAULT NULL;

UPDATE ProjectStatuses SET `label` = 'New' WHERE (`id` = '1');
UPDATE ProjectStatuses SET `label` = 'Cancelled' WHERE (`id` = '2');
UPDATE ProjectStatuses SET `label` = 'On Hold' WHERE (`id` = '5');

ALTER TABLE ProjectActions MODIFY COLUMN `status` VARCHAR(50) DEFAULT 'New';
update ProjectActions set status='Completed' where status='Closed';
update ProjectActions set status='In Progress' where status='Open';

ALTER TABLE ProjectActions ADD COLUMN `dueDate` VARCHAR(20) DEFAULT NULL;

ALTER TABLE OrganizationActions ADD COLUMN `projectActions` json DEFAULT NULL;

ALTER TABLE ProjectActions ADD COLUMN `progress` VARCHAR(20) DEFAULT '0%';


DROP TABLE IF EXISTS `mvp2`.`ProjectActionPersons`;
CREATE TABLE  `mvp2`.`ProjectActionPersons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `assigneeId` int NOT NULL,
  `projectActionId` int NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`assigneeId`,`projectActionId`),
  CONSTRAINT `p-a-key_fk1` FOREIGN KEY (`assigneeId`) REFERENCES `Persons` (`id`) ON DELETE CASCADE,
  CONSTRAINT `p-a-key_fk2` FOREIGN KEY (`projectActionId`) REFERENCES `ProjectActions` (`id`) ON DELETE CASCADE
) ;

insert into ProjectActionPersons SELECT null,assigneeId, id,now(),now() FROM ProjectActions where assigneeId is not null;

