from flask import request, jsonify
from flask_restx import Resource
from app.appMain import db
from datetime import datetime
from app.appMain.models.status import Status
from app.appMain.models.transaction import Transaction
from app.appMain.models.balance import Balance
from app.appMain.models.user import User
from app.appMain.dto.transaction import TransactionDto
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.appMain.models.status import Status




withdraw_blueprint = TransactionDto.withdrawapi
deposite_blueprint = TransactionDto.depositeapi
transfer_blueprint = TransactionDto.transferapi
transactionhistory_blueprint = TransactionDto.transactionhistoryapi
accountdetails_blueprint=TransactionDto.accountdetailsapi
balance_blueprint=TransactionDto.balanceapi



@deposite_blueprint.route('', methods=['POST'])
class Deposit(Resource):
    @jwt_required()  
    def post(self):
        data = request.get_json()
        account_number = str(data.get('account_number'))
        amount = data.get('amount')

        if amount <= 0:
            return {'message': 'Invalid amount. Must be greater than zero'}, 400

        try:
            user = User.query.filter_by(account_number=account_number).first()
            if not user:
                return {'message': 'Enter valid account number'}, 404

            success_status = Status.query.filter_by(status_name='success').first()
            balance = Balance.query.filter_by(user_id=user.user_id).first()
            if not balance:
                return {'message': 'Balance not found for user'}, 400

            # Transaction processing
            balance.current_balance += amount
            balance.balance_updated_at = datetime.now()
            db.session.commit()

            transaction = Transaction(
                user_id=user.user_id,
                amount=amount,
                transaction_type='Deposit',
                status_id=success_status.status_id,
                transaction_at=datetime.now()
            )
            db.session.add(transaction)
            db.session.commit()

            return {'message': 'Deposit successful'}, 200

  
        except ValueError as ve:
            return {'message': str(ve)}, 500

        

           


def get_status_id(status_name):
    status = Status.query.filter_by(status_name=status_name).first()
    if status:
        return status.status_id
    else:
        raise ValueError(f"Status '{status_name}' not found")

@withdraw_blueprint.route('', methods=['POST'])
class Withdraw(Resource):
    @jwt_required()  
    def post(self):
        data = request.get_json()
        amount = data.get('amount')

        # Basic validation
        if not amount:
            return {'message': 'Missing amount field'}, 400
        if amount <= 0:
            return {'message': 'Invalid amount. Must be greater than zero'}, 400

        user_identity = get_jwt_identity()
        if not isinstance(user_identity, dict) or 'user_id' not in user_identity:
            return {'message': 'Invalid user identity'}, 400
        
        user_id = user_identity['user_id']
        
        user = User.query.filter_by(user_id=user_id).first()
        if not user:
            return {'message': 'User not found'}, 404

        balance = Balance.query.filter_by(user_id=user.user_id).first()
        if not balance:
            return {'message': 'Balance not found for user'}, 400

        if balance.current_balance < amount:
            return {'message': 'Insufficient balance'}, 400

        try:
            balance.current_balance -= amount
            balance.balance_updated_at = datetime.now()
            db.session.commit()

            status_id = get_status_id('success')
            transaction = Transaction(
                user_id=user.user_id,
                amount=amount,
                transaction_type='Withdraw',
                status_id=status_id,
                transaction_at=datetime.now()
            )
            db.session.add(transaction)
            db.session.commit()

            return {'message': 'Withdrawal successful'}, 200

        except ValueError as ve:
            return {'message': str(ve)}, 500
        except Exception as e:
            db.session.rollback()  

            return {'message': f'Withdrawal failed: {str(e)}'}, 500




    




@balance_blueprint.route('', methods=['GET'])
class BalanceResource(Resource):
    @jwt_required()
    def get(self):
        user_identity = get_jwt_identity()
        user_id = user_identity['user_id']
        balance = Balance.query.filter_by(user_id=user_id).first()
        if not balance:
            return {'message': 'Balance not found'}, 404
        

        return {'current_balance': balance.current_balance}, 200




