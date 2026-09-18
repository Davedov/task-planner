//#region get elements
const formSignUp = document.getElementById("SignUp-form");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const inputConfirmPassword = document.getElementById("confirm-password");
const inputFirstName = document.getElementById("first-name");
const inputLastName = document.getElementById("last-name");
const inputAge = document.getElementById("age");
const pError = document.getElementById("error-message");
const tableUserPreview = document.getElementById("user-preview");
const formUserConfirmation = document.getElementById("user-confirmation-form");
const pConfirmationMessage = document.getElementById("confirmation-message");
const buttonSignUp = document.getElementById("sign-up-button");
const fieldsetPersonalInfo = document.getElementById("personal-info-fieldset");
const buttonNext = document.getElementById("next-button");
const buttonGoBack = document.getElementById("go-back-button");
//#endregion
const users = JSON.parse(localStorage.getItem("users")) || [];
//#region initialize user data
let userData = {
	email: "",
	password: "",
	firstName: "",
	lastName: "",
	age: "",
};
//#endregion
//#region event listeners
buttonNext.addEventListener("click", function () {
	//#region get input values
	let email = inputEmail.value.trim();
	let password = inputPassword.value.trim();
	let confirmPassword = inputConfirmPassword.value.trim();
	//#endregion
	//#region validate input values
	if (!email || !password || !confirmPassword) {
		pError.textContent = "Please fill in all fields.";
		pError.classList.remove("hidden");
		return;
	}

	if (!validateEmail(email)) {
		pError.textContent = "Please enter a valid email address.";
		pError.classList.remove("hidden");
		return;
	}

	if (users.find((user) => user.email === email)) {
		pError.textContent = "This email is already registered. Please use a different email.";
		pError.classList.remove("hidden");
		return;
	}

	if (!validatePassword(password)) {
		pError.textContent =
			"Password must be at least 8 characters long and include an uppercase letter, a lowercase letter and a number and must containt no spaces.";
		pError.classList.remove("hidden");
		return;
	}
	if (password !== confirmPassword) {
		pError.textContent = "Confirm password does not match the password.";
		pError.classList.remove("hidden");
		return;
	}
	//#endregion
	//#region disable input fields and show personal info fieldset
	inputEmail.disabled = true;
	inputPassword.disabled = true;
	inputConfirmPassword.disabled = true;

	userData.email = email;
	userData.password = password;

	buttonNext.classList.add("hidden");
	fieldsetPersonalInfo.classList.remove("hidden");
	buttonSignUp.classList.remove("hidden");
	//#endregion
});

formSignUp.addEventListener("submit", function (event) {
	event.preventDefault();
	//#region get input values
	let firstName = inputFirstName.value.trim();
	let lastName = inputLastName.value.trim();
	let age = inputAge.value.trim();
	//#endregion
	formUserConfirmation.classList.add("hidden");
	//#region validate input values
	if (!firstName || !lastName || !age) {
		pError.textContent = "Please fill in all fields.";
		pError.classList.remove("hidden");
		return;
	}

	if (age < 13) {
		pError.textContent = "You must be at least 13 years old to sign up.";
		pError.classList.remove("hidden");
		return;
	}
	//#endregion
	//#region store user data
	inputFirstName.disabled = true;
	inputLastName.disabled = true;
	inputAge.disabled = true;

	userData.firstName = firstName;
	userData.lastName = lastName;
	userData.age = age;
	//#endregion
	//#region display user data
	pError.classList.add("hidden");

	tableUserPreview.innerHTML = "";

	const tr = document.createElement("tr");
	const tdEmail = document.createElement("td");
	tdEmail.textContent = userData.email;
	tr.appendChild(tdEmail);

	const tdFirstName = document.createElement("td");
	tdFirstName.textContent = firstName;
	tr.appendChild(tdFirstName);

	const tdLastName = document.createElement("td");
	tdLastName.textContent = lastName;
	tr.appendChild(tdLastName);

	const tdAge = document.createElement("td");
	tdAge.textContent = age;
	tr.appendChild(tdAge);

	tableUserPreview.appendChild(tr);
	formUserConfirmation.classList.remove("hidden");
	//#endregion
});

buttonGoBack.addEventListener("click", function () {
	inputEmail.disabled = false;
	inputPassword.disabled = false;
	inputConfirmPassword.disabled = false;
	inputFirstName.disabled = false;
	inputLastName.disabled = false;
	inputAge.disabled = false;

	buttonNext.classList.remove("hidden");
	fieldsetPersonalInfo.classList.add("hidden");
	buttonSignUp.classList.add("hidden");
	formUserConfirmation.classList.add("hidden");

	formSignUp.reset();
});

formUserConfirmation.addEventListener("submit", function (event) {
	event.preventDefault();

	const userDataJSON = JSON.stringify(userData);
	console.log(userDataJSON);
	localStorage.setItem("userData", userDataJSON);

	pConfirmationMessage.textContent = "Your account has been created successfully.";
	pConfirmationMessage.classList.remove("hidden");

	users.push(userData);
	localStorage.setItem("users", JSON.stringify(users));

	localStorage.setItem("userData", userDataJSON);

	localStorage.setItem("loginMethod", "two-factor");

	formSignUp.reset();
	buttonNext.classList.remove("hidden");
	formUserConfirmation.classList.add("hidden");
	fieldsetPersonalInfo.classList.add("hidden");
	buttonSignUp.classList.add("hidden");

	window.location.href = "tasks.html";
});
//#endregion
//#region validation functions
function validatePassword(password) {
	const minLength = 8;
	const hasUpperCase = /[A-Z]/.test(password);
	const hasLowerCase = /[a-z]/.test(password);
	const hasNumber = /[0-9]/.test(password);
	const hasNoSpaces = !/\s/.test(password);

	return (
		minLength <= password.length && hasUpperCase && hasLowerCase && hasNumber && hasNoSpaces
	);
}

function validateEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
//#endregion
//#region Testing stuff

//#endregion
