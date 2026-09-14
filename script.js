```js
const DISCORD_INVITE = "https://discord.gg/Rb64dunDJ";

/* =========================
   PLAYER DATA
========================= */

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


/* =========================
   SAVE GAME
========================= */

function saveGame() {
  localStorage.setItem(
    "creatorHQPlayer",
    JSON.stringify(player)
  );
}


/* =========================
   PAGE NAVIGATION
========================= */

function showPage(pageId) {

  // Hide every page
  const pages = document.querySelectorAll(".page");

  pages.forEach(page => {
    page.classList.remove("active");
  });

  // Find requested page
  const selectedPage =
    document.getElementById(pageId);

  // If it exists, show it
  if (selectedPage) {

    selectedPage.classList.add("active");

    console.log(
      "Opened page:",
      pageId
    );

    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  } else {

    console.error(
      "Page not found:",
      pageId
    );

  }
}


/* =========================
   DISCORD
========================= */

function joinDiscord() {

  window.open(
    DISCORD_INVITE,
    "_blank"
  );

}


/* =========================
   NOTIFICATIONS
========================= */

function notify(message) {

  const box =
    document.getElementById("notification");

  if (!box) return;

  box.textContent = message;

  box.classList.add("show");

  setTimeout(() => {

    box.classList.remove("show");

  }, 3000);
}


/* =========================
   XP SYSTEM
========================= */

function requiredXP() {

  return player.level * 100;

}


function getTotalXP() {

  let total = 0;

  for (
    let level = 1;
    level < player.level;
    level++
  ) {

    total += level * 100;

  }

  total += player.xp;

  return total;
}


function addXP(amount) {

  player.xp += amount;

  while (
    player.xp >= requiredXP()
  ) {

    player.xp -= requiredXP();

    player.level++;

    notify(
      `🎉 LEVEL UP! Level ${player.level}!`
    );

  }

  saveGame();

  updateUI();
}


/* =========================
   RANK SYSTEM
========================= */

function getRank() {

  let currentRank = ranks[0];

  for (const rank of ranks) {

    if (
      getTotalXP() >= rank.required
    ) {

      currentRank = rank;

    }

  }

  return currentRank;
}


/* =========================
   USERNAME
========================= */

function changeUsername() {

  const input =
    document.getElementById(
      "usernameInput"
    );

  if (!input) return;

  const name =
    input.value.trim();

  if (name.length < 3) {

    notify(
      "❌ Username must be at least 3 characters."
    );

    return;
  }

  player.name =
    name.substring(0, 16);

  input.value = "";

  saveGame();

  updateUI();

  notify(
    `👤 Username changed to ${player.name}!`
  );
}


/* =========================
   MATCH SYSTEM
========================= */

function playMatch() {

  const kills =
    Math.floor(
      Math.random() * 10
    ) + 1;

  const won =
    Math.random() < 0.25;

  player.matches++;

  player.kills += kills;

  let xpReward =
    kills * 20;

  if (won) {

    player.wins++;

    player.streak++;

    xpReward += 300;

    notify(
      `🏆 VICTORY! ${kills} kills • +${xpReward} XP`
    );

  } else {

    player.streak = 0;

    notify(
      `🎮 Match finished! ${kills} kills • +${xpReward} XP`
    );

  }

  addXP(xpReward);

  saveGame();

  updateUI();
}


/* =========================
   MESSAGES
========================= */

function renderMessages() {

  const container =
    document.getElementById(
      "messageList"
    );

  if (!container) return;

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

          <strong>
            ${message.user}
          </strong>

          <span>
            ${message.time}
          </span>

        </div>

        <p>
          ${message.text}
        </p>

      </div>
    `;

    container.appendChild(div);

  });
}


