//#region get elements
const formLogIn = document.getElementById("login-form");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const pError = document.getElementById("login-message");
//#endregion
//#region get users data
const users = JSON.parse(localStorage.getItem("users")) || [];
if (users.length === 0) {
	alert("No users found. Please sign up first.");
}
//#endregion
//#region event listeners
formLogIn.addEventListener("submit", function (event) {
	event.preventDefault();
	//#region get input values
	const email = inputEmail.value.trim();
	const password = inputPassword.value.trim();
	const userData = users.find((user) => user.email === email);
	//#endregion
	//#region validate input values
	if (!email || !password) {
		pError.textContent = "Please fill in all fields.";
		pError.classList.remove("hidden");
		return;
	}

	if (!userData) {
		pError.textContent = "Email is not registered. Please sign up first.";
		pError.classList.remove("hidden");
		return;
	}

	if (userData.password !== password) {
		pError.textContent = "Incorrect password. Please try again.";
		pError.classList.remove("hidden");
		return;
	}
	//#endregion
	//#region successful login
	let loginMethod = event.submitter.value;
	if (loginMethod !== "two-factor") {
		pError.textContent = "I'm supposed to prevent this for some reason... why? idk, ask Ash";
		pError.classList.remove("hidden");
		return;
	}

	localStorage.setItem("loginMethod", loginMethod);
	localStorage.setItem("userData", JSON.stringify(userData));
	window.location.href = "tasks.html";
	//#endregion
});
//#endregion
