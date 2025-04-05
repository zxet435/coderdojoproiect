const API_BASE_URL = "http://localhost:3000";

function setupSearch() {
    const searchContainer = document.createElement('div');

    searchContainer.id = 'search-container';
    searchContainer.style.margin = '10px auto';
    searchContainer.style.maxWidth = '600px';
    searchContainer.style.textAlign = 'center';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'search-launch';
    searchInput.placeholder = 'Search launch here';
    searchInput.style.width = '100%';
    searchInput.style.padding = '10px';
    searchInput.style.borderRadius = '8px';
    searchInput.style.border = '1px solid #ccc';

    searchContainer.addEventListener("input", filterLaunches)

    searchContainer.appendChild(searchInput);

    const launchesSpace = document.getElementById('launches');
    launchesSpace.parentNode.insertBefore(searchContainer, launchesSpace);
}

function filterLaunches() {
    const query = document.getElementById('search-launch').value.toLowerCase();
    const launches = document.querySelectorAll(".launch");

    launches.forEach(launch => {
        const name = launch.querySelector('h2').innerText.toLowerCase();

        if(name.includes(query)) {
            launch.style.display = 'block';
        } else {
            launch.style.display = 'none';
        }
    })
}
// Fetch SpaceX Launches
async function fetchLaunches() {
    const response = await fetch(`https://api.spacexdata.com/v4/launches`);
    const launches = await response.json();
    
    const launchesContainer = document.getElementById('launches');
    launchesContainer.innerHTML = ""; // Clear before appending

    launches.forEach(launch => {
        const launchDiv = document.createElement('div');
        launchDiv.className = 'launch';

        // Create an expandable section
        launchDiv.innerHTML = `
            <h2>${launch.name}</h2>
            <p><strong>Date:</strong> ${new Date(launch.date_utc).toLocaleDateString()}</p>
            <p><strong>Details:</strong> ${launch.details || 'No details available'}</p>
            ${launch.links.patch.small ? `<img src="${launch.links.patch.small}" alt="Mission launch" />` : ''}
        `;

        launchesContainer.appendChild(launchDiv);
    });

    setupSearch();
}

function registerUser() {
    const username = document.getElementById("reg-username").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
    const fullname = document.getElementById("reg-fullname").value;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Invalid email format!");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters long!");
        return;
    }

    const user = { username, email, password, fullname };

    // Simulate saving to users.json for testing purposes
    fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Failed to save user");
            }
            return res.json();
        })
        .then(() => {
            // Redirect to success page
            document.body.innerHTML = `
                <h1>Registration Successful!</h1>
                <button class="button" onclick="window.location.href='login.html'">Login</button>
            `;
        })
        .catch(() => {
            alert("Error connecting to the server. Please ensure the backend is running.");
        });
}

function renderRegisterForm() {
    document.getElementById("login-and-register").innerHTML = `
        <h1 class="register-text">Register</h1>
        <div class="inputs">
            <input
                id="reg-username"
                type="text"
                required
                minlength="4"
                maxlength="8"
                placeholder="Username"
                class="input-user"
            />
            <input
                id="reg-email"
                type="email"
                required
                placeholder="Email"
                class="input-email"
            />
            <input
                id="reg-password"
                type="password"
                required
                minlength="4"
                maxlength="8"
                placeholder="Password"
                class="input-pass"
            />
            <input
                id="reg-fullname"
                type="text"
                required
                placeholder="Full Name"
                class="input-fullname"
            />
        </div>
        
        <button 
            class="button button-register" 
            onclick="registerUser()">Register</button>
        
        <div class="already-have-account">Already have an account?</div>
        <button
            class="button button-login"
            onclick="window.location.href='login.html'">Login</button>
    `;
}

fetchLaunches();