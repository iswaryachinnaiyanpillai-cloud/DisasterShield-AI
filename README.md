# 🛡️ DisasterShield AI

> AI-powered disaster prediction, risk assessment, emergency response, and evacuation support platform designed to improve disaster preparedness and community safety.

## 📌 Overview

**DisasterShield AI** is a disaster management platform that connects citizens and authorities through a unified system for disaster monitoring, risk awareness, emergency alerts, evacuation support, and rescue coordination.

The platform is designed with two primary interfaces:

- 👤 **Citizen Platform** — Helps citizens understand emergency situations, identify safer locations, receive alerts, and access emergency assistance.
- 🏛️ **Authority Platform** — Helps authorities monitor disaster conditions, analyze risk information, manage emergencies, coordinate rescue operations, and support evacuation decisions.

The system combines disaster intelligence, risk visualization, emergency communication, shelter recommendations, and rescue management into a single platform.

---

## 🎯 Objectives

The main objectives of DisasterShield AI are to:

- Predict and identify potential disaster risks.
- Provide timely emergency information to authorities and citizens.
- Visualize critical, medium-risk, and safer zones.
- Recommend suitable emergency shelters.
- Support evacuation planning.
- Provide emergency SOS functionality.
- Help authorities coordinate rescue operations.
- Improve communication between authorities and affected citizens.
- Provide a centralized platform for disaster response and preparedness.

---

## ✨ Key Features

### 👤 Citizen Platform

The Citizen Platform is designed to provide citizens with important disaster-related information and emergency assistance.

#### 🚨 Emergency Alerts

Citizens can receive emergency information and alerts regarding potential disaster situations.

#### 🏠 Smart Shelter Recommendation

The platform provides shelter recommendations to help citizens identify suitable emergency shelters.

Users can select a recommended shelter and start navigation through the risk map.

#### 🗺️ Live Risk Map

The Live Risk Map provides a visual representation of disaster risk zones.

Risk areas are represented using different colors:

- 🔴 **Red** — Critical / High-risk zone
- 🟡 **Yellow** — Medium-risk zone
- 🟢 **Green** — Safer zone
- 🔵 **Blue** — Citizen location

The map is intended to support safer evacuation decisions and guide citizens toward safer areas and emergency facilities.

#### ⏱️ Next 30-Minutes Action Plan

Provides an action-oriented emergency plan intended to help citizens understand what they should do during an emergency situation.

#### 🆘 Emergency SOS

Citizens can send an emergency SOS signal when assistance is required.

#### ⚠️ Hazard Report

Citizens can report hazards or dangerous situations to support disaster monitoring and response.

#### 🏥 Emergency Centres

Provides access to emergency-related locations and services such as:

- Shelters
- Hospitals
- Police stations
- Fire stations
- Relief centres
- Evacuation locations

#### 👤 Citizen Profile

Citizens can access and manage their profile information.

---

# 🏛️ Authority Platform

The Authority Platform provides tools for disaster monitoring, emergency intelligence, evacuation management, and rescue coordination.

### 📊 Authority Dashboard

A centralized dashboard for monitoring disaster-related information and emergency activities.

### 🧠 Emergency Intelligence

Provides authorities with disaster intelligence and relevant emergency information to support response operations.

### 📈 Analytics

Provides analytical information that can assist authorities in understanding disaster-related conditions and response requirements.

### 🌎 Disaster Digital Twin

The planned disaster digital twin provides a digital representation of the affected environment, including elements such as:

- Terrain
- Roads
- Buildings
- Rivers
- Population distribution
- Emergency shelters
- Hospitals
- Disaster propagation

The concept supports time-based disaster analysis and visualization.

### 🔮 What-If Prediction

Allows authorities to explore potential disaster scenarios and analyze possible outcomes.

### 🏠 Shelter Management

Authorities can manage and monitor emergency shelters and related information.

### 🚑 Rescue Team Management

Provides functionality for managing rescue teams during emergency situations.

### 🆘 Authority SOS Monitoring

Authorities can monitor incoming SOS situations from citizens and coordinate appropriate emergency response.

### 🚧 Evacuation Management

Supports evacuation planning and monitoring during disaster situations.

### 👤 Authority Profile

Provides profile and account functionality for authority users.

---

# 🗺️ Risk Visualization

DisasterShield AI uses visual risk zones to help users understand disaster conditions.

| Zone | Meaning |
|------|---------|
| 🔴 Red | Critical / High Risk |
| 🟡 Yellow | Medium Risk |
| 🟢 Green | Safer Zone |
| 🔵 Blue | Citizen Location |
| ⚫ Black | Rescue Team Location |

The risk visualization is intended to make emergency information easier to understand during time-sensitive situations.

---

# 🏗️ System Architecture

The project consists of a frontend application and a backend API.

```text
                    ┌─────────────────────┐
                    │    DisasterShield   │
                    │         AI          │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
        ┌───────▼────────┐           ┌────────▼───────┐
        │ Citizen        │           │ Authority      │
        │ Platform       │           │ Platform       │
        └───────┬────────┘           └────────┬───────┘
                │                             │
                └──────────────┬──────────────┘
                               │
                       ┌───────▼────────┐
                       │   FastAPI      │
                       │    Backend     │
                       └───────┬────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
          ┌─────▼─────┐  ┌─────▼─────┐  ┌────▼─────┐
          │ AI / Risk │  │ Services  │  │ Database │
          │ Analysis  │  │           │  │          │
          └───────────┘  └───────────┘  └──────────┘

          DisasterShield AI
│
├── Overview
├── Objectives
├── Key Features
│   ├── Citizen Platform
│   └── Authority Platform
├── Risk Visualization
├── System Architecture
├── Technology Stack
├── Project Structure
├── Getting Started
│   ├── Frontend
│   └── Backend
├── Running the Application
├── Future Enhancements
├── Project Status
└── Contributors