//helpers
function displayBlock(ele) {
  document.querySelector(ele).style.display = "block";
}
function hideBlock(ele) {
  document.querySelector(ele).style.display = "none";
}
function valueReader(ele) {
  let value =
    document.getElementById(ele).value.toUpperCase() || "Unknown Player";
  return value;
}
function innerHTML(ele, text) {
  document.querySelector(ele).innerHTML = text;
}

//gameID & gameType
let gameID = null;
let gameType = "";

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

//new game and choose game type
function newGame() {
  displayBlock("#gameSetup");
  hideBlock(".controls");
  displayBlock(".closeSession");
}
function soloPlayerGame() {
  displayBlock("#addingPlayers");
  displayBlock(".soloGame");
  hideBlock("#gameSetup");
  gameType = "soloGames";
  generateCode();
}
function teamGame() {
  displayBlock("#addingPlayers");
  displayBlock(".teamGame");
  hideBlock("#gameSetup");
  gameType = "teamGames";
  generateCode();
}

//to close everything ongoing
function closeSession() {
  displayBlock(".controls");
  hideBlock("#gameSetup");
  hideBlock("#addingPlayers");
  hideBlock(".soloGame");
  hideBlock(".teamGame");
  hideBlock(".closeSession");
}

//adding players name and points
let points = null;
function addPlayersName() {
  generateCode();
  points = Number(document.querySelector(".points").value) || 10; //defaultValue = 10, if user doesn't provide value.
  if (gameType === "soloGames") {
    let playerA = valueReader("soloOne");
    let playerB = valueReader("soloTwo");
    innerHTML("#addTypeOne", "Player");
    innerHTML("#addNameOne", playerA);
    innerHTML("#addTypeTwo", "Player");
    innerHTML("#addNameTwo", playerB);
    innerHTML("#pointsGameType", "Player");
  } else if (gameType === "teamGames") {
    let teamOneA = valueReader("teamOneFirst");
    let teamOneB = valueReader("teamOneSecond");
    let teamTwoA = valueReader("teamTwoFirst");
    let teamTwoB = valueReader("teamTwoSecond");
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

//live scoring
let lastPointOfA = 0;
let lastPointOfB = 0;
let lastPointScoreBy = [];
function scoreCounter(e) {
  let pointScoreBy = e.target.value;
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
  scoreRules(lastPointOfA, lastPointOfB);
}
//css update as per the score
const pA = document.querySelector(".playerA");
const pB = document.querySelector(".playerB");

function updateLead(a, b) {
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

//score rules
function scoreRules(lastPointOfA, lastPointOfB) {
  let pointToWin = points + 1;
  let winner = "";
  if (lastPointOfA === pointToWin || lastPointOfB === pointToWin) {
    hideBlock("#scoreDetails");
    displayBlock("#winner_section");
    document.getElementById("winner_section").classList.add("show");

    const cmp = Math.sign(lastPointOfA - lastPointOfB);

    if (cmp === 1) {
      winner = "Side A";
    } else if (cmp === -1) {
      winner = "Side B";
    }
    innerHTML("#winner_name", winner);
  }
}

//to start a new game again
function startAnotherGame() {
  displayBlock(".controls");
  hideBlock("#scoreboard");
}

//undoPoint
function undoLastPoint() {
  if (lastPointScoreBy.length === 0) return;

  const lastScorer = lastPointScoreBy.pop();

  if (lastScorer.scorer === "A") {
    lastPointOfA--;
    innerHTML("#addPointToA", lastPointOfA);
  } else {
    lastPointOfB--;
    innerHTML("#addPointToB", lastPointOfB);
  }

  updateLead(lastPointOfA, lastPointOfB);
  scoreRules(lastPointOfA, lastPointOfB);
}

//toggleTheme
let currentTheme = JSON.parse(localStorage.getItem("selectedTheme"));

if (currentTheme === null) {
  currentTheme = true; // default = light mode
}
function changeTheme() {
  if (currentTheme === true) {
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
    document.querySelector(".themeText").innerHTML = "Switch to Dark Mode";
  } else {
    document.body.style.backgroundColor = "black";
    document.body.style.color = "white";
    document.querySelector(".themeText").innerHTML = "Switch to Light Mode";
  }
}
function toggleTheme() {
  currentTheme = !currentTheme;
  changeTheme();
  localStorage.setItem("selectedTheme", JSON.stringify(currentTheme));
}
changeTheme(); //works when screen loads or refresh
