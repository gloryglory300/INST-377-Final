let currentPlayer = null;

// Search Player
async function searchPlayer() {
    const name = document.getElementById("playerName").value;

    const res = await fetch(`/api/player/${name}`);
    const data = await res.json();

    currentPlayer = data;

    document.getElementById("results").innerText =
    JSON.stringify(data.profile, null, 2);

    renderChart(data.stats);
}
// Save Player 
async function searchPlayer() {
    if (!currentPlayer) return alert("Search a player first!");

    await fetch("/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        username: currentPlayer.profile.name,
        }),
    });

    alert("Player saved!");
}
// Load Saved Players
async function loadPlayers(){
    const res = await fetch("/players");
    const data = await res.json();
    console.log(data);
}   
// Chart.js
function renderChart(stats) {
  const ctx = document.getElementById("statsChart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Wins", "Losses", "Kills"],
      datasets: [
        {
          label: "Player Stats",
          data: [
            stats.wins || 0,
            stats.losses || 0,
            stats.kills || 0,
          ],
        },
      ],
    },
  });
}
