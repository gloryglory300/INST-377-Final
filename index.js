const express = require("express");
const bodyParser = require("body-parser");
const supabaseClient = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

const supabase = supabaseClient.createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const API_KEY = process.env.MARVEL_API_KEY;

// Pages

// Supabase Read

// Supabase Write

// External API
