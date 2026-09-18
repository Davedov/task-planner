let tasks = [
	{
		id: 1,
		title: "Kontrollera inventarielistan för IT-utrustning",
		done: false,
		priority: "hög",
	},
	{
		id: 2,
		title: "Uppdatera veckans supportstatistik",
		done: false,
		priority: "medel",
	},
	{
		id: 3,
		title: "Granska nya användarkonton före aktivering",
		done: false,
		priority: "låg",
	},
	{
		id: 4,
		title: "Kontrollera att mötesrummens skärmar fungerar",
		done: true,
		priority: "hög",
	},
	{
		id: 5,
		title: "Sammanställa felrapporter från helpdesk",
		done: false,
		priority: "medel",
	},
	{
		id: 6,
		title: "Arkivera avslutade serviceärenden",
		done: true,
		priority: "låg",
	},
	{
		id: 7,
		title: "Verifiera backup-loggen från natten",
		done: false,
		priority: "medel",
	},
	{
		id: 8,
		title: "Uppdatera kontaktlistan för externa leverantörer",
		done: false,
		priority: "låg",
	},
	{
		id: 9,
		title: "Kontrollera licenser som går ut denna månad",
		done: false,
		priority: "hög",
	},
	{
		id: 10,
		title: "Förbereda sammanfattning till veckomötet",
		done: false,
		priority: "medel",
	},
];

