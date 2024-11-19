from flask_restx import Namespace

class TransactionDto:
    withdrawapi=Namespace('withdraw',description="api for withraw the money")
    depositeapi=Namespace('deposite',description="api for deposite the money")
    transferapi=Namespace('transfer',description="api for transaction")
    transactionhistoryapi=Namespace('transaction_history',description="api for transaction history")
    accountdetailsapi=Namespace('account_details',description="api for account details")
    balanceapi=Namespace('balance',description='api to chek the balance')
    
    



