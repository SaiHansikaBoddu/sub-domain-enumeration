# Subdomain Enumeration Tool

A simple and educational full-stack cybersecurity prototype demonstrating DNS-based subdomain enumeration.

---

## 📌 What is Subdomain Enumeration?

**Subdomain Enumeration** is a fundamental reconnaissance technique used by security professionals and penetration testers to discover valid subdomains of a target domain (for example, `mail.example.com`, `admin.example.com`, or `api.example.com`).

Finding subdomains helps security analysts:
- Map an organization's external attack surface.
- Identify forgotten, exposed, or staging services (e.g., `dev.example.com`, `test.example.com`).
- Ensure all public-facing endpoints are properly protected and configured.

---

## ⚙️ How This Project Works

1. **Frontend Input**: The user enters a target domain name (e.g., `example.com`).
2. **API Call**: The frontend sends an HTTP `POST` request to the Express backend (`http://localhost:5000/api/enumerate`).
3. **DNS Resolution**: The backend tests a curated list of common candidate subdomains (`www`, `mail`, `api`, `dev`, `test`, `staging`, `admin`, `portal`, `blog`).
4. **Resolution Check**: Using Node.js's built-in `dns` module, the backend checks if each candidate subdomain resolves to an active IP address.
5. **Display Results**: Subdomains that successfully resolve are returned with their IP address and displayed in a clean cybersecurity-themed results table.

---

## 🛠️ Technologies Used

### Frontend
- **HTML5**: Semantic UI layout and structures.
- **Vanilla CSS3**: Modern cybersecurity dark interface, glassmorphism, responsive layout, and Google Fonts (`Inter` & `JetBrains Mono`).
- **Vanilla JavaScript & Fetch API**: Client-side validation, asynchronous HTTP communication, and dynamic DOM manipulation (no frontend frameworks used).

### Backend
- **Node.js**: Asynchronous runtime environment.
- **Express.js**: REST API server and routing.
- **CORS**: Cross-Origin Resource Sharing middleware for seamless frontend-backend communication.
- **Node.js `dns` Module**: Native DNS lookup for resolving hostname candidates without external third-party scanning tools.

---

## 📁 Project Folder Structure

```text
Subdomain Enumeration/
│
├── frontend/
│   ├── index.html       # Webpage structure & UI elements
│   ├── style.css        # Cybersecurity dark mode styling
│   └── script.js        # Form handling, Fetch API & DOM updates
│
├── backend/
│   ├── server.js        # Express API server with DNS resolution
│   └── package.json     # Node.js dependencies (express, cors)
│
└── README.md            # Project documentation & usage guide
```

---

## 🚀 How to Install & Run

### Prerequisites
- [Node.js](https://nodejs.org/) (version 14.x or higher installed on your machine)

---

### Step 1: Install Backend Dependencies

Open your terminal, navigate to the `backend` folder, and install the required packages:

```bash
cd backend
npm install
```

---

### Step 2: Start the Backend Server

Run the following command to start the Express API:

```bash
node server.js
```

The backend will start and listen on port 5000:
```text
Subdomain Enumeration Backend running on http://localhost:5000
```

---

### Step 3: Run the Frontend

Simply open the `frontend/index.html` file in your preferred web browser:
- You can double-click `frontend/index.html` in your file explorer, or
- Right-click and choose **Open with Browser** (e.g., Chrome, Edge, Firefox).

---

## 🌐 API Reference

### 1. Root Health Check
- **Endpoint**: `GET /`
- **Response**:
```json
{
  "message": "Subdomain Enumeration API is running"
}
```

---

### 2. Enumerate Subdomains
- **Endpoint**: `POST /api/enumerate`
- **Headers**: `Content-Type: application/json`

#### Example Request
```json
{
  "domain": "example.com"
}
```

#### Example Response (Found Subdomains)
```json
{
  "success": true,
  "domain": "example.com",
  "results": [
    {
      "subdomain": "www.example.com",
      "status": "Found",
      "ip": "93.184.216.34"
    }
  ]
}
```

#### Example Response (No Subdomains Resolved)
```json
{
  "success": true,
  "domain": "example.com",
  "results": []
}
```

#### Example Response (Invalid Input)
```json
{
  "success": false,
  "message": "Invalid domain"
}
```

---

## ⚠️ Ethical & Legal Disclaimer

> [!WARNING]
> This tool is strictly intended for educational and authorized security assessments. Only perform reconnaissance and enumeration against domains that you own or have explicit, documented permission to assess.
