# Document Based QA Chat Bot

## Problem Statement

Many website owners want chatbots on their sites to assist visitors, but creating and embedding chatbots can be tricky. They need a user-friendly solution that simplifies chatbot creation, makes it easy to add useful information to chatbots, and allows effortless integration into their websites. This solution aims to help website owners engage with visitors more effectively and improve their websites' user experience.

## Our Solution 

![alt Flow Chat](./flow-chart.png)

# Chatbot App Setup Guide

This guide will walk you through the process of setting up a chatbot application with a Flask backend and a frontend interface. Follow the steps below to get started.

## Prerequisites

Before you begin, ensure that you have the following software installed on your system:

- Python (3.x recommended)
- Flask (Python web framework)
- Node.js and npm (for frontend setup)

## Setup

1. **Clone the repository:**

   ```shell
   git clone <repository-url>
   ```

2. **Excute command for setup environment:**

   ```shell
   ./setup.sh
   ```

3. **Start development server:**

   ```shell
   ./launch-webapp.sh
   ```
The frontend will be available at [http://localhost:3000](http://localhost:3000) (by default).

## Setting Environment Variables
To configure additional environment variables for your application, you can create a .env file in the root directory and define them as follows:

   ```shell
   PINECONE_API_KEY=ENTER_PINECONE_KEY
   POSTGRESQL_CONNECTION_URI=ENTER_POSRGRECONNECTION_URI
   ```

To get pinecone key visit [https://docs.pinecone.io](https://docs.pinecone.io/docs/quickstart#2-get-and-verify-your-pinecone-api-key)


## **For Production:**

1. **Clone the repository:**

   ```shell
   git clone <repository-url>
   ```

2. **Excute command for setup environment:**

   ```shell
   ./setup.sh
   ```

4. **Start backend server:**
   
   ```shell
   cd backend/GPT-Doc-Chatbot
   pip install gunicorn eventlet
   gunicorn -k eventlet -w 1 main_beta:app
   ```

4. **Configure the frontend to communicate with the backend:**

   Update the API endpoint in your frontend code in .env to match the backend URL (e.g., http://127.0.0.1:8000).

4. **Start frontend server:**
   
   ```shell
   cd frontend
   npm run build
   npm run start
   ```

Be sure to configure environment variables, security settings, and database connections as needed.

<br>

## Contact Support
If you encounter any issues or have questions at any stage of the process, please don't hesitate to reach out to our support team at support@example.com. We're here to assist you.
