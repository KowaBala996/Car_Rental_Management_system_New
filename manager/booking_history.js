document.addEventListener("DOMContentLoaded", () => {
    const bookingHistoryTable = document.getElementById("booking-history");

    // Function to load booking history from the server
    async function loadBookingHistory() {
        try {
            const response = await fetch('http://localhost:5255/api/Booking'); 

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const rentalCarDetails = await response.json(); 

            // Check if rentalCarDetails is an array and has at least one booking
            if (Array.isArray(rentalCarDetails) && rentalCarDetails.length > 0) {
                rentalCarDetails.forEach(rentalCarDetail => {
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
                });
            } else {
                // If there is no booking history, show a message
                const row = document.createElement("tr");
                row.innerHTML = `<td colspan="9">No booking history available.</td>`;
                bookingHistoryTable.appendChild(row);
            }
        } catch (error) {
            console.error("Error loading booking history:", error);
            const row = document.createElement("tr");
            row.innerHTML = `<td colspan="9">Error loading booking history. Please try again later.</td>`;
            bookingHistoryTable.appendChild(row);
        }
    }

    // Call the function to load the booking history when the page is loaded
    loadBookingHistory();
});
