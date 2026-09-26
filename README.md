# 🛡️ DisasterShield AI

> AI-powered disaster prediction, risk assessment, emergency response, evacuation support, and citizen safety platform.

## 📌 Overview

**DisasterShield AI** is a disaster management platform designed to connect citizens and authorities through a unified system for disaster monitoring, risk awareness, emergency alerts, evacuation support, shelter management, and rescue coordination.

The platform consists of two primary interfaces:

- 👤 **Citizen Platform** — Helps citizens understand emergency situations, receive alerts, find emergency facilities, identify safer locations, navigate toward shelters, and request assistance.
- 🏛️ **Authority Platform** — Helps authorities monitor disaster conditions, manage shelters, monitor SOS situations, manage evacuation progress, and coordinate emergency response.

The platform also supports an **Offline Mode** inside the Citizen Platform so that important cached emergency information can remain accessible when internet connectivity is unavailable.

---

## 🎯 Objectives

The main objectives of DisasterShield AI are to:

- Predict and identify potential disaster risks.
- Provide timely emergency information to authorities and citizens.
- Visualize critical, medium-risk, and safer zones.
- Recommend suitable emergency shelters.
- Support safer evacuation planning.
- Provide emergency SOS functionality.
- Allow citizens to report hazards.
- Help authorities monitor emergency situations.
- Manage shelter capacity and occupancy.
- Support evacuation monitoring.
- Improve communication between authorities and affected citizens.
- Provide important emergency information during network outages.

---

# ✨ Key Features

## 👤 Citizen Platform

The Citizen Platform provides citizens with disaster-related information, emergency assistance, shelter recommendations, risk visualization, and evacuation support.

### 🚨 Emergency Alerts

Citizens can receive emergency information and alerts regarding potential disaster situations.

The Citizen Dashboard displays the current connectivity status and provides access to normal online services or the Offline Dashboard when network connectivity is unavailable.

---

### 🏠 Smart Shelter Recommendation

The platform provides emergency shelter recommendations to help citizens identify suitable shelters.

Citizens can:

- View available shelters.
- View shelter information.
- Select a shelter.
- Start safe navigation.
- Follow a route toward the selected shelter.
- Mark the shelter as reached after arriving.

When a citizen marks a shelter as reached, the shelter occupancy is updated automatically.

---

### 🗺️ Live Risk Map

The Live Risk Map provides a visual representation of disaster risk zones.

Risk areas are represented using different colors:

| Color | Meaning |
|-------|---------|
| 🔴 Red | Critical / High-risk zone |
| 🟡 Yellow | Medium-risk zone |
| 🟢 Green | Safer zone |
| 🔵 Blue | Citizen location |
| ⚫ Black | Rescue team location |

The map supports emergency navigation and helps guide citizens toward safer areas and emergency facilities.

The safe-navigation workflow uses route information to identify a suitable route toward the selected emergency destination.

---

### 🧭 Safe Navigation

Citizens can start navigation from the Smart Shelter section.

The navigation system provides:

- Selected shelter destination.
- Route visualization.
- Route distance.
- Estimated route duration.
- Risk-aware route selection.
- Shelter arrival confirmation.

The existing Smart Shelter and Live Risk Map workflow remains connected as part of the Citizen Platform.

---

### ⏱️ Next 30-Minutes Action Plan

Provides an action-oriented emergency plan intended to help citizens understand what actions they should take during an emergency situation.

---

### 🆘 Emergency SOS

Citizens can send an emergency SOS signal when assistance is required.

SOS information can be monitored by the Authority Platform for emergency response.

---

### ⚠️ Hazard Report

Citizens can report hazards or dangerous situations.

The platform supports storing emergency reports locally when the citizen is operating in Offline Mode.

---

### 🏥 Emergency Centres

The Citizen Platform provides access to emergency-related locations such as:

- 🏠 Shelters
- 🏥 Hospitals
- 👮 Police stations
- 🚒 Fire stations
- 💧 Emergency water points
- 🆘 Relief centres
- 🚧 Evacuation locations

---

### 👤 Citizen Profile

Citizens can access and manage their profile information.

---

# 📡 Online & Offline Mode

DisasterShield AI supports two operating modes within the Citizen Platform.

```text
Citizen Platform
│
├── 🌐 Online Mode
│   ├── Citizen Dashboard
│   ├── Emergency Alerts
│   ├── Smart Shelter
│   ├── Live Risk Map
│   ├── Safe Navigation
│   ├── Action Plan
│   ├── Emergency SOS
│   ├── Hazard Reports
│   └── Emergency Centres
│
└── 📵 Offline Mode
    └── Offline Dashboard
        ├── Cached Emergency Map
        ├── Saved Emergency Resources
        ├── Emergency Instructions
        ├── Offline SOS
        ├── Offline Hazard Reports
        └── Synchronization Status