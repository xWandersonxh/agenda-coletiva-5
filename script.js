// Senhas para o líder e para os alunos
const leaderPassword = "wand123";
const studentPassword = "aluno123";

// Variável para verificar o tipo de usuário
let isLeader = false;

// Estado de notificações
let notificationsEnabled = false;

// Função de Login
function login() {
    const password = document.getElementById("password").value;
    
    if (password === leaderPassword) {
        isLeader = true;
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("entrySection").style.display = "block";
        alert("Bem-vindo, líder de sala!");
        loadActivities("activityListLogged");
        document.getElementById("addButton").style.display = "block";
    } else if (password === studentPassword) {
        isLeader = false;
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("entrySection").style.display = "block";
        alert("Bem-vindo, aluno! Você pode visualizar as atividades.");
        loadActivities("activityListLogged");
        document.getElementById("addButton").style.display = "none";
    } else {
        alert("Senha incorreta. Tente novamente.");
    }
}

// Função para ativar/desativar notificações
function toggleNotifications() {
    if (!("Notification" in window)) {
        alert("Este navegador não suporta notificações.");
        return;
    }

    if (!notificationsEnabled) {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                notificationsEnabled = true;
                alert("Notificações ativadas!");
                document.getElementById("notificationButton").textContent = "Desativar Notificações";
            }
        });
    } else {
        notificationsEnabled = false;
        alert("Notificações desativadas.");
        document.getElementById("notificationButton").textContent = "Ativar Notificações";
    }
}

// Função para enviar notificações no dia da entrega
function checkDueDates() {
    const activities = JSON.parse(localStorage.getItem("activities")) || [];
    const today = new Date().toISOString().split("T")[0];

    activities.forEach(activity => {
        if (activity.dueDate === today && notificationsEnabled) {
            new Notification("Lembrete", {
                body: `Atividade "${activity.text}" deve ser entregue hoje!`,
                icon: "https://via.placeholder.com/128" // Ícone genérico
            });
        }
    });
}

// Verificação de notificações diária
setInterval(checkDueDates, 60 * 60 * 1000); // Checa a cada hora

// Função para adicionar atividade
function addActivity() {
    if (!isLeader) {
        alert("Apenas o líder pode adicionar atividades.");
        return;
    }

    const activityInput = document.getElementById("activity");
    const dueDateInput = document.getElementById("dueDate");
    const activityText = activityInput.value;
    const dueDate = dueDateInput.value;

    if (activityText === "" || dueDate === "") {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    const activityItem = {
        text: activityText,
        dueDate: dueDate
    };

    saveActivity(activityItem);
    displayActivity(activityItem, "activityListLogged");

    activityInput.value = "";
    dueDateInput.value = "";
}

// Função para exibir atividade na lista
function displayActivity(activityItem, listId) {
    const activityList = document.getElementById(listId);
    const activityElement = document.createElement("li");
    activityElement.textContent = `${activityItem.text} - Data de entrega: ${formatDate(activityItem.dueDate)}`;

    if (isLeader && listId === "activityListLogged") {
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Remover";
        deleteButton.classList.add("delete-btn");
        deleteButton.onclick = function () {
            deleteActivity(activityElement, activityItem.text);
        };
        activityElement.appendChild(deleteButton);
    }

    activityList.appendChild(activityElement);
}

// Função para excluir atividade
function deleteActivity(activityElement, activityText) {
    if (!isLeader) {
        alert("Apenas o líder pode remover atividades.");
        return;
    }

    removeActivity(activityText);
    activityElement.remove();
}

// Função para salvar atividade no localStorage
function saveActivity(activityItem) {
    const activities = JSON.parse(localStorage.getItem("activities")) || [];
    activities.push(activityItem);
    localStorage.setItem("activities", JSON.stringify(activities));
}

// Função para carregar atividades na interface
function loadActivities(listId) {
    const activities = JSON.parse(localStorage.getItem("activities")) || [];
    const activityList = document.getElementById(listId);
    activityList.innerHTML = "";

    activities.forEach(activityItem => {
        displayActivity(activityItem, listId);
    });
}

// Carregar atividades na tela de login
function loadActivitiesForLogin() {
    loadActivities("activityList");
}

// Carrega as atividades na inicialização
window.onload = loadActivitiesForLogin;

// Função para formatar data
function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
}

// Função para remover atividade do localStorage
function removeActivity(activityText) {
    let activities = JSON.parse(localStorage.getItem("activities")) || [];
    activities = activities.filter(activity => activity.text !== activityText);
    localStorage.setItem("activities", JSON.stringify(activities));
}

