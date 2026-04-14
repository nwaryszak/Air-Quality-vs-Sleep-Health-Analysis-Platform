# Air-Quality-vs-Sleep-Health-Analysis-Platform

This project is a full-stack data analysis platform that compares air quality in cities and villages with human health and sleep-related metrics.

The goal of the project is to analyze how environmental conditions may influence lifestyle and health indicators such as sleep quality, stress level, heart rate, and physical activity.

## Project Overview

The system analyzes and compares relationships between:

- air quality in urban areas
- air quality in rural areas
- sleep duration and sleep quality
- health indicators such as heart rate, blood pressure, BMI
- lifestyle factors such as stress level, physical activity, and occupation

The dataset includes structured information about individuals such as:

- gender
- age
- occupation
- sleep duration
- sleep quality
- physical activity level
- stress level
- BMI category
- blood pressure
- heart rate
- location (city or village)

## Key Features

- analysis of environmental and health data relationships
- comparison of air quality between cities and villages
- patient management system (CRUD operations)
- authentication using JWT
- REST API backend
- import and export of data in JSON and XML format
- data visualization support

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- XML and JSON data processing

### Frontend
- React
- Axios
- React Router

### Data Processing
- JSON dataset
- XML datasets for air quality
- data transformation and mapping

### DevOps / Infrastructure
- Docker
- Docker Compose
- MongoDB container
- Mongo Express
- Prometheus for monitoring
- Grafana for visualization

## Architecture

The application is fully containerized using Docker Compose. It consists of:

- MongoDB database
- backend API server
- React frontend application
- Mongo Express for database management
- Prometheus for metrics collection
- Grafana for monitoring dashboards

All services communicate within a shared Docker network.

## How to run the project

To run the project locally:
docker compose up --build

Then open:

- frontend: http://localhost:3000
- backend API: http://localhost:5000
- mongo express: http://localhost:8081
- grafana: http://localhost:3001
- prometheus: http://localhost:9090
