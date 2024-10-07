document.addEventListener("DOMContentLoaded", function () {
    const closeButton = document.querySelector(".close-button");
    const loginInfo = document.querySelector(".login-info");
    const loginForm = document.querySelector(".login-form");
    const registerLink = document.getElementById("registerLink");

    // Close login information display
    closeButton.addEventListener("click", () => {
        loginInfo.style.display = "none";
    });

    // Function to encrypt the password
    function encryption(password) {
        return btoa(password); // Base64 encoding for demonstration; use a stronger method for production
    }

    // Helper function to get query parameters from the URL
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

        // Debugging log for NIC and password
        console.log("Attempting login with NIC:", nic, "and encrypted password:", password);

        // Check for a matching customer with the provided NIC and password
        let customer = customers.find(c => c.customerNicnumber === nic && c.password === password);

        // If the customer is found, proceed to login
        if (customer) {
            document.getElementById('demo1').innerHTML = "Login successful!";
            document.getElementById('logincontinue').style.display = "none";
            document.getElementById('deleteX').style.display = "none";

            const loggedUser = { "customerNicnumber": customer.customerNicnumber, "password": customer.password };
            localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

            const userProfileData = JSON.parse(localStorage.getItem('userProfileData')) || [];
            let uProfileData = userProfileData.find(p => p.customerNicnumber === loggedUser.customerNicnumber);

            // Redirect based on verification status and carId presence
            if (!carId) {
                window.location.href = `../Landing_Page/index.html`;
            } else {
                if (uProfileData && uProfileData.profileStatus === "Verified") {
                    window.location.href = `../Verified_Customer/Verified_Customer.html?carid=${carId}&customerid=${customer.customerId}`;
                } else {
                    window.location.href = `../Profile_Details/profileupdateform.html?carid=${carId}&customerid=${customer.customerId}`;
                }
            }
        } else {
            // Log the failure for debugging
            console.log("Login failed for NIC:", nic, "with encrypted password:", password);
            document.getElementById('demo1').innerHTML = "Incorrect NIC or password.";
            document.getElementById('logincontinue').style.display = "none";
            document.getElementById('deleteX').style.display = "none";
        }

        // Clear the form fields after submission
        event.target.reset();
    });
});
