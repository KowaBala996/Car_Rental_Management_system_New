document.addEventListener("DOMContentLoaded", function () {
    const carId = getQueryParam('carid');
    
    const registerCustomer = JSON.parse(localStorage.getItem('userProfileData')) || [];

    function Encryption(password) {
        return btoa(password);
    }

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    function generateUniqueId() {
        return 'cust_' + Math.floor(Math.random() * 1000);
    }

    function validatePassword(password) {
        const passwordErrors = [];
        if (password.length < 8) {
            passwordErrors.push('Password must be at least 8 characters long.');
        }
        if (!/[a-z]/.test(password)) {
            passwordErrors.push('Password must contain at least one lowercase letter.');
        }
        if (!/[A-Z]/.test(password)) {
            passwordErrors.push('Password must contain at least one uppercase letter.');
        }
        if (!/\d/.test(password)) {
            passwordErrors.push('Password must contain at least one digit.');
        }
        if (!/[@$!%*?&]/.test(password)) {
            passwordErrors.push('Password must contain at least one special character.');
        }
        return passwordErrors;
    }

    document.getElementById('show-password').addEventListener('change', function () {
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmpassword');
        const inputType = this.checked ? 'text' : 'password';
        passwordInput.type = inputType;
        confirmPasswordInput.type = inputType;
    });

    document.getElementById('registerForm').addEventListener('submit', function (event) {
        event.preventDefault();  

        const customerName = document.getElementById('name').value.trim();
        const customerPhone = document.getElementById('phone').value.trim();
        const customerEmail = document.getElementById('email').value.trim().toLowerCase(); 
        const customerNicnumber = document.getElementById('nic').value.trim().toUpperCase();     
        const password = document.getElementById('password').value.trim();
        const confirmPassword = document.getElementById('confirmpassword').value.trim();
        const validatemessage = document.getElementById("Message");

        validatemessage.innerHTML = '';
        validatemessage.style.cssText = "font-size: 16px; width: 70%; text-align: center; background-color: lightblue;";

        if (!customerName) {
            validatemessage.innerHTML = 'Please enter your name.';
            return;
        }

        if (!customerPhone || !/^(?:\+94|0)\d{9}$/.test(customerPhone)) {
            validatemessage.innerHTML = 'Please enter a valid phone number in the format +94 123456789.';
            return;
        }

        if (!customerEmail || !/\S+@\S+\.\S+/.test(customerEmail)) {
            validatemessage.innerHTML = 'Please enter a valid email address.';
            return;
        }

        if (!customerNicnumber || !/^\d{9}[vVxX]$|^\d{12}$/.test(customerNicnumber)) {
            validatemessage.innerHTML = 'Please enter a valid NIC number (either 9 digits followed by V/v/X/x or 12 digits).';
            return;
        }

        const passwordErrors = validatePassword(password);
        if (passwordErrors.length > 0) {
            validatemessage.innerHTML = passwordErrors.join('<br>');  
            return;
        }

        if (password !== confirmPassword) {
            validatemessage.innerHTML = 'Passwords do not match.';
            return;
        }

        const isEmailDuplicate = registerCustomer.some(customer => customer.customerEmail === customerEmail);
        const isNicDuplicate = registerCustomer.some(customer => customer.customerNicnumber === customerNicnumber);
        const isPhoneDuplicate = registerCustomer.some(customer => customer.customerPhone === customerPhone);

        if (isEmailDuplicate) {
            validatemessage.innerHTML = 'The email is already registered.';
            return;
        }

        if (isNicDuplicate) {
            validatemessage.innerHTML = 'The NIC is already registered.';
            return;
        }

        if (isPhoneDuplicate) {
            validatemessage.innerHTML = 'The phone number is already registered.';
            return;
        }

        const encryptedPassword = Encryption(password);

        const uniqueId = generateUniqueId();

        const customer = { customerId: uniqueId, customerName, customerPhone, customerEmail, customerNicnumber, password: encryptedPassword, carId };

        registerCustomer.push(customer);
        localStorage.setItem("userProfileData", JSON.stringify(registerCustomer));

        validatemessage.innerHTML = "Registered successfully!";

        if (carId != null) {
            window.location.href = `../Customer_login/login.html?carid=${carId}`;
        } else {
            window.location.href = `../Customer_login/login.html`;
        }

        this.reset();
    });
});
