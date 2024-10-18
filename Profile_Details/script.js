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

        return true; // All validations passed
    }

    function validateLicenseNumber() {
        const licenseNumber = document.getElementById("license-number").value.trim();
        const licenseNumberPattern = /^[A-Z]\d{7,9}$/;

        if (!licenseNumberPattern.test(licenseNumber)) {
            showNotification("Invalid Driving License Number format!");
            return false;
        }
        return true;
    }

    async function saveProfileData() {
        const profileStatus = (licenseFrontInput.files[0] && licenseBackInput.files[0]) ? "Pending" : "Documents upload pending";
        const profileData = {
            customerId: customerid || generateUniqueId(),
            customerName: document.getElementById("name").value || "",
            customerEmail: document.getElementById("email").value || "",
            customerPhone: document.getElementById("phone").value || "",
            customerNicnumber: document.getElementById("customerNicnumber").value || "",
            customerAddress: document.getElementById("address").value || "",
            postalCode: document.getElementById("postal-code").value || "",
            licenseNumber: document.getElementById("license-number").value || "",
            proofType: document.getElementById("proof-type").value || "",
            proofNumber: document.getElementById("proof-number").value || "",
            profileStatus: profileStatus
        };

        try {
            const response = await fetch('/api/saveProfileData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Handle image uploads
            await uploadLicenseImages();
        } catch (error) {
            showNotification("Error saving profile data!");
            console.error("Error saving profile data:", error);
        }
    }

    async function uploadLicenseImages() {
        if (licenseFrontInput.files[0]) {
            const formData = new FormData();
            formData.append('licenseFront', licenseFrontInput.files[0]);
            await fetch('/api/uploadLicenseImage', {
                method: 'POST',
                body: formData
            });
        }

        if (licenseBackInput.files[0]) {
            const formData = new FormData();
            formData.append('licenseBack', licenseBackInput.files[0]);
            await fetch('/api/uploadLicenseImage', {
                method: 'POST',
                body: formData
            });
        }
    }

    async function loadProfileData() {
        try {
            const response = await fetch(`/api/getProfileData?customerid=${customerid}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const currentProfile = await response.json();

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
                    if (carid) {
                        window.location.href = `../Verified_Customer/Verified_Customer.html?carid=${carid}&customerid=${customerid}`;
                    } else {
                        window.location.href = `../Car_Categories/get-car.html?customerid=${customerid}`;
                    }
                }
            } else {
                console.log("No matching profile found for this customer.");
            }
        } catch (error) {
            console.error("Error loading profile data:", error);
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
