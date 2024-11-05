let taskCount = 0;
let currentTaskId = null; // To store the ID of the task being edited

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(taskData => addTaskToColumn(taskData));
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll(".card").forEach(task => {
        tasks.push({
            id: task.id,
            title: task.querySelector("p").textContent.split(":")[0],
            description: task.querySelector("p").textContent.split(": ")[1],
            time: Number(task.dataset.time),  // Store time as a number (timestamp)
            status: task.parentElement.id
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    const title = document.getElementById("user_input").value;
    const description = document.getElementById("user_input2").value;

    if (!title || !description) {
        alert("Please fill in both fields");
        return;
    }

    const taskData = {
        id: `task-${taskCount++}`,
        title,
        description,
        time: Date.now(),  // Save the timestamp as a number
        status: "list1"
    };

    addTaskToColumn(taskData);
    saveTasks();
    document.getElementById("user_input").value = '';
    document.getElementById("user_input2").value = '';
}

function addTaskToColumn(taskData) {
    const taskDiv = document.createElement("div");
    taskDiv.className = "card";
    taskDiv.draggable = true;
    taskDiv.id = taskData.id;
    taskDiv.dataset.time = taskData.time;  // Store the timestamp as data attribute
    taskDiv.ondragstart = dragStart;

    // Format the date on load
    const formattedDate = new Date(taskData.time).toLocaleString();

    taskDiv.innerHTML = `
        <p>${taskData.title}: ${taskData.description}</p>
        <p class="timestamp">Assigned on ${formattedDate}</p>
        <button class="status-btn" onclick="openModal('${taskData.id}')">Change Status</button>
    `;

    updateTaskColor(taskDiv, taskData.status);
    document.getElementById(taskData.status).appendChild(taskDiv);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function dragStart(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
}

function dropIt(ev) {
    ev.preventDefault();
    const taskId = ev.dataTransfer.getData("text/plain");
    const task = document.getElementById(taskId);
    ev.target.appendChild(task);

    updateTaskColor(task, ev.target.id);
    saveTasks();
}

function updateTaskColor(task, statusId) {
    if (statusId === "list1") task.style.backgroundColor = "#ADD8E6"; // Blue for "To Do"
    else if (statusId === "list2") task.style.backgroundColor = "#FFCCCB"; // Red for "Not Started"
    else if (statusId === "list3") task.style.backgroundColor = "#FFFFE0"; // Yellow for "In Progress"
    else if (statusId === "list4") task.style.backgroundColor = "#90EE90"; // Green for "Done"
}

function openModal(taskId) {
    currentTaskId = taskId;
    document.getElementById("statusModal").style.display = "block";
}

function closeModal() {
    document.getElementById("statusModal").style.display = "none";
}

function updateTaskStatus() {
    const task = document.getElementById(currentTaskId);
    const newStatus = document.getElementById("statusSelect").value;
    
    document.getElementById(newStatus).appendChild(task);
    updateTaskColor(task, newStatus);
    saveTasks();
    closeModal();
}

function deleteTask() {
    const task = document.getElementById(currentTaskId);
    task.remove();
    saveTasks();
    closeModal();
}

window.onclick = function(event) {
    const modal = document.getElementById("statusModal");
    if (event.target == modal) {
        closeModal();
    }
};
