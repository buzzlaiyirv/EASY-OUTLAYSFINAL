CREATE DATABASE  IF NOT EXISTS `easy2` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `easy2`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: easy2
-- ------------------------------------------------------
-- Server version	8.3.0

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
-- Table structure for table `balance`
--

DROP TABLE IF EXISTS `balance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `balance` (
  `id_b` int NOT NULL AUTO_INCREMENT,
  `resultado_b` int NOT NULL,
  `cant_in` int NOT NULL,
  `cant_g` int NOT NULL,
  `id_u` int NOT NULL,
  PRIMARY KEY (`id_b`),
  KEY `resultado_b` (`resultado_b`),
  KEY `cant_in` (`cant_in`),
  KEY `cant_g` (`cant_g`),
  KEY `id_u` (`id_u`),
  CONSTRAINT `balance_ibfk_1` FOREIGN KEY (`cant_in`) REFERENCES `ingreso` (`cant_in`) ON UPDATE CASCADE,
  CONSTRAINT `balance_ibfk_2` FOREIGN KEY (`cant_g`) REFERENCES `gastos` (`cant_g`) ON UPDATE CASCADE,
  CONSTRAINT `balance_ibfk_3` FOREIGN KEY (`id_u`) REFERENCES `usuario` (`id_u`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `balance`
--

LOCK TABLES `balance` WRITE;
/*!40000 ALTER TABLE `balance` DISABLE KEYS */;
/*!40000 ALTER TABLE `balance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cat_gasto`
--

DROP TABLE IF EXISTS `cat_gasto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat_gasto` (
  `id_catG` int NOT NULL AUTO_INCREMENT,
  `nombre_catG` varchar(50) NOT NULL,
  PRIMARY KEY (`id_catG`),
  KEY `nombre_catG` (`nombre_catG`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cat_gasto`
--

LOCK TABLES `cat_gasto` WRITE;
/*!40000 ALTER TABLE `cat_gasto` DISABLE KEYS */;
/*!40000 ALTER TABLE `cat_gasto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gastos`
--

DROP TABLE IF EXISTS `gastos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gastos` (
  `id_g` int NOT NULL AUTO_INCREMENT,
  `cant_g` int NOT NULL,
  `fecha_g` date NOT NULL,
  `desc_g` varchar(30) NOT NULL,
  `desc_mtdP` varchar(30) NOT NULL,
  `desc_tG` varchar(30) NOT NULL,
  PRIMARY KEY (`id_g`),
  KEY `cant_g` (`cant_g`),
  KEY `fecha_g` (`fecha_g`),
  KEY `desc_g` (`desc_g`),
  KEY `desc_mtdP` (`desc_mtdP`),
  KEY `desc_tG` (`desc_tG`),
  CONSTRAINT `gastos_ibfk_1` FOREIGN KEY (`desc_mtdP`) REFERENCES `metodo_pago` (`desc_mtdP`) ON UPDATE CASCADE,
  CONSTRAINT `gastos_ibfk_2` FOREIGN KEY (`desc_tG`) REFERENCES `tipo_gasto` (`desc_tG`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gastos`
--

LOCK TABLES `gastos` WRITE;
/*!40000 ALTER TABLE `gastos` DISABLE KEYS */;
/*!40000 ALTER TABLE `gastos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingreso`
--

DROP TABLE IF EXISTS `ingreso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingreso` (
  `id_in` int NOT NULL AUTO_INCREMENT,
  `cant_in` int NOT NULL,
  `desc_in` varchar(30) NOT NULL,
  `fecha_in` date NOT NULL,
  `desc_tI` varchar(30) NOT NULL,
  PRIMARY KEY (`id_in`),
  KEY `cant_in` (`cant_in`),
  KEY `desc_in` (`desc_in`),
  KEY `fecha_in` (`fecha_in`),
  KEY `desc_tI` (`desc_tI`),
  CONSTRAINT `ingreso_ibfk_1` FOREIGN KEY (`desc_tI`) REFERENCES `tipo_ingreso` (`desc_tI`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingreso`
--

LOCK TABLES `ingreso` WRITE;
/*!40000 ALTER TABLE `ingreso` DISABLE KEYS */;
/*!40000 ALTER TABLE `ingreso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `metodo_pago`
--

DROP TABLE IF EXISTS `metodo_pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `metodo_pago` (
  `id_mtdP` int NOT NULL AUTO_INCREMENT,
  `desc_mtdP` varchar(30) NOT NULL,
  PRIMARY KEY (`id_mtdP`),
  KEY `desc_mtdP` (`desc_mtdP`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `metodo_pago`
--

LOCK TABLES `metodo_pago` WRITE;
/*!40000 ALTER TABLE `metodo_pago` DISABLE KEYS */;
/*!40000 ALTER TABLE `metodo_pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_gasto`
--

DROP TABLE IF EXISTS `tipo_gasto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_gasto` (
  `id_tG` int NOT NULL AUTO_INCREMENT,
  `desc_tG` varchar(30) NOT NULL,
  PRIMARY KEY (`id_tG`),
  KEY `desc_tG` (`desc_tG`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_gasto`
--

LOCK TABLES `tipo_gasto` WRITE;
/*!40000 ALTER TABLE `tipo_gasto` DISABLE KEYS */;
/*!40000 ALTER TABLE `tipo_gasto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_ingreso`
--

DROP TABLE IF EXISTS `tipo_ingreso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_ingreso` (
  `id_tI` int NOT NULL AUTO_INCREMENT,
  `desc_tI` varchar(30) NOT NULL,
  PRIMARY KEY (`id_tI`),
  KEY `desc_tI` (`desc_tI`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_ingreso`
--

LOCK TABLES `tipo_ingreso` WRITE;
/*!40000 ALTER TABLE `tipo_ingreso` DISABLE KEYS */;
/*!40000 ALTER TABLE `tipo_ingreso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `nombre_u` varchar(20) NOT NULL,
  `contra_u` varchar(20) NOT NULL,
  `correo_u` varchar(30) NOT NULL,
  `id_u` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id_u`),
  KEY `nombre_u` (`nombre_u`),
  KEY `contra_u` (`contra_u`),
  KEY `correo_u` (`correo_u`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES ('yoyopro','270406','yanez.silva.victor@gmail.com',1);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'easy2'
--

--
-- Dumping routines for database 'easy2'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-25 12:03:04