@transfer_blueprint.route('', methods=['POST'])
class TransferMoney(Resource):
    @jwt_required()
    def post(self):
        current_user = get_jwt_identity()
        sender_id = current_user['user_id']

        data = request.get_json()
        recipient_account_number = data.get('recipient_account_number')
        amount = data.get('amount')

      

        sender = User.query.get(sender_id)
        recipient = User.query.filter_by(account_number=recipient_account_number).first()

        if not recipient:
            return {'message': 'Invalid account number'}, 404
       
        
       
        sender_balance = Balance.query.filter_by(user_id=sender.user_id).first()

        if sender_balance.current_balance < amount:
            return {'message': 'Insufficient balance'}, 400

        sender_balance.current_balance -= amount
        sender_balance.balance_updated_at = datetime.now()

        recipient_balance = Balance.query.filter_by(user_id=recipient.user_id).first()
        recipient_balance.current_balance += amount
        recipient_balance.balance_updated_at = datetime.now()

        sender_transaction = Transaction(
            user_id=sender.user_id,
            amount=amount,
            transaction_type='Debit',
            other_user_id=recipient.user_id, 
            transaction_at=datetime.now()
        )

        recipient_transaction = Transaction(
            user_id=recipient.user_id,  
            amount=amount,
            transaction_type='Credit',
            other_user_id=sender.user_id, 
            transaction_at=datetime.now()
        )

        try:
            db.session.add(sender_transaction)
            db.session.add(recipient_transaction)  
            db.session.commit()
            return {'message': 'Transfer successful'}, 200
        except Exception as e:
            db.session.rollback()
            return {'message': f'Error occurred: {str(e)}'}, 500

@transactionhistory_blueprint.route('', methods=['GET'])
class TransactionHistory(Resource):
    @jwt_required()
    def get(self):
        try:
            current_user = get_jwt_identity()
            current_user_id = current_user['user_id']

            transactions_query = Transaction.query.filter_by(user_id=current_user_id)
            args = request.args

            page = int(args.get('page', 1))  # Default to page 1
            limit = int(args.get('limit', 10))  # Default to 10 per page

            if 'transaction_type' in args:
                transaction_type = args['transaction_type']
                transactions_query = transactions_query.filter(Transaction.transaction_type == transaction_type)

            if 'start_date' in args:
                start_date = datetime.strptime(args['start_date'], '%Y-%m-%d %H:%M:%S')
                transactions_query = transactions_query.filter(Transaction.transaction_at >= start_date)

            if 'end_date' in args:
                end_date = datetime.strptime(args['end_date'], '%Y-%m-%d %H:%M:%S')
                transactions_query = transactions_query.filter(Transaction.transaction_at <= end_date)

            if 'sort_by' in args:
                sort_column = args['sort_by']
                order = args.get('order', 'asc')  # Default to ascending if order is not provided

                if sort_column == 'date':
                    transactions_query = transactions_query.order_by(
                        Transaction.transaction_at.asc() if order == 'asc' else Transaction.transaction_at.desc()
                    )
                elif sort_column == 'amount':
                    transactions_query = transactions_query.order_by(
                        Transaction.amount.asc() if order == 'asc' else Transaction.amount.desc()
                    )
                elif sort_column == 'type':
                    transactions_query = transactions_query.order_by(
                        Transaction.transaction_type.asc() if order == 'asc' else Transaction.transaction_type.desc()
                    )

            paginated_transactions = transactions_query.paginate(page=page, per_page=limit, error_out=False)
            transactions = paginated_transactions.items

            # Prepare the list of transactions with the required fields
            transaction_list = []
            for transaction in transactions:
                if transaction.transaction_type in ['withdraw', 'deposit']:
                    transaction_list.append({
                        'date': transaction.transaction_at.isoformat(),
                        'type': transaction.transaction_type,
                        'amount': transaction.amount,
                        'recipient': 'self' 
                    })
                elif transaction.transaction_type == 'debit':
                    transaction_list.append({
                        'date': transaction.transaction_at.isoformat(),
                        'type': 'debit',
                        'amount': transaction.amount,
                        'recipient': f"{transaction.other_user.first_name} {transaction.other_user.last_name}"  # Recipient's name
                    })
                elif transaction.transaction_type == 'credit':
                    transaction_list.append({
                        'date': transaction.transaction_at.isoformat(),
                        'type': 'credit',
                        'amount': transaction.amount,
                        'recipient': f"{transaction.other_user.first_name} {transaction.other_user.last_name}" 
                    })

            # Return the transaction history
            return {'transactions': transaction_list, 'total_count': paginated_transactions.total}, 200

        except Exception as e:
            return {'message': 'An error occurred while retrieving transaction history', 'error': str(e)}, 500
