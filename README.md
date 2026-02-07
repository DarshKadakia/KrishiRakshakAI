# KrishiRakshak AI 🌾

KrishiRakshak AI is an AI-powered farm decision and risk support system designed to help Indian smallholder farmers make timely, data-driven agricultural decisions. The project focuses on reducing crop risk and uncertainty caused by climate variability, rising input costs, and limited access to reliable advisory services.

By combining low-cost hardware, edge computing, and lightweight machine learning, KrishiRakshak AI delivers localized, actionable farm intelligence even in low-connectivity rural environments.

---

## 🔗 Project URL

Live Project / Demo:  
https://your-project-url-here.com

---

## Problem Statement

Indian smallholder farmers face increasing uncertainty due to erratic monsoons, climate change, and limited access to reliable advisory services. Most existing digital solutions rely heavily on cloud connectivity or present raw data that is difficult for farmers to interpret and act upon.

KrishiRakshak AI addresses this gap by providing clear, context-aware recommendations instead of raw sensor data, while ensuring affordability and offline usability.

---

## Solution Overview

The system deploys a low-cost field unit equipped with soil moisture, temperature, humidity, and light sensors to monitor farm-level micro-climate conditions. Data is processed locally on a Raspberry Pi 5 using an edge-first architecture.

A hybrid intelligence approach is used, combining agronomy-based rule logic for immediate alerts with a lightweight machine learning model trained on local data to predict short-term crop stress and irrigation risk.

---

## Key Features

- Real-time monitoring of soil and environmental parameters  
- Edge-based processing for offline and low-latency operation  
- Hybrid AI using rules and machine learning  
- Short-term crop stress and irrigation risk prediction  
- Localized weather-aware advisories  
- Simple farmer-friendly dashboard  
- Government scheme awareness module  
- Modular and scalable architecture  

---

## System Architecture

1. Field sensors collect real-time soil and climate data  
2. ESP32 transmits sensor data to Raspberry Pi 5  
3. Edge AI engine performs risk assessment and prediction  
4. Decision logic generates actionable advisories  
5. Dashboard displays recommendations to the user  

---

## Technology Stack

**Hardware**
- Soil Moisture Sensor  
- DHT11 / DHT22 Temperature & Humidity Sensor  
- LDR Light Sensor  
- ESP32 Microcontroller  

**Edge & Backend**
- Raspberry Pi 5  
- Node.js  
- Express.js  
- MQTT  

**AI & Data**
- Python  
- Scikit-learn  
- Pandas  
- NumPy  

**Frontend**
- HTML  
- CSS  
- JavaScript  
- React.js  
- Chart.js  

**Database**
- Firebase Firestore  
- Local CSV / JSON storage  

---

## Government Scheme Awareness

This module informs farmers about active agricultural schemes, subsidies, MSP announcements, and crop insurance programs. It highlights eligibility details and important deadlines in a simple, farmer-friendly format.

---

## Social and Economic Impact

KrishiRakshak AI empowers farmers with timely, localized, and explainable advisories. By reducing crop losses and input wastage, the system supports income stability, climate resilience, and inclusive access to agricultural intelligence.

---

## Project Status

This project is developed as a working Proof of Concept for a hackathon and demonstrates the feasibility of edge-AI based agricultural decision support systems in real-world conditions.

---

## Team

Built with a strong focus on practical deployment, rapid prototyping, and real agricultural challenges faced by Indian smallholder farmers.

