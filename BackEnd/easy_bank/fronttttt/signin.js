document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the form from submitting the default way

    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch('http://127.0.0.1:5000/signin', { // Ensure the URL is correctly mapped to the login endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || 'Something went wrong');
        }

        const data = await response.json(); // Parse the JSON response

        // Handle admin login success
        if (data.message === 'Login successful' && data.role === 'admin') {
            alert('Admin login successful!');
            console.log('Admin Details:', data);

            // Redirect to the admin dashboard
            window.location.href = 'admin_dashboard.html';

        } else if (data.message === 'Login successful' && data.role === 'user') {
            alert('User login successful!');

            // Redirect to the user dashboard
            window.location.href = 'home_page.html';

        } else {
            alert('Login failed: ' + data.message);
        }

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred: ' + error.message);
    }
});
