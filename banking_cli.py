import datetime

# In-memory storage
accounts = {}        # account_number -> Account object
fds = []             # list of all FDs
transactions = []    # (account_number, message)


# Classes
class Account:
    def __init__(self, name, acc_num, pin, balance=0):
        self.name = name
        self.acc_num = acc_num
        self.pin = pin
        self.balance = balance


class FD:
    def __init__(self, acc_num, principal, duration_months):
        self.acc_num = acc_num
        self.principal = principal
        self.duration_months = duration_months
        self.interest_rate = 0.06  # 6% annual interest
        self.start_date = datetime.date.today()
        self.maturity_date = self.start_date + datetime.timedelta(days=30 * duration_months)
        self.status = "active"

    def maturity_amount(self):
        years = self.duration_months / 12
        return round(self.principal * (1 + self.interest_rate * years), 2)

# Account creation
def create_account():
    print("\n=== Create New Account ===")
    name = input("Enter your name: ")
    acc_num = input("Choose a 6-digit Account Number: ")
    if acc_num in accounts:
        print("⚠️ Account already exists.")
        return
    pin = input("Set a 4-digit PIN: ")
    balance = float(input("Enter initial deposit: ₹"))
    accounts[acc_num] = Account(name, acc_num, pin, balance)
    print(f"✅ Account created for {name} (A/C: {acc_num})")


# Login
def login():
    print("\n=== Login ===")
    acc_num = input("Enter your Account Number: ")
    pin = input("Enter your PIN: ")
    acc = accounts.get(acc_num)
    if acc and acc.pin == pin:
        print(f"✅ Welcome {acc.name}!")
        atm_menu(acc)
    else:
        print("❌ Invalid credentials.")

def deposit_money(account):
    try:
        amount = float(input("Enter amount to deposit: ₹"))
        if amount <= 0:
            print("❌ Enter a valid amount.")
            return
        account.balance += amount
        transactions.append((account.acc_num, f"Deposited ₹{amount:.2f}", datetime.datetime.now()))
        print("✅ Deposit successful.")
    except ValueError:
        print("❌ Invalid input.")

def withdraw_money(account):
    try:
        amount = float(input("Enter amount to withdraw: ₹"))
        if amount <= 0:
            print("❌ Enter a valid amount.")
            return
        if amount <= account.balance:
            account.balance -= amount
            transactions.append((account.acc_num, f"Withdrew ₹{amount:.2f}", datetime.datetime.now()))
            print("✅ Withdrawal successful.")
        else:
            print("❌ Insufficient balance.")
    except ValueError:
        print("❌ Invalid input.")
def transfer_funds(account):
    to_acc = input("Enter recipient Account Number: ")
    try:
        amount = float(input("Enter amount to transfer: ₹"))
        if amount <= 0:
            print("❌ Enter a valid amount.")
            return
        if to_acc in accounts and amount <= account.balance:
            account.balance -= amount
            accounts[to_acc].balance += amount
            now = datetime.datetime.now()
            transactions.append((account.acc_num, f"Transferred ₹{amount:.2f} to {to_acc}", now))
            transactions.append((to_acc, f"Received ₹{amount:.2f} from {account.acc_num}", now))
            print("✅ Transfer successful.")
        else:
            print("❌ Transfer failed (invalid account or insufficient funds).")
    except ValueError:
        print("❌ Invalid input.")


# ATM Menu
def atm_menu(account):
    while True:
        print("\n======= ATM MENU =======")
        print("1. View Balance")
        print("2. Deposit")
        print("3. Withdraw")
        print("4. Transfer")
        print("5. Open Fixed Deposit (FD)")
        print("6. View FDs")
        print("7. View Transaction History")
        print("8. Logout")

        choice = input("Choose an option: ")

        if choice == '1':
            print(f"💰 Current Balance: ₹{account.balance:.2f}")

        elif choice == '2':
            deposit_money(account)

        elif choice == '3':
            withdraw_money(account)

        elif choice == '4':
            transfer_funds(account)

        elif choice == '5':
            try:
                amount = float(input("Enter FD amount: ₹"))
                months = int(input("Enter duration in months: "))
                if amount <= 0 or months <= 0:
                    print("❌ Enter valid positive values.")
                    continue

                if amount <= account.balance:
                    account.balance -= amount
                    fd = FD(account.acc_num, amount, months)
                    fds.append(fd)
                    transactions.append((account.acc_num, f"Opened FD of ₹{amount:.2f} for {months} months", datetime.datetime.now()))
                    print("✅ FD created successfully.")
                else:
                    print("❌ Not enough balance.")
            except ValueError:
                print("❌ Invalid input. Please enter numbers.")

        elif choice == '6':
            print("\n📄 Active FDs:")
            has_fd = False
            today = datetime.date.today()
            for fd in fds:
                if fd.acc_num == account.acc_num:
                    has_fd = True
                    if fd.status == "active":
                        if today >= fd.maturity_date:
                            matured_amount = fd.maturity_amount()
                            account.balance += matured_amount
                            fd.status = "matured"
                            transactions.append((account.acc_num, f"FD matured. Credited ₹{matured_amount:.2f}", datetime.datetime.now()))
                            print(f"✅ FD matured and credited: ₹{matured_amount:.2f}")
                        else:
                            print(f"➡ ₹{fd.principal:.2f}, Matures on {fd.maturity_date}")
                    elif fd.status == "matured":
                        print(f"✔️ Matured FD: ₹{fd.maturity_amount()} (Credited)")
            if not has_fd:
                print("No FDs found.")

        elif choice == '7':
            print("\n📜 Transaction History:")
            for acc_no, msg in transactions:
                if acc_no == account.acc_num:
                    print(f"- {msg}")

        elif choice == '8':
            print("👋 Logged out.")
            break

        else:
            print("❌ Invalid option. Try again.")



# Main menu
def main():
    while True:
        print("\n====== ATM CLI Banking System ======")
        print("1. Create Account")
        print("2. Login")
        print("3. Exit")
        choice = input("Choose an option: ")

        if choice == '1':
            create_account()
        elif choice == '2':
            login()
        elif choice == '3':
             print("👋 Thank you for using the ATM. Goodbye!")
             break
        else:
            print("❌ Invalid choice. Try again.")


if __name__ == "__main__":
    main()
