document.addEventListener("DOMContentLoaded", function () {
    const closeButton = document.querySelector(".close-button");
    const loginInfo = document.querySelector(".login-info");
    const loginForm = document.querySelector(".login-form");
    const registerLink = document.getElementById("registerLink");

    closeButton.addEventListener("click", () => {
        loginInfo.style.display = "none";
    });

    // Function to encrypt the password (placeholder)
    function encryption(password) {
        return btoa(password); // Base64 encoding for demonstration; use a stronger method for production
    }

    // Function to get query parameters from the URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const carId = getQueryParam('carid');

    // Update register link if carId is present
    if (carId) {
        registerLink.href = `../Customer_Register/Register.html?carid=${carId}`;
    }

    // Login form submission event listener
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nic = document.getElementById("nic").value.trim();
        const password = encryption(document.getElementById("password").value); // Encrypt password for comparison

        // Validate that NIC and password fields are not empty
        if (!nic || !password) {
            document.getElementById('demo1').innerHTML = "NIC or Password cannot be empty.";
            return;
        }

        // Send login request to the server
        try {
            const response = await fetch('https://localhost:7175/api/Customer/Get-All-Customer', { // Replace with your actual login endpoint
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ customerNicnumber: nic, password: password })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const customer = await response.json();

            // Handle successful login
            if (customer) {
                document.getElementById('demo1').innerHTML = "Login successful! Redirecting...";
                document.getElementById('logincontinue').style.display = "none";
                document.getElementById('deleteX').style.display = "none";

                // Delay for 100 milliseconds before redirecting
                setTimeout(() => {
                    const loggedUser = { "customerNicnumber": customer.customerNicnumber, "password": customer.password };
                    localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

                    // Redirect based on verification status and carId presence
                    if (!carId && customer.profileStatus === "Verified") {
                        window.location.href = `../Landing_Page/index.html`;
                    } else {
                        if (customer.profileStatus === "Verified") {
                            window.location.href = `../Verified_Customer/Verified_Customer.html?carid=${carId}&customerid=${customer.customerId}`;
                        } else {
                            window.location.href = `../Profile_Details/profileupdateform.html?carid=${carId}&customerid=${customer.customerId}`;
                        }
                    }
                }, 100); // Adjust the time as needed

            } else {
                document.getElementById('demo1').innerHTML = "Incorrect NIC or password.";
                document.getElementById('logincontinue').style.display = "none";
                document.getElementById('deleteX').style.display = "none";
            }

        } catch (error) {
            console.error(error);
            document.getElementById('demo1').innerHTML = "Error during login. Please try again.";
            document.getElementById('logincontinue').style.display = "none";
            document.getElementById('deleteX').style.display = "none";
        }

        // Clear the form fields after submission
        event.target.reset();
    });
});





/*document.addEventListener("DOMContentLoaded", function () {
    const closeButton = document.querySelector(".close-button");
    const loginInfo = document.querySelector(".login-info");
    const loginForm = document.querySelector(".login-form");
    const registerLink = document.getElementById("registerLink");

    closeButton.addEventListener("click", () => {
        loginInfo.style.display = "none";
    });

    function encryption(password) {
        return btoa(password); // Base64 encoding for demonstration; use a stronger method for production
    }

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const carId = getQueryParam('carid');

    // Update register link if carId is present
    if (carId) {
        registerLink.href = `../Customer_Register/Register.html?carid=${carId}`;
    }

    // Login form submission event listener
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const customers = JSON.parse(localStorage.getItem('userProfileData')) || [];

        const nic = document.getElementById("nic").value.trim();
        const password = encryption(document.getElementById("password").value); // Encrypt password for comparison

        // Validate that NIC and password fields are not empty
        if (!nic || !password) {
            document.getElementById('demo1').innerHTML = "NIC or Password cannot be empty.";
            return;
        }

        // Check for a matching customer with the provided NIC and password
        let customer = customers.find(c => c.customerNicnumber === nic && c.password === password);

        if (customer) {
            document.getElementById('demo1').innerHTML = "Login successful! Redirecting...";
            document.getElementById('logincontinue').style.display = "none";
            document.getElementById('deleteX').style.display = "none";

            // Delay for 100 milliseconds before redirecting
            setTimeout(() => {
                const loggedUser = { "customerNicnumber": customer.customerNicnumber, "password": customer.password };
                localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

                // Redirect based on verification status and carId presence
                if (!carId && customer.profileStatus === "Verified") {
                    window.location.href = `../Landing_Page/index.html`;
                } else {
                    if (customer.profileStatus === "Verified") { // Ensure uProfileData is defined and used properly
                        window.location.href = `../Verified_Customer/Verified_Customer.html?carid=${carId}&customerid=${customer.customerId}`;
                    } else {
                        window.location.href = `../Profile_Details/profileupdateform.html?carid=${carId}&customerid=${customer.customerId}`;
                    }
                }
            }, 100); // Adjust the time as needed

        } else {
            document.getElementById('demo1').innerHTML = "Incorrect NIC or password.";
            document.getElementById('logincontinue').style.display = "none";
            document.getElementById('deleteX').style.display = "none";
        }

        // Clear the form fields after submission
        event.target.reset();
    });
});
*/