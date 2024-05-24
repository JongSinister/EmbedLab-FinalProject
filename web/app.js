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

let isDay = true;
// let isDay = false;
let systemOn = true;
let lightsOn = false;
let state = 0;

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
  if (lightsOn) {
    lightBulbBtn.innerHTML = `<span id="lightbulb-icon" class="majesticons--lightbulb-shine-line"></span>`;
    lightDesc.innerHTML = "";
    lightDesc.innerHTML = `<span class="fxemoji--lightbulb-off"></span>`;
    lightsOn = false;
    //console.log("HI");
    mqttSend("@msg/temp", "bruh");
    //client.publish("@msg/temp", "Hello mqtt")
  } else {
    lightBulbBtn.innerHTML = `<span id="lightbulb-icon" class="majesticons--lightbulb-shine"></span>`;
    lightDesc.innerHTML = "";
    lightDesc.innerHTML = `<span class="fxemoji--lightbulb-on"></span>`;
    lightsOn = true;
    //mqttSend("@msg/temp", "bruh");
  }
}

function setSystem() {
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
  //document.getElementById("show").innerHTML = message.payloadString;
  //state = message.payloadString[18];
  const data = await getData();
  console.log(state);
  if (state == 1) {
    setLight();
    lightsOn = false;
  } else if (state == 2) {
    setLight();
    lightsOn = true;
  }
}

// Function to fetch data from the API
const getData = async (timeout = 2000) => {
  const url = "https://api.netpie.io/v2/device/shadow/data";
  const clientID = "d98012c1-e9b1-4f37-8c4b-d7b6d4157672"; // replace with your actual client ID
  const token = "stWPQdAC4gt4YgkWvkKFJ3miCijbUybF"; // replace with your actual token

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Device ${clientID}:${token}`,
    },
  };

  // Create a promise that rejects if the request times out
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out')), timeout)
  );

  try {
    // Fetch data with a timeout
    const response = await Promise.race([
      fetch(url, requestOptions),
      timeoutPromise
    ]);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    state = data.data.state;

    console.log(data);
    return data; // Returning only the state for simplicity, you can return data if needed
  } catch (error) {
    console.error("Error fetching shadow data:", error);
    throw error;
  }
};

// Call the getDataWithTimeout function with the desired timeout (in milliseconds)
getData(2000)
  .then(state => {
    console.log("State:", state);
  })
  .catch(error => {
    console.error("Error:", error);
  });

