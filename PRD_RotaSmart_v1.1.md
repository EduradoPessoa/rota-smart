# RotaSmart — Product Requirements Document

| Field | Value |
|---|---|
| **Version** | 1.1 |
| **Status** | MVP — In Development |
| **Date** | March 1, 2026 |
| **Language** | Application UI in Brazilian Portuguese (pt-BR) |
| **Revision** | Critical review applied |

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Target Audience](#2-target-audience)
3. [Business Objectives & Success Criteria](#3-business-objectives--success-criteria)
4. [Core Features — Current Scope](#4-core-features--current-scope)
5. [Out of Scope (MVP)](#5-out-of-scope-mvp)
6. [Technical Requirements](#6-technical-requirements)
7. [User Stories & Acceptance Criteria](#7-user-stories--acceptance-criteria)
8. [Known MVP Limitations](#8-known-mvp-limitations)
9. [Security & Compliance (LGPD)](#9-security--compliance-lgpd)
10. [Roadmap](#10-roadmap)

---

## 1. Product Overview

**RotaSmart** is a logistics management platform designed to optimize last-mile delivery operations. The system uses Artificial Intelligence (Gemini API) to transform raw order data into optimized delivery routes, enabling logistics companies to reduce operational costs and improve fleet efficiency through intelligent region-based clustering and real-time visualization.

The current scope covers the **MVP** — a web application targeting small-to-medium logistics operations (5 to 50 drivers), with data stored locally in the browser.

> **⚠️ Geocoding Limitation in MVP:** The current version uses approximate coordinates based on ZIP code ranges, *not* real address-level geocoding. This means the optimized route sequence is a regional estimate, not a precise GPS route. Replacement with a real geocoding API is planned in the roadmap (Q2 2026).

> **🌐 Language Note:** All UI copy, labels, error messages, and notifications are written in **Brazilian Portuguese (pt-BR)**. This document (the PRD) is written in English for cross-functional alignment.

---

## 2. Target Audience

### 2.1 Logistics Manager

| Attribute | Detail |
|---|---|
| **Daily volume** | 30–80 orders/day |
| **Team size** | 5–20 drivers |
| **Digital maturity** | Medium |
| **Primary needs** | Macro view of operations, performance metrics by region, fuel cost reduction |

### 2.2 Dispatch Operator

| Attribute | Detail |
|---|---|
| **Daily activity** | Processes order lists; currently uses spreadsheets |
| **Digital maturity** | Basic to medium |
| **Primary needs** | Quickly organize order lists, eliminate manual data entry, assign routes per driver |

### 2.3 Driver / Delivery Person

| Attribute | Detail |
|---|---|
| **Device** | Smartphone |
| **Daily stops** | 10–40 deliveries per day |
| **Digital maturity** | Low — unfamiliar with complex apps |
| **Primary needs** | Clear delivery sequence, GPS integration, simple and objective interface |

---

## 3. Business Objectives & Success Criteria

### 3.1 Strategic Objectives

- **Cost Reduction:** Minimize total distance traveled through AI-optimized routes.
- **Operational Agility:** Automate order data extraction (OCR/NLP) to eliminate manual data entry.
- **Transparency:** Provide visual monitoring of delivery progress.

### 3.2 MVP Success Metrics

The product will be considered validated when the following metrics are achieved within 60 days of use:

| Metric | Target | How to Measure | Priority |
|---|---|---|---|
| AI data extraction accuracy | ≥ 90% of fields correctly populated | Manual audit of import samples | 🔴 Critical |
| Route assembly time | < 3 min for batches of up to 50 orders | Timing during user testing sessions | 🔴 Critical |
| Estimated distance reduction | ≥ 15% vs. manual sequence of the same list | Comparison of total calculated distance | 🟡 Important |
| Adoption rate (week 2) | ≥ 70% of operators return after onboarding | Unique sessions per week | 🟡 Important |
| Net Promoter Score (NPS) | ≥ 40 after 30 days of use | In-app survey at end of week 4 | 🔵 Monitoring |

---

## 4. Core Features — Current Scope

### 4.1 AI-Powered Order Processing

- **Smart Import:** File upload (TXT/CSV/PDF) where AI automatically extracts: Customer name, Address, ZIP code (CEP), and Order value.
- **Data Enrichment:** Automatic "Region" assignment based on pre-configured ZIP code ranges.
- **Extraction Error Handling:** Fields that the AI fails to identify are highlighted in red, allowing manual review before confirming the import.

> **ℹ️ Capacity Limit:** Maximum upload of **5 MB** per file · Batches of up to **100 orders** per import.

### 4.2 Region Management

- **Zone Configuration:** Interface to define region names and their respective ZIP code ranges (Start and End CEP).
- **Local Persistence:** Region configurations are stored in the browser (localStorage). Data may be lost when clearing browser cache — see Section 8.

### 4.3 Route Optimization

- **AI Routing:** Algorithm that reorders the delivery sequence to prioritize geographic proximity (ZIP code-based in MVP).
- **Region Filter:** Ability to optimize routes for a specific city zone.

> **⚠️ MVP Accuracy:** Optimization is based on approximate coordinates derived from ZIP code ranges, not real addresses. Routes may not reflect the actual shortest path.

> **ℹ️ Capacity Limit:** Optimization of up to **50 orders** per Gemini API call.

### 4.4 Visualization & Monitoring

- **Interactive Map:** Leaflet integration displaying numbered delivery markers and route lines.
- **Route Demo Mode:** A "Play" feature that simulates vehicle movement between waypoints, updating order status. *This is a demonstration feature — it does not represent real-time GPS tracking of the driver.*
- **Metrics Dashboard:** Charts showing order volume by region and delivery status (Recharts).

### 4.5 Support Tools

- **Google Maps Integration:** Shortcut to open addresses directly in external GPS navigation.
- **Quick Copy:** Button to copy addresses to clipboard.

---

## 5. Out of Scope (MVP)

The following features are explicitly **excluded** from this cycle to maintain MVP focus:

| Feature | Reason | Expected Release |
|---|---|---|
| User authentication / login | Local data, no server | Q3 2026 |
| Real address-level geocoding | API cost and complexity | Q2 2026 |
| Mobile app for drivers | Separate platform scope | Q3 2026 |
| Freight cost calculation | Depends on real geocoding | Q4 2026 |
| ERP / external system integration | Out of phase 1 scope | Future |
| SLA tracking & automated delivery notifications | Requires backend and multi-user support | Future |
| Real-time GPS tracking of drivers | Requires mobile app and server | Q4 2026 |

---

## 6. Technical Requirements

### 6.1 Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS |
| **AI** | Gemini 2.0 Flash (`@google/genai`) |
| **Maps** | Leaflet.js |
| **Charts** | Recharts |
| **Icons** | Lucide React |

### 6.2 System Requirements

- **Geolocation:** Browser permission to identify current position (optional for the driver).
- **Connectivity:** Required for Gemini API calls and map tile loading.
- **Supported browsers:** Chrome 110+, Firefox 110+, Safari 16+, Edge 110+.

### 6.3 Capacity Limits (MVP)

| Parameter | Limit | Behavior When Exceeded |
|---|---|---|
| Max file size (upload) | 5 MB | Show error message before submission |
| Orders per import | 100 orders | Truncate with user warning |
| Orders per optimization call | 50 orders | Suggest region filter before optimizing |
| Configured regions | 20 regions | Block creation with warning message |

---

## 7. User Stories & Acceptance Criteria

---

### US-001 · Dispatch Operator — Smart Import

> *"As a Dispatch Operator, I want to upload a disorganized list of addresses so that the AI automatically creates a structured table."*

**Acceptance Criteria:**

- [ ] The generated table contains Customer, Address, ZIP code, and Value for ≥ 90% of records in the file.
- [ ] Fields that fail extraction are highlighted in red and allow inline manual editing before confirmation.
- [ ] The system displays a summary of how many records were successfully extracted vs. flagged with errors.
- [ ] The import process completes in under 30 seconds for files up to 5 MB.

---

### US-002 · Logistics Manager — Region Configuration

> *"As a Logistics Manager, I want to define that ZIP codes 01000 to 02000 belong to 'Região Centro' so that new orders are automatically classified."*

**Acceptance Criteria:**

- [ ] The interface allows creating, editing, and deleting regions with name, start ZIP code, and end ZIP code.
- [ ] Orders imported after configuration automatically receive the correct region.
- [ ] Overlapping ZIP code ranges are detected and flagged with a warning before saving.
- [ ] Settings persist after page reload (localStorage).

---

### US-003 · Driver / Delivery Person — Route Visualization

> *"As a Driver, I want to see the exact delivery sequence on the map so I don't waste time in traffic."*

**Acceptance Criteria:**

- [ ] The map displays numbered markers in the optimized delivery sequence.
- [ ] Clicking a marker shows the full address.
- [ ] The "Open in Google Maps" button launches navigation for the selected address.
- [ ] The route is displayed within 5 seconds after optimization completes.

---

### US-004 · Dispatch Operator — AI Extraction Error Handling

> *"As a Dispatch Operator, when the AI fails to extract a field, I want to be alerted and be able to correct it manually before confirming the import."*

**Acceptance Criteria:**

- [ ] Fields with extraction failures are visually highlighted in red in the review table.
- [ ] Failed fields are editable inline directly in the table.
- [ ] The "Confirm Import" button remains disabled while mandatory fields are empty.
- [ ] The system logs how many fields were manually corrected per session (for future analysis).

---

## 8. Known MVP Limitations

| Limitation | Impact | Mitigation | Resolution Timeline |
|---|---|---|---|
| Data stored only in browser (localStorage) | Data loss when clearing cache; no cross-user sharing | Display persistent warning; offer CSV export | Cloud migration at ≥ 50 monthly active users |
| Simulated geocoding via ZIP code ranges | Routes may not reflect the actual shortest path | Clearly communicate limitation in UI; label routes as "Estimated Route" | Q2 2026 — Google Maps / OpenStreetMap Geocoding API |
| Demonstrative tracking mode (no real GPS) | Delivery status does not reflect driver's real position | Label as "Demo Mode"; remove any UI suggesting live tracking | Q4 2026 — Driver App with real GPS |
| No authentication / multi-user support | Data shared on the same machine without access control | Recommend dedicated device per operator | Q3 2026 — Login system and cloud sync |

---

## 9. Security & Compliance (LGPD)

> **🔒 Sensitive Data Notice:** The system processes customer addresses and order values — data subject to the Brazilian General Data Protection Law (*Lei Geral de Proteção de Dados* — LGPD, Law 13.709/2018).

### 9.1 MVP Posture

- All data is stored **exclusively on the user's device** (no transmission to application servers).
- Files sent to the Gemini API are processed according to [Google's Privacy Policy](https://policies.google.com/privacy). It is recommended to anonymize real customer data before using the system in testing environments.
- No telemetry or analytics are collected in the MVP.

### 9.2 Requirements Before Cloud Launch

- [ ] Define legal basis for data processing (consent or legitimate interest).
- [ ] Implement data retention and deletion policy.
- [ ] Add informed consent flow during account creation.
- [ ] Engage a DPO (Data Protection Officer) or specialized legal counsel before cloud launch.

---

## 10. Roadmap

> **Dependency Note:** The roadmap is ordered by technical dependencies. Real geocoding is a prerequisite for the Mobile App, which is a prerequisite for Freight Calculation and Real GPS Tracking. Deviating from this order increases rework risk.

### Q2 2026 — Real Geocoding

Replace approximate ZIP-based coordinates with real address-level geocoding via Google Maps API or OpenStreetMap. This is a **critical dependency** for routes to deliver the promised kilometer-reduction value.

### Q3 2026 — Multi-User & Cloud Sync

Login system and remote data storage. Will unlock collaborative use between operators and managers.
**Entry criterion:** ≥ 50 monthly active users on the MVP.

### Q3 2026 — Driver Mobile App

Simplified mobile version focused on route navigation and delivery confirmation (digital signature). **Requires real geocoding as a prerequisite.**

### Q4 2026 — Freight Calculation & Real GPS Tracking

Cost estimation based on actual route distance. Live driver tracking via mobile app. **Requires Driver Mobile App as a prerequisite.**

### Future — Enterprise Integrations

ERP integration, SLA notifications, multi-tenant support, and advanced analytics.

---

*RotaSmart PRD v1.1 · March 2026 · Confidential — Internal Use Only*