function sendMessage() {

  const input =
    document.getElementById(
      "messageInput"
    );

  if (!input) return;

  const text =
    input.value.trim();

  if (!text) {

    notify(
      "❌ Type a message first."
    );

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

  notify(
    "💬 Message posted!"
  );
}


/* =========================
   SERVERS
========================= */

function renderServers() {

  const container =
    document.getElementById(
      "serverList"
    );

  if (!container) return;

  container.innerHTML = "";

  servers.forEach(server => {

    const div =
      document.createElement("div");

    div.className =
      "server-card";

    div.innerHTML = `

      <div class="server-icon">
        ${server.icon}
      </div>

      <h3>
        ${server.name}
      </h3>

      <p>
        ${server.description}
      </p>

      <div class="server-members">
        👥 ${server.members} members
      </div>

      <button
        onclick="openServer('${server.invite}')">
        Join Server
      </button>

    `;

    container.appendChild(div);

  });
}


function openServer(invite) {

  if (
    !invite ||
    invite === "#"
  ) {

    notify(
      "ℹ️ This server doesn't have an invite yet."
    );

    return;
  }

  window.open(
    invite,
    "_blank"
  );
}


/* =========================
   PROMOTIONS
========================= */

function renderPromotions() {

  const container =
    document.getElementById(
      "promotionList"
    );

  if (!container) return;

  container.innerHTML = "";

  promotions.forEach(promotion => {

    const div =
      document.createElement("div");

    div.className =
      "promotion-card";

    div.innerHTML = `

      <div class="promotion-icon">
        ${promotion.icon}
      </div>

      <span class="tag">
        ${promotion.tag}
      </span>

      <h3>
        ${promotion.title}
      </h3>

      <p>
        ${promotion.description}
      </p>

      <button
        onclick="joinDiscord()">
        Learn More
      </button>

    `;

    container.appendChild(div);

  });
}


/* =========================
   RANKS
========================= */

function renderRanks() {

  const container =
    document.getElementById(
      "rankList"
    );

  if (!container) return;

  container.innerHTML = "";

  ranks.forEach(rank => {

    const unlocked =
      getTotalXP() >= rank.required;

    const div =
      document.createElement("div");

    div.className =
      "rank-card " +
      (
        unlocked
          ? "unlocked"
          : "locked"
      );

    div.innerHTML = `

      <div class="rank-icon">
        ${rank.icon}
      </div>

      <h3>
        ${rank.name}
      </h3>

      <strong>
        ${rank.required} XP
      </strong>

      <p>
        ${rank.description}
      </p>

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


/* =========================
   LEADERBOARD
========================= */

function renderLeaderboard() {

  const container =
    document.getElementById(
      "leaderboard"
    );

  if (!container) return;

  const players = [
    ...leaderboardPlayers,

    {
      name: player.name,
      xp: getTotalXP()
    }
  ];

  players.sort(
    (a, b) => b.xp - a.xp
  );

  container.innerHTML = "";

  players.forEach(
    (person, index) => {

      const div =
        document.createElement("div");

      div.className =
        "leaderboard-row";

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

    }
  );
}


/* =========================
   VOICE CHANNELS
========================= */

function renderVoice() {

  const container =
    document.getElementById(
      "voiceList"
    );

  if (!container) return;

  container.innerHTML = "";

  voiceChannels.forEach(channel => {

    const div =
      document.createElement("div");

    div.className =
      "voice-card";

    const full =
      channel.users >= channel.limit;

    div.innerHTML = `

      <div class="voice-icon">
        ${channel.icon}
      </div>

      <div>

        <h3>
          ${channel.name}
        </h3>

        <p>
          👥 ${channel.users}/${channel.limit}
        </p>

      </div>

      <span
        class="${
          full
            ? "full"
            : "online"
        }">

        ${
          full
            ? "FULL"
            : "ACTIVE"
        }

      </span>

    `;

    container.appendChild(div);

  });
}


/* =========================
   TOURNAMENTS
========================= */

function renderTournaments() {

  const container =
    document.getElementById(
      "tournamentList"
    );

  if (!container) return;

  container.innerHTML = "";

  tournaments.forEach(
    tournament => {

      const div =
        document.createElement("div");

      div.className =
        "tournament-card";

      div.innerHTML = `

        <div class="tournament-top">

          <span class="tag">
            ${tournament.status}
          </span>

          <span>
            ${tournament.players}
          </span>

        </div>

        <h3>
          ${tournament.name}
        </h3>

        <p>
          🎮 ${tournament.game}
        </p>

        <p>
          📅 ${tournament.date}
        </p>

        <p>
          ⏰ ${tournament.time}
        </p>

        <div class="prize">
          ${tournament.prize}
        </div>

        <button
          onclick="registerTournament('${tournament.name}')">

          🏆 Register

        </button>

      `;

      container.appendChild(div);

    }
  );
}


function registerTournament(name) {

  addXP(25);

  notify(
    `🏆 Registration started for ${name}!`
  );

  setTimeout(() => {

    joinDiscord();

  }, 700);
}


/* =========================
   UPDATE UI
========================= */

function updateUI() {

  const rank =
    getRank();

  const navUsername =
    document.getElementById(
      "navUsername"
    );

  const navLevel =
    document.getElementById(
      "navLevel"
    );

  const homeLevel =
    document.getElementById(
      "homeLevel"
    );

  const homeRank =
    document.getElementById(
      "homeRank"
    );

  const totalXP =
    document.getElementById(
      "totalXP"
    );

  const xpAmount =
    document.getElementById(
      "xpAmount"
    );

  const xpNeeded =
    document.getElementById(
      "xpNeeded"
    );

  const wins =
    document.getElementById(
      "wins"
    );

  const kills =
    document.getElementById(
      "kills"
    );

  const matchCount =
    document.getElementById(
      "matchCount"
    );

  const streak =
    document.getElementById(
      "streak"
    );

  if (navUsername)
    navUsername.textContent =
      player.name;

  if (navLevel)
    navLevel.textContent =
      `LVL ${player.level}`;

  if (homeLevel)
    homeLevel.textContent =
      player.level;

  if (homeRank)
    homeRank.textContent =
      `${rank.icon} ${rank.name}`;

  if (totalXP)
    totalXP.textContent =
      getTotalXP();

  if (xpAmount)
    xpAmount.textContent =
      player.xp;

  if (xpNeeded)
    xpNeeded.textContent =
      requiredXP();

  if (wins)
    wins.textContent =
      player.wins;

  if (kills)
    kills.textContent =
      player.kills;

  if (matchCount)
    matchCount.textContent =
      player.matches;

  if (streak)
    streak.textContent =
      player.streak;

  const xpFill =
    document.getElementById(
      "xpFill"
    );

  if (xpFill) {

    const percentage =
      Math.min(
        (player.xp /
          requiredXP()) * 100,
        100
      );

    xpFill.style.width =
      percentage + "%";
  }

  renderRanks();
  renderLeaderboard();
}


/* =========================
   KEYBOARD SHORTCUTS
========================= */

document.addEventListener(
  "keydown",
  event => {

    // Don't navigate while typing
    if (
      event.target.tagName ===
      "INPUT"
    ) {
      return;
    }

    const pages = {

      "1": "home",

      "2": "messages",

      "3": "servers",

      "4": "promotions",

      "5": "ranks",

      "6": "voice",

      "7": "tournaments"

    };

    if (pages[event.key]) {

      showPage(
        pages[event.key]
      );

    }

  }
);


/* =========================
   START APP
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    console.log(
      "⚡ Creator HQ loaded!"
    );

    renderMessages();

    renderServers();

    renderPromotions();

    renderVoice();

    renderTournaments();

    updateUI();

    saveGame();

    // Always start on Home
    showPage("home");

  }
);
```
