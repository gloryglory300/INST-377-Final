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
        }),
    });
    const data = await res.json();
    console.log("Saved:", data);

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
