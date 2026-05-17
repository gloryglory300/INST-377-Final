const express = require("express");
const bodyParser = require("body-parser");
const supabaseClient = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

// Supabase 
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Marvel API Key
const API_KEY = process.env.MARVEL_API_KEY;

console.log("Loaded Marvel API Key:", API_KEY ? "YES" : "NO");

// Pages

app.get("/", (req, res) => {
  res.sendFile("public/index.html", { root: __dirname });
});

app.get("/about", (req, res) => {
  res.sendFile("public/about.html", { root: __dirname });
});

app.get("/tracker", (req, res) => {
  res.sendFile("public/tracker.html", { root: __dirname });
});

// Get Players

app.get("/players", async (req, res) => {
  const { data, error } = await supabase.from("players").select("*");

  if (error) return res.status(500).json(error);
  res.json(data);
});

// POST players

app.post("/players", async (req, res) => {
  const { username } = req.body;

  const { data, error } = await supabase
    .from("players")
    .insert([{ username }])
    .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json(error);
    }

    console.log("Inserted into Supabase:", data);
    res.json(data);
});

// Marvel API

app.get("/api/player/:name", async (req, res) => {
  try {
    const name = req.params.name;

    // Find players
    const findRes = await fetch(
      `https://marvelrivalsapi.com/api/v1/find-player/${name}`,
      {
        headers: { "x-api-key": API_KEY },
      }
    );

    const findData = await findRes.json();

    // Handle API errors properly!!

        if (!findRes.ok || !findData.uid) {
      return res.status(400).json({
        error: "Failed to find player",
        raw: findData,
      });
    }

    // Get Stats
    const statsRes = await fetch(
      `https://marvelrivalsapi.com/api/v1/player/${findData.uid}`,
      {
        headers: { "x-api-key": API_KEY },
      }
    );

    const stats = await statsRes.json();

    res.json({
      profile: findData,
      stats: stats,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