document.addEventListener("DOMContentLoaded", () => {
	let userData = JSON.parse(localStorage.getItem("userData")) || null;
	if (userData === null) {
		window.location.href = "login.html";
	}

	let tasksString = localStorage.getItem("tasks");
	if (!tasksString) {
		localStorage.setItem("tasks", JSON.stringify(tasks));
	} else {
		tasks = JSON.parse(tasksString);
	}
	//#region get elements
	const tableTodo = document.getElementById("todo-table");
	const tableDone = document.getElementById("done-table");
	const pTodo = document.getElementById("number-of-todo-tasks");
	const pDone = document.getElementById("number-of-done-tasks");
	const pUserInfo = document.getElementById("user-info");
	const formFindTask = document.getElementById("find-task-form");
	const tableFindTask = document.getElementById("find-task-table");
	const tbodyFindTask = document.getElementById("find-task-tbody");
	const inputTaskId = document.getElementById("task-id");
	const pFindTask = document.getElementById("find-task-message");
	const formAddTask = document.getElementById("add-task-form");
	const inputTaskTitle = document.getElementById("new-task-title");
	const selectTaskPriority = document.getElementById("new-task-priority");
	const pAddTask = document.getElementById("add-task-message");
	//#endregion
	sortTasksByPriority();

	pUserInfo.textContent = `Inloggad som: ${userData.firstName} ${userData.lastName} (${userData.email}). login metod: ${localStorage.getItem("loginMethod")}`;

	renderTasks(tasks);

	const todoTasks = tasks.filter((task) => !task.done);
	const doneTasks = tasks.filter((task) => task.done);

	pTodo.textContent = `${todoTasks.length} uppgifter kvar att göra`;
	pDone.textContent = `${doneTasks.length} uppgifter är klara`;

	tableTodo.addEventListener("click", (event) => {
		if (event.target.tagName === "BUTTON") {
			const tr = event.target.closest("tr");
			const taskId = parseInt(tr.querySelector(".task-id").textContent);
			const task = tasks.find((task) => task.id === taskId);

			if (task) {
				task.done = true;
				localStorage.setItem("tasks", JSON.stringify(tasks));
				tr.remove();

				todoTasks.splice(todoTasks.indexOf(task), 1);
				doneTasks.push(task);

				renderTasks(tasks);

				pTodo.textContent = `${todoTasks.length} uppgifter kvar att göra`;
				pDone.textContent = `${doneTasks.length} uppgifter är klara`;
			}
		}
	});

	tableDone.addEventListener("click", (event) => {
		if (event.target.tagName === "BUTTON") {
			const tr = event.target.closest("tr");
			const taskId = parseInt(tr.querySelector(".task-id").textContent);
			const task = tasks.find((task) => task.id === taskId);

			if (task) {
				tasks.splice(tasks.indexOf(task), 1);
				localStorage.setItem("tasks", JSON.stringify(tasks));

				doneTasks.splice(doneTasks.indexOf(task), 1);
				tr.remove();
				pDone.textContent = `${doneTasks.length} uppgifter är klara`;
			}
		}
	});
	formFindTask.addEventListener("submit", (event) => {
		event.preventDefault();

		const taskId = parseInt(inputTaskId.value);
		const foundTask = tasks.find((task) => task.id === taskId);

		if (foundTask) {
			tbodyFindTask.innerHTML = "";
			const tr = document.createElement("tr");

			const tdTitle = document.createElement("td");
			tdTitle.textContent = foundTask.title;
			tr.appendChild(tdTitle);

			const tdPriority = document.createElement("td");
			tdPriority.textContent = foundTask.priority;
			tr.appendChild(tdPriority);

			const tdStatus = document.createElement("td");
			tdStatus.textContent = foundTask.done ? "Klar" : "Ej klar";
			tr.appendChild(tdStatus);

			tbodyFindTask.appendChild(tr);
			tableFindTask.classList.remove("hidden");
			pFindTask.textContent = "";
		} else {
			tbodyFindTask.innerHTML = "";
			tableFindTask.classList.add("hidden");
			pFindTask.textContent = "Ingen uppgift hittades med det angivna ID:t.";
		}
	});
	formAddTask.addEventListener("submit", (event) => {
		event.preventDefault();

		const newTaskTitle = inputTaskTitle.value.trim();
		const newTaskPriority = selectTaskPriority.value;

		if (!newTaskTitle) {
			pAddTask.textContent = "En uppgift måste ha en titel.";
			pAddTask.classList.remove("hidden");
			return;
		}
		if (!newTaskPriority) {
			pAddTask.textContent = "Var vänlig välj en prioritet.";
			pAddTask.classList.remove("hidden");
			return;
		}

		let newTaskId;
		if (tasks.length === 0) {
			newTaskId = 1;
		} else {
			newTaskId = Math.max(...tasks.map((task) => task.id)) + 1;
		}
		const newTask = {
			id: newTaskId,
			title: newTaskTitle,
			priority: newTaskPriority,
			done: false,
		};
		tasks.push(newTask);
		sortTasksByPriority();

		localStorage.setItem("tasks", JSON.stringify(tasks));
		pAddTask.textContent = "Uppgiften har lagts till.";
		pAddTask.classList.remove("hidden");
		renderTasks(tasks);

		event.target.reset();
	});
	//#region functions
	function sortTasksByPriority() {
		tasks.sort((a, b) => {
			const priorityOrder = { hög: 1, medel: 2, låg: 3 };
			return priorityOrder[a.priority] - priorityOrder[b.priority];
		});
	}
	function renderTasks(taskList) {
		tableTodo.innerHTML = "";
		tableDone.innerHTML = "";
		taskList.forEach((task) => {
			const tr = document.createElement("tr");

			const tdId = document.createElement("td");
			tdId.textContent = task.id;
			tdId.classList.add("task-id");
			tr.appendChild(tdId);

			const tdTitle = document.createElement("td");
			tdTitle.textContent = task.title;
			tr.appendChild(tdTitle);

			const tdPriority = document.createElement("td");
			tdPriority.textContent = task.priority;
			tr.appendChild(tdPriority);

			const tdActions = document.createElement("td");
			const button = document.createElement("button");

			if (task.done) {
				button.textContent = "Ta bort";
				tdActions.appendChild(button);
				tr.appendChild(tdActions);

				tableDone.appendChild(tr);
				return;
			}
			button.textContent = "Markera som klar";
			tdActions.appendChild(button);
			tr.appendChild(tdActions);

			tableTodo.appendChild(tr);
		});
	}
	//#endregion
});
