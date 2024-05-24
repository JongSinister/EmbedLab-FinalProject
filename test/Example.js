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
  const clientID = "06e7382f-7e1e-4662-87bc-a87fbb467ad0"; // replace with your actual client ID
  const token = "RJiea2G6m64LdDmtYBJgMrL7m5H9Hu5A"; // replace with your actual token

  // const headers = new Headers();
  // headers.append("Authorization", `Basic ${btoa(`${clientID}:${token}`)}`);

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: "Basic",
      ClientID: token,
    },
    redirect: "follow",
  };

  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
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
