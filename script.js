let circleCount = parseInt(localStorage.getItem("circleCount")) || 0;
let totalCount = parseInt(localStorage.getItem("totalCount")) || 0;
let muteAll = localStorage.getItem("muteAll") === "true";
let muteClick = localStorage.getItem("muteClick") === "true";
let muteReset = localStorage.getItem("muteReset") === "true";

let selectedClickSound = localStorage.getItem("selectedClickSound") || "clickSound1";
let selectedResetSound = localStorage.getItem("selectedResetSound") || "errorSound1";
let selectedGoalSound = localStorage.getItem("selectedGoalSound") || "sound1";

let targetGoal = parseInt(localStorage.getItem("targetGoal")) || 0;
let globalVolume = parseFloat(localStorage.getItem("globalVolume")) || 1.0;

const circle = document.getElementById("circle");
const circleCountElement = document.getElementById("circleCount");
const countDisplay = document.getElementById("countDisplay");

// تهيئة الواجهة
circleCountElement.textContent = circleCount;
countDisplay.textContent = totalCount;
document.getElementById("muteAllCheck").checked = muteAll;
document.getElementById("muteClickCheck").checked = muteClick;
document.getElementById("muteResetCheck").checked = muteReset;
document.getElementById("clickSoundSelect").value = selectedClickSound;
document.getElementById("errorSoundSelect").value = selectedResetSound;
document.getElementById("soundSelect").value = selectedGoalSound;
document.getElementById("volumeSlider").value = globalVolume;
document.getElementById("volValue").textContent = Math.round(globalVolume * 100) + "%";

// ضبط القيمة المبدئية للهدف في القائمة
if ([33, 100, 133, 500, 1000].includes(targetGoal)) {
    document.getElementById("goalSelect").value = targetGoal;
} else if (targetGoal > 0) {
    document.getElementById("goalSelect").value = "custom";
    document.getElementById("customGoalInput").style.display = "block";
    document.getElementById("customGoalInput").value = targetGoal;
}

function playSound(id) {
  if (muteAll) return;
  const audio = document.getElementById(id);
  if (audio) {
    audio.volume = globalVolume;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }
}

circle.onclick = function() {
  if (document.getElementById("dialogBox").style.display === "block") return;
  
  circleCount++;
  totalCount++;
  circleCountElement.textContent = circleCount;
  countDisplay.textContent = totalCount;
  localStorage.setItem("circleCount", circleCount);
  localStorage.setItem("totalCount", totalCount);

  if (!muteClick) playSound(selectedClickSound);

  // منطق الهدف وتأثير التوهج
  if (targetGoal > 0 && circleCount % targetGoal === 0) {
    setTimeout(() => playSound(selectedGoalSound), 100);
    circle.classList.add("active-goal");
    if (navigator.vibrate) navigator.vibrate([300, 100, 300]);
    setTimeout(() => circle.classList.remove("active-goal"), 2000);
  }
};

document.getElementById("goalSelect").onchange = function() {
  if(this.value === "custom") {
    document.getElementById("customGoalInput").style.display = "block";
  } else {
    document.getElementById("customGoalInput").style.display = "none";
    targetGoal = parseInt(this.value);
    localStorage.setItem("targetGoal", targetGoal);
  }
};

document.getElementById("customGoalInput").oninput = function() {
  targetGoal = parseInt(this.value) || 0;
  localStorage.setItem("targetGoal", targetGoal);
};

document.getElementById("clickSoundSelect").onchange = function() {
  selectedClickSound = this.value;
  localStorage.setItem("selectedClickSound", selectedClickSound);
  playSound(selectedClickSound);
};

document.getElementById("errorSoundSelect").onchange = function() {
  selectedResetSound = this.value;
  localStorage.setItem("selectedResetSound", selectedResetSound);
  playSound(selectedResetSound);
};

document.getElementById("resetButton").onclick = () => {
  document.getElementById("dialogBox").style.display = "block";
  document.getElementById("dialogNumber").textContent = circleCount;
};

document.getElementById("resetConfirm").onclick = () => {
  circleCount = 0;
  circleCountElement.textContent = 0;
  localStorage.setItem("circleCount", 0);
  document.getElementById("dialogBox").style.display = "none";
  if (!muteReset) playSound(selectedResetSound);
};

document.getElementById("resetTotalBtn").onclick = function() {
  if(confirm("هل تريد تصفير الإجمالي العام؟")) {
    totalCount = 0;
    countDisplay.textContent = 0;
    localStorage.setItem("totalCount", 0);
    if (!muteReset) playSound(selectedResetSound);
  }
};

document.getElementById("cancelReset").onclick = () => {
  document.getElementById("dialogBox").style.display = "none";
};

document.getElementById("menuButton").onclick = (e) => {
  const menu = document.getElementById("dropdownMenu");
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
  e.stopPropagation();
};

document.getElementById("volumeSlider").oninput = function() {
  globalVolume = this.value;
  document.getElementById("volValue").textContent = Math.round(this.value * 100) + "%";
  localStorage.setItem("globalVolume", globalVolume);
};

document.getElementById("muteAllCheck").onchange = function() { muteAll = this.checked; localStorage.setItem("muteAll", muteAll); };
document.getElementById("muteClickCheck").onchange = function() { muteClick = this.checked; localStorage.setItem("muteClick", muteClick); };
document.getElementById("muteResetCheck").onchange = function() { muteReset = this.checked; localStorage.setItem("muteReset", muteReset); };
document.getElementById("soundSelect").onchange = function() { selectedGoalSound = this.value; localStorage.setItem("selectedGoalSound", selectedGoalSound); };

setInterval(() => {
  const now = new Date();
  document.getElementById("clock").textContent = String(now.getHours()).padStart(2, '0') + ":" + String(now.getMinutes()).padStart(2, '0');
}, 1000);

window.onclick = (e) => {
  const menu = document.getElementById("dropdownMenu");
  if (!e.target.matches('.menu-button') && !menu.contains(e.target)) menu.style.display = "none";
};

