document.addEventListener('DOMContentLoaded', function () {
    const accountNumberElem = document.getElementById('account-number');
    const balanceElem = document.getElementById('balance');
    const balanceAmountElem = document.getElementById('balance-amount');
    const viewBalanceBtn = document.getElementById('view-balance-btn');
    const transactionBody = document.getElementById('transaction-body');
    const sortSelect = document.getElementById('sort');
    const typeSelect = document.getElementById('type');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const filterBtn = document.getElementById('filter-btn');

    async function loadAccountDetails() {
        try {
            const response = await fetch('http://127.0.0.1:5000/account_details', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();

            if (data.success) {
                accountNumberElem.textContent = `Account Number: ${data.account_number}`;
                balanceAmountElem.textContent = data.current_balance.toFixed(2);
                loadTransactionHistory();  // Load transactions on page load
            } else {
                alert('Failed to load account details');
            }
        } catch (error) {
            console.error('Error loading account details:', error);
        }
    }

    async function loadTransactionHistory(sort = 'date', type = '', startDate = '', endDate = '') {
        try {
            let url = `http://127.0.0.1:5000/transaction_history?sort=${sort}&type=${type}&start_date=${startDate}&end_date=${endDate}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const transactions = await response.json();
            transactionBody.innerHTML = '';

            transactions.forEach(transaction => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${new Date(transaction.date).toLocaleDateString()}</td>
                    <td>${transaction.type}</td>
                    <td>${transaction.amount.toFixed(2)}</td>
                    <td>${transaction.recipient || 'N/A'}</td>
                `;
                transactionBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error loading transactions:', error);
        }
    }

    viewBalanceBtn.addEventListener('click', function () {
        balanceElem.style.display = 'block';
    });

    filterBtn.addEventListener('click', function () {
        const sort = sortSelect.value;
        const type = typeSelect.value;
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        loadTransactionHistory(sort, type, startDate, endDate);
    });

    loadAccountDetails();
});
