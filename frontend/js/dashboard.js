const token = localStorage.getItem("token"); // Retrieve JWT from local storage

if (!token) {
  alert("You are not logged in!");
  window.location.href = "./login.html";
}

async function fetchExpenses() {
  try {
    const response = await fetch("http://localhost:5000/expenses", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const expenses = await response.json();

    const expenseList = document.getElementById("expenseList");
    expenseList.innerHTML = "";

    expenses.forEach((expense) => {
      const li = document.createElement("li");
      li.textContent = `${expense.category}: ${expense.description} - ₹${expense.amount}`;
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => deleteExpense(expense.id));
      li.appendChild(deleteBtn);
      expenseList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
  }
}

async function addExpense(e) {
  e.preventDefault();
  const amount = document.getElementById("amount").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;

  try {
    await fetch("http://localhost:5000/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount, description, category }),
    });

    document.getElementById("addExpenseForm").reset();
    fetchExpenses();
  } catch (error) {
    console.error("Error adding expense:", error);
  }
}

async function deleteExpense(id) {
  try {
    await fetch(`http://localhost:5000/expenses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchExpenses();
  } catch (error) {
    console.error("Error deleting expense:", error);
  }
}

document
  .getElementById("addExpenseForm")
  .addEventListener("submit", addExpense);
fetchExpenses();

const buyPremiumBtn = document.getElementById("buyPremium");

buyPremiumBtn.addEventListener("click", async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/payments/create-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    const order = await response.json();

    const options = {
      key: "rzp_test_j9ixgSKTQCPNzM",
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      handler: async function (response) {
        // On successful payment, update the order status
        await fetch("http://localhost:5000/payments/update-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            order_id: order.id,
            payment_id: response.razorpay_payment_id,
            status: "SUCCESS",
          }),
        });

        alert("Transaction successful! You are now a premium user.");
        window.location.reload(); // Refresh the dashboard to reflect changes
      },
      prefill: {
        name: "Your Name", // Replace with user's name
        email: "your.email@example.com", // Replace with user's email
      },
    };

    const razorpay = new Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error("Error during payment:", error);
    alert("Failed to process payment.");
  }
});

async function checkPremiumStatus() {
  try {
    const response = await fetch("http://localhost:5000/auth/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const user = await response.json();
    if (user.isPremium) {
      document.getElementById("premiumFeatures").style.display = "block";
      document.getElementById("downloadSection").style.display = "block";
    }
  } catch (error) {
    console.error("Error checking premium status:", error);
  }
}

// Fetch and display leaderboard
async function fetchLeaderboard() {
  try {
    const response = await fetch("http://localhost:5000/premium/leaderboard", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch leaderboard");
    }

    const leaderboard = await response.json();
    const leaderboardList = document.getElementById("leaderboardList");
    leaderboardList.innerHTML = "";

    leaderboard.forEach((user, index) => {
      const totalExpenses = user.totalExpenses || 0;

      const li = document.createElement("li");
      li.textContent = `${index + 1}. ${
        user.name
      } - Total Expenses: ₹${totalExpenses}`;
      leaderboardList.appendChild(li);
    });

    document.getElementById("leaderboard").style.display = "block";
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    alert("Failed to fetch leaderboard.");
  }
}

async function downloadExpenses() {
  try {
    const response = await fetch(
      "http://localhost:5000/premium/download-expenses",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      alert(error.message || "Failed to download expenses");
      return;
    }

    const { downloadUrl } = await response.json();
    window.open(downloadUrl, "_blank"); // Open the download URL in a new tab
  } catch (error) {
    console.error("Error downloading expenses:", error);
    alert("Failed to download expenses.");
  }
}

document
  .getElementById("viewLeaderboard")
  .addEventListener("click", fetchLeaderboard);

document
  .getElementById("downloadExpenses")
  .addEventListener("click", downloadExpenses);

checkPremiumStatus();
