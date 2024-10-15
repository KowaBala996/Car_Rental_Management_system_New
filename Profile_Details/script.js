document.addEventListener("DOMContentLoaded", function () {
    const profileForm = document.getElementById("profile-form");
    const licenseFrontInput = document.getElementById("license-front");
    const licenseBackInput = document.getElementById("license-back");
    const licenseFrontPreview = document.getElementById("licenseFrontPreview");
    const licenseBackPreview = document.getElementById("licenseBackPreview");
    const notificationDiv = document.querySelector(".notification");

    const carid = getQueryParam('carid');
    const customerid = getQueryParam('customerid');

    loadProfileData();

    licenseFrontInput.addEventListener("change", function () {
        previewImage(licenseFrontInput, licenseFrontPreview);
    });

    licenseBackInput.addEventListener("change", function () {
        previewImage(licenseBackInput, licenseBackPreview);
    });

    profileForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Validate all fields before saving the data
        if (!validateCustomerDetails() || !validateLicenseNumber()) {
            return; // Stop form submission if any validation fails
        }

        saveProfileData();
        showNotification("Profile updated successfully!");
    });

    function previewImage(inputElement, previewElement) {
        const file = inputElement.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            previewElement.style.display = "block";
            previewElement.src = e.target.result;
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    function validateCustomerDetails() {
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const address = document.getElementById("address").value.trim();
        const postalCode = document.getElementById("postal-code").value.trim();

        if (!name) {
            showNotification("Name is required!");
            return false;
        }
        if (!email) {
            showNotification("Email is required!");
            return false;
        }
        if (!phone) {
            showNotification("Phone number is required!");
            return false;
        }
        if (!address) {
            showNotification("Address is required!");
            return false;
        }
        if (!postalCode) {
            showNotification("Postal Code is required!");
            return false;
        }

        // You can add further email/phone validation here if necessary

        return true; // All validations passed
    }

    function validateLicenseNumber() {
        const licenseNumber = document.getElementById("license-number").value.trim();

        // Regex to match Sri Lankan Driving License Number format
        const licenseNumberPattern = /^[A-Z]\d{7,9}$/; // Adjusted to match the format

        if (!licenseNumberPattern.test(licenseNumber)) {
            showNotification("Invalid Driving License Number format!");
            return false;
        }
        return true;
    }

    function saveProfileData() {
        const profileStatus = (licenseFrontInput.files[0] && licenseBackInput.files[0]) ? "Pending" : "Documents upload pending";
        let userData = JSON.parse(localStorage.getItem('userProfileData')) || [];
        const selectedCustomer = userData.find(customer => customer.customerId == customerid);

        const profileData = {
            customerId: customerid || generateUniqueId(),
            customerName: selectedCustomer ? selectedCustomer.customerName : "",
            customerEmail: selectedCustomer ? selectedCustomer.customerEmail : "",
            customerPhone: selectedCustomer ? selectedCustomer.customerPhone : "",
            customerNicnumber: selectedCustomer ? selectedCustomer.customerNicnumber : "",
            password: selectedCustomer ? selectedCustomer.password : "",


            customerAddress: document.getElementById("address").value || "",
            postalCode: document.getElementById("postal-code").value || "",
            licenseNumber: document.getElementById("license-number").value || "",
            proofType: document.getElementById("proof-type").value || "",
            proofNumber: document.getElementById("proof-number").value || "",
            profileStatus: profileStatus
        };

        console.log("Profile Data to be saved:", profileData);

        const existingProfileIndex = userData.findIndex(profile => profile.customerId === customerid);
        if (existingProfileIndex !== -1) {
            userData[existingProfileIndex] = profileData;  // Update existing profile
        } else {
            userData.push(profileData);  // Add new profile
        }

        console.log("Updated user data before saving:", userData);

        try {
            localStorage.setItem("userProfileData", JSON.stringify(userData));

            if (licenseFrontInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    localStorage.setItem("licenseFrontImage", e.target.result);
                };
                reader.readAsDataURL(licenseFrontInput.files[0]);
            }

            if (licenseBackInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    localStorage.setItem("licenseBackImage", e.target.result);
                };
                reader.readAsDataURL(licenseBackInput.files[0]);
            }

        } catch (error) {
            showNotification("Error saving profile data!");
            console.error("Error saving to localStorage", error);
        }
    }

    function loadProfileData() {
        const storedProfileData = JSON.parse(localStorage.getItem("userProfileData")) || [];
        console.log("Stored Profile Data:", storedProfileData);

        if (storedProfileData.length > 0) {
            const currentProfile = storedProfileData.find(profile => profile.customerId === customerid);
            console.log("Current Profile:", currentProfile);

            if (currentProfile) {
                document.getElementById("name").value = currentProfile.customerName || "";
                document.getElementById("email").value = currentProfile.customerEmail || "";
                document.getElementById("phone").value = currentProfile.customerPhone || "";
                document.getElementById("address").value = currentProfile.customerAddress || "";
                document.getElementById("customerNicnumber").value = currentProfile.customerNicnumber || "";

                document.getElementById("postal-code").value = currentProfile.postalCode || "";
                document.getElementById("license-number").value = currentProfile.licenseNumber || "";
                document.getElementById("proof-type").value = currentProfile.proofType || "";
                document.getElementById("proof-number").value = currentProfile.proofNumber || "";

                const verificationStatusSpan = document.querySelector(".verification-status .status");
                verificationStatusSpan.textContent = currentProfile.profileStatus || "Pending";

                // Set fields as read-only
                document.getElementById("name").readOnly = true;
                document.getElementById("email").readOnly = true;
                document.getElementById("phone").readOnly = true;
                document.getElementById("customerNicnumber").readOnly = true;
                


                if (currentProfile.profileStatus === "Verified") {
                    if(carid){
                        window.location.href = `../Verified_Customer/Verified_Customer.html?carid=${carid}&customerid=${customerid}`;

                    }else{
                        window.location.href = `../Car_Categories/get-car.html?customerid=${customerid}`;

                    }
                }
            } else {
                console.log("No matching profile found for this customer.");
            }
        }

        const storedLicenseFrontImage = localStorage.getItem("licenseFrontImage");
        if (storedLicenseFrontImage) {
            licenseFrontPreview.src = storedLicenseFrontImage;
            licenseFrontPreview.style.display = "block";
        }

        const storedLicenseBackImage = localStorage.getItem("licenseBackImage");
        if (storedLicenseBackImage) {
            licenseBackPreview.src = storedLicenseBackImage;
            licenseBackPreview.style.display = "block";
        }
    }

    function showNotification(message) {
        notificationDiv.textContent = message;
        notificationDiv.style.display = "block";

        setTimeout(() => {
            notificationDiv.style.display = "none";
        }, 5000);
    }

    document.querySelector('.user-dropdown').addEventListener('click', function () {
        const content = document.querySelector('.user-dropdown-content');
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
    });

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    function generateUniqueId() {
        return 'id-' + Math.random().toString(36).substr(2, 16);
    }
    document.addEventListener("DOMContentLoaded", function () {
        const logoutButton = document.getElementById('logoutButton');
    
        // Logout function to clear loggedUser from localStorage and redirect
        logoutButton.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent the default anchor behavior
    
            // Remove loggedUser from localStorage
            localStorage.removeItem('loggedUser');
    
            // Redirect to the login page after logout
            window.location.href = '../Customer_login/login.html';
        });
    });
    
});
