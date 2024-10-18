
// Function to populate the rentalCarId select box with data from the server
async function populateRentalCarIdOptions() {
    try {
        const response = await fetch('http://localhost:5255/api/RentalDetail'); // Fetch rental car details
        if (!response.ok) throw new Error('Network response was not ok');
        const rentalCarDetail = await response.json(); // Parse JSON response
        const rentalCarIdSelect = document.getElementById("rentalCarId");

        rentalCarIdSelect.innerHTML = '<option value=""></option>'; // Clear existing options

        rentalCarDetail.forEach(booking => {
            const option = document.createElement('option');
            option.value = booking.rentalCarId; // Assuming rentalCarId is stored
            option.textContent = booking.rentalCarId; // Display it
            rentalCarIdSelect.appendChild(option);
        });

        // Event listener to update startDate input when a rentalCarId is selected
        rentalCarIdSelect.addEventListener('change', function() {
            const selectedRentalCarId = this.value; // Get selected rentalCarId
            const selectedCar = rentalCarDetail.find(car => car.rentalCarId === selectedRentalCarId); // Find the selected car details

            // If the selected car exists, update the startDate input with rentalDateFrom
            if (selectedCar) {
                document.getElementById('startDate').value = selectedCar.rentalDateFrom;
            } else {
                document.getElementById('startDate').value = ''; // Clear if no car found
            }
        });
    } catch (error) {
        console.error("Error fetching rental car details:", error);
    }
}

// Handle form submission
document.getElementById('booking-form').addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent form submission
    const rentalCarId = document.getElementById('rentalCarId').value; // Get rentalCarId from the select box
    const startDate = document.getElementById('startDate').value;
    const returnDate = document.getElementById('returnDate').value;
    const extraPayment = parseFloat(document.getElementById('extraPayment').value);

    const newBooking = {
        rentalCarId,  // Store rentalCarId
        startDate,
        returnDate,
        extraPayment,
    };

    try {
        const response = await fetch('http://localhost:5255/api/Booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newBooking),
        });

        if (!response.ok) throw new Error('Network response was not ok');

        // Successfully submitted the booking
        populateTable(); // Update table with the new booking
        populateRentalCarIdOptions(); // Update select options if needed
    } catch (error) {
        console.error("Error submitting booking:", error);
    }
});

// Populate the table with data from the server
async function populateTable() {
    try {
        const response = await fetch('/api/bookings'); // Fetch booking data from the server
        if (!response.ok) throw new Error('Network response was not ok');
        const rentalCarDetail = await response.json(); // Parse JSON response
        const tableBody = document.querySelector('.car-table tbody');
        tableBody.innerHTML = ''; // Clear existing rows

        rentalCarDetail.forEach(booking => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${booking.rentalCarId}</td>
                <td>${booking.startDate}</td>
                <td>${booking.returnDate}</td>
                <td>${booking.extraPayment}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading bookings:", error);
    }
}

// Modal functionality
const modal = document.getElementById("myModal");
const btn = document.getElementById("openModalBtn");
const span = document.getElementById("closeModalBtn");

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// Populate table and select options on page load
document.addEventListener("DOMContentLoaded", function() {
    populateTable();
    populateRentalCarIdOptions();
});







/*// Function to populate the rentalCarId select box with data from localStorage
function populateRentalCarIdOptions() {
    const rentalCarDetail = JSON.parse(localStorage.getItem("rentalCarDetail")) || [];
    const rentalCarIdSelect = document.getElementById("rentalCarId");

    rentalCarIdSelect.innerHTML = '<option value=""></option>'; // Clear existing options

    rentalCarDetail.forEach(booking => {
        const option = document.createElement('option');
        option.value = booking.rentalCarId; // Assuming rentalCarId is stored
        option.textContent = booking.rentalCarId; // Display it
        rentalCarIdSelect.appendChild(option);
    });

    // Event listener to update startDate input when a rentalCarId is selected
    rentalCarIdSelect.addEventListener('change', function() {
        const selectedRentalCarId = this.value; // Get selected rentalCarId
        const selectedCar = rentalCarDetail.find(car => car.rentalCarId === selectedRentalCarId); // Find the selected car details

        // If the selected car exists, update the startDate input with rentalDateFrom
        if (selectedCar) {
            document.getElementById('startDate').value = selectedCar.rentalDateFrom;
        } else {
            document.getElementById('startDate').value = ''; // Clear if no car found
        }
    });
}

// Handle form submission
document.getElementById('booking-form').addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission
    const rentalCarId = document.getElementById('rentalCarId').value; // Get rentalCarId from the select box
    const startDate = document.getElementById('startDate').value;
    const returnDate = document.getElementById('returnDate').value;
    const extraPayment = parseFloat(document.getElementById('extraPayment').value);

    const newBooking = {
        rentalCarId,  // Store rentalCarId
        startDate,
        returnDate,
        extraPayment,
    };

    const existingBookings = JSON.parse(localStorage.getItem("returnDetal")) || [];
    existingBookings.push(newBooking);
    localStorage.setItem("returnDetal", JSON.stringify(existingBookings));

    populateTable(); // Update table with the new booking
    populateRentalCarIdOptions(); // Update select options if needed
});

// Populate the table with data from localStorage
function populateTable() {
    const rentalCarDetail = JSON.parse(localStorage.getItem("returnDetal")) || [];
    const tableBody = document.querySelector('.car-table tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    rentalCarDetail.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${booking.rentalCarId}</td>
            <td>${booking.startDate}</td>
            <td>${booking.returnDate}</td>
            <td>${booking.extraPayment}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Modal functionality
const modal = document.getElementById("myModal");
const btn = document.getElementById("openModalBtn");
const span = document.getElementById("closeModalBtn");

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// Populate table and select options on page load
document.addEventListener("DOMContentLoaded", function() {
    populateTable();
    populateRentalCarIdOptions();
});
*/