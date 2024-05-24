const desc = document.querySelector(".desc");
const systemDesc = document.querySelector("#system-desc");
const systemBar = document.querySelector("#system-bar");
const statusDesc = document.querySelector("#status-desc");
const statusBar = document.querySelector("#status-bar");
const lightDesc = document.querySelector("#light-desc");
const systemBtn = document.querySelector("#system-btn");
const systemIcon = document.querySelector("#system-icon");
const lightBulbBtn = document.querySelector("#lightbulb-btn");
const lightBulbIcon = document.querySelector("#lightbulb-icon");
const manualControl = document.querySelector("#manual-control");

const url = "https://api.netpie.io/v2/device/shadow/data";
const clientID = "d98012c1-e9b1-4f37-8c4b-d7b6d4157672"; // replace with your actual client ID
const token = "stWPQdAC4gt4YgkWvkKFJ3miCijbUybF"; // replace with your actual token

let isDay = true;
// let isDay = false;
let systemOn = true;
let lightsOn = false;
let state = 0;
let prevstate = -1;

function mqttSend(topic, msg) {
  var message = new Paho.MQTT.Message(msg);
  message.destinationName = topic;
  client.send(message);
}

function setStatus() {
  if (isDay) {
    statusDesc.innerText = "Manual";
  } else {
    statusDesc.innerText = "Auto";
  }
}

function setLight() {
  prevstate = state;
  if (!systemOn) {
    lightBulbBtn.innerHTML = `<span id="lightbulb-icon" class="majesticons--lightbulb-shine-line"></span>`;
    lightDesc.innerHTML = `<span class="fxemoji--lightbulb-off"></span>`;
    state = 0;
    mqttSend("@msg/temp", `{"data":{"state":0}}`);
    return;
  }
  if (lightsOn) {
    lightBulbBtn.innerHTML = `<span id="lightbulb-icon" class="majesticons--lightbulb-shine-line"></span>`;
    lightDesc.innerHTML = `<span class="fxemoji--lightbulb-off"></span>`;
    lightsOn = false;
    if (state == 2) {
      state = 4;
    } else if (state == 3) {
      state = 1;
    }
  } else {
    lightBulbBtn.innerHTML = `<span id="lightbulb-icon" class="majesticons--lightbulb-shine"></span>`;
    lightDesc.innerHTML = `<span class="fxemoji--lightbulb-on"></span>`;
    lightsOn = true;
    if (state == 1) {
      state = 3;
    } else if (state == 4) {
      state = 2;
    }
  }
  if (state == 1) {
    lightBulbBtn.innerHTML = `<span id="lightbulb-icon" class="majesticons--lightbulb-shine-line"></span>`;
    lightDesc.innerHTML = `<span class="fxemoji--lightbulb-off"></span>`;
    lightsOn = false;
  } else if (state == 2) {
    lightBulbBtn.innerHTML = `<span id="lightbulb-icon" class="majesticons--lightbulb-shine"></span>`;
    lightDesc.innerHTML = `<span class="fxemoji--lightbulb-on"></span>`;
    lightsOn = true;
  }

  mqttSend("@msg/temp", `{"data":{"state":${state}}`);
  postData();
  console.log(state);
}

function setLightFromBoard() {
  if (!systemOn) {
    lightBulbBtn.innerHTML = `<span id="lightbulb-icon" class="majesticons--lightbulb-shine-line"></span>`;
    lightDesc.innerHTML = `<span class="fxemoji--lightbulb-off"></span>`;
    state = 0;
    mqttSend("@msg/temp", `{"data":{"state":0}}`);
    return;
  }
  if (lightsOn) {
    lightBulbBtn.innerHTML = `<span id="lightbulb-icon" class="majesticons--lightbulb-shine-line"></span>`;
    lightDesc.innerHTML = `<span class="fxemoji--lightbulb-off"></span>`;
    lightsOn = false;
    state = 1;
  } else {
    lightBulbBtn.innerHTML = `<span id="lightbulb-icon" class="majesticons--lightbulb-shine"></span>`;
    lightDesc.innerHTML = `<span class="fxemoji--lightbulb-on"></span>`;
    lightsOn = true;
    state = 2;
  }
  if (state == 1) {
    lightBulbBtn.innerHTML = `<span id="lightbulb-icon" class="majesticons--lightbulb-shine-line"></span>`;
    lightDesc.innerHTML = `<span class="fxemoji--lightbulb-off"></span>`;
    lightsOn = false;
  } else if (state == 2) {
    lightBulbBtn.innerHTML = `<span id="lightbulb-icon" class="majesticons--lightbulb-shine"></span>`;
    lightDesc.innerHTML = `<span class="fxemoji--lightbulb-on"></span>`;
    lightsOn = true;
  }
  postData();
}

function setSystem() {
  if (systemOn) {
    systemBtn.innerHTML = `<span class="lucide--power-off"></span>`;
    systemDesc.innerText = "Off";
    statusBar.style.display = "none";
    state = 0;
    systemOn = false;
    if (lightsOn) {
      console.log("C");
      setLight();
    }
  } else {
    systemBtn.innerHTML = `<span class="lucide--power"></span>`;
    systemDesc.innerText = "On";
    statusBar.style.display = "block";
    state = 1;
    systemOn = true;
  }
  postData();
  console.log(state);
  if (state == 1) {
    lightBulbBtn.innerHTML = `<span id="lightbulb-icon" class="majesticons--lightbulb-shine-line"></span>`;
    lightDesc.innerHTML = `<span class="fxemoji--lightbulb-off"></span>`;
    lightsOn = false;
  } else if (state == 2) {
    lightBulbBtn.innerHTML = `<span id="lightbulb-icon" class="majesticons--lightbulb-shine"></span>`;
    lightDesc.innerHTML = `<span class="fxemoji--lightbulb-on"></span>`;
    lightsOn = true;
  }
  mqttSend("@msg/temp", `{"data":{"state":${state}}`);
}

setStatus();

systemBtn.addEventListener("click", () => setSystem());

lightBulbBtn.addEventListener("click", () => setLight());

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

async function onMessageArrived(message) {
  const data = await getData();
  if (state == 1 && prevstate != 3) {
    setLightFromBoard();
    lightsOn = false;
  } else if (state == 2 && prevstate != 4) {
    setLightFromBoard();
    lightsOn = true;
  }
  console.log(state);
}

// Function to fetch data from the API
const getData = async (timeout = 2000) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Device ${clientID}:${token}`,
    },
  };

  // Create a promise that rejects if the request times out
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), timeout)
  );

  try {
    // Fetch data with a timeout
    const response = await Promise.race([
      fetch(url, requestOptions),
      timeoutPromise,
    ]);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    state = data.data.state;

    //console.log(data);
    return data; // Returning only the state for simplicity, you can return data if needed
  } catch (error) {
    console.error("Error fetching shadow data:", error);
    throw error;
  }
};

// Call the getDataWithTimeout function with the desired timeout (in milliseconds)
getData(2000)
  .then((state) => {
    console.log("State:", state);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

const postData = async () => {
  const reqOpt = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Device ${clientID}:${token}`,
    },
    body: JSON.stringify({
      data: {
        state: state.toString(),
      },
    }),
  };
  try {
    const response = await fetch(url, reqOpt);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("POST Success:", data);
    return data;
  } catch (error) {
    console.error("POST Error:", error);
  }
};
