document.addEventListener("DOMContentLoaded", () => {


    const carTableBody = document.querySelector(".car-table tbody");
    const carForm = document.getElementById("carForm");
    const modal = document.getElementById("modal");
    const closeBtn = document.querySelector(".closeBtn");
    const addCarBtn = document.querySelector(".add-car");
    const searchInput = document.getElementById("searchInput");

    let cars = [];
    let editingIndex = -1;

    // Function to fetch cars from the API
    async function fetchCars() {
        const response = await fetch('http://localhost:5255/api/Manager/get-all-cars');
        cars = await response.json();
        renderCars();
    }

    // Function to render cars
    function renderCars() {
        carTableBody.innerHTML = "";
        const searchTerm = searchInput.value.toLowerCase();
        const filteredCars = cars.filter(car =>
            car.brand.toLowerCase().includes(searchTerm) ||
            car.bodyType.toLowerCase().includes(searchTerm) ||
            car.model.toLowerCase().includes(searchTerm)
        );

        filteredCars.forEach((car, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${car.id}</td>
                <td>${car.brand}</td>
                <td>${car.bodyType}</td>
                <td>${car.model}</td>
                <td>${car.transmission}</td>
                <td>${car.fuelType}</td>
                <td>${car.numberOfSeats}</td>
                <td>Rs ${car.pricePerHour}</td>
                <td><img src="${car.image}" alt="${car.model}" style="width: 100px; height: auto;" /></td>
                <td>${car.availableFrom}</td>
                <td>${car.availableTo}</td>
                <td>
                    <button class="edit-btn" onclick="editCar(${index})"><i class="fa fa-pencil"></i> Edit</button>
                    <button class="delete-btn" onclick="deleteCar(${car.id})"><i class="fa fa-trash"></i> Delete</button>
                </td>
            `;
            carTableBody.appendChild(row);
        });
    }

    // Validate form inputs
    function validateForm() {
        const priceValue = parseFloat(carForm.price.value);
        const seatsValue = parseInt(carForm.seats.value);
        return !(isNaN(priceValue) || isNaN(seatsValue) || priceValue <= 0 || seatsValue <= 0);
    }

    // Form submission handler
    carForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        const newCar = {
            brand: carForm.brand.value,
            bodyType: carForm.bodyType.value,
            model: carForm.model.value,
            transmission: carForm.transmission.value,
            fuel: carForm.fuelType.value,
            seats: parseInt(carForm.seats.value),
            price: parseFloat(carForm.price.value),
            image: carForm.image.value,
            availableFrom: carForm.availableFrom.value,
            availableTo: carForm.availableTo.value
        };

        if (editingIndex >= 0) {
            // Update existing car
            await fetch(`https://localhost:7175/api/Manager/update-car/${cars[editingIndex].id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCar)
            });
        } else {
            // Add new car
            await fetch('https://localhost:7175/api/Manager/add-car', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCar)
            });
        }

        await fetchCars(); // Refresh the car list
        carForm.reset();
        modal.style.display = "none"; // Hide the modal
    });

    // Edit car function
    window.editCar = async function(index) {
        editingIndex = index;
        const car = cars[index];
        carForm.brand.value = car.brand;
        carForm.bodyType.value = car.bodyType;
        carForm.model.value = car.model;
        carForm.transmission.value = car.transmission;
        carForm.fuelType.value = car.fuelType;
        carForm.seats.value = car.numberOfSeats;
        carForm.price.value = car.pricePerHour;
        carForm.image.value = car.imagePath;
        carForm.availableFrom.value = car.availableFrom;
        carForm.availableTo.value = car.availableTo;

        modal.style.display = "block"; // Display the modal
    };

    // Delete car function
    window.deleteCar = async function(id) {
        if (confirm("Are you sure you want to delete this car?")) {
            await fetch(`https://localhost:7175/api/Manager/delete-car/Car_03/${id}`, {
                method: 'DELETE'
            });
            await fetchCars(); // Refresh the car list
        }
    };

    // Close modal on click
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
        carForm.reset();
    });

    // Add car button to open modal
    addCarBtn.addEventListener("click", () => {
        carForm.reset();
        editingIndex = -1; // Reset the editing index
        modal.style.display = "block";
    });

    // Initial fetch of cars
    fetchCars();
});



