document.getElementById('get-details-btn').addEventListener('click', async () => {
    try {
        const response = await fetch('http://127.0.0.1:5000/getdetails', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        const users = data.users;

        const tableBody = document.getElementById('user-table-body');
        tableBody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.user_id}</td>
                <td>${user.first_name}</td>
                <td>${user.last_name}</td>
                <td>${user.email}</td>
                <td>${user.phone_number}</td>
                <td>${user.date_of_birth}</td>
                <td>${user.account_number || 'N/A'}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        alert('An error occurred while fetching user data.');
    }
});


document.getElementById('add-user-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const user = Object.fromEntries(formData.entries());
    console.log(user)
    
    // Ensure account_number is not included
    // delete user.account_number;

    try {
        const response = await fetch('http://127.0.0.1:5000/adduser', {  // Updated to match endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add user');
        }

        alert('User added successfully');
        $('#addUserModal').modal('hide');
        document.getElementById('get-details-btn').click(); // Refresh user list
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the user: ' + error.message);
    }
});
