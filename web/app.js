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

if (lightsOn) {
  lightBulbBtn.innerHTML = `<span id="lightblub-icon" class="majesticons--lightbulb-shine"></span>`;
  lightDesc.innerHTML = "";
  lightDesc.innerHTML = `<span class="fxemoji--lightbulb-on"></span>`;
} else {
  lightBulbBtn.innerHTML = `<span id="lightblub-icon" class="majesticons--lightbulb-shine-line"></span>`;
  lightDesc.innerHTML = "";
  lightDesc.innerHTML = `<span class="fxemoji--lightbulb-off"></span>`;
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

var client = new Paho.MQTT.Client(
  "mqtt.netpie.io",
  443,
  "06e7382f-7e1e-4662-87bc-a87fbb467ad0"
);

client.onMessageArrived = onMessageArrived;

var options = {
  useSSL: true,
  userName: "RJiea2G6m64LdDmtYBJgMrL7m5H9Hu5A",
  password: "prUB5S6V2dqhnv9D35jhGM4pZGYz1wfN",
  onSuccess: onConnect,
  onFailure: doFail,
};

client.connect(options);

function onConnect() {
  client.subscribe("@msg/temp");
}

function doFail(e) {
  console.log(e);
}

function onMessageArrived(message) {
  //document.getElementById("show").innerHTML = message.payloadString;
  let state = message.payloadString[18];
  console.log(state);
  if (state == 1) {
    lightsOn = false;
  } else if (state == 2) {
    lightOn = true;
  }
}
