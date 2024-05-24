// Initialize the MQTT client
var client = new Paho.MQTT.Client(
  "mqtt.netpie.io",
  443,
  "06e7382f-7e1e-4662-87bc-a87fbb467ad0"
);

client.onMessageArrived = onMessageArrived;


// Function to fetch data from the API
const getData = async () => {
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

  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    let stateValue = data.data.state;
    console.log(data);
    console.log(stateValue);
    // console.log(data.toString);
    return data;
  } catch (error) {
    console.error("Error fetching shadow data:", error);
    throw error;
  }
};
// MQTT connection options
var options = {
  useSSL: true,
  userName: "RJiea2G6m64LdDmtYBJgMrL7m5H9Hu5A",
  password: "prUB5S6V2dqhnv9D35jhGM4pZGYz1wfN",
  onSuccess: onConnect,
  onFailure: doFail,
};

// Connect to the MQTT broker
client.connect(options);

// Function called when the client connects successfully
function onConnect() {
  console.log("Connected to MQTT broker");
  client.subscribe("@msg/temp");
}

// Function called when the client fails to connect
function doFail(e) {
  console.error("Connection failed:", e);
}

// Function called when a message arrives
async function onMessageArrived(message) {
  console.log("Message arrived:", message.payloadString);
  const data = await getData();
  if (data) {
    document.getElementById("show").innerHTML = JSON.stringify(data, null, 2);
  } else {
    document.getElementById("show").innerHTML = "Failed to fetch data";
  }
}
