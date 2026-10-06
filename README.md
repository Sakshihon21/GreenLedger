# 🌱 GreenLedger

## IoT and AI-Based Carbon Emission Monitoring & Carbon Credit Management Platform

**B.Tech Final Year Major Project | 2026–2027**

GreenLedger is an IoT and AI-powered platform designed to monitor carbon emissions, calculate carbon footprints, forecast future emissions, detect anomalous activity, verify carbon reductions, and manage carbon credits through a digital marketplace.

---

## 📌 Project Overview

GreenLedger integrates:

* 🌍 Carbon emission monitoring
* 📡 IoT-based environmental sensing
* 🧮 Carbon calculation engine
* 🌳 Plantation-based carbon offsets
* 🤖 LSTM emission forecasting
* 🔍 Isolation Forest anomaly detection
* 💳 Digital carbon-credit wallet
* 🏪 Carbon-credit marketplace
* 🛡️ Monitoring-authority verification
* 📊 Interactive web dashboard

---

## 🎯 Problem Statement

Current emission reporting systems often depend on self-declared data and are difficult to verify in real time.

GreenLedger aims to provide an integrated platform that can:

1. Collect environmental data through IoT devices.
2. Calculate carbon emissions using standard emission factors.
3. Forecast future emissions.
4. Detect anomalous or potentially fraudulent activity.
5. Support carbon-credit verification and management.
6. Provide a transparent digital marketplace.

---

## 💡 Proposed Solution

```text
ESP32 + Environmental Sensors
            │
            ▼
      MQTT Broker
        (HiveMQ)
            │
            ▼
      FastAPI Backend
            │
            ▼
    Sensor Data Validation
            │
            ▼
       PostgreSQL
            │
            ▼
  Carbon Calculation Engine
            │
            ▼
   Carbon Credit Generation
            │
       ┌────┴────┐
       ▼         ▼
      LSTM   Isolation Forest
       │         │
       ▼         ▼
   Forecast   Anomaly Detection
       │         │
       └────┬────┘
            ▼
 Monitoring & Verification
            │
            ▼
        REST APIs
            │
            ▼
      React Dashboard
            │
      ┌─────┼─────┐
      ▼     ▼     ▼
   Seller  Buyer  Authority
```

---

## 🏗️ System Architecture

```text
IoT Layer
ESP32 + Sensors
      │
      ▼
Communication Layer
MQTT / HiveMQ
      │
      ▼
Backend Layer
FastAPI
      │
      ├──────────────┐
      ▼              ▼
PostgreSQL       Carbon Engine
      │              │
      └──────┬───────┘
             ▼
        AI Layer
     ┌───────┴────────┐
     ▼                ▼
    LSTM        Isolation Forest
     │                │
     └───────┬────────┘
             ▼
       REST API Layer
             │
             ▼
       React Frontend
```

---

## 🛠️ Technology Stack

### IoT

| Technology      | Purpose                                |
| --------------- | -------------------------------------- |
| ESP32           | IoT controller and Wi-Fi communication |
| MH-Z19B / MQ135 | CO₂ / air-quality monitoring           |
| BME280 / DHT22  | Temperature and humidity monitoring    |
| MQTT            | IoT data communication                 |
| HiveMQ          | MQTT broker                            |

### Backend

| Technology  | Purpose              |
| ----------- | -------------------- |
| Python 3.11 | Backend development  |
| FastAPI     | REST API development |
| SQLAlchemy  | Database ORM         |
| PostgreSQL  | Data storage         |
| Alembic     | Database migrations  |
| Pydantic    | Data validation      |

### AI / ML

| Technology         | Purpose                   |
| ------------------ | ------------------------- |
| TensorFlow / Keras | LSTM emission forecasting |
| Scikit-learn       | Isolation Forest          |
| Pandas             | Data preprocessing        |
| NumPy              | Numerical computation     |

### Frontend

| Technology       | Purpose                      |
| ---------------- | ---------------------------- |
| React.js         | Web dashboard                |
| Charting Library | Data visualization           |
| jsPDF            | PDF reports and certificates |

### Development

| Technology     | Purpose                          |
| -------------- | -------------------------------- |
| Git            | Version control                  |
| GitHub         | Collaboration and source control |
| GitHub Actions | CI / automation                  |
| Docker         | Containerization                 |
| Postman        | API testing                      |

---

## 🧠 AI Components

### LSTM Forecasting

Historical emission and sensor data will be processed and used to forecast future CO₂ emissions.

```text
Historical Data
      ↓
Data Preprocessing
      ↓
Feature Engineering
      ↓
Sequence Generation
      ↓
LSTM Model
      ↓
Emission Forecast
```

### Isolation Forest

Isolation Forest will identify unusual emission or carbon-credit activity for further review.

