const DISCORD_INVITE = "https://discord.gg/Rb64dunDJ";

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active");
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}

function joinDiscord() {
    window.open(DISCORD_INVITE, "_blank");
}

function changeUsername() {
    const input = document.getElementById("usernameInput");

    if (!input) return;

    const username = input.value.trim();

    if (username === "") {
        showNotification("Please enter a username!");
        return;
    }

    localStorage.setItem("creatorHQUsername", username);

    const usernameDisplay = document.getElementById("usernameDisplay");

    if (usernameDisplay) {
        usernameDisplay.textContent = username;
    }

    showNotification("Username saved!");
}

function showNotification(message) {
    const notification = document.getElementById("notification");

    if (!notification) {
        alert(message);
        return;
    }

    notification.textContent = message;
    notification.classList.add("show");

    setTimeout(() => {
        notification.classList.remove("show");
    }, 2500);
}

function renderServers() {
    const container = document.getElementById("serverList");

    if (!container || typeof servers === "undefined") return;

    container.innerHTML = "";

    servers.forEach(server => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${server.icon} ${server.name}</h3>
            <p>${server.description}</p>
            <p>👥 ${server.members} members</p>
            <button onclick="window.open('${server.invite}', '_blank')">
                Join Server
            </button>
        `;

        container.appendChild(card);
    });
}

function renderPromotions() {
    const container = document.getElementById("promotionList");

    if (!container || typeof promotions === "undefined") return;

    container.innerHTML = "";

    promotions.forEach(promotion => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <span>${promotion.tag}</span>
            <h3>${promotion.icon} ${promotion.title}</h3>
            <p>${promotion.description}</p>
        `;

        container.appendChild(card);
    });
}

function renderRanks() {
    const container = document.getElementById("rankList");

    if (!container || typeof ranks === "undefined") return;

    container.innerHTML = "";

    ranks.forEach(rank => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${rank.icon} ${rank.name}</h3>
            <p>${rank.description}</p>
            <p>⭐ ${rank.required} XP required</p>
        `;

        container.appendChild(card);
    });
}

function renderLeaderboard() {
    const container = document.getElementById("leaderboard");

    if (!container || typeof leaderboardPlayers === "undefined") return;

    container.innerHTML = "";

    leaderboardPlayers.forEach((player, index) => {
        const row = document.createElement("div");
        row.className = "leaderboard-row";

        row.innerHTML = `
            <strong>#${index + 1}</strong>
            <span>👤 ${player.name}</span>
            <span>⭐ ${player.xp} XP</span>
        `;

        container.appendChild(row);
    });
}

function renderVoice() {
    const container = document.getElementById("voiceList");

    if (!container || typeof voiceChannels === "undefined") return;

    container.innerHTML = "";

    voiceChannels.forEach(channel => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${channel.icon} ${channel.name}</h3>
            <p>👥 ${channel.users}/${channel.limit} users</p>
            <button onclick="showNotification('Voice channels require the Discord app.')">
                Join VC
            </button>
        `;

        container.appendChild(card);
    });
}

function renderTournaments() {
    const container = document.getElementById("tournamentList");

    if (!container || typeof tournaments === "undefined") return;

    container.innerHTML = "";

    tournaments.forEach(tournament => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${tournament.name}</h3>
            <p>🎮 Game: ${tournament.game}</p>
            <p>📅 ${tournament.date}</p>
            <p>⏰ ${tournament.time}</p>
            <p>🎁 ${tournament.prize}</p>
            <p>👥 ${tournament.players}</p>
            <strong>${tournament.status}</strong>
            <br><br>
            <button onclick="joinDiscord()">
                Register
            </button>
        `;

        container.appendChild(card);
    });
}

function renderMessages() {
    const container = document.getElementById("messageList");

    if (!container || typeof messages === "undefined") return;

    container.innerHTML = "";

    messages.forEach(message => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${message.icon} ${message.user}</h3>
            <p>${message.text}</p>
            <small>${message.time}</small>
        `;

        container.appendChild(card);
    });
}

function sendMessage() {
    const input = document.getElementById("messageInput");

    if (!input) return;

    const message = input.value.trim();

    if (message === "") return;

    showNotification("Message added!");

    input.value = "";
}

function updateUsername() {
    const savedUsername = localStorage.getItem("creatorHQUsername");

    if (!savedUsername) return;

    const input = document.getElementById("usernameInput");

    if (input) {
        input.value = savedUsername;
    }

    const display = document.getElementById("usernameDisplay");

    if (display) {
        display.textContent = savedUsername;
    }
}

document.addEventListener("DOMContentLoaded", () => {

    console.log("Creator HQ website loaded!");

    renderMessages();
    renderServers();
    renderPromotions();
    renderRanks();
    renderLeaderboard();
    renderVoice();
    renderTournaments();

    updateUsername();

    showPage("home");

});
