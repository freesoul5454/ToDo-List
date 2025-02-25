document.addEventListener("DOMContentLoaded", () => {
    gsap.from("#container", { opacity: 0, scale: 0.8, duration: 1, ease: "power2.out" });
    loadTasks();
    loadSavedPlans();
});

let currentDay = "Monday";

function switchDay(day) {
    currentDay = day;
    document.getElementById("currentDay").innerText = day;
    loadTasks();
}

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskList = document.getElementById("taskList");

    if (taskInput.value.trim() === "") return;

    let li = document.createElement("li");
    li.innerHTML = `
        <span onclick="toggleComplete(this)">${taskInput.value}</span>
        <button onclick="removeTask(this)" style="background: red; color: white; padding: 5px 8px; border-radius: 5px;">❌</button>
    `;
    taskList.appendChild(li);

    gsap.from(li, { x: 100, opacity: 0, duration: 0.5, ease: "power2.out" });

    saveTasks();
    taskInput.value = "";
}

function removeTask(button) {
    let li = button.parentElement;
    gsap.to(li, { scale: 0, opacity: 0, duration: 0.5, ease: "power2.in", onComplete: () => {
        li.remove();
        saveTasks();
    }});
}

function toggleComplete(task) {
    task.classList.toggle("completed");
    gsap.to(task, { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 });
    saveTasks();
}

function saveTasks() {
    let tasks = JSON.parse(localStorage.getItem("weeklyTasks")) || {};
    tasks[currentDay] = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        tasks[currentDay].push({
            text: li.querySelector("span").innerText,
            completed: li.querySelector("span").classList.contains("completed")
        });
    });
    localStorage.setItem("weeklyTasks", JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("weeklyTasks")) || {};
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    if (tasks[currentDay]) {
        tasks[currentDay].forEach(task => {
            let li = document.createElement("li");
            li.innerHTML = `
                <span onclick="toggleComplete(this)" class="${task.completed ? 'completed' : ''}">${task.text}</span>
                <button onclick="removeTask(this)" style="background: red; color: white; padding: 5px 8px; border-radius: 5px;">❌</button>
            `;
            taskList.appendChild(li);
            gsap.from(li, { x: -100, opacity: 0, duration: 0.5, ease: "power2.out" });
        });
    }
}

function saveDayTasks() {
    let savedPlans = JSON.parse(localStorage.getItem("savedPlans")) || [];
    savedPlans.push(`${currentDay}: ${new Date().toLocaleDateString()} - Plan Saved ✅`);
    localStorage.setItem("savedPlans", JSON.stringify(savedPlans));
    loadSavedPlans();
}

function loadSavedPlans() {
    let savedPlans = JSON.parse(localStorage.getItem("savedPlans")) || [];
    let savedList = document.getElementById("savedList");
    savedList.innerHTML = "";
    if (savedPlans.length > 0) {
        document.getElementById("savedPlans").style.display = "block";
        savedPlans.forEach(plan => {
            let li = document.createElement("li");
            li.innerText = plan;
            savedList.appendChild(li);
            gsap.from(li, { opacity: 0, y: 10, duration: 0.5 });
        });
    }
}