```text
Emission / Credit Data
          ↓
Feature Preparation
          ↓
Isolation Forest
          ↓
Anomaly Score
          ↓
Authority Review
```

> AI predictions support monitoring and decision-making. Carbon-credit eligibility remains governed by the deterministic carbon calculation and verification workflow.

---

## 🧮 Carbon Calculation

```text
Electricity / Fuel Consumption
             ↓
        Activity Data
             ↓
     Emission Factor
             ↓
        CO₂ Emission
             ↓
      Baseline Comparison
             ↓
      Emission Reduction
             ↓
         Verification
             ↓
    Eligible Carbon Credits
```

The project covers electricity, diesel, petrol, and natural-gas consumption using standard emission factors.

---

## 👥 User Roles

| Role                 | Main Responsibility                             |
| -------------------- | ----------------------------------------------- |
| Organization         | Monitor emissions and manage carbon activities  |
| Seller               | Offer verified carbon credits                   |
| Buyer                | Purchase and manage credits                     |
| Monitoring Authority | Review anomalies and verify eligible activities |

---

## 👨‍💻 Project Team

| Member                        | Responsibility                                                          |
| ----------------------------- | ----------------------------------------------------------------------- |
| **Hon Sakshi Santosh**        | Backend, REST APIs, database, authentication, carbon engine, deployment |
| **Matkar Omkar Mangesh**      | ESP32, sensors, MQTT, IoT integration                                   |
| **Vadtke Kunal Mahachindra**  | React frontend, UI/UX, dashboard, reports, API integration              |
| **Wakchaure Shraddha Sanjay** | LSTM, preprocessing, analytics, forecasting                             |

---

## 📁 Repository Structure

```text
GreenLedger/
│
├── backend/              # FastAPI backend
├── frontend/             # React frontend
├── iot/                  # ESP32 and MQTT implementation
├── ai/                   # AI/ML implementation
├── datasets/             # Datasets
├── docs/                 # Project documentation
├── screenshots/          # Application screenshots
├── demo/                 # Demo resources
│
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
└── .gitignore
```

---

## 📊 Project Status

🚧 **Currently in Development**

| Component          | Status         |
| ------------------ | -------------- |
| Project Setup      | 🟢 Completed   |
| GitHub Repository  | 🟢 Completed   |
| Backend Foundation | 🟡 In Progress |
| Database           | 🟡 In Progress |
| Authentication     | ⚪ Planned      |
| IoT + MQTT         | ⚪ Planned      |
| Carbon Engine      | ⚪ Planned      |
| AI Models          | ⚪ Planned      |
| React Dashboard    | ⚪ Planned      |
| Marketplace        | ⚪ Planned      |
| Testing            | ⚪ Planned      |
| Deployment         | ⚪ Planned      |

Project progress will be maintained through **GitHub Issues, Milestones, Pull Requests, Projects, and GitHub Actions**.

---

## 🎓 Academic Information

**Institution:** Sanjivani College of Engineering, Kopargaon
**Department:** Information Technology
**Program:** Final Year B.Tech
**Academic Year:** 2026–2027
**Project Type:** Major Project
**Project Code:** SCOE_IT_09
**Guide:** Prof. U. B. Sangule

---

## 📚 Documentation

Detailed documentation will be maintained separately:

```text
docs/
│
├── 01-project-overview/
├── 02-requirements/
├── 03-system-design/
├── 04-database/
├── 05-iot/
├── 06-carbon-engine/
├── 07-ai/
├── 08-backend/
├── 09-frontend/
├── 10-testing/
├── 11-deployment/
├── 12-results/
└── 13-final-report/
```

---

## 📄 Expected Deliverables

* Project Report
* Working Prototype
* Dataset and Experimental Results
* Research Paper / Conference Paper
* Copyright Registration

---

## 🔬 Research Paper

### Proposed Title

**GreenLedger: An IoT and AI-Based Framework for Real-Time Carbon Credit Generation and Fraud-Resistant Marketplace Trading**

---

## ⚠️ Project Scope

GreenLedger is an **academic prototype**.

The current project scope does not include:

* Actual distributed blockchain implementation
* Legal certification of carbon credits
* Large-scale industrial deployment
* Commercial production deployment
* Full regulatory compliance

These may be considered as future enhancements.

---

## 🔮 Future Scope

* Blockchain-based carbon-credit registry
* Larger IoT deployments
* Advanced forecasting models
* External carbon registry integration
* Regulatory compliance
* Commercial-scale deployment
* Advanced carbon-market integrations

---

## ⭐ Project Vision

> **Measure emissions. Predict the future. Detect anomalies. Verify reductions. Manage carbon credits transparently.**

---

**GreenLedger — IoT + AI Carbon Emission Monitoring & Carbon Credit Management Platform**
