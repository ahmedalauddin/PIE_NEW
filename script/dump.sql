-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: mvp2
-- ------------------------------------------------------
-- Server version	8.0.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `acls`
--

DROP TABLE IF EXISTS `acls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `acls` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orgId` int NOT NULL,
  `jsonData` json DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `acls_org_ind` (`orgId`),
  CONSTRAINT `acls_org_ind_fk` FOREIGN KEY (`orgId`) REFERENCES `organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acls`
--

LOCK TABLES `acls` WRITE;
/*!40000 ALTER TABLE `acls` DISABLE KEYS */;
INSERT INTO `acls` VALUES (1,10,'{\"Analyst\": {\"Dashboard\": {\"read\": false, \"write\": true, \"delete\": true, \"modify\": true}}, \"Consultant\": {\"Dashboard\": {\"read\": false, \"write\": true, \"delete\": true, \"modify\": true}, \"Dashboard Expand Projects\": {\"read\": true, \"write\": true, \"delete\": true, \"modify\": true}}}','2020-04-23 18:32:23','2020-04-23 18:34:25'),(2,55,'{\"Engineer\": {\"About\": {\"read\": true, \"write\": true, \"delete\": true, \"modify\": true}, \"Search\": {\"read\": true, \"write\": true, \"delete\": true, \"modify\": true}, \"Mind Map\": {\"read\": true, \"write\": true, \"delete\": true, \"modify\": true}, \"Projects\": {\"read\": true, \"write\": true, \"delete\": true, \"modify\": true}, \"Analytics\": {\"read\": true, \"write\": true, \"delete\": true, \"modify\": true}, \"Dashboard\": {\"read\": true, \"write\": true, \"delete\": true, \"modify\": true}, \"Regrouping\": {\"read\": true, \"write\": true, \"delete\": true, \"modify\": true}, \"Organization\": {\"read\": true, \"write\": true, \"delete\": true, \"modify\": true}, \"Projects KPIs\": {\"read\": true, \"write\": true, \"delete\": true, \"modify\": true}, \"Projects People\": {\"read\": true, \"write\": true, \"delete\": true, \"modify\": true}, \"Organization KPI\": {\"read\": true, \"write\": true, \"delete\": true, \"modify\": true}, \"Projects Documents\": {\"read\": true, \"write\": true, \"delete\": true, \"modify\": true}, \"Organization People\": {\"read\": true, \"write\": true, \"delete\": true, \"modify\": true}, \"Projects Milestones\": {\"read\": true, \"write\": true, \"delete\": true, \"modify\": true}, \"Organization Department\": {\"read\": true, \"write\": true, \"delete\": true, \"modify\": true}, \"Mind Map Prioritized KPI\": {\"read\": true, \"write\": true, \"delete\": true, \"modify\": true}, \"Dashboard Expand Projects\": {\"read\": true, \"write\": true, \"delete\": true, \"modify\": true}, \"Projects Additional Actions\": {\"read\": true, \"write\": true, \"delete\": true, \"modify\": true}}}','2020-04-24 05:30:35','2020-04-25 18:25:11');
/*!40000 ALTER TABLE `acls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `datasets`
--

DROP TABLE IF EXISTS `datasets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `datasets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dataSourceId` int NOT NULL,
  `projectId` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `sourceFile` varchar(512) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `DataSets_DataSources_ind` (`dataSourceId`),
  KEY `DataSets_Projects_ind` (`projectId`),
  KEY `DataSets_title_ind` (`title`),
  CONSTRAINT `DataSets_ibfk_1` FOREIGN KEY (`dataSourceId`) REFERENCES `datasources` (`id`) ON DELETE CASCADE,
  CONSTRAINT `DataSets_ibfk_2` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `datasets`
--

LOCK TABLES `datasets` WRITE;
/*!40000 ALTER TABLE `datasets` DISABLE KEYS */;
/*!40000 ALTER TABLE `datasets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `datasources`
--

DROP TABLE IF EXISTS `datasources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `datasources` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orgId` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `sourceFile` varchar(512) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `DataSources_organization_ind` (`orgId`),
  KEY `DataSources_title_ind` (`title`),
  CONSTRAINT `DataSources_ibfk_1` FOREIGN KEY (`orgId`) REFERENCES `organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `datasources`
--

LOCK TABLES `datasources` WRITE;
/*!40000 ALTER TABLE `datasources` DISABLE KEYS */;
/*!40000 ALTER TABLE `datasources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `orgId` int DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  `disabled` tinyint(1) DEFAULT '0',
  `disabledAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Departments_Organizations_id_fk` (`orgId`),
  FULLTEXT KEY `name` (`name`,`description`),
  CONSTRAINT `Departments_Organizations_id_fk` FOREIGN KEY (`orgId`) REFERENCES `organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Organization departments';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'Sales','Another department',1,NULL,'2019-12-06 22:27:32',0,NULL),(2,'Operations','Operations department',1,NULL,'2019-12-06 22:27:32',0,NULL),(3,'Operations','Operations department',3,NULL,'2019-12-06 22:27:32',0,NULL),(4,'Marketing','Text text text text ',3,NULL,'2019-12-06 22:27:32',0,NULL),(5,'Sales','Sales',2,NULL,'2019-12-06 22:27:32',0,NULL),(6,'Executive Management','e',2,NULL,'2019-12-06 22:29:28',0,NULL),(8,'Accounting','Accounting',3,NULL,'2019-12-06 22:27:32',0,NULL),(9,'Executive Management','Executive Management',3,NULL,'2019-12-06 22:27:32',0,NULL),(10,'Executive Management','Executive Management',3,NULL,'2019-12-06 22:27:32',0,NULL),(14,'Marketing','Marketing',2,NULL,'2019-12-06 22:27:32',0,NULL),(15,'Technology','Technology',2,NULL,'2019-12-06 22:27:32',0,NULL),(16,'Accounting','Accounting',2,NULL,'2019-12-06 22:27:32',0,NULL),(17,'Purchasing','Purchasing',2,NULL,'2019-12-06 22:27:32',0,NULL),(19,'Asset Performance Management','Automated Reporting, Insights and decisions driving asset performance',10,'2019-12-02 04:08:10','2019-12-07 03:19:39',0,NULL),(20,'Operations','All Site Operations - wind, solar, hydro and thermal',10,'2019-12-02 04:49:43','2020-02-20 09:16:58',1,'2020-02-20 09:16:58'),(21,'Operations Engineering ','Engineering’s Purpose is to serve its customers and stakeholders by enabling generation of energy in a profitable, efficient and compliant manner\n',10,'2019-12-02 14:04:42','2020-02-20 09:16:59',1,'2020-02-20 09:16:59'),(22,'Asset Strategy','Department responsible for developing the strategy from a long term life cycle, external stakeholder point of view',10,'2019-12-04 04:04:39','2019-12-04 04:04:39',0,NULL),(23,'Finance','Finance and Planning Analysis',10,'2019-12-07 01:45:22','2020-02-20 09:20:26',0,NULL),(51,'Energy Services','Department responsible for interacting with the market, capturing market demand and make delivery schedule',10,'2020-02-04 01:57:39','2020-02-04 01:57:39',0,'2020-02-04 01:57:39'),(67,'Test','Test',10,'2020-02-17 07:23:56','2020-02-17 07:24:15',1,'2020-02-17 07:24:15'),(68,'sadsad','sadsad',10,'2020-02-17 07:24:53','2020-02-17 07:26:28',1,'2020-02-17 07:26:28'),(69,'sd','sad',10,'2020-02-17 07:25:15','2020-02-17 07:26:28',1,'2020-02-17 07:26:28'),(71,'sdfsad','',10,'2020-02-17 07:26:08','2020-02-17 07:26:29',1,'2020-02-17 07:26:29'),(72,'Web','',9,'2020-02-20 04:37:16','2020-02-20 04:39:12',1,'2020-02-20 04:39:12'),(73,'Test Department','',9,'2020-02-20 06:22:43','2020-02-20 06:22:43',0,'2020-02-20 06:22:43'),(74,'new dep','',9,'2020-02-20 08:50:42','2020-02-21 04:05:50',1,'2020-02-21 04:05:50'),(76,'eded','',9,'2020-02-20 08:52:42','2020-02-21 04:05:47',1,'2020-02-21 04:05:47'),(77,'asd','',9,'2020-02-20 08:52:55','2020-02-20 08:52:55',0,'2020-02-20 08:52:55'),(79,'Web Dev','',10,'2020-02-20 08:54:08','2020-02-20 08:59:05',1,'2020-02-20 08:59:05'),(80,'Web Designing','',10,'2020-02-20 08:58:52','2020-02-20 08:59:09',1,'2020-02-20 08:59:09'),(81,'SEO','',10,'2020-02-20 09:09:30','2020-02-20 09:16:59',1,'2020-02-20 09:16:59'),(82,'Marketing','',10,'2020-02-20 09:13:26','2020-02-20 09:16:58',1,'2020-02-20 09:16:58'),(83,'etest','',10,'2020-02-20 09:23:50','2020-02-20 09:24:04',1,'2020-02-20 09:24:04'),(84,'Operations Engineering','Engineering team with the purpose of supporting Operations and associated stakeholders generate energy in a safe, reliable manner, with depth and breadth of expertise ',10,'2020-02-21 13:36:37','2020-02-21 13:36:37',0,'2020-02-21 13:36:37'),(85,'Asset Performance Management','Automated Reporting, Insights and decisions driving asset performance',55,'2020-04-25 14:24:10','2020-04-25 14:24:10',0,'2020-04-25 14:24:10');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gantt`
--

DROP TABLE IF EXISTS `gantt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gantt` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orgId` int NOT NULL,
  `projectId` int DEFAULT NULL,
  `jsonData` json DEFAULT NULL COMMENT 'JSON data representing the milestones for the Gantt chart.',
  `active` tinyint DEFAULT '1',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `Gantt_ibfk_2` (`projectId`),
  KEY `Gantt_Organizations_ind` (`orgId`),
  CONSTRAINT `Gantt_ibfk_1` FOREIGN KEY (`orgId`) REFERENCES `organizations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Gantt_ibfk_2` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1040 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gantt`
--

LOCK TABLES `gantt` WRITE;
/*!40000 ALTER TABLE `gantt` DISABLE KEYS */;
INSERT INTO `gantt` VALUES (1,10,6799,'{\"data\": [{\"id\": 38, \"text\": \"APM Benefit\", \"type\": \"milestone\", \"parent\": 0, \"assigned\": \"Harrop, Rick\", \"duration\": 91, \"end_date\": \"2020-04-01 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2020-01-01 00:00\"}, {\"id\": 1575164242307, \"text\": \"adding action\", \"parent\": \"38\", \"duration\": 61, \"end_date\": \"2020-07-01 00:00\", \"progress\": 0, \"start_date\": \"2020-05-01 00:00\"}, {\"id\": 34, \"text\": \"Asset Performance Monitoring\", \"type\": \"milestone\", \"parent\": 0, \"assigned\": \"\", \"duration\": 92, \"end_date\": \"2020-06-01 00:00\", \"priority\": \"2\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 58, \"text\": \"Definition of Key Metrics\", \"type\": \"task\", \"parent\": 34, \"duration\": 152, \"end_date\": \"2020-03-01 00:00\", \"progress\": 0.46285714285714286, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 1575217259691, \"text\": \"Key Metrics - Wind\", \"parent\": \"58\", \"duration\": 30, \"end_date\": \"2019-10-31 00:00\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 1575217259692, \"text\": \"Key Metric - Solar\", \"parent\": \"58\", \"duration\": 30, \"end_date\": \"2019-12-01 00:00\", \"progress\": 0, \"start_date\": \"2019-11-01 00:00\"}, {\"id\": 1575217259693, \"text\": \"Key Metric - Thermal\", \"parent\": \"58\", \"duration\": 30, \"end_date\": \"2019-12-31 00:00\", \"progress\": 0, \"start_date\": \"2019-12-01 00:00\"}, {\"id\": 1575217259694, \"text\": \"Key Metric - Hydro\", \"parent\": \"58\", \"duration\": 60, \"end_date\": \"2020-03-01 00:00\", \"progress\": 0, \"start_date\": \"2020-01-01 00:00\"}, {\"id\": 59, \"text\": \"Define APM Process - Discovery to Closure\", \"type\": \"task\", \"parent\": 34, \"duration\": 152, \"end_date\": \"2020-03-01 00:00\", \"progress\": 0.5371428571428571, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 1575217259683, \"text\": \"Process for High Priority Issues >72 hours \", \"parent\": \"59\", \"duration\": 92, \"end_date\": \"2020-01-01 00:00\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 1575217259686, \"text\": \"Process for Trend and Patterns\", \"parent\": \"59\", \"duration\": 60, \"end_date\": \"2020-03-01 00:00\", \"progress\": 0, \"start_date\": \"2020-01-01 00:00\"}, {\"id\": 1575217259720, \"text\": \"Weekly Meeting Structure and Process\", \"parent\": \"59\", \"duration\": 120, \"end_date\": \"2020-03-30 00:00\", \"progress\": 0, \"start_date\": \"2019-12-01 00:00\"}, {\"id\": 1575217259721, \"text\": \"Asset Performance Monitoring Process- Solar\", \"parent\": \"59\", \"duration\": 60, \"end_date\": \"2020-04-01 00:00\", \"progress\": 0, \"start_date\": \"2020-02-01 00:00\"}, {\"id\": 1575217259722, \"text\": \"Asset Performance Monitoring Process- Thermal\", \"parent\": \"59\", \"duration\": 60, \"end_date\": \"2020-04-30 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 1575217259689, \"text\": \"Data Quality, QA Method and Governance\", \"parent\": \"34\", \"duration\": 60, \"end_date\": \"2020-04-30 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 1575217259715, \"text\": \"Data Completeness\", \"parent\": \"34\", \"duration\": 90, \"end_date\": \"2020-01-30 00:00\", \"progress\": 0, \"start_date\": \"2019-11-01 00:00\"}, {\"id\": 1575217259725, \"text\": \"Consolidate and Automate Asset Reporting\", \"parent\": \"34\", \"duration\": 151, \"end_date\": \"2020-07-01 00:00\", \"progress\": 0, \"start_date\": \"2020-02-01 00:00\"}, {\"id\": 1575217259727, \"text\": \"Asset Performance Monitoring - Solar\", \"parent\": \"34\", \"duration\": 153, \"end_date\": \"2020-08-01 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 1575217259730, \"text\": \"Asset Performance Monitoring - Hydro\", \"parent\": \"34\", \"duration\": 120, \"end_date\": \"2020-11-29 00:00\", \"progress\": 0, \"start_date\": \"2020-08-01 00:00\"}, {\"id\": 36, \"text\": \"24/7 Control Room Monitoring\", \"type\": \"milestone\", \"parent\": 0, \"assigned\": \"Ahmed, Alauddin\", \"duration\": 184, \"end_date\": \"2020-11-01 00:00\", \"priority\": \"3\", \"progress\": 0, \"start_date\": \"2020-05-01 00:00\"}, {\"id\": 1575217259733, \"text\": \"OEM Scoring Methodology and Performance Feedback\", \"parent\": 0, \"assignId\": 164, \"assigned\": \"Ebrahimi, Alex\", \"duration\": 100, \"end_date\": \"2020-06-09 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 1575217259735, \"text\": \"Equipment Health Reporting and Condition Monitoring System\", \"parent\": 0, \"assignId\": 164, \"assigned\": \"Ebrahimi, Alex\", \"duration\": 120, \"end_date\": \"2020-12-30 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2020-09-01 00:00\"}, {\"id\": 1575217259736, \"text\": \"Predictive Analytics\", \"parent\": 0, \"assignId\": 164, \"assigned\": \"Ebrahimi, Alex\", \"duration\": 120, \"end_date\": \"2020-09-29 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2020-06-01 00:00\"}, {\"id\": 1575217259737, \"text\": \"Consolidate and Automate Asset Reporting\", \"parent\": 0, \"assigned\": \"\", \"duration\": 182, \"end_date\": \"2020-07-01 00:00\", \"priority\": \"1\", \"progress\": 0, \"start_date\": \"2020-01-01 00:00\"}], \"links\": [{\"id\": 1584987762131, \"type\": \"0\", \"source\": \"38\", \"target\": \"1575164242307\"}]}',1,'2019-11-30 22:25:38','2020-03-23 18:39:04'),(6,10,23,'{\"data\": [{\"id\": 38, \"text\": \"Optimize the level of details for different reporting events\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 61, \"end_date\": \"2019-12-01 00:00\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 1575164242307, \"text\": \"adding action\", \"parent\": \"38\", \"duration\": 61, \"end_date\": \"2019-12-01 00:00\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 40, \"text\": \"Condition Monitoring System\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 61, \"end_date\": \"2019-12-01 00:00\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 35, \"text\": \"Track & report on OEM/Provider SLA performance\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 120, \"end_date\": \"2020-03-30 00:00\", \"progress\": 0, \"start_date\": \"2019-12-01 00:00\"}, {\"id\": 37, \"text\": \"Predictive analytics for equipment reliability\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 273, \"end_date\": \"2020-09-30 00:00\", \"progress\": 0, \"start_date\": \"2020-01-01 00:00\"}, {\"id\": 39, \"text\": \"Measurement of APM Contribution\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 61, \"end_date\": \"2020-05-01 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 34, \"text\": \"Asset Performance Monitoring\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 92, \"end_date\": \"2020-06-01 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 58, \"text\": \"Identify trend in Production / Loss \", \"type\": \"task\", \"parent\": 34, \"duration\": 1, \"end_date\": \"2020-03-02 00:00\", \"progress\": 1, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 59, \"text\": \"Identify new solutions deployed as outcome of action tracker\", \"type\": \"task\", \"parent\": 34, \"duration\": 1, \"end_date\": \"2020-03-02 00:00\", \"progress\": 1, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 60, \"text\": \"Collect 2017-2018 data for selected sites\", \"type\": \"task\", \"parent\": 34, \"duration\": 1, \"end_date\": \"2020-03-02 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 1575164242355, \"text\": \"Identify trend in Production / Loss \", \"parent\": \"34\", \"duration\": 31, \"end_date\": \"2020-04-01 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 36, \"text\": \"24/7 Control Room Monitoring\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 274, \"end_date\": \"2020-11-01 00:00\", \"progress\": 0, \"start_date\": \"2020-02-01 00:00\"}, {\"id\": 1575164242366, \"parent\": 0, \"duration\": 91, \"end_date\": \"2020-03-01 00:00\", \"jsonData\": {\"data\": [{\"id\": 38, \"text\": \"Optimize the level of details for different reporting events\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 61, \"end_date\": \"2019-12-01 00:00\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 1575164242307, \"text\": \"adding action\", \"parent\": \"38\", \"duration\": 61, \"end_date\": \"2019-12-01 00:00\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 40, \"text\": \"Condition Monitoring System\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 61, \"end_date\": \"2019-12-01 00:00\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 35, \"text\": \"Track & report on OEM/Provider SLA performance\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 120, \"end_date\": \"2020-03-30 00:00\", \"progress\": 0, \"start_date\": \"2019-12-01 00:00\"}, {\"id\": 37, \"text\": \"Predictive analytics for equipment reliability\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 273, \"end_date\": \"2020-09-30 00:00\", \"progress\": 0, \"start_date\": \"2020-01-01 00:00\"}, {\"id\": 39, \"text\": \"Measurement of APM Contribution\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 61, \"end_date\": \"2020-05-01 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 34, \"text\": \"Asset Performance Monitoring\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 92, \"end_date\": \"2020-06-01 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 58, \"text\": \"Identify trend in Production / Loss \", \"type\": \"task\", \"parent\": 34, \"duration\": 1, \"end_date\": \"2020-03-02 00:00\", \"progress\": 1, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 59, \"text\": \"Identify new solutions deployed as outcome of action tracker\", \"type\": \"task\", \"parent\": 34, \"duration\": 1, \"end_date\": \"2020-03-02 00:00\", \"progress\": 1, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 60, \"text\": \"Collect 2017-2018 data for selected sites\", \"type\": \"task\", \"parent\": 34, \"duration\": 1, \"end_date\": \"2020-03-02 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 1575164242355, \"text\": \"Identify trend in Production / Loss \", \"parent\": \"34\", \"duration\": 31, \"end_date\": \"2020-04-01 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 36, \"text\": \"24/7 Control Room Monitoring\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 274, \"end_date\": \"2020-11-01 00:00\", \"progress\": 0, \"start_date\": \"2020-02-01 00:00\"}, {\"id\": 1575164242322, \"text\": \"Test\", \"parent\": 0, \"duration\": 1, \"end_date\": \"2019-10-02 00:00\", \"jsonData\": {\"data\": [{\"id\": 38, \"text\": \"Optimize the level of details for different reporting events\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 61, \"end_date\": \"2019-12-01 00:00\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 1575164242307, \"text\": \"adding action\", \"parent\": \"38\", \"duration\": 31, \"end_date\": \"2019-11-01 00:00\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 40, \"text\": \"Condition Monitoring System\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 31, \"end_date\": \"2019-11-01 00:00\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 35, \"text\": \"Track & report on OEM/Provider SLA performance\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 120, \"end_date\": \"2020-03-30 00:00\", \"progress\": 0, \"start_date\": \"2019-12-01 00:00\"}, {\"id\": 37, \"text\": \"Predictive analytics for equipment reliability\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 273, \"end_date\": \"2020-09-30 00:00\", \"progress\": 0, \"start_date\": \"2020-01-01 00:00\"}, {\"id\": 39, \"text\": \"Measurement of APM Contribution\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 29, \"end_date\": \"2020-03-30 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 34, \"text\": \"Asset Performance Monitoring\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 29, \"end_date\": \"2020-03-30 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 58, \"text\": \"Identify trend in Production / Loss \", \"type\": \"task\", \"parent\": 34, \"duration\": 1, \"end_date\": \"2020-03-02 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 59, \"text\": \"Identify new solutions deployed as outcome of action tracker\", \"type\": \"task\", \"parent\": 34, \"duration\": 1, \"end_date\": \"2020-03-02 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 60, \"text\": \"Collect 2017-2018 data for selected sites\", \"type\": \"task\", \"parent\": 34, \"duration\": 1, \"end_date\": \"2020-03-02 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 36, \"text\": \"24/7 Control Room Monitoring\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 213, \"end_date\": \"2020-09-30 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}], \"links\": []}, \"progress\": 1, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 1575164242337, \"parent\": 0, \"duration\": 1, \"end_date\": \"2019-10-02 00:00\", \"jsonData\": {\"data\": [{\"id\": 38, \"text\": \"Optimize the level of details for different reporting events\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 61, \"end_date\": \"2019-12-01 00:00\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 1575164242307, \"text\": \"adding action\", \"parent\": \"38\", \"duration\": 61, \"end_date\": \"2019-12-01 00:00\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 40, \"text\": \"Condition Monitoring System\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 61, \"end_date\": \"2019-12-01 00:00\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 35, \"text\": \"Track & report on OEM/Provider SLA performance\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 120, \"end_date\": \"2020-03-30 00:00\", \"progress\": 0, \"start_date\": \"2019-12-01 00:00\"}, {\"id\": 37, \"text\": \"Predictive analytics for equipment reliability\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 273, \"end_date\": \"2020-09-30 00:00\", \"progress\": 0, \"start_date\": \"2020-01-01 00:00\"}, {\"id\": 39, \"text\": \"Measurement of APM Contribution\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 61, \"end_date\": \"2020-05-01 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 34, \"text\": \"Asset Performance Monitoring\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 92, \"end_date\": \"2020-06-01 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 58, \"text\": \"Identify trend in Production / Loss \", \"type\": \"task\", \"parent\": 34, \"duration\": 1, \"end_date\": \"2020-03-02 00:00\", \"progress\": 1, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 59, \"text\": \"Identify new solutions deployed as outcome of action tracker\", \"type\": \"task\", \"parent\": 34, \"duration\": 1, \"end_date\": \"2020-03-02 00:00\", \"progress\": 1, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 60, \"text\": \"Collect 2017-2018 data for selected sites\", \"type\": \"task\", \"parent\": 34, \"duration\": 1, \"end_date\": \"2020-03-02 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 36, \"text\": \"24/7 Control Room Monitoring\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 274, \"end_date\": \"2020-11-01 00:00\", \"progress\": 0, \"start_date\": \"2020-02-01 00:00\"}, {\"id\": 1575164242322, \"text\": \"Test\", \"parent\": 0, \"duration\": 1, \"end_date\": \"2019-10-02 00:00\", \"jsonData\": {\"data\": [{\"id\": 38, \"text\": \"Optimize the level of details for different reporting events\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 61, \"end_date\": \"2019-12-01 00:00\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 1575164242307, \"text\": \"adding action\", \"parent\": \"38\", \"duration\": 31, \"end_date\": \"2019-11-01 00:00\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 40, \"text\": \"Condition Monitoring System\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 31, \"end_date\": \"2019-11-01 00:00\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 35, \"text\": \"Track & report on OEM/Provider SLA performance\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 120, \"end_date\": \"2020-03-30 00:00\", \"progress\": 0, \"start_date\": \"2019-12-01 00:00\"}, {\"id\": 37, \"text\": \"Predictive analytics for equipment reliability\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 273, \"end_date\": \"2020-09-30 00:00\", \"progress\": 0, \"start_date\": \"2020-01-01 00:00\"}, {\"id\": 39, \"text\": \"Measurement of APM Contribution\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 29, \"end_date\": \"2020-03-30 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 34, \"text\": \"Asset Performance Monitoring\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 29, \"end_date\": \"2020-03-30 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 58, \"text\": \"Identify trend in Production / Loss \", \"type\": \"task\", \"parent\": 34, \"duration\": 1, \"end_date\": \"2020-03-02 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 59, \"text\": \"Identify new solutions deployed as outcome of action tracker\", \"type\": \"task\", \"parent\": 34, \"duration\": 1, \"end_date\": \"2020-03-02 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 60, \"text\": \"Collect 2017-2018 data for selected sites\", \"type\": \"task\", \"parent\": 34, \"duration\": 1, \"end_date\": \"2020-03-02 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 36, \"text\": \"24/7 Control Room Monitoring\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 213, \"end_date\": \"2020-09-30 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}], \"links\": []}, \"progress\": 1, \"start_date\": \"2019-10-01 00:00\"}], \"links\": []}, \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 1575164242350, \"parent\": 0, \"duration\": 1, \"end_date\": \"2019-10-02 00:00\", \"jsonData\": {\"data\": [{\"id\": 38, \"text\": \"Optimize the level of details for different reporting events\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 61, \"end_date\": \"2019-12-01 00:00\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 1575164242307, \"text\": \"adding action\", \"parent\": \"38\", \"duration\": 61, \"end_date\": \"2019-12-01 00:00\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 40, \"text\": \"Condition Monitoring System\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 61, \"end_date\": \"2019-12-01 00:00\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 35, \"text\": \"Track & report on OEM/Provider SLA performance\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 120, \"end_date\": \"2020-03-30 00:00\", \"progress\": 0, \"start_date\": \"2019-12-01 00:00\"}, {\"id\": 37, \"text\": \"Predictive analytics for equipment reliability\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 273, \"end_date\": \"2020-09-30 00:00\", \"progress\": 0, \"start_date\": \"2020-01-01 00:00\"}, {\"id\": 39, \"text\": \"Measurement of APM Contribution\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 61, \"end_date\": \"2020-05-01 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 34, \"text\": \"Asset Performance Monitoring\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 92, \"end_date\": \"2020-06-01 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 58, \"text\": \"Identify trend in Production / Loss \", \"type\": \"task\", \"parent\": 34, \"duration\": 1, \"end_date\": \"2020-03-02 00:00\", \"progress\": 1, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 59, \"text\": \"Identify new solutions deployed as outcome of action tracker\", \"type\": \"task\", \"parent\": 34, \"duration\": 1, \"end_date\": \"2020-03-02 00:00\", \"progress\": 1, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 60, \"text\": \"Collect 2017-2018 data for selected sites\", \"type\": \"task\", \"parent\": 34, \"duration\": 1, \"end_date\": \"2020-03-02 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 36, \"text\": \"24/7 Control Room Monitoring\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 274, \"end_date\": \"2020-11-01 00:00\", \"progress\": 0, \"start_date\": \"2020-02-01 00:00\"}, {\"id\": 1575164242322, \"text\": \"Test\", \"parent\": 0, \"duration\": 1, \"end_date\": \"2019-10-02 00:00\", \"jsonData\": {\"data\": [{\"id\": 38, \"text\": \"Optimize the level of details for different reporting events\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 61, \"end_date\": \"2019-12-01 00:00\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 1575164242307, \"text\": \"adding action\", \"parent\": \"38\", \"duration\": 31, \"end_date\": \"2019-11-01 00:00\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 40, \"text\": \"Condition Monitoring System\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 31, \"end_date\": \"2019-11-01 00:00\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 35, \"text\": \"Track & report on OEM/Provider SLA performance\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 120, \"end_date\": \"2020-03-30 00:00\", \"progress\": 0, \"start_date\": \"2019-12-01 00:00\"}, {\"id\": 37, \"text\": \"Predictive analytics for equipment reliability\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 273, \"end_date\": \"2020-09-30 00:00\", \"progress\": 0, \"start_date\": \"2020-01-01 00:00\"}, {\"id\": 39, \"text\": \"Measurement of APM Contribution\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 29, \"end_date\": \"2020-03-30 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 34, \"text\": \"Asset Performance Monitoring\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 29, \"end_date\": \"2020-03-30 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 58, \"text\": \"Identify trend in Production / Loss \", \"type\": \"task\", \"parent\": 34, \"duration\": 1, \"end_date\": \"2020-03-02 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 59, \"text\": \"Identify new solutions deployed as outcome of action tracker\", \"type\": \"task\", \"parent\": 34, \"duration\": 1, \"end_date\": \"2020-03-02 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 60, \"text\": \"Collect 2017-2018 data for selected sites\", \"type\": \"task\", \"parent\": 34, \"duration\": 1, \"end_date\": \"2020-03-02 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 36, \"text\": \"24/7 Control Room Monitoring\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 213, \"end_date\": \"2020-09-30 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}], \"links\": []}, \"progress\": 1, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 1575164242337, \"parent\": 0, \"duration\": 1, \"end_date\": \"2019-10-02 00:00\", \"jsonData\": {\"data\": [{\"id\": 38, \"text\": \"Optimize the level of details for different reporting events\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 61, \"end_date\": \"2019-12-01 00:00\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 1575164242307, \"text\": \"adding action\", \"parent\": \"38\", \"duration\": 61, \"end_date\": \"2019-12-01 00:00\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 40, \"text\": \"Condition Monitoring System\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 61, \"end_date\": \"2019-12-01 00:00\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 35, \"text\": \"Track & report on OEM/Provider SLA performance\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 120, \"end_date\": \"2020-03-30 00:00\", \"progress\": 0, \"start_date\": \"2019-12-01 00:00\"}, {\"id\": 37, \"text\": \"Predictive analytics for equipment reliability\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 273, \"end_date\": \"2020-09-30 00:00\", \"progress\": 0, \"start_date\": \"2020-01-01 00:00\"}, {\"id\": 39, \"text\": \"Measurement of APM Contribution\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 61, \"end_date\": \"2020-05-01 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 34, \"text\": \"Asset Performance Monitoring\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 92, \"end_date\": \"2020-06-01 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 58, \"text\": \"Identify trend in Production / Loss \", \"type\": \"task\", \"parent\": 34, \"duration\": 1, \"end_date\": \"2020-03-02 00:00\", \"progress\": 1, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 59, \"text\": \"Identify new solutions deployed as outcome of action tracker\", \"type\": \"task\", \"parent\": 34, \"duration\": 1, \"end_date\": \"2020-03-02 00:00\", \"progress\": 1, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 60, \"text\": \"Collect 2017-2018 data for selected sites\", \"type\": \"task\", \"parent\": 34, \"duration\": 1, \"end_date\": \"2020-03-02 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 36, \"text\": \"24/7 Control Room Monitoring\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 274, \"end_date\": \"2020-11-01 00:00\", \"progress\": 0, \"start_date\": \"2020-02-01 00:00\"}, {\"id\": 1575164242322, \"text\": \"Test\", \"parent\": 0, \"duration\": 1, \"end_date\": \"2019-10-02 00:00\", \"jsonData\": {\"data\": [{\"id\": 38, \"text\": \"Optimize the level of details for different reporting events\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 61, \"end_date\": \"2019-12-01 00:00\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 1575164242307, \"text\": \"adding action\", \"parent\": \"38\", \"duration\": 31, \"end_date\": \"2019-11-01 00:00\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 40, \"text\": \"Condition Monitoring System\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 31, \"end_date\": \"2019-11-01 00:00\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 35, \"text\": \"Track & report on OEM/Provider SLA performance\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 120, \"end_date\": \"2020-03-30 00:00\", \"progress\": 0, \"start_date\": \"2019-12-01 00:00\"}, {\"id\": 37, \"text\": \"Predictive analytics for equipment reliability\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 273, \"end_date\": \"2020-09-30 00:00\", \"progress\": 0, \"start_date\": \"2020-01-01 00:00\"}, {\"id\": 39, \"text\": \"Measurement of APM Contribution\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 29, \"end_date\": \"2020-03-30 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 34, \"text\": \"Asset Performance Monitoring\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 29, \"end_date\": \"2020-03-30 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 58, \"text\": \"Identify trend in Production / Loss \", \"type\": \"task\", \"parent\": 34, \"duration\": 1, \"end_date\": \"2020-03-02 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 59, \"text\": \"Identify new solutions deployed as outcome of action tracker\", \"type\": \"task\", \"parent\": 34, \"duration\": 1, \"end_date\": \"2020-03-02 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 60, \"text\": \"Collect 2017-2018 data for selected sites\", \"type\": \"task\", \"parent\": 34, \"duration\": 1, \"end_date\": \"2020-03-02 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 36, \"text\": \"24/7 Control Room Monitoring\", \"type\": \"milestone\", \"parent\": 0, \"duration\": 213, \"end_date\": \"2020-09-30 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}], \"links\": []}, \"progress\": 1, \"start_date\": \"2019-10-01 00:00\"}], \"links\": []}, \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}], \"links\": [{\"id\": 1575164242338, \"type\": \"0\", \"source\": \"1575164242322\", \"target\": \"36\"}, {\"id\": 1575164242339, \"type\": \"0\", \"source\": \"1575164242337\", \"target\": \"36\"}]}, \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}], \"links\": [{\"id\": 1575164242338, \"type\": \"0\", \"source\": \"1575164242322\", \"target\": \"36\"}, {\"id\": 1575164242339, \"type\": \"0\", \"source\": \"1575164242337\", \"target\": \"36\"}]}, \"progress\": 0, \"start_date\": \"2019-12-01 00:00\"}, {\"id\": 1575214414142, \"text\": \"Another\", \"parent\": 0, \"assignId\": 76, \"assigned\": \"Joshi, Adi\", \"duration\": 31, \"end_date\": \"2020-02-01 00:00\", \"priority\": \"undefined\", \"progress\": \"\", \"start_date\": \"2020-01-01 00:00\"}], \"links\": []}',1,'2019-12-01 15:48:56','2020-03-03 09:35:55'),(7,10,6802,'{\"data\": [{\"id\": 1575819035396, \"text\": \"Define Category\", \"parent\": 0, \"target\": 38, \"assigned\": \"\", \"duration\": 31, \"end_date\": \"2019-11-01 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 1575819035401, \"text\": \"Set up the category\", \"parent\": \"1575819035396\", \"assignId\": 164, \"assigned\": \"Ebrahimi, Alex\", \"duration\": 1, \"end_date\": \"2019-10-02 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 38, \"text\": \"Start\", \"type\": \"milestone\", \"parent\": 0, \"assignId\": 239, \"assigned\": \"Lu, Jerry\", \"duration\": 0, \"end_date\": \"2019-10-01 00:00\", \"priority\": \"2\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 1575819035153, \"text\": \"Test Automation\", \"parent\": 0, \"target\": \"next:38\", \"assignId\": 239, \"assigned\": \"Lu, Jerry\", \"duration\": 31, \"end_date\": \"2019-11-01 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 1576208370894, \"text\": \"New task\", \"parent\": \"1575819035153\", \"target\": 1575819035158, \"assigned\": \"\", \"duration\": 31, \"end_date\": \"2019-12-02 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2019-11-01 00:00\"}, {\"id\": 1575819035158, \"text\": \"New task\", \"parent\": \"1575819035153\", \"assigned\": \"\", \"duration\": 61, \"end_date\": \"2020-01-01 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2019-11-01 00:00\"}, {\"id\": 1582861245265, \"text\": \"This is the testing task\", \"parent\": 0, \"assignId\": 237, \"assigned\": \"Ebrahimi, Alex\", \"duration\": 61, \"end_date\": \"2019-12-01 00:00\", \"priority\": \"1\", \"progress\": 0.2, \"start_date\": \"2019-10-01 00:00\"}, {\"id\": 1588609760021, \"text\": \"New task\", \"parent\": 0, \"duration\": -366, \"end_date\": \"2019-03-31 20:00\", \"progress\": 0, \"start_date\": \"2020-03-31 20:00\", \"progressTxt\": \"0%\"}], \"links\": []}',1,'2019-12-05 04:48:03','2020-05-04 23:37:02'),(26,10,6803,'{\"data\": [{\"id\": 1576254226241, \"text\": \"Assess\", \"parent\": 0, \"duration\": 10, \"end_date\": \"2019-12-11 00:00\", \"progress\": 0, \"start_date\": \"2019-12-01 00:00\"}, {\"id\": 1581673824237, \"text\": \"New task\", \"parent\": \"1576254226241\", \"assigned\": \"\", \"duration\": 1, \"end_date\": \"2019-12-02 00:00\", \"priority\": \"1\", \"progress\": 0, \"start_date\": \"2019-12-01 00:00\"}, {\"id\": 1576254226246, \"text\": \"RCA\", \"parent\": 0, \"assigned\": \"Ebrahimi, Alex\", \"duration\": 10, \"end_date\": \"2019-12-20 00:00\", \"priority\": \"undefined\", \"progress\": \"\", \"start_date\": \"2019-12-10 00:00\"}, {\"id\": 1576254226247, \"text\": \"Solution\", \"parent\": 0, \"assigned\": \"\", \"duration\": 8, \"end_date\": \"2019-12-23 00:00\", \"priority\": \"1\", \"progress\": 0, \"start_date\": \"2019-12-15 00:00\"}], \"links\": []}',1,'2019-12-13 16:25:30','2020-03-04 14:24:10'),(27,2,118,'{\"data\": [{\"id\": 1576268016880, \"text\": \"Prioritize Cost Control Levers\", \"parent\": 0, \"target\": 1576268016881, \"assigned\": \"\", \"duration\": 10, \"end_date\": \"2019-11-30 00:00\", \"priority\": \"2\", \"progress\": 0, \"start_date\": \"2019-11-20 00:00\"}, {\"id\": 1576268016875, \"text\": \"Discover Opportunities\", \"parent\": 1576268016880, \"target\": \"next:null\", \"assigned\": \"\", \"duration\": 20, \"end_date\": \"2019-11-21 00:00\", \"priority\": \"1\", \"progress\": 0, \"start_date\": \"2019-11-01 00:00\"}, {\"id\": 1576268016881, \"text\": \"Deployment Plan\", \"parent\": 0, \"assigned\": \"Kaufman(org), Brad\", \"duration\": 15, \"end_date\": \"2019-12-16 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2019-12-01 00:00\"}, {\"id\": 1579599364918, \"text\": \"new takk\", \"parent\": 0, \"assigned\": \"Ahmed, Alauddin\", \"duration\": 1, \"end_date\": \"2019-11-02 00:00\", \"priority\": \"1\", \"progress\": 0, \"start_date\": \"2019-11-01 00:00\"}], \"links\": []}',1,'2019-12-13 20:17:06','2020-02-12 12:08:42'),(28,2,6797,'{\"data\": [{\"id\": 1580211788182, \"text\": \"t2.1\", \"parent\": 0, \"target\": 1579518896184, \"assignId\": 69, \"assigned\": \"Allen, Robert\", \"duration\": 30, \"end_date\": \"2020-07-01 00:00\", \"priority\": \"1\", \"progress\": \"\", \"start_date\": \"2020-06-01 00:00\"}, {\"id\": 1579518896184, \"text\": \"t3\", \"parent\": 0, \"target\": 1579516158513, \"assigned\": \"\", \"duration\": 30, \"end_date\": \"2020-05-31 00:00\", \"priority\": \"2\", \"progress\": 0, \"start_date\": \"2020-05-01 00:00\"}, {\"id\": 1579518578408, \"text\": \"Review maintenance schedules\", \"parent\": 0, \"target\": 1579516158513, \"assignId\": 70, \"assigned\": \"Stockman, Elizabeth\", \"duration\": 90, \"end_date\": \"2020-05-14 00:00\", \"priority\": \"1\", \"progress\": \"0.3\", \"start_date\": \"2020-02-14 00:00\"}, {\"id\": 1579516158513, \"text\": \"t1\", \"parent\": 0, \"assignId\": 67, \"assigned\": \"Jackson, Jane\", \"duration\": 4, \"end_date\": \"2020-02-01 00:00\", \"priority\": \"3\", \"progress\": \"\", \"start_date\": \"2020-01-28 00:00\"}, {\"id\": 1583003805709, \"text\": \"Data review\", \"parent\": 0, \"assignId\": 67, \"assigned\": \"Jackson, Jane\", \"duration\": 76, \"end_date\": \"2020-05-01 00:00\", \"priority\": \"1\", \"progress\": \"\", \"start_date\": \"2020-02-15 00:00\"}, {\"id\": 1583110945785, \"text\": \"Inventory reviews\", \"parent\": 0, \"assignId\": 8, \"assigned\": \"Kramer, Brad\", \"duration\": 60, \"end_date\": \"2020-07-31 00:00\", \"priority\": \"2\", \"progress\": \"\", \"start_date\": \"2020-06-01 00:00\"}], \"links\": [{\"id\": 1580213972992, \"type\": \"2\", \"source\": \"1579518896184\", \"target\": \"1580211788182\"}, {\"id\": 1580213972993, \"type\": \"0\", \"source\": \"1579516158513\", \"target\": \"1579518578408\"}, {\"id\": 1580213972994, \"type\": \"0\", \"source\": \"1579518578408\", \"target\": \"1579518896184\"}]}',1,'2020-01-03 18:34:57','2020-03-03 09:26:23'),(32,1,111,'{\"data\": [{\"id\": 1579513870285, \"text\": \"New task test5\", \"parent\": 0, \"assigned\": \"\", \"duration\": 3, \"end_date\": \"2020-01-04 00:00\", \"priority\": \"2\", \"progress\": 0, \"start_date\": \"2020-01-01 00:00\"}, {\"id\": 1579513870294, \"text\": \"New task feb\", \"parent\": 0, \"assigned\": \"\", \"duration\": 3, \"end_date\": \"2020-02-04 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2020-02-01 00:00\"}, {\"id\": 1579513870295, \"text\": \"New task march ren\", \"parent\": 0, \"assigned\": \"\", \"duration\": 12, \"end_date\": \"2020-03-13 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}], \"links\": []}',1,'2020-01-20 09:53:02','2020-01-20 09:55:59'),(34,1,37,'{\"data\": [{\"id\": 1579663203152, \"text\": \"Dev\", \"parent\": 0, \"assigned\": \"aaa, demo123\", \"duration\": 1, \"end_date\": \"2019-12-02 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2019-12-01 00:00\"}], \"links\": []}',1,'2020-01-22 03:20:27','2020-01-22 03:20:27'),(35,1,20,'{\"data\": [{\"id\": 1579762039733, \"text\": \"New task\", \"parent\": 0, \"assigned\": \"\", \"duration\": 1, \"end_date\": \"2019-12-02 00:00\", \"priority\": \"2\", \"progress\": 0, \"start_date\": \"2019-12-01 00:00\"}], \"links\": []}',1,'2020-01-23 06:47:34','2020-01-23 06:47:34'),(38,1,29,'{\"data\": [{\"id\": 1579784977967, \"text\": \"New taskNew taskNew taskNew taskNew taskNew taskNew taskNew taskNew taskNew taskNew task\", \"parent\": 0, \"assignId\": 93, \"assigned\": \"Wang, Christina\", \"duration\": 1, \"end_date\": \"2019-12-02 00:00\", \"priority\": \"1\", \"progress\": \"\", \"start_date\": \"2019-12-01 00:00\"}], \"links\": []}',1,'2020-01-23 13:09:59','2020-03-03 09:24:05'),(40,1,6807,'{\"data\": [{\"id\": 1580293473748, \"text\": \"QuidProtesk\", \"parent\": 0, \"assigned\": \"\", \"duration\": 1, \"end_date\": \"2019-12-02 00:00\", \"priority\": \"1\", \"progress\": 0, \"start_date\": \"2019-12-01 00:00\"}], \"links\": []}',0,'2020-01-29 10:24:52','2020-02-07 09:09:23'),(41,9,116,'{\"data\": [{\"id\": 1580379697732, \"text\": \"Scrum Meeting\", \"parent\": 0, \"assigned\": \"\", \"duration\": 3, \"end_date\": \"2019-12-04 00:00\", \"priority\": \"1\", \"progress\": 0, \"start_date\": \"2019-12-01 00:00\"}], \"links\": []}',1,'2020-01-30 10:22:25','2020-01-30 10:22:25'),(42,9,6793,'{\"data\": [{\"id\": 1580380249829, \"text\": \"2 expanded test task for Dummy\", \"parent\": 0, \"target\": 1580380249820, \"assigned\": \"\", \"duration\": 1, \"end_date\": \"2019-12-02 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2019-12-01 00:00\"}, {\"id\": 1580380249820, \"text\": \"Test action for dummy company\", \"parent\": 0, \"assigned\": \"\", \"duration\": 1, \"end_date\": \"2019-12-02 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2019-12-01 00:00\"}, {\"id\": 1580380249830, \"text\": \"Meeting on dummy comp\", \"parent\": \"1580380249820\", \"target\": 1580380249829, \"assigned\": \"\", \"duration\": 1, \"end_date\": \"2019-12-02 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2019-12-01 00:00\"}], \"links\": []}',1,'2020-01-30 10:31:07','2020-02-07 09:04:22'),(1018,9,6793,'{\"data\": [{\"id\": 1580380249829, \"text\": \"2 expanded test task for Dummy\", \"parent\": 0, \"target\": 1580380249820, \"assigned\": \"\", \"duration\": 1, \"end_date\": \"2019-12-02 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2019-12-01 00:00\"}, {\"id\": 1580380249820, \"text\": \"Test action for dummy company\", \"parent\": 0, \"assigned\": \"\", \"duration\": 1, \"end_date\": \"2019-12-02 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2019-12-01 00:00\"}, {\"id\": 1580380249830, \"text\": \"Meeting on dummy comp\", \"parent\": \"1580380249820\", \"target\": 1580380249829, \"assigned\": \"\", \"duration\": 1, \"end_date\": \"2019-12-02 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2019-12-01 00:00\"}], \"links\": []}',1,'2020-01-30 10:31:07','2020-02-07 09:04:22'),(1019,9,140,'{\"data\": [{\"id\": 1581332259187, \"text\": \"New task Test 3\", \"parent\": 0, \"assigned\": \"\", \"duration\": 1, \"end_date\": \"2020-01-02 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2020-01-01 00:00\"}], \"links\": []}',1,'2020-02-10 10:57:55','2020-02-10 13:16:30'),(1024,9,6836,'{\"data\": [{\"id\": 1581492358246, \"text\": \"ran22newupdate\", \"parent\": 0, \"assigned\": \"\", \"duration\": 8, \"end_date\": \"2020-02-22 00:00\", \"priority\": \"1\", \"progress\": 0, \"start_date\": \"2020-02-14 00:00\"}], \"links\": []}',1,'2020-02-12 07:28:27','2020-02-19 09:52:19'),(1026,10,6805,'{\"data\": [], \"links\": []}',1,'2020-02-25 05:48:47','2020-03-17 10:54:35'),(1027,1,121,'{\"data\": [{\"id\": 1582805353027, \"text\": \"New task normal 1\", \"parent\": 0, \"assignId\": 67, \"assigned\": \"Jackson, Jane\", \"duration\": 1, \"end_date\": \"2020-01-02 00:00\", \"priority\": \"1\", \"progress\": 0, \"start_date\": \"2020-01-01 00:00\"}], \"links\": []}',1,'2020-02-27 12:09:41','2020-02-27 12:09:41'),(1028,3,28,'{\"data\": [{\"id\": 1582861245246, \"text\": \"New task\", \"parent\": 0, \"assigned\": \"\", \"duration\": 1, \"end_date\": \"2020-01-02 00:00\", \"priority\": \"1\", \"progress\": 0, \"start_date\": \"2020-01-01 00:00\"}], \"links\": []}',1,'2020-02-28 03:42:27','2020-02-28 03:42:27'),(1029,10,6844,'{\"data\": [{\"id\": 1583373747457, \"text\": \"New task\", \"parent\": 0, \"assigned\": \"User, Test\", \"duration\": 1, \"end_date\": \"2020-02-02 00:00\", \"priority\": \"1\", \"progress\": \"\", \"start_date\": \"2020-02-01 00:00\"}], \"links\": []}',1,'2020-03-05 02:03:55','2020-03-05 02:04:23'),(1030,10,6846,'{\"data\": [{\"id\": 1583384035918, \"text\": \"Database structure\", \"parent\": 0, \"assigned\": \"User, Test\", \"duration\": 29, \"end_date\": \"2020-03-01 00:00\", \"priority\": \"1\", \"progress\": 0, \"start_date\": \"2020-02-01 00:00\"}, {\"id\": 1583414590888, \"text\": \"Approval of DB\", \"parent\": \"1583384035918\", \"assigned\": \"Liu, Jerry\", \"duration\": 23, \"end_date\": \"2020-03-24 00:00\", \"priority\": \"1\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 1583401918683, \"text\": \"Mockup Build\", \"parent\": 0, \"assigned\": \"Liu, Jerry\", \"duration\": 49, \"end_date\": \"2020-04-19 00:00\", \"priority\": \"1\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 1583490165257, \"text\": \"Development\", \"parent\": 0, \"assigned\": \"User, Test\", \"duration\": 61, \"end_date\": \"2020-06-01 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2020-04-01 00:00\"}, {\"id\": 1583409773408, \"text\": \"Testing\", \"parent\": 0, \"target\": 1583490165258, \"assignId\": 239, \"assigned\": \"User, Test\", \"duration\": 90, \"end_date\": \"2020-06-30 00:00\", \"priority\": \"1\", \"progress\": 0, \"start_date\": \"2020-04-01 00:00\"}, {\"id\": 1583490165258, \"text\": \"SEO\", \"parent\": 0, \"assigned\": \"User, Test\", \"duration\": 23, \"end_date\": \"2020-03-22 00:00\", \"priority\": \"1\", \"progress\": 0, \"start_date\": \"2020-02-28 00:00\"}, {\"id\": 1583490165259, \"text\": \"Permotion\", \"parent\": 0, \"assigned\": \"User, Test\", \"duration\": 31, \"end_date\": \"2020-04-01 00:00\", \"priority\": \"1\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 1583490165260, \"text\": \"Go Live\", \"parent\": 0, \"assigned\": \"\", \"duration\": 45, \"end_date\": \"2020-05-15 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2020-03-31 00:00\"}, {\"id\": 1583490363520, \"text\": \"First Milestone fo Dubai\", \"parent\": 0, \"assigned\": \"User, Test\", \"duration\": 20, \"end_date\": \"2020-07-21 00:00\", \"priority\": \"1\", \"progress\": 0, \"start_date\": \"2020-07-01 00:00\"}, {\"id\": 1583490660946, \"text\": \"New task\", \"parent\": 0, \"assigned\": \"Liu, Jerry\", \"duration\": 15, \"end_date\": \"2021-02-16 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2021-02-01 00:00\"}], \"links\": []}',1,'2020-03-05 05:37:25','2020-03-06 12:53:08'),(1031,55,6843,'{\"data\": [{\"id\": 1583399940389, \"text\": \"New task\", \"parent\": 0, \"assigned\": \"Jot, Prabh Kbihm\", \"duration\": 1, \"end_date\": \"2020-02-02 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2020-02-01 00:00\"}, {\"id\": 1583402478387, \"text\": \"New tasksdasad\", \"parent\": 0, \"assigned\": \"KBIHM, Prabhjot\", \"duration\": 1, \"end_date\": \"2020-02-02 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2020-02-01 00:00\"}, {\"id\": 1583403324329, \"text\": \"New task\", \"parent\": 0, \"assigned\": \"KBIHM, Prabhjot\", \"duration\": 1, \"end_date\": \"2020-02-02 00:00\", \"priority\": \"1\", \"progress\": 0.2, \"start_date\": \"2020-02-01 00:00\"}, {\"id\": 1583403828708, \"text\": \"sdafsafdsad\", \"parent\": 0, \"assigned\": \"KBIHM, Prabhjot\", \"duration\": 1, \"end_date\": \"2020-02-02 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2020-02-01 00:00\"}], \"links\": []}',1,'2020-03-05 09:19:21','2020-03-05 10:24:05'),(1032,10,6845,'{\"data\": [{\"id\": 1583404895739, \"text\": \"New task 3\", \"parent\": 0, \"assigned\": \"User, Test\", \"duration\": 1, \"end_date\": \"2020-02-02 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2020-02-01 00:00\"}], \"links\": []}',1,'2020-03-05 10:45:41','2020-03-05 10:45:41'),(1033,10,6851,'{\"data\": [{\"id\": 1583468741463, \"text\": \"First task 123456\", \"parent\": 0, \"assignId\": \"\", \"assigned\": \"User, Test\", \"duration\": 1, \"end_date\": \"2020-02-02 00:00\", \"priority\": \"1\", \"progress\": \"\", \"start_date\": \"2020-02-01 00:00\"}], \"links\": []}',1,'2020-03-06 04:25:55','2020-03-06 06:19:18'),(1034,10,6849,'{\"data\": [{\"id\": 1583459340104, \"text\": \"Gap Analysis\", \"parent\": 0, \"assigned\": \"Ahmed, Alauddin\", \"duration\": 64, \"end_date\": \"2020-04-21 00:00\", \"priority\": \"1\", \"progress\": 0.4, \"start_date\": \"2020-02-17 00:00\", \"progressTxt\": \"40%\"}, {\"id\": 1583522740901, \"text\": \"Identify Gap Areas\", \"parent\": \"1583459340104\", \"assigned\": \"Angada, Aishwarya\", \"duration\": 21, \"end_date\": \"2020-03-30 00:00\", \"priority\": \"1\", \"progress\": 0.8, \"start_date\": \"2020-03-09 00:00\", \"progressTxt\": \"80%\"}, {\"id\": 1583522740903, \"text\": \"Define the desired state - structure, process, tech.\", \"parent\": \"1583459340104\", \"assigned\": \"Ahmed, Alauddin\", \"duration\": 46, \"end_date\": \"2020-05-01 00:00\", \"priority\": \"undefined\", \"progress\": 0.4928571428571429, \"start_date\": \"2020-03-16 00:00\", \"progressTxt\": \"40%\"}, {\"id\": 1583522740902, \"text\": \"Prioritize Opportunities for Improvements\", \"parent\": \"1583459340104\", \"target\": \"next:1583522740903\", \"assigned\": \"Angada, Aishwarya\", \"duration\": 61, \"end_date\": \"2020-06-01 00:00\", \"priority\": \"1\", \"progress\": 0.09782608695652174, \"start_date\": \"2020-04-01 00:00\", \"progressTxt\": \"00%\"}, {\"id\": 1583469520436, \"text\": \"Stakeholder Management\", \"parent\": 0, \"assigned\": \"James, McRobie\", \"duration\": 122, \"end_date\": \"2020-08-01 00:00\", \"priority\": \"2\", \"progress\": 0, \"start_date\": \"2020-04-01 00:00\", \"progressTxt\": \"0%\"}, {\"id\": 1584064747845, \"text\": \"Stakeholder Identification\", \"parent\": \"1583469520436\", \"assigned\": \"James, McRobie\", \"duration\": 10, \"end_date\": \"2020-04-11 00:00\", \"priority\": \"1\", \"progress\": 0, \"start_date\": \"2020-04-01 00:00\"}, {\"id\": 1584064747846, \"text\": \"Comm. Plan\", \"parent\": \"1583469520436\", \"assigned\": \"Ahmed, Alauddin\", \"duration\": 10, \"end_date\": \"2020-04-20 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2020-04-10 00:00\"}, {\"id\": 1584064747847, \"text\": \"Stakeholder Communication\", \"parent\": \"1583469520436\", \"assigned\": \"James, McRobie\", \"duration\": 72, \"end_date\": \"2020-07-01 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2020-04-20 00:00\"}, {\"id\": 1583469520437, \"text\": \"Template Creation\", \"parent\": 0, \"assigned\": \"Angada, Aishwarya\", \"duration\": 61, \"end_date\": \"2020-07-01 00:00\", \"priority\": \"1\", \"progress\": 0, \"start_date\": \"2020-05-01 00:00\"}, {\"id\": 1584245961536, \"text\": \"Create Template\", \"parent\": \"1583469520437\", \"assigned\": \"\", \"duration\": 15, \"end_date\": \"2020-05-16 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2020-05-01 00:00\"}, {\"id\": 1584245961545, \"text\": \"Review and Feedback\", \"parent\": \"1583469520437\", \"assigned\": \"\", \"duration\": 15, \"end_date\": \"2020-05-30 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2020-05-15 00:00\"}, {\"id\": 1584245961546, \"text\": \"Document and Review\", \"parent\": \"1583469520437\", \"assigned\": \"Angada, Aishwarya\", \"duration\": 30, \"end_date\": \"2020-07-01 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2020-06-01 00:00\"}, {\"id\": 1583469520438, \"text\": \"Deployment Plan\", \"parent\": 0, \"assigned\": \"James, McRobie\", \"duration\": 30, \"end_date\": \"2020-07-01 00:00\", \"priority\": \"undefined\", \"progress\": 0, \"start_date\": \"2020-06-01 00:00\"}, {\"id\": 1583522740904, \"text\": \"Phased Deployment\", \"parent\": 0, \"assigned\": \"James, McRobie\", \"duration\": 74, \"end_date\": \"2020-09-13 00:00\", \"priority\": \"1\", \"progress\": 0, \"start_date\": \"2020-07-01 00:00\"}], \"links\": []}',1,'2020-03-06 04:38:38','2020-04-18 12:00:56'),(1035,10,6852,'{\"data\": [{\"id\": 1583595759875, \"text\": \"This 1 task\", \"parent\": 0, \"assigned\": \"James, McRobie\", \"duration\": 30, \"end_date\": \"2020-03-02 00:00\", \"priority\": \"1\", \"progress\": 0, \"start_date\": \"2020-02-01 00:00\"}, {\"id\": 1583595759884, \"text\": \"This is 2nd\", \"parent\": 0, \"assigned\": \"James, McRobie\", \"duration\": 90, \"end_date\": \"2020-05-01 00:00\", \"priority\": \"1\", \"progress\": 0, \"start_date\": \"2020-02-01 00:00\"}, {\"id\": 1583595759885, \"text\": \"This is third\", \"parent\": 0, \"assigned\": \"James, McRobie\", \"duration\": 300, \"end_date\": \"2020-11-27 00:00\", \"priority\": \"1\", \"progress\": 0, \"start_date\": \"2020-02-01 00:00\"}], \"links\": []}',1,'2020-03-07 15:44:23','2020-03-07 15:44:23'),(1036,10,6856,'{\"data\": [{\"id\": 1584745874241, \"text\": \"Identify the Major Components\", \"parent\": 0, \"assigned\": \"Harrop, Rick\", \"duration\": 28, \"end_date\": \"2020-03-01 00:00\", \"priority\": \"1\", \"progress\": 0.7254901960784313, \"start_date\": \"2020-02-02 00:00\", \"progressTxt\": \"70%\"}, {\"id\": 1586883534968, \"text\": \"New task\", \"parent\": \"1584745874241\", \"duration\": 121, \"end_date\": \"2020-06-01 05:30\", \"progress\": 0, \"start_date\": \"2020-02-01 00:00\", \"progressTxt\": \"0%\"}, {\"id\": 1584745874278, \"text\": \"Define High Level Process Map\", \"parent\": 0, \"assigned\": \"Ahmed, Alauddin\", \"duration\": 42, \"end_date\": \"2020-03-30 00:00\", \"priority\": \"3\", \"progress\": 1, \"start_date\": \"2020-02-17 00:00\", \"progressTxt\": \"100%\"}, {\"id\": 1584745874279, \"text\": \"Identify Process Issues\", \"parent\": 0, \"assigned\": \"Ahmed, Alauddin\", \"duration\": 29, \"end_date\": \"2020-03-30 00:00\", \"priority\": \"1\", \"progress\": 0.7202797202797203, \"start_date\": \"2020-03-01 00:00\"}, {\"id\": 1585166181131, \"text\": \"Document the Process\", \"parent\": 0, \"assigned\": \"Angada, Aishwarya\", \"duration\": 61, \"end_date\": \"2020-05-01 00:00\", \"priority\": \"1\", \"progress\": 0.5, \"start_date\": \"2020-03-01 00:00\", \"progressTxt\": \"50%\"}, {\"id\": 1585166181132, \"text\": \"Define Target Values for RTS\", \"parent\": 0, \"assigned\": \"Harrop, Rick\", \"duration\": 30, \"end_date\": \"2020-05-01 00:00\", \"priority\": \"1\", \"progress\": 0, \"start_date\": \"2020-04-01 00:00\"}, {\"id\": 1585166181133, \"text\": \"Share and Align with Suppliers - OEM / ISP\", \"parent\": 0, \"assigned\": \"Ahmed, Alauddin\", \"duration\": 29, \"end_date\": \"2020-05-30 00:00\", \"priority\": \"2\", \"progress\": 0, \"start_date\": \"2020-05-01 00:00\"}], \"links\": [{\"id\": 1587226859537, \"type\": \"1\", \"source\": \"1584745874241\", \"target\": \"1585166181131\"}]}',1,'2020-03-20 23:44:59','2020-04-23 19:01:48'),(1037,10,6858,'{\"data\": [{\"id\": 1587506232012, \"text\": \"Solar production Theoretical cal. - Cornwall\", \"parent\": 0, \"assigned\": \"Zafar, Waleed\", \"duration\": 60, \"end_date\": \"2020-04-29 20:00\", \"priority\": \"2\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\", \"progressTxt\": \"0%\"}, {\"id\": 1587506232015, \"text\": \"MB analysis @ SL & RL\", \"parent\": 0, \"assigned\": \"Zafar, Waleed\", \"duration\": 31, \"end_date\": \"2020-04-01 00:00\", \"priority\": \"2\", \"progress\": 0, \"start_date\": \"2020-02-29 19:00\", \"progressTxt\": \"0%\"}, {\"id\": 1587506232028, \"text\": \"Algonquin Category Deployment\", \"parent\": 0, \"duration\": 25, \"end_date\": \"2020-05-09 20:00\", \"progress\": 0, \"start_date\": \"2020-04-14 20:00\", \"progressTxt\": \"0%\"}, {\"id\": 1587598128347, \"text\": \"Custom alarm @ Amherst based on Set point\", \"parent\": 0, \"assigned\": \"Ebrahimi, Alex\", \"duration\": 15, \"end_date\": \"2020-04-29 20:00\", \"priority\": \"2\", \"progress\": 0, \"start_date\": \"2020-04-14 20:00\", \"progressTxt\": \"0%\"}, {\"id\": 1587598128348, \"text\": \"Graph widgets\", \"parent\": 0, \"assigned\": \"Ebrahimi, Alex\", \"duration\": 10, \"end_date\": \"2020-04-29 20:00\", \"priority\": \"2\", \"progress\": 0, \"start_date\": \"2020-04-19 20:00\", \"progressTxt\": \"0%\"}], \"links\": []}',1,'2020-04-21 22:01:13','2020-04-22 23:34:08'),(1038,55,6848,'{\"data\": [{\"id\": 1587824335325, \"text\": \"Asset Performance Monitoring\", \"parent\": 0, \"assigned\": \"Sandhu, Vijay\", \"duration\": 92, \"end_date\": \"2020-06-01 00:00\", \"priority\": \"1\", \"progress\": 0.2, \"assignedId\": 251, \"start_date\": \"2020-03-01 00:00\", \"progressTxt\": \"20%\"}, {\"id\": 1587824335400, \"text\": \"24/7 Control Room Monitoring\", \"parent\": \"1587824335325\", \"assigned\": \"Sandhu, Vijay\", \"duration\": 122, \"end_date\": \"2020-07-01 00:00\", \"priority\": \"1\", \"progress\": 0.1, \"assignedId\": 251, \"start_date\": \"2020-03-01 00:00\", \"progressTxt\": \"10%\"}, {\"id\": 1588580248993, \"text\": \"this is demo task\", \"parent\": \"1587824335325\", \"assigned\": \"Sandhu, Vijay\", \"duration\": 92, \"end_date\": \"2020-06-01 00:00\", \"priority\": \"1\", \"progress\": 0, \"assignedId\": 251, \"start_date\": \"2020-03-01 00:00\", \"progressTxt\": \"0%\"}, {\"id\": 1588580387538, \"text\": \"New task\", \"parent\": \"1587824335325\", \"duration\": 111, \"end_date\": \"2020-06-20 05:30\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\", \"progressTxt\": \"0%\"}, {\"id\": 1588580387553, \"text\": \"New task\", \"parent\": 0, \"duration\": 1, \"end_date\": \"2020-03-02 00:00\", \"progress\": 0, \"start_date\": \"2020-03-01 00:00\", \"progressTxt\": \"0%\"}], \"links\": []}',1,'2020-04-25 14:27:35','2020-05-05 14:49:24'),(1039,1,6859,'{\"data\": [{\"id\": 1588195771440, \"text\": \"P1 to P5 Deployment Strategy\", \"parent\": 0, \"assigned\": \"Ahmed, Alauddin\", \"duration\": 33, \"end_date\": \"2020-06-01 00:00\", \"priority\": \"1\", \"progress\": 0, \"assignedId\": 57, \"start_date\": \"2020-04-28 20:00\", \"progressTxt\": \"0%\"}, {\"id\": 1588195936897, \"text\": \"Thermal KPI\", \"parent\": 0, \"assigned\": \"Dhuru, Shreyas\", \"duration\": 30, \"end_date\": \"2020-05-28 20:00\", \"priority\": \"1\", \"progress\": 0, \"assignedId\": 253, \"start_date\": \"2020-04-28 20:00\", \"progressTxt\": \"0%\"}, {\"id\": 1588366699051, \"text\": \"PM Methodology\", \"parent\": 0, \"assigned\": \"Angada, Aishwarya\", \"duration\": 61, \"end_date\": \"2020-06-28 20:00\", \"progress\": 0, \"assignedId\": 248, \"start_date\": \"2020-04-28 20:00\", \"progressTxt\": \"0%\"}, {\"id\": 1588366699052, \"text\": \"Engineering COE\", \"parent\": 0, \"assigned\": \"Ahmed, Alauddin\", \"duration\": 30, \"end_date\": \"2020-05-28 20:00\", \"progress\": 0, \"assignedId\": 57, \"start_date\": \"2020-04-28 20:00\", \"progressTxt\": \"0%\"}, {\"id\": 1588609652471, \"text\": \"EPIC Process Customer Feedback\", \"parent\": 0, \"assigned\": \"Ahmed, Alauddin\", \"duration\": 8, \"end_date\": \"2020-05-06 20:00\", \"priority\": \"1\", \"progress\": 0, \"assignedId\": 57, \"start_date\": \"2020-04-28 20:00\", \"progressTxt\": \"0%\"}], \"links\": []}',1,'2020-04-29 21:31:24','2020-05-04 16:29:07');
/*!40000 ALTER TABLE `gantt` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_ins_actions` AFTER INSERT ON `gantt` FOR EACH ROW begin
    DECLARE jsonText,ganttTaskId VARCHAR(255);
    DECLARE json_data,json,product LONGTEXT;
    
    declare thetitle varchar(100);
    DECLARE i INT DEFAULT 0;  
  select title from Projects where id = NEW.projectId into thetitle;
    SELECT jsonData from Gantt where id=NEW.id INTO json;   
    SELECT json->"$.data" INTO json_data;  
    WHILE i < JSON_LENGTH(json_data) DO
    
    SELECT JSON_EXTRACT(json_data,CONCAT('$[',i,']')) INTO product;
    SELECT REPLACE(product->"$.text",'"','') INTO jsonText;
    SELECT REPLACE(product->"$.id",'"','') INTO ganttTaskId;
    insert into SearchData (orgId,    foreignId,    ganttTaskId, title,    project,  source, active) 
                    values (NEW.orgId,NEW.projectId,ganttTaskId, jsonText, thetitle, 'Actions', 1);

        SELECT i + 1 INTO i;
    END WHILE;
            end */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_upd_actions` AFTER UPDATE ON `gantt` FOR EACH ROW begin
    DECLARE jsonText, ganttTaskId VARCHAR(255);
    DECLARE json_data,json,product,updated LONGTEXT;
    
    declare thetitle varchar(100);
    DECLARE i INT DEFAULT 0;  
update SearchData set active=0 where foreignId = NEW.projectId and source = 'Actions';
   select title from Projects where id = NEW.projectId into thetitle;
    SELECT jsonData from Gantt where id=NEW.id INTO json;   
    SELECT json->"$.data" INTO json_data;  
    WHILE i < JSON_LENGTH(json_data) DO
    
    SELECT JSON_EXTRACT(json_data,CONCAT('$[',i,']')) INTO product;
    SELECT REPLACE(product->"$.text",'"','') INTO jsonText;
SELECT REPLACE(product->"$.id",'"','') INTO ganttTaskId;
    insert into SearchData (orgId,    foreignId,    ganttTaskId, title,    project,  source, active) 
                    values (NEW.orgId,NEW.projectId,ganttTaskId, jsonText, thetitle, 'Actions', 1)
    on duplicate key update
foreignId = NEW.projectId,
                title = jsonText,
ganttTaskId = ganttTaskId,
active = 1,
 
                project = thetitle;

        SELECT i + 1 INTO i;
    END WHILE;
            end */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `ideas`
--

DROP TABLE IF EXISTS `ideas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ideas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `ideaText` text,
  `nodeId` varchar(20) DEFAULT NULL,
  `orgId` int NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `Ideas_Organizations_id_fk` (`orgId`),
  CONSTRAINT `Ideas_Organizations_id_fk` FOREIGN KEY (`orgId`) REFERENCES `organizations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ideas`
--

LOCK TABLES `ideas` WRITE;
/*!40000 ALTER TABLE `ideas` DISABLE KEYS */;
INSERT INTO `ideas` VALUES (1,NULL,'First idea here.  And more text.','_al6om6znz',2,'2019-07-09 20:42:15','2019-07-23 00:19:10'),(2,'Reduce operating costs','Ideas for reducing operating costs.','_o4r47dq71',2,'2019-07-09 22:39:38','2019-08-09 18:08:34'),(3,NULL,'Third idea.','_z3uk0721f',2,'2019-07-09 22:41:57','2019-07-19 15:55:41'),(4,NULL,'Idea text goes here.','_uguzpgdta',2,'2019-07-19 15:55:42','2019-07-19 15:55:42'),(6,NULL,'Add other ideas here.  Add other ideas here.  Add other ideas here.  Add other ideas here.  Add other ideas here.  Add other ideas here.  Add other ideas here.  Add other ideas here.  Add other ideas here.  \n\nAdd some text here.',NULL,2,'2019-07-22 23:51:23','2019-07-22 23:51:23'),(7,NULL,'First idea here.  Adding text now.',NULL,2,'2019-07-22 23:56:38','2019-07-22 23:56:38'),(8,NULL,'New idea on 7/22.',NULL,2,'2019-07-23 00:19:36','2019-07-23 00:19:36'),(9,NULL,'Save new idea for \"Review supply chain processes\".',NULL,2,'2019-07-23 01:41:49','2019-07-23 01:41:49'),(10,NULL,'Adding text for \"review supply chain processes\".',NULL,2,'2019-07-23 01:47:46','2019-07-23 01:47:46'),(11,'white','New idea text here.','_t8ln1vlwa',2,'2019-07-23 01:50:30','2019-07-23 01:51:25'),(12,'Review supply chain processes','Review Sourcing Strategy, P2P, Spend Analysis','_uajrljib9',2,'2019-07-23 01:52:01','2019-09-02 21:13:19'),(13,'Optimize supply chain','Adjust minimum order level','_ea00nojwy',7,'2019-08-10 23:13:02','2019-08-10 23:13:25'),(14,'Optimize supply chain','Adjust minimum order level','_ea00nojwy',7,'2019-08-10 23:13:04','2019-08-10 23:13:25');
/*!40000 ALTER TABLE `ideas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kpiprojects`
--

DROP TABLE IF EXISTS `kpiprojects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kpiprojects` (
  `projectId` int NOT NULL,
  `kpiId` int NOT NULL,
  `active` tinyint DEFAULT '1',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`projectId`,`kpiId`),
  KEY `kpiId` (`kpiId`),
  CONSTRAINT `KpiProjects_ibfk_1` FOREIGN KEY (`kpiId`) REFERENCES `kpis` (`id`) ON DELETE CASCADE,
  CONSTRAINT `KpiProjects_ibfk_2` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kpiprojects`
--

LOCK TABLES `kpiprojects` WRITE;
/*!40000 ALTER TABLE `kpiprojects` DISABLE KEYS */;
INSERT INTO `kpiprojects` VALUES (21,1,1,'2019-03-02 16:18:16','2019-03-02 16:18:16'),(21,2,1,'2019-03-02 16:18:17','2019-03-02 16:18:17'),(21,3,1,'2019-03-02 16:18:17','2019-03-02 16:18:17'),(21,4,1,'2019-03-02 16:18:17','2019-03-02 16:18:17'),(21,8,1,'2019-03-02 16:18:17','2019-03-02 16:18:17'),(21,9,1,'2019-03-02 16:18:18','2019-03-02 16:18:18'),(21,10,1,'2019-03-02 16:18:18','2019-03-02 16:18:18'),(22,6,1,'2019-03-02 16:18:17','2019-03-02 16:18:17'),(23,2,1,'2019-02-26 06:00:18','2019-02-26 06:00:18'),(23,3,1,'2019-02-26 06:00:17','2019-02-26 06:00:17'),(23,4,1,'2019-02-26 06:00:17','2019-02-26 06:00:17'),(24,2,1,'2019-02-26 06:01:53','2019-02-26 06:01:53'),(24,3,1,'2019-02-26 06:00:18','2019-02-26 06:00:18'),(24,7,1,'2019-03-02 16:18:17','2019-03-02 16:18:17'),(25,3,1,'2019-02-26 06:01:53','2019-02-26 06:01:53'),(36,59,1,'2019-05-10 14:01:03','2019-05-10 14:01:03'),(113,3,1,'2019-04-19 16:49:08','2019-04-19 16:49:08'),(113,7,1,'2019-04-19 16:49:07','2019-04-19 16:49:07'),(118,3,1,'2019-05-11 23:54:37','2019-05-11 23:54:37'),(118,4,1,'2019-05-10 13:55:54','2019-05-10 13:55:54'),(118,10,1,'2019-05-10 13:55:54','2019-05-10 13:55:54'),(118,12,1,'2019-03-22 19:33:30','2019-03-22 19:33:30'),(118,14,1,'2019-03-22 19:33:30','2019-03-22 19:33:30'),(118,16,1,'2019-03-22 19:33:30','2019-03-22 19:33:30'),(118,55,1,'2019-05-04 18:45:03','2019-05-04 18:45:03'),(118,59,1,'2019-05-04 20:12:18','2019-05-04 20:12:18');
/*!40000 ALTER TABLE `kpiprojects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kpis`
--

DROP TABLE IF EXISTS `kpis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kpis` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orgId` int NOT NULL,
  `deptId` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `level` int DEFAULT NULL,
  `mindmapNodeId` varchar(20) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `orgPriority` int DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `active` tinyint DEFAULT '1',
  `projectId` int DEFAULT NULL,
  `formulaDescription` varchar(255) DEFAULT NULL,
  `departmentId` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `Kpis_Organizations_ind` (`orgId`),
  KEY `kpis_title_ind` (`title`),
  KEY `Kpis_Departments_id_fk` (`deptId`),
  KEY `projectId` (`projectId`) USING BTREE,
  FULLTEXT KEY `title` (`title`,`description`,`formulaDescription`,`type`),
  CONSTRAINT `Kpis_Departments_id_fk` FOREIGN KEY (`deptId`) REFERENCES `departments` (`id`),
  CONSTRAINT `Kpis_ibfk_1` FOREIGN KEY (`orgId`) REFERENCES `organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=575 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kpis`
--

LOCK TABLES `kpis` WRITE;
/*!40000 ALTER TABLE `kpis` DISABLE KEYS */;
INSERT INTO `kpis` VALUES (1,1,1,'Reduce operating costs frm  1','Effort to increase the availability of all plants.',1,NULL,'lagging',9,'1',0,22,NULL,NULL,'2019-01-24 04:18:21','2020-03-19 00:21:29'),(2,1,1,'Inventory Reduction','Reduce inventory in all warehouses',2,NULL,'leading',8,'1',1,23,NULL,NULL,'2019-01-24 04:18:21','2020-02-12 06:28:55'),(3,1,1,'Energy output efficiency','Increase the energy output efficiency for the wider organization',2,NULL,'lagging',201,'1',0,24,NULL,NULL,'2019-01-24 04:18:21','2020-01-21 09:31:46'),(4,2,2,'Increase parts availability','Increase the availability of parts at all locations.',2,NULL,'leading',4,'1',0,25,'Ei = sum(Li/Zi) + Tz',NULL,'2019-01-24 04:18:21','2020-01-21 09:31:52'),(6,4,2,'Repair time','Address problems with diagnosing equipment failure',2,NULL,'lagging',13,'1',1,19,'Ei = sum(Li/Zi) + Tz',NULL,'2019-03-02 13:11:46','2019-09-23 21:00:05'),(7,1,3,'Increase energy output efficiency','Increase energy output efficiency',2,NULL,'leading',202,'1',0,24,'Ei = sum(Li/Zi) + Tz',NULL,'2019-01-24 04:18:21','2020-01-21 09:31:51'),(8,3,2,'Increase turbine online time','Increase turbine online time',2,NULL,'leading',NULL,'1',0,21,NULL,NULL,'2019-01-24 04:18:21','2020-01-21 09:32:20'),(9,2,4,'Mean Time Between Failure','Average time between two failure of the same component or target system.',2,NULL,'lagging',3,'1',0,19,NULL,NULL,'2019-03-02 13:11:46','2020-01-21 09:32:23'),(10,1,4,'Increase parts availability','Increase the availability of parts at all locations.',2,NULL,'leading',203,'2',0,21,'Ei = sum(Li/Zi) + Tz',NULL,'2019-03-02 13:36:00','2020-01-21 09:31:54'),(12,2,5,'Increase parts availability and more','Increase the availability of parts at all locations.',2,'_46ct4o4oy','leading',7,'1',0,118,NULL,NULL,'2019-03-22 19:23:13','2020-01-08 07:20:34'),(14,4,1,'Reduce average repair time','Address problems with diagnosing equipment failure and fixing components.',2,NULL,'lagging',12,'1',1,118,NULL,NULL,'2019-03-22 19:23:13','2019-09-23 21:00:04'),(16,4,1,'Increase efficiency','Increase energy output efficiency',2,NULL,'leading',4,'1',1,6802,NULL,NULL,'2019-03-22 19:23:14','2020-02-25 06:58:13'),(37,3,NULL,'Proposal Lead Time','Time taken for submitting a final proposal to the customer starting from the initial inquiry from the customer. Intent is to measure the effectiveness of the information collection process from the customer, processing the information using company knowle',0,NULL,'lagging',NULL,NULL,1,NULL,NULL,NULL,'2019-04-16 03:29:34','2019-04-16 03:29:34'),(55,4,1,'Simple regression','Simple regression against costs, inventory, and maintenance.',1,NULL,'lagging',14,NULL,1,118,'None',NULL,'2019-05-04 18:45:03','2019-08-15 03:38:58'),(59,4,NULL,'Increase efficiency','',1,NULL,'',NULL,NULL,0,6802,'',NULL,'2019-05-04 20:12:18','2020-03-04 02:38:55'),(79,4,1,'Minimize downtime','Review SOPs to minimize system and equipment downtime',1,NULL,'leading',14,NULL,0,36,'',NULL,'2019-05-22 03:02:00','2020-01-21 09:32:25'),(81,4,3,'Inventory reduction and optimization','Inventory reduction',0,NULL,'leading',21,NULL,0,21,'',NULL,'2019-05-22 03:09:19','2020-01-21 09:32:22'),(92,4,1,'Lower inventory at selected sites','Total inventory cost, count optimized with the demand ',0,NULL,'lagging',15,NULL,1,118,'Inventory value x shelf time',NULL,'2019-05-25 01:17:19','2020-01-03 18:50:30'),(96,2,NULL,'Evaluate supply chain','Evaluate supply chain and assess gaps',NULL,'_uajrljib9',NULL,2,NULL,0,36,'Calculate by evaluating number of steps',NULL,'2019-06-26 02:26:48','2020-01-21 09:31:49'),(97,2,NULL,'Assess degree of automation','Evaluate and assess each site by amount of automation',NULL,'_uguzpgdta',NULL,6,NULL,1,22,'',NULL,'2019-06-26 02:44:37','2019-12-18 03:35:53'),(99,2,NULL,'Inventory Cost','Reduce Inventory Carrying Cost',NULL,'_al6om6znz',NULL,5,NULL,1,NULL,'',NULL,'2019-08-15 17:49:02','2019-12-18 03:35:53'),(107,2,NULL,'Measure failover testing','Review failover testing for all locations',NULL,'_c96w1yrth',NULL,1,NULL,1,6802,'',NULL,'2019-09-03 17:53:53','2020-02-25 07:16:21'),(108,1,NULL,'Increasing Plant Availability','',NULL,'_e2jjpuc08',NULL,7,NULL,1,NULL,'',NULL,'2019-09-09 19:57:45','2020-02-12 06:28:55'),(111,10,NULL,'Quality Score','Score based on all quality criteria',NULL,'_wrfl8sigr',NULL,7,NULL,0,NULL,'Accuracy *Integrity*Trace ability',NULL,'2019-12-01 01:26:03','2020-02-21 19:22:57'),(112,10,NULL,'Data Availability','Percentage of data available for the particular purpose of reporting, analysis or modeling',0,'','leading',7,NULL,0,6799,'% availability counted every hour',NULL,'2019-12-02 01:23:10','2020-04-08 23:57:17'),(113,10,NULL,'Data Quality','Representing the quality of the data based on accuracy, resolution, timeliness, integrity and trace ability ',0,'','leading',5,NULL,0,6799,'',NULL,'2019-12-02 01:25:23','2020-04-08 23:53:05'),(114,10,NULL,'Qualified Opportunities','Number of opportunities identified by APM discovery process that were assessed and qualified to move forward.',0,'','leading',2,NULL,1,6797,'Number of opportunities per week / MTD / QTD / YTD',NULL,'2019-12-02 02:50:27','2020-03-29 17:12:36'),(115,10,NULL,'Closing Rate','Opportunity Realization Rate',0,'','leading',NULL,NULL,0,6799,'Median Time taken to realize an opportunity or close an issue',NULL,'2019-12-02 13:52:32','2019-12-04 04:24:31'),(121,10,NULL,'Availability on Time','Data is available at the right time for processing and decision making',0,'','leading',11,NULL,0,6803,'',NULL,'2019-12-13 16:58:15','2020-03-19 00:20:22'),(132,10,NULL,'Heat Rate','Trend of Average Monthly Heat Rate trailing a 12 months period',NULL,'_p85pc1hq1',NULL,8,NULL,0,NULL,'Thermal Power Input / Electrical Power Output (MMBtu/MWh)',NULL,'2019-12-23 21:40:27','2020-02-19 05:12:38'),(133,2,NULL,'Process Lead Time ','Time taken to complete a process',0,'','lagging',NULL,NULL,0,6797,'Start to end time',NULL,'2020-01-03 18:32:59','2020-01-09 12:11:09'),(134,2,NULL,'Process Cost','Cost of executing a process',0,'','lagging',NULL,NULL,0,6797,'Lead time x Resource Cost',NULL,'2020-01-03 18:40:55','2020-01-03 18:43:18'),(135,10,NULL,'Planned Maintenance Percentage','Total share of downtime due to planned maintenance',NULL,'_be1vbwx62',NULL,5,NULL,1,0,'Down time due to planned maintenance / Total Downtime',NULL,'2020-01-03 19:22:57','2020-04-17 17:10:35'),(155,1,NULL,'KPI From MindMap 2','Test',NULL,'_7bvlno4le',NULL,5,NULL,0,6802,'Test',NULL,'2020-01-06 07:00:52','2020-03-02 05:32:49'),(156,1,NULL,'Kpi From Froject Details','test',22,'','lagging',9,NULL,0,6797,'tetst',NULL,'2020-01-06 07:01:28','2020-01-06 10:44:52'),(392,1,NULL,'Total inventory cost, count optimized with the demand	333','Total inventory cost, count optimized with the demand	355',0,'','',NULL,NULL,0,118,'',NULL,'2020-01-08 07:31:49','2020-01-08 07:32:00'),(406,10,NULL,'Design Lead time','Time taken to complete a design that is included in the proposal',0,'','',3,NULL,0,0,'',NULL,'2020-01-24 02:08:11','2020-02-21 20:25:54'),(407,1,NULL,'KPITitleQuidProValv','KPIDescriptionQuidPro',0,'','lagging',1,NULL,0,0,'FormulaDescriptionQuidPro',NULL,'2020-01-27 06:44:55','2020-03-19 00:21:16'),(408,1,NULL,'NodeKpiTTLQuidPro','NodeKpiDescQuidPro',NULL,'_jgds4z753',NULL,3,NULL,0,NULL,'NodeKpiKPIForQuidPro',NULL,'2020-01-27 07:16:36','2020-03-19 00:21:21'),(409,9,NULL,'Testing KPI','Desc of test KPI',44,'','lagging',2,NULL,1,6797,'',NULL,'2020-01-30 10:26:35','2020-02-26 12:29:04'),(411,10,NULL,'MWHr Contributed','Total MWHr contributed through saving from losses',0,'','lagging',3,NULL,0,0,'',NULL,'2020-02-04 02:08:43','2020-02-19 04:01:25'),(412,10,NULL,'MWH Contributed','Total MWH contributed through opportunity identification ',0,'','lagging',4,NULL,0,0,'',NULL,'2020-02-04 02:13:14','2020-02-19 05:12:50'),(416,2,NULL,'Inventory cost reduction ','Seek to reduce inventory costs',1,NULL,'leading',NULL,NULL,1,118,'Test',1,'2020-02-04 04:35:17','2020-02-19 10:26:49'),(425,9,NULL,'DDe','',NULL,'_gvbfk5ilc',NULL,11,NULL,0,NULL,'',NULL,'2020-02-10 09:39:27','2020-02-21 04:05:07'),(427,9,NULL,'wfdfd','sfd',0,'','',12,NULL,0,115,'sd',NULL,'2020-02-10 11:02:42','2020-02-19 06:16:26'),(428,10,NULL,'NEWKPI1002347','NEWKPI1002347',0,'','',1,NULL,0,0,'NEWKPI1002',NULL,'2020-02-10 12:38:26','2020-02-18 04:10:47'),(433,10,NULL,'New KPI From ORG Page','Test K',0,'','lagging',5,NULL,0,0,'',NULL,'2020-02-11 09:06:46','2020-02-19 05:13:47'),(434,1,NULL,'NEW KPI 1102-0304','NEW KPI 1102-0304',0,'','',2,NULL,0,0,'',NULL,'2020-02-11 09:34:56','2020-03-19 00:21:17'),(435,1,NULL,'NEW KPI 1102-0304','NEW KPI 1102-0304',0,'','',4,NULL,0,0,'',NULL,'2020-02-11 09:35:40','2020-03-19 00:21:18'),(436,1,NULL,'','',NULL,'_wgdddy0sn',NULL,6,NULL,0,NULL,'',NULL,'2020-02-12 05:03:29','2020-03-19 00:21:07'),(437,9,NULL,'first test KPI ','',0,'','leading',13,NULL,0,0,'',NULL,'2020-02-12 06:03:33','2020-02-12 07:48:17'),(438,9,NULL,'starKPI','test1',NULL,'_jfdvwrflo',NULL,NULL,NULL,0,6802,'p=sp-cp',NULL,'2020-02-12 07:14:32','2020-02-25 21:59:24'),(439,9,NULL,'by project page','fgdrdf',0,'','',NULL,NULL,0,6835,'',NULL,'2020-02-12 07:57:21','2020-02-18 04:10:28'),(440,1,NULL,'KPI13022020','',0,'','',NULL,NULL,0,0,'',NULL,'2020-02-13 11:57:05','2020-03-19 00:21:10'),(442,3,NULL,'test','test',0,'','',NULL,NULL,0,133,'',NULL,'2020-02-18 04:23:46','2020-02-20 12:11:08'),(443,3,NULL,'dsf','',0,'','',NULL,NULL,0,31,'',NULL,'2020-02-18 04:24:16','2020-02-20 12:11:06'),(459,1,NULL,'dsffsdfsdf','',0,'','',NULL,NULL,0,0,'',NULL,'2020-02-18 04:58:38','2020-03-19 00:21:30'),(460,1,NULL,'ggggg','',0,'','',NULL,NULL,0,NULL,'',NULL,'2020-02-18 04:58:52','2020-03-19 00:21:31'),(461,1,NULL,'hhhhhhhhh','',0,'','',NULL,NULL,0,NULL,'',NULL,'2020-02-18 04:59:34','2020-03-19 00:21:32'),(462,1,NULL,'sdfsdfsdfsfsdfsdfsdf','',0,'','',NULL,NULL,0,NULL,'',NULL,'2020-02-18 05:01:22','2020-03-19 00:21:33'),(464,9,NULL,'kpi19022020-dmy','kpi19022020-dmy',NULL,'_u00godtj7',NULL,NULL,NULL,0,NULL,'kpi19022020-dmy',NULL,'2020-02-19 06:15:14','2020-02-21 04:05:55'),(465,9,NULL,'KPIaddedfordmy17022020','new Descr',0,'','',NULL,NULL,0,115,'KPIaddedfordmy17022020',NULL,'2020-02-19 06:17:18','2020-02-19 09:00:51'),(466,9,NULL,'TESTKPI1new7022020','descriptionnew',0,'','',NULL,NULL,0,0,'',NULL,'2020-02-19 07:16:10','2020-02-19 08:57:48'),(467,9,NULL,'1232354123213213123','',0,'','',NULL,NULL,0,6793,'',NULL,'2020-02-19 10:28:04','2020-02-19 12:35:35'),(468,1,NULL,'testkpi','',0,'','',NULL,NULL,0,6802,'',NULL,'2020-02-20 10:28:53','2020-03-04 02:39:00'),(469,1,NULL,'KPI14','',0,'','',NULL,NULL,0,0,'',NULL,'2020-02-20 11:13:36','2020-03-19 00:21:11'),(475,1,NULL,'KPI ','',0,'','',NULL,NULL,0,26,'',NULL,'2020-02-20 12:02:43','2020-02-20 12:03:06'),(476,1,NULL,'KPI2','',0,'','',NULL,NULL,0,6793,'',NULL,'2020-02-20 12:08:11','2020-03-19 00:21:12'),(477,1,NULL,'KPI3','',0,'','',NULL,NULL,0,0,'',NULL,'2020-02-20 12:08:28','2020-03-19 00:21:14'),(478,1,NULL,'KPI3.5','',0,'','',NULL,NULL,0,0,'',NULL,'2020-02-20 12:09:27','2020-03-19 00:21:15'),(479,1,NULL,'KPI','',0,'','',NULL,NULL,0,20,'',NULL,'2020-02-20 12:22:29','2020-03-19 00:21:56'),(480,1,NULL,'KPI2','',0,'','',NULL,NULL,0,0,'',NULL,'2020-02-20 12:22:49','2020-03-19 00:21:13'),(481,10,NULL,'TestKpiFirstTime','TestKpiFirstTime',0,'','',NULL,NULL,0,0,'TestKpiFirstTime',NULL,'2020-02-21 12:21:39','2020-02-21 13:34:10'),(482,10,NULL,'TestKpiSecondTime','TestKpiSecondTime',0,'','',NULL,NULL,0,0,'TestKpiSecondTime',NULL,'2020-02-21 12:22:10','2020-02-21 19:23:17'),(483,10,NULL,'TestKpiThirdTime','TestKpiThirdTime',0,'','',NULL,NULL,0,0,'',NULL,'2020-02-21 12:22:26','2020-02-21 19:23:18'),(484,10,NULL,'TestKpiForProject1','',0,'','',NULL,NULL,0,6799,'',NULL,'2020-02-21 12:22:55','2020-02-21 13:34:14'),(485,10,NULL,'TestKpiForProject2','',0,'','',NULL,NULL,0,0,'',NULL,'2020-02-21 12:23:02','2020-02-21 13:34:18'),(486,10,NULL,'test','test',0,'','',NULL,NULL,0,0,'test',NULL,'2020-02-21 19:22:32','2020-02-21 19:22:50'),(489,1,NULL,'testkpi','',0,NULL,'',0,'null',0,6799,'',0,'2020-02-26 13:16:32','2020-03-04 12:40:58'),(490,10,NULL,'Data Quality','Representing the quality of the data based on accuracy, resolution, timeliness, integrity and trace ability ',0,NULL,'leading',3,'null',0,6802,'',0,'2020-02-26 13:18:35','2020-04-07 15:20:44'),(491,1,NULL,'testkpi','',0,NULL,'',0,'null',0,6802,'',0,'2020-03-03 09:57:31','2020-03-04 02:39:15'),(492,10,NULL,'Availability on Time','Data is available at the right time for processing and decision making',0,NULL,'leading',6,'null',0,6839,'',0,'2020-03-04 06:33:45','2020-03-04 10:04:01'),(493,10,NULL,'TestKpi04022020','',NULL,'_xg2ravtdj',NULL,11,NULL,0,NULL,'',NULL,'2020-03-04 08:54:35','2020-03-06 04:47:22'),(494,55,NULL,'Test','',0,'','',NULL,NULL,0,6841,'',NULL,'2020-03-04 09:35:36','2020-03-04 09:59:41'),(495,55,NULL,'TestKpiAddedFromProject','',0,'','',NULL,NULL,0,6841,'',NULL,'2020-03-04 09:43:21','2020-03-04 09:50:43'),(496,55,NULL,'TestKpiAddedFromOrg','',0,'','',NULL,NULL,0,0,'',NULL,'2020-03-04 09:43:57','2020-03-04 10:00:56'),(497,55,NULL,'TestKpiAddedFromOrg','',0,NULL,'',0,'null',0,6841,'',0,'2020-03-04 09:44:46','2020-03-04 09:59:59'),(498,55,NULL,'KPI ADDED FROM ORG','',0,'','',NULL,NULL,0,0,'',NULL,'2020-03-04 09:57:29','2020-03-04 10:00:54'),(499,55,NULL,'KPIADDEDFRMproject','',0,'','',NULL,NULL,0,6841,'',NULL,'2020-03-04 10:00:44','2020-03-04 10:01:32'),(500,55,NULL,'KPI Added From ORG','',0,'','',NULL,NULL,0,0,'',NULL,'2020-03-04 10:01:11','2020-03-04 10:02:07'),(501,55,NULL,'sadsadsad','',0,'','',NULL,NULL,0,6841,'',NULL,'2020-03-04 10:02:23','2020-03-04 10:02:31'),(502,10,NULL,'New test KPI','New test KPI',0,'','',7,NULL,0,6839,'',NULL,'2020-03-04 10:26:41','2020-03-04 16:47:37'),(503,10,NULL,'Availability on Time','Data is available at the right time for processing and decision making',0,NULL,'leading',19,'null',0,6839,'',0,'2020-03-04 10:28:29','2020-03-19 00:19:52'),(504,10,NULL,'testkpiaddedfromprojectdetailpagefortestprojectofAPUC','testkpiaddedfromprojectdetailpagefortestprojectofAPUC',0,'','',NULL,NULL,0,6844,'testkpiaddedfromprojectdetailpagefortestprojectofAPUC',NULL,'2020-03-04 12:34:08','2020-03-04 12:39:02'),(505,10,NULL,'test2','',0,'','',NULL,NULL,0,6844,'',NULL,'2020-03-04 12:38:22','2020-03-04 13:09:01'),(506,10,NULL,'KPI4APUCADD4mORG','KPI4APUCADD4mORG',0,'','',NULL,NULL,0,0,'KPI4APUCADD4mORG',NULL,'2020-03-04 12:42:36','2020-03-04 13:05:28'),(507,10,NULL,'KPI4APUCADD4mORG','KPI4APUCADD4mORG',0,NULL,'',0,'null',0,6844,'KPI4APUCADD4mORG',0,'2020-03-04 13:01:18','2020-03-04 13:05:30'),(508,10,NULL,'KPI4APUCADD4mORG','KPI4APUCADD4mORG',0,NULL,'',0,'null',0,6802,'KPI4APUCADD4mORG',0,'2020-03-04 13:02:35','2020-03-04 13:03:08'),(509,10,NULL,'KPI4APUCADD4mORG','KPI4APUCADD4mORG',0,NULL,'',0,'null',0,6802,'KPI4APUCADD4mORG',0,'2020-03-04 13:02:46','2020-03-04 13:03:10'),(510,10,NULL,'KPI4APUCADD4mORG-1','',0,'','',NULL,NULL,0,6844,'',NULL,'2020-03-04 13:06:25','2020-03-04 13:08:26'),(511,10,NULL,'KPI4APUCADD4mORG-1','',0,NULL,'',0,'null',0,6845,'',0,'2020-03-04 13:07:23','2020-03-04 13:13:12'),(512,10,NULL,'teston','',0,'','',NULL,NULL,0,6844,'',NULL,'2020-03-04 13:16:33','2020-03-04 13:16:48'),(513,10,NULL,'safsaf','',0,'','',3,NULL,0,0,'',NULL,'2020-03-04 13:17:08','2020-03-04 16:47:00'),(514,10,NULL,'sdfsdf222','',0,'','',NULL,NULL,0,6844,'',NULL,'2020-03-04 13:17:22','2020-03-04 13:17:54'),(515,10,NULL,'ghjfg','',0,'','',NULL,NULL,0,6844,'',NULL,'2020-03-04 13:17:32','2020-03-04 13:23:12'),(516,10,NULL,'fsdfsdf','',0,'','',5,NULL,0,6844,'',NULL,'2020-03-04 13:22:46','2020-03-04 16:47:22'),(517,10,NULL,'Time to RTS','To capture the time taken to bring the Turbine back to service',0,'_hdv1zp9oe',NULL,1,NULL,0,NULL,'Time between turbine offline and online due to major component',NULL,'2020-03-04 17:20:09','2020-04-07 15:29:53'),(518,10,NULL,'Data Quality','Representing the quality of the data based on accuracy, resolution, timeliness, integrity and trace ability ',0,NULL,'leading',12,'null',0,6803,'',0,'2020-03-05 02:15:48','2020-03-19 00:20:01'),(519,55,NULL,'KPI for 244','',4,'','',NULL,NULL,0,6848,'',NULL,'2020-03-05 09:15:23','2020-03-19 00:22:15'),(520,55,NULL,'KPI 4 244','',2,'','',NULL,NULL,0,6848,'',NULL,'2020-03-05 09:15:55','2020-04-25 14:22:27'),(521,55,NULL,'test222','',22,'','',NULL,NULL,0,6848,'',NULL,'2020-03-05 09:16:39','2020-03-05 09:16:51'),(522,1,NULL,'Reduce operating costs 2','Effort to increase the availability of all plants.',1,NULL,'lagging',9,'1',1,6843,'null',0,'2020-03-05 09:17:45','2020-03-05 11:03:49'),(523,55,NULL,'sadsad','',3,'','',NULL,NULL,0,6843,'',NULL,'2020-03-05 09:18:39','2020-03-19 00:22:17'),(524,10,NULL,'Data cost','',1,'','',1,NULL,0,6805,'',NULL,'2020-03-05 10:41:57','2020-03-06 04:48:01'),(525,10,NULL,'Renewal','',3,'','',5,NULL,0,NULL,'',NULL,'2020-03-05 10:42:15','2020-03-19 00:19:31'),(526,10,NULL,'Renewal cost','',2,'','',NULL,NULL,0,6846,'',NULL,'2020-03-05 10:44:04','2020-03-05 11:09:39'),(527,10,NULL,'Manufacturing process','',44,'','',4,NULL,0,6845,'',NULL,'2020-03-05 10:44:35','2020-03-06 04:47:35'),(528,1,NULL,'Reduce operating costs 3','Effort to increase the availability of all plants.',1,NULL,'lagging',9,'1',0,6846,'null',0,'2020-03-05 10:54:47','2020-03-05 11:09:44'),(529,10,NULL,'Data cost','',1,NULL,'',0,'null',0,6846,'',0,'2020-03-05 10:58:26','2020-03-05 11:09:46'),(530,1,NULL,'Reduce operating costs 4','Effort to increase the availability of all plants.',1,NULL,'lagging',9,'1',0,6846,'null',0,'2020-03-05 11:01:36','2020-03-05 11:09:42'),(531,1,NULL,'Reduce operating costs frm  1','Effort to increase the availability of all plants.',1,NULL,'lagging',9,'1',0,6846,'null',0,'2020-03-05 11:06:36','2020-03-05 11:09:41'),(532,1,NULL,'Reduce operating costs frm  1','Effort to increase the availability of all plants.',1,NULL,'lagging',9,'1',0,6846,'null',0,'2020-03-05 11:08:31','2020-03-05 11:09:32'),(533,10,NULL,'Reduce operating costs 2','Effort to increase the availability of all plants.',1,NULL,'lagging',15,'1',0,0,'null',0,'2020-03-05 11:11:16','2020-03-19 00:19:35'),(537,10,NULL,'Reduce operating costs 2','Effort to increase the availability of all plants.',1,NULL,'lagging',16,'1',0,NULL,'null',0,'2020-03-05 11:35:31','2020-03-19 00:19:34'),(538,10,NULL,'Inventory Reduction','Reduce inventory in all warehouses',2,NULL,'leading',13,'1',0,6846,'null',0,'2020-03-05 11:36:40','2020-03-19 00:19:43'),(539,10,NULL,'KPITitleQuidPro','KPIDescriptionQuidPro',0,NULL,'lagging',9,'null',0,NULL,'FormulaDescriptionQuidPro',0,'2020-03-05 11:45:48','2020-03-17 11:04:36'),(540,10,NULL,'KPITitleQuidPro','KPIDescriptionQuidPro',0,NULL,'lagging',7,'null',0,NULL,'FormulaDescriptionQuidPro',0,'2020-03-05 11:50:51','2020-03-17 11:04:38'),(541,10,NULL,'KPITitleQuidProValv','KPIDescriptionQuidPro',0,NULL,'lagging',5,'null',0,6846,'FormulaDescriptionQuidPro',0,'2020-03-05 11:51:45','2020-03-06 04:47:41'),(542,10,NULL,'Executive meetings','St. predoic meetings',NULL,'_c3gn2ulso',NULL,3,NULL,0,NULL,'No of meeting per year',NULL,'2020-03-06 02:49:05','2020-03-19 00:20:07'),(543,10,NULL,'fdfdgfdg','fdfdgfdgfdg',435,NULL,'',4,'null',0,NULL,'',0,'2020-03-06 07:21:44','2020-03-17 11:03:14'),(544,10,NULL,'KPI for Waiting time for Approvals','KPI Waiting time for Approvals',NULL,'_oeclfpgz1',NULL,1,NULL,0,NULL,'',NULL,'2020-03-06 11:28:04','2020-03-19 00:19:25'),(545,10,NULL,'Inventory Reduction','Reduce inventory in all warehouses',2,NULL,'leading',8,'1',0,6852,'null',NULL,'2020-03-07 15:36:10','2020-03-19 00:19:44'),(546,10,NULL,'Test17032020','',2,'','',NULL,NULL,0,NULL,'',NULL,'2020-03-17 10:57:46','2020-03-17 11:04:30'),(547,10,NULL,'Test2-17032020','',4,'','',NULL,NULL,0,NULL,'',NULL,'2020-03-17 10:58:25','2020-03-17 11:04:31'),(548,10,NULL,'Test3-17032020','',3,'','',NULL,NULL,0,6849,'',NULL,'2020-03-17 11:03:35','2020-03-17 11:03:47'),(549,10,NULL,'Test4-20201703','',12,'','',NULL,NULL,0,NULL,'',NULL,'2020-03-17 11:04:08','2020-03-17 11:04:28'),(550,10,NULL,'test KPI 17032020 1','',2,'','',NULL,NULL,0,6849,'',NULL,'2020-03-17 12:25:42','2020-03-17 12:26:14'),(551,10,NULL,'test KPI 17032020 2','',2,'','',NULL,NULL,0,NULL,'',NULL,'2020-03-17 12:26:30','2020-03-17 12:27:16'),(552,10,NULL,'Time to RTS','To capture the time taken to bring the Turbine back to service',0,NULL,'null',4,'null',0,6856,'Time between turbine offline and online due to major component',NULL,'2020-03-20 23:33:04','2020-04-08 23:59:29'),(553,10,22,'Data Availability_new','Percentage of data available for the particular purpose of reporting, analysis or modeling',1,'','leading',NULL,NULL,0,0,'% availability counted every hour',NULL,'2020-04-03 08:28:17','2020-04-07 15:04:25'),(554,10,NULL,'Data Availability_project','Percentage of data available for the particular purpose of reporting, analysis or modeling',1,NULL,'leading',7,'null',0,6849,'% availability counted every hour',NULL,'2020-04-03 11:57:14','2020-04-07 15:19:34'),(555,10,NULL,'Time to RTS','To capture the time taken to bring the Turbine back to service',0,NULL,'null',1,'null',0,6849,'Time between turbine offline and online due to major component',NULL,'2020-04-06 08:56:53','2020-04-07 15:30:14'),(558,10,19,'Data Availability','Percentage of data available for the particular purpose of reporting, analysis or modeling.',1,'','leading',2,NULL,1,0,'% availability counted every hour',NULL,'2020-04-08 23:48:53','2020-04-17 17:10:35'),(560,10,19,'Data Quality','Representing the quality of the data based on accuracy, resolution, timeliness, integrity and trace ability ',1,'','leading',1,NULL,1,0,'',NULL,'2020-04-08 23:50:24','2020-04-17 17:10:35'),(561,10,19,'Qualified Opportunities','Number of opportunities identified by APM discovery process that were assessed and qualified to move forward.',0,'','',3,NULL,1,6857,'Number of opportunities per week / MTD / QTD / YTD',NULL,'2020-04-08 23:55:23','2020-04-17 17:10:35'),(562,10,19,'Time to RTS','To capture the time taken to bring the Turbine back to service',0,'','leading',4,NULL,1,0,'Time between turbine offline and online due to major component',NULL,'2020-04-08 23:56:29','2020-04-17 17:10:35'),(563,10,22,'nmchgcf','aSFDWF',1,'','leading',NULL,NULL,0,6849,'ASFDASF',NULL,'2020-04-09 03:49:07','2020-04-09 03:49:44'),(566,10,NULL,'NEW KPI','NEW DEC',NULL,'_yzzdrklaq',NULL,NULL,NULL,0,NULL,'NEW FORMULA',NULL,'2020-04-17 08:03:22','2020-04-18 09:10:46'),(567,10,22,'new KPI for projecy','sdasdasd',2,'','lagging',NULL,NULL,0,6849,'asdfasd',NULL,'2020-04-18 16:32:45','2020-04-18 18:21:56'),(568,10,22,'Stakeholder Management','desc',2,'','lagging',NULL,NULL,0,0,'sdsdfs',NULL,'2020-04-22 18:10:20','2020-04-22 18:11:30'),(569,10,19,'Stakeholder Management1','dsddf',4,'','',NULL,NULL,0,0,'dgfgdfg',NULL,'2020-04-23 18:52:00','2020-04-23 18:53:12'),(570,55,85,'Data Availability','Percentage of data available for the particular purpose of reporting, analysis or modeling',0,'','',NULL,NULL,1,0,'% availability counted every hour',NULL,'2020-04-25 14:24:49','2020-04-25 14:24:49'),(571,55,NULL,'new1  KPI Title','new1  KPI Description',NULL,'_e8vy48q1r',NULL,NULL,NULL,1,NULL,'new1  KPI Formula\n',NULL,'2020-05-02 03:19:17','2020-05-02 03:19:17'),(572,55,NULL,'new2 KPI Title','new2 KPI Description',NULL,'_bh5xsap9v',NULL,NULL,NULL,1,NULL,'new2 Formula',NULL,'2020-05-02 03:19:18','2020-05-02 03:19:18'),(573,55,NULL,'3','3',NULL,'_gjsvms5q0',NULL,NULL,NULL,1,NULL,'3',NULL,'2020-05-02 03:19:18','2020-05-02 03:19:18'),(574,55,85,'Tech KPI','tech desc',4,'','',NULL,NULL,1,6848,'formula',NULL,'2020-05-04 15:20:49','2020-05-04 15:20:49');
/*!40000 ALTER TABLE `kpis` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_ins_kpis` AFTER INSERT ON `kpis` FOR EACH ROW begin
            declare thetitle varchar(100);
            select title from Projects where id = NEW.projectId into thetitle;
            insert into SearchData (orgId,ganttTaskId, foreignId, title, description, project, source,active)
            values (NEW.orgId,0, NEW.id, NEW.title, NEW.description, thetitle, 'Kpis',NEW.active);
        end */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_upd_kpis` AFTER UPDATE ON `kpis` FOR EACH ROW begin
            declare thetitle varchar(100);

            select title from Projects where id = NEW.projectId into thetitle;
            insert into SearchData (orgId,ganttTaskId, foreignId, title, description, project, source, active)
            values (NEW.orgId,0, NEW.id, NEW.title, NEW.description, thetitle, 'Kpis', NEW.active)
            on duplicate key update
               foreignId = NEW.id,
title = NEW.title,
active = NEW.active,
                description = NEW.description,
                project = thetitle;

        end */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `kpitags`
--

DROP TABLE IF EXISTS `kpitags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kpitags` (
  `kpiId` int NOT NULL,
  `tag` varchar(60) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`kpiId`,`tag`),
  KEY `kpiId` (`kpiId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kpitags`
--

LOCK TABLES `kpitags` WRITE;
/*!40000 ALTER TABLE `kpitags` DISABLE KEYS */;
INSERT INTO `kpitags` VALUES (58,'Linear regression','2019-05-04 20:10:48','2019-05-04 20:10:48'),(59,'Linear regression','2019-05-04 20:12:18','2019-05-04 20:12:18'),(85,'Downtime','2019-05-22 12:45:26','2019-05-22 12:45:26');
/*!40000 ALTER TABLE `kpitags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `milestones`
--

DROP TABLE IF EXISTS `milestones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `milestones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `startDate` date DEFAULT NULL,
  `targetDate` date DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `orgId` int NOT NULL,
  `statusId` int DEFAULT '1',
  `active` tinyint DEFAULT '1',
  `projectId` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `Milestones_Projects_id_fk` (`projectId`),
  KEY `Milestones_TaskStatuses_id_fk` (`statusId`),
  FULLTEXT KEY `title` (`title`,`description`),
  CONSTRAINT `Milestones_Projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`),
  CONSTRAINT `Milestones_TaskStatuses_id_fk` FOREIGN KEY (`statusId`) REFERENCES `taskstatuses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `milestones`
--

LOCK TABLES `milestones` WRITE;
/*!40000 ALTER TABLE `milestones` DISABLE KEYS */;
INSERT INTO `milestones` VALUES (1,'Gathering data','2019-06-10','2019-07-14','Initial steps to gather and identify data.  Additional text, and more...  Additional text, and more...  Additional text, and more...  Additional text, and more...  Additional text, and more...  Additional text, and more...  Additional text, and more...  ',2,2,1,118,'2019-05-14 11:31:35','2019-11-21 04:18:54'),(2,'Initial analysis','2019-07-15','2019-08-15','Initial analysis of data and cleanliness',2,2,1,118,'2019-05-14 11:31:35','2019-11-21 04:18:54'),(3,'Further analyses complete','2019-08-18','2019-09-27','Further steps to complete analyses ',2,2,1,118,'2019-05-14 11:31:35','2019-11-21 04:19:35'),(4,'Data gathering',NULL,'2019-05-31','First milestone for data gathering',2,1,1,36,'2019-05-22 12:15:26','2019-05-23 20:55:55'),(5,'Initial data analyses and presentations',NULL,'2019-06-07','Second milestone.  Present initial findings and start second round of projects.',2,2,1,36,'2019-05-22 12:16:40','2019-05-22 18:56:30'),(6,'Assess progress on KPIs',NULL,'2019-07-12','Third milestone.  Assess progress on KPIs.',2,1,1,36,'2019-05-22 12:17:23','2019-05-22 18:59:10'),(31,'Last milestone',NULL,'2019-11-08','',7,1,1,130,'2019-05-26 20:35:16','2019-05-26 20:35:16'),(32,'Data gathering and review','2019-07-15','2019-08-15','Data gathering and review',2,1,1,6797,'2019-11-21 13:31:12','2019-11-21 13:31:12'),(33,'Analytics and integration automation','2019-08-19','2019-10-18','Analytics and data canonicalization.  Perform review of internal systems and automate through integration.  Create roadmaps for subsequent integration.',2,1,1,6797,'2019-11-21 13:36:35','2019-11-21 13:36:35'),(34,'Asset Performance Monitoring\r\n','2020-03-01','2020-03-30',NULL,10,1,1,6799,'2019-11-29 19:35:39','2019-11-29 19:40:24'),(35,'Track & report on OEM/Provider SLA performance','2019-12-01','2020-03-30',NULL,10,1,1,6799,'2019-11-29 19:35:39','2019-11-29 19:40:25'),(36,'24/7 Control Room Monitoring','2020-03-01','2020-09-30',NULL,10,1,1,6799,'2019-11-29 19:35:39','2019-11-29 19:40:25'),(37,'Predictive analytics for equipment reliability','2020-01-01','2020-09-30',NULL,10,1,1,6799,'2019-11-29 19:35:39','2019-11-29 19:40:25'),(38,'Optimize the level of details for different reporting events','2019-10-01','2019-10-01',NULL,10,1,1,6799,'2019-11-29 19:35:39','2019-11-29 20:03:17'),(39,'Measurement of APM Contribution \r\n','2020-03-01','2020-03-30',NULL,10,1,1,6799,'2019-11-29 19:35:39','2019-11-29 19:40:25'),(40,'Condition Monitoring System','2019-10-01','2019-10-01',NULL,10,1,1,6799,'2019-11-29 19:35:39','2019-11-29 20:03:17');
/*!40000 ALTER TABLE `milestones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mindmaps`
--

DROP TABLE IF EXISTS `mindmaps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mindmaps` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orgId` int NOT NULL,
  `mapData` json DEFAULT NULL COMMENT 'JSON data representing the nodes of the mind map.',
  `mapName` varchar(200) DEFAULT NULL COMMENT 'Descriptive name for the map we can display when a user selects from the mind maps for their org.',
  `mapDescription` varchar(500) DEFAULT NULL COMMENT 'Description of the mind map.',
  `active` tinyint DEFAULT '1',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `Mindmaps_Organizations_ind` (`orgId`),
  KEY `mapName` (`mapName`),
  FULLTEXT KEY `mapName_mapDescription` (`mapName`,`mapDescription`),
  CONSTRAINT `Mindmaps_ibfk_1` FOREIGN KEY (`orgId`) REFERENCES `organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=140 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mindmaps`
--

LOCK TABLES `mindmaps` WRITE;
/*!40000 ALTER TABLE `mindmaps` DISABLE KEYS */;
INSERT INTO `mindmaps` VALUES (5,3,'{\"id\": \"_ns1nvi0ai\", \"name\": \"Root\", \"children\": [{\"id\": \"_o4r47dq71\", \"name\": \"Reduce operating costs\", \"children\": [{\"id\": \"_al6om6znz\", \"name\": \"Reduce inventory\", \"children\": [{\"id\": \"_46ct4o4oy\", \"name\": \"Review part models\"}, {\"id\": \"_ea00nojwy\", \"name\": \"Optimize supply chain\"}]}, {\"id\": \"_z3uk0721f\", \"name\": \"Operating procedures\"}]}, {\"id\": \"_uajrljib9\", \"name\": \"Review supply chain processes\"}, {\"id\": \"_uguzpgdta\", \"name\": \"Introduce automation\"}]}','Testing',NULL,1,'2019-06-15 01:07:59','2019-10-03 21:03:21'),(7,3,'{\"id\": \"_ns1nvi0ai\", \"name\": \"Root\", \"children\": [{\"id\": \"_o4r47dq71\", \"name\": \"Reduce operating costs\", \"children\": [{\"id\": \"_al6om6znz\", \"name\": \"Reduce inventory\", \"children\": [{\"id\": \"_46ct4o4oy\", \"name\": \"Review part models\"}, {\"id\": \"_ea00nojwy\", \"name\": \"Optimize supply chain\"}]}, {\"id\": \"_z3uk0721f\", \"name\": \"Operating procedures\"}]}, {\"id\": \"_uajrljib9\", \"name\": \"Review supply chain processes\"}, {\"id\": \"_uguzpgdta\", \"name\": \"Introduce automation\", \"children\": [{\"id\": \"_6e1egf02s\", \"name\": \"Q\"}, {\"id\": \"_t8ln1vlwa\", \"name\": \"\", \"children\": [{\"id\": \"_qzltyy8rn\", \"name\": \"\"}]}]}]}',NULL,NULL,1,'2019-06-15 20:27:35','2019-06-16 00:29:38'),(16,2,'{\"id\": \"_ns1nvi0ai\", \"name\": \"Root\", \"children\": [{\"id\": \"_o4r47dq71\", \"name\": \"Reduce operating costs\", \"children\": [{\"id\": \"_al6om6znz\", \"name\": \"Reduce inventory\", \"children\": [{\"id\": \"_46ct4o4oy\", \"name\": \"Review part models\"}, {\"id\": \"_ea00nojwy\", \"name\": \"Optimize supply chain\"}]}, {\"id\": \"_z3uk0721f\", \"name\": \"Operating procedures\", \"children\": [{\"id\": \"_je49rrvdq\", \"name\": \"red\"}, {\"id\": \"_riy5iihy9\", \"name\": \"yellow\"}, {\"id\": \"_sy8zlb7vz\", \"name\": \"blue\"}]}]}, {\"id\": \"_uajrljib9\", \"name\": \"Review supply chain processes\"}, {\"id\": \"_uguzpgdta\", \"name\": \"Introduce automation\", \"children\": [{\"id\": \"_t8ln1vlwa\", \"name\": \"white\", \"children\": [{\"id\": \"_qzltyy8rn\", \"name\": \"green\"}]}]}]}',NULL,NULL,0,'2019-06-21 19:56:00','2019-10-02 22:43:07'),(34,2,'{\"id\": \"_ns1nvi0ai\", \"name\": \"Increase plant availability\", \"children\": [{\"id\": \"_o4r47dq71\", \"name\": \"Reduce operating costs\", \"children\": [{\"id\": \"_al6om6znz\", \"name\": \"Reduce inventory\", \"children\": [{\"id\": \"_46ct4o4oy\", \"name\": \"Increase parts availability\"}, {\"id\": \"_ea00nojwy\", \"name\": \"Optimize supply chain\"}]}, {\"id\": \"_z3uk0721f\", \"name\": \"Operating procedures\"}]}, {\"id\": \"_uajrljib9\", \"name\": \"Review supply chain processes\"}, {\"id\": \"_uguzpgdta\", \"name\": \"Introduce automation\", \"children\": [{\"id\": \"_bd3mz1nqi\", \"name\": \"DDDD\"}]}]}',NULL,NULL,0,'2019-08-15 03:41:42','2019-10-02 22:43:06'),(35,2,'{\"id\": \"_ns1nvi0ai\", \"name\": \"Increase plant availability\", \"children\": [{\"id\": \"_o4r47dq71\", \"name\": \"Reduce operating costs\", \"children\": [{\"id\": \"_al6om6znz\", \"name\": \"Reduce inventory\", \"children\": [{\"id\": \"_46ct4o4oy\", \"name\": \"Increase parts availability\"}, {\"id\": \"_ea00nojwy\", \"name\": \"Optimize supply chain\"}]}, {\"id\": \"_z3uk0721f\", \"name\": \"Operating procedures\"}]}, {\"id\": \"_uajrljib9\", \"name\": \"Review supply chain processes\"}, {\"id\": \"_uguzpgdta\", \"name\": \"Introduce automation\", \"children\": [{\"id\": \"_bd3mz1nqi\", \"name\": \"DDDD\"}, {\"id\": \"_enb7cbzgi\", \"name\": \"\"}]}]}',NULL,NULL,0,'2019-08-15 03:50:48','2019-10-02 22:43:07'),(36,2,'[{\"id\": \"_ns1nvi0ai\", \"name\": \"Increase plant availability\", \"children\": [{\"id\": \"_o4r47dq71\", \"name\": \"Reduce operating costs\", \"children\": [{\"id\": \"_al6om6znz\", \"name\": \"Reduce inventory\", \"children\": [{\"id\": \"_46ct4o4oy\", \"name\": \"Increase parts availability\"}, {\"id\": \"_ea00nojwy\", \"name\": \"Optimize supply chain\"}, {\"id\": \"_fgkwbl4iv\", \"name\": \"\"}, {\"id\": \"_1a47r8baz\", \"name\": \"\"}, {\"id\": \"_syz9hiadu\", \"name\": \"\"}, {\"id\": \"_pxtfvya6e\", \"name\": \"\"}, {\"id\": \"_8e2n893ln\", \"name\": \"\"}, {\"id\": \"_2okojte35\", \"name\": \"\"}, {\"id\": \"_p1l6ebu7l\", \"name\": \"\"}, {\"id\": \"_p1bji11f0\", \"name\": \"\"}, {\"id\": \"_rlx2lbvad\", \"name\": \"\"}]}, {\"id\": \"_z3uk0721f\", \"name\": \"Operating procedures\"}, {\"id\": \"_llynr9xtc\", \"name\": \"\"}]}, {\"id\": \"_uajrljib9\", \"name\": \"Review supply chain processes\"}, {\"id\": \"_uguzpgdta\", \"name\": \"Introduce automation\", \"children\": [{\"id\": \"_bd3mz1nqi\", \"name\": \"DDDD\"}, {\"id\": \"_enb7cbzgi\", \"name\": \"\"}]}]}]',NULL,NULL,0,'2019-08-15 18:22:59','2019-10-02 22:43:07'),(37,2,'[{\"id\": \"_ns1nvi0ai\", \"name\": \"Increase plant availability\", \"children\": [{\"id\": \"_o4r47dq71\", \"name\": \"Reduce operating costs\", \"children\": [{\"id\": \"_al6om6znz\", \"name\": \"Reduce inventory\", \"children\": [{\"id\": \"_46ct4o4oy\", \"name\": \"Increase parts availability\"}, {\"id\": \"_ea00nojwy\", \"name\": \"Optimize supply chain\"}, {\"id\": \"_fgkwbl4iv\", \"name\": \"\"}, {\"id\": \"_1a47r8baz\", \"name\": \"\"}, {\"id\": \"_syz9hiadu\", \"name\": \"\"}, {\"id\": \"_pxtfvya6e\", \"name\": \"\"}, {\"id\": \"_8e2n893ln\", \"name\": \"\"}, {\"id\": \"_2okojte35\", \"name\": \"\"}, {\"id\": \"_p1l6ebu7l\", \"name\": \"\"}, {\"id\": \"_p1bji11f0\", \"name\": \"\"}, {\"id\": \"_rlx2lbvad\", \"name\": \"\"}]}, {\"id\": \"_z3uk0721f\", \"name\": \"Operating procedures\"}, {\"id\": \"_llynr9xtc\", \"name\": \"\"}]}, {\"id\": \"_uajrljib9\", \"name\": \"Review supply chain processes\"}, {\"id\": \"_uguzpgdta\", \"name\": \"Introduce automation\", \"children\": [{\"id\": \"_bd3mz1nqi\", \"name\": \"DDDD\"}, {\"id\": \"_enb7cbzgi\", \"name\": \"\"}]}]}]',NULL,NULL,0,'2019-08-15 18:22:59','2019-10-02 22:43:07'),(39,2,'{\"id\": \"_ns1nvi0ai\", \"name\": \"Increase plant availability\", \"children\": [{\"id\": \"_o4r47dq71\", \"name\": \"Reduce operating costs\", \"children\": [{\"id\": \"_al6om6znz\", \"name\": \"Reduce inventory\", \"children\": [{\"id\": \"_46ct4o4oy\", \"name\": \"Review part models\"}, {\"id\": \"_ea00nojwy\", \"name\": \"Optimize supply chain\"}]}, {\"id\": \"_z3uk0721f\", \"name\": \"Operating procedures\", \"children\": [{\"id\": \"_je49rrvdq\", \"name\": \"TBD\"}, {\"id\": \"_riy5iihy9\", \"name\": \"yellow\"}, {\"id\": \"_sy8zlb7vz\", \"name\": \"blue\"}]}]}, {\"id\": \"_uajrljib9\", \"name\": \"Review supply chain processes\"}, {\"id\": \"_uguzpgdta\", \"name\": \"Introduce automation\", \"children\": [{\"id\": \"_t8ln1vlwa\", \"name\": \"white\", \"children\": [{\"id\": \"_qzltyy8rn\", \"name\": \"green\"}, {\"id\": \"_92xtmt66p\", \"name\": \"maroon\"}]}]}]}','Initial meeting',NULL,1,NULL,'2019-10-02 23:24:57'),(40,2,'{\"id\": \"_ns1nvi0ai\", \"name\": \"Increase plant availability\", \"children\": [{\"id\": \"_o4r47dq71\", \"name\": \"Reduce operating costs\", \"children\": [{\"id\": \"_al6om6znz\", \"name\": \"Reduce inventory\", \"children\": [{\"id\": \"_46ct4o4oy\", \"name\": \"Review part models\"}, {\"id\": \"_ea00nojwy\", \"name\": \"Optimize supply chain\"}]}, {\"id\": \"_z3uk0721f\", \"name\": \"Operating procedures\", \"children\": [{\"id\": \"_je49rrvdq\", \"name\": \"TBD\"}, {\"id\": \"_sy8zlb7vz\", \"name\": \"blue\"}]}]}, {\"id\": \"_uajrljib9\", \"name\": \"Review supply chain processes\"}, {\"id\": \"_uguzpgdta\", \"name\": \"Introduce automation\", \"children\": [{\"id\": \"_t8ln1vlwa\", \"name\": \"white\", \"children\": [{\"id\": \"_qzltyy8rn\", \"name\": \"green\"}, {\"id\": \"_92xtmt66p\", \"name\": \"maroon\"}]}]}, {\"id\": \"_9kr8a4d9i\", \"name\": \"\"}]}','Second version','Second version from first meeting.',1,'2019-08-16 20:15:01','2019-10-02 23:24:56'),(41,2,'{\"id\": \"_ns1nvi0ai\", \"name\": \"Root\", \"note\": \"Prioritization\", \"children\": [{\"id\": \"_o4r47dq71\", \"name\": \"Reduce operating costs\", \"note\": \"Look to reduce operating costs throughout all divisions and locations.  Start with aggregating data.\", \"children\": [{\"id\": \"_al6om6znz\", \"name\": \"Reduce inventory\", \"note\": \"Look to reduce inventory after review of parts.\", \"children\": []}, {\"id\": \"_z3uk0721f\", \"name\": \"Operating procedures\", \"note\": \"Initial review of operating procedures.\"}]}, {\"id\": \"_uajrljib9\", \"name\": \"Review supply chain processes\", \"note\": \"Perform supply chain review of all steps.\"}, {\"id\": \"_uguzpgdta\", \"name\": \"Introduce automation\", \"note\": \"Begin to use automation at all locations and sites.\", \"children\": [{\"id\": \"_t8ln1vlwa\", \"name\": \"Review supply chain\", \"note\": \"Begin review of supply chain...\", \"children\": []}, {\"id\": \"_c96w1yrth\", \"name\": \"Perform failover testing\", \"note\": \"Take sites offline to check failover capabilities\", \"children\": []}]}]}',NULL,NULL,0,'2019-09-02 15:33:32','2019-10-02 23:26:25'),(58,2,'{\"id\": \"_ns1nvi0ai\", \"name\": \"Renamed\", \"note\": \"Prioritization\", \"children\": [{\"id\": \"_o4r47dq71\", \"name\": \"Reduce operating costs\", \"note\": \"Look to reduce operating costs throughout all divisions and locations.  Start with aggregating data.\", \"children\": [{\"id\": \"_z3uk0721f\", \"name\": \"Operating procedures\", \"note\": \"Initial review of operating procedures.\"}, {\"id\": \"_al6om6znz\", \"name\": \"Reduce inventory\", \"parentId\": \"_o4r47dq71\"}]}, {\"id\": \"_uajrljib9\", \"name\": \"Review supply chain processes\", \"note\": \"Perform supply chain review of all steps.\", \"children\": [{\"id\": \"_msyzrv0i5\", \"name\": \"new\", \"parentId\": \"_uajrljib9\"}, {\"id\": \"_9x3x3r13p\", \"name\": \"new\", \"note\": \"\"}]}, {\"id\": \"_uguzpgdta\", \"name\": \"Introduce automation\", \"note\": \"Begin to use automation at all locations and sites.\", \"children\": [{\"id\": \"_t8ln1vlwa\", \"name\": \"Review supply chain\", \"note\": \"Begin review of supply chain...\", \"children\": []}, {\"id\": \"_c96w1yrth\", \"name\": \"Perform failover testing\", \"note\": \"Take sites offline to check failover capabilities\", \"children\": []}]}, {\"id\": \"_p66om69pl\", \"name\": \"Review SOPs\", \"parentId\": \"_ns1nvi0ai\"}]}',NULL,NULL,0,'2019-09-03 04:38:29','2019-10-02 23:26:24'),(59,2,'{\"id\": \"_ns1nvi0ai\", \"name\": \"Renamed\", \"note\": \"Prioritization\", \"children\": [{\"id\": \"_o4r47dq71\", \"name\": \"Reduce operating costs\", \"note\": \"Look to reduce operating costs throughout all divisions and locations.  Start with aggregating data.\", \"children\": [{\"id\": \"_z3uk0721f\", \"name\": \"Operating procedures\", \"note\": \"Initial review of operating procedures.\"}, {\"id\": \"_al6om6znz\", \"name\": \"Reduce inventory\", \"parentId\": \"_o4r47dq71\"}]}, {\"id\": \"_uajrljib9\", \"name\": \"Review supply chain processes\", \"note\": \"Perform supply chain review of all steps.\", \"children\": [{\"id\": \"_msyzrv0i5\", \"name\": \"new\", \"parentId\": \"_uajrljib9\"}, {\"id\": \"_9x3x3r13p\", \"name\": \"new\", \"note\": \"\"}]}, {\"id\": \"_uguzpgdta\", \"name\": \"Introduce automation\", \"note\": \"Begin to use automation at all locations and sites.\", \"children\": [{\"id\": \"_t8ln1vlwa\", \"name\": \"Review supply chain\", \"note\": \"Begin review of supply chain...\", \"children\": []}, {\"id\": \"_c96w1yrth\", \"name\": \"Perform failover testing\", \"note\": \"Take sites offline to check failover capabilities\", \"children\": []}]}, {\"id\": \"_p66om69pl\", \"name\": \"Review SOPs\", \"parentId\": \"_ns1nvi0ai\"}]}',NULL,NULL,0,'2019-09-03 04:48:13','2019-10-02 22:43:06'),(60,2,'{\"id\": \"_ns1nvi0ai\", \"name\": \"Renamed\", \"note\": \"Prioritization\", \"children\": [{\"id\": \"_o4r47dq71\", \"name\": \"Reduce operating costs\", \"note\": \"Look to reduce operating costs throughout all divisions and locations.  Start with aggregating data.\", \"children\": [{\"id\": \"_z3uk0721f\", \"name\": \"Operating procedures\", \"note\": \"Initial review of operating procedures.\"}, {\"id\": \"_al6om6znz\", \"name\": \"Reduce inventory\", \"parentId\": \"_o4r47dq71\"}]}, {\"id\": \"_uajrljib9\", \"name\": \"Review supply chain processes\", \"note\": \"Perform supply chain review of all steps.\", \"children\": [{\"id\": \"_msyzrv0i5\", \"name\": \"new\", \"parentId\": \"_uajrljib9\"}, {\"id\": \"_9x3x3r13p\", \"name\": \"new\", \"note\": \"\"}]}, {\"id\": \"_uguzpgdta\", \"name\": \"Introduce automation\", \"note\": \"Begin to use automation at all locations and sites.\", \"children\": [{\"id\": \"_t8ln1vlwa\", \"name\": \"Review supply chain\", \"note\": \"Begin review of supply chain...\", \"children\": []}, {\"id\": \"_c96w1yrth\", \"name\": \"Perform failover testing\", \"note\": \"Take sites offline to check failover capabilities\", \"children\": []}]}, {\"id\": \"_p66om69pl\", \"name\": \"Review SOPs\", \"parentId\": \"_ns1nvi0ai\"}]}',NULL,NULL,0,'2019-09-03 04:49:13','2019-10-02 22:43:07'),(66,2,'{\"id\": \"_ns1nvi0ai\", \"name\": \"Renamed\", \"note\": \"Prioritization\", \"children\": [{\"id\": \"_o4r47dq71\", \"name\": \"Reduce operating costs\", \"note\": \"Look to reduce operating costs throughout all divisions and locations.  Start with aggregating data.\", \"children\": [{\"id\": \"_al6om6znz\", \"name\": \"Reduce inventory\", \"note\": \"undefined\", \"parentId\": \"_o4r47dq71\"}, {\"id\": \"_z3uk0721f\", \"name\": \"Operating procedures\", \"note\": \"Initial review of operating procedures.\", \"parentId\": \"_o4r47dq71\"}]}, {\"id\": \"_uajrljib9\", \"name\": \"Review supply chain processes\", \"note\": \"Perform supply chain review of all steps.\", \"children\": [{\"id\": \"_msyzrv0i5\", \"name\": \"new\", \"note\": \"undefined\", \"parentId\": \"_uajrljib9\"}, {\"id\": \"_9x3x3r13p\", \"name\": \"new\", \"note\": \"\", \"parentId\": \"_uajrljib9\"}]}, {\"id\": \"_uguzpgdta\", \"name\": \"Introduce automation\", \"note\": \"Begin to use automation at all locations and sites.\", \"children\": [{\"id\": \"_c96w1yrth\", \"name\": \"Perform failover testing\", \"note\": \"Take sites offline to check failover capabilities\", \"children\": []}, {\"id\": \"_t8ln1vlwa\", \"name\": \"Review supply chain\", \"note\": \"Begin review of supply chain...\", \"parentId\": \"_uguzpgdta\"}]}, {\"id\": \"_p66om69pl\", \"name\": \"Review SOPs\", \"note\": \"undefined\", \"parentId\": \"_ns1nvi0ai\"}]}',NULL,NULL,0,'2019-09-09 17:05:17','2019-10-02 22:43:06'),(67,2,'{\"id\": \"_ns1nvi0ai\", \"name\": \"Renamed\", \"note\": \"Prioritization\", \"children\": [{\"id\": \"_o4r47dq71\", \"name\": \"Reduce operating costs\", \"note\": \"Look to reduce operating costs throughout all divisions and locations.  Start with aggregating data.\", \"children\": [{\"id\": \"_al6om6znz\", \"name\": \"Reduce inventory\", \"note\": \"undefined\", \"parentId\": \"_o4r47dq71\"}, {\"id\": \"_z3uk0721f\", \"name\": \"Operating procedures\", \"note\": \"Initial review of operating procedures.\", \"parentId\": \"_o4r47dq71\"}]}, {\"id\": \"_uajrljib9\", \"name\": \"Review supply chain processes\", \"note\": \"Perform supply chain review of all steps.\"}, {\"id\": \"_uguzpgdta\", \"name\": \"Introduce automation\", \"note\": \"Begin to use automation at all locations and sites.\", \"children\": [{\"id\": \"_c96w1yrth\", \"name\": \"Perform failover testing\", \"note\": \"Take sites offline to check failover capabilities\", \"children\": []}, {\"id\": \"_t8ln1vlwa\", \"name\": \"Review supply chain\", \"note\": \"Begin review of supply chain...\", \"parentId\": \"_uguzpgdta\"}]}, {\"id\": \"_p66om69pl\", \"name\": \"Review SOPs\", \"note\": \"undefined\", \"parentId\": \"_ns1nvi0ai\"}]}',NULL,NULL,0,'2019-09-16 02:46:25','2019-10-02 22:43:06'),(68,2,'{\"id\": \"_ns1nvi0ai\", \"name\": \"Renamed\", \"note\": \"Prioritization\", \"children\": [{\"id\": \"_o4r47dq71\", \"name\": \"Reduce operating costs\", \"note\": \"Look to reduce operating costs throughout all divisions and locations.  Start with aggregating data.\", \"side\": \"right\", \"children\": [{\"id\": \"_al6om6znz\", \"name\": \"Reduce inventory\", \"note\": \"undefined\", \"parentId\": \"_o4r47dq71\"}, {\"id\": \"_z3uk0721f\", \"name\": \"Operating procedures\", \"note\": \"Initial review of operating procedures.\", \"parentId\": \"_o4r47dq71\"}]}, {\"id\": \"_uajrljib9\", \"name\": \"Review supply chain processes\", \"note\": \"Perform supply chain review of all steps.\", \"side\": \"left\"}, {\"id\": \"_uguzpgdta\", \"name\": \"Introduce automation\", \"note\": \"Begin to use automation at all locations and sites.\", \"side\": \"left\", \"children\": [{\"id\": \"_c96w1yrth\", \"name\": \"Perform failover testing\", \"note\": \"Take sites offline to check failover capabilities\", \"children\": []}, {\"id\": \"_t8ln1vlwa\", \"name\": \"Review supply chain\", \"note\": \"Begin review of supply chain...\", \"parentId\": \"_uguzpgdta\"}]}, {\"id\": \"_p66om69pl\", \"name\": \"Review SOPs\", \"note\": \"undefined\", \"side\": \"right\", \"parentId\": \"_ns1nvi0ai\"}]}',NULL,NULL,0,'2019-09-22 05:15:31','2019-10-02 22:43:07'),(69,2,'{\"id\": \"_ns1nvi0ai\", \"name\": \"Increase plant uptime\", \"note\": \"Prioritization\", \"children\": [{\"id\": \"_o4r47dq71\", \"name\": \"Reduce operating costs\", \"note\": \"Look to reduce operating costs throughout all divisions and locations.  Start with aggregating data.\", \"side\": \"right\", \"children\": [{\"id\": \"_al6om6znz\", \"name\": \"Reduce inventory\", \"note\": \"undefined\", \"parentId\": \"_o4r47dq71\"}, {\"id\": \"_z3uk0721f\", \"name\": \"Operating procedures\", \"note\": \"Initial review of operating procedures.\", \"parentId\": \"_o4r47dq71\"}]}, {\"id\": \"_uajrljib9\", \"name\": \"Review supply chain processes\", \"note\": \"Perform supply chain review of all steps.\", \"side\": \"left\"}, {\"id\": \"_uguzpgdta\", \"name\": \"Introduce automation\", \"note\": \"Begin to use automation at all locations and sites.\", \"side\": \"left\", \"children\": [{\"id\": \"_c96w1yrth\", \"name\": \"Perform failover testing\", \"note\": \"Take sites offline to check failover capabilities\", \"children\": []}, {\"id\": \"_t8ln1vlwa\", \"name\": \"Review supply chain\", \"note\": \"Begin review of supply chain...\", \"parentId\": \"_uguzpgdta\"}]}, {\"id\": \"_p66om69pl\", \"name\": \"Review SOPs\", \"note\": \"undefined\", \"side\": \"right\", \"parentId\": \"_ns1nvi0ai\"}]}','Testing','Initial session to test some ideas.',1,'2019-09-22 19:54:25','2019-10-02 23:26:24'),(70,2,'{\"id\": \"_ns1nvi0ai\", \"name\": \"Increase plant uptime\", \"note\": \"Prioritization\", \"children\": [{\"id\": \"_o4r47dq71\", \"name\": \"Reduce operating costs\", \"note\": \"Look to reduce operating costs throughout all divisions and locations.  Start with aggregating data.\", \"side\": \"right\", \"children\": [{\"id\": \"_al6om6znz\", \"name\": \"Reduce inventory\", \"note\": \"undefined\", \"parentId\": \"_o4r47dq71\"}, {\"id\": \"_z3uk0721f\", \"name\": \"Operating procedures\", \"note\": \"Initial review of operating procedures.\", \"parentId\": \"_o4r47dq71\"}]}, {\"id\": \"_uajrljib9\", \"name\": \"Review supply chain processes\", \"note\": \"Perform supply chain review of all steps.\", \"side\": \"left\"}, {\"id\": \"_uguzpgdta\", \"name\": \"Introduce automation\", \"note\": \"Begin to use automation at all locations and sites.\", \"side\": \"left\", \"children\": [{\"id\": \"_c96w1yrth\", \"name\": \"Perform failover testing\", \"note\": \"Take sites offline to check failover capabilities\", \"children\": []}, {\"id\": \"_t8ln1vlwa\", \"name\": \"Review supply chain\", \"note\": \"Begin review of supply chain...\", \"parentId\": \"_uguzpgdta\"}]}, {\"id\": \"_p66om69pl\", \"name\": \"Review SOPs\", \"note\": \"undefined\", \"side\": \"right\", \"parentId\": \"_ns1nvi0ai\"}]}','New ideas',NULL,1,'2019-09-23 16:32:12','2019-10-02 23:24:56'),(71,2,'{\"id\": \"_ns1nvi0ai\", \"name\": \"Increase plant uptime\", \"note\": \"Prioritization\", \"children\": [{\"id\": \"_o4r47dq71\", \"name\": \"Reduce operating costs\", \"note\": \"Look to reduce operating costs throughout all divisions and locations.  Start with aggregating data.\", \"side\": \"right\", \"children\": [{\"id\": \"_al6om6znz\", \"name\": \"Reduce inventory\", \"note\": \"undefined\", \"parentId\": \"_o4r47dq71\"}, {\"id\": \"_z3uk0721f\", \"name\": \"Operating procedures\", \"note\": \"Initial review of operating procedures.\", \"parentId\": \"_o4r47dq71\"}]}, {\"id\": \"_uajrljib9\", \"name\": \"Review supply chain processes\", \"note\": \"Perform supply chain review of all steps.\", \"side\": \"left\"}, {\"id\": \"_uguzpgdta\", \"name\": \"Introduce automation\", \"note\": \"Begin to use automation at all locations and sites.\", \"side\": \"left\", \"children\": [{\"id\": \"_c96w1yrth\", \"name\": \"Perform failover testing\", \"note\": \"Take sites offline to check failover capabilities\", \"children\": []}, {\"id\": \"_t8ln1vlwa\", \"name\": \"Review supply chain\", \"note\": \"Begin review of supply chain...\", \"parentId\": \"_uguzpgdta\"}]}, {\"id\": \"_p66om69pl\", \"name\": \"Review SOPs\", \"note\": \"undefined\", \"side\": \"right\", \"parentId\": \"_ns1nvi0ai\"}]}','Brainstorming session','Brainstorming session',1,'2019-09-27 20:36:58','2019-10-02 23:24:57'),(72,2,'{\"id\": \"_ns1nvi0ai\", \"name\": \"Increase plant uptime\", \"note\": \"The idea is to have all the possibilities identified, prioritized to be able to allocate resources\", \"children\": [{\"id\": \"_o4r47dq71\", \"name\": \"Reduce operating costs\", \"note\": \"Look to reduce operating costs throughout all divisions and locations.  Start with aggregating data.\", \"side\": \"right\", \"children\": [{\"id\": \"_al6om6znz\", \"name\": \"Reduce Inventory\", \"note\": \"undefined\", \"parentId\": \"_o4r47dq71\"}, {\"id\": \"_z3uk0721f\", \"name\": \"Operating Procedures\", \"note\": \"Initial review of operating procedures.\", \"parentId\": \"_o4r47dq71\"}]}, {\"id\": \"_uajrljib9\", \"name\": \"Review supply chain processes\", \"note\": \"Perform supply chain review of all steps.\", \"side\": \"left\"}, {\"id\": \"_uguzpgdta\", \"name\": \"Introduce automation\", \"note\": \"Begin to use automation at all locations and sites.\", \"side\": \"left\", \"children\": [{\"id\": \"_c96w1yrth\", \"name\": \"Perform failover testing\", \"note\": \"Take sites offline to check failover capabilities\", \"children\": []}, {\"id\": \"_t8ln1vlwa\", \"name\": \"Review supply chain\", \"note\": \"Begin review of supply chain...\", \"parentId\": \"_uguzpgdta\"}]}, {\"id\": \"_p66om69pl\", \"name\": \"Review SOPs\", \"note\": \"undefined\", \"parentId\": \"_ns1nvi0ai\"}]}','Preliminary','Preliminary version.',1,'2019-09-27 20:54:42','2019-10-02 23:24:57'),(73,2,'{\"id\": \"_ns1nvi0ai\", \"name\": \"Increase plant uptime\", \"note\": \"The idea is to have all the possibilities identified, prioritized to be able to allocate resources\", \"children\": [{\"id\": \"_o4r47dq71\", \"name\": \"Reduce operating costs\", \"note\": \"Look to reduce operating costs throughout all divisions and locations.  Start with aggregating data.\", \"side\": \"right\", \"children\": [{\"id\": \"_al6om6znz\", \"name\": \"Reduce Inventory\", \"note\": \"undefined\", \"parentId\": \"_o4r47dq71\"}, {\"id\": \"_z3uk0721f\", \"name\": \"Operating Procedures\", \"note\": \"Initial review of operating procedures.\", \"parentId\": \"_o4r47dq71\"}]}, {\"id\": \"_uajrljib9\", \"name\": \"Review supply chain processes\", \"note\": \"Perform supply chain review of all steps.\", \"side\": \"left\"}, {\"id\": \"_uguzpgdta\", \"name\": \"Introduce automation\", \"note\": \"Begin to use automation at all locations and sites.\", \"side\": \"left\", \"children\": [{\"id\": \"_c96w1yrth\", \"name\": \"Perform failover testing\", \"note\": \"Take sites offline to check failover capabilities\", \"children\": []}, {\"id\": \"_t8ln1vlwa\", \"name\": \"Review supply chain\", \"note\": \"Begin review of supply chain...\", \"parentId\": \"_uguzpgdta\"}]}, {\"id\": \"_p66om69pl\", \"name\": \"Review SOPs\", \"note\": \"undefined\", \"parentId\": \"_ns1nvi0ai\"}]}','Earlier version of map for Northwest Lumber','Earlier version of map for Northwest Lumber.',1,'2019-09-27 20:54:43','2019-10-03 21:03:21'),(74,2,'{\"id\": \"_ns1nvi0ai\", \"name\": \"Increase plant uptime\", \"note\": \"The idea is to have all the possibilities identified, prioritized to be able to allocate resources\", \"children\": [{\"id\": \"_o4r47dq71\", \"name\": \"Reduce operating costs\", \"note\": \"Look to reduce operating costs throughout all divisions and locations.  Start with aggregating data.\", \"side\": \"right\", \"children\": [{\"id\": \"_al6om6znz\", \"name\": \"Reduce Inventory\", \"note\": \"undefined\", \"parentId\": \"_o4r47dq71\"}, {\"id\": \"_z3uk0721f\", \"name\": \"Operating Procedures\", \"note\": \"Initial review of operating procedures.\", \"parentId\": \"_o4r47dq71\"}]}, {\"id\": \"_uajrljib9\", \"name\": \"Review supply chain processes\", \"note\": \"Perform supply chain review of all steps.\", \"side\": \"left\"}, {\"id\": \"_uguzpgdta\", \"name\": \"Introduce automation\", \"note\": \"Begin to use automation at all locations and sites.\", \"side\": \"left\", \"children\": [{\"id\": \"_c96w1yrth\", \"name\": \"Perform failover testing\", \"note\": \"Take sites offline to check failover capabilities\", \"children\": []}, {\"id\": \"_t8ln1vlwa\", \"name\": \"Review supply chain\", \"note\": \"Begin review of supply chain...\", \"parentId\": \"_uguzpgdta\"}]}, {\"id\": \"_p66om69pl\", \"name\": \"Review SOPs\", \"note\": \"undefined\", \"parentId\": \"_ns1nvi0ai\"}, {\"id\": \"_5pxsd4561\", \"name\": \"\", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}, {\"id\": \"_z7o86fy1n\", \"name\": \"\", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}]}','Earlier session',NULL,1,'2019-09-27 21:23:45','2019-12-01 18:50:24'),(75,2,'{\"id\": \"_ns1nvi0ai\", \"name\": \"Increase plant uptime\", \"note\": \"The idea is to have all the possibilities identified, prioritized to be able to allocate resources\", \"children\": [{\"id\": \"_o4r47dq71\", \"name\": \"Reduce operating costs\", \"note\": \"Look to reduce operating costs throughout all divisions and locations.  Start with aggregating data.\", \"side\": \"right\", \"children\": [{\"id\": \"_al6om6znz\", \"name\": \"Reduce Inventory\", \"note\": \"undefined\", \"parentId\": \"_o4r47dq71\", \"description\": \"Inventory reductions, review for all sites.\"}, {\"id\": \"_z3uk0721f\", \"name\": \"Operating Procedures\", \"note\": \"Initial review of operating procedures.\", \"parentId\": \"_o4r47dq71\", \"description\": \"Check operating procedures periodically\"}], \"description\": \"Look to reduce operating costs as description.\"}, {\"id\": \"_uajrljib9\", \"name\": \"Review supply chain processes\", \"note\": \"Perform supply chain review of all steps.\", \"side\": \"left\", \"children\": [{\"id\": \"_xn7oyx7hr\", \"name\": \"Testing\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}], \"description\": \"\"}, {\"id\": \"_uguzpgdta\", \"name\": \"Introduce automation\", \"note\": \"Begin to use automation at all locations and sites.\", \"side\": \"left\", \"children\": [{\"id\": \"_c96w1yrth\", \"name\": \"Perform failover testing\", \"note\": \"Take sites offline to check failover capabilities\", \"children\": []}, {\"id\": \"_t8ln1vlwa\", \"name\": \"Review supply chain\", \"note\": \"Begin review of supply chain...\", \"parentId\": \"_uguzpgdta\"}]}, {\"id\": \"_p66om69pl\", \"name\": \"Review SOPs\", \"note\": \"undefined\", \"children\": [{\"id\": \"_582ere3hs\", \"name\": \"new\", \"note\": \"\", \"description\": \"\"}], \"parentId\": \"_ns1nvi0ai\"}, {\"id\": \"_y37397hsm\", \"name\": \"\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_i084930b8\", \"name\": \"\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_da6xf6trg\", \"name\": \"new\", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}]}','Latest test','Latest working mind map for Northwest.',1,'2019-09-27 21:23:48','2019-12-03 19:51:04'),(76,2,'{\"id\": \"_jfa9xnwag\", \"name\": \"New Goal\", \"note\": \"\", \"children\": [{\"id\": \"_wee2iro9x\", \"name\": \"new\", \"note\": \"\", \"side\": \"right\"}, {\"id\": \"_jb42g162q\", \"name\": \"new\", \"note\": \"\", \"side\": \"left\"}, {\"id\": \"_a6mfc0nag\", \"name\": \"new\", \"note\": \"\", \"side\": \"right\"}, {\"id\": \"_am8yup3lf\", \"name\": \"new\", \"note\": \"\", \"side\": \"left\"}]}','Newest mind map','Start from a new mind map.',1,'2019-09-27 21:37:13','2019-10-02 23:26:24'),(85,10,'{\"id\": \"_6n1u66n96\", \"name\": \"Data Driven Decision\", \"note\": \"\", \"children\": [{\"id\": \"_b59bmov5g\", \"name\": \"Data Availability\", \"note\": \"\", \"side\": \"right\", \"children\": [{\"id\": \"_t4kfkcdp8\", \"name\": \"Equipment\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_jy4qbqv00\", \"name\": \"Failure\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_ni4y7auyv\", \"name\": \"Correction Data\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}], \"description\": \"Data Completeness\"}, {\"id\": \"_wrfl8sigr\", \"name\": \"Data Quality\", \"note\": \"\", \"side\": \"right\", \"children\": [{\"id\": \"_h7c8r3o4x\", \"name\": \"Accuracy\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_sikgcuvkh\", \"name\": \"Resolution\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_ul25xlz8e\", \"name\": \"Traceability\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_5thduplva\", \"name\": \"Timeliness\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_n8lmlash2\", \"name\": \"Integrity\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}], \"description\": \"Accuracy, Resolution, Integrity, Traceability, \"}, {\"id\": \"_fsb0dbii7\", \"name\": \"Decision Process\", \"note\": \"\", \"side\": \"right\", \"children\": [{\"id\": \"_0j6fd6jhh\", \"name\": \"Dashboard and Report Based Decisions\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_yg6q10flu\", \"name\": \"Discovery Process and Work Intake\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}], \"description\": \"\"}, {\"id\": \"_2ck7fy9pb\", \"name\": \"Discover to Closure Process\", \"note\": \"\", \"side\": \"left\", \"children\": [{\"id\": \"_dhpvckknp\", \"name\": \"Discover\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_4cp94a015\", \"name\": \"Work Intake (EPIC)\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_s9d70rmnh\", \"name\": \"Closing and Feedback\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}], \"description\": \"\"}]}','APM - Darwin','2 year goals and objectives',1,'2019-11-30 18:02:21','2019-12-02 20:30:38'),(87,10,'{\"id\": \"_6n1u66n96\", \"name\": \"Data Driven Decision and Action Driving Asset Performance \", \"note\": \"\", \"children\": [{\"id\": \"_b59bmov5g\", \"name\": \"Discover\", \"note\": \"\", \"side\": \"right\", \"description\": \"Discovery of new opportunity\"}, {\"id\": \"_uli3fy343\", \"name\": \"Data Availability\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_wrfl8sigr\", \"name\": \"Intake - EPIC\", \"note\": \"\", \"side\": \"right\", \"description\": \"Accuracy, Resolution, Integrity, Traceability, \"}, {\"id\": \"_fsb0dbii7\", \"name\": \"Closing and Feedback\", \"note\": \"\", \"side\": \"right\", \"description\": \"Test description\"}, {\"id\": \"_c18orsfb5\", \"name\": \"Data Quality\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_n89cjafdu\", \"name\": \"\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_v7yjfxlq7\", \"name\": \"new\", \"note\": \"\", \"side\": \"right\", \"children\": [{\"id\": \"_g3qmh0vzg\", \"name\": \"new\", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}, {\"id\": \"_zrdtvr0bu\", \"name\": \"new\", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}, {\"id\": \"_58v9lukqv\", \"name\": \"new\", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}, {\"id\": \"_9oejea2qz\", \"name\": \"new\", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}, {\"id\": \"_twi0t474v\", \"name\": \"New\", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}], \"description\": \"\"}, {\"id\": \"_xglh0krex\", \"name\": \"new\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}]}','APUC Test Copy','Testing',0,'2019-12-01 21:33:32','2020-03-17 10:54:46'),(88,1,'{\"id\": \"_mudllw5ys\", \"name\": \"Nike\", \"note\": \"asdassadas\", \"children\": [{\"id\": \"_kiujn7n8a\", \"name\": \"Nike Canada\", \"note\": \"\", \"side\": \"right\", \"children\": [{\"id\": \"_uw3aoyoxy\", \"name\": \"Nike Brampton\", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}, {\"id\": \"_m1rizn183\", \"name\": \"Nike Toronto\", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}], \"description\": \"\"}, {\"id\": \"_v24qe3fdr\", \"name\": \"Nike India\", \"note\": \"\", \"side\": \"left\", \"children\": [{\"id\": \"_cj8wmhpsw\", \"name\": \"Nike Mumbai\", \"note\": \"\", \"side\": \"left\", \"children\": [{\"id\": \"_b1ri2o3op\", \"name\": \"new\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_sd3mc0r1l\", \"name\": \"new\", \"note\": \"\", \"side\": \"left\", \"children\": [{\"id\": \"_t1w4v9o2a\", \"name\": \"new\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_k12i453v3\", \"name\": \"new\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}], \"description\": \"\"}, {\"id\": \"_vfkt6my6i\", \"name\": \"new\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_8r7ln1uca\", \"name\": \"new\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_mzoc3867h\", \"name\": \"new\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_vl75dg7d0\", \"name\": \"new\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_qxorf0wll\", \"name\": \"new\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_82k904e7r\", \"name\": \"new\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_7bvlno4le\", \"name\": \"new\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_zzieh3lvt\", \"name\": \"new\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_krjdytnus\", \"name\": \"new\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_rs532fgye\", \"name\": \"new\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_c1yvchuav\", \"name\": \"new\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_8j5bp9dud\", \"name\": \"new\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_s3lgtczhr\", \"name\": \"new\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}], \"description\": \"\"}, {\"id\": \"_rlh873mjn\", \"name\": \"Nike Punjab\", \"note\": \"\", \"side\": \"left\", \"children\": [{\"id\": \"_t55eyry74\", \"name\": \"Nike Chandigarh\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_q6vsp40sd\", \"name\": \"Nike Mohali\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_pskkvde67\", \"name\": \"Nike Patiala\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_iy4yxcxag\", \"name\": \"Nike Sunam\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}], \"description\": \"\"}, {\"id\": \"_z095mnfd5\", \"name\": \"Nike Haryana\", \"note\": \"\", \"side\": \"left\", \"children\": [{\"id\": \"_54g00yxhu\", \"name\": \"Nike Panchkula\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_x4jgm31vu\", \"name\": \"Nike PaniPat\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_127c0025q\", \"name\": \"Nike Rohtak\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_2vpy3sfgb\", \"name\": \"\", \"note\": \"\", \"side\": \"left\", \"children\": [{\"id\": \"_tcfw57k17\", \"name\": \"Nike Tohana\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_6h09qra80\", \"name\": \"Nike Chika\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_1yb2uwhgc\", \"name\": \"Nike Jind\", \"note\": \"just test for nike jind\", \"side\": \"left\", \"description\": \"\"}], \"description\": \"\"}, {\"id\": \"_z2hmittmf\", \"name\": \"Nike Jakhal\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_q61k2uw89\", \"name\": \"Nike Hisar\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_yybe9i0ra\", \"name\": \"Nike Delhi\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_yofwuuvln\", \"name\": \"\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_em5xd05fp\", \"name\": \"Nike Meruth\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_bstm71mni\", \"name\": \"Nike Bilaspur\", \"note\": \"\", \"side\": \"left\", \"children\": [{\"id\": \"_m2mfj900a\", \"name\": \"Nike Bilas 1\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_e8o31779m\", \"name\": \"Nike Bilas 2\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}], \"description\": \"\"}, {\"id\": \"_h2ldgwsmm\", \"name\": \"\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_xxx93thx6\", \"name\": \"Nike Abhaypur\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_rb4uqf6p1\", \"name\": \"Nike Badhuti\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_d9tzy47i1\", \"name\": \"Nike Choki\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_r025rcqra\", \"name\": \"Nike Mogra\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_lnxvgr0ok\", \"name\": \"Nike mainpur\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_y0defmd8z\", \"name\": \"Nike Boruval\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_21cmwcody\", \"name\": \"Nike Mssin\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_fyx3abpza\", \"name\": \"Nike Virajpur\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}], \"description\": \"\"}, {\"id\": \"_vu9iili2i\", \"name\": \"\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_a749n6pfr\", \"name\": \"\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}], \"description\": \"\"}, {\"id\": \"_f3007mb32\", \"name\": \"new\", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}, {\"id\": \"_u1qid4g3w\", \"name\": \"\", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}]}','Test Project','Test desc',0,'2019-12-23 02:00:17','2020-02-20 07:37:43'),(89,10,'{\"id\": \"_jy3qn7fuq\", \"name\": \"Thermal Operations Performance \", \"note\": \"This mindmap is directly about KPIs. It can be seen as a KPI tree\", \"children\": [{\"id\": \"_p85pc1hq1\", \"name\": \"Heat Rate\", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}, {\"id\": \"_0wolf25m8\", \"name\": \"On Time Fulfillment\", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}, {\"id\": \"_xg2ravtdj\", \"name\": \"Unit Trip\", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}, {\"id\": \"_be1vbwx62\", \"name\": \"Planned vs Unplanned\", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}, {\"id\": \"_t3ky657ra\", \"name\": \"Availability\", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}]}','Thermal Operations Performance','Key Measurements for Thermal Operations and Identification of Opportunities',1,'2019-12-23 14:59:46','2020-01-14 03:31:04'),(91,1,'{\"id\": \"_jgds4z753\", \"name\": \"Root\", \"note\": \"\", \"children\": [{\"id\": \"_wgdddy0sn\", \"name\": \"new\", \"note\": \"ghdjfmdmbv fhrfhs fhkf shfsk A Key Performance Indicator is a measurable value that demonstrates how effectively a company is achieving key business objectives. Organizations use KPIs at multiple levels to evaluate their success at reaching targets. High-level KPIs may focus on the overall performance of the business, while low-level KPIs may focus on processes in departments such as sales, marketing, HR, support and others.\\n        \", \"side\": \"right\", \"description\": \"\"}]}','MindMapNameQuidProNew','MindMapDescQuidProNew',0,'2020-01-02 10:20:43','2020-02-19 09:09:23'),(133,9,'{\"id\": \"_90oai3puv\", \"name\": \"Root\", \"note\": \"\", \"children\": []}','','',0,'2020-02-19 12:36:06','2020-02-19 12:36:18'),(134,4,'{\"id\": \"_7xsfynsgs\", \"name\": \"Root\", \"note\": \"\", \"children\": []}','dffsdf','',1,'2020-02-19 13:16:49','2020-02-19 13:16:49'),(135,1,'{\"id\": \"_r80ecbjs7\", \"name\": \"Root\", \"note\": \"\", \"children\": []}','Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test ','Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr ',0,'2020-02-20 07:37:55','2020-02-25 11:18:31'),(136,10,'{\"id\": \"_5yybkqtp1\", \"name\": \"Major Component\", \"note\": \"\", \"children\": [{\"id\": \"_utbaam1wi\", \"name\": \"Faster Return To Services\", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}, {\"id\": \"_ossyw00z5\", \"name\": \"Root Cause and Preventative Measures\", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}, {\"id\": \"_bol9msytp\", \"name\": \"Proactive and Assertive Communication\", \"note\": \"\", \"side\": \"left\", \"children\": [{\"id\": \"_qm57s0afc\", \"name\": \"Internal Stakeholders\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_w53ja0ubx\", \"name\": \"External / Supplier\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}], \"description\": \"\"}, {\"id\": \"_bm7guempn\", \"name\": \"Process Ambiguities and Complexities\", \"note\": \"\", \"side\": \"left\", \"children\": [{\"id\": \"_4sjep9u8p\", \"name\": \"\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_i4obotpke\", \"name\": \"\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}], \"description\": \"\"}, {\"id\": \"_bcbtbthgl\", \"name\": \"Supplier Performance Management\", \"note\": \"\", \"side\": \"left\", \"children\": [{\"id\": \"_nror2wkl8\", \"name\": \"Consequences / contracts\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_iglrzbfoc\", \"name\": \"Rewards for good results\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}], \"description\": \"\"}, {\"id\": \"_k2j393oeg\", \"name\": \"Collaborative Supplier Relationship\", \"note\": \"\", \"side\": \"left\", \"children\": [{\"id\": \"_gjxdngvv3\", \"name\": \"Executive Relationship\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_mrzp9rm41\", \"name\": \"Structure from both sides\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}], \"description\": \"\"}]}','Major Component Failure - 1','Current State and Opportunities for Improvement',1,'2020-03-04 15:19:42','2020-03-04 15:39:24'),(137,10,'{\"id\": \"_hdv1zp9oe\", \"name\": \"Faster RTS and Effective RCA for Major Component Failure\", \"note\": \"\", \"children\": [{\"id\": \"_x0b3j0mc8\", \"name\": \"Proactive and Assertive Communication\", \"note\": \"\", \"side\": \"right\", \"children\": [{\"id\": \"_gc38rjc2k\", \"name\": \"Internal Communication\", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}, {\"id\": \"_h8u2be0wt\", \"name\": \"Supplier Communication\", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}], \"description\": \"\"}, {\"id\": \"_2fyqizzgh\", \"name\": \"Process Ambiguities and Complexities \", \"note\": \"\", \"side\": \"right\", \"children\": [{\"id\": \"_oeclfpgz1\", \"name\": \"Waiting time for Approvals\", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}, {\"id\": \"_yzzdrklaq\", \"name\": \"Critical Path - Sequential / concurrent\", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}], \"description\": \"\"}, {\"id\": \"_wpol017iw\", \"name\": \"Collaborative Supplier Relationship Management\", \"note\": \"\", \"side\": \"right\", \"children\": [{\"id\": \"_c3gn2ulso\", \"name\": \"Executive Relationship\", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}, {\"id\": \"_un5lagzcj\", \"name\": \"Hierarchy / point of contact\", \"note\": \"\", \"parentId\": \"_wpol017iw\", \"description\": null}], \"description\": \"\"}, {\"id\": \"_krvf2iq7r\", \"name\": \"Supplier Performance Management\", \"note\": \"\", \"side\": \"right\", \"children\": [{\"id\": \"_m038ev93l\", \"name\": \"Consequences / Contracts \", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}, {\"id\": \"_eq65f6k9p\", \"name\": \"Celebrate / reward /a team / individual \", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}], \"description\": \"\"}], \"nodeMetaData\": {\"_c3gn2ulso\": {\"notes\": \"Building relationship at different levels of the supplier organization to be able to influence suppliers performance and decisions\"}, \"_eq65f6k9p\": {\"notes\": \"Reward to encourage positive performance, set standard, introduce competition \"}, \"_gc38rjc2k\": {\"notes\": \"Internal cross functional communication, action plan\"}, \"_h8u2be0wt\": {\"notes\": \"Communication channel\\nEscalation path and method\\n\"}, \"_m038ev93l\": {\"notes\": \"Consequence on future contract\\nAnything else?\"}, \"_oeclfpgz1\": {\"notes\": \"PO, PSJ, FWO approval process\\nLandowner\"}, \"_un5lagzcj\": {\"notes\": \"minimal overlap in the communication \"}, \"_yzzdrklaq\": {\"notes\": \"Project critical path\"}}}','RTS from Major Component Failure','Contributing factors and opportunities for improvement',1,'2020-03-04 15:52:29','2020-05-10 03:32:44'),(138,55,'{\"id\": \"_s684q051v\", \"name\": \"Root\", \"note\": \"\", \"children\": [{\"id\": \"_335wv0xp1\", \"name\": \"This is testing node\", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}, {\"id\": \"_hexfolddk\", \"name\": \"new\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_5hu91nmca\", \"name\": \"This is real testing\", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}], \"nodeMetaData\": {\"_335wv0xp1\": {\"notes\": \"We are doing the testing of this module\\niugghsiegiugsre\", \"nodeDescription\": \"TEst node desc\"}, \"_5hu91nmca\": {\"notes\": \"this is the testing notes\", \"nodeDescription\": \"New test\"}, \"_s684q051v\": {\"notes\": \"1\\n2\\n3\\n\", \"nodeDescription\": \"zxcsdsfdsfsdf\"}, \"_x0b3j0mc8\": {}}}','My Map','Test Map',1,'2020-04-27 11:20:40','2020-05-01 19:06:22'),(139,55,'{\"id\": \"_m4lpo7kti\", \"name\": \"Root\", \"note\": \"\", \"children\": [{\"id\": \"_e8vy48q1r\", \"name\": \"new1\", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}, {\"id\": \"_gjsvms5q0\", \"name\": \"new3\", \"note\": \"\", \"side\": \"left\", \"description\": \"\"}, {\"id\": \"_bh5xsap9v\", \"name\": \"new2\", \"note\": \"\", \"side\": \"right\", \"description\": \"\"}], \"nodeMetaData\": {\"_5hu91nmca\": {}, \"_bh5xsap9v\": {\"notes\": \"new2 Note\", \"nodeDescription\": \"new2\"}, \"_e8vy48q1r\": {\"notes\": \"New 1 note\", \"nodeDescription\": \"new1 \"}, \"_gjsvms5q0\": {\"notes\": \"3\", \"nodeDescription\": \"3\"}, \"_m4lpo7kti\": {\"nodeDescription\": \"aaa\"}}}','t','',1,'2020-04-30 02:21:08','2020-05-02 03:19:16');
/*!40000 ALTER TABLE `mindmaps` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_ins_mindmaps` AFTER INSERT ON `mindmaps` FOR EACH ROW begin
         
            insert into SearchData (orgId,ganttTaskId, foreignId, title, description, source, active)
            values (NEW.orgId,0, NEW.id, NEW.mapName, NEW.mapDescription, 'Mindmaps',NEW.active);
        end */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_upd_mindmaps` AFTER UPDATE ON `mindmaps` FOR EACH ROW begin
            
            insert into SearchData (orgId,ganttTaskId, foreignId, title, description,  source,active)
            values (NEW.orgId,0, NEW.id, NEW.mapName, NEW.mapDescription,  'Mindmaps',NEW.active)
            on duplicate key update
                foreignId = NEW.id,
title = NEW.mapName,
active=NEW.active,
description = NEW.mapDescription;
        end */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `organizationactions`
--

DROP TABLE IF EXISTS `organizationactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organizationactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `orgId` int NOT NULL,
  `assigneeId` int DEFAULT NULL,
  `status` enum('Open','Closed') DEFAULT 'Open',
  `disabled` tinyint(1) DEFAULT '0',
  `disabledAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `dateAdded` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orgId` (`orgId`),
  KEY `assigneeId` (`assigneeId`),
  KEY `dateAddedQuery` (`dateAdded`,`orgId`,`disabled`),
  CONSTRAINT `OrganizationActions_ibfk_1` FOREIGN KEY (`orgId`) REFERENCES `organizations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `OrganizationActions_ibfk_2` FOREIGN KEY (`assigneeId`) REFERENCES `persons` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organizationactions`
--

LOCK TABLES `organizationactions` WRITE;
/*!40000 ALTER TABLE `organizationactions` DISABLE KEYS */;
INSERT INTO `organizationactions` VALUES (1,'Action test','test',55,241,'Closed',0,'2020-03-25 11:26:06','2020-03-25 11:26:06','2020-03-25 11:26:06','2020-03-25'),(2,'testing.','desc',10,57,'Open',1,'2020-03-29 06:05:47','2020-03-29 06:05:47','2020-04-02 17:29:28','2020-03-29'),(3,'Major Component','Process Design and ',10,57,'Open',1,'2020-03-31 14:03:20','2020-03-31 14:03:20','2020-04-02 17:29:21','2020-03-31'),(4,'NA','NA',10,57,'Open',1,'2020-04-01 17:13:32','2020-04-01 17:13:32','2020-04-02 17:02:13','2020-04-01'),(5,'NA','NA',10,105,'Open',1,'2020-04-01 17:50:44','2020-04-01 17:50:44','2020-04-02 17:02:14','2020-04-01'),(6,'NA','\'- Pandemic planning\n- APM process, \n- Bazefield troubleshooting/PMing, \n- WSP target planning, \n- New site setup (GBS2 & Cornwall)',10,243,'Open',1,'2020-04-01 17:50:51','2020-04-01 17:50:51','2020-04-02 17:29:15','2020-04-01'),(7,'NA','NA',10,57,'Open',1,'2020-04-02 04:06:04','2020-04-02 04:06:04','2020-04-02 17:02:02','2020-04-02'),(8,'NA','NA',10,244,'Open',1,'2020-04-02 04:06:19','2020-04-02 04:06:19','2020-04-02 17:02:04','2020-04-02'),(9,'NA','NA',10,243,'Open',1,'2020-04-02 04:20:55','2020-04-02 04:20:55','2020-04-02 17:02:05','2020-04-02'),(10,'NA','NA',10,244,'Open',1,'2020-04-02 04:21:53','2020-04-02 04:21:53','2020-04-02 17:02:06','2020-04-02'),(11,'','\'- Pandemic planning\n- APM process, \n- Bazefield troubleshooting/PMing, \n- WSP target planning, \n- New site setup (GBS2 & Cornwall)',10,243,'Open',1,'2020-04-02 17:05:52','2020-04-02 00:00:00','2020-04-02 17:16:22','2020-04-02'),(12,'','',10,244,'Open',1,'2020-04-02 17:06:10','2020-04-02 00:00:00','2020-04-02 17:06:22','2020-04-02'),(13,'','\'- Pandemic planning\n- APM process, \n- Bazefield troubleshooting/PMing, \n- WSP target planning, \n- New site setup (GBS2 & Cornwall)',10,105,'Open',0,'2020-04-02 17:16:50','2020-03-24 00:00:00','2020-04-02 17:17:08','2020-03-24'),(14,'','\'- Unplanned Event Collection of information\n-  Major Component\n-  Engineering COE, PM Method',10,57,'Open',0,'2020-04-02 17:17:57','2020-03-24 00:00:00','2020-04-02 17:18:15','2020-03-24'),(15,'','-  API/Python connection for reports/data\n-  Pareto Charts\n-  widget development,\n-  OEM scoring \n-  check Meteologica forecast Model',10,244,'Open',0,'2020-04-02 17:19:07','2020-03-24 00:00:00','2020-04-02 17:21:02','2020-03-24'),(16,'','Process Design and ',10,57,'Open',1,'2020-04-02 17:21:42','2020-04-02 00:00:00','2020-04-02 17:21:53','2020-04-02'),(17,'','Process Design and ',10,57,'Open',1,'2020-04-02 17:21:56','2020-04-02 00:00:00','2020-04-02 17:22:06','2020-04-02'),(18,'','',10,243,'Open',1,'2020-04-02 17:23:56','2020-04-02 00:00:00','2020-04-02 17:28:19','2020-04-02'),(19,'','\'- Pandemic planning\n- APM process, \n- Bazefield troubleshooting/PMing, \n- WSP target planning, \n- New site setup (GBS2 & Cornwall)',10,105,'Open',1,'2020-04-02 17:28:29','2020-04-02 00:00:00','2020-04-02 17:29:09','2020-04-02'),(20,'','Process Design and ',10,57,'Open',1,'2020-04-02 17:28:54','2020-04-02 00:00:00','2020-04-02 17:29:08','2020-04-02'),(21,'','\'- Unplanned Event Collection of information\n-  Major Component\n-  Engineering COE, PM Method',10,57,'Open',1,'2020-04-02 17:29:44','2020-04-02 00:00:00','2020-04-02 17:30:12','2020-04-02'),(23,'','1. RTS for Major Component\n2. UPE Process\n3. \n4.\n5.\n6.',10,57,'Open',0,'2020-04-02 18:37:25','2020-04-02 00:00:00','2020-04-02 18:40:02','2020-04-02'),(24,'','1. Darwin \n2. APM Process\n3. \n4\n5\n6\n7\n',10,105,'Open',0,'2020-04-02 18:40:41','2020-04-02 00:00:00','2020-04-02 18:43:30','2020-04-02'),(25,'','-  API/Python connection for reports/data\n-  Pareto Charts\n-  widget development,\n-  OEM scoring \n-  check Meteologica forecast Model',10,244,'Open',1,'2020-04-02 19:14:57','2020-04-02 00:00:00','2020-04-02 19:15:39','2020-04-02'),(26,'','1. P3 Process Map and Analysis\n2. RTS Target Values\n3. PM example documents review',10,244,'Open',0,'2020-04-02 19:15:51','2020-04-02 00:00:00','2020-04-02 20:32:14','2020-04-02'),(28,'','1. RTS for Major Component\n2. UPE Process\n3. \n4.\n5.\n6.',10,57,'Open',1,'2020-04-02 23:13:05','2020-04-04 00:00:00','2020-04-04 07:40:26','2020-04-04'),(29,'','1. P3 Process Map and Analysis\n2. RTS Target Values\n3. PM example documents review',10,244,'Open',1,'2020-04-03 03:58:39','2020-04-03 00:00:00','2020-04-03 03:59:39','2020-04-03'),(30,'','tESTITEM',10,243,'Open',1,'2020-04-03 08:35:22','2020-03-24 00:00:00','2020-04-03 08:36:08','2020-03-24'),(31,'','1. RTS for Major Component\n2. UPE Process\n3. \n4.\n5.\n6.',10,57,'Open',0,'2020-04-03 11:58:57','2020-04-03 00:00:00','2020-04-03 11:59:00','2020-04-03'),(32,'','test desc',10,57,'Open',0,'2020-04-04 03:44:19','2020-04-01 00:00:00','2020-04-04 03:44:28','2020-04-01'),(33,'','1. RTS for Major Component\n2. UPE Process\n3. \n4.\n5.\n6.',10,57,'Open',0,'2020-04-04 07:40:31','2020-04-04 00:00:00','2020-04-04 07:40:33','2020-04-04'),(34,'','1. RTS for Major Component\n2. UPE Process Alignment\n3. Eng\'g COE',10,57,'Open',0,'2020-04-08 17:02:55','2020-04-08 00:00:00','2020-04-09 16:24:38','2020-04-08'),(35,'','1. RTS for Major Component\n2. UPE Process\n3. Eng\'g COE',10,57,'Open',0,'2020-04-08 17:04:04','2020-04-07 00:00:00','2020-04-18 02:07:02','2020-04-07'),(36,'','1. Chasing Bazefield\n2. IT ODBC @ Odell\n3. GBS2 set up in Bazefield\n4. Call Future O&M building\n',10,105,'Open',0,'2020-04-08 17:04:27','2020-04-07 00:00:00','2020-04-09 16:23:26','2020-04-07'),(38,'','1. Solar production theoretical calculation\n2. MB analysis @ SL & RL\n3. End of Term Presentation (LPCo)\n4. IESO close-up',10,249,'Open',0,'2020-04-09 02:20:50','2020-04-08 00:00:00','2020-04-09 02:21:38','2020-04-08'),(39,'','1. Solar production theoretical calculation\n2. MB analysis @ SL & RL\n3. End of Term Presentation (LPCo)\n4. IESO close-up',10,249,'Open',0,'2020-04-09 02:21:59','2020-04-07 00:00:00','2020-04-09 02:22:02','2020-04-07'),(41,'','1. Bazefield Project task list\n2. IT ODBC @ Odell\n3. GBS2 set up in Bazefield\n4. Call Future O&M building\n',10,105,'Open',0,'2020-04-09 16:17:30','2020-04-08 00:00:00','2020-04-10 03:48:19','2020-04-08'),(42,'','',10,57,'Open',1,'2020-04-10 03:49:32','2020-04-10 00:00:00','2020-04-10 03:50:05','2020-04-10'),(43,'','1. RTS for Major Component Word Document\n2. UPE Process Alignment\n3. Eng\'g COE Word Document',10,57,'Open',0,'2020-04-10 03:51:21','2020-04-10 00:00:00','2020-04-10 06:37:48','2020-04-10'),(44,'','1. P3 Process Map and Analysis\n2. RTS Target Values\n3. PM example documents review',10,244,'Open',0,'2020-04-10 06:36:55','2020-04-10 00:00:00','2020-04-10 16:27:49','2020-04-10'),(45,'','',10,105,'Open',1,'2020-04-10 10:05:48','2020-04-10 00:00:00','2020-04-10 10:07:01','2020-04-10'),(46,'','1. Solar production theoretical calculation\n2. MB analysis @ SL & RL\n3. End of Term Presentation (LPCo)\n4. IESO close-up',10,249,'Open',0,'2020-04-10 16:28:27','2020-04-10 00:00:00','2020-04-10 16:28:42','2020-04-10'),(47,'','1. Bazefield Project task list\n2. IT ODBC @ Odell\n3. GBS2 set up in Bazefield\n4. Call Future O&M building\n',10,105,'Open',0,'2020-04-10 16:38:13','2020-04-10 00:00:00','2020-04-10 16:38:17','2020-04-10'),(48,'','',10,164,'Open',1,'2020-04-10 17:08:44','2020-04-10 00:00:00','2020-04-10 17:09:01','2020-04-10'),(49,'','1. IPI on charts (template/troubleshoot IPI)\n2. Custom alarm @ Amherst based on Set point\n3. Graph widgets.',10,164,'Open',0,'2020-04-10 17:19:59','2020-04-10 00:00:00','2020-04-13 06:41:45','2020-04-10'),(50,'','1. IPI on charts (template/troubleshoot IPI)\n2. Custom alarm @ Amherst based on Set point\n3. Graph widgets.',10,164,'Open',0,'2020-04-21 22:04:10','2020-04-21 00:00:00','2020-04-28 18:04:50','2020-04-21'),(51,'','1. Solar production theoretical calculation\n2. MB analysis @ SL & RL\n4. IESO close-up\n5. Maintenance Plan (Usman)\n6. Master Asset List (Usman)',10,249,'Open',0,'2020-04-21 22:04:17','2020-04-21 00:00:00','2020-04-21 22:10:24','2020-04-21'),(52,'','1. Bazefield Project task list\n2. IT ODBC @ Odell\n3. GBS2 set up in Bazefield\n4. Call Future O&M building\n',10,105,'Open',0,'2020-04-21 22:04:29','2020-04-21 00:00:00','2020-04-21 22:04:31','2020-04-21'),(53,'','1. RTS for Major Component Word Document\n2. Thermal KPI Process\n3. Eng\'g COE Word Document\n4. PM Method - Prioritization',10,57,'Open',0,'2020-04-21 22:04:54','2020-04-21 00:00:00','2020-04-21 22:11:18','2020-04-21'),(54,'','1. Bazefield Project task list\n2. IT ODBC @ Odell\n3. GBS2 set up in Bazefield\n4. Call Future O&M building\n',10,105,'Open',0,'2020-04-28 18:05:21','2020-04-28 00:00:00','2020-04-28 18:05:25','2020-04-28'),(55,'','1. RTS for Major Component Word Document\n2. Thermal KPI Process\n3. PM Method - Prioritization',10,57,'Open',0,'2020-04-28 18:05:45','2020-04-28 00:00:00','2020-04-28 18:06:02','2020-04-28'),(56,'','',1,57,'Open',0,'2020-05-01 23:35:48','2020-04-16 00:00:00','2020-05-01 23:35:48','2020-04-16'),(57,'','1. P1-P5 Strategy\n2. AS Roadmap and Structure\n3. EPIC Changes\n4. PM Review and arrange conference calls',1,57,'Open',0,'2020-05-01 23:36:09','2020-05-01 00:00:00','2020-05-01 23:38:37','2020-05-01'),(58,'','1. PM Methodology - follow the prioritized plan, research and build brick by brick - PSJ, Change Management, Risk',1,248,'Open',0,'2020-05-01 23:36:15','2020-05-01 00:00:00','2020-05-01 23:43:57','2020-05-01'),(59,'','1. Thermal KPI - try different frequency, way of plotting to get the story\n2. Learning SQL, Excel Macro',1,253,'Open',0,'2020-05-01 23:36:19','2020-05-01 00:00:00','2020-05-01 23:44:09','2020-05-01'),(60,'','1. P1-P5 Strategy\n2. AS Roadmap and Structure\n3. EPIC Changes\n4. PM Review and arrange conference calls',1,57,'Open',0,'2020-05-05 01:48:11','2020-05-04 00:00:00','2020-05-05 01:48:13','2020-05-04'),(61,'','1. RTS for Major Component Word Document\n2. Thermal KPI Process\n3. PM Method - Prioritization',10,57,'Open',0,'2020-05-05 01:48:39','2020-05-04 00:00:00','2020-05-05 01:48:41','2020-05-04'),(62,'','1. IPI on charts (template/troubleshoot IPI)\n2. Custom alarm @ Amherst based on Set point\n3. Graph widgets.',10,164,'Open',0,'2020-05-05 01:49:05','2020-05-04 00:00:00','2020-05-05 01:49:07','2020-05-04'),(63,'','1. Bazefield Project task list\n2. IT ODBC @ Odell\n3. GBS2 set up in Bazefield\n4. Call Future O&M building\n',10,105,'Open',0,'2020-05-05 01:49:14','2020-05-04 00:00:00','2020-05-05 01:49:17','2020-05-04'),(64,'','1. Solar production theoretical calculation\n2. MB analysis @ SL & RL\n4. IESO close-up\n5. Maintenance Plan (Usman)\n6. Master Asset List (Usman)',10,249,'Open',0,'2020-05-05 01:49:29','2020-05-04 00:00:00','2020-05-05 01:49:33','2020-05-04');
/*!40000 ALTER TABLE `organizationactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organizationdocuments`
--

DROP TABLE IF EXISTS `organizationdocuments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organizationdocuments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `fileName` varchar(255) NOT NULL,
  `orgId` int NOT NULL,
  `uploadBy` int NOT NULL,
  `disabled` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `disabledAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orgId` (`orgId`),
  KEY `uploadBy` (`uploadBy`),
  CONSTRAINT `OrganizationDocuments_ibfk_1` FOREIGN KEY (`orgId`) REFERENCES `organizations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `OrganizationDocuments_ibfk_2` FOREIGN KEY (`uploadBy`) REFERENCES `persons` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organizationdocuments`
--

LOCK TABLES `organizationdocuments` WRITE;
/*!40000 ALTER TABLE `organizationdocuments` DISABLE KEYS */;
INSERT INTO `organizationdocuments` VALUES (1,'Test Document for Org up','Desc of ORG Docu 2','7d14f039-f72e-4e49-becf-e885f0480da7-250x250.png',55,240,0,'2020-03-24 06:22:12','2020-03-24 08:11:00',NULL),(2,'test 2 of doc','test','a6db2747-0878-484d-93c2-a84e93a412de-value-infinity-mvp--org-documents.png',55,240,0,'2020-03-24 09:33:38','2020-03-24 09:33:38',NULL),(3,'t3','','aed04ba0-bfce-4ad1-ac83-14a651f07df7-value-infinity-mvp--org-documents.png',55,240,0,'2020-03-24 09:34:14','2020-03-24 09:34:14',NULL),(4,'t4uu','t4','5029e902-ad07-48d8-a807-134c2fa2c38c-value-infinity-mvp--org-documents.png',55,240,0,'2020-03-24 09:41:40','2020-03-24 09:44:37',NULL),(5,'t5 up','t5 up','f0010576-77e2-4e78-8b8e-af427286d7ba-value-infinity-mvp--org-documents.png',55,168,0,'2020-03-24 09:44:11','2020-03-24 09:44:24',NULL);
/*!40000 ALTER TABLE `organizationdocuments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organizationpersons`
--

DROP TABLE IF EXISTS `organizationpersons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organizationpersons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `organizationId` int NOT NULL,
  `personId` int NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `disabled` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`organizationId`,`personId`),
  UNIQUE KEY `organizationId_personId` (`organizationId`,`personId`),
  UNIQUE KEY `id` (`id`),
  KEY `personId` (`personId`),
  CONSTRAINT `OrganizationPersons_ibfk_1` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `OrganizationPersons_ibfk_2` FOREIGN KEY (`personId`) REFERENCES `persons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organizationpersons`
--

LOCK TABLES `organizationpersons` WRITE;
/*!40000 ALTER TABLE `organizationpersons` DISABLE KEYS */;
INSERT INTO `organizationpersons` VALUES (26,9,168,'2020-02-19 06:05:16','2020-02-19 06:05:16',0),(17,10,3,'2020-02-12 09:42:38','2020-02-12 09:42:38',0),(18,10,4,'2020-02-12 11:00:46','2020-02-12 11:00:46',0),(27,10,57,'2020-02-21 16:56:53','2020-02-21 16:56:53',0),(16,10,105,'2020-02-12 05:21:58','2020-02-12 05:21:58',0),(14,10,168,'2020-02-11 10:05:25','2020-02-11 10:05:25',0);
/*!40000 ALTER TABLE `organizationpersons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organizations`
--

DROP TABLE IF EXISTS `organizations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organizations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `owningOrg` tinyint(1) DEFAULT '0',
  `lockPrioritization` tinyint(1) DEFAULT '0',
  `active` tinyint DEFAULT '1',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organizations`
--

LOCK TABLES `organizations` WRITE;
/*!40000 ALTER TABLE `organizations` DISABLE KEYS */;
INSERT INTO `organizations` VALUES (1,'ValueInfinity',1,1,1,'2019-01-27 03:30:44','2020-03-19 00:22:02'),(2,'Northwest Lumber',0,0,1,'2019-01-27 03:30:44','2020-02-20 10:02:07'),(3,'Diamond Wind Turbine',0,0,0,'2019-01-27 03:30:44','2020-03-02 00:36:31'),(4,'Thoughtive',0,1,0,'2019-01-27 03:30:44','2020-03-02 00:36:31'),(7,'Invenergy',0,0,0,'2019-01-27 03:30:44','2020-03-02 00:36:32'),(9,'Dummy Company',0,0,0,'2019-01-27 03:30:44','2020-03-02 00:36:32'),(10,'APUC',0,0,1,'2019-11-29 19:17:07','2020-03-19 01:23:48'),(55,'KBIHM',0,0,1,'2020-03-04 09:30:23','2020-03-19 00:22:23');
/*!40000 ALTER TABLE `organizations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persons`
--

DROP TABLE IF EXISTS `persons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `persons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orgId` int NOT NULL,
  `firstName` varchar(128) DEFAULT NULL,
  `lastName` varchar(128) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `allowLogin` tinyint(1) DEFAULT '0',
  `email` varchar(255) NOT NULL,
  `deptId` int DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `pwdhash` varchar(255) NOT NULL,
  `disabled` tinyint(1) DEFAULT '0',
  `lastLogin` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `disabledAt` datetime DEFAULT NULL,
  `fullName` varchar(255) GENERATED ALWAYS AS (concat(`lastName`,_utf8mb4', ',`firstName`)) VIRTUAL,
  `isCustomerAdmin` tinyint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `persons_email` (`email`),
  KEY `Persons_Organizations_ind` (`orgId`),
  KEY `Persons_login_ind` (`email`,`pwdhash`,`disabled`),
  KEY `Persons_Departments_id_fk` (`deptId`),
  FULLTEXT KEY `firstName_lastName_username_email_role` (`firstName`,`lastName`,`username`,`email`,`role`),
  CONSTRAINT `Persons_Departments_id_fk` FOREIGN KEY (`deptId`) REFERENCES `departments` (`id`),
  CONSTRAINT `Persons_ibfk_1` FOREIGN KEY (`orgId`) REFERENCES `organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=255 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persons`
--

LOCK TABLES `persons` WRITE;
/*!40000 ALTER TABLE `persons` DISABLE KEYS */;
INSERT INTO `persons` (`id`, `orgId`, `firstName`, `lastName`, `username`, `allowLogin`, `email`, `deptId`, `role`, `pwdhash`, `disabled`, `lastLogin`, `createdAt`, `updatedAt`, `disabledAt`, `isCustomerAdmin`) VALUES (3,1,'Alauddin','Ahmed','alauddinahmed',1,'alauddin@value-infinity.io',NULL,NULL,'$2b$12$wzsBjPo06zeQ6SQ4ThySS.xv6KN3/Tn7Aoa5PKBs4ANY7EdFqflGu',0,'2020-05-23 09:15:32','2020-04-11 14:38:53','2020-05-23 09:15:32',NULL,NULL),(4,1,'Christina','Wang','christinawang',1,'cwang@value-infinity.com',NULL,'Data Analyst','$2b$12$/QOl0PVpGilcDxznE6ZhLeVtt9pGM0lhXLD8KSg43uiE8YITkJKz2',1,NULL,'2020-04-11 14:38:53','2020-04-11 14:38:53',NULL,NULL),(5,1,'Adi','Joshi','adijoshi',1,'ajoshi@value-infinity.com',NULL,NULL,'$2b$12$FbNu/hIe0lgDQDfz0ez60u7r4LB02B6YGesH0hfaGZTSJTSh0DFtq',0,NULL,'2020-04-11 14:38:53','2020-04-11 14:38:53',NULL,NULL),(7,2,'Sam','Walters','bradkaufman111',1,'walters@@nwlumber-testorg.io',2,'Director','$2b$12$FbNu/hIe0lgDQDfz0ez60u7r4LB02B6YGesH0hfaGZTSJTSh0DFtq',0,NULL,'2019-01-28 15:22:55','2019-12-24 15:38:28',NULL,NULL),(8,2,'Brad','Kramer','bk23',1,'bkramer@nwlumber-testorg.io',3,NULL,'',0,NULL,'2019-01-28 16:50:25','2019-05-27 17:34:12',NULL,NULL),(55,1,'Brad','Kaufman(org)',NULL,1,'brad11@th.io',10,'New Analyst','$2b$12$obi6JPvPLYPMEEgfjtkRuOsgmHOgq1HbSQQDV.sYSFupEEwiKmoS2',1,'2020-03-20 20:41:29','2019-02-25 19:52:07','2020-04-29 21:25:42',NULL,NULL),(57,1,'Alauddin','Ahmed',NULL,1,'ahmed.alauddin@value-infinity.com',2,'Consultant','$2b$12$jFdFoZmCE0/.vmBDL5bNSOovEv4x3HW3KILW/A.Sh6WzZa6Iyi3LW',0,'2020-05-18 13:55:41','2019-02-26 22:08:24','2020-05-18 13:55:41',NULL,NULL),(66,2,'Mary','Jones',NULL,0,'test@nwlumber-testorg.io',14,'Data Scientist','xxx',0,NULL,'2019-04-13 12:47:38','2019-05-27 23:23:14',NULL,NULL),(67,2,'Jane','Jackson',NULL,1,'test231@nwlumber-testorg.io',14,'Head of Operations','xxx',0,NULL,'2019-04-13 12:47:39','2019-12-07 00:29:36',NULL,NULL),(68,2,'Martin','Murray',NULL,0,'test13@nwlumber-testorg.io',NULL,'Data Analyst','xxx',0,NULL,'2019-04-13 12:47:39','2019-05-27 17:38:28',NULL,NULL),(69,2,'Robert','Allen',NULL,1,'test92@nwlumber-testorg.io',17,'Supply Chain Analyst','xxx',0,NULL,'2019-04-13 12:47:39','2019-12-04 02:55:22',NULL,NULL),(70,2,'Elizabeth','Stockman',NULL,0,'test33@nwlumber-testorg.io',NULL,NULL,'xxx',0,NULL,'2019-04-13 12:47:39','2019-05-27 17:38:29',NULL,NULL),(75,1,'Test','Test',NULL,0,'tt11@@value-infinity.com',10,'Test','$2b$12$obi6JPvPLYPMEEgfjtkRuOsgmHOgq1HbSQQDV.sYSFupEEwiKmoS2',1,NULL,'2019-05-20 14:19:40','2020-03-02 05:34:36',NULL,NULL),(76,1,'Adi','Joshi',NULL,0,'adeejo1@gmail.com',NULL,NULL,'$2b$12$BezSWigimojOXQBoKyftsuXUUZhpvd6HhVG1EGM7JTI7rdeA3WT2q',1,NULL,'2019-05-29 20:05:07','2020-03-17 09:50:04',NULL,NULL),(93,1,'Christina','Wang',NULL,0,'christinaw9090@gmail.com',1,NULL,'$2b$12$FN2zj.9zZCzR1vEorHSXgeURY/sXtqwxhbOJJhxLjqaYA4Mn47ASO',0,'2019-10-03 02:25:50','2019-09-03 13:14:12','2019-10-03 02:25:50',NULL,NULL),(103,10,'Alauddin','Ahmed','aahmed1',1,'ahmed.alau@value-infinity.com',1,'Consultant','$2b$12$hDHWLTuD.YkDPqlskc5.leuyOdheYZUEXMonYSuTHyV8qGG7VScUi',1,NULL,'2019-12-02 02:54:57','2020-03-18 01:56:10',NULL,NULL),(105,10,'Rick','Harrop','rharrop',1,'rick.harrop@algonquinpower.com',19,'Manager','$2b$12$6r7BiC5987fAxP9RDKMjzu9z60I/UZraNnvj/XlYXlK8OtZeiFq/u',0,'2020-03-28 04:16:18','2019-12-02 04:02:48','2020-04-23 18:33:40',NULL,NULL),(114,10,'Brad','Kaufman',NULL,0,'brad1@gmail.com',19,'consultant','$2b$12$qzYJEClvCwCE/pbHbmNEwuJ9iKj7dAlnBsrChbfeGEis8Swl2VsD.',1,NULL,'2019-12-04 04:23:50','2020-02-24 05:06:51',NULL,NULL),(115,10,'Victoria','Lane',NULL,0,'victoria.lane@algonquinpower.com',19,'Analyst','$2b$12$HUP60wXkMfcynvBtCY40Iuwwdx8f03eXybJkaSlPa5iHrEOWCoGRi',1,NULL,'2019-12-07 01:48:00','2020-02-19 05:33:47',NULL,NULL),(140,10,'Luca','Balan',NULL,0,'luca@gmail.com',23,'','$2b$12$wMsjqP8/Y/g3ktNJyYnBhe3IEZJkN5f1pu0hrXe1SaK5Jh6anftDi',1,NULL,'2020-01-17 10:08:01','2020-02-04 03:38:16',NULL,NULL),(141,10,'Florin','Balan',NULL,0,'florin@gmail.com',22,'first','$2b$12$.XtsuR.8utfXmIygBuIbEeU9v18lUm3qdUGQ4ts/8fDxJt1/iP38i',1,NULL,'2020-01-17 11:06:03','2020-02-04 03:38:16',NULL,NULL),(164,10,'Alex','Ebrahimi',NULL,0,'Alex.Ebrahimi@algonquinpower.com',19,'Asset Performance Analyst','$2b$12$STihezPXmXxKv916W3CcZeMLrXJsz3YQThRbD2oKYQNeXxrRaIAeS',0,NULL,'2020-01-27 15:30:08','2020-04-10 16:53:03',NULL,NULL),(168,1,'Prabhjot','Singh',NULL,0,'prabhjot.s@kbihm.com',NULL,NULL,'$2b$12$sVKvQMjmms/aK9Q2QjBM1.CwJYXdGLrtzrsfTbBX6Yd65GnJDwagG',1,'2020-04-24 05:24:29','2020-01-29 07:26:06','2020-04-24 05:24:29',NULL,NULL),(233,10,'Prabhjot','KBIHM',NULL,0,'prabhjot.s.kbihm.apuc@gmail.com',NULL,NULL,'$2b$12$BnsJqaNXm04JIQKToztUN.cpfgcpohRvk/REsJ3MIBSb.wt49AzX.',1,'2020-03-04 09:02:00','2020-02-13 05:46:58','2020-03-04 09:02:00',NULL,NULL),(236,9,'Dummy new2','Company',NULL,0,'dummycompany@kbihm.com',NULL,NULL,'$2b$12$HyTnpvzNqPUMsFmJQ2oN2.kkPqz5BdoBEsOTFA8drAPYT7Eap6xj2',1,'2020-02-20 09:38:08','2020-02-19 06:06:38','2020-02-20 09:38:08',NULL,NULL),(237,10,'Test','User',NULL,0,'test1@apuc-test.io',22,'Analyst','$2b$12$3Va5YCGtrnH84A.O.s8SHeKQ1Lnneg5.9pMr1DUNONUllFyKAcO3.',1,'2020-04-11 10:08:49','2020-02-21 12:15:21','2020-04-11 10:08:49',NULL,NULL),(238,9,'Riyasat','Ayman',NULL,0,'riyasatahmed111@gmail.com',73,'Sales','$2b$12$xU0WNWiPijG1oloM3Ai/qOZ3.6J5Daz.WM64hDdj4yxJtGYtqLUVK',0,NULL,'2020-03-01 23:43:47','2020-03-01 23:43:47',NULL,NULL),(239,10,'Jerry','Liu',NULL,0,'jerry.liu@algonquinpower.com',22,'Manager','$2b$12$j/.gBF.XWUFFXvrFti.bNeKODU6f8GoBK3DZusmcZp86RSpIrmpe.',1,NULL,'2020-03-04 02:16:28','2020-03-17 09:47:05',NULL,NULL),(240,55,'Prabh Kbihm','Jot',NULL,0,'prabhjot.kbihm@kbihm.com',NULL,NULL,'$2b$12$lGLW4y5teQyFUrAYarhh9ObI5LeTSumCoUnDkFnGMkgq1eZWj2NCy',1,'2020-03-26 07:33:43','2020-03-04 09:31:17','2020-04-25 14:31:00',NULL,NULL),(241,55,'Prabhjot','KBIHM',NULL,0,'prabhjot.kbihm@gmail.com',NULL,NULL,'$2b$12$0P2hpSsqLTzxxp6QB7q9leo.1sEhux7CYHXgLJPATKVsdkZEYmTiK',1,'2020-03-04 09:34:23','2020-03-04 09:31:52','2020-04-25 14:30:57',NULL,NULL),(242,10,'Alauddin','Ahmed',NULL,0,'ahmed.alauddin@gmail.com',19,'Project Manager','$2b$12$nQ0ztfyk388KL.5idTPcoeS4haiME.4w.h8mfpdIKo9TAMbfnRgcK',1,NULL,'2020-03-06 01:51:13','2020-03-17 09:47:36',NULL,NULL),(243,10,'McRobie','James',NULL,0,'james.mcrobie@algonquinpower.com',84,'Manager','$2b$12$lGLW4y5teQyFUrAYarhh9ObI5LeTSumCoUnDkFnGMkgq1eZWj2NCy',0,'2020-03-19 14:17:06','2020-03-06 01:57:40','2020-04-10 04:02:44',NULL,NULL),(244,10,'Aishwarya','Angada',NULL,0,'aishwarya.angada@value-infinity.com',84,'Analyst','$2b$12$ik/cUE8o3C0kcLmCuUYa2.b56v0l0cyvtIjchWIcv2JUd3zkFOrNu',0,NULL,'2020-03-06 19:23:26','2020-04-10 04:03:05',NULL,NULL),(245,10,'rick','harrop',NULL,0,'rick.harrop@apuc-test.io',NULL,NULL,'$2b$12$YVphEcZVQYmnIa7p48nsH.ikTC/PPzyrXQPYviNjmxYujiRutiK5S',1,'2020-04-25 17:56:01','2020-03-17 12:55:35','2020-04-25 17:56:30',NULL,NULL),(246,10,'Vijay','Sandhu',NULL,0,'vijay.k@kbihm.com',NULL,'Test Account','$2b$12$P2Fo0wZ28yBQH2Pwtl7sJ.tTX9CePv23aN3iqP.l7.4b4wm5alVS2',1,NULL,'2020-03-18 10:33:54','2020-03-18 10:34:04',NULL,NULL),(247,10,'vijay','sandhu',NULL,0,'vijay.sandhu25@gmail.com',NULL,'operator','$2b$12$vl4GgiMOylr6ysrJhsutBOgP6Vk.uI76GSlbUJ4tJ2xWD0T0Q1nkq',1,NULL,'2020-03-19 02:14:04','2020-03-19 02:14:21',NULL,NULL),(248,1,'Aishwarya','Angada',NULL,0,'aishwarya.angadi@value-infinity.com',NULL,NULL,'$2b$12$tf9B0oKZgbllfZLcGRlUUez4mnHlEisHE4Pw2ocSIHJpi2uH35pnq',0,'2020-04-22 15:26:45','2020-03-28 18:03:46','2020-04-22 15:26:45',NULL,NULL),(249,10,'Waleed','Zafar',NULL,0,'waleed.zafar@algonquinpower.com',19,'Performance Analyst','$2b$12$5/XvvdTXUvyJOXo0Zkr7IOKLvhx3FSQnyy5qX2hAPRL4T.HBp1rkm',0,NULL,'2020-04-08 17:34:06','2020-04-08 17:34:06',NULL,NULL),(251,55,'Vijay','Sandhu',NULL,0,'vsandhu@softelevation.com',85,'Manager','$2b$12$sEv6I/7KdY5HZtbllk8OPeUEnydOvHlzeBTPoWa9OT6afV7GoPEda',0,'2020-05-18 17:25:35','2020-04-24 05:25:03','2020-05-18 17:25:35',NULL,1),(252,55,'vijay','sandhu',NULL,0,'sandhuvijay1985@gmail.com',85,'Engineer','$2b$12$Xafcpq4jHCXP5cjfadJTPehwEXCAD0cKSnXs1Uu56XM8XFEOoEIlS',0,'2020-04-25 18:23:55','2020-04-24 05:28:46','2020-04-25 18:23:55',NULL,NULL),(253,1,'Shreyas','Dhuru',NULL,0,'shreyas.dhuru@value-infinity.com',2,'Analyst','$2b$12$uDBA3fbF/qVwZ8q07C2NBevcyIlNEuW59CtB2skludy4WrOtA5KMe',0,'2020-04-30 13:38:16','2020-04-29 22:08:21','2020-04-30 13:42:31',NULL,1),(254,10,'Pawan','Kumar',NULL,0,'pawan@gmail.com',19,'Chief Operating Officer','$2b$12$KF4ftaBd0pC8oaPFcvPRhuZVeuv2FDQCcj9QW9uwWTm8ZYHLLdgtG',0,'2020-05-23 10:08:00','2020-05-18 16:34:05','2020-05-23 10:08:00',NULL,1);
/*!40000 ALTER TABLE `persons` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_ins_persons` AFTER INSERT ON `persons` FOR EACH ROW begin

            insert into SearchData (orgId, ganttTaskId,foreignId, title, description, project, source, active)
            values (NEW.orgId,0, NEW.id, NEW.fullName, NEW.email, '', 'Persons',NEW.disabled)
            on duplicate key update
                title = NEW.fullName,
                description = NEW.email,
active=NEW.disabled;
        end */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_upd_persons` AFTER UPDATE ON `persons` FOR EACH ROW begin
            insert into SearchData (orgId,ganttTaskId, foreignId, title, description, project, source, active)
            values (NEW.orgId,0, NEW.id, NEW.fullName, NEW.email, '', 'Persons',!NEW.disabled)
            on duplicate key update
                title = NEW.fullName,
active=(!NEW.disabled),
                description = NEW.email;
        end */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `projectactions`
--

DROP TABLE IF EXISTS `projectactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projectactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `projId` int NOT NULL,
  `assigneeId` int DEFAULT NULL,
  `status` enum('Open','Closed','New') DEFAULT 'New',
  `disabled` tinyint(1) DEFAULT '0',
  `disabledAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `projId` (`projId`),
  KEY `assigneeId` (`assigneeId`),
  CONSTRAINT `ProjectActions_ibfk_1` FOREIGN KEY (`projId`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ProjectActions_ibfk_2` FOREIGN KEY (`assigneeId`) REFERENCES `persons` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projectactions`
--

LOCK TABLES `projectactions` WRITE;
/*!40000 ALTER TABLE `projectactions` DISABLE KEYS */;
INSERT INTO `projectactions` VALUES (1,'action test Proj','sad',20,5,'Closed',0,'2020-03-25 11:26:49','2020-03-25 11:26:49','2020-03-25 11:26:49'),(2,'Check list for RTS Plan Review ','List of decisions to be taken in the CFT Meeting for reviewing RTS Plan, RACI, Roles',6856,57,'Open',0,'2020-03-25 20:12:17','2020-03-25 20:12:17','2020-03-28 01:36:58'),(3,'Review initial gap analysis','Align with team members and stakeholders',6849,244,'Open',1,'2020-03-26 15:53:18','2020-03-26 15:53:18','2020-05-23 03:19:55'),(4,'Collect examples of project deliverable','From different fuel types, project closing',6849,57,'Closed',0,'2020-03-26 15:54:14','2020-03-26 15:54:14','2020-05-23 09:33:28'),(5,'Solar production theoretical calculation - Cornwall','',6858,249,'Open',0,'2020-04-21 21:59:56','2020-04-21 21:59:56','2020-04-21 21:59:56'),(6,'P3 and UPE alignment','',6858,57,'Open',0,'2020-04-25 03:57:11','2020-04-25 03:57:11','2020-04-25 03:57:11'),(7,'Stakeholder Management','Stakeholder Management',6848,251,'Open',0,'2020-04-25 18:10:44','2020-04-25 18:10:44','2020-04-25 18:10:44'),(8,'Defining deployment strategy','Criteria, expected outcome, team, communication',6859,57,'Open',0,'2020-05-01 23:21:04','2020-05-01 23:21:04','2020-05-01 23:21:04'),(9,'AS Team Structure and Technical Capability','Management and Strategy, Initiatives',6859,57,'Open',0,'2020-05-01 23:31:21','2020-05-01 23:31:21','2020-05-01 23:31:21'),(10,'COE Roadmap review','Review with the team',6859,57,'Open',0,'2020-05-04 16:30:17','2020-05-04 16:30:17','2020-05-04 16:30:17'),(11,'TEST','T',6841,NULL,'New',0,'2020-05-13 15:34:16','2020-05-13 15:34:16','2020-05-13 15:34:16');
/*!40000 ALTER TABLE `projectactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projectcomments`
--

DROP TABLE IF EXISTS `projectcomments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projectcomments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `projId` int NOT NULL,
  `personId` int DEFAULT NULL,
  `personName` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `disabled` tinyint(1) DEFAULT '0',
  `disabledAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `projId` (`projId`),
  KEY `personId` (`personId`),
  CONSTRAINT `ProjectComments_ibfk_1` FOREIGN KEY (`projId`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ProjectComments_ibfk_2` FOREIGN KEY (`personId`) REFERENCES `persons` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projectcomments`
--

LOCK TABLES `projectcomments` WRITE;
/*!40000 ALTER TABLE `projectcomments` DISABLE KEYS */;
INSERT INTO `projectcomments` VALUES (5,'test',6849,245,'Rick Harrop','2020-04-05 03:40:00','2020-04-08 16:22:23',1,'2020-04-08 16:22:23'),(6,'- Pandemic planning- APM process,\n- Bazefield troubleshooting/PMing,\n- WSP target planning\n- New site setup (GBS2 & Cornwall)',6849,245,'Rick Harrop','2020-04-05 03:46:47','2020-04-08 16:22:27',1,'2020-04-08 16:22:27'),(7,'- Pandemic planning- APM process, \n- Bazefield troubleshooting/PMing, \n- WSP target planning \n- New site setup (GBS2 & Cornwall)',6849,245,'Rick Harrop','2020-04-05 03:53:21','2020-04-08 16:22:28',1,'2020-04-08 16:22:28'),(8,'Need to define a project KPI for PM Methodology Initiative',6849,57,'Alauddin Ahmed','2020-04-08 17:26:12','2020-04-10 17:22:34',1,'2020-04-10 17:22:34'),(9,'Second comment',6849,57,'Alauddin Ahmed','2020-04-10 17:22:12','2020-04-10 17:22:35',1,'2020-04-10 17:22:35'),(10,'Need to define the project KPI',6849,57,'Alauddin Ahmed','2020-04-15 21:28:31','2020-04-15 21:28:31',0,NULL),(11,'Goal is to be able to set a target value for RTS, meet those targets in a cross functional way and create a knowledge repository for the organization',6856,245,'Rick Harrop','2020-04-16 16:12:28','2020-04-16 16:12:40',1,'2020-04-16 16:12:40'),(12,'Goal is to be able to set a target value for RTS, meet those targets in a cross functional way and create a knowledge repository for the organization',6856,245,'Rick Harrop','2020-04-16 16:37:34','2020-04-16 16:37:35',0,NULL),(13,'Goal is to be able to set a target value for RTS, meet those targets in a cross functional way and create a knowledge repository for the organization',6856,245,'Rick Harrop','2020-04-16 16:37:42','2020-04-16 16:37:44',0,NULL),(14,'Goal is to be able to set a target value for RTS, meet those targets in a cross functional way and create a knowledge repository for the organization',6856,245,'Rick Harrop','2020-04-16 16:37:49','2020-04-16 16:37:50',0,NULL),(15,'Goal is to be able to set a target value for RTS, meet those targets in a cross functional way and create a knowledge repository for the organization',6856,168,'Prabhjot Singh','2020-04-17 08:07:40','2020-04-17 08:07:40',0,NULL),(16,'Goal is to be able to set a target value for RTS, meet those targets in a cross functional way and create a knowledge repository for the organization',6856,168,'Prabhjot Singh','2020-04-17 08:07:44','2020-04-17 08:07:45',0,NULL),(17,'Design and Deploy the Right Size Project Management Methodology across all fuel types and technologies',6849,245,'Rick Harrop','2020-04-17 15:44:43','2020-04-18 01:58:26',1,'2020-04-18 01:58:26'),(18,'Design and Deploy the Right Size Project Management Methodology across all fuel types and technologies',6849,245,'Rick Harrop','2020-04-17 15:45:08','2020-04-18 01:58:23',1,'2020-04-18 01:58:23'),(19,'Design and Deploy the Right Size Project Management Methodology across all fuel types and technologies',6849,245,'Rick Harrop','2020-04-17 15:45:14','2020-04-18 01:58:23',1,'2020-04-18 01:58:23'),(20,'Design and Deploy the Right Size Project Management Methodology across all fuel types and technologies',6849,245,'Rick Harrop','2020-04-17 15:45:23','2020-04-18 01:58:22',1,'2020-04-18 01:58:22');
/*!40000 ALTER TABLE `projectcomments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projectdocuments`
--

DROP TABLE IF EXISTS `projectdocuments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projectdocuments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `fileName` varchar(255) NOT NULL,
  `projId` int NOT NULL,
  `uploadBy` int NOT NULL,
  `fileSize` int NOT NULL DEFAULT '0',
  `disabled` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `disabledAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `projId` (`projId`),
  KEY `uploadBy` (`uploadBy`),
  CONSTRAINT `ProjectDocuments_ibfk_1` FOREIGN KEY (`projId`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ProjectDocuments_ibfk_2` FOREIGN KEY (`uploadBy`) REFERENCES `persons` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projectdocuments`
--

LOCK TABLES `projectdocuments` WRITE;
/*!40000 ALTER TABLE `projectdocuments` DISABLE KEYS */;
INSERT INTO `projectdocuments` VALUES (16,'Abc','kasgdkashd','d5139bdd-0032-496a-b3fc-1b810ea2decf-whatsapp-image-2020-02-20-at-1.17.31-pm.jpeg',6849,105,0,1,'2020-03-20 13:20:53','2020-03-20 13:21:21',NULL),(17,'Gap Analysis','High Level Summary of Gap Analysis','c6ab6722-504c-4f68-a422-fcafffc6d8a1-project-management--gap-analysis-mar18.pptx',6849,57,0,1,'2020-03-20 14:51:25','2020-03-26 14:23:36',NULL),(18,'RTS Process','Process Maps and Escalation Process ','0c5dee63-e120-438e-b530-c0d3e29edbc3-major-component-failure-and-rts---2.0.pptx',6856,57,0,1,'2020-03-20 23:48:53','2020-03-26 18:47:22',NULL),(19,'Major Component 2019','Downtime History by component and site','713ed396-32fe-4c19-a901-6bdbb95d00b6-large-correctives---al-comment-(002).xlsx',6856,57,0,1,'2020-03-20 23:55:04','2020-03-26 18:47:21',NULL),(20,'test','test','8913e146-5c4b-461a-bd00-87e0f21f3422-issue.png',6849,105,0,1,'2020-03-21 02:17:32','2020-03-21 02:17:45',NULL),(21,'Test Doc','Document for project description','7d14f039-f72e-4e49-becf-e885f0480da7-250x250.png',6848,240,0,1,'2020-03-23 08:07:14','2020-03-26 08:26:46',NULL),(22,'2 New Test Doc','Test','c058b1d9-4639-4d1e-8bcb-adffc485bcbf-value-infinity-mvp--org-documents.png',6848,168,349428,1,'2020-03-25 10:35:51','2020-03-25 10:36:26',NULL),(23,'Test','dedc','02d1f05c-cbf2-45ed-861a-355145a6dc03-c6ab6722-504c-4f68-a422-fcafffc6d8a1-project-management--gap-analysis-mar18.pptx',6849,105,87342,1,'2020-03-26 04:52:54','2020-03-26 14:23:35',NULL),(24,'testfile','test','e3568355-1341-4819-a5bb-98a2bdbc7bde/vvtest.png',6848,240,349428,0,'2020-03-26 08:26:59','2020-03-26 09:56:41',NULL),(25,'t2','','d1edaf31-58c5-45bb-aac6-a5e50d278abc-value-infinity-mvp--org-documents.png',6848,240,349428,1,'2020-03-26 08:28:00','2020-03-26 08:31:52',NULL),(26,'t3','','f54c386f-177d-48f5-b329-0a3ea3d4cecd/value-infinity-mvp--org-documents.png',6848,240,349428,1,'2020-03-26 08:29:28','2020-03-26 08:31:53',NULL),(27,'t4 vdo','t4','f54c386f-177d-48f5-b329-0a3ea3d4cecd/awesomescreenshot-2020-03-04t19-06-08-070z.webm',6848,240,3274014,1,'2020-03-26 08:31:15','2020-03-26 08:31:50',NULL),(28,'gap','desc','e3568355-1341-4819-a5bb-98a2bdbc7bde/project-management-gap-analysis-mar18-(1).pptx',6802,105,87342,0,'2020-03-26 11:12:56','2020-03-26 11:12:56',NULL),(29,'This ','desc','c1f4a5ea-7477-45b7-909c-4c37a7a65ea3/project-management-gap-analysis-mar18-(1).pptx',6849,105,87342,1,'2020-03-26 14:20:56','2020-03-26 14:23:33',NULL),(30,'Gap Analysis','High Level Gap Analysis across fuel in PM Method','c1f4a5ea-7477-45b7-909c-4c37a7a65ea3/project-management--gap-analysis-1.0-.pptx',6849,57,93158,0,'2020-03-26 15:55:33','2020-03-26 17:01:58',NULL),(31,'Notes from Meeting','Captures the current situation and opportunities for improvement ','c1f4a5ea-7477-45b7-909c-4c37a7a65ea3/consolidation-of-session-notes.docx',6849,57,38634,0,'2020-03-26 16:03:46','2020-03-26 16:03:46',NULL),(32,'TEst d','','0bec7728-571a-4c36-aabe-82034484856e/vvtest.png',6841,168,349428,0,'2020-03-26 16:42:23','2020-03-26 16:42:23',NULL),(33,'RTS Process, issues and Opportunities','','0bec7728-571a-4c36-aabe-82034484856e/major-component-failure-and-rts---mar-25.pptx',6856,57,424489,0,'2020-03-26 18:48:40','2020-03-26 18:48:40',NULL),(34,'List of Large Corrective - 2019 ','','0bec7728-571a-4c36-aabe-82034484856e/large-correctives---al-comment-(002).xlsx',6856,57,110282,0,'2020-03-26 18:50:35','2020-03-26 18:50:35',NULL),(35,'APM Process Documents - Work in Progress','','0bec7728-571a-4c36-aabe-82034484856e/apm-process-and-procedure_p1-p4_mar-12.docx',6856,57,896486,0,'2020-03-26 18:52:13','2020-03-26 20:15:13',NULL);
/*!40000 ALTER TABLE `projectdocuments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projectkpis`
--

DROP TABLE IF EXISTS `projectkpis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projectkpis` (
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
  KEY `ProjectKpis_ibfk_2` (`kpiId`),
  CONSTRAINT `ProjectKpis_ibfk_1` FOREIGN KEY (`projId`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ProjectKpis_ibfk_2` FOREIGN KEY (`kpiId`) REFERENCES `kpis` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projectkpis`
--

LOCK TABLES `projectkpis` WRITE;
/*!40000 ALTER TABLE `projectkpis` DISABLE KEYS */;
INSERT INTO `projectkpis` VALUES (31,19,6,'2020-04-07 11:20:48','2020-04-07 11:20:48',0),(36,22,97,'2020-04-07 11:20:48','2020-04-07 11:20:48',0),(30,23,2,'2020-04-07 11:20:48','2020-04-07 11:20:48',0),(32,118,14,'2020-04-07 11:20:48','2020-04-07 11:20:48',0),(34,118,55,'2020-04-07 11:20:48','2020-04-07 11:20:48',0),(35,118,92,'2020-04-07 11:20:48','2020-04-07 11:20:48',0),(42,118,416,'2020-04-07 11:20:48','2020-04-07 11:20:48',0),(40,6797,114,'2020-04-07 11:20:48','2020-04-07 11:20:48',0),(41,6797,409,'2020-04-07 11:20:48','2020-04-07 11:20:48',0),(64,6799,558,'2020-04-08 23:51:27','2020-04-08 23:51:27',0),(65,6799,560,'2020-04-08 23:51:27','2020-04-08 23:51:27',0),(33,6802,16,'2020-04-07 11:20:48','2020-04-07 11:20:48',0),(37,6802,107,'2020-04-07 11:20:48','2020-04-07 11:20:48',0),(66,6802,560,'2020-04-08 23:53:44','2020-04-08 23:53:44',0),(45,6843,522,'2020-04-07 11:20:48','2020-04-07 11:20:48',0),(77,6848,570,'2020-04-25 14:26:06','2020-04-25 14:26:06',0),(78,6848,574,'2020-05-04 15:20:49','2020-05-04 15:20:49',0),(73,6849,562,'2020-04-10 03:59:26','2020-04-10 03:59:26',0),(68,6856,562,'2020-04-08 23:59:35','2020-04-08 23:59:35',0);
/*!40000 ALTER TABLE `projectkpis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projectpersons`
--

DROP TABLE IF EXISTS `projectpersons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projectpersons` (
  `projectId` int NOT NULL,
  `personId` int NOT NULL,
  `inProject` tinyint(1) DEFAULT '0',
  `owner` tinyint(1) DEFAULT '0',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`projectId`,`personId`),
  KEY `personId` (`personId`),
  CONSTRAINT `ProjectPersons_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ProjectPersons_ibfk_2` FOREIGN KEY (`personId`) REFERENCES `persons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projectpersons`
--

LOCK TABLES `projectpersons` WRITE;
/*!40000 ALTER TABLE `projectpersons` DISABLE KEYS */;
INSERT INTO `projectpersons` VALUES (20,3,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(20,4,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(20,5,1,0,'2019-03-17 21:30:44','2020-03-05 04:21:51'),(20,55,0,0,'2020-02-11 10:06:40','2020-02-11 12:12:38'),(20,57,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(20,76,0,0,'2020-03-05 04:21:51','2020-03-05 04:21:51'),(20,93,0,0,'2020-03-05 04:21:51','2020-03-05 04:21:51'),(20,168,0,0,'2020-02-11 12:12:38','2020-02-12 07:37:39'),(21,7,0,0,'2019-03-17 21:30:44','2020-02-13 05:51:49'),(21,8,0,0,'2019-03-17 21:30:44','2020-02-13 05:51:49'),(21,55,0,0,'2019-03-17 21:39:20','2020-02-13 05:50:35'),(21,66,0,0,'2019-04-29 14:25:34','2019-04-29 14:25:34'),(21,67,0,0,'2019-04-29 14:25:34','2019-04-29 14:25:34'),(21,68,0,0,'2019-04-29 14:25:34','2019-04-29 14:25:34'),(21,69,0,0,'2019-04-29 14:25:34','2019-04-29 14:25:34'),(21,70,0,0,'2019-04-29 14:25:34','2019-04-29 14:25:34'),(21,168,0,0,'2020-02-13 05:50:35','2020-02-13 05:50:35'),(23,3,1,0,'2019-03-17 21:30:44','2020-01-30 10:58:16'),(23,4,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(23,5,1,0,'2019-03-17 21:30:44','2020-03-03 09:41:36'),(23,55,1,0,'2020-01-30 10:58:16','2020-01-30 10:58:16'),(23,57,1,1,'2019-03-17 21:30:44','2020-01-30 10:59:05'),(23,75,0,0,'2020-01-30 10:58:16','2020-01-30 10:58:16'),(23,76,1,0,'2020-01-30 10:58:16','2020-03-03 09:41:36'),(23,93,0,0,'2020-01-30 10:58:16','2020-01-30 10:58:16'),(23,168,1,0,'2020-01-30 10:58:16','2020-01-30 10:58:16'),(24,7,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(24,8,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(24,55,0,0,'2019-03-17 21:39:20','2019-03-17 21:39:20'),(24,66,0,0,'2019-04-29 14:25:34','2019-04-29 14:25:34'),(24,67,0,0,'2019-04-29 14:25:34','2019-04-29 14:25:34'),(24,68,0,0,'2019-04-29 14:25:34','2019-04-29 14:25:34'),(24,69,0,0,'2019-04-29 14:25:34','2019-04-29 14:25:34'),(24,70,0,0,'2019-04-29 14:25:34','2019-04-29 14:25:34'),(26,3,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(26,4,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(26,5,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(26,57,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(29,3,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(29,4,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(29,5,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(29,57,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(29,93,1,1,'2019-09-07 20:05:01','2019-09-07 20:05:01'),(30,7,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(30,8,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(30,55,0,0,'2019-03-17 21:39:21','2019-03-17 21:39:21'),(30,66,0,0,'2019-04-29 14:25:34','2019-04-29 14:25:34'),(30,67,0,0,'2019-04-29 14:25:34','2019-04-29 14:25:34'),(30,68,0,0,'2019-04-29 14:25:34','2019-04-29 14:25:34'),(30,69,0,0,'2019-04-29 14:25:34','2019-04-29 14:25:34'),(30,70,0,0,'2019-04-29 14:25:34','2019-04-29 14:25:34'),(35,3,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(35,4,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(35,5,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(35,55,0,0,'2020-03-19 01:22:23','2020-03-19 01:22:23'),(35,57,1,0,'2019-03-17 21:30:44','2020-03-19 01:22:23'),(35,93,1,1,'2019-09-07 20:05:01','2019-09-07 20:05:01'),(36,7,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(36,8,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(36,66,0,0,'2019-04-29 14:25:34','2019-04-29 14:25:34'),(36,67,1,0,'2019-04-29 14:25:34','2019-05-03 18:56:04'),(36,68,0,0,'2019-04-29 14:25:34','2019-04-29 14:25:34'),(36,69,1,0,'2019-04-29 14:25:34','2019-05-06 21:35:28'),(36,70,0,0,'2019-04-29 14:25:34','2019-04-29 14:25:34'),(112,7,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(112,8,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(112,55,0,0,'2019-03-17 21:39:21','2019-03-17 21:39:21'),(113,7,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(113,8,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(113,66,0,0,'2019-04-29 14:25:34','2019-04-29 14:25:34'),(113,67,0,0,'2019-04-29 14:25:34','2019-04-29 14:25:34'),(113,68,0,0,'2019-04-29 14:25:34','2019-04-29 14:25:34'),(113,69,0,0,'2019-04-29 14:25:34','2019-04-29 14:25:34'),(113,70,0,0,'2019-04-29 14:25:34','2019-04-29 14:25:34'),(114,7,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(114,8,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(114,55,0,0,'2019-03-17 21:39:21','2019-03-17 21:39:21'),(114,93,1,1,'2019-09-07 20:06:42','2019-09-07 20:06:42'),(115,7,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(115,8,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(115,55,0,0,'2019-03-17 21:39:21','2019-03-17 21:39:21'),(115,66,0,0,'2019-04-29 14:25:34','2019-04-29 14:25:34'),(115,67,0,0,'2019-04-29 14:25:34','2019-04-29 14:25:34'),(115,68,0,0,'2019-04-29 14:25:34','2019-04-29 14:25:34'),(115,69,0,0,'2019-04-29 14:25:34','2019-04-29 14:25:34'),(115,70,0,0,'2019-04-29 14:25:34','2019-04-29 14:25:34'),(115,93,1,1,'2019-09-07 20:06:42','2019-09-07 20:06:42'),(116,7,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(116,8,0,0,'2019-03-17 21:30:44','2019-03-17 21:30:44'),(116,55,0,0,'2019-03-17 21:39:21','2019-04-26 15:07:20'),(116,66,1,0,'2019-04-26 15:07:20','2019-04-26 15:07:20'),(116,67,0,0,'2019-04-26 15:07:20','2019-04-26 15:07:20'),(116,68,1,0,'2019-04-26 15:07:20','2019-04-26 15:07:20'),(116,69,0,0,'2019-04-26 15:07:20','2019-04-26 15:07:20'),(116,70,0,0,'2019-04-26 15:07:20','2019-04-26 15:07:20'),(116,93,1,0,'2019-09-07 20:06:42','2019-09-07 20:06:42'),(118,7,0,0,'2019-04-24 17:16:01','2019-04-30 20:38:53'),(118,8,1,0,'2019-04-24 17:16:01','2019-05-03 13:55:11'),(118,55,1,0,'2019-03-29 04:49:14','2019-04-25 13:11:45'),(118,57,1,0,'2019-03-29 04:49:14','2019-04-30 20:40:18'),(118,66,1,0,'2019-04-24 17:16:01','2019-05-03 13:55:11'),(118,67,0,1,'2019-04-24 17:16:01','2020-01-03 18:28:25'),(118,68,1,0,'2019-04-25 00:49:13','2019-05-03 13:55:11'),(118,69,0,0,'2019-04-24 17:16:01','2020-01-03 18:27:41'),(118,70,1,0,'2019-04-25 00:49:13','2019-05-03 13:55:11'),(118,93,1,0,'2019-09-07 20:05:01','2019-09-07 20:05:01'),(121,7,0,0,'2019-04-30 20:43:24','2019-04-30 20:43:24'),(121,8,0,0,'2019-04-30 20:43:24','2019-04-30 20:43:24'),(121,66,0,0,'2019-04-30 20:43:24','2019-04-30 20:43:24'),(121,67,1,0,'2019-04-30 20:43:24','2020-02-27 12:09:10'),(121,68,0,0,'2019-04-30 20:43:24','2019-04-30 20:43:24'),(121,69,0,0,'2019-04-30 20:43:24','2019-04-30 20:43:24'),(121,70,0,0,'2019-04-30 20:43:24','2019-04-30 20:43:24'),(6797,7,0,0,'2020-01-03 18:35:31','2020-03-02 12:30:06'),(6797,8,1,0,'2020-01-03 18:35:31','2020-02-29 21:21:16'),(6797,66,1,0,'2020-01-03 18:35:31','2020-02-29 19:39:29'),(6797,67,1,0,'2020-01-03 18:35:31','2020-03-03 09:25:46'),(6797,68,0,0,'2020-01-03 18:35:31','2020-03-02 12:30:06'),(6797,69,1,0,'2020-01-03 18:35:31','2020-03-03 09:25:46'),(6797,70,0,0,'2020-01-03 18:35:31','2020-03-03 09:26:41'),(6798,7,0,0,'2019-12-03 02:23:03','2019-12-03 02:23:03'),(6798,8,0,0,'2019-12-03 02:23:03','2019-12-03 02:23:03'),(6798,66,0,0,'2019-12-03 02:23:03','2019-12-03 02:23:03'),(6798,67,0,0,'2019-12-03 02:23:03','2019-12-03 02:23:03'),(6798,68,0,0,'2019-12-03 02:23:03','2019-12-03 02:23:03'),(6798,69,0,0,'2019-12-03 02:23:03','2019-12-03 02:23:03'),(6798,70,0,0,'2019-12-03 02:23:03','2019-12-03 02:23:03'),(6799,3,0,0,'2020-02-12 10:37:51','2020-02-19 04:26:57'),(6799,4,0,0,'2020-02-12 11:01:09','2020-02-14 07:02:35'),(6799,57,1,0,'2020-02-23 14:17:36','2020-03-18 15:39:11'),(6799,103,1,0,'2020-02-12 09:35:13','2020-02-19 04:26:30'),(6799,105,1,1,'2020-02-12 09:35:13','2020-02-19 04:26:30'),(6799,114,1,0,'2020-02-12 09:35:13','2020-02-19 04:26:30'),(6799,115,0,0,'2020-02-12 09:35:13','2020-02-19 04:25:40'),(6799,164,1,0,'2020-02-12 09:35:13','2020-03-03 10:21:10'),(6799,168,0,0,'2020-02-12 10:37:51','2020-02-19 19:50:14'),(6799,233,0,0,'2020-02-13 12:17:55','2020-02-14 05:33:56'),(6799,237,0,0,'2020-02-23 14:17:36','2020-02-24 05:04:29'),(6799,239,1,0,'2020-03-04 02:47:30','2020-03-04 02:47:30'),(6799,243,0,0,'2020-03-18 15:39:11','2020-03-18 15:39:11'),(6799,244,0,0,'2020-03-18 15:39:11','2020-03-18 15:39:11'),(6802,3,0,0,'2020-02-12 09:55:52','2020-02-19 19:51:09'),(6802,57,0,0,'2020-02-25 00:38:41','2020-02-25 00:38:41'),(6802,103,0,0,'2020-02-12 08:07:53','2020-02-12 08:07:53'),(6802,105,0,1,'2020-02-12 08:07:53','2020-02-29 05:32:02'),(6802,114,1,0,'2020-02-12 08:07:53','2020-02-12 08:07:53'),(6802,115,1,0,'2020-02-12 08:07:53','2020-02-12 08:07:53'),(6802,164,1,0,'2020-02-12 08:07:53','2020-02-19 19:51:42'),(6802,168,0,0,'2020-02-12 08:07:53','2020-02-12 08:07:53'),(6802,237,1,0,'2020-02-25 00:38:41','2020-03-04 05:45:04'),(6802,239,1,0,'2020-03-04 02:17:09','2020-03-04 02:17:09'),(6803,3,0,0,'2020-02-24 21:25:12','2020-02-24 21:25:12'),(6803,57,0,0,'2020-02-24 21:25:12','2020-02-24 21:25:12'),(6803,103,0,0,'2020-02-24 21:25:12','2020-02-24 21:25:12'),(6803,105,0,1,'2020-02-24 21:25:12','2020-02-24 21:25:12'),(6803,164,1,0,'2020-02-24 21:25:12','2020-02-24 21:25:12'),(6803,237,0,0,'2020-02-24 21:25:12','2020-02-24 21:25:12'),(6803,239,0,0,'2020-03-04 14:23:14','2020-03-04 14:23:14'),(6805,3,0,0,'2020-02-12 09:53:54','2020-02-25 10:59:16'),(6805,57,0,0,'2020-02-24 22:50:29','2020-02-25 10:59:16'),(6805,103,0,0,'2020-02-12 07:59:01','2020-02-25 13:10:37'),(6805,105,0,0,'2020-02-12 07:59:01','2020-02-25 13:10:37'),(6805,114,1,0,'2020-02-12 07:59:01','2020-02-12 09:56:41'),(6805,115,1,0,'2020-02-12 07:59:01','2020-02-12 09:56:41'),(6805,164,0,0,'2020-02-12 07:59:01','2020-02-25 13:10:37'),(6805,168,0,0,'2020-02-12 07:59:01','2020-02-12 09:56:41'),(6805,237,1,1,'2020-02-24 22:50:29','2020-03-01 23:38:18'),(6805,239,0,0,'2020-03-04 14:45:39','2020-03-04 14:45:39'),(6807,3,0,0,'2020-01-08 07:31:35','2020-01-08 07:31:35'),(6807,4,0,0,'2020-01-08 07:31:35','2020-01-08 07:31:35'),(6807,5,0,0,'2020-01-08 07:31:35','2020-01-08 07:31:35'),(6807,55,0,0,'2020-01-08 07:31:35','2020-01-08 07:31:35'),(6807,57,0,0,'2020-01-08 07:31:35','2020-01-08 07:31:35'),(6807,75,0,0,'2020-01-08 07:31:35','2020-01-08 07:31:35'),(6807,76,0,0,'2020-01-08 07:31:35','2020-01-08 07:31:35'),(6807,93,0,0,'2020-01-08 07:31:35','2020-01-08 07:31:35'),(6837,168,0,1,'2020-02-12 12:25:26','2020-02-12 12:25:26'),(6838,7,0,0,'2020-03-02 00:37:54','2020-03-02 00:37:54'),(6838,8,0,0,'2020-03-02 00:37:54','2020-03-02 00:37:54'),(6838,66,0,0,'2020-03-02 00:37:54','2020-03-02 00:37:54'),(6838,67,0,0,'2020-03-02 00:37:54','2020-03-02 00:37:54'),(6838,68,0,0,'2020-03-02 00:37:54','2020-03-02 00:37:54'),(6838,69,0,0,'2020-03-02 00:37:54','2020-03-02 00:37:54'),(6838,70,0,0,'2020-03-02 00:37:54','2020-03-02 00:37:54'),(6839,103,0,0,'2020-03-04 06:31:54','2020-03-04 06:31:54'),(6839,105,0,0,'2020-03-04 06:31:54','2020-03-04 06:31:54'),(6839,114,0,0,'2020-03-04 06:31:54','2020-03-04 06:31:54'),(6839,115,0,0,'2020-03-04 06:31:54','2020-03-04 06:31:54'),(6839,140,0,0,'2020-03-04 06:31:54','2020-03-04 06:31:54'),(6839,141,0,0,'2020-03-04 06:31:54','2020-03-04 06:31:54'),(6839,164,0,0,'2020-03-04 06:31:54','2020-03-04 06:31:54'),(6839,233,0,0,'2020-03-04 06:31:54','2020-03-04 06:31:54'),(6839,237,0,0,'2020-03-04 06:31:54','2020-03-04 06:31:54'),(6839,239,1,0,'2020-03-04 06:31:54','2020-03-04 06:35:55'),(6841,240,0,0,'2020-03-04 09:34:13','2020-03-04 09:34:13'),(6841,241,0,0,'2020-03-04 09:34:13','2020-03-04 09:34:13'),(6842,240,0,0,'2020-03-04 09:38:29','2020-03-04 09:38:29'),(6842,241,0,0,'2020-03-04 09:38:29','2020-03-04 09:38:29'),(6843,240,1,0,'2020-03-04 11:00:44','2020-03-05 09:18:55'),(6843,241,0,0,'2020-03-04 11:00:44','2020-03-05 10:24:17'),(6844,103,0,0,'2020-03-04 11:17:14','2020-03-04 11:17:14'),(6844,105,1,0,'2020-03-04 11:17:14','2020-03-04 12:35:30'),(6844,114,0,0,'2020-03-04 11:17:14','2020-03-04 11:17:14'),(6844,115,0,0,'2020-03-04 11:17:14','2020-03-04 11:17:14'),(6844,140,0,0,'2020-03-04 11:17:14','2020-03-04 11:17:14'),(6844,141,0,0,'2020-03-04 11:17:14','2020-03-04 11:17:14'),(6844,164,0,0,'2020-03-04 11:17:14','2020-03-04 11:17:14'),(6844,233,0,0,'2020-03-04 11:17:14','2020-03-04 11:17:14'),(6844,237,1,0,'2020-03-04 11:17:14','2020-03-04 12:35:30'),(6844,239,1,0,'2020-03-04 11:17:14','2020-03-04 12:35:30'),(6845,103,0,0,'2020-03-04 13:06:56','2020-03-04 13:06:56'),(6845,105,0,0,'2020-03-04 13:06:56','2020-03-04 13:06:56'),(6845,114,0,0,'2020-03-04 13:06:56','2020-03-04 13:06:56'),(6845,115,0,0,'2020-03-04 13:06:56','2020-03-04 13:06:56'),(6845,140,0,0,'2020-03-04 13:06:56','2020-03-04 13:06:56'),(6845,141,0,0,'2020-03-04 13:06:56','2020-03-04 13:06:56'),(6845,164,0,0,'2020-03-04 13:06:56','2020-03-04 13:06:56'),(6845,233,0,0,'2020-03-04 13:06:56','2020-03-04 13:06:56'),(6845,237,1,0,'2020-03-04 13:06:56','2020-03-05 10:45:32'),(6845,239,0,0,'2020-03-04 13:06:56','2020-03-04 13:06:56'),(6846,57,0,0,'2020-03-06 12:50:58','2020-03-06 12:50:58'),(6846,103,0,0,'2020-03-05 02:13:47','2020-03-05 02:13:47'),(6846,105,0,0,'2020-03-05 02:13:47','2020-03-05 02:13:47'),(6846,114,0,0,'2020-03-05 02:13:47','2020-03-05 02:13:47'),(6846,115,0,0,'2020-03-05 02:13:47','2020-03-05 02:13:47'),(6846,140,0,0,'2020-03-05 02:13:47','2020-03-05 02:13:47'),(6846,141,0,0,'2020-03-05 02:13:47','2020-03-05 02:13:47'),(6846,164,0,0,'2020-03-05 02:13:47','2020-03-05 02:13:47'),(6846,233,0,0,'2020-03-05 02:13:47','2020-03-05 02:13:47'),(6846,237,1,0,'2020-03-05 02:13:47','2020-03-05 05:36:41'),(6846,239,0,0,'2020-03-05 02:13:47','2020-03-06 12:50:58'),(6846,242,0,0,'2020-03-06 12:50:58','2020-03-06 12:50:58'),(6846,243,0,0,'2020-03-06 12:50:58','2020-03-06 12:50:58'),(6847,103,0,0,'2020-03-05 02:13:53','2020-03-05 02:13:53'),(6847,105,0,0,'2020-03-05 02:13:53','2020-03-05 02:13:53'),(6847,114,0,0,'2020-03-05 02:13:53','2020-03-05 02:13:53'),(6847,115,0,0,'2020-03-05 02:13:53','2020-03-05 02:13:53'),(6847,140,0,0,'2020-03-05 02:13:53','2020-03-05 02:13:53'),(6847,141,0,0,'2020-03-05 02:13:53','2020-03-05 02:13:53'),(6847,164,0,0,'2020-03-05 02:13:53','2020-03-05 02:13:53'),(6847,233,0,0,'2020-03-05 02:13:53','2020-03-05 02:13:53'),(6847,237,0,0,'2020-03-05 02:13:53','2020-03-05 02:13:53'),(6847,239,0,0,'2020-03-05 02:13:53','2020-03-05 02:13:53'),(6848,240,0,0,'2020-03-05 09:14:44','2020-03-05 09:14:44'),(6848,241,0,0,'2020-03-05 09:14:44','2020-03-05 09:14:44'),(6848,251,0,1,'2020-04-25 14:26:32','2020-04-25 14:26:32'),(6848,252,1,0,'2020-04-25 14:26:32','2020-04-25 14:26:32'),(6849,57,1,0,'2020-03-06 19:24:43','2020-03-06 19:24:43'),(6849,103,0,0,'2020-03-06 01:56:16','2020-03-06 01:56:16'),(6849,105,0,0,'2020-03-06 01:56:16','2020-03-06 01:56:16'),(6849,114,0,0,'2020-03-06 01:56:16','2020-03-06 01:56:16'),(6849,115,0,0,'2020-03-06 01:56:16','2020-03-06 01:56:16'),(6849,140,0,0,'2020-03-06 01:56:16','2020-03-06 01:56:16'),(6849,141,0,0,'2020-03-06 01:56:16','2020-03-06 01:56:16'),(6849,164,0,0,'2020-03-06 01:56:16','2020-03-06 01:56:16'),(6849,233,0,0,'2020-03-06 01:56:16','2020-03-06 01:56:16'),(6849,237,0,0,'2020-03-06 01:56:16','2020-03-06 01:56:16'),(6849,239,1,0,'2020-03-06 01:56:16','2020-03-06 01:58:24'),(6849,242,0,0,'2020-03-06 01:56:16','2020-03-06 19:24:43'),(6849,243,0,1,'2020-03-06 01:58:24','2020-03-06 01:58:24'),(6849,244,1,0,'2020-03-06 19:24:43','2020-03-06 19:24:43'),(6851,57,1,1,'2020-03-07 01:53:56','2020-03-07 01:54:07'),(6851,103,0,0,'2020-03-07 01:53:56','2020-03-07 01:53:56'),(6851,105,0,0,'2020-03-06 04:25:35','2020-03-06 04:25:35'),(6851,164,0,0,'2020-03-06 04:25:35','2020-03-06 04:39:40'),(6851,237,1,0,'2020-03-06 04:25:35','2020-03-06 06:18:40'),(6851,239,0,0,'2020-03-06 04:25:35','2020-03-06 04:25:35'),(6851,242,0,0,'2020-03-06 04:25:35','2020-03-07 01:53:56'),(6851,243,0,0,'2020-03-06 04:25:35','2020-03-06 04:25:35'),(6851,244,0,0,'2020-03-07 01:53:56','2020-03-07 01:53:56'),(6852,57,1,1,'2020-03-07 15:38:14','2020-03-07 15:38:24'),(6852,103,0,0,'2020-03-07 15:38:14','2020-03-07 15:38:14'),(6852,105,0,0,'2020-03-07 15:38:14','2020-03-07 15:38:14'),(6852,164,0,0,'2020-03-07 15:38:14','2020-03-07 15:38:14'),(6852,237,0,0,'2020-03-07 15:38:14','2020-03-07 15:38:14'),(6852,239,0,0,'2020-03-07 15:38:14','2020-03-07 15:38:14'),(6852,242,0,0,'2020-03-07 15:38:14','2020-03-07 15:38:14'),(6852,243,1,0,'2020-03-07 15:38:14','2020-03-07 15:38:14'),(6852,244,0,0,'2020-03-07 15:38:14','2020-03-07 15:38:14'),(6856,57,1,0,'2020-03-20 23:37:11','2020-03-26 20:12:45'),(6856,105,0,1,'2020-03-20 23:37:11','2020-03-26 18:53:05'),(6856,243,0,0,'2020-03-20 23:37:11','2020-03-20 23:37:11'),(6856,244,1,0,'2020-03-20 23:37:11','2020-03-20 23:37:11'),(6858,57,1,0,'2020-04-21 21:57:40','2020-04-21 21:57:40'),(6858,105,0,1,'2020-04-21 21:57:40','2020-04-21 21:57:40'),(6858,164,1,0,'2020-04-21 21:57:40','2020-04-21 21:57:40'),(6858,243,0,0,'2020-04-21 21:57:40','2020-04-21 21:57:40'),(6858,244,0,0,'2020-04-21 21:57:40','2020-04-21 21:57:40'),(6858,249,1,0,'2020-04-21 21:57:40','2020-04-21 21:57:40'),(6859,5,0,0,'2020-04-29 21:31:42','2020-04-29 21:31:42'),(6859,57,0,1,'2020-04-29 21:31:42','2020-04-29 21:31:42'),(6859,93,0,0,'2020-04-29 21:31:42','2020-04-29 21:31:42'),(6859,248,1,0,'2020-04-29 21:31:42','2020-04-29 21:31:42'),(6859,253,1,0,'2020-04-29 22:12:56','2020-04-29 22:12:56');
/*!40000 ALTER TABLE `projectpersons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orgId` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `startAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `summary` text,
  `businessGoal` varchar(255) DEFAULT NULL,
  `progress` int DEFAULT '0',
  `currentTaskId` int DEFAULT NULL,
  `description` varchar(512) DEFAULT NULL,
  `endAt` date DEFAULT NULL,
  `mindmapId` int DEFAULT NULL,
  `nodeId` varchar(16) DEFAULT NULL,
  `statusId` int DEFAULT '2',
  `deptId` int DEFAULT NULL,
  `mainKpiId` int DEFAULT NULL,
  `active` tinyint DEFAULT '1',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `completedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Projects_Organizations_ind` (`orgId`),
  KEY `Projects_title_ind` (`title`),
  KEY `Projects_startAt_ind` (`startAt`),
  KEY `Projects_Mindmap_ind` (`mindmapId`,`nodeId`),
  KEY `Projects_ibfk_2` (`mainKpiId`),
  KEY `Projects_ibfk_4` (`currentTaskId`),
  KEY `Projects_ibfk_3` (`statusId`),
  KEY `Projects_Departments_id_fk` (`deptId`),
  FULLTEXT KEY `title` (`title`,`description`,`summary`,`businessGoal`),
  CONSTRAINT `Projects_Departments_id_fk` FOREIGN KEY (`deptId`) REFERENCES `departments` (`id`),
  CONSTRAINT `Projects_ibfk_1` FOREIGN KEY (`orgId`) REFERENCES `organizations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Projects_ibfk_2` FOREIGN KEY (`mainKpiId`) REFERENCES `kpis` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Projects_ibfk_3` FOREIGN KEY (`statusId`) REFERENCES `projectstatuses` (`id`),
  CONSTRAINT `Projects_ibfk_4` FOREIGN KEY (`currentTaskId`) REFERENCES `tasks` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6860 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (19,9,'RFID tagging of inventory','2019-05-03 00:00:00',NULL,'Automated reporting on part location, inventory, and usage.  Automatic alerts for low inventory.',20,NULL,'Tag parts for all plants and warehouses','2019-08-16',NULL,NULL,3,NULL,2,0,'2019-01-21 16:27:20','2020-04-29 22:15:27',NULL),(20,1,'Increase Plant Availability','2015-07-19 00:00:00',NULL,'Increase the availability of all plants to 97%.',25,NULL,'Effort to increase the availability of all plants.','2015-09-30',NULL,NULL,5,NULL,3,0,'2019-01-21 16:31:41','2020-04-29 21:26:23',NULL),(21,9,'Inventory Reduction','2013-06-13 00:00:00',NULL,'Reduce inventory by 20%',55,NULL,'Reduce inventory in all warehouses. Adding lots more text here to see how it displays on the card.  More text to display here. Focus on inventory reduction for all locations across North America.','2017-12-11',NULL,NULL,1,NULL,2,1,'2019-01-21 16:31:42','2019-10-09 00:45:16',NULL),(22,4,'Logistics - Northwest','2015-02-09 00:00:00',NULL,'Improve logistics in facilities in Northwest',0,NULL,'Improve logistics in facilities in Northwest','2016-01-01',NULL,NULL,2,NULL,NULL,0,'2019-01-21 16:31:42','2020-02-20 19:55:38',NULL),(23,1,'Plant closing','2015-01-27 00:00:00',NULL,'Increase the availability of all plants to 95%.',25,NULL,'Effort to increase the availability of all plants.','2015-05-01',NULL,NULL,3,NULL,NULL,0,'2019-01-21 16:31:43','2020-04-29 21:25:23',NULL),(24,9,'Review Guidelines','2015-11-14 00:00:00',NULL,'Reduce inventory by 20%',50,NULL,'Reduce inventory in all warehouses','2016-05-17',NULL,NULL,1,NULL,3,1,'2019-01-21 16:31:43','2019-10-09 00:45:14',NULL),(25,9,'Logistics - Northwest','2016-01-06 00:00:00',NULL,'Improve logistics in facilities in Northwest',75,NULL,'Improve logistics in facilities in Northwest','2016-07-26',NULL,NULL,1,NULL,NULL,1,'2019-01-21 16:31:44','2020-03-19 00:21:29',NULL),(26,1,'Plant closing','2015-07-18 00:00:00',NULL,'Goal TBD',100,NULL,'Close least efficient plants','2016-05-04',NULL,NULL,2,NULL,2,0,'2019-01-21 16:31:44','2020-03-17 07:48:11',NULL),(28,3,'Lean operations','2015-03-12 00:00:00',NULL,'Optimize time from order to delivery and installation',20,NULL,'Reduce lag time for parts','2015-11-21',NULL,NULL,2,NULL,3,1,'2019-01-21 16:31:45','2019-04-25 19:03:40',NULL),(29,1,'Logistics - Northwest','2015-04-29 00:00:00',NULL,'Goal TBD',50,NULL,'Improve logistics in facilities in Northwest','2016-01-11',NULL,NULL,2,NULL,4,1,'2019-01-21 16:31:45','2019-04-25 19:03:39',NULL),(30,9,'Testing Project','2015-09-20 00:00:00','Summary not availbale','Goal TBD',75,NULL,'for test purpose only','2016-06-05',NULL,NULL,3,NULL,4,0,'2019-01-21 16:31:46','2020-02-20 06:18:14',NULL),(31,3,'Optimize supply chain','2015-01-19 00:00:00',NULL,'Goal TBD',100,NULL,'Improve logistics in facilities in Northwest','2015-04-17',NULL,NULL,2,NULL,4,0,'2019-01-21 16:31:46','2020-03-19 00:24:33',NULL),(32,4,'Lean operations','2015-08-19 00:00:00',NULL,'Goal TBD',10,NULL,'Effort to increase the availability of all plants.','2016-06-29',NULL,NULL,2,NULL,4,1,'2019-01-21 16:31:47','2019-04-25 19:03:40',NULL),(35,1,'Optimize supply chain','2015-04-06 00:00:00',NULL,'Determine which plants are the least efficient',75,NULL,'Close least efficient plants','2020-10-18',NULL,NULL,4,NULL,6,1,'2019-01-21 16:31:48','2020-03-19 01:22:45',NULL),(36,9,'Lean operations','2016-02-25 00:00:00',NULL,'Reduce inventory by 20%',100,NULL,'Effort to increase the availability of all plants.','2016-05-15',NULL,NULL,2,NULL,79,0,'2019-01-21 16:31:48','2020-03-19 00:24:57',NULL),(37,3,'RFID tagging of inventory','2015-07-03 00:00:00',NULL,'Reduce inventory by 20%',10,NULL,'Reduce inventory in all warehouses','2015-10-07',NULL,NULL,2,NULL,7,0,'2019-01-21 16:31:49','2020-04-29 22:15:20',NULL),(111,3,'Increase Plant Availability','2019-01-27 00:00:00',NULL,'New goal',0,NULL,'Create a project for Agile dev to increase success','0000-00-00',NULL,NULL,1,NULL,7,0,'2019-01-29 19:33:17','2020-04-29 21:26:33',NULL),(112,9,'Inventory Reduction','2019-01-23 00:00:00',NULL,'35 Million by 2020 Dec',24,NULL,'Reduce inventory in all warehouses. ','2019-02-05',NULL,NULL,1,NULL,7,0,'2019-01-31 16:37:06','2020-02-20 19:55:17',NULL),(113,9,'Revise Strategy','2019-01-31 16:37:07',NULL,'Inventory reduction should help reduce costs',0,NULL,'Changes to optimizing supply chain should improve KPIs.',NULL,NULL,NULL,1,NULL,7,0,'2019-01-31 16:37:08','2020-04-29 22:15:15',NULL),(114,9,'Inventory Reduction - Nov. 2018','2019-01-31 16:43:45',NULL,'Inventory reduction should help reduce costs',0,22,'Reduce inventory in all warehouses. Adding lots more text here to see how it displays on the card.  More text to display here. Focus on inventory reduction for all locations across North America.',NULL,NULL,NULL,2,NULL,7,0,'2019-01-31 16:43:46','2020-02-20 19:58:01',NULL),(115,9,'Project 17','2019-01-30 00:00:00',NULL,'Save 1 Million USD inventory carrying cost',0,NULL,'Reduce inventory of common items. ','0000-00-00',NULL,NULL,1,NULL,7,0,'2019-01-31 16:59:15','2020-03-19 00:24:41',NULL),(116,9,'Improve Regular Maintenance','2019-01-31 17:03:13',NULL,'Inventory reduction should help reduce costs',0,24,'Reduce inventory in all warehouses. Adding lots more text here to see how it displays on the card.  More text to display here. Focus on inventory reduction for all locations across North America.',NULL,NULL,NULL,1,NULL,7,0,'2019-01-31 17:03:14','2020-03-19 00:25:10',NULL),(117,4,'My New Project','2007-03-18 19:57:35',NULL,'Decrease failures that take plants and facilities offline for hours.',0,22,'This is a new project',NULL,NULL,NULL,1,NULL,7,0,'2019-03-18 19:57:35','2020-02-20 05:04:03',NULL),(118,2,'Address Increasing Annual Costs','2019-01-07 00:00:00','Initial inventory assessment completed, 3/23 and 3/24.','Reduce inventory by 20%',10,24,'Reduce inventory in all warehouses.  Add more text here.  More.','2019-03-29',NULL,NULL,2,NULL,14,0,'2019-03-22 19:20:57','2020-02-20 19:53:02',NULL),(119,9,'Reduce Inventory','2019-03-22 19:20:57',NULL,'Determine which plants are the least efficient',0,NULL,'Reduce inventory in all warehouses. Adding lots more text here to see how it displays on the card.  More text to display here. Focus on inventory reduction for all locations across North America.',NULL,NULL,NULL,2,NULL,12,0,'2019-03-22 19:20:57','2020-04-29 22:15:49',NULL),(121,9,'Sales Engagement Improvement','2019-03-29 14:14:40',NULL,'Increase the pipeline, and increase win rate',0,NULL,'Improve way of engaging with the customer with proactive planning and approach, more seeking information and views on the opportunities and risks, creating a strong value proposition.',NULL,NULL,NULL,2,NULL,NULL,0,'2019-03-29 14:14:40','2020-04-29 22:15:40',NULL),(122,3,'Sales Engagement Improvement','2019-03-29 14:14:45',NULL,'Increase the pipeline, and increase win rate',0,NULL,'Improve way of engaging with the customer with proactive planning and approach, more seeking information and views on the opportunities and risks, creating a strong value proposition.',NULL,NULL,NULL,2,NULL,NULL,0,'2019-03-29 14:14:45','2020-02-20 19:56:40',NULL),(123,3,'Sales Engagement Improvement','2019-03-29 14:14:46',NULL,'Increase the pipeline, and increase win rate',0,NULL,'Improve way of engaging with the customer with proactive planning and approach, more seeking information and views on the opportunities and risks, creating a strong value proposition.',NULL,NULL,NULL,3,NULL,NULL,0,'2019-03-29 14:14:46','2020-04-29 22:15:33',NULL),(130,7,'Project #1','2019-05-21 00:00:00',NULL,'Reduce operating costs within 12 months',5,NULL,'First project to reduce operating costs throughout the org.','2019-09-27',NULL,NULL,2,NULL,NULL,0,'2019-05-26 15:12:11','2020-02-19 13:17:31',NULL),(133,3,'Reduce Inventory','2008-07-04 00:00:00',NULL,'Determine which plants are the least efficient',0,NULL,'Reduce inventory in all warehouses. Adding lots more text here to see how it displays on the card.  More text to display here. Focus on inventory reduction for all locations across North America.','2011-04-03',NULL,NULL,2,NULL,NULL,0,'2019-05-31 01:45:37','2020-03-19 00:23:57',NULL),(140,9,'Increase levels of testing','2019-09-03 17:53:53','New levels of testing within first quarter.',NULL,0,NULL,'Assess potential benefits of testing to prevent future failures',NULL,NULL,NULL,2,NULL,107,0,'2019-09-03 17:53:53','2020-03-20 20:30:14',NULL),(6792,9,'Reduce MTBF','2019-09-29 13:40:47',NULL,NULL,0,NULL,'Increase planned maintenance ',NULL,NULL,NULL,2,NULL,9,0,'2019-09-29 13:40:47','2020-03-19 00:24:10',NULL),(6793,9,'Automation assessment','2019-10-02 00:00:00','Progress made on initial reviews',NULL,80,NULL,'Assess degrees of automation over next two months','2020-01-31',NULL,NULL,4,NULL,97,0,'2019-10-03 04:12:48','2020-02-21 03:35:31',NULL),(6794,9,'Inventory cost','2019-10-06 01:33:43',NULL,NULL,0,NULL,'Review data on inventory',NULL,NULL,NULL,2,NULL,99,1,'2019-10-06 01:33:43','2019-10-09 00:45:15',NULL),(6795,2,'Reduce MTBF_ Level 2','2019-10-09 00:00:00','Reduce breakdown maintenance  ',NULL,0,NULL,'Reduce breakdown maintenance  ','0000-00-00',NULL,NULL,2,NULL,9,1,'2019-10-09 00:45:33','2020-02-11 09:12:42',NULL),(6797,2,'Automation 1 assessment','2019-10-10 00:00:00','Progress made on initial reviews',NULL,0,NULL,'Degree of automation','2020-01-31',NULL,NULL,2,NULL,133,1,'2019-10-11 23:52:18','2020-01-03 18:37:20',NULL),(6798,2,'Re-assess Supply Chain Capability','2019-10-12 16:02:15',NULL,NULL,0,NULL,'Reassess focusing on supply chain intelligence and risk management',NULL,NULL,NULL,2,NULL,96,1,'2019-10-12 16:02:15','2019-10-12 16:02:15',NULL),(6799,10,'Asset Performance Management - Darwin','2019-11-23 00:00:00','Create the capabilities within the new function to be able to discover asset performance improvement opportunities, collaborate with other functions through EPIC processes, and ensure closure to build /enhance the knowledge base of operation.','Efficient reporting. Data driven insights and actions driving asset performance. ',0,NULL,'','2020-12-30',NULL,NULL,3,19,558,1,'2019-11-29 19:18:57','2020-05-13 04:24:18',NULL),(6802,10,'Category Setup ','2019-11-22 00:00:00','','To be able to manage the loss production in an effective way, increase MWH. Achieve alignment with the service providers towards improving performance',0,NULL,'Setting up new categories in Bazefield for detailed drill down of work','2020-03-22',NULL,NULL,3,19,560,1,'2019-12-05 04:45:06','2020-05-13 04:25:39',NULL),(6803,10,'Data Completeness - test','2019-12-08 00:00:00','','Make quality data available on time to enable informed decision making',10,NULL,'Data gets lost','0000-00-00',NULL,NULL,3,NULL,NULL,0,'2019-12-13 16:23:35','2020-03-19 16:54:21',NULL),(6805,10,'Data Quality Assessment','2020-01-03 00:00:00',NULL,NULL,0,NULL,'Assess the current level of quality of wind turbine data to Bazefield','2020-10-10',NULL,NULL,2,NULL,NULL,1,'2020-01-05 20:55:44','2020-03-17 10:54:21',NULL),(6807,1,'Total inventory cost, count optimized with the demand	10235646','2020-01-08 07:31:34','','',0,NULL,'Total inventory cost, count optimized with the demand	2562561',NULL,NULL,NULL,2,NULL,NULL,0,'2020-01-08 07:31:33','2020-02-21 04:00:58',NULL),(6833,2,'Total inventory cost, count optimized with the demand	10235646 2','2020-03-01 00:00:00','Optimize inventory cost, updated now',NULL,0,NULL,'Total inventory cost, count optimized with the demand	2562561','2020-08-01',NULL,NULL,2,NULL,NULL,0,'2020-02-04 03:58:51','2020-02-20 19:56:19',NULL),(6836,9,'testProject for dummy comp','2020-02-12 00:00:00','','testing',10,NULL,'initialization','2020-02-29',NULL,NULL,1,NULL,NULL,0,'2020-02-12 06:00:56','2020-02-20 05:04:23',NULL),(6837,9,'New Solatic Project','2020-02-12 12:21:36','New test Summary of Solatic','',0,NULL,'dss',NULL,NULL,NULL,2,NULL,NULL,0,'2020-02-12 12:21:36','2020-02-20 19:58:21',NULL),(6838,2,'Test 3-1-20','2020-03-02 00:37:54','Quick summary is here','Business goal for 2020',0,NULL,'Testing project create',NULL,NULL,NULL,2,NULL,NULL,1,'2020-03-02 00:37:54','2020-03-02 00:37:54',NULL),(6839,10,'New project test','2020-03-04 00:00:00','New project test','New project test',0,NULL,'New project test','0000-00-00',NULL,NULL,2,NULL,492,0,'2020-03-04 06:31:54','2020-03-04 11:17:43',NULL),(6840,10,'Test project','2020-03-04 08:50:49',NULL,NULL,0,NULL,'test desc',NULL,NULL,NULL,2,NULL,135,0,'2020-03-04 08:50:49','2020-04-18 09:20:57',NULL),(6841,55,'Test React Project','2020-03-04 00:00:00','Summary','Goal',11,NULL,'Description','2020-05-02',NULL,NULL,2,85,NULL,1,'2020-03-04 09:34:13','2020-05-13 15:34:27',NULL),(6842,55,'TEst Vue project','2020-03-04 09:38:29','','',0,NULL,'',NULL,NULL,NULL,2,NULL,NULL,0,'2020-03-04 09:38:28','2020-03-16 23:18:14',NULL),(6843,55,'TestProjectnew','2020-03-04 00:00:00','sadsad','',0,NULL,'','0000-00-00',NULL,NULL,2,NULL,NULL,0,'2020-03-04 11:00:44','2020-03-16 23:18:07',NULL),(6844,10,'Test','2020-03-04 00:00:00','','',0,NULL,'TestTes','0000-00-00',NULL,NULL,2,NULL,515,0,'2020-03-04 11:17:14','2020-03-14 02:26:51',NULL),(6845,10,'test2','2020-03-04 00:00:00','','',0,NULL,'','0000-00-00',NULL,NULL,2,NULL,527,0,'2020-03-04 13:06:56','2020-03-14 02:27:03',NULL),(6846,10,'New test project - march 05-03','2020-03-05 00:00:00','New test summary - march 05-03','',0,NULL,'New test desc- march 05-03','2021-05-01',NULL,NULL,2,NULL,526,0,'2020-03-05 02:13:47','2020-03-14 02:26:11',NULL),(6847,10,'New test project - march 05-03','2020-03-05 02:13:53','New test summary - march 05-03','',0,NULL,'New test desc- march 05-03',NULL,NULL,NULL,2,NULL,NULL,0,'2020-03-05 02:13:53','2020-03-14 02:26:06',NULL),(6848,55,'Asset Performance Management - Darwin','2020-03-05 00:00:00','','Create the capabilities within the new function to be able to discover asset performance improvement opportunities, collaborate with other functions through EPIC processes, and ensure closure to build /enhance the knowledge base of operation.',0,NULL,'','2020-05-01',NULL,NULL,1,85,570,1,'2020-03-05 09:14:42','2020-05-12 17:49:58',NULL),(6849,10,'Project Management Methodology','2020-02-26 00:00:00','Systems and process in preparation for doubling the operational portfolio. Project management processes to ensure that projects can be consistently delivered on time and on budget.','To be able to deliver project meeting expectations on Quality, Time and Budget in a consistent manner',20,NULL,'Design and Deploy the Right Size Project Management Methodology across all fuel types and technologies','2020-07-10',NULL,NULL,3,84,NULL,1,'2020-03-06 01:56:16','2020-05-13 04:24:53',NULL),(6850,10,'Major Component Time to RTS ','2020-03-06 02:37:34',NULL,NULL,0,NULL,'Analyze Major Component RTS and Define Process and Targets',NULL,NULL,NULL,2,NULL,NULL,0,'2020-03-06 02:37:34','2020-04-07 15:29:53',NULL),(6851,10,'Executive relation','2020-03-04 00:00:00',NULL,NULL,0,NULL,'Executive  Desc ','2020-10-20',NULL,NULL,2,NULL,NULL,0,'2020-03-06 02:49:54','2020-03-19 00:20:07',NULL),(6852,10,'New Project 07032020','2020-03-07 00:00:00','This is the sample summary','',0,NULL,'This is the project desc','2021-02-01',NULL,NULL,2,NULL,NULL,0,'2020-03-07 15:28:02','2020-03-19 00:19:44',NULL),(6853,10,'hgyh','2020-03-09 04:57:49','','',0,NULL,'hgjh',NULL,NULL,NULL,2,NULL,NULL,0,'2020-03-09 04:57:48','2020-03-14 02:25:38',NULL),(6854,10,'test','2020-03-09 05:18:09','','',0,NULL,'',NULL,NULL,NULL,2,NULL,NULL,0,'2020-03-09 05:18:09','2020-03-14 02:26:45',NULL),(6855,10,'test2','2020-03-09 05:18:43','','',0,NULL,'',NULL,NULL,NULL,2,NULL,NULL,0,'2020-03-09 05:18:43','2020-03-14 02:27:09',NULL),(6856,10,'Major Component RTS','2020-01-28 00:00:00','Made good progress in process design and cross functional alignment. Key will be document the expectation from individual roles and ensure robust decision in a timely manner.','Goal is to be able to set a target value for RTS, meet those targets in a cross functional way and create a knowledge repository for the organization',30,NULL,'Improve RTS from major component failure, define a target for RTS, create a process for continuous improvement','2020-05-31',NULL,NULL,3,19,562,1,'2020-03-20 23:32:44','2020-05-13 04:25:22',NULL),(6857,10,'null','2020-04-11 08:44:32',NULL,NULL,0,NULL,'null',NULL,NULL,NULL,2,NULL,561,0,'2020-04-11 08:44:32','2020-04-13 20:56:37',NULL),(6858,10,'On going APM Activities','2020-04-19 00:00:00','','Address Stakeholder Ad-hoc Requests\nImprove APM activities ',0,NULL,'Activities that are not part of any major project or roadmap','2020-12-31',NULL,NULL,3,NULL,NULL,1,'2020-04-21 21:57:10','2020-04-22 05:01:25',NULL),(6859,1,'ValueInfinity Internal Project Tasks','2020-04-27 00:00:00','','',0,NULL,'Keep track of all types of activities ','2021-05-02',NULL,NULL,2,NULL,NULL,1,'2020-04-29 21:29:28','2020-05-04 16:30:24',NULL);
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `setProjectStatus` BEFORE INSERT ON `projects` FOR EACH ROW SET NEW.statusId =
    (select id from ProjectStatuses
where label = 'Not Approved') */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_ins_projects` AFTER INSERT ON `projects` FOR EACH ROW begin
            insert into SearchData (orgId,ganttTaskId, foreignId, title, description, summary, project, source,active)
            values (NEW.orgId,0, NEW.id, NEW.title, NEW.description, NEW.summary, NEW.title, 'Projects',NEW.active);
        end */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_upd_projects` AFTER UPDATE ON `projects` FOR EACH ROW begin
            insert into SearchData (orgId,ganttTaskId, foreignId, title, description, summary, project, source,active)
            values (NEW.orgId,0, NEW.id, NEW.title, NEW.summary, NEW.summary, NEW.title, 'Projects',NEW.active)
            on duplicate key update
                title = NEW.title,
                description = NEW.summary,
                summary = NEW.summary,

foreignId = NEW.id,

active = NEW.active;
        end */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `projectstatuses`
--

DROP TABLE IF EXISTS `projectstatuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projectstatuses` (
  `id` int NOT NULL,
  `label` varchar(30) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='List of project statuses';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projectstatuses`
--

LOCK TABLES `projectstatuses` WRITE;
/*!40000 ALTER TABLE `projectstatuses` DISABLE KEYS */;
INSERT INTO `projectstatuses` VALUES (1,'Approved','2019-05-31 00:28:04','2019-05-31 00:28:04'),(2,'Not Approved','2019-05-31 00:28:04','2019-05-31 00:28:04'),(3,'In Progress','2019-05-31 00:28:04','2019-05-31 00:28:04'),(4,'Completed','2019-05-31 00:28:04','2019-05-31 00:28:04'),(5,'Postponed','2019-05-31 00:28:04','2019-05-31 00:28:04');
/*!40000 ALTER TABLE `projectstatuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orgId` int NOT NULL,
  `description` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roles_org_ind` (`orgId`),
  CONSTRAINT `roles_org_ind_fk` FOREIGN KEY (`orgId`) REFERENCES `organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,1,'Chief Operating Officer'),(2,1,'VP Operations'),(3,1,'Sr. Director'),(4,1,'Director'),(5,1,'Manager'),(6,1,'Engineer'),(7,1,'Analyst'),(8,1,'Consultant'),(9,2,'Chief Operating Officer'),(10,2,'VP Operations'),(11,2,'Sr. Director'),(12,2,'Director'),(13,2,'Manager'),(14,2,'Engineer'),(15,2,'Analyst'),(16,2,'Consultant'),(17,3,'Chief Operating Officer'),(18,3,'VP Operations'),(19,3,'Sr. Director'),(20,3,'Director'),(21,3,'Manager'),(22,3,'Engineer'),(23,3,'Analyst'),(24,3,'Consultant'),(25,4,'Chief Operating Officer'),(26,4,'VP Operations'),(27,4,'Sr. Director'),(28,4,'Director'),(29,4,'Manager'),(30,4,'Engineer'),(31,4,'Analyst'),(32,4,'Consultant'),(33,7,'Chief Operating Officer'),(34,7,'VP Operations'),(35,7,'Sr. Director'),(36,7,'Director'),(37,7,'Manager'),(38,7,'Engineer'),(39,7,'Analyst'),(40,7,'Consultant'),(41,9,'Chief Operating Officer'),(42,9,'VP Operations'),(43,9,'Sr. Director'),(44,9,'Director'),(45,9,'Manager'),(46,9,'Engineer'),(47,9,'Analyst'),(48,9,'Consultant'),(49,10,'Chief Operating Officer'),(50,10,'VP Operations'),(51,10,'Sr. Director'),(52,10,'Director'),(53,10,'Manager'),(54,10,'Engineer'),(55,10,'Analyst'),(56,10,'Consultant'),(57,55,'Chief Operating Officer'),(58,55,'VP Operations'),(59,55,'Sr. Director'),(60,55,'Director'),(61,55,'Manager'),(62,55,'Engineer'),(63,55,'Analyst'),(64,55,'Consultant');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `searchdata`
--

DROP TABLE IF EXISTS `searchdata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `searchdata` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orgId` int DEFAULT NULL,
  `ganttTaskId` bigint DEFAULT NULL,
  `foreignId` int NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `project` varchar(100) DEFAULT NULL,
  `source` varchar(50) DEFAULT NULL,
  `active` tinyint DEFAULT '1',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ganttTaskId_foreignId_source` (`ganttTaskId`,`foreignId`,`source`),
  FULLTEXT KEY `title` (`title`,`description`,`summary`)
) ENGINE=InnoDB AUTO_INCREMENT=4995 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='For building our fulltext search index.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `searchdata`
--

LOCK TABLES `searchdata` WRITE;
/*!40000 ALTER TABLE `searchdata` DISABLE KEYS */;
INSERT INTO `searchdata` VALUES (2259,1,0,1,'Reduce operating costs frm  1','Effort to increase the availability of all plants.',NULL,'Logistics - Northwest','Kpis',0,'2020-02-19 08:59:13','2020-03-19 00:21:29'),(2260,1,0,2,'Inventory Reduction','Reduce inventory in all warehouses',NULL,'Plant closing','Kpis',1,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2261,1,0,3,'Energy output efficiency','Increase the energy output efficiency for the wider organization',NULL,'Review Guidelines','Kpis',0,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2262,2,0,4,'Increase parts availability','Increase the availability of parts at all locations.',NULL,'Logistics - Northwest','Kpis',0,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2263,4,0,6,'Repair time','Address problems with diagnosing equipment failure',NULL,'RFID tagging of inventory','Kpis',1,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2264,1,0,7,'Increase energy output efficiency','Increase energy output efficiency',NULL,'Review Guidelines','Kpis',0,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2265,3,0,8,'Increase turbine online time','Increase turbine online time',NULL,'Inventory Reduction','Kpis',0,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2266,2,0,9,'Mean Time Between Failure','Average time between two failure of the same component or target system.',NULL,'RFID tagging of inventory','Kpis',0,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2267,1,0,10,'Increase parts availability','Increase the availability of parts at all locations.',NULL,'Inventory Reduction','Kpis',0,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2268,2,0,12,'Increase parts availability and more','Increase the availability of parts at all locations.',NULL,'Address Increasing Annual Costs','Kpis',0,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2269,4,0,14,'Reduce average repair time','Address problems with diagnosing equipment failure and fixing components.',NULL,'Address Increasing Annual Costs','Kpis',1,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2270,4,0,16,'Increase efficiency','Increase energy output efficiency',NULL,'Category Setup ','Kpis',1,'2020-02-19 08:59:13','2020-02-25 06:58:13'),(2271,3,0,37,'Proposal Lead Time','Time taken for submitting a final proposal to the customer starting from the initial inquiry from the customer. Intent is to measure the effectiveness of the information collection process from the customer, processing the information using company knowle',NULL,NULL,'Kpis',1,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2272,4,0,55,'Simple regression','Simple regression against costs, inventory, and maintenance.',NULL,'Address Increasing Annual Costs','Kpis',1,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2273,4,0,59,'Increase efficiency','',NULL,'Category Setup ','Kpis',0,'2020-02-19 08:59:13','2020-03-04 02:38:55'),(2274,4,0,79,'Minimize downtime','Review SOPs to minimize system and equipment downtime',NULL,'Lean operations','Kpis',0,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2275,4,0,81,'Inventory reduction and optimization','Inventory reduction',NULL,'Inventory Reduction','Kpis',0,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2276,4,0,92,'Lower inventory at selected sites','Total inventory cost, count optimized with the demand ',NULL,'Address Increasing Annual Costs','Kpis',1,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2277,2,0,96,'Evaluate supply chain','Evaluate supply chain and assess gaps',NULL,'Lean operations','Kpis',0,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2278,2,0,97,'Assess degree of automation','Evaluate and assess each site by amount of automation',NULL,'Logistics - Northwest','Kpis',1,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2279,2,0,99,'Inventory Cost','Reduce Inventory Carrying Cost',NULL,NULL,'Kpis',1,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2280,2,0,107,'Measure failover testing','Review failover testing for all locations',NULL,'Category Setup ','Kpis',1,'2020-02-19 08:59:13','2020-02-25 07:16:21'),(2281,1,0,108,'Increasing Plant Availability','',NULL,NULL,'Kpis',1,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2282,10,0,111,'Quality Score','Score based on all quality criteria',NULL,NULL,'Kpis',0,'2020-02-19 08:59:13','2020-02-21 19:22:57'),(2283,10,0,112,'Data Availability','Percentage of data available for the particular purpose of reporting, analysis or modeling',NULL,'Asset Performance Management - Darwin','Kpis',0,'2020-02-19 08:59:13','2020-04-08 23:47:12'),(2284,10,0,113,'Data Quality','Representing the quality of the data based on accuracy, resolution, timeliness, integrity and trace ability ',NULL,'Asset Performance Management - Darwin','Kpis',0,'2020-02-19 08:59:13','2020-04-08 23:47:11'),(2285,10,0,114,'Qualified Opportunities','Number of opportunities identified by APM discovery process that were assessed and qualified to move forward.',NULL,'Automation 1 assessment','Kpis',1,'2020-02-19 08:59:13','2020-02-25 22:01:37'),(2286,10,0,115,'Closing Rate','Opportunity Realization Rate',NULL,'Asset Performance Management - Darwin','Kpis',0,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2287,10,0,121,'Availability on Time','Data is available at the right time for processing and decision making',NULL,'Data Completeness - test','Kpis',0,'2020-02-19 08:59:13','2020-03-19 00:20:22'),(2288,10,0,132,'Heat Rate','Trend of Average Monthly Heat Rate trailing a 12 months period',NULL,NULL,'Kpis',0,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2289,2,0,133,'Process Lead Time ','Time taken to complete a process',NULL,'Automation 1 assessment','Kpis',0,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2290,2,0,134,'Process Cost','Cost of executing a process',NULL,'Automation 1 assessment','Kpis',0,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2291,10,0,135,'Planned Maintenance Percentage','Total share of downtime due to planned maintenance',NULL,NULL,'Kpis',1,'2020-02-19 08:59:13','2020-03-04 08:52:44'),(2292,1,0,155,'KPI From MindMap 2','Test',NULL,'Category Setup ','Kpis',0,'2020-02-19 08:59:13','2020-03-02 05:32:49'),(2293,1,0,156,'Kpi From Froject Details','test',NULL,'Automation 1 assessment','Kpis',0,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2294,1,0,392,'Total inventory cost, count optimized with the demand	333','Total inventory cost, count optimized with the demand	355',NULL,'Address Increasing Annual Costs','Kpis',0,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2295,10,0,406,'Design Lead time','Time taken to complete a design that is included in the proposal',NULL,NULL,'Kpis',0,'2020-02-19 08:59:13','2020-02-21 20:25:54'),(2296,1,0,407,'KPITitleQuidProValv','KPIDescriptionQuidPro',NULL,NULL,'Kpis',0,'2020-02-19 08:59:13','2020-03-19 00:21:16'),(2297,1,0,408,'NodeKpiTTLQuidPro','NodeKpiDescQuidPro',NULL,NULL,'Kpis',0,'2020-02-19 08:59:13','2020-03-19 00:21:21'),(2298,9,0,409,'Testing KPI','Desc of test KPI',NULL,'Automation 1 assessment','Kpis',1,'2020-02-19 08:59:13','2020-02-26 12:29:04'),(2299,10,0,411,'MWHr Contributed','Total MWHr contributed through saving from losses',NULL,NULL,'Kpis',0,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2300,10,0,412,'MWH Contributed','Total MWH contributed through opportunity identification ',NULL,NULL,'Kpis',0,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2301,2,0,416,'Inventory cost reduction ','Seek to reduce inventory costs',NULL,'Address Increasing Annual Costs','Kpis',1,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2302,9,0,425,'DDe','',NULL,NULL,'Kpis',0,'2020-02-19 08:59:13','2020-02-21 04:05:07'),(2303,9,0,427,'wfdfd','sfd',NULL,'Project 17','Kpis',0,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2304,10,0,428,'NEWKPI1002347','NEWKPI1002347',NULL,NULL,'Kpis',0,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2305,10,0,433,'New KPI From ORG Page','Test K',NULL,NULL,'Kpis',0,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2306,1,0,434,'NEW KPI 1102-0304','NEW KPI 1102-0304',NULL,NULL,'Kpis',0,'2020-02-19 08:59:13','2020-03-19 00:21:17'),(2307,1,0,435,'NEW KPI 1102-0304','NEW KPI 1102-0304',NULL,NULL,'Kpis',0,'2020-02-19 08:59:13','2020-03-19 00:21:18'),(2308,1,0,436,'','',NULL,NULL,'Kpis',0,'2020-02-19 08:59:13','2020-03-19 00:21:07'),(2309,9,0,437,'first test KPI ','',NULL,NULL,'Kpis',0,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2310,9,0,438,'starKPI','test1',NULL,'Category Setup ','Kpis',0,'2020-02-19 08:59:13','2020-02-25 21:59:12'),(2311,9,0,439,'by project page','fgdrdf',NULL,NULL,'Kpis',0,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2312,1,0,440,'KPI13022020','',NULL,NULL,'Kpis',0,'2020-02-19 08:59:13','2020-03-19 00:21:10'),(2313,3,0,442,'test','test',NULL,'Reduce Inventory','Kpis',0,'2020-02-19 08:59:13','2020-02-20 12:11:08'),(2314,3,0,443,'dsf','',NULL,'Optimize supply chain','Kpis',0,'2020-02-19 08:59:13','2020-02-20 12:11:06'),(2315,1,0,459,'dsffsdfsdf','',NULL,NULL,'Kpis',0,'2020-02-19 08:59:13','2020-03-19 00:21:30'),(2316,1,0,460,'ggggg','',NULL,NULL,'Kpis',0,'2020-02-19 08:59:13','2020-03-19 00:21:31'),(2317,1,0,461,'hhhhhhhhh','',NULL,NULL,'Kpis',0,'2020-02-19 08:59:13','2020-03-19 00:21:32'),(2318,1,0,462,'sdfsdfsdfsfsdfsdfsdf','',NULL,NULL,'Kpis',0,'2020-02-19 08:59:13','2020-03-19 00:21:33'),(2319,9,0,464,'kpi19022020-dmy','kpi19022020-dmy',NULL,NULL,'Kpis',0,'2020-02-19 08:59:13','2020-02-21 04:05:55'),(2320,9,0,465,'KPIaddedfordmy17022020','new Descr',NULL,'Project 17','Kpis',0,'2020-02-19 08:59:13','2020-02-19 09:00:51'),(2321,9,0,466,'TESTKPI1new7022020','descriptionnew',NULL,NULL,'Kpis',0,'2020-02-19 08:59:13','2020-02-19 08:59:13'),(2324,3,0,5,'Testing',NULL,NULL,NULL,'Mindmaps',1,'2020-02-19 09:06:56','2020-02-19 09:06:56'),(2325,3,0,7,NULL,NULL,NULL,NULL,'Mindmaps',1,'2020-02-19 09:06:56','2020-02-19 09:06:56'),(2326,2,0,16,NULL,NULL,NULL,NULL,'Mindmaps',0,'2020-02-19 09:06:56','2020-02-19 09:06:56'),(2327,2,0,34,NULL,NULL,NULL,NULL,'Mindmaps',0,'2020-02-19 09:06:56','2020-02-19 09:06:56'),(2328,2,0,35,NULL,NULL,NULL,NULL,'Mindmaps',0,'2020-02-19 09:06:56','2020-02-19 09:06:56'),(2329,2,0,36,NULL,NULL,NULL,NULL,'Mindmaps',0,'2020-02-19 09:06:56','2020-02-19 09:06:56'),(2330,2,0,37,NULL,NULL,NULL,NULL,'Mindmaps',0,'2020-02-19 09:06:56','2020-02-19 09:06:56'),(2331,2,0,39,'Initial meeting',NULL,NULL,NULL,'Mindmaps',1,'2020-02-19 09:06:56','2020-02-19 09:06:56'),(2332,2,0,40,'Second version','Second version from first meeting.',NULL,NULL,'Mindmaps',1,'2020-02-19 09:06:56','2020-02-19 09:06:56'),(2333,2,0,41,NULL,NULL,NULL,NULL,'Mindmaps',0,'2020-02-19 09:06:56','2020-02-19 09:06:56'),(2334,2,0,58,NULL,NULL,NULL,NULL,'Mindmaps',0,'2020-02-19 09:06:56','2020-02-19 09:06:56'),(2335,2,0,59,NULL,NULL,NULL,NULL,'Mindmaps',0,'2020-02-19 09:06:56','2020-02-19 09:06:56'),(2336,2,0,60,NULL,NULL,NULL,NULL,'Mindmaps',0,'2020-02-19 09:06:56','2020-02-19 09:06:56'),(2337,2,0,66,NULL,NULL,NULL,NULL,'Mindmaps',0,'2020-02-19 09:06:56','2020-02-19 09:06:56'),(2338,2,0,67,NULL,NULL,NULL,NULL,'Mindmaps',0,'2020-02-19 09:06:56','2020-02-19 09:06:56'),(2339,2,0,68,NULL,NULL,NULL,NULL,'Mindmaps',0,'2020-02-19 09:06:56','2020-02-19 09:06:56'),(2340,2,0,69,'Testing','Initial session to test some ideas.',NULL,NULL,'Mindmaps',1,'2020-02-19 09:06:56','2020-02-19 09:06:56'),(2341,2,0,70,'New ideas',NULL,NULL,NULL,'Mindmaps',1,'2020-02-19 09:06:56','2020-02-19 09:06:56'),(2342,2,0,71,'Brainstorming session','Brainstorming session',NULL,NULL,'Mindmaps',1,'2020-02-19 09:06:56','2020-02-19 09:06:56'),(2343,2,0,72,'Preliminary','Preliminary version.',NULL,NULL,'Mindmaps',1,'2020-02-19 09:06:56','2020-02-19 09:06:56'),(2344,2,0,73,'Earlier version of map for Northwest Lumber','Earlier version of map for Northwest Lumber.',NULL,NULL,'Mindmaps',1,'2020-02-19 09:06:56','2020-02-19 09:06:56'),(2345,2,0,74,'Earlier session',NULL,NULL,NULL,'Mindmaps',1,'2020-02-19 09:06:56','2020-02-19 09:06:56'),(2346,2,0,75,'Latest test','Latest working mind map for Northwest.',NULL,NULL,'Mindmaps',1,'2020-02-19 09:06:56','2020-02-19 09:06:56'),(2347,2,0,76,'Newest mind map','Start from a new mind map.',NULL,NULL,'Mindmaps',1,'2020-02-19 09:06:56','2020-02-19 09:06:56'),(2348,10,0,85,'APM - Darwin','2 year goals and objectives',NULL,NULL,'Mindmaps',1,'2020-02-19 09:06:56','2020-02-19 09:06:56'),(2349,10,0,87,'APUC Test Copy','Testing',NULL,NULL,'Mindmaps',0,'2020-02-19 09:06:56','2020-03-17 10:54:46'),(2350,1,0,88,'Test Project','Test desc',NULL,NULL,'Mindmaps',0,'2020-02-19 09:06:56','2020-02-20 07:37:44'),(2351,10,0,89,'Thermal Operations Performance','Key Measurements for Thermal Operations and Identification of Opportunities',NULL,NULL,'Mindmaps',1,'2020-02-19 09:06:56','2020-02-19 09:06:56'),(2352,1,0,91,'MindMapNameQuidProNew','MindMapDescQuidProNew',NULL,NULL,'Mindmaps',0,'2020-02-19 09:06:56','2020-02-19 09:09:23'),(2357,1,0,3,'Ahmed, Alauddin','alauddin@value-infinity.io',NULL,'','Persons',1,'2020-02-19 09:20:29','2020-05-18 22:01:56'),(2358,1,0,4,'Wang, Christina','cwang@value-infinity.com',NULL,'','Persons',0,'2020-02-19 09:20:29','2020-02-19 09:20:29'),(2359,1,0,5,'Joshi, Adi','ajoshi@value-infinity.com',NULL,'','Persons',1,'2020-02-19 09:20:29','2020-02-19 09:20:29'),(2360,2,0,7,'Walters, Sam','walters@@nwlumber-testorg.io',NULL,'','Persons',1,'2020-02-19 09:20:29','2020-02-19 09:20:29'),(2361,2,0,8,'Kramer, Brad','bkramer@nwlumber-testorg.io',NULL,'','Persons',1,'2020-02-19 09:20:29','2020-02-19 09:20:29'),(2362,1,0,55,'Kaufman(org), Brad','brad11@th.io',NULL,'','Persons',0,'2020-02-19 09:20:29','2020-04-29 21:25:42'),(2363,1,0,57,'Ahmed, Alauddin','ahmed.alauddin@value-infinity.com',NULL,'','Persons',1,'2020-02-19 09:20:29','2020-03-06 11:05:28'),(2364,2,0,66,'Jones, Mary','test@nwlumber-testorg.io',NULL,'','Persons',1,'2020-02-19 09:20:29','2020-02-19 09:20:29'),(2365,2,0,67,'Jackson, Jane','test231@nwlumber-testorg.io',NULL,'','Persons',1,'2020-02-19 09:20:29','2020-02-19 09:20:29'),(2366,2,0,68,'Murray, Martin','test13@nwlumber-testorg.io',NULL,'','Persons',1,'2020-02-19 09:20:29','2020-02-19 09:20:29'),(2367,2,0,69,'Allen, Robert','test92@nwlumber-testorg.io',NULL,'','Persons',1,'2020-02-19 09:20:29','2020-02-19 09:20:29'),(2368,2,0,70,'Stockman, Elizabeth','test33@nwlumber-testorg.io',NULL,'','Persons',1,'2020-02-19 09:20:29','2020-02-19 09:20:29'),(2369,1,0,75,'Test, Test','tt11@@value-infinity.com',NULL,'','Persons',0,'2020-02-19 09:20:29','2020-03-02 05:34:36'),(2370,1,0,76,'Joshi, Adi','adeejo1@gmail.com',NULL,'','Persons',0,'2020-02-19 09:20:29','2020-03-17 09:50:08'),(2371,1,0,93,'Wang, Christina','christinaw9090@gmail.com',NULL,'','Persons',1,'2020-02-19 09:20:29','2020-02-19 09:20:29'),(2372,10,0,103,'Ahmed, Alauddin','ahmed.alau@value-infinity.com',NULL,'','Persons',0,'2020-02-19 09:20:29','2020-03-18 01:56:10'),(2373,10,0,105,'Harrop, Rick','rick.harrop@algonquinpower.com',NULL,'','Persons',1,'2020-02-19 09:20:29','2020-02-19 09:20:29'),(2374,10,0,114,'Kaufman, Brad','brad1@gmail.com',NULL,'','Persons',0,'2020-02-19 09:20:29','2020-02-24 05:06:51'),(2375,10,0,115,'Lane, Victoria','victoria.lane@algonquinpower.com',NULL,'','Persons',0,'2020-02-19 09:20:29','2020-02-19 09:20:29'),(2376,10,0,140,'Balan, Luca','luca@gmail.com',NULL,'','Persons',0,'2020-02-19 09:20:29','2020-02-19 09:20:29'),(2377,10,0,141,'Balan, Florin','florin@gmail.com',NULL,'','Persons',0,'2020-02-19 09:20:29','2020-02-19 09:20:29'),(2378,10,0,164,'Ebrahimi, Alex','Alex.Ebrahimi@algonquinpower.com',NULL,'','Persons',1,'2020-02-19 09:20:29','2020-04-10 16:53:03'),(2379,1,0,168,'Singh, Prabhjot','prabhjot.s@kbihm.com',NULL,'','Persons',0,'2020-02-19 09:20:29','2020-03-20 13:12:56'),(2380,10,0,233,'KBIHM, Prabhjot','prabhjot.s.kbihm.apuc@gmail.com',NULL,'','Persons',0,'2020-02-19 09:20:29','2020-02-19 09:20:29'),(2381,9,0,236,'Company, Dummy new2','dummycompany@kbihm.com',NULL,'','Persons',0,'2020-02-19 09:20:29','2020-02-19 09:21:31'),(2384,9,0,19,'RFID tagging of inventory',NULL,NULL,'RFID tagging of inventory','Projects',0,'2020-02-19 09:28:51','2020-04-29 22:15:25'),(2385,1,0,20,'Increase Plant Availability',NULL,NULL,'Increase Plant Availability','Projects',0,'2020-02-19 09:28:51','2020-04-29 21:26:21'),(2386,9,0,21,'Inventory Reduction','Reduce inventory in all warehouses. Adding lots more text here to see how it displays on the card.  More text to display here. Focus on inventory reduction for all locations across North America.',NULL,'Inventory Reduction','Projects',1,'2020-02-19 09:28:51','2020-02-19 09:28:51'),(2387,4,0,22,'Logistics - Northwest',NULL,NULL,'Logistics - Northwest','Projects',0,'2020-02-19 09:28:51','2020-02-20 19:55:38'),(2388,1,0,23,'Plant closing',NULL,NULL,'Plant closing','Projects',0,'2020-02-19 09:28:51','2020-04-29 21:25:21'),(2389,9,0,24,'Review Guidelines','Reduce inventory in all warehouses',NULL,'Review Guidelines','Projects',1,'2020-02-19 09:28:51','2020-02-19 09:28:51'),(2390,9,0,25,'Logistics - Northwest',NULL,NULL,'Logistics - Northwest','Projects',1,'2020-02-19 09:28:51','2020-03-19 00:21:29'),(2391,1,0,26,'Plant closing',NULL,NULL,'Plant closing','Projects',0,'2020-02-19 09:28:51','2020-03-17 07:48:11'),(2392,3,0,28,'Lean operations','Reduce lag time for parts',NULL,'Lean operations','Projects',1,'2020-02-19 09:28:51','2020-02-19 09:28:51'),(2393,1,0,29,'Logistics - Northwest','Improve logistics in facilities in Northwest',NULL,'Logistics - Northwest','Projects',1,'2020-02-19 09:28:51','2020-02-19 09:28:51'),(2394,9,0,30,'Testing Project','Summary not availbale','Summary not availbale','Testing Project','Projects',0,'2020-02-19 09:28:51','2020-02-20 06:18:14'),(2395,3,0,31,'Optimize supply chain',NULL,NULL,'Optimize supply chain','Projects',0,'2020-02-19 09:28:51','2020-03-19 00:24:33'),(2396,4,0,32,'Lean operations','Effort to increase the availability of all plants.',NULL,'Lean operations','Projects',1,'2020-02-19 09:28:51','2020-02-19 09:28:51'),(2397,1,0,35,'Optimize supply chain',NULL,NULL,'Optimize supply chain','Projects',1,'2020-02-19 09:28:51','2020-03-19 01:22:27'),(2398,9,0,36,'Lean operations',NULL,NULL,'Lean operations','Projects',0,'2020-02-19 09:28:51','2020-03-19 00:24:57'),(2399,3,0,37,'RFID tagging of inventory',NULL,NULL,'RFID tagging of inventory','Projects',0,'2020-02-19 09:28:51','2020-04-29 22:15:19'),(2400,3,0,111,'Increase Plant Availability',NULL,NULL,'Increase Plant Availability','Projects',0,'2020-02-19 09:28:51','2020-04-29 21:26:31'),(2401,9,0,112,'Inventory Reduction',NULL,NULL,'Inventory Reduction','Projects',0,'2020-02-19 09:28:51','2020-02-20 19:55:15'),(2402,9,0,113,'Revise Strategy',NULL,NULL,'Revise Strategy','Projects',0,'2020-02-19 09:28:51','2020-04-29 22:15:13'),(2403,9,0,114,'Inventory Reduction - Nov. 2018',NULL,NULL,'Inventory Reduction - Nov. 2018','Projects',0,'2020-02-19 09:28:51','2020-02-20 19:58:01'),(2404,9,0,115,'Project 17',NULL,NULL,'Project 17','Projects',0,'2020-02-19 09:28:51','2020-03-19 00:24:41'),(2405,9,0,116,'Improve Regular Maintenance',NULL,NULL,'Improve Regular Maintenance','Projects',0,'2020-02-19 09:28:51','2020-03-19 00:25:10'),(2406,4,0,117,'My New Project',NULL,NULL,'My New Project','Projects',0,'2020-02-19 09:28:51','2020-02-19 13:10:31'),(2407,2,0,118,'Address Increasing Annual Costs','Initial inventory assessment completed, 3/23 and 3/24.','Initial inventory assessment completed, 3/23 and 3/24.','Address Increasing Annual Costs','Projects',0,'2020-02-19 09:28:51','2020-02-20 19:53:00'),(2408,9,0,119,'Reduce Inventory',NULL,NULL,'Reduce Inventory','Projects',0,'2020-02-19 09:28:51','2020-04-29 22:15:48'),(2409,9,0,121,'Sales Engagement Improvement',NULL,NULL,'Sales Engagement Improvement','Projects',0,'2020-02-19 09:28:51','2020-04-29 22:15:40'),(2410,3,0,122,'Sales Engagement Improvement',NULL,NULL,'Sales Engagement Improvement','Projects',0,'2020-02-19 09:28:51','2020-02-20 19:56:37'),(2411,3,0,123,'Sales Engagement Improvement',NULL,NULL,'Sales Engagement Improvement','Projects',0,'2020-02-19 09:28:51','2020-04-29 22:15:33'),(2412,7,0,130,'Project #1',NULL,NULL,'Project #1','Projects',0,'2020-02-19 09:28:51','2020-02-19 13:17:32'),(2413,3,0,133,'Reduce Inventory',NULL,NULL,'Reduce Inventory','Projects',0,'2020-02-19 09:28:51','2020-03-19 00:23:58'),(2414,9,0,140,'Increase levels of testing','New levels of testing within first quarter.','New levels of testing within first quarter.','Increase levels of testing','Projects',0,'2020-02-19 09:28:51','2020-03-20 20:30:14'),(2415,9,0,6792,'Reduce MTBF',NULL,NULL,'Reduce MTBF','Projects',0,'2020-02-19 09:28:51','2020-03-19 00:24:10'),(2416,9,0,6793,'Automation assessment','Progress made on initial reviews','Progress made on initial reviews','Automation assessment','Projects',0,'2020-02-19 09:28:51','2020-02-21 03:35:31'),(2417,9,0,6794,'Inventory cost','Review data on inventory',NULL,'Inventory cost','Projects',1,'2020-02-19 09:28:51','2020-02-19 09:28:51'),(2418,2,0,6795,'Reduce MTBF_ Level 2','Reduce breakdown maintenance  ','Reduce breakdown maintenance  ','Reduce MTBF_ Level 2','Projects',1,'2020-02-19 09:28:51','2020-02-19 09:28:51'),(2419,2,0,6797,'Automation 1 assessment','Degree of automation','Progress made on initial reviews','Automation 1 assessment','Projects',1,'2020-02-19 09:28:51','2020-02-19 09:28:51'),(2420,2,0,6798,'Re-assess Supply Chain Capability','Reassess focusing on supply chain intelligence and risk management',NULL,'Re-assess Supply Chain Capability','Projects',1,'2020-02-19 09:28:51','2020-02-19 09:28:51'),(2421,10,0,6799,'Asset Performance Management - Darwin','Create the capabilities within the new function to be able to discover asset performance improvement opportunities, collaborate with other functions through EPIC processes, and ensure closure to build /enhance the knowledge base of operation.','Create the capabilities within the new function to be able to discover asset performance improvement opportunities, collaborate with other functions through EPIC processes, and ensure closure to build /enhance the knowledge base of operation.','Asset Performance Management - Darwin','Projects',1,'2020-02-19 09:28:51','2020-03-04 02:48:57'),(2422,10,0,6802,'Category Setup ','','','Category Setup ','Projects',1,'2020-02-19 09:28:51','2020-02-19 19:51:14'),(2423,10,0,6803,'Data Completeness - test','','','Data Completeness - test','Projects',0,'2020-02-19 09:28:51','2020-03-19 16:54:21'),(2424,10,0,6805,'Data Quality Assessment',NULL,NULL,'Data Quality Assessment','Projects',1,'2020-02-19 09:28:51','2020-02-20 19:53:49'),(2425,1,0,6807,'Total inventory cost, count optimized with the demand	10235646','','','Total inventory cost, count optimized with the demand	10235646','Projects',0,'2020-02-19 09:28:51','2020-02-21 04:00:58'),(2426,2,0,6833,'Total inventory cost, count optimized with the demand	10235646 2','Optimize inventory cost, updated now','Optimize inventory cost, updated now','Total inventory cost, count optimized with the demand	10235646','Projects',0,'2020-02-19 09:28:51','2020-02-20 19:56:19'),(2427,9,0,6836,'testProject for dummy comp','','','testProject for dummy comp','Projects',0,'2020-02-19 09:28:51','2020-02-20 05:04:24'),(2428,9,0,6837,'New Solatic Project','New test Summary of Solatic','New test Summary of Solatic','solatic','Projects',0,'2020-02-19 09:28:51','2020-02-20 19:58:15'),(2529,10,38,6799,'APM Benefit',NULL,NULL,'Asset Performance Management - Darwin','Actions',1,'2020-02-19 09:53:12','2020-03-23 18:39:04'),(2530,10,1575164242307,6799,'adding action',NULL,NULL,'Asset Performance Management - Darwin','Actions',1,'2020-02-19 09:53:12','2020-03-23 18:39:04'),(2531,10,34,6799,'Asset Performance Monitoring',NULL,NULL,'Asset Performance Management - Darwin','Actions',1,'2020-02-19 09:53:12','2020-03-23 18:39:04'),(2532,10,58,6799,'Definition of Key Metrics',NULL,NULL,'Asset Performance Management - Darwin','Actions',1,'2020-02-19 09:53:12','2020-03-23 18:39:04'),(2533,10,1575217259691,6799,'Key Metrics - Wind',NULL,NULL,'Asset Performance Management - Darwin','Actions',1,'2020-02-19 09:53:12','2020-03-23 18:39:04'),(2534,10,1575217259692,6799,'Key Metric - Solar',NULL,NULL,'Asset Performance Management - Darwin','Actions',1,'2020-02-19 09:53:12','2020-03-23 18:39:04'),(2535,10,1575217259693,6799,'Key Metric - Thermal',NULL,NULL,'Asset Performance Management - Darwin','Actions',1,'2020-02-19 09:53:12','2020-03-23 18:39:04'),(2536,10,1575217259694,6799,'Key Metric - Hydro',NULL,NULL,'Asset Performance Management - Darwin','Actions',1,'2020-02-19 09:53:12','2020-03-23 18:39:04'),(2537,10,59,6799,'Define APM Process - Discovery to Closure',NULL,NULL,'Asset Performance Management - Darwin','Actions',1,'2020-02-19 09:53:12','2020-03-23 18:39:04'),(2538,10,1575217259683,6799,'Process for High Priority Issues >72 hours ',NULL,NULL,'Asset Performance Management - Darwin','Actions',1,'2020-02-19 09:53:12','2020-03-23 18:39:04'),(2539,10,1575217259686,6799,'Process for Trend and Patterns',NULL,NULL,'Asset Performance Management - Darwin','Actions',1,'2020-02-19 09:53:12','2020-03-23 18:39:04'),(2540,10,1575217259720,6799,'Weekly Meeting Structure and Process',NULL,NULL,'Asset Performance Management - Darwin','Actions',1,'2020-02-19 09:53:12','2020-03-23 18:39:04'),(2541,10,1575217259721,6799,'Asset Performance Monitoring Process- Solar',NULL,NULL,'Asset Performance Management - Darwin','Actions',1,'2020-02-19 09:53:12','2020-03-23 18:39:04'),(2542,10,1575217259722,6799,'Asset Performance Monitoring Process- Thermal',NULL,NULL,'Asset Performance Management - Darwin','Actions',1,'2020-02-19 09:53:12','2020-03-23 18:39:04'),(2543,10,1575217259689,6799,'Data Quality, QA Method and Governance',NULL,NULL,'Asset Performance Management - Darwin','Actions',1,'2020-02-19 09:53:12','2020-03-23 18:39:04'),(2544,10,1575217259715,6799,'Data Completeness',NULL,NULL,'Asset Performance Management - Darwin','Actions',1,'2020-02-19 09:53:12','2020-03-23 18:39:04'),(2545,10,1575217259725,6799,'Consolidate and Automate Asset Reporting',NULL,NULL,'Asset Performance Management - Darwin','Actions',1,'2020-02-19 09:53:12','2020-03-23 18:39:04'),(2546,10,1575217259727,6799,'Asset Performance Monitoring - Solar',NULL,NULL,'Asset Performance Management - Darwin','Actions',1,'2020-02-19 09:53:12','2020-03-23 18:39:04'),(2547,10,1575217259730,6799,'Asset Performance Monitoring - Hydro',NULL,NULL,'Asset Performance Management - Darwin','Actions',1,'2020-02-19 09:53:12','2020-03-23 18:39:04'),(2548,10,36,6799,'24/7 Control Room Monitoring',NULL,NULL,'Asset Performance Management - Darwin','Actions',1,'2020-02-19 09:53:12','2020-03-23 18:39:04'),(2549,10,1575217259733,6799,'OEM Scoring Methodology and Performance Feedback',NULL,NULL,'Asset Performance Management - Darwin','Actions',1,'2020-02-19 09:53:12','2020-03-23 18:39:04'),(2550,10,1575217259735,6799,'Equipment Health Reporting and Condition Monitoring System',NULL,NULL,'Asset Performance Management - Darwin','Actions',1,'2020-02-19 09:53:12','2020-03-23 18:39:04'),(2551,10,1575217259736,6799,'Predictive Analytics',NULL,NULL,'Asset Performance Management - Darwin','Actions',1,'2020-02-19 09:53:12','2020-03-23 18:39:04'),(2552,10,1575217259737,6799,'Consolidate and Automate Asset Reporting',NULL,NULL,'Asset Performance Management - Darwin','Actions',1,'2020-02-19 09:53:12','2020-03-23 18:39:04'),(2553,10,38,23,'Optimize the level of details for different reporting events',NULL,NULL,'Plant closing','Actions',1,'2020-02-19 09:53:12','2020-03-03 09:35:55'),(2554,10,1575164242307,23,'adding action',NULL,NULL,'Plant closing','Actions',1,'2020-02-19 09:53:12','2020-03-03 09:35:55'),(2555,10,40,23,'Condition Monitoring System',NULL,NULL,'Plant closing','Actions',1,'2020-02-19 09:53:12','2020-03-03 09:35:55'),(2556,10,35,23,'Track & report on OEM/Provider SLA performance',NULL,NULL,'Plant closing','Actions',1,'2020-02-19 09:53:12','2020-03-03 09:35:55'),(2557,10,37,23,'Predictive analytics for equipment reliability',NULL,NULL,'Plant closing','Actions',1,'2020-02-19 09:53:12','2020-03-03 09:35:55'),(2558,10,39,23,'Measurement of APM Contribution',NULL,NULL,'Plant closing','Actions',1,'2020-02-19 09:53:12','2020-03-03 09:35:55'),(2559,10,34,23,'Asset Performance Monitoring',NULL,NULL,'Plant closing','Actions',1,'2020-02-19 09:53:12','2020-03-03 09:35:55'),(2560,10,58,23,'Identify trend in Production / Loss ',NULL,NULL,'Plant closing','Actions',1,'2020-02-19 09:53:12','2020-03-03 09:35:55'),(2561,10,59,23,'Identify new solutions deployed as outcome of action tracker',NULL,NULL,'Plant closing','Actions',1,'2020-02-19 09:53:12','2020-03-03 09:35:55'),(2562,10,60,23,'Collect 2017-2018 data for selected sites',NULL,NULL,'Plant closing','Actions',1,'2020-02-19 09:53:12','2020-03-03 09:35:55'),(2563,10,1575164242355,23,'Identify trend in Production / Loss ',NULL,NULL,'Plant closing','Actions',1,'2020-02-19 09:53:12','2020-03-03 09:35:55'),(2564,10,36,23,'24/7 Control Room Monitoring',NULL,NULL,'Plant closing','Actions',1,'2020-02-19 09:53:12','2020-03-03 09:35:55'),(2565,10,1575164242366,23,NULL,NULL,NULL,'Plant closing','Actions',1,'2020-02-19 09:53:12','2020-03-03 09:35:55'),(2566,10,1575214414142,23,'Another',NULL,NULL,'Plant closing','Actions',1,'2020-02-19 09:53:12','2020-03-03 09:35:55'),(2567,10,1575819035396,6802,'Define Category',NULL,NULL,'Category Setup ','Actions',1,'2020-02-19 09:53:12','2020-05-04 23:37:02'),(2568,10,1575819035401,6802,'Set up the category',NULL,NULL,'Category Setup ','Actions',1,'2020-02-19 09:53:12','2020-05-04 23:37:02'),(2569,10,38,6802,'Start',NULL,NULL,'Category Setup ','Actions',1,'2020-02-19 09:53:12','2020-05-04 23:37:02'),(2570,10,1575819035153,6802,'Test Automation',NULL,NULL,'Category Setup ','Actions',1,'2020-02-19 09:53:12','2020-05-04 23:37:02'),(2571,10,1576208370894,6802,'New task',NULL,NULL,'Category Setup ','Actions',1,'2020-02-19 09:53:12','2020-05-04 23:37:02'),(2572,10,1575819035158,6802,'New task',NULL,NULL,'Category Setup ','Actions',1,'2020-02-19 09:53:12','2020-05-04 23:37:02'),(2573,10,1576254226241,6803,'Assess',NULL,NULL,'Data Completeness - test','Actions',1,'2020-02-19 09:53:12','2020-03-04 14:24:10'),(2574,10,1581673824237,6803,'New task',NULL,NULL,'Data Completeness - test','Actions',1,'2020-02-19 09:53:12','2020-03-04 14:24:10'),(2575,10,1576254226246,6803,'RCA',NULL,NULL,'Data Completeness - test','Actions',1,'2020-02-19 09:53:12','2020-03-04 14:24:10'),(2576,10,1576254226247,6803,'Solution',NULL,NULL,'Data Completeness - test','Actions',1,'2020-02-19 09:53:12','2020-03-04 14:24:10'),(2577,2,1576268016880,118,'Prioritize Cost Control Levers',NULL,NULL,'Address Increasing Annual Costs','Actions',1,'2020-02-19 09:53:12','2020-02-19 09:53:12'),(2578,2,1576268016875,118,'Discover Opportunities',NULL,NULL,'Address Increasing Annual Costs','Actions',1,'2020-02-19 09:53:12','2020-02-19 09:53:12'),(2579,2,1576268016881,118,'Deployment Plan',NULL,NULL,'Address Increasing Annual Costs','Actions',1,'2020-02-19 09:53:12','2020-02-19 09:53:12'),(2580,2,1579599364918,118,'new takk',NULL,NULL,'Address Increasing Annual Costs','Actions',1,'2020-02-19 09:53:12','2020-02-19 09:53:12'),(2581,2,1580211788182,6797,'t2.1',NULL,NULL,'Automation 1 assessment','Actions',1,'2020-02-19 09:53:12','2020-03-03 09:26:23'),(2582,2,1579518896184,6797,'t3',NULL,NULL,'Automation 1 assessment','Actions',1,'2020-02-19 09:53:12','2020-03-03 09:26:23'),(2583,2,1579518578408,6797,'Review maintenance schedules',NULL,NULL,'Automation 1 assessment','Actions',1,'2020-02-19 09:53:12','2020-03-03 09:26:23'),(2584,2,1579516158513,6797,'t1',NULL,NULL,'Automation 1 assessment','Actions',1,'2020-02-19 09:53:12','2020-03-03 09:26:23'),(2585,1,1579513870285,111,'New task test5',NULL,NULL,'Increase Plant Availability','Actions',1,'2020-02-19 09:53:12','2020-02-19 09:53:12'),(2586,1,1579513870294,111,'New task feb',NULL,NULL,'Increase Plant Availability','Actions',1,'2020-02-19 09:53:12','2020-02-19 09:53:12'),(2587,1,1579513870295,111,'New task march ren',NULL,NULL,'Increase Plant Availability','Actions',1,'2020-02-19 09:53:12','2020-02-19 09:53:12'),(2588,1,1579663203152,37,'Dev',NULL,NULL,'RFID tagging of inventory','Actions',1,'2020-02-19 09:53:12','2020-02-19 09:53:12'),(2589,1,1579762039733,20,'New task',NULL,NULL,'Increase Plant Availability','Actions',1,'2020-02-19 09:53:12','2020-02-19 09:53:12'),(2590,1,1579784977967,29,'New taskNew taskNew taskNew taskNew taskNew taskNew taskNew taskNew taskNew taskNew task',NULL,NULL,'Logistics - Northwest','Actions',1,'2020-02-19 09:53:12','2020-03-03 09:24:05'),(2591,1,1580293473748,6807,'QuidProtesk',NULL,NULL,'Total inventory cost, count optimized with the demand	10235646','Actions',1,'2020-02-19 09:53:12','2020-02-19 09:53:12'),(2592,9,1580379697732,116,'Scrum Meeting',NULL,NULL,'Improve Regular Maintenance','Actions',1,'2020-02-19 09:53:12','2020-02-19 09:53:12'),(2593,9,1580380249829,6793,'2 expanded test task for Dummy',NULL,NULL,'Automation assessment','Actions',1,'2020-02-19 09:53:12','2020-02-19 09:53:12'),(2594,9,1580380249820,6793,'Test action for dummy company',NULL,NULL,'Automation assessment','Actions',1,'2020-02-19 09:53:12','2020-02-19 09:53:12'),(2595,9,1580380249830,6793,'Meeting on dummy comp',NULL,NULL,'Automation assessment','Actions',1,'2020-02-19 09:53:12','2020-02-19 09:53:12'),(2599,9,1581332259187,140,'New task Test 3',NULL,NULL,'Increase levels of testing','Actions',1,'2020-02-19 09:53:12','2020-02-19 09:53:12'),(2600,9,1581492358246,6836,'ran22newupdate',NULL,NULL,'testProject for dummy comp','Actions',1,'2020-02-19 09:53:12','2020-02-19 09:53:12'),(2609,9,0,467,'1232354123213213123','',NULL,'Automation assessment','Kpis',0,'2020-02-19 10:28:04','2020-02-19 12:35:35'),(2662,9,0,133,'','',NULL,NULL,'Mindmaps',0,'2020-02-19 12:36:07','2020-02-19 12:36:18'),(2673,4,0,134,'dffsdf','',NULL,NULL,'Mindmaps',1,'2020-02-19 13:16:49','2020-02-19 13:16:49'),(2700,1,0,135,'Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test ','Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Descr Des',NULL,NULL,'Mindmaps',0,'2020-02-20 07:37:55','2020-02-25 11:18:31'),(2711,1,0,468,'testkpi','',NULL,'Category Setup ','Kpis',0,'2020-02-20 10:28:55','2020-03-04 02:39:00'),(2712,1,0,469,'KPI14','',NULL,NULL,'Kpis',0,'2020-02-20 11:13:36','2020-03-19 00:21:11'),(2715,1,0,475,'KPI ','',NULL,'Plant closing','Kpis',0,'2020-02-20 12:02:43','2020-02-20 12:02:47'),(2721,1,0,476,'KPI2','',NULL,'Automation assessment','Kpis',0,'2020-02-20 12:08:11','2020-03-19 00:21:12'),(2722,1,0,477,'KPI3','',NULL,NULL,'Kpis',0,'2020-02-20 12:08:28','2020-03-19 00:21:14'),(2723,1,0,478,'KPI3.5','',NULL,NULL,'Kpis',0,'2020-02-20 12:09:27','2020-03-19 00:21:15'),(2727,1,0,479,'KPI','',NULL,'Increase Plant Availability','Kpis',0,'2020-02-20 12:22:29','2020-03-19 00:21:56'),(2728,1,0,480,'KPI2','',NULL,NULL,'Kpis',0,'2020-02-20 12:22:49','2020-03-19 00:21:13'),(2771,10,0,237,'User, Test','test1@apuc-test.io',NULL,'','Persons',0,'2020-02-21 12:15:21','2020-03-17 09:45:03'),(2775,10,0,481,'TestKpiFirstTime','TestKpiFirstTime',NULL,NULL,'Kpis',0,'2020-02-21 12:21:39','2020-02-21 13:34:10'),(2776,10,0,482,'TestKpiSecondTime','TestKpiSecondTime',NULL,NULL,'Kpis',0,'2020-02-21 12:22:10','2020-02-21 19:23:17'),(2777,10,0,483,'TestKpiThirdTime','TestKpiThirdTime',NULL,NULL,'Kpis',0,'2020-02-21 12:22:26','2020-02-21 19:23:18'),(2778,10,0,484,'TestKpiForProject1','',NULL,'Asset Performance Management - Darwin','Kpis',0,'2020-02-21 12:22:55','2020-02-21 13:34:14'),(2779,10,0,485,'TestKpiForProject2','',NULL,NULL,'Kpis',0,'2020-02-21 12:23:03','2020-02-21 13:34:18'),(2790,10,0,486,'test','test',NULL,NULL,'Kpis',0,'2020-02-21 19:22:32','2020-02-21 19:22:50'),(2838,10,1582609690046,6805,'Testing Task',NULL,NULL,'Data Quality Assessment','Actions',0,'2020-02-25 05:48:47','2020-03-17 10:54:35'),(2927,9,0,487,NULL,NULL,NULL,'Asset Performance Management - Darwin','Kpis',1,'2020-02-26 13:03:41','2020-02-26 13:03:41'),(2928,1,0,488,NULL,NULL,NULL,'Asset Performance Management - Darwin','Kpis',1,'2020-02-26 13:03:41','2020-02-26 13:03:41'),(2929,1,0,489,'testkpi','',NULL,'Asset Performance Management - Darwin','Kpis',0,'2020-02-26 13:16:32','2020-03-04 12:40:58'),(2930,10,0,490,'Data Quality','Representing the quality of the data based on accuracy, resolution, timeliness, integrity and trace ability ',NULL,'Category Setup ','Kpis',0,'2020-02-26 13:18:35','2020-04-07 15:20:44'),(2933,1,1582805353027,121,'New task normal 1',NULL,NULL,'Sales Engagement Improvement','Actions',1,'2020-02-27 12:09:41','2020-02-27 12:09:41'),(2935,3,1582861245246,28,'New task',NULL,NULL,'Lean operations','Actions',1,'2020-02-28 03:42:27','2020-02-28 03:42:27'),(2942,10,1582861245265,6802,'This is the testing task',NULL,NULL,'Category Setup ','Actions',1,'2020-02-28 03:43:26','2020-05-04 23:37:02'),(2973,2,1583003805709,6797,'Data review',NULL,NULL,'Automation 1 assessment','Actions',1,'2020-02-29 19:25:54','2020-03-03 09:26:23'),(3014,9,0,238,'Ayman, Riyasat','riyasatahmed111@gmail.com',NULL,'','Persons',0,'2020-03-01 23:43:47','2020-03-01 23:43:47'),(3023,2,0,6838,'Test 3-1-20','Testing project create','Quick summary is here','Test 3-1-20','Projects',1,'2020-03-02 00:37:54','2020-03-02 00:37:54'),(3036,2,1583110945785,6797,'Inventory reviews',NULL,NULL,'Automation 1 assessment','Actions',1,'2020-03-02 01:04:36','2020-03-03 09:26:23'),(3134,1,0,491,'testkpi','',NULL,'Category Setup ','Kpis',0,'2020-03-03 09:57:31','2020-03-04 02:39:15'),(3140,10,0,239,'Liu, Jerry','jerry.liu@algonquinpower.com',NULL,'','Persons',0,'2020-03-04 02:16:28','2020-03-17 09:47:05'),(3157,10,0,6839,'New project test','New project test','New project test','New project test','Projects',0,'2020-03-04 06:31:54','2020-03-04 11:17:46'),(3158,10,0,492,'Availability on Time','Data is available at the right time for processing and decision making',NULL,'New project test','Kpis',0,'2020-03-04 06:33:45','2020-03-04 10:04:01'),(3189,10,0,6840,'Test project',NULL,NULL,'null','Projects',0,'2020-03-04 08:50:49','2020-04-18 09:20:57'),(3193,10,0,493,'TestKpi04022020','',NULL,NULL,'Kpis',0,'2020-03-04 08:54:35','2020-03-06 04:47:22'),(3199,55,0,240,'Jot, Prabh Kbihm','prabhjot.kbihm@kbihm.com',NULL,'','Persons',0,'2020-03-04 09:31:17','2020-04-25 14:31:00'),(3201,55,0,241,'KBIHM, Prabhjot','prabhjot.kbihm@gmail.com',NULL,'','Persons',0,'2020-03-04 09:31:52','2020-04-25 14:30:57'),(3205,55,0,6841,'Test React Project','Summary','Summary','Test React Project','Projects',1,'2020-03-04 09:34:13','2020-03-04 09:34:50'),(3212,55,0,494,'Test','',NULL,'Test React Project','Kpis',0,'2020-03-04 09:35:36','2020-03-04 09:59:41'),(3213,55,0,6842,'TEst Vue project','','','TEst Vue project','Projects',0,'2020-03-04 09:38:29','2020-03-16 23:18:13'),(3214,55,0,495,'TestKpiAddedFromProject','',NULL,'Test React Project','Kpis',0,'2020-03-04 09:43:21','2020-03-04 09:50:44'),(3215,55,0,496,'TestKpiAddedFromOrg','',NULL,NULL,'Kpis',0,'2020-03-04 09:43:57','2020-03-04 10:00:56'),(3216,55,0,497,'TestKpiAddedFromOrg','',NULL,'Test React Project','Kpis',0,'2020-03-04 09:44:46','2020-03-04 09:59:59'),(3218,55,0,498,'KPI ADDED FROM ORG','',NULL,NULL,'Kpis',0,'2020-03-04 09:57:29','2020-03-04 10:00:54'),(3221,55,0,499,'KPIADDEDFRMproject','',NULL,'Test React Project','Kpis',0,'2020-03-04 10:00:44','2020-03-04 10:01:32'),(3224,55,0,500,'KPI Added From ORG','',NULL,NULL,'Kpis',0,'2020-03-04 10:01:11','2020-03-04 10:02:07'),(3227,55,0,501,'sadsadsad','',NULL,'Test React Project','Kpis',0,'2020-03-04 10:02:23','2020-03-04 10:02:31'),(3230,10,0,502,'New test KPI','New test KPI',NULL,'New project test','Kpis',0,'2020-03-04 10:26:41','2020-03-04 16:47:37'),(3231,10,0,503,'Availability on Time','Data is available at the right time for processing and decision making',NULL,'New project test','Kpis',0,'2020-03-04 10:28:29','2020-03-19 00:19:52'),(3235,55,0,6843,'TestProjectnew','sadsad','sadsad','TestProjectnew','Projects',0,'2020-03-04 11:00:44','2020-03-16 23:18:05'),(3236,10,0,6844,'Test','','','Test','Projects',0,'2020-03-04 11:17:14','2020-03-14 02:26:51'),(3250,10,0,504,'testkpiaddedfromprojectdetailpagefortestprojectofAPUC','testkpiaddedfromprojectdetailpagefortestprojectofAPUC',NULL,'Test','Kpis',0,'2020-03-04 12:34:08','2020-03-04 12:39:04'),(3251,10,0,505,'test2','',NULL,'Test','Kpis',0,'2020-03-04 12:38:22','2020-03-04 13:09:01'),(3254,10,0,506,'KPI4APUCADD4mORG','KPI4APUCADD4mORG',NULL,NULL,'Kpis',0,'2020-03-04 12:42:36','2020-03-04 13:05:28'),(3255,10,0,507,'KPI4APUCADD4mORG','KPI4APUCADD4mORG',NULL,'Test','Kpis',0,'2020-03-04 13:01:18','2020-03-04 13:05:30'),(3256,10,0,508,'KPI4APUCADD4mORG','KPI4APUCADD4mORG',NULL,'Category Setup ','Kpis',0,'2020-03-04 13:02:35','2020-03-04 13:03:08'),(3257,10,0,509,'KPI4APUCADD4mORG','KPI4APUCADD4mORG',NULL,'Category Setup ','Kpis',0,'2020-03-04 13:02:46','2020-03-04 13:03:10'),(3262,10,0,510,'KPI4APUCADD4mORG-1','',NULL,'Test','Kpis',0,'2020-03-04 13:06:25','2020-03-04 13:08:26'),(3263,10,0,6845,'test2','','','test2','Projects',0,'2020-03-04 13:06:56','2020-03-14 02:27:03'),(3264,10,0,511,'KPI4APUCADD4mORG-1','',NULL,'test2','Kpis',0,'2020-03-04 13:07:23','2020-03-04 13:13:12'),(3269,10,0,512,'teston','',NULL,'Test','Kpis',0,'2020-03-04 13:16:33','2020-03-04 13:16:48'),(3272,10,0,513,'safsaf','',NULL,NULL,'Kpis',0,'2020-03-04 13:17:08','2020-03-04 16:47:00'),(3273,10,0,514,'sdfsdf222','',NULL,'Test','Kpis',0,'2020-03-04 13:17:22','2020-03-04 13:17:54'),(3274,10,0,515,'ghjfg','',NULL,'Test','Kpis',0,'2020-03-04 13:17:32','2020-03-04 13:23:12'),(3277,10,0,516,'fsdfsdf','',NULL,'Test','Kpis',0,'2020-03-04 13:22:46','2020-03-04 16:47:22'),(3291,10,0,136,'Major Component Failure - 1','Current State and Opportunities for Improvement',NULL,NULL,'Mindmaps',1,'2020-03-04 15:19:42','2020-03-04 15:39:09'),(3295,10,0,137,'RTS from Major Component Failure','Contributing factors and opportunities for improvement',NULL,NULL,'Mindmaps',1,'2020-03-04 15:52:29','2020-03-04 15:52:29'),(3364,10,0,517,'Time to RTS','To capture the time taken to bring the Turbine back to service',NULL,NULL,'Kpis',0,'2020-03-04 17:20:09','2020-04-07 15:29:53'),(3369,10,1583373747457,6844,'New task',NULL,NULL,'Test','Actions',1,'2020-03-05 02:03:55','2020-03-05 02:04:23'),(3372,10,0,6846,'New test project - march 05-03','New test summary - march 05-03','New test summary - march 05-03','New test project - march 05-03','Projects',0,'2020-03-05 02:13:47','2020-03-14 02:26:11'),(3373,10,0,6847,'New test project - march 05-03','New test summary - march 05-03','New test summary - march 05-03','New test project - march 05-03','Projects',0,'2020-03-05 02:13:53','2020-03-14 02:26:06'),(3374,10,0,518,'Data Quality','Representing the quality of the data based on accuracy, resolution, timeliness, integrity and trace ability ',NULL,'Data Completeness - test','Kpis',0,'2020-03-05 02:15:48','2020-03-19 00:20:01'),(3377,10,1583384035918,6846,'Database structure',NULL,NULL,'New test project - march 05-03','Actions',1,'2020-03-05 05:37:25','2020-03-06 12:53:08'),(3379,55,0,6848,'Asset Performance Management - Darwin','','','Test new project 244','Projects',1,'2020-03-05 09:14:43','2020-04-25 14:22:20'),(3380,55,0,519,'KPI for 244','',NULL,'Test new project 244','Kpis',0,'2020-03-05 09:15:23','2020-03-19 00:22:15'),(3381,55,0,520,'KPI 4 244','',NULL,'Asset Performance Management - Darwin','Kpis',0,'2020-03-05 09:15:55','2020-04-25 14:22:27'),(3382,55,0,521,'test222','',NULL,'Test new project 244','Kpis',0,'2020-03-05 09:16:39','2020-03-05 09:16:51'),(3384,1,0,522,'Reduce operating costs 2','Effort to increase the availability of all plants.',NULL,'TestProjectnew','Kpis',1,'2020-03-05 09:17:45','2020-03-05 11:03:49'),(3386,55,0,523,'sadsad','',NULL,'TestProjectnew','Kpis',0,'2020-03-05 09:18:40','2020-03-19 00:22:17'),(3387,55,1583399940389,6843,'New task',NULL,NULL,'TestProjectnew','Actions',1,'2020-03-05 09:19:21','2020-03-05 10:24:05'),(3390,10,1583401918683,6846,'Mockup Build',NULL,NULL,'New test project - march 05-03','Actions',1,'2020-03-05 09:52:32','2020-03-06 12:53:08'),(3392,55,1583402478387,6843,'New tasksdasad',NULL,NULL,'TestProjectnew','Actions',1,'2020-03-05 10:01:39','2020-03-05 10:24:05'),(3397,55,1583403324329,6843,'New task',NULL,NULL,'TestProjectnew','Actions',1,'2020-03-05 10:15:41','2020-03-05 10:24:05'),(3407,55,1583403828708,6843,'sdafsafdsad',NULL,NULL,'TestProjectnew','Actions',1,'2020-03-05 10:24:05','2020-03-05 10:24:05'),(3413,10,0,524,'Data cost','',NULL,'Data Quality Assessment','Kpis',0,'2020-03-05 10:41:57','2020-03-06 04:48:01'),(3414,10,0,525,'Renewal','',NULL,NULL,'Kpis',0,'2020-03-05 10:42:15','2020-03-19 00:19:31'),(3417,10,0,526,'Renewal cost','',NULL,'New test project - march 05-03','Kpis',0,'2020-03-05 10:44:04','2020-03-05 11:09:39'),(3419,10,0,527,'Manufacturing process','',NULL,'test2','Kpis',0,'2020-03-05 10:44:35','2020-03-06 04:47:35'),(3421,10,1583404895739,6845,'New task 3',NULL,NULL,'test2','Actions',1,'2020-03-05 10:45:41','2020-03-05 10:45:41'),(3422,1,0,528,'Reduce operating costs 3','Effort to increase the availability of all plants.',NULL,'New test project - march 05-03','Kpis',0,'2020-03-05 10:54:47','2020-03-05 11:09:44'),(3425,10,0,529,'Data cost','',NULL,'New test project - march 05-03','Kpis',0,'2020-03-05 10:58:26','2020-03-05 11:09:46'),(3426,1,0,530,'Reduce operating costs 4','Effort to increase the availability of all plants.',NULL,'New test project - march 05-03','Kpis',0,'2020-03-05 11:01:36','2020-03-05 11:09:42'),(3431,1,0,531,'Reduce operating costs frm  1','Effort to increase the availability of all plants.',NULL,'New test project - march 05-03','Kpis',0,'2020-03-05 11:06:36','2020-03-05 11:09:41'),(3432,1,0,532,'Reduce operating costs frm  1','Effort to increase the availability of all plants.',NULL,'New test project - march 05-03','Kpis',0,'2020-03-05 11:08:31','2020-03-05 11:09:32'),(3439,1,0,533,'Reduce operating costs 2','Effort to increase the availability of all plants.',NULL,NULL,'Kpis',0,'2020-03-05 11:11:16','2020-03-19 00:19:35'),(3443,10,0,537,'Reduce operating costs 2','Effort to increase the availability of all plants.',NULL,NULL,'Kpis',0,'2020-03-05 11:35:31','2020-03-19 00:19:34'),(3444,10,0,538,'Inventory Reduction','Reduce inventory in all warehouses',NULL,'New test project - march 05-03','Kpis',0,'2020-03-05 11:36:40','2020-03-19 00:19:43'),(3446,10,0,539,'KPITitleQuidPro','KPIDescriptionQuidPro',NULL,NULL,'Kpis',0,'2020-03-05 11:45:48','2020-03-17 11:04:36'),(3448,10,0,540,'KPITitleQuidPro','KPIDescriptionQuidPro',NULL,NULL,'Kpis',0,'2020-03-05 11:50:51','2020-03-17 11:04:38'),(3450,10,0,541,'KPITitleQuidProValv','KPIDescriptionQuidPro',NULL,'New test project - march 05-03','Kpis',0,'2020-03-05 11:51:45','2020-03-06 04:47:41'),(3453,10,1583409773408,6846,'Testing',NULL,NULL,'New test project - march 05-03','Actions',1,'2020-03-05 12:04:14','2020-03-06 12:53:08'),(3456,10,1583414590888,6846,'Approval of DB',NULL,NULL,'New test project - march 05-03','Actions',1,'2020-03-05 13:24:51','2020-03-06 12:53:08'),(3480,10,0,242,'Ahmed, Alauddin','ahmed.alauddin@gmail.com',NULL,'','Persons',0,'2020-03-06 01:51:13','2020-03-17 09:47:36'),(3484,10,0,6849,'Project Management Methodology','Systems and process in preparation for doubling the operational portfolio. Project management processes to ensure that projects can be consistently delivered on time and on budget.','Systems and process in preparation for doubling the operational portfolio. Project management processes to ensure that projects can be consistently delivered on time and on budget.','Project Management Methodology','Projects',1,'2020-03-06 01:56:16','2020-03-13 04:06:14'),(3485,10,0,243,'James, McRobie','james.mcrobie@algonquinpower.com',NULL,'','Persons',1,'2020-03-06 01:57:40','2020-03-19 06:50:55'),(3512,10,0,6850,'Major Component Time to RTS ',NULL,NULL,'time to RTS Project Test','Projects',0,'2020-03-06 02:37:34','2020-03-20 14:53:41'),(3513,10,0,542,'Executive meetings','St. predoic meetings',NULL,NULL,'Kpis',0,'2020-03-06 02:49:05','2020-03-19 00:20:07'),(3514,10,0,6851,'Executive relation',NULL,NULL,'Executive reltion','Projects',0,'2020-03-06 02:49:54','2020-03-14 02:25:44'),(3517,10,1583468741463,6851,'First task 123456',NULL,NULL,'Executive reltion','Actions',1,'2020-03-06 04:25:55','2020-03-06 06:19:18'),(3521,10,1583459340104,6849,'Gap Analysis',NULL,NULL,'Project Management Methodology','Actions',1,'2020-03-06 04:38:38','2020-04-18 12:00:56'),(3523,10,1583469520436,6849,'Stakeholder Management',NULL,NULL,'Project Management Methodology','Actions',1,'2020-03-06 04:46:11','2020-04-18 12:00:56'),(3524,10,1583469520437,6849,'Template Creation',NULL,NULL,'Project Management Methodology','Actions',1,'2020-03-06 04:46:11','2020-04-18 12:00:56'),(3525,10,1583469520438,6849,'Deployment Plan',NULL,NULL,'Project Management Methodology','Actions',1,'2020-03-06 04:46:11','2020-04-18 12:00:56'),(3532,10,0,543,'fdfdgfdg','fdfdgfdgfdg',NULL,NULL,'Kpis',0,'2020-03-06 07:21:44','2020-03-17 11:03:14'),(3538,10,1583490165257,6846,'Development',NULL,NULL,'New test project - march 05-03','Actions',1,'2020-03-06 10:25:33','2020-03-06 12:53:08'),(3539,10,1583490165258,6846,'SEO',NULL,NULL,'New test project - march 05-03','Actions',1,'2020-03-06 10:25:33','2020-03-06 12:53:08'),(3540,10,1583490165259,6846,'Permotion',NULL,NULL,'New test project - march 05-03','Actions',1,'2020-03-06 10:25:33','2020-03-06 12:53:08'),(3548,10,1583490165260,6846,'Go Live',NULL,NULL,'New test project - march 05-03','Actions',1,'2020-03-06 10:25:59','2020-03-06 12:53:08'),(3557,10,1583490363520,6846,'First Milestone fo Dubai',NULL,NULL,'New test project - march 05-03','Actions',1,'2020-03-06 10:26:42','2020-03-06 12:53:08'),(3576,10,1583490660946,6846,'New task',NULL,NULL,'New test project - march 05-03','Actions',1,'2020-03-06 10:31:27','2020-03-06 12:53:08'),(3582,10,0,544,'KPI for Waiting time for Approvals','KPI Waiting time for Approvals',NULL,NULL,'Kpis',0,'2020-03-06 11:28:04','2020-03-19 00:19:25'),(3628,10,0,244,'Angada, Aishwarya','aishwarya.angada@value-infinity.com',NULL,'','Persons',1,'2020-03-06 19:23:26','2020-03-06 19:23:54'),(3636,10,1583522740901,6849,'Identify Gap Areas',NULL,NULL,'Project Management Methodology','Actions',1,'2020-03-06 19:54:27','2020-04-18 12:00:56'),(3637,10,1583522740902,6849,'Prioritize Opportunities for Improvements',NULL,NULL,'Project Management Methodology','Actions',1,'2020-03-06 19:54:27','2020-04-18 12:00:56'),(3638,10,1583522740903,6849,'Define the desired state - structure, process, tech.',NULL,NULL,'Project Management Methodology','Actions',1,'2020-03-06 19:54:27','2020-04-18 12:00:56'),(3642,10,1583522740904,6849,'Phased Deployment',NULL,NULL,'Project Management Methodology','Actions',1,'2020-03-06 19:54:27','2020-04-18 12:00:56'),(3649,10,0,6852,'New Project 07032020','This is the sample summary','This is the sample summary','New Project 07032020','Projects',0,'2020-03-07 15:28:02','2020-03-14 02:26:32'),(3651,10,0,545,'Inventory Reduction','Reduce inventory in all warehouses',NULL,'New Project 07032020','Kpis',0,'2020-03-07 15:36:10','2020-03-19 00:19:44'),(3652,10,1583595759875,6852,'This 1 task',NULL,NULL,'New Project 07032020','Actions',1,'2020-03-07 15:44:23','2020-03-07 15:44:23'),(3653,10,1583595759884,6852,'This is 2nd',NULL,NULL,'New Project 07032020','Actions',1,'2020-03-07 15:44:23','2020-03-07 15:44:23'),(3654,10,1583595759885,6852,'This is third',NULL,NULL,'New Project 07032020','Actions',1,'2020-03-07 15:44:23','2020-03-07 15:44:23'),(3659,10,0,6853,'hgyh','','','hgyh','Projects',0,'2020-03-09 04:57:49','2020-03-14 02:25:36'),(3661,10,0,6854,'test','','','test','Projects',0,'2020-03-09 05:18:09','2020-03-14 02:26:45'),(3662,10,0,6855,'test2','','','test2','Projects',0,'2020-03-09 05:18:43','2020-03-14 02:27:09'),(3713,10,1584064747845,6849,'Stakeholder Identification',NULL,NULL,'Project Management Methodology','Actions',1,'2020-03-13 02:19:48','2020-04-18 12:00:56'),(3714,10,1584064747846,6849,'Comm. Plan',NULL,NULL,'Project Management Methodology','Actions',1,'2020-03-13 02:19:48','2020-04-18 12:00:56'),(3715,10,1584064747847,6849,'Stakeholder Communication',NULL,NULL,'Project Management Methodology','Actions',1,'2020-03-13 02:19:48','2020-04-18 12:00:56'),(3769,10,1584245961536,6849,'Create Template',NULL,NULL,'Project Management Methodology','Actions',1,'2020-03-15 04:27:01','2020-04-18 12:00:56'),(3770,10,1584245961545,6849,'Review and Feedback',NULL,NULL,'Project Management Methodology','Actions',1,'2020-03-15 04:27:01','2020-04-18 12:00:56'),(3771,10,1584245961546,6849,'Document and Review',NULL,NULL,'Project Management Methodology','Actions',1,'2020-03-15 04:27:01','2020-04-18 12:00:56'),(3880,10,0,546,'Test17032020','',NULL,NULL,'Kpis',0,'2020-03-17 10:57:47','2020-03-17 11:04:30'),(3882,10,0,547,'Test2-17032020','',NULL,NULL,'Kpis',0,'2020-03-17 10:58:25','2020-03-17 11:04:31'),(3885,10,0,548,'Test3-17032020','',NULL,'Project Management Methodology','Kpis',0,'2020-03-17 11:03:35','2020-03-17 11:03:47'),(3887,10,0,549,'Test4-20201703','',NULL,NULL,'Kpis',0,'2020-03-17 11:04:08','2020-03-17 11:04:29'),(3904,10,0,550,'test KPI 17032020 1','',NULL,'Project Management Methodology','Kpis',0,'2020-03-17 12:25:42','2020-03-17 12:26:14'),(3906,10,0,551,'test KPI 17032020 2','',NULL,NULL,'Kpis',0,'2020-03-17 12:26:30','2020-03-17 12:27:16'),(3913,10,0,245,'harrop, rick','rick.harrop@apuc-test.io',NULL,'','Persons',0,'2020-03-17 12:55:35','2020-04-25 17:56:30'),(3935,10,0,246,'Sandhu, Vijay','vijay.k@kbihm.com',NULL,'','Persons',0,'2020-03-18 10:33:54','2020-03-18 10:33:54'),(3996,10,0,247,'sandhu, vijay','vijay.sandhu25@gmail.com',NULL,'','Persons',0,'2020-03-19 02:14:04','2020-03-19 02:14:04'),(4022,10,0,6856,'Major Component RTS','Made good progress in process design and cross functional alignment. Key will be document the expectation from individual roles and ensure robust decision in a timely manner.','Made good progress in process design and cross functional alignment. Key will be document the expectation from individual roles and ensure robust decision in a timely manner.','Major Component RTS','Projects',1,'2020-03-20 23:32:44','2020-03-26 18:58:19'),(4023,10,0,552,'Time to RTS','To capture the time taken to bring the Turbine back to service',NULL,'Major Component RTS','Kpis',0,'2020-03-20 23:33:04','2020-04-08 23:59:29'),(4026,10,1584745874241,6856,'Identify the Major Components',NULL,NULL,'Major Component RTS','Actions',1,'2020-03-20 23:44:59','2020-04-23 19:01:48'),(4032,10,1584745874278,6856,'Define High Level Process Map',NULL,NULL,'Major Component RTS','Actions',1,'2020-03-21 00:35:43','2020-04-23 19:01:48'),(4033,10,1584745874279,6856,'Identify Process Issues',NULL,NULL,'Major Component RTS','Actions',1,'2020-03-21 00:35:43','2020-04-23 19:01:48'),(4099,10,1585166181131,6856,'Document the Process',NULL,NULL,'Major Component RTS','Actions',1,'2020-03-25 20:17:19','2020-04-23 19:01:48'),(4104,10,1585166181132,6856,'Define Target Values for RTS',NULL,NULL,'Major Component RTS','Actions',1,'2020-03-25 20:26:52','2020-04-23 19:01:48'),(4105,10,1585166181133,6856,'Share and Align with Suppliers - OEM / ISP',NULL,NULL,'Major Component RTS','Actions',1,'2020-03-25 20:26:52','2020-04-23 19:01:48'),(4147,1,0,248,'Angada, Aishwarya','aishwarya.angadi@value-infinity.com',NULL,'','Persons',1,'2020-03-28 18:03:46','2020-03-28 18:04:05'),(4194,10,0,553,'Data Availability_new','Percentage of data available for the particular purpose of reporting, analysis or modeling',NULL,NULL,'Kpis',0,'2020-04-03 08:28:17','2020-04-07 15:04:25'),(4196,10,0,554,'Data Availability_project','Percentage of data available for the particular purpose of reporting, analysis or modeling',NULL,'Project Management Methodology','Kpis',0,'2020-04-03 11:57:14','2020-04-07 15:19:34'),(4229,10,0,555,'Time to RTS','To capture the time taken to bring the Turbine back to service',NULL,'Project Management Methodology','Kpis',0,'2020-04-06 08:56:53','2020-04-07 15:30:14'),(4249,10,0,249,'Zafar, Waleed','waleed.zafar@algonquinpower.com',NULL,'','Persons',0,'2020-04-08 17:34:06','2020-04-08 17:34:06'),(4252,10,0,558,'Data Availability','Percentage of data available for the particular purpose of reporting, analysis or modeling.',NULL,NULL,'Kpis',1,'2020-04-08 23:48:53','2020-04-08 23:48:53'),(4253,10,0,560,'Data Quality','Representing the quality of the data based on accuracy, resolution, timeliness, integrity and trace ability ',NULL,NULL,'Kpis',1,'2020-04-08 23:50:24','2020-04-08 23:50:24'),(4255,10,0,561,'Qualified Opportunities','Number of opportunities identified by APM discovery process that were assessed and qualified to move forward.',NULL,'null','Kpis',1,'2020-04-08 23:55:23','2020-04-11 08:44:32'),(4256,10,0,562,'Time to RTS','To capture the time taken to bring the Turbine back to service',NULL,NULL,'Kpis',1,'2020-04-08 23:56:29','2020-04-08 23:56:29'),(4265,10,0,563,'nmchgcf','aSFDWF',NULL,'Project Management Methodology','Kpis',0,'2020-04-09 03:49:07','2020-04-09 03:49:44'),(4286,10,0,6857,'null',NULL,NULL,'null','Projects',0,'2020-04-11 08:44:32','2020-04-13 20:56:37'),(4313,10,0,250,'Sandhu, Vijay','vsandhu@softelevation.com',NULL,'','Persons',0,'2020-04-13 16:50:07','2020-04-13 16:51:33'),(4336,10,1586883534968,6856,'New task',NULL,NULL,'Major Component RTS','Actions',1,'2020-04-14 17:16:35','2020-04-23 19:01:48'),(4485,10,0,566,'NEW KPI','NEW DEC',NULL,NULL,'Kpis',0,'2020-04-17 08:03:22','2020-04-18 09:10:46'),(4586,10,0,567,'new KPI for projecy','sdasdasd',NULL,'Project Management Methodology','Kpis',0,'2020-04-18 16:32:45','2020-04-18 18:21:56'),(4605,10,0,6858,'On going APM Activities','','','On going Activities','Projects',1,'2020-04-21 21:57:10','2020-04-21 22:12:53'),(4606,10,1587506232012,6858,'Solar production Theoretical cal. - Cornwall',NULL,NULL,'On going APM Activities','Actions',1,'2020-04-21 22:01:13','2020-04-22 23:34:08'),(4610,10,1587506232015,6858,'MB analysis @ SL & RL',NULL,NULL,'On going APM Activities','Actions',1,'2020-04-21 22:02:39','2020-04-22 23:34:08'),(4616,10,1587506232028,6858,'Algonquin Category Deployment',NULL,NULL,'On going APM Activities','Actions',1,'2020-04-21 22:14:25','2020-04-22 23:34:08'),(4630,10,0,568,'Stakeholder Management','desc',NULL,NULL,'Kpis',0,'2020-04-22 18:10:20','2020-04-22 18:11:30'),(4639,10,1587598128347,6858,'Custom alarm @ Amherst based on Set point',NULL,NULL,'On going APM Activities','Actions',1,'2020-04-22 23:31:18','2020-04-22 23:34:08'),(4644,10,1587598128348,6858,'Graph widgets',NULL,NULL,'On going APM Activities','Actions',1,'2020-04-22 23:32:39','2020-04-22 23:34:08'),(4673,10,0,569,'Stakeholder Management1','dsddf',NULL,NULL,'Kpis',0,'2020-04-23 18:52:00','2020-04-23 18:53:12'),(4685,55,0,251,'Sandhu, Vijay','vsandhu@softelevation.com',NULL,'','Persons',1,'2020-04-24 05:25:03','2020-04-25 14:53:28'),(4687,55,0,252,'sandhu, vijay','sandhuvijay1985@gmail.com',NULL,'','Persons',1,'2020-04-24 05:28:46','2020-04-24 05:31:00'),(4705,55,0,570,'Data Availability','Percentage of data available for the particular purpose of reporting, analysis or modeling',NULL,NULL,'Kpis',1,'2020-04-25 14:24:49','2020-04-25 14:24:49'),(4707,55,1587824335325,6848,'Asset Performance Monitoring',NULL,NULL,'Asset Performance Management - Darwin','Actions',1,'2020-04-25 14:27:35','2020-05-05 14:49:24'),(4724,55,1587824335400,6848,'24/7 Control Room Monitoring',NULL,NULL,'Asset Performance Management - Darwin','Actions',1,'2020-04-25 18:07:36','2020-05-05 14:49:24'),(4731,55,0,138,'My Map','Test Map',NULL,NULL,'Mindmaps',1,'2020-04-27 11:20:40','2020-04-30 02:20:06'),(4769,1,0,6859,'ValueInfinity Internal Project Tasks','','','ValueInfinity Internal Project Tasks','Projects',1,'2020-04-29 21:29:28','2020-04-29 21:31:55'),(4770,1,1588195771440,6859,'P1 to P5 Deployment Strategy',NULL,NULL,'ValueInfinity Internal Project Tasks','Actions',1,'2020-04-29 21:31:24','2020-05-04 16:29:12'),(4775,1,0,253,'Dhuru, Shreyas','shreyas.dhuru@value-infinity.com',NULL,'','Persons',1,'2020-04-29 22:08:21','2020-04-29 22:14:37'),(4777,1,1588195936897,6859,'Thermal KPI',NULL,NULL,'ValueInfinity Internal Project Tasks','Actions',1,'2020-04-29 22:12:39','2020-05-04 16:29:12'),(4806,55,0,139,'t','',NULL,NULL,'Mindmaps',1,'2020-04-30 02:21:08','2020-04-30 02:21:08'),(4827,1,1588366699051,6859,'PM Methodology',NULL,NULL,'ValueInfinity Internal Project Tasks','Actions',1,'2020-05-01 23:12:01','2020-05-04 16:29:12'),(4834,1,1588366699052,6859,'Engineering COE',NULL,NULL,'ValueInfinity Internal Project Tasks','Actions',1,'2020-05-01 23:14:56','2020-05-04 16:29:12'),(4845,55,0,571,'new1  KPI Title','new1  KPI Description',NULL,NULL,'Kpis',1,'2020-05-02 03:19:17','2020-05-02 03:19:17'),(4846,55,0,572,'new2 KPI Title','new2 KPI Description',NULL,NULL,'Kpis',1,'2020-05-02 03:19:18','2020-05-02 03:19:18'),(4847,55,0,573,'3','3',NULL,NULL,'Kpis',1,'2020-05-02 03:19:18','2020-05-02 03:19:18'),(4853,55,1588580248993,6848,'this is demo task',NULL,NULL,'Asset Performance Management - Darwin','Actions',1,'2020-05-04 08:18:00','2020-05-05 14:49:24'),(4855,55,0,574,'Tech KPI','tech desc',NULL,'Asset Performance Management - Darwin','Kpis',1,'2020-05-04 15:20:49','2020-05-04 15:20:49'),(4860,55,1588580387538,6848,'New task',NULL,NULL,'Asset Performance Management - Darwin','Actions',1,'2020-05-04 15:35:41','2020-05-05 14:49:24'),(4865,1,1588609652471,6859,'EPIC Process Customer Feedback',NULL,NULL,'ValueInfinity Internal Project Tasks','Actions',1,'2020-05-04 16:28:48','2020-05-04 16:29:12'),(4890,10,1588609760021,6802,'New task',NULL,NULL,'Category Setup ','Actions',1,'2020-05-04 23:37:02','2020-05-04 23:37:02'),(4896,55,1588580387553,6848,'New task',NULL,NULL,'Asset Performance Management - Darwin','Actions',1,'2020-05-05 14:42:35','2020-05-05 14:49:24'),(4961,10,0,254,'Kumar, Pawan','pawan@gmail.com',NULL,'','Persons',1,'2020-05-18 16:34:05','2020-05-18 16:34:35');
/*!40000 ALTER TABLE `searchdata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequelizemeta`
--

LOCK TABLES `sequelizemeta` WRITE;
/*!40000 ALTER TABLE `sequelizemeta` DISABLE KEYS */;
INSERT INTO `sequelizemeta` VALUES ('20190113222642-create-organization.js'),('20190113222642-create-person.js'),('20190115014231-assoc-person-org.js'),('20190117031916-create-client-project.js'),('20190117141957-assoc-cliproj-org.js');
/*!40000 ALTER TABLE `sequelizemeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `taskcomments`
--

DROP TABLE IF EXISTS `taskcomments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `taskcomments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(100) NOT NULL,
  `taskId` varchar(50) NOT NULL,
  `projectId` int NOT NULL,
  `personName` varchar(50) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `disabled` tinyint(1) DEFAULT '0',
  `disabledAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `taskId-projectId` (`taskId`,`projectId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taskcomments`
--

LOCK TABLES `taskcomments` WRITE;
/*!40000 ALTER TABLE `taskcomments` DISABLE KEYS */;
INSERT INTO `taskcomments` VALUES (1,'major components differ by different companies.','1584745874241',6856,'Rick Harrop','2020-04-14 17:16:32','2020-04-14 17:16:32',0,NULL),(2,'Going through validation process of the findings','1583459340104',6849,'Alauddin Ahmed','2020-04-15 14:39:37','2020-04-15 14:39:37',0,NULL),(3,'High level summary completed','1583522740901',6849,'Alauddin Ahmed','2020-04-15 14:40:27','2020-04-15 14:40:27',0,NULL),(4,'Ties back to Responsibilities, types of projects','1583522740903',6849,'Alauddin Ahmed','2020-04-15 14:42:29','2020-04-15 14:42:29',0,NULL),(5,'A simple model for prioritization to make change h','1583522740902',6849,'Alauddin Ahmed','2020-04-18 01:57:16','2020-04-18 01:57:16',0,NULL),(6,'Engage with Adam and John to train and deploy','1587506232028',6858,'Alauddin Ahmed','2020-04-21 22:14:23','2020-04-21 22:14:23',0,NULL),(7,'Brainstorm with the team.','1588195771440',6859,'Alauddin Ahmed','2020-04-29 21:31:22','2020-04-29 21:31:22',0,NULL),(8,'It is already delayed','1588366699052',6859,'Alauddin Ahmed','2020-05-01 23:19:45','2020-05-01 23:19:45',0,NULL);
/*!40000 ALTER TABLE `taskcomments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `taskpriorities`
--

DROP TABLE IF EXISTS `taskpriorities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `taskpriorities` (
  `id` int NOT NULL,
  `label` varchar(30) DEFAULT NULL,
  `priority` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taskpriorities`
--

LOCK TABLES `taskpriorities` WRITE;
/*!40000 ALTER TABLE `taskpriorities` DISABLE KEYS */;
INSERT INTO `taskpriorities` VALUES (1,'Urgent',1,'2019-04-18 16:55:31','2019-04-18 16:55:31'),(2,'High',2,'2019-04-18 16:55:31','2019-04-18 16:55:31'),(3,'Medium',3,'2019-04-18 16:55:31','2019-04-18 16:55:31'),(4,'Low',4,'2019-04-18 16:55:31','2019-04-18 16:55:31');
/*!40000 ALTER TABLE `taskpriorities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `projectId` int NOT NULL,
  `assignedTo` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `comments` varchar(255) DEFAULT NULL,
  `priorityId` int DEFAULT '3',
  `milestoneId` int DEFAULT NULL,
  `statusId` int DEFAULT '1',
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `Tasks_Projects_ind` (`projectId`),
  KEY `Tasks_assignedTo_ind` (`assignedTo`),
  KEY `Tasks_ibfk_3` (`statusId`),
  KEY `Tasks_ibfk_4` (`priorityId`),
  KEY `Tasks_ibfk_5` (`milestoneId`),
  FULLTEXT KEY `title` (`title`,`description`),
  CONSTRAINT `Tasks_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Tasks_ibfk_2` FOREIGN KEY (`assignedTo`) REFERENCES `persons` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Tasks_ibfk_3` FOREIGN KEY (`statusId`) REFERENCES `taskstatuses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Tasks_ibfk_4` FOREIGN KEY (`priorityId`) REFERENCES `taskpriorities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Tasks_ibfk_5` FOREIGN KEY (`milestoneId`) REFERENCES `milestones` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (1,112,55,'Aggregate data','Get data extracts from different divisions',NULL,1,NULL,1,NULL,NULL,'2019-03-17 22:03:04','2019-04-18 16:23:36'),(2,112,55,'Review plant procedures','Meet with client to understand standard operating proceedures.',NULL,2,NULL,1,NULL,NULL,'2019-03-17 22:03:04','2019-04-18 16:23:36'),(3,21,55,'Review Excel data','Collect and review Excel files for data extracts.',NULL,3,NULL,1,NULL,NULL,'2019-03-17 22:03:04','2019-04-18 16:23:36'),(4,20,57,'Task 1','Detailed description goes here.',NULL,3,NULL,2,NULL,NULL,'2019-03-17 22:06:53','2019-04-18 16:23:37'),(5,23,57,'Second task','Detailed description goes here.',NULL,2,NULL,2,NULL,NULL,'2019-03-17 22:06:53','2019-04-18 16:23:37'),(6,29,57,'Review Excel data','Collect and review Excel files for data extracts.',NULL,2,NULL,2,NULL,NULL,'2019-03-17 22:06:53','2019-04-18 16:23:38'),(7,20,57,'Aggregate data','Get data extracts from different divisions throughout North America',NULL,2,NULL,2,NULL,NULL,'2019-03-17 22:06:53','2019-04-18 16:23:38'),(8,20,57,'Perform cluster analysis','Create clusters for inventory, wind turbine models, and failures',NULL,2,NULL,2,NULL,NULL,'2019-03-17 22:06:53','2019-04-18 16:23:37'),(9,20,57,'Review plant procedures','Meet with client to understand standard operating proceedures.',NULL,2,NULL,1,NULL,NULL,'2019-03-17 22:06:54','2019-05-28 03:22:32'),(10,118,55,'Action 1. Review Excel data','Collect and review Excel files for data extracts.','2019-05-02: gathered some data\n2019-05-07: more data from Operations\n2019-05-12: completed initial data gathering',1,1,2,'2019-06-15','2019-06-22','2019-03-22 19:25:05','2019-11-21 03:34:33'),(11,118,55,'Action 2','Check Data Completeness',NULL,2,1,2,'2019-06-18','2019-07-01','2019-03-22 19:25:05','2019-11-21 03:34:32'),(12,118,55,'Action 3','Request Additional Data',NULL,1,1,2,'2019-06-18','2019-07-01','2019-03-22 19:25:06','2019-11-21 03:34:32'),(13,118,55,'Action 1 - Identify outliers abnormalities','Identify based on Logical calculation','Noise and Outliers need to be validated by SME',1,3,2,'2019-08-19','2019-09-09','2019-03-22 19:25:06','2019-11-21 12:43:48'),(14,118,57,'Action 2: Aggregate data1','Get data extracts from different divisions throughout North America',NULL,1,2,2,'2019-07-18','2019-08-06','2019-03-22 19:25:06','2019-11-21 03:37:57'),(15,118,57,'Action 3: Perform cluster analysis','Create clusters for inventory, wind turbine models, and failures',NULL,1,2,2,'2019-07-23','2019-08-16','2019-03-22 19:25:06','2019-11-21 03:38:33'),(16,118,57,'Review plant procedures','Meet with client to understand standard operating proceedures.',NULL,2,2,3,'2019-07-23','2019-08-12','2019-03-22 19:25:06','2019-11-21 03:37:45'),(17,118,55,'Review data ommissions','Missing data for several fields and periods',NULL,3,3,3,'2019-08-19','2019-09-20','2019-03-22 19:26:37','2019-11-21 12:43:47'),(18,121,55,'Task 3a','Detailed description goes here.',NULL,2,NULL,3,NULL,NULL,'2019-03-22 19:26:37','2019-04-30 21:17:29'),(19,121,55,'Task 2','Detailed description goes here.',NULL,1,NULL,3,NULL,NULL,'2019-03-22 19:26:37','2019-04-30 21:17:29'),(20,121,55,'Another task','Detailed description goes here.',NULL,1,NULL,1,NULL,NULL,'2019-03-22 19:26:37','2019-04-30 21:17:29'),(21,117,55,'Review more Excel data','Collect and review Excel files for data extracts.',NULL,1,NULL,3,NULL,NULL,'2019-03-23 23:56:25','2019-04-18 16:23:38'),(22,117,55,'Task to get data','Detailed description goes here.',NULL,1,NULL,3,NULL,NULL,'2019-03-23 23:56:25','2019-04-18 16:23:38'),(23,118,55,'Second task','Detailed description goes here.',NULL,1,1,1,'2019-07-01','2019-07-12','2019-03-23 23:56:25','2019-11-21 03:39:09'),(24,118,55,'Review Excel data','Collect and review Excel files for data extracts.',NULL,1,1,1,'2019-07-08','2019-07-12','2019-03-23 23:56:25','2019-11-21 03:39:09'),(26,121,3,'New action 38','38',NULL,1,NULL,1,NULL,NULL,'2019-03-29 04:45:04','2019-04-30 21:17:29'),(28,121,55,'New action 33','22222',NULL,3,NULL,1,NULL,NULL,'2019-03-29 05:10:56','2019-04-30 21:17:29'),(29,118,55,'New action','AAAAA',NULL,3,NULL,2,NULL,NULL,'2019-03-29 05:24:33','2019-05-28 03:01:50'),(38,118,66,'Review results and establish correlation','Review the results in details, all parameters, and explain correlations',NULL,3,3,1,'2019-08-26','2019-09-20','2019-04-26 15:09:47','2019-11-21 12:43:48'),(39,118,66,'Review results and establish correlation','Review the results in details, all parameters, and explain correlations',NULL,3,NULL,1,NULL,NULL,'2019-04-26 15:09:49','2019-05-28 03:22:31'),(40,118,66,'Aggregate data','Aggregate data and create data dictionary',NULL,4,NULL,1,'2019-07-30','2019-08-02','2019-05-03 02:51:35','2019-11-21 03:35:49'),(42,21,66,'Build pipelines','Construct data pipelines for ongoing analyses.',NULL,3,NULL,1,NULL,NULL,'2019-05-03 03:04:42','2019-05-28 03:22:31'),(43,21,67,'Gather stakeholder input','Interview stakeholders to gather input',NULL,3,NULL,1,NULL,NULL,'2019-05-03 03:31:56','2019-05-28 03:22:30'),(44,21,66,'Create list of missing data points','Create list of missing data points and questions on standardizing fields across departments',NULL,3,NULL,1,NULL,NULL,'2019-05-03 04:03:59','2019-05-28 03:22:32'),(46,36,8,'Collect Accuracy Data for High Cost','Focus on high cost items and collect 5 months data',NULL,4,NULL,1,NULL,NULL,'2019-05-07 21:12:19','2019-05-28 03:22:32'),(47,36,8,'Collect Accuracy Data for High Cost','Focus on high cost items and collect 5 months data',NULL,4,NULL,1,NULL,NULL,'2019-05-07 21:12:20','2019-05-28 03:22:32'),(48,36,8,'Collect Accuracy Data for High Cost','Focus on high cost items and collect 5 months data',NULL,4,NULL,1,NULL,NULL,'2019-05-07 21:12:21','2019-05-28 03:22:32');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `taskstatuses`
--

DROP TABLE IF EXISTS `taskstatuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `taskstatuses` (
  `id` int NOT NULL,
  `label` varchar(30) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='List of task statuses';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taskstatuses`
--

LOCK TABLES `taskstatuses` WRITE;
/*!40000 ALTER TABLE `taskstatuses` DISABLE KEYS */;
INSERT INTO `taskstatuses` VALUES (1,'Pending','2019-04-18 16:54:36','2019-04-18 16:54:36'),(2,'In Progress','2019-04-18 16:54:36','2019-04-18 16:54:36'),(3,'Completed','2019-04-18 16:54:36','2019-04-18 16:54:36');
/*!40000 ALTER TABLE `taskstatuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test`
--

DROP TABLE IF EXISTS `test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test` (
  `pwdhash` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test`
--

LOCK TABLES `test` WRITE;
/*!40000 ALTER TABLE `test` DISABLE KEYS */;
INSERT INTO `test` VALUES ('$2b$12$LroyE63WNvb9ReFBPFJYf.wed6xLk8wn/5fSbMJzxVUfpwHrETPb.');
/*!40000 ALTER TABLE `test` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vw_gantttasks`
--

DROP TABLE IF EXISTS `vw_gantttasks`;
/*!50001 DROP VIEW IF EXISTS `vw_gantttasks`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_gantttasks` AS SELECT 
 1 AS `taskId`,
 1 AS `startDate`,
 1 AS `endDate`,
 1 AS `duration`,
 1 AS `taskDescription`,
 1 AS `chartId`,
 1 AS `projectId`,
 1 AS `orgId`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_getkpis`
--

DROP TABLE IF EXISTS `vw_getkpis`;
/*!50001 DROP VIEW IF EXISTS `vw_getkpis`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_getkpis` AS SELECT 
 1 AS `id`,
 1 AS `orgId`,
 1 AS `deptId`,
 1 AS `title`,
 1 AS `description`,
 1 AS `level`,
 1 AS `type`,
 1 AS `orgPriority`,
 1 AS `active`,
 1 AS `status`,
 1 AS `projectId`,
 1 AS `formulaDescription`,
 1 AS `departmentId`,
 1 AS `projectTitleWrong`,
 1 AS `orgName`,
 1 AS `tags`,
 1 AS `projectTitle`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_kpis`
--

DROP TABLE IF EXISTS `vw_kpis`;
/*!50001 DROP VIEW IF EXISTS `vw_kpis`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_kpis` AS SELECT 
 1 AS `id`,
 1 AS `orgId`,
 1 AS `deptId`,
 1 AS `title`,
 1 AS `description`,
 1 AS `level`,
 1 AS `type`,
 1 AS `orgPriority`,
 1 AS `active`,
 1 AS `status`,
 1 AS `projectId`,
 1 AS `formulaDescription`,
 1 AS `departmentId`,
 1 AS `projectTitle`,
 1 AS `orgName`,
 1 AS `tags`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_orderedtasks`
--

DROP TABLE IF EXISTS `vw_orderedtasks`;
/*!50001 DROP VIEW IF EXISTS `vw_orderedtasks`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_orderedtasks` AS SELECT 
 1 AS `description`,
 1 AS `type`,
 1 AS `targetDate`,
 1 AS `status`,
 1 AS `projectId`,
 1 AS `projectTitle`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_projectpersonstemp`
--

DROP TABLE IF EXISTS `vw_projectpersonstemp`;
/*!50001 DROP VIEW IF EXISTS `vw_projectpersonstemp`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_projectpersonstemp` AS SELECT 
 1 AS `personId`,
 1 AS `projectId`,
 1 AS `orgId`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_searchdata`
--

DROP TABLE IF EXISTS `vw_searchdata`;
/*!50001 DROP VIEW IF EXISTS `vw_searchdata`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_searchdata` AS SELECT 
 1 AS `id`,
 1 AS `orgid`,
 1 AS `title`,
 1 AS `description`,
 1 AS `summary`,
 1 AS `project`,
 1 AS `source`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_tasks`
--

DROP TABLE IF EXISTS `vw_tasks`;
/*!50001 DROP VIEW IF EXISTS `vw_tasks`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_tasks` AS SELECT 
 1 AS `id`,
 1 AS `projectId`,
 1 AS `assignedTo`,
 1 AS `title`,
 1 AS `description`,
 1 AS `status`,
 1 AS `createdAt`,
 1 AS `updatedAt`,
 1 AS `fullName`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping events for database 'mvp2'
--

--
-- Dumping routines for database 'mvp2'
--
/*!50003 DROP FUNCTION IF EXISTS `getMindmapJsonNode` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `getMindmapJsonNode`(`mindmapId` integer, `id` varchar(50)) RETURNS json
begin
    declare
        json_out json;
    
    set json_out = (select json_unquote(json_extract(mapData,
        replace(json_unquote(json_search(mapData, 'one', id)), '.id', '')))
       from Mindmaps m where m.id = mindmapId limit 1);
    return json_out;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `getProjectListForPerson` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `getProjectListForPerson`(`inPersonId` int) RETURNS varchar(500) CHARSET utf8mb4
begin
    declare projectList varchar(500);

    select group_concat(title) into projectList
            from Projects Pr,
                 ProjectPersons PP
            where Pr.id = PP.projectId
              and PP.personId = inPersonId
              and Pr.active = 1
              and (PP.inProject = 1 OR PP.owner = 1)
            order by Pr.title
    limit 1;

    return projectList;
end ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `getProjectListForPersonWithOrgId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `getProjectListForPersonWithOrgId`(`inPersonId` INT, `inOrgId` INT) RETURNS varchar(500) CHARSET utf8mb4
    NO SQL
begin
    declare projectList varchar(500);

    select group_concat(title) into projectList
            from Projects Pr,
                 ProjectPersons PP
            where Pr.id = PP.projectId
              and PP.personId = inPersonId
              and Pr.active = 1
              and Pr.orgId = inOrgId
              and (PP.inProject = 1 OR PP.owner = 1)
            order by Pr.title
    limit 1;

    return projectList;
end ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `getTopTasks` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `getTopTasks`(in_numTasks int, in_projectId int) RETURNS varchar(500) CHARSET utf8mb4
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
end ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `insert_kpi_with_project` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_kpi_with_project`(IN `p_org_id` int, IN `p_kpi_title` varchar(255), IN `p_kpi_descr` varchar(255), IN `p_kpi_formula` varchar(255), IN `p_mindmap_node_id` varchar(30), IN `p_proj_title` varchar(100), IN `p_proj_descr` varchar(300))
BEGIN
    set @kpiId = 0;

    insert into Kpis (orgId, title, description, formulaDescription, mindmapNodeId, active)
    values (p_org_id, p_kpi_title, p_kpi_descr, p_kpi_formula, p_mindmap_node_id, 1);
    
    

    
    set @kpiId = LAST_INSERT_ID();
    SELECT concat('kpi id = ', @kpiId);

    insert into Projects (orgId, title, description, mainKpiId)
    values (p_org_id, p_proj_title, p_proj_descr, @kpiId);

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `setProject` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `setProject`(IN kpiId int, IN organizationId int, IN projectTitle varchar(100),
                                               IN projectDescription varchar(300), out message varchar(200))
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
        
        insert into Projects (title, description, mainKpiId, orgId)
        values (projectTitle, projectDescription, kpiId, organizationId);
        SET projectId = LAST_INSERT_ID();
        update Kpis set projectId = projectId where id = kpiId;
        set message = concat('Project ''', projectTitle, ''' has been created.');
    else
        update Projects
        set title = projectTitle,
            description = projectDescription
            where id = projectId and orgId = organizationId;
        set message = concat('Project ''', projectTitle, ''' has been updated.');
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_MostRecentProjects` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_MostRecentProjects`()
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
end ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `vw_gantttasks`
--

/*!50001 DROP VIEW IF EXISTS `vw_gantttasks`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_gantttasks` AS select `g1`.`taskId` AS `taskId`,`g1`.`startDate` AS `startDate`,`g1`.`endDate` AS `endDate`,`g1`.`duration` AS `duration`,`g1`.`taskDescription` AS `taskDescription`,`g`.`id` AS `chartId`,`g`.`projectId` AS `projectId`,`p`.`orgId` AS `orgId` from ((`gantt` `g` join `projects` `p`) join json_table(`g`.`jsonData`, '$.data[*]' columns (taskId varchar(20) path '$.id', startDate date path '$.start_date', endDate date path '$.end_date', duration int path '$.duration', taskDescription varchar(100) path '$.text')) `g1`) where ((`g`.`projectId` is not null) and (`p`.`id` = `g`.`projectId`)) order by `g`.`projectId`,`g1`.`startDate` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_getkpis`
--

/*!50001 DROP VIEW IF EXISTS `vw_getkpis`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_getkpis` AS select `k`.`id` AS `id`,`k`.`orgId` AS `orgId`,`k`.`deptId` AS `deptId`,`k`.`title` AS `title`,`k`.`description` AS `description`,`k`.`level` AS `level`,`k`.`type` AS `type`,`k`.`orgPriority` AS `orgPriority`,`k`.`active` AS `active`,`k`.`status` AS `status`,`k`.`projectId` AS `projectId`,`k`.`formulaDescription` AS `formulaDescription`,`k`.`departmentId` AS `departmentId`,`p`.`title` AS `projectTitleWrong`,`o`.`name` AS `orgName`,(select group_concat(`kt`.`tag` separator ',') from `kpitags` `kt` where (`kt`.`kpiId` = `k`.`id`)) AS `tags`,(select `p`.`title` from `projects` `prt` where (`prt`.`id` = `k`.`projectId`)) AS `projectTitle` from ((`projects` `p` join `organizations` `o`) join `kpis` `k`) where (((`k`.`projectId` = `p`.`id`) or (`k`.`projectId` = 0) or (`k`.`projectId` is null)) and (`k`.`orgId` = `o`.`id`)) group by `k`.`id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_kpis`
--

/*!50001 DROP VIEW IF EXISTS `vw_kpis`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_kpis` AS select `k`.`id` AS `id`,`k`.`orgId` AS `orgId`,`k`.`deptId` AS `deptId`,`k`.`title` AS `title`,`k`.`description` AS `description`,`k`.`level` AS `level`,`k`.`type` AS `type`,`k`.`orgPriority` AS `orgPriority`,`k`.`active` AS `active`,`k`.`status` AS `status`,`k`.`projectId` AS `projectId`,`k`.`formulaDescription` AS `formulaDescription`,`k`.`departmentId` AS `departmentId`,`p`.`title` AS `projectTitle`,`o`.`name` AS `orgName`,(select group_concat(`kt`.`tag` separator ',') from `kpitags` `kt` where (`kt`.`kpiId` = `k`.`id`)) AS `tags` from ((`projects` `p` join `organizations` `o`) join `kpis` `k`) where ((`k`.`projectId` = `p`.`id`) and (`k`.`orgId` = `o`.`id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_orderedtasks`
--

/*!50001 DROP VIEW IF EXISTS `vw_orderedtasks`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_orderedtasks` AS select `g1`.`text` AS `description`,`g1`.`type` AS `type`,`g1`.`end_date` AS `targetDate`,'open' AS `status`,`p`.`id` AS `projectId`,`p`.`title` AS `projectTitle` from ((`gantt` `g` join json_table(`g`.`jsonData`, '$.data[*]' columns (start_date date path '$.start_date', end_date date path '$.end_date', type varchar(60) path '$.type', duration int path '$.duration', text varchar(120) path '$.text')) `g1`) join `projects` `p`) where (`p`.`id` = `g`.`projectId`) order by `p`.`id`,`g1`.`start_date`,`g1`.`duration` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_projectpersonstemp`
--

/*!50001 DROP VIEW IF EXISTS `vw_projectpersonstemp`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_projectpersonstemp` AS select `pe`.`id` AS `personId`,`pr`.`id` AS `projectId`,`o`.`id` AS `orgId` from ((`persons` `pe` join `organizations` `o`) join `projects` `pr`) where ((`pe`.`orgId` = `o`.`id`) and (`pr`.`orgId` = `o`.`id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_searchdata`
--

/*!50001 DROP VIEW IF EXISTS `vw_searchdata`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_searchdata` AS select `projects`.`id` AS `id`,`projects`.`orgId` AS `orgid`,`projects`.`title` AS `title`,`projects`.`description` AS `description`,`projects`.`summary` AS `summary`,`projects`.`title` AS `project`,'Projects' AS `source` from `projects` union select `kpis`.`id` AS `id`,`kpis`.`orgId` AS `orgid`,`kpis`.`title` AS `title`,`kpis`.`description` AS `description`,'' AS `summary`,`projects`.`title` AS `project`,'Kpis' AS `source` from (`kpis` join `projects`) where (`kpis`.`projectId` = `projects`.`id`) union select `persons`.`id` AS `id`,`persons`.`orgId` AS `orgid`,`persons`.`fullName` AS `title`,'' AS `description`,'' AS `summary`,'' AS `project`,'Persons' AS `source` from `persons` union select `mindmaps`.`id` AS `id`,`mindmaps`.`orgId` AS `orgid`,`mindmaps`.`mapName` AS `title`,`mindmaps`.`mapDescription` AS `description`,'' AS `summary`,'' AS `project`,'Mindmaps' AS `source` from `mindmaps` union select `vw_gantttasks`.`projectId` AS `id`,`vw_gantttasks`.`orgId` AS `orgid`,`vw_gantttasks`.`taskDescription` AS `title`,`vw_gantttasks`.`taskDescription` AS `description`,`vw_gantttasks`.`taskDescription` AS `summary`,`projects`.`title` AS `project`,'Actions' AS `source` from (`vw_gantttasks` join `projects`) where (`vw_gantttasks`.`projectId` = `projects`.`id`) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_tasks`
--

/*!50001 DROP VIEW IF EXISTS `vw_tasks`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_tasks` AS select `t`.`id` AS `id`,`t`.`projectId` AS `projectId`,`t`.`assignedTo` AS `assignedTo`,`t`.`title` AS `title`,`t`.`description` AS `description`,`t`.`statusId` AS `status`,`t`.`createdAt` AS `createdAt`,`t`.`updatedAt` AS `updatedAt`,concat(`p`.`firstName`,' ',`p`.`lastName`) AS `fullName` from (`tasks` `t` join `persons` `p`) where (`t`.`assignedTo` = `p`.`id`) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-05-23 15:42:52
