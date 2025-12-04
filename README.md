# 🛒 VocalMart – AI-Powered Voice-Based Product Search

VocalMart is a full-stack voice-enabled shopping assistant that integrates AI voice transcription with product search capabilities. It combines a React frontend, Spring Boot backend, Flask-based AI voice API (using OpenAI Whisper), and MongoDB – all containerized using Docker.

---

## 🌐 Live Architecture

- 🧠 **Flask (Whisper AI)** – Converts voice input to text
- 🧾 **Spring Boot API** – Handles product data
- 💻 **React Frontend** – User interface for searching products
- 🗄️ **MongoDB** – Stores product information
- 🐳 **Docker Compose** – Orchestrates the whole system

---

## 🚀 How to Run Locally

### Prerequisites
- Docker & Docker Compose installed
- Internet (for downloading Whisper model on first run)

### Steps to Run:

```bash
git clone https://github.com/pooja-s6/vocalmart.git
cd vocalmart
docker-compose up --build
