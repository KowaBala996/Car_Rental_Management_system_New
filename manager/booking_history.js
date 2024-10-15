// Ensure the script runs after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    const bookingHistoryTable = document.getElementById("booking-history");

    // Function to load booking history from local storage
    function loadBookingHistory() {
        // Retrieve rental car details from local storage
        const rentalCarDetail = JSON.parse(localStorage.getItem("rentalCarDetail")) || {};

        // Check if rentalCarDetail has the expected structure
        if (rentalCarDetail && rentalCarDetail.bookingId) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${rentalCarDetail.bookingId || 'N/A'}</td>
                <td>${rentalCarDetail.customerId || 'N/A'}</td>
                <td>${rentalCarDetail.rentalCarId || 'N/A'}</td>
                <td>${new Date().toLocaleDateString() || 'N/A'}</td>
                <td>${rentalCarDetail.availableFrom || 'N/A'}</td>
                <td>${rentalCarDetail.availableTo || 'N/A'}</td>
                <td>${rentalCarDetail.halfPayment || '0'}</td>
                <td>${rentalCarDetail.paymentStatus || 'Pending'}</td>
                <td>${(rentalCarDetail.paymentStatus === "Approved") ? "Confirmed" : "Pending"}</td>
            `;
            bookingHistoryTable.appendChild(row);
        } else {
            // If there is no booking history, show a message
            const row = document.createElement("tr");
            row.innerHTML = `<td colspan="9">No booking history available.</td>`;
            bookingHistoryTable.appendChild(row);
        }
    }

    // Call the function to load the booking history when the page is loaded
    loadBookingHistory();
});
