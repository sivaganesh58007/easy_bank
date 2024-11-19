document.getElementById('startTransaction').addEventListener('click', function() {
    const loadingCircle = document.getElementById('loadingCircle');
    const message = document.getElementById('message');

    // Show the loading circle
    loadingCircle.style.display = 'block';
    message.textContent = ''; // Clear any previous messages

    // Simulate transaction process (API call or something)
    setTimeout(() => {
        // Transaction completed
        loadingCircle.style.display = 'none'; // Hide loading circle
        message.textContent = 'Transaction completed successfully!';
    }, 5000);  // Simulate a 5 second delay for the transaction
});
