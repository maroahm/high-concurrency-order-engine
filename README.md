# ⚡ Serverless Flash-Sale Backend

[![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Infrastructure as Code](https://img.shields.io/badge/IaC-AWS%20SAM-orange?style=for-the-badge)](https://aws.amazon.com/serverless/sam/)

A high-concurrency e-commerce order processing system built to handle sudden traffic spikes (Flash Sales) using an event-driven, serverless architecture on AWS.

## 📌 The Problem
Traditional e-commerce backends often crash during **"Flash Sales"** because the synchronous connection between the API and the Database becomes a bottleneck. When thousands of users click "Buy" simultaneously, the database cannot process writes fast enough, leading to system failure and lost orders.

## 🚀 The Solution: "Load Leveling"
This project implements an **Asynchronous Request-Reply Pattern**. By using **AWS SQS** as a buffer, we decouple the order ingestion from the database processing. This allows the system to accept orders at lightning speed and process them at a steady, manageable rate.

### Architectural Highlights:
*   **Asynchronous Processing:** API responds with `202 Accepted` in < 50ms, ensuring a smooth user experience.
*   **Load Leveling:** SQS prevents DynamoDB write-throttling by buffering requests.
*   **Infrastructure as Code (IaC):** Entire stack is defined and deployed via **AWS SAM**.
*   **On-Demand Scaling:** Zero-management scaling with AWS Lambda and DynamoDB (Pay-per-request).

---

## 🏗️ System Architecture

```mermaid
graph LR
    User([User/Client]) -- "POST /orders" --> APIGW(API Gateway)
    APIGW --> Producer[Producer Lambda]
    Producer -- "Push Message" --> SQS{SQS Queue}
    SQS -- "Batch Trigger (10)" --> Worker[Worker Lambda]
    Worker -- "PutItem" --> Dynamo[(DynamoDB Table)]