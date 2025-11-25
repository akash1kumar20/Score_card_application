//helpers
function displayBlock(ele) {
  document.querySelector(ele).style.display = "block";
}
function hideBlock(ele) {
  document.querySelector(ele).style.display = "none";
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
}
function teamGame() {
  displayBlock("#addingPlayers");
  displayBlock(".teamGame");
  hideBlock("#gameSetup");
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
