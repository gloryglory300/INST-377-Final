# INST-377-Final Project: Marvel Rivals Stat Tracker

## Project Description

Marvel Rivals Tracker is a full-stack web application that allows users to search Marvel Rivals player profiles, view gameplay statistics, visualize performance using interactive charts, and save players to a Supabase database for later reference. 

## Target Browsers
- Chrome 
- Microsoft Edge
- Safari

# Developer Manual 

See below for setup instructions and API documentation.

## Setup
1. Clone repo
2. Run: npm install
3. Create .env file:
   SUPABASE_URL=your_url
   SUPABASE_KEY=your_key
   MARVEL_API_KEY=your_api_key

## Run locally
npm run dev

Server runs on:
http://localhost:3000

## API Endpoints

### GET /players
Returns all saved players from Supabase.

### POST /players
Adds a player:
{
  "username": "string",
  "stats": "object (Marvel API response)"
}

## Database Schema (Supabase)

Table: players

- username (text)
- uid (integer)
- wins (integer)
- matches (integer)
- kills (integer)
- deaths (integer)
- assists (integer)

### GET /api/player/:name
Fetches external Marvel Rivals API data + stats.

## Known Issues
- API rate limits may delay responses
- Stats may be missing for new players and will only show stats for current season ( which came out recently so overall matches and stats may be low)
- Stats do not show for players with parts of their profiles private 
(ex. my profile "enteh" will currently return "null" for all entries but the pro player "Sypeh" or 
"TSM Bready" will return results)

## Future Improvements
- Add authentication
- Add more detailed match history graphs (ex. stats by game)
- Add player comparison system