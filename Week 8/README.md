# Let's generate a README.md with detailed instructions for setting up MongoDB, getting the connection string, and running the Express server.
readme_content = """
# 📝 Task Manager API with MongoDB (Week 8)

This project connects a MongoDB database to your Express server for full CRUD operations on tasks.

## 🚀 Features
- Express.js REST API
- MongoDB + Mongoose integration
- JWT Authentication
- Task model with validation
- CORS enabled for frontend access

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) installed
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account (free tier)

---

## 🛠️ 1. Setup MongoDB Atlas

### 📌 Create a MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up (or log in)
3. Click **"Build a Database"**
4. Choose **Free Tier** and a **cloud provider/region**
5. Name your cluster and click **Create Cluster**

### 🔐 Create a Database User

1. Click **Database Access** > **Add New Database User**
2. Username: `admin` (or any name)
3. Password: `yourpassword123` (save this somewhere safe)
4. Role: **Atlas Admin** or **Read and Write to Any Database**

### 🌐 Whitelist Your IP

1. Click **Network Access** > **Add IP Address**
2. Choose **Allow Access From Anywhere** (`0.0.0.0/0`)

### 📋 Get Connection String

1. Click **Connect** > **Connect Your Application**
2. Copy the **connection string**, e.g.:


packages installed: 

    npm init -y

    npm i express mongoose cors jsonwebtoken

    node index.js(to run the file)