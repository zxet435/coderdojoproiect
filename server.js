const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = 3000;
const USERS_FILE = "users.json";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Load users from file
const loadUsers = () => {
    if (!fs.existsSync(USERS_FILE)) return [];
    const data = fs.readFileSync(USERS_FILE);
    return JSON.parse(data);
};

// Save users to file
const saveUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Fetch SpaceX Launches
app.get("/launches", async (req, res) => {
    try {
        const response = await axios.get("https://api.spacexdata.com/v4/launches");
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch SpaceX launches." });
    }
});

// Get all users
app.get("/users", (req, res) => {
    res.json(loadUsers());
});

// Register new user
app.post("/users", (req, res) => {
    console.log("Received request body:", req.body);
    const { username, password, email, fullname } = req.body;
    let users = loadUsers();

    if (users.find(u => u.username === username)) {
        return res.status(400).json({ error: "Username already taken!" });
    }

    users.push({ username, password, email, fullname });
    saveUsers(users);
    res.json({ message: "User registered successfully!" });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});