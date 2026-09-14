```js
const DISCORD_INVITE = "https://discord.gg/Rb64dunDJ";


let player = JSON.parse(
  localStorage.getItem("creatorHQPlayer")
) || {
  name: "PLAYER",
  level: 1,
  xp: 0,
  wins: 0,
  kills: 0,
  matches: 0,
  streak: 0
};


function saveGame() {
  localStorage.setItem(
    "creatorHQPlayer",
    JSON.stringify(player)
  );
}


function showPage(pageId) {

  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const page = document.getElementById(pageId);

  if (page) {
    page.classList.add("active");
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


function joinDiscord() {
  window.open(DISCORD_INVITE, "_blank");
}


function notify(message) {

  const box = document.getElementById("notification");

  box.textContent = message;
  box.classList.add("show");

  setTimeout(() => {
    box.classList.remove("show");
  }, 3000);
}


function requiredXP() {
  return player.level * 100;
}


function getRank() {

  let currentRank = ranks[0];

  for (const rank of ranks) {

    if (getTotalXP() >= rank.required) {
      currentRank = rank;
    }

  }

  return currentRank;
}


function getTotalXP() {

  let total = 0;

  for (let i = 1; i < player.level; i++) {
    total += i * 100;
  }

  total += player.xp;

  return total;
}


function addXP(amount) {

  player.xp += amount;

  while (player.xp >= requiredXP()) {

    player.xp -= requiredXP();

    player.level++;

    notify(
      `🎉 LEVEL UP! You reached Level ${player.level}!`
    );
  }

  saveGame();
  updateUI();
}


function changeUsername() {

  const input =
    document.getElementById("usernameInput");

  const name = input.value.trim();

  if (name.length < 3) {
    notify("❌ Username must be at least 3 characters.");
    return;
  }

  player.name = name.substring(0, 16);

  input.value = "";

  saveGame();
  updateUI();

  notify(`👤 Username changed to ${player.name}!`);
}


function playMatch() {

  const kills =
    Math.floor(Math.random() * 10) + 1;

  const won =
    Math.random() < 0.25;

  player.matches++;
  player.kills += kills;

  let xpReward = kills * 20;

  if (won) {

    player.wins++;
    player.streak++;

    xpReward += 300;

    notify(
      `🏆 VICTORY! +${kills} kills • +${xpReward} XP`
    );

  } else {

    player.streak = 0;

    notify(
      `🎮 Match finished! +${kills} kills • +${xpReward} XP`
    );
  }

  addXP(xpReward);

  saveGame();
  updateUI();
}


function renderMessages() {

  const container =
    document.getElementById("messageList");

  container.innerHTML = "";

  messages.forEach(message => {

    const div =
      document.createElement("div");

    div.className = "message";

    div.innerHTML = `
      <div class="message-avatar">
        ${message.icon}
      </div>

      <div class="message-content">
        <div class="message-top">
          <strong>${message.user}</strong>
          <span>${message.time}</span>
        </div>

        <p>${message.text}</p>
      </div>
    `;

    container.appendChild(div);
  });
}


function sendMessage() {

  const input =
    document.getElementById("messageInput");

  const text = input.value.trim();

  if (!text) {
    notify("❌ Type a message first.");
    return;
  }

  messages.unshift({
    user: player.name,
    icon: "👤",
    text: text,
    time: "Just now"
  });

  input.value = "";

  renderMessages();

  addXP(10);

  notify("💬 Message posted!");
}


function renderServers() {

  const container =
    document.getElementById("serverList");

  container.innerHTML = "";

  servers.forEach(server => {

    const div =
      document.createElement("div");

    div.className = "server-card";

    div.innerHTML = `
      <div class="server-icon">
        ${server.icon}
      </div>

      <h3>${server.name}</h3>

      <p>${server.description}</p>

      <div class="server-members">
        👥 ${server.members} members
      </div>

      <button
        onclick="window.open('${server.invite}', '_blank')">
        Join Server
      </button>
    `;

    container.appendChild(div);
  });
}


function renderPromotions() {

  const container =
    document.getElementById("promotionList");

  container.innerHTML = "";

  promotions.forEach(promotion => {

    const div =
      document.createElement("div");

    div.className = "promotion-card";

    div.innerHTML = `
      <div class="promotion-icon">
        ${promotion.icon}
      </div>

      <span class="tag">
        ${promotion.tag}
      </span>

      <h3>${promotion.title}</h3>

      <p>${promotion.description}</p>

      <button onclick="joinDiscord()">
        Learn More
      </button>
    `;

    container.appendChild(div);
  });
}


function renderRanks() {

  const container =
    document.getElementById("rankList");

  container.innerHTML = "";

  ranks.forEach(rank => {

    const unlocked =
      getTotalXP() >= rank.required;

    const div =
      document.createElement("div");

    div.className =
      "rank-card " +
      (unlocked ? "unlocked" : "locked");

    div.innerHTML = `
      <div class="rank-icon">
        ${rank.icon}
      </div>

      <h3>${rank.name}</h3>

      <strong>${rank.required} XP</strong>

      <p>${rank.description}</p>

      <div class="rank-status">
        ${
          unlocked
            ? "✅ UNLOCKED"
            : "🔒 LOCKED"
        }
      </div>
    `;

    container.appendChild(div);
  });
}


function renderLeaderboard() {

  const container =
    document.getElementById("leaderboard");

  const players = [
    ...leaderboardPlayers,
    {
      name: player.name,
      xp: getTotalXP()
    }
  ];

  players.sort((a, b) => b.xp - a.xp);

  container.innerHTML = "";

  players.forEach((person, index) => {

    const div =
      document.createElement("div");

    div.className = "leaderboard-row";

    div.innerHTML = `
      <div class="leader-position">
        #${index + 1}
      </div>

      <div class="leader-name">
        👤 ${person.name}
      </div>

      <div class="leader-xp">
        ⭐ ${person.xp} XP
      </div>
    `;

    container.appendChild(div);
  });
}


function renderVoice() {

  const container =
    document.getElementById("voiceList");

  container.innerHTML = "";

  voiceChannels.forEach(channel => {

    const div =
      document.createElement("div");

    div.className = "voice-card";

    const full =
      channel.users >= channel.limit;

    div.innerHTML = `
      <div class="voice-icon">
        ${channel.icon}
      </div>

      <div>
        <h3>${channel.name}</h3>

        <p>
          👥 ${channel.users}/${channel.limit}
        </p>
      </div>

      <span class="${full ? "full" : "online"}">
        ${full ? "FULL" : "ACTIVE"}
      </span>
    `;

    container.appendChild(div);
  });
}


function renderTournaments() {

  const container =
    document.getElementById("tournamentList");

  container.innerHTML = "";

  tournaments.forEach(tournament => {

    const div =
      document.createElement("div");

    div.className = "tournament-card";

    div.innerHTML = `
      <div class="tournament-top">
        <span class="tag">
          ${tournament.status}
        </span>

        <span>
          ${tournament.players}
        </span>
      </div>

      <h3>${tournament.name}</h3>

      <p>🎮 ${tournament.game}</p>

      <p>📅 ${tournament.date}</p>

      <p>⏰ ${tournament.time}</p>

      <div class="prize">
        ${tournament.prize}
      </div>

      <button onclick="registerTournament('${tournament.name}')">
        🏆 Register
      </button>
    `;

    container.appendChild(div);
  });
}


function registerTournament(name) {

  addXP(25);

  notify(
    `🏆 You're interested in ${name}! Check Discord for registration.`
  );

  joinDiscord();
}


function updateUI() {

  const rank = getRank();

  document.getElementById("navUsername").textContent =
    player.name;

  document.getElementById("navLevel").textContent =
    `LVL ${player.level}`;

  document.getElementById("homeLevel").textContent =
    player.level;

  document.getElementById("homeRank").textContent =
    `${rank.icon} ${rank.name}`;

  document.getElementById("totalXP").textContent =
    getTotalXP();

  document.getElementById("xpAmount").textContent =
    player.xp;

  document.getElementById("xpNeeded").textContent =
    requiredXP();

  document.getElementById("wins").textContent =
    player.wins;

  document.getElementById("kills").textContent =
    player.kills;

  document.getElementById("matchCount").textContent =
    player.matches;

  document.getElementById("streak").textContent =
    player.streak;

  const percentage =
    Math.min(
      (player.xp / requiredXP()) * 100,
      100
    );

  document.getElementById("xpFill").style.width =
    percentage + "%";

  renderRanks();
  renderLeaderboard();
}


document.addEventListener("keydown", event => {

  if (event.key === "1") showPage("home");
  if (event.key === "2") showPage("messages");
  if (event.key === "3") showPage("servers");
  if (event.key === "4") showPage("promotions");
  if (event.key === "5") showPage("ranks");
  if (event.key === "6") showPage("voice");
  if (event.key === "7") showPage("tournaments");

});


renderMessages();
renderServers();
renderPromotions();
renderVoice();
renderTournaments();
updateUI();
saveGame();
```
