const desc = document.querySelector(".desc");
const systemDesc = document.querySelector("#system-desc");
const systemBar = document.querySelector("#system-bar");
const statusDesc = document.querySelector("#status-desc");
const statusBar = document.querySelector("#status-bar");
const lightDesc = document.querySelector("#light-desc");
const systemBtn = document.querySelector("#system-btn");
const systemIcon = document.querySelector("#system-icon");
const lightBulbBtn = document.querySelector("#lightbulb-btn");
const lightBulbIcon = document.querySelector("#lightblub-icon");
const manualControl = document.querySelector("#manual-control");

// let isDay = true;
let isDay = false;
let systemOn = true;
let lightsOn = false;

// settingBtn.addEventListener("click", () => {
//   const manualContainer = document.querySelector("#manual-control");
//   if (manualOn) {
//     settingBtn.innerText = "Manual";
//     manualContainer.style.display = "none";
//     manualOn = false;
//   } else {
//     settingBtn.innerText = "Auto";
//     manualContainer.style.display = "flex";
//     manualOn = true;
//   }
// });

if (isDay) {
  statusDesc.innerText = "Manual";
} else {
  statusDesc.innerText = "Auto";
}

systemBtn.addEventListener("click", () => {
  if (systemOn) {
    systemBtn.innerHTML = `<span class="lucide--power-off"></span>`;
    systemDesc.innerText = "Off";
    statusBar.style.display = "none";
    systemOn = false;
  } else {
    systemBtn.innerHTML = `<span class="lucide--power"></span>`;
    systemDesc.innerText = "On";
    statusBar.style.display = "block";
    systemOn = true;
  }
});

lightBulbBtn.addEventListener("click", () => {
  if (lightsOn) {
    lightBulbBtn.innerHTML = `<span id="lightblub-icon" class="majesticons--lightbulb-shine-line"></span>`;
    lightDesc.innerHTML = "";
    lightDesc.innerHTML = `<span class="fxemoji--lightbulb-off"></span>`;
    lightsOn = false;
  } else {
    lightBulbBtn.innerHTML = `<span id="lightblub-icon" class="majesticons--lightbulb-shine"></span>`;
    lightDesc.innerHTML = "";
    lightDesc.innerHTML = `<span class="fxemoji--lightbulb-on"></span>`;
    lightsOn = true;
  }
});
