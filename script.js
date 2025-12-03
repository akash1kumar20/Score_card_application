// Helper functions
function displayBlock(ele) {
  const node = document.querySelector(ele);
  if (node) node.style.display = "block";
}

function hideBlock(ele) {
  const node = document.querySelector(ele);
  if (node) node.style.display = "none";
}

function valueReader(ele) {
  const val = document.getElementById(ele)?.value || "";
  return val.trim() ? val.toUpperCase() : "UNKNOWN PLAYER";
}

function innerHTML(ele, text) {
  const node = document.querySelector(ele);
  if (node) node.innerHTML = text;
}

// Game ID & Game Type
let gameID = null;
let gameType = ""; // "soloGames" | "teamGames"

// Generate a 5-char game code
function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }

  gameID = code;
  return gameID;
}

// New game & game type selection
function newGame() {
  displayBlock("#gameSetup");
  hideBlock(".controls");
  displayBlock(".closeSession");
}

function soloPlayerGame() {
  displayBlock("#addingPlayers");
  displayBlock(".soloGame");
  hideBlock("#gameSetup");
  hideBlock(".teamGame");
  gameType = "soloGames";
}

function teamGame() {
  displayBlock("#addingPlayers");
  displayBlock(".teamGame");
  hideBlock("#gameSetup");
  hideBlock(".soloGame");
  gameType = "teamGames";
}

// Close current setup
function closeSession() {
  displayBlock(".controls");
  hideBlock("#gameSetup");
  hideBlock("#addingPlayers");
  hideBlock(".soloGame");
  hideBlock(".teamGame");
  hideBlock(".closeSession");
}

// Add players & points
let points = null;

function addPlayersName() {
  generateCode(); // Generate a fresh game ID ONCE per game

  points = Number(document.querySelector(".points")?.value) || 10; // default 10

  if (gameType === "soloGames") {
    const playerA = valueReader("soloOne");
    const playerB = valueReader("soloTwo");

    innerHTML("#addTypeOne", "Player");
    innerHTML("#addNameOne", playerA);
    innerHTML("#addTypeTwo", "Player");
    innerHTML("#addNameTwo", playerB);
    innerHTML("#pointsGameType", "Player");
  } else if (gameType === "teamGames") {
    const teamOneA = valueReader("teamOneFirst");
    const teamOneB = valueReader("teamOneSecond");
    const teamTwoA = valueReader("teamTwoFirst");
    const teamTwoB = valueReader("teamTwoSecond");

    innerHTML("#addTypeOne", "Team");
    innerHTML("#addNameOne", `${teamOneA} & ${teamOneB}`);
    innerHTML("#addTypeTwo", "Team");
    innerHTML("#addNameTwo", `${teamTwoA} & ${teamTwoB}`);
    innerHTML("#pointsGameType", "Team");
  }

  innerHTML("#pointsGame", points);
  innerHTML("#pointsToWin", points + 1);
  innerHTML("#gameIDDisplay", gameID);

  displayBlock("#scoreboard");
  hideBlock("#addingPlayers");
  hideBlock(".closeSession");
}

// Live scoring
let lastPointOfA = 0;
let lastPointOfB = 0;
let lastPointScoreBy = []; // stack of { scorer: "A" | "B" }

function scoreCounter(e) {
  const pointScoreBy = e.target.value;

  if (pointScoreBy === "sideBPoints") {
    lastPointOfB++;
    lastPointScoreBy.push({ scorer: "B" });
    innerHTML("#addPointToB", lastPointOfB);
  } else {
    lastPointOfA++;
    lastPointScoreBy.push({ scorer: "A" });
    innerHTML("#addPointToA", lastPointOfA);
  }

  updateLead(lastPointOfA, lastPointOfB);
  scoreRules();
}

// CSS update as per the score
const pA = document.querySelector(".playerA");
const pB = document.querySelector(".playerB");

function updateLead(a, b) {
  if (!pA || !pB) return;

  // Clear old classes
  [pA, pB].forEach((el) => {
    el.classList.remove("player--leading", "player--trailing", "player--tie");
  });

  // Compare using Math.sign
  const cmp = Math.sign(a - b); // 1 = A leading, -1 = B leading, 0 = tie

  if (cmp === 1) {
    pA.classList.add("player--leading");
    pB.classList.add("player--trailing");
  } else if (cmp === -1) {
    pB.classList.add("player--leading");
    pA.classList.add("player--trailing");
  } else {
    pA.classList.add("player--tie");
    pB.classList.add("player--tie");
  }
}

// Score rules and End Game Now
let endNowPoints = 0;
let endGame = false;

function endGameNow() {
  endNowPoints = Math.max(lastPointOfA, lastPointOfB);
  endGame = true;
  scoreRules();
}

function scoreRules() {
  const pointToWin = endGame === true ? endNowPoints : points + 1;
  let winner = "";

  if (lastPointOfA === pointToWin || lastPointOfB === pointToWin) {
    hideBlock("#scoreDetails");
    displayBlock("#winner_section");
    const ws = document.getElementById("winner_section");
    if (ws) ws.classList.add("show"); //to show the winner section

    const cmp = Math.sign(lastPointOfA - lastPointOfB);

    if (cmp === 1) {
      winner = "Side A";
    } else if (cmp === -1) {
      winner = "Side B";
    } else if (cmp === 0) {
      winner = "Both side";
    }

    innerHTML("#winner_name", winner);
  }
}

// Start a new game again
function startAnotherGame() {
  displayBlock(".controls");
  hideBlock("#scoreboard");
  // For now a full reload is simplest to reset all state
  location.reload();
}

// Undo last point
function undoLastPoint() {
  if (lastPointScoreBy.length === 0) return;

  const lastScorer = lastPointScoreBy.pop();

  if (lastScorer.scorer === "A") {
    lastPointOfA = Math.max(0, lastPointOfA - 1);
    innerHTML("#addPointToA", lastPointOfA);
  } else {
    lastPointOfB = Math.max(0, lastPointOfB - 1);
    innerHTML("#addPointToB", lastPointOfB);
  }

  updateLead(lastPointOfA, lastPointOfB);
  scoreRules();
}

// History (placeholder)
function displayHistory() {
  displayBlock("#history");
  setTimeout(() => {
    hideBlock("#history");
  }, 2500);
}

// Theme toggle
let currentTheme = JSON.parse(localStorage.getItem("selectedTheme"));

if (currentTheme === null) {
  currentTheme = true; // default = light mode
}

function changeTheme() {
  if (currentTheme === true) {
    // Light mode
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
    const t = document.querySelector(".themeText");
    if (t) t.innerHTML = "Switch to Dark Mode";
  } else {
    // Dark mode
    document.body.style.backgroundColor = "black";
    document.body.style.color = "white";
    const t = document.querySelector(".themeText");
    if (t) t.innerHTML = "Switch to Light Mode";
  }
}

function toggleTheme() {
  currentTheme = !currentTheme;
  changeTheme();
  localStorage.setItem("selectedTheme", JSON.stringify(currentTheme));
}
changeTheme(); // Apply theme on load
