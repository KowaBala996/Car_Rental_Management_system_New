// Function to populate the car booking number dropdown from localStorage
function populateCarBookingDropdown() {
    const rentalCarDetail = JSON.parse(localStorage.getItem('rentalCarDetail'));

    // Check if rental car detail exists
    if (rentalCarDetail) {
        const carBookNumberSelect = document.getElementById('carBookNumber');
        const option = document.createElement('option');

        // Create an option element for the rental car ID
        option.value = rentalCarDetail.rentalCarId;
        option.textContent = `Booking ID: ${rentalCarDetail.bookingId} | Car ID: ${rentalCarDetail.rentalCarId}`;

        // Append the option to the select element
        carBookNumberSelect.appendChild(option);

        // Set the start date input to the rentalDateFrom value
        document.getElementById('startDate').value = rentalCarDetail.rentalDateFrom;
    } else {
        console.log("No rental car detail found.");
    }
}

// Function to calculate total amount based on extra payments and display it
function calculateTotal() {
    const extraPaymentInput = document.getElementById('Exra Payment');
    const totalCostInput = document.getElementById('totalLKR');

    // Assuming you want to calculate total cost based on some fixed base amount + extra payment
    const baseAmount = 4000; // Example base amount
    const extraPayment = parseFloat(extraPaymentInput.value) || 0;

    // Calculate the total
    const total = baseAmount + extraPayment;

    // Display the total in the readonly input
    totalCostInput.value = total;
}

// Function to handle form submission
function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get form data
    const formData = new FormData(event.target);
    const userNIC = formData.get('userNIC');
    const returnDate = formData.get('returnDate');
    const remarksCar = formData.get('remarksCar');
    const remarksUser = formData.get('remarksUser');

    // Example: Logging the form data to console
    console.log('User NIC:', userNIC);
    console.log('Return Date:', returnDate);
    console.log('Remarks for Car:', remarksCar);
    console.log('Remarks for User:', remarksUser);

    // You can add more logic here, such as sending the data to a server or updating localStorage.
    alert('Form submitted successfully!');
}

// Function to print receipt (can be customized)
window.printReceipt = () => {
    const form = document.getElementById('car-return-form');
    const receiptContent = `
        Car Booking Number: ${form.carBookNumber.value}\n
        User NIC/Passport No: ${form.userNIC.value}\n
        Start Date: ${form.startDate.value}\n
        Return Date: ${form.returnDate.value}\n
        Extra Payment: ${form["Exra Payment"].value}\n
        Total (LKR): ${form.totalLKR.value}\n
        Remarks for Car: ${form.remarksCar.value}\n
        Remarks for User: ${form.remarksUser.value}
    `;
    const printWindow = window.open('', '', 'width=600,height=400');
    printWindow.document.write('<pre>' + receiptContent + '</pre>');
    printWindow.document.close();
    printWindow.print();
};

// Function to initialize the application
function init() {
    // Populate the dropdown for car booking numbers
    populateCarBookingDropdown();

    // Attach event listener for form submission
    const carReturnForm = document.getElementById('car-return-form');
    carReturnForm.addEventListener('submit', handleFormSubmit);
}

// Call the init function when the page loads
document.addEventListener('DOMContentLoaded', init);
