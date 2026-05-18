let currentPlayer = null;

// Search Player
async function searchPlayer() {
    const name = document.getElementById("playerName").value;

    if (!name) return alert("Enter a player name");

    try {
      const res = await fetch(`/api/player/${name}`);
      const data = await res.json();

    if (!res.ok) {
      console.log(data);
      return alert("Player not found or API error");
    }

    currentPlayer = data;

    document.getElementById("results").innerText =
      JSON.stringify(data.profile, null, 2);

    renderChart(data.stats);
  } catch (err) {
    console.error(err);
  }
}
// Save Player 
async function savePlayer() {
    if (!currentPlayer) return alert("Search a player first!");

    const res = await fetch("/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: currentPlayer.profile.name,
          stats: currentPlayer.stats,
      }),
    });

    const data = await res.json();

    console.log("SAVE RESPONSE:", data);

    if (!res.ok) {
        console.error("SAVE FAILED:", data);
        return alert("Failed to save player (check console)");
    }

    alert("Player saved!");
    loadPlayers();
}
// Load Saved Players
async function loadPlayers(){

    const res = await fetch("/players");
    const data = await res.json();

    console.log("Saved players:", data);

    const container = document.getElementById("results");

    container.innerHTML = "<h3>Saved Players</h3>";

    data.forEach(player => {
        const div = document.createElement("div");
        div.className = "player-card";

        div.innerHTML = `
            <p><strong>${player.username}</strong></p>
            <p>UID: ${player.uid}</p>
            <p>Wins: ${player.wins}</p>
            <p>Matches: ${player.matches}</p>
            <p>Kills: ${player.kills}</p>

        `;
        container.appendChild(div);
    });
}   
// Chart.js
let chartInstance = null;
let combatChartInstance = null;

function renderChart(stats) {

  const overall = stats?.overall_stats;
  const ranked = overall?.ranked ?? {};

  if (!overall) {
    console.error("Bad stats object:", stats);
    alert("Stats missing for this player");
    return;
  }

  const win = overall.total_wins ?? 0;
  const matches = overall.total_matches ?? 0;
  const loss = Math.max(matches - win, 0);

  // PIE CHART (W /L /Matches )
  const ctx = document.getElementById("statsChart");

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Wins", "Losses"],
      datasets: [
        {
          data: [win, loss],
          backgroundColor: ["#3B82F6", "#1E293B"],
          borderColor: "#0B1220",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: "#E5E7EB",
          },
        },
      },
    },
  });

  // COMBAT CHART (k/d/a)
    const ctx2 = document.getElementById("combatChart");

    if (combatChartInstance) {
      combatChartInstance.destroy();
    }

    combatChartInstance = new Chart(ctx2, {
      type: "bar",
      data: {
        labels: ["Kills", "Deaths", "Assists"],
        datasets: [
          {
            label: "Combat Stats",
            data: [
              ranked.total_kills ?? 0,
              ranked.total_deaths ?? 0,
              ranked.total_assists ?? 0,
            ],
            backgroundColor: "#3B82F6"
          }
        ]
      },
      options: {
          responsive: true,
        plugins: {
          legend: {
            labels: {
              color: "#E5E7EB"
            }
          }
        },
        scales: {
          x: {
            ticks: { color: "#CBD5E1" }
          },
          y: {
            ticks: { color: "#CBD5E1" },
            beginAtZero: true
          }
        }
      }
    });

  // UID
  document.getElementById("results").innerHTML = `
    <p class="uid">UID: ${stats.uid}</p>
  `;
}
  // Load Saved Players Automatically
  window.addEventListener("DOMContentLoaded", () => {
  loadPlayers();
});
