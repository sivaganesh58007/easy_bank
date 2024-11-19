document.getElementById('deposit-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the form from submitting the default way

    // Get the input values
    const accountNumber = document.getElementById('account-number').value;
    const amount = document.getElementById('amount').value;

    // Prepare the data to send in the request body
    const formData = {
        account_number: accountNumber,
        amount: parseFloat(amount) // Convert amount to a number
    };

    try {
        // Send POST request to the backend
        const response = await fetch('http://127.0.0.1:5000/deposite', { // Adjust the URL as per your backend configuration
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        // Handle the response
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || 'Deposit failed');
        }

        const data = await response.json(); // Parse the JSON response
        alert(data.message); // Display success message

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred: ' + error.message); // Display error message
    }
});
