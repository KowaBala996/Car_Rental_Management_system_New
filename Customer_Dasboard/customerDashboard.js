document.addEventListener('DOMContentLoaded', () => {
    const userDetailsContainer = document.getElementById('user-details-container');
    const bookingHistoryContainer = document.getElementById('booking-history');
    const userNameDisplay = document.getElementById('user-name');
    const logoutButton = document.getElementById('logout-button');

    // Fetch user data from local storage
    const userRequests = JSON.parse(localStorage.getItem('userProfileData')) || [];
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser')) || {};

    // Display user's name or NIC number
    if (loggedUser.nic) {
        userNameDisplay.textContent = `You loged in with NIC Number ${loggedUser.nic}!`;
    } else if (userRequests.length > 0) {
        userNameDisplay.textContent = `You loged in with NIC Number ${userRequests[0].name}!`;
    }
    
    // Make the user name visible with fade-in effect
    userNameDisplay.style.opacity = 1;

    // Populate user details on the dashboard
    function populateUserDetails() {
        userDetailsContainer.innerHTML = ''; // Clear previous content
        userRequests.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.classList.add('user-details');
            userDiv.innerHTML = `
                <h2>${user.name}</h2>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone:</strong> ${user.phone}</p>
                <p><strong>Address:</strong> ${user.address}</p>
                <p><strong>License Number:</strong> ${user.licenseNumber}</p>
                <p><strong>Proof Type:</strong> ${user.proofType}</p>
                <p><strong>Postal Code:</strong> ${user.postalCode}</p>
                <p><strong>Status:</strong> ${user.status}</p>
                <div>
                    <strong>License Images:</strong><br>
                    <img src="${user.licenseFrontImage}" alt="License Front" style="width:100px;height:auto;margin-right:10px;">
                    <img src="${user.licenseBackImage}" alt="License Back" style="width:100px;height:auto;">
                </div>
            `;
            userDetailsContainer.appendChild(userDiv);
        });
    }

    // Fetch booking data from local storage and render it in the table
    function renderBookings() {
        const bookings = JSON.parse(localStorage.getItem('bookingData')) || [];
        // Clear existing rows
        bookingHistoryContainer.innerHTML = '';

        // Check if there are any bookings
        if (bookings.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="9" style="text-align:center;">No bookings available.</td>';
            bookingHistoryContainer.appendChild(row);
            return;
        }

        // Loop through bookings and create table rows
        bookings.forEach(booking => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${booking.id}</td>
                <td>${booking.customerName}</td>
                <td>${booking.carModel}</td>
                <td>${booking.bookingDate}</td>
                <td>${booking.rentalStartDate}</td>
                <td>${booking.rentalEndDate}</td>
                <td>${booking.paymentAmount}</td>
                <td>${booking.paymentStatus}</td>
                <td>${booking.status}</td>
            `;
            bookingHistoryContainer.appendChild(row);
        });
    }

    // Initialize the dashboard with user data and bookings
    populateUserDetails();
    renderBookings();

    // Logout Functionality
    logoutButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default anchor behavior

        // Clear user-related data from local storage
        localStorage.removeItem('loggedUser');
        localStorage.removeItem('userProfileData');
        localStorage.removeItem('bookingData');
        localStorage.removeItem('lastCarDetail'); // If applicable
        localStorage.removeItem('payments'); // If applicable

        // Optionally, you can clear all local storage
        // localStorage.clear();

        // Redirect to the Landing Page
        window.location.href = '../Landing_Page/index.html';
    });
});