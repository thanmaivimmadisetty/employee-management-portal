-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: employee_db
-- ------------------------------------------------------
-- Server version	9.7.1

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
-- GTID state at the beginning of the backup 
--



--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `activity_type` varchar(100) DEFAULT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_logs`
--

LOCK TABLES `activity_logs` WRITE;
/*!40000 ALTER TABLE `activity_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `date` date NOT NULL,
  `check_in` time DEFAULT NULL,
  `check_out` time DEFAULT NULL,
  `status` enum('Present','Absent','Late','Half Day') DEFAULT 'Present',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_employee_date` (`employee_id`,`date`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES (1,3,'2026-06-29','09:00:00','17:00:00','Present'),(2,4,'2026-06-29','09:15:00','17:00:00','Present'),(3,3,'2026-06-30','08:55:00',NULL,'Present'),(4,4,'2026-06-30','09:45:00',NULL,'Late'),(5,4,'2026-07-02','11:37:00','11:37:04','Late');
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `manager_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `fk_manager` (`manager_id`),
  CONSTRAINT `fk_manager` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'Administration','Core management and executive actions',1),(2,'Human Resources','Recruitment, employee relations, and benefits',2),(3,'Engineering','Software development and technical operations',3),(4,'Marketing','Sales, public relations, and campaigns',NULL);
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_tracker`
--

DROP TABLE IF EXISTS `employee_tracker`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_tracker` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `task_name` varchar(255) DEFAULT NULL,
  `project_name` varchar(255) DEFAULT NULL,
  `description` text,
  `status` enum('Pending','In Progress','Completed') DEFAULT 'Pending',
  `login_time` datetime DEFAULT NULL,
  `logout_time` datetime DEFAULT NULL,
  `hours_worked` decimal(5,2) DEFAULT '0.00',
  `work_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `activity` varchar(100) DEFAULT NULL,
  `module` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `employee_tracker_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_tracker`
--

LOCK TABLES `employee_tracker` WRITE;
/*!40000 ALTER TABLE `employee_tracker` DISABLE KEYS */;
INSERT INTO `employee_tracker` VALUES (1,4,NULL,NULL,NULL,'Pending','2026-07-07 17:21:58','2026-07-07 17:22:25',0.00,'2026-07-07','2026-07-07 11:51:58',NULL,NULL),(2,4,'tracker update','employee portal','tracking logout login on employee','Pending','2026-07-07 17:37:11','2026-07-07 17:48:36',0.00,'2026-07-07','2026-07-07 12:07:11',NULL,NULL),(3,2,NULL,NULL,NULL,'Pending','2026-07-07 17:48:39','2026-07-07 22:50:59',0.00,'2026-07-07','2026-07-07 12:18:39',NULL,NULL),(4,4,NULL,NULL,NULL,'Pending','2026-07-07 22:51:04','2026-07-07 23:12:31',0.00,'2026-07-07','2026-07-07 17:21:04','Login',NULL),(5,2,NULL,NULL,NULL,'Pending','2026-07-07 23:12:34','2026-07-07 23:14:09',0.00,'2026-07-07','2026-07-07 17:42:34','Login',NULL),(6,2,NULL,NULL,NULL,'Pending','2026-07-07 23:14:14','2026-07-07 23:23:01',0.00,'2026-07-07','2026-07-07 17:44:14','Login',NULL),(7,4,'tracker update','employee portal','','Completed','2026-07-07 23:23:05','2026-07-07 23:23:32',0.00,'2026-07-07','2026-07-07 17:53:05','Login',NULL),(8,2,NULL,NULL,NULL,'Pending','2026-07-07 23:23:35','2026-07-07 23:53:56',0.00,'2026-07-07','2026-07-07 17:53:35','Login',NULL),(9,1,NULL,NULL,NULL,'Pending','2026-07-07 23:32:32',NULL,0.00,'2026-07-07','2026-07-07 18:02:32','Candidate Applied: Thanmai Vimmadisetty','Recruitment'),(10,4,NULL,NULL,NULL,'Pending','2026-07-07 23:54:00',NULL,0.00,'2026-07-07','2026-07-07 18:24:00','Login',NULL),(11,4,NULL,NULL,NULL,'Pending','2026-07-07 23:54:37','2026-07-07 23:54:41',0.00,'2026-07-07','2026-07-07 18:24:37','Applied Leave','Leave'),(12,2,NULL,NULL,NULL,'Pending','2026-07-07 23:54:44','2026-07-08 00:04:33',0.00,'2026-07-07','2026-07-07 18:24:44','Login',NULL),(13,4,NULL,NULL,NULL,'Completed','2026-07-07 23:55:20',NULL,0.00,'2026-07-07','2026-07-07 18:25:20','Leave Approved','Leave'),(14,4,NULL,NULL,NULL,'Pending','2026-07-08 00:04:37','2026-07-08 00:05:26',0.00,'2026-07-08','2026-07-07 18:34:37','Login',NULL),(15,1,NULL,NULL,NULL,'Pending','2026-07-08 00:06:21',NULL,0.00,'2026-07-08','2026-07-07 18:36:21','Login',NULL),(16,4,'employee portal integration','hr portal','integrated tracker module','In Progress','2026-07-09 11:30:10','2026-07-09 11:34:18',0.00,'2026-07-09','2026-07-09 06:00:10','Login',NULL),(17,4,NULL,NULL,NULL,'Pending','2026-07-09 11:34:24','2026-07-09 11:35:04',0.00,'2026-07-09','2026-07-09 06:04:24','Login',NULL),(18,4,NULL,NULL,NULL,'Pending','2026-07-09 11:40:00','2026-07-09 11:40:03',0.00,'2026-07-09','2026-07-09 06:10:00','Login',NULL),(19,2,NULL,NULL,NULL,'Pending','2026-07-09 11:40:06','2026-07-09 11:46:17',0.00,'2026-07-09','2026-07-09 06:10:06','Login',NULL),(20,4,'test integration','employee portal','testing tracker integration','In Progress','2026-07-09 11:46:20','2026-07-09 11:50:49',0.00,'2026-07-09','2026-07-09 06:16:20','Working','employee portal'),(21,2,NULL,NULL,NULL,'Pending','2026-07-09 11:50:52',NULL,0.00,'2026-07-09','2026-07-09 06:20:52','Login',NULL);
/*!40000 ALTER TABLE `employee_tracker` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int NOT NULL,
  `department_id` int DEFAULT NULL,
  `joining_date` date NOT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `salary` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'System','Admin','admin@portal.com','$2a$10$2rM3N5U8FD3KZKvMBbbFUer27Q23NdoWe6zID9n4sWhy.N8NENRQO',1,1,'2020-01-01','Active',95000.00),(2,'Sarah','HR','hr@portal.com','$2a$10$2rM3N5U8FD3KZKvMBbbFUer27Q23NdoWe6zID9n4sWhy.N8NENRQO',2,2,'2021-06-15','Active',75000.00),(3,'John','Manager','manager@portal.com','$2a$10$2rM3N5U8FD3KZKvMBbbFUer27Q23NdoWe6zID9n4sWhy.N8NENRQO',3,3,'2022-03-10','Active',85000.00),(4,'David','Employee','employee@portal.com','$2a$10$2rM3N5U8FD3KZKvMBbbFUer27Q23NdoWe6zID9n4sWhy.N8NENRQO',4,3,'2023-08-01','Active',60000.00);
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `holidays`
--

DROP TABLE IF EXISTS `holidays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `holidays` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `date` (`date`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `holidays`
--

LOCK TABLES `holidays` WRITE;
/*!40000 ALTER TABLE `holidays` DISABLE KEYS */;
INSERT INTO `holidays` VALUES (1,'New Year\'s Day','2026-01-01'),(2,'Good Friday','2026-04-03'),(3,'Independence Day','2026-07-04'),(4,'Labor Day','2026-09-07'),(5,'Thanksgiving Day','2026-11-26'),(6,'Christmas Day','2026-12-25');
/*!40000 ALTER TABLE `holidays` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leaves`
--

DROP TABLE IF EXISTS `leaves`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leaves` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `leave_type` varchar(50) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` text,
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `approved_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  KEY `approved_by` (`approved_by`),
  CONSTRAINT `leaves_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  CONSTRAINT `leaves_ibfk_2` FOREIGN KEY (`approved_by`) REFERENCES `employees` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leaves`
--

LOCK TABLES `leaves` WRITE;
/*!40000 ALTER TABLE `leaves` DISABLE KEYS */;
INSERT INTO `leaves` VALUES (1,4,'Sick Leave','2026-06-20','2026-06-22','Medical checkup and rest','Approved',2),(2,4,'Annual Leave','2026-07-10','2026-07-15','Family vacation','Approved',1),(3,1,'Casual Leave','2026-07-02','2026-07-03','out of station','Approved',1),(4,4,'Sick Leave','2026-07-07','2026-07-08','sick','Approved',2);
/*!40000 ALTER TABLE `leaves` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,1,'System update scheduled for July 1st.',0,'2026-06-30 08:36:36'),(2,2,'New candidate application for HR Specialist.',1,'2026-06-30 08:36:36'),(3,3,'David has applied for Annual Leave.',0,'2026-06-30 08:36:36'),(4,4,'Your Q1 performance review has been posted.',1,'2026-06-30 08:36:36'),(5,1,'System Admin has requested leave from 2026-07-02 to 2026-07-03.',0,'2026-07-02 09:01:30'),(6,1,'Your leave request for Casual Leave has been approved.',0,'2026-07-02 09:01:48'),(7,4,'Your leave request for Annual Leave has been approved.',0,'2026-07-02 09:01:56'),(8,2,'New candidate application from Thanmai Vimmadisetty for job ID 1.',0,'2026-07-07 18:02:32'),(9,3,'David Employee has requested leave from 2026-07-07 to 2026-07-08.',0,'2026-07-07 18:24:37'),(10,4,'Your leave request for Sick Leave has been approved.',0,'2026-07-07 18:25:20');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `onboarding_requests`
--

DROP TABLE IF EXISTS `onboarding_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `onboarding_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `previous_company` varchar(100) DEFAULT NULL,
  `previous_designation` varchar(100) DEFAULT NULL,
  `new_designation` varchar(100) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `experience` int DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `address` text,
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `onboarding_requests`
--

LOCK TABLES `onboarding_requests` WRITE;
/*!40000 ALTER TABLE `onboarding_requests` DISABLE KEYS */;
INSERT INTO `onboarding_requests` VALUES (1,'Vimmadisetty Naga Sai Thanmai','thanmaivimmadisetty@gmail.com','07981989802','abc company','web developer','web developer','Information Technology',2,'2026-07-03','3-15-22/bahar 2/14,sahara states\nlb nagar mansoorabad','Approved','2026-07-03 09:44:54');
/*!40000 ALTER TABLE `onboarding_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payroll`
--

DROP TABLE IF EXISTS `payroll`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payroll` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `base_salary` decimal(10,2) NOT NULL,
  `allowances` decimal(10,2) DEFAULT '0.00',
  `deductions` decimal(10,2) DEFAULT '0.00',
  `net_salary` decimal(10,2) NOT NULL,
  `payment_date` date DEFAULT NULL,
  `status` enum('Paid','Unpaid') DEFAULT 'Unpaid',
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `payroll_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payroll`
--

LOCK TABLES `payroll` WRITE;
/*!40000 ALTER TABLE `payroll` DISABLE KEYS */;
INSERT INTO `payroll` VALUES (1,1,95000.00,5000.00,2000.00,98000.00,'2026-05-31','Paid'),(2,2,75000.00,3000.00,1500.00,76500.00,'2026-05-31','Paid'),(3,3,85000.00,4000.00,1800.00,87200.00,'2026-05-31','Paid'),(4,4,60000.00,2000.00,1200.00,60800.00,'2026-05-31','Paid');
/*!40000 ALTER TABLE `payroll` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `performance_reviews`
--

DROP TABLE IF EXISTS `performance_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `performance_reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `reviewer_id` int NOT NULL,
  `review_period` varchar(50) NOT NULL,
  `rating` int NOT NULL,
  `feedback` text,
  `review_date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  KEY `reviewer_id` (`reviewer_id`),
  CONSTRAINT `performance_reviews_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  CONSTRAINT `performance_reviews_ibfk_2` FOREIGN KEY (`reviewer_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  CONSTRAINT `performance_reviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `performance_reviews`
--

LOCK TABLES `performance_reviews` WRITE;
/*!40000 ALTER TABLE `performance_reviews` DISABLE KEYS */;
INSERT INTO `performance_reviews` VALUES (1,4,3,'Q1 2026',4,'David showed excellent commitment in engineering projects. Needs slight improvement in communication timelines.','2026-04-10');
/*!40000 ALTER TABLE `performance_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recruitment_candidates`
--

DROP TABLE IF EXISTS `recruitment_candidates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recruitment_candidates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `job_id` int NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `resume_url` text,
  `status` enum('Applied','Interviewing','Offered','Rejected') DEFAULT 'Applied',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `job_id` (`job_id`),
  CONSTRAINT `recruitment_candidates_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `recruitment_jobs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recruitment_candidates`
--

LOCK TABLES `recruitment_candidates` WRITE;
/*!40000 ALTER TABLE `recruitment_candidates` DISABLE KEYS */;
INSERT INTO `recruitment_candidates` VALUES (1,1,'Alice','Smith','alice.smith@gmail.com','https://example.com/resumes/alice.pdf','Interviewing','2026-06-30 08:36:36'),(2,1,'Bob','Jones','bob.jones@yahoo.com','https://example.com/resumes/bob.pdf','Applied','2026-06-30 08:36:36'),(3,2,'Emily','Brown','emily.b@outlook.com','https://example.com/resumes/emily.pdf','Offered','2026-06-30 08:36:36'),(4,1,'Thanmai','Vimmadisetty','thanmaivimmadisetty@gmail.com','https://example.com/resumes/demo.pdf','Applied','2026-07-07 18:02:32');
/*!40000 ALTER TABLE `recruitment_candidates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recruitment_jobs`
--

DROP TABLE IF EXISTS `recruitment_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recruitment_jobs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `department_id` int DEFAULT NULL,
  `status` enum('Open','Closed') DEFAULT 'Open',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `recruitment_jobs_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recruitment_jobs`
--

LOCK TABLES `recruitment_jobs` WRITE;
/*!40000 ALTER TABLE `recruitment_jobs` DISABLE KEYS */;
INSERT INTO `recruitment_jobs` VALUES (1,'Senior React Developer','Looking for a Senior Frontend Engineer proficient in React, Tailwind CSS, and state management libraries.',3,'Open','2026-06-30 08:36:36'),(2,'HR Specialist','Seeking an experienced recruiter to manage personnel relations and source talent.',2,'Open','2026-06-30 08:36:36');
/*!40000 ALTER TABLE `recruitment_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin'),(4,'Employee'),(2,'HR'),(3,'Manager');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-09 13:04:27
