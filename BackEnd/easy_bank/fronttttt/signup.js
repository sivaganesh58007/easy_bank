document.getElementById('email').addEventListener('blur', function () {
    const email = document.getElementById('email').value;

    // Clear any previous error message
    const emailError = document.getElementById('email-error');
    emailError.textContent = '';

    if (email) {
        // Make a request to check if the email already exists and validate format
        fetch('http://127.0.0.1:5000/check-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        })
        .then(response => response.json())
        .then(data => {
            if (data.exists) {
                // Show the error message if the email already exists
                emailError.textContent = 'This email is already registered.';
            } else if (data.message === 'Invalid email format') {
                emailError.textContent = 'Invalid email format.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            emailError.textContent = 'An error occurred while checking the email.';
        });
    }
});

document.getElementById('registration-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting the default way

    // Check if the email error is already shown
    const emailError = document.getElementById('email-error').textContent;
    if (emailError) {
        alert('Please correct the errors before submitting the form.');
        return; // Do not proceed with the submission
    }

    // Retrieve input values
    const firstName = document.getElementById('first_name').value;
    const lastName = document.getElementById('last_name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phoneNumber = document.getElementById('phone_number').value;
    const dateOfBirth = document.getElementById('date_of_birth').value;

    // Validate password
    const passwordPattern = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!passwordPattern.test(password)) {
        alert('Password must be at least 8 characters long and contain at least one special character and one numeric digit.');
        return;
    }

    // Validate phone number
    if (!/^\d{10}$/.test(phoneNumber)) {
        alert('Phone number must be exactly 10 digits.');
        return;
    }

    // Create formData object
    const formData = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: phoneNumber,
        date_of_birth: dateOfBirth,
        password: password
    };

    // Submit the form data
    fetch('http://127.0.0.1:5000/signup', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(async response => {
        const data = await response.json();
        if (response.ok) {
            alert('Registration successful!');
            window.location.href = 'signin.html'; // Redirect to the login page
        } else {
            // Handle backend validation errors
            if (data.message) {
                alert(data.message);
                document.getElementById('email-error').textContent = data.message;
            } else {
                alert('Error occurred during registration.');
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred: ' + error.message);
    });
});

document.getElementById('signin-link').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior
    window.location.href = 'signin.html'; // Redirect to the login page
});
