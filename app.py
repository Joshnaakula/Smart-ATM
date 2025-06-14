from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime,date,timedelta
app = Flask(__name__)
CORS(app)

# In-memory storage
accounts = {}
fds = []
transactions = []

# Account class
class Account:
    def __init__(self, name, acc_num, pin, balance=0):
        self.name = name
        self.acc_num = acc_num
        self.pin = pin
        self.balance = balance

    def to_dict(self):
        return {
            "name": self.name,
            "acc_num": self.acc_num,
            "balance": self.balance
        }

# Fixed Deposit class
class FD:
    def __init__(self, acc_num, principal, duration_months):
        self.acc_num = str(acc_num)
        self.principal = principal
        self.duration_months = duration_months
        self.interest_rate = 0.06
        self.start_date = datetime.now().date()
        self.maturity_date = self.start_date + timedelta(days=30 * duration_months)
        self.status = "active"

    def maturity_amount(self):
        years = self.duration_months / 12
        return round(self.principal * (1 + self.interest_rate * years), 2)

# Create account
@app.route('/create_account', methods=['POST'])
def create_account():
    data = request.get_json()
    name = data['name']
    acc_num = data['acc_num']
    pin = data['pin']
    balance = float(data.get('balance', 0))

    if acc_num in accounts:
        return jsonify({"error": "Account already exists"}), 400

    accounts[acc_num] = Account(name, acc_num, pin, balance)
    return jsonify({"message": f"Account created for {name}", "account": accounts[acc_num].to_dict()})


# View balance
@app.route('/balance', methods=['GET'])
def view_balance():
    acc_num = request.args.get('acc_num')
    if acc_num not in accounts:
        return jsonify({"error": "Account not found"}), 404

    account = accounts[acc_num]
    return jsonify({"balance": account.balance})


# Deposit
@app.route('/deposit', methods=['POST'])
def deposit():
    data = request.get_json()
    acc_num = data['acc_num']
    amount = float(data['amount'])

    if acc_num not in accounts or amount <= 0:
        return jsonify({"error": "Invalid account or amount"}), 400

    accounts[acc_num].balance += amount
    transactions.append((acc_num, f"Deposited ₹{amount}", datetime.datetime.now()))
    return jsonify({"message": f"Deposited ₹{amount:.2f}", "balance": accounts[acc_num].balance})


# Withdraw
@app.route('/withdraw', methods=['POST'])
def withdraw():
    data = request.get_json()
    acc_num = data['acc_num']
    pin = data['pin']
    amount = float(data['amount'])

    account = accounts.get(acc_num)
    if not account:
        return jsonify({"error": "Account not found"}), 404

    if account.pin != pin:
        return jsonify({"error": "Invalid PIN"}), 403

    if amount <= 0:
        return jsonify({"error": "Amount must be positive"}), 400

    if account.balance < amount:
        return jsonify({"error": "Insufficient funds"}), 400

    account.balance -= amount
    transactions.append((acc_num, f"Withdrew ₹{amount}", datetime.datetime.now()))
    return jsonify({"message": f"₹{amount:.2f} withdrawn successfully", "balance": account.balance})


# Transfer
@app.route('/transfer', methods=['POST'])
def transfer():
    data = request.get_json()
    from_acc = data['from_acc']
    to_acc = data['to_acc']
    amount = float(data['amount'])

    if from_acc not in accounts or to_acc not in accounts:
        return jsonify({"error": "One or both accounts not found"}), 404
    if amount <= 0 or amount > accounts[from_acc].balance:
        return jsonify({"error": "Invalid amount"}), 400

    accounts[from_acc].balance -= amount
    accounts[to_acc].balance += amount

    now = datetime.datetime.now()
    transactions.append((from_acc, f"Transferred ₹{amount:.2f} to {to_acc}", now))
    transactions.append((to_acc, f"Received ₹{amount} from {from_acc}", now))
    return jsonify({"message": f"Transferred ₹{amount:.2f} to {to_acc}"})


# Transaction History
@app.route('/transactions', methods=['GET'])
def get_transactions():
    acc_num = request.args.get('acc_num')
    history = [{"message": msg, "timestamp": ts.strftime("%Y-%m-%d %H:%M:%S")}
               for acc, msg, ts in transactions if acc == acc_num]
    return jsonify({"transactions": history})


@app.route('/open_fd', methods=['POST'])
def open_fd():
    data = request.get_json()
    acc_num = data.get('acc_num')
    amount = data.get('amount')
    duration = data.get('duration')

    if not acc_num or amount is None or duration is None:
        return jsonify({"error": "Missing acc_num, amount, or duration"}), 400

    try:
        amount = float(amount)
        duration = int(duration)
    except ValueError:
        return jsonify({"error": "Invalid amount or duration"}), 400

    if acc_num not in accounts:
        return jsonify({"error": "Account not found"}), 404

    if accounts[acc_num].balance < amount:
        return jsonify({"error": "Insufficient balance"}), 400

    accounts[acc_num].balance -= amount

    # Create FD instance and store it
    fd = FD(acc_num, amount, duration)
    fds.append(fd)

    maturity_amount = fd.maturity_amount()
    maturity_date = fd.maturity_date.strftime('%Y-%m-%d')

    transactions.append((
        acc_num,
        f"Opened FD of ₹{amount} for {duration} months",
        datetime.now()
    ))
    print(f"FDs after creation: {[vars(fd) for fd in fds]}")
    return jsonify({
        "maturity_amount": maturity_amount,
        "maturity_date": maturity_date
    })

# View Fixed Deposits
@app.route('/fds', methods=['GET'])
def view_fds():
    acc_num = request.args.get('acc_num', '').strip()
    today = date.today()
    fd_list = []

    # 🔍 Debug prints
    print(f"Received request to fetch FDs for acc_num: {acc_num}")
    print(f"Total FDs stored: {len(fds)}")
    print(f"FDs: {[vars(fd) for fd in fds]}")

    for fd in fds:
        if str(fd.acc_num) == str(acc_num):
            if fd.status == "active" and today >= fd.maturity_date:
                matured_amount = fd.maturity_amount()
                accounts[acc_num].balance += matured_amount
                fd.status = "matured"
                transactions.append((
                    acc_num,
                    f"FD matured. Credited ₹{matured_amount:.2f}",
                    datetime.now()
                ))
            fd_list.append({
                "principal": fd.principal,
                "duration_months": fd.duration_months,
                "maturity_date": fd.maturity_date.isoformat(),
                "status": fd.status,
                "maturity_amount": fd.maturity_amount() if fd.status == "matured" else None
            })

    return jsonify(fd_list)

# Start the server
if __name__ == '__main__':
    app.run(debug=True)