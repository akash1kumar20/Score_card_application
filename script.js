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
let points = null; // base "game points" user enters (e.g. 10)

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

  const baseTarget = points + 1; // e.g. 11 in a 10-point game

  innerHTML("#pointsGame", points);
  innerHTML(
    "#pointsToWin",
    `${baseTarget} (win by 2 after ${points}-${points})`
  );
  innerHTML("#gameIDDisplay", gameID);

  // reset scores display for a fresh game
  lastPointOfA = 0;
  lastPointOfB = 0;
  lastPointScoreBy = [];
  refreshScoreDisplay();
  updateLead(lastPointOfA, lastPointOfB);

  displayBlock("#scoreboard");
  hideBlock("#addingPlayers");
  hideBlock(".closeSession");
}

// Live scoring
let lastPointOfA = 0;
let lastPointOfB = 0;
let lastPointScoreBy = []; // stack of { scorer: "A" | "B" }

// Display logic: numbers before deuce, ADVANTAGE/DEUCE after both reach `points`
function refreshScoreDisplay() {
  const inAdvantagePhase =
    points !== null && lastPointOfA >= points && lastPointOfB >= points; // both reached base points (e.g. 10–10 or beyond)

  if (!inAdvantagePhase) {
    // Normal phase: show numeric scores
    innerHTML("#addPointToA", lastPointOfA);
    innerHTML("#addPointToB", lastPointOfB);
  } else {
    // Advantage phase: no more numeric updating, only texts
    if (lastPointOfA === lastPointOfB) {
      // Deuce state
      innerHTML("#addPointToA", "DEUCE");
      innerHTML("#addPointToB", "DEUCE");
    } else if (lastPointOfA > lastPointOfB) {
      innerHTML("#addPointToA", "ADVANTAGE");
      innerHTML("#addPointToB", "BEHIND");
    } else {
      innerHTML("#addPointToB", "ADVANTAGE");
      innerHTML("#addPointToA", "BEHIND");
    }
  }
}

function scoreCounter(e) {
  const pointScoreBy = e.target.value;

  if (pointScoreBy === "sideBPoints") {
    lastPointOfB++;
    lastPointScoreBy.push({ scorer: "B" });
  } else {
    lastPointOfA++;
    lastPointScoreBy.push({ scorer: "A" });
  }

  refreshScoreDisplay();
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

// Score rules + Advantage + End Game Now
let endGame = false; // if true, force-end game using current scores

function endGameNow() {
  const confirmation = confirm("Do you want to end the current game?");
  if (confirmation) {
    endGame = true;
    scoreRules();
  } else {
    return;
  }
}

function showWinner(winnerLabel) {
  hideBlock("#scoreDetails");
  displayBlock("#winner_section");
  const ws = document.getElementById("winner_section");
  if (ws) ws.classList.add("show");
  innerHTML("#winner_name", winnerLabel);
}

function scoreRules() {
  const a = lastPointOfA;
  const b = lastPointOfB;

  // If End Game button pressed: decide winner immediately
  if (endGame) {
    let winner = "";
    if (a === b) {
      winner = "Both sides";
    } else if (a > b) {
      winner = "Side A";
    } else {
      winner = "Side B";
    }
    showWinner(winner);
    return;
  }

  const baseTarget = points + 1; // e.g. 11 in a 10-point game

  // === Phase 1: before both reach `points` (pre-deuce) ===
  // No one can win before someone reaches baseTarget
  if (a < baseTarget && b < baseTarget) {
    return;
  }

  // Someone just reached exactly baseTarget and the other is still below `points`
  // → this keeps your original behaviour
  if (a === baseTarget && b < points) {
    showWinner("Side A");
    return;
  }
  if (b === baseTarget && a < points) {
    showWinner("Side B");
    return;
  }

  // === Phase 2: advantage phase (both reached at least `points`) ===
  if (a >= points && b >= points) {
    // Deuce/advantage logic: win by 2
    if (Math.abs(a - b) >= 2) {
      const winner = a > b ? "Side A" : "Side B";
      showWinner(winner);
    }
  }
}

// Start a new game again
function startAnotherGame() {
  displayBlock(".controls");
  hideBlock("#scoreboard");
  location.reload();
}

// Undo last point
function undoLastPoint() {
  if (lastPointScoreBy.length === 0) return;

  const lastScorer = lastPointScoreBy.pop();

  if (lastScorer.scorer === "A") {
    lastPointOfA = Math.max(0, lastPointOfA - 1);
  } else {
    lastPointOfB = Math.max(0, lastPointOfB - 1);
  }

  refreshScoreDisplay();
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
