// Senhas para o líder e para os alunos
const leaderPassword = "wand123"; // Nova senha do líder de sala
const studentPassword = "aluno123"; // Senha dos alunos

// Variável para verificar o tipo de usuário
let isLeader = false;

// Função de Login
function login() {
    const password = document.getElementById("password").value;

    if (password === leaderPassword) {
        isLeader = true;
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("entrySection").style.display = "block";
        alert("Bem-vindo, líder de sala!");
        loadActivities("activityListLogged"); // Carrega as atividades na seção de entrada
        document.getElementById("addButton").style.display = "block"; // Exibe o botão de adicionar para o líder
    } else if (password === studentPassword) {
        isLeader = false;
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("entrySection").style.display = "block";
        alert("Bem-vindo, aluno! Você pode visualizar as atividades.");
        loadActivities("activityListLogged"); // Carrega as atividades na seção de entrada
        document.getElementById("addButton").style.display = "none"; // Oculta o botão de adicionar para alunos
    } else {
        alert("Senha incorreta. Tente novamente.");
    }
}

// Função para adicionar atividade (apenas para o líder)
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
        dueDate: formatDate(dueDate)
    };

    // Salva a atividade no localStorage e exibe na interface
    saveActivity(activityItem);
    displayActivity(activityItem, "activityListLogged");

    // Limpa os campos de entrada
    activityInput.value = "";
    dueDateInput.value = "";
}

// Função para exibir uma atividade na lista
function displayActivity(activityItem, listId) {
    const activityList = document.getElementById(listId);
    const activityElement = document.createElement("li");
    activityElement.textContent = `${activityItem.text} - Data de entrega: ${activityItem.dueDate}`;

    // Adiciona o botão de exclusão apenas para o líder e na seção de entrada
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

// Função para excluir atividade (apenas para o líder)
function deleteActivity(activityElement, activityText) {
    if (!isLeader) {
        alert("Apenas o líder pode remover atividades.");
        return;
    }

    // Remove a atividade do localStorage e da interface
    removeActivity(activityText);
    activityElement.remove();
}

// Função para salvar uma atividade no localStorage
function saveActivity(activityItem) {
    const activities = JSON.parse(localStorage.getItem("activities")) || [];
    activities.push(activityItem);
    localStorage.setItem("activities", JSON.stringify(activities));
}

// Função para carregar atividades na interface
function loadActivities(listId) {
    const activities = JSON.parse(localStorage.getItem("activities")) || [];
    const activityList = document.getElementById(listId);
    activityList.innerHTML = ""; // Limpa a lista antes de carregar

    activities.forEach(activityItem => {
        displayActivity(activityItem, listId);
    });
}

// Função para carregar atividades na tela de login
function loadActivitiesForLogin() {
    loadActivities("activityList");
}

// Carregar atividades na tela de login quando a página é carregada
window.onload = loadActivitiesForLogin;

// Função para formatar a data para o formato brasileiro (dia/mês/ano)
function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
}

// Função para remover uma atividade do localStorage
function removeActivity(activityText) {
    let activities = JSON.parse(localStorage.getItem("activities")) || [];
    activities = activities.filter(activity => activity.text !== activityText);
    localStorage.setItem("activities", JSON.stringify(activities));
}
