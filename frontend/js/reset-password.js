// Extract the reset ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const resetId = urlParams.get("id"); // Ensure 'id' is appended to the reset link as a query param

if (!resetId) {
  alert("Invalid reset link");
  throw new Error("Reset ID not found in URL");
}

document.getElementById("resetPasswordForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById("newPassword").value;

    try {
      const response = await fetch(`http://localhost:5000/auth/reset-password/${resetId}`,{
          method: "POST",
          headers: {"Content-Type": "application/json",},
          body: JSON.stringify({ newPassword }), // Send the new password
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Failed to reset password");
        return;
      }

      alert("Password reset successfully!");
      window.location.href = "./login.html"; // Redirect to login page after success
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while resetting the password");
    }
  });
