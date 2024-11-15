// Senhas para líder e alunos
const leaderPassword = "wand123";
const studentPassword = "aluno123";

// Variáveis de estado
let isLeader = false;

// Função de Login
function login() {
    const password = document.getElementById("password").value;

    if (password === leaderPassword) {
        isLeader = true;
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("entrySection").style.display = "block";
        alert("Bem-vindo, líder de sala!");
        loadActivities();
    } else if (password === studentPassword) {
        isLeader = false;
        document.getElementById("loginSection").style.display = "block";
        alert("Bem-vindo, aluno! Apenas visualização disponível.");
        loadActivitiesForLogin();
    } else {
        alert("Senha incorreta. Tente novamente.");
    }
}

// Função para carregar atividades na tela de login
function loadActivitiesForLogin() {
    const activities = JSON.parse(localStorage.getItem("activities")) || [];
    const activityList = document.getElementById("activityListLogin");
    activityList.innerHTML = "";

    activities.forEach(activity => {
        const listItem = document.createElement("li");
        listItem.textContent = `${activity.text} - Data de entrega: ${activity.dueDate}`;
        activityList.appendChild(listItem);
    });
}

// Função para adicionar atividade (somente para o líder)
function addActivity() {
    if (!isLeader) {
        alert("Apenas o líder pode adicionar atividades.");
        return;
    }

    const activityInput = document.getElementById("activity");
    const dueDateInput = document.getElementById("dueDate");
    const activityText = activityInput.value;
    const dueDate = dueDateInput.value;

    if (!activityText || !dueDate) {
        alert("Preencha todos os campos.");
        return;
    }

    const activityItem = { text: activityText, dueDate };
    saveActivity(activityItem);
    displayActivity(activityItem);

    activityInput.value = "";
    dueDateInput.value = "";
}

// Exibir atividade na interface
function displayActivity(activity) {
    const activityList = document.getElementById("activityList");
    const listItem = document.createElement("li");
    listItem.textContent = `${activity.text} - Data de entrega: ${activity.dueDate}`;

    if (isLeader) {
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Remover";
        deleteButton.classList.add("delete-btn");
        deleteButton.onclick = () => deleteActivity(listItem, activity.text);
        listItem.appendChild(deleteButton);
    }

    activityList.appendChild(listItem);
}

// Salvar atividade no localStorage
function saveActivity(activity) {
    const activities = JSON.parse(localStorage.getItem("activities")) || [];
    activities.push(activity);
    localStorage.setItem("activities", JSON.stringify(activities));
}

// Carregar atividades
function loadActivities() {
    const activities = JSON.parse(localStorage.getItem("activities")) || [];
    activities.forEach(activity => displayActivity(activity));
}

// Remover atividade
function deleteActivity(listItem, activityText) {
    if (!isLeader) {
        alert("Apenas o líder pode remover atividades.");
        return;
    }

    const activities = JSON.parse(localStorage.getItem("activities")) || [];
    const updatedActivities = activities.filter(activity => activity.text !== activityText);
    localStorage.setItem("activities", JSON.stringify(updatedActivities));
    listItem.remove();
}

// Configuração de notificações
function initializeNotificationSettings() {
    const notificationStatus = localStorage.getItem("notificationsEnabled") === "true";

    if (notificationStatus) {
        enableNotifications();
    }
}

function enableNotifications() {
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            localStorage.setItem("notificationsEnabled", "true");
            alert("Notificações ativadas!");
        } else {
            alert("Você precisa permitir as notificações!");
        }
    });
}

function disableNotifications() {
    localStorage.setItem("notificationsEnabled", "false");
    alert("Notificações desativadas.");
}

function toggleNotifications() {
    const notificationsEnabled = localStorage.getItem("notificationsEnabled") === "true";
    notificationsEnabled ? disableNotifications() : enableNotifications();
}

// Notificar no dia da entrega
function notifyDueActivities() {
    const activities = JSON.parse(localStorage.getItem("activities")) || [];
    const today = new Date().toISOString().split("T")[0];

    activities.forEach(activity => {
        if (activity.dueDate === today && Notification.permission === "granted") {
            new Notification("Lembrete de Atividade", {
                body: `Hoje é o prazo para: ${activity.text}`,
            });
        }
    });
}

// Inicialização
initializeNotificationSettings();
notifyDueActivities();
