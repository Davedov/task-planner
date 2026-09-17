const userData = JSON.parse(localStorage.getItem("userData")) || null;

if (!userData) {
	window.location.href = "login.html";
} else {
	window.location.href = "tasks.html";
}
