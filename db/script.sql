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

