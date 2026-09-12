# 🛒 Multi-Vendor E-Commerce Marketplace Management System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-brightgreen?style=for-the-badge&logo=vercel)](https://multi-vendor-e-commerce-marketplace-seven.vercel.app/)
[![Repository](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/rifat104/Multi-Vendor-E-Commerce-Marketplace-Management-System)
[![Course](https://img.shields.io/badge/Course-CSE%20347-orange?style=for-the-badge)](https://www.ewubd.edu/)

A comprehensive, scalable multi-vendor e-commerce platform designed to bridge local merchants with online consumers. Developed as part of the **Information System Design and Analysis (CSE 347)** curriculum at **East West University**[cite: 1].

---

## 📌 Executive Summary

Modern small-to-medium business owners face severe operational fragmentation, relying on disconnected communication channels like Facebook Messenger and WhatsApp for order management, manual inventory updates, and external courier services. 

Based on primary field research and surveys across seven business sectors (electronics, fashion, groceries, perfumes, mobile accessories, etc.), this system unifies order tracking, vendor catalog management, multi-channel payment verification, and delivery assignment into a single, cohesive workflow.

---

## 👥 Key System Stakeholders

| Stakeholder | Role & Core Responsibilities |
| :--- | :--- |
| **Customer / Buyer** | Browses product listings, filters items, places orders, completes payments via automated/MFS routes, and tracks shipment statuses. |
| **Vendor / Seller** | Manages stock availability, updates product catalogs, processes incoming orders, requests payouts, and configures store policies. |
| **Administrator** | Approves vendor registrations, verifies manual MFS payments, resolves disputes, manages user access, and monitors system analytics. |
| **Delivery Personnel** | Accepts delivery task assignments, collects Cash-on-Delivery (COD) payments, updates fulfillment progress, and remits collected funds. |
| **Payment Gateway** | Handles online transactions securely (MFS integration like bKash/Nagad, Cards, and COD verification). |

---

## ⚙️ Core Architecture & Diagrams

The system architecture and operational workflows are fully documented through standardized UML modeling:

* **Use Case Diagram:** Maps interaction boundaries for Customers, Vendors, Delivery Agents, and Administrators.
* **Entity-Relationship (ER) Diagram:** Documents underlying schema structures (`USERS`, `VENDORS`, `PRODUCTS`, `ORDERS`, `PAYOUT_REQUESTS`, `DELIVERY_AGENTS`, `REVIEWS`, `NOTIFICATIONS`).
* **Class Diagram:** Details Object-Oriented representations including domain models, properties, methods, and relationships.
* **Data Flow Diagram (DFD):** Maps data transformations between external entities, transaction processors, and database stores.
* **Activity & Sequence Diagrams:** Captures end-to-end workflows for MFS Payment Verification (bKash/Nagad), Order Processing, Delivery Assignment, and Admin Marketplace Management.
* **Component & Deployment Diagrams:** Defines system modularity and infrastructure configuration across web applications, database nodes, and external API services.

---

## 🚀 Key Functional Features

* **Real-time Inventory & Order Control:** Automated stock decrement upon successful checkout with vendor order notifications.
* **Flexible Payment Gateway:** Supports multi-channel checkout including Cash on Delivery (COD), bKash, Nagad, Debit/Credit Card, and Bank Transfer.
* **Manual MFS Verification Engine:** Built-in workflow for Admin validation of TrxID and mobile numbers for mobile financial payments.
* **Delivery & Logistics Tracking:** Synchronized status updates (Pending, Confirmed, Shipped, Out for Delivery, Delivered, Failed) integrated with courier workflows.
* **Automated Analytics & Reporting:** Vendors and Admins can generate sales summaries, monitor store performance, and manage payout requests.

---

## 👥 Project Team

**Course:** CSE 347: Information System Design and Analysis (Section 04, Group 07)[cite: 1]  
**Institution:** East West University[cite: 1]  
**Submitted To:** Md Sabbir Hossain, Department of Computer Science & Engineering[cite: 1]

* **Rifat Hossain Fahim** — *ID: 2024-1-60-054*[cite: 1]
* **Mehedi Hasan Bappi** — *ID: 2024-1-60-086*[cite: 1]
* **S.M. Jeshan Mahmud** — *ID: 2024-1-60-093*[cite: 1]

---

## 🔗 Links & Resources

* **Live Platform Application:** [https://multi-vendor-e-commerce-marketplace-seven.vercel.app/](https://multi-vendor-e-commerce-marketplace-seven.vercel.app/)
* **GitHub Repository:** [https://github.com/rifat104/Multi-Vendor-E-Commerce-Marketplace-Management-System](https://github.com/rifat104/Multi-Vendor-E-Commerce-Marketplace-Management-System)
