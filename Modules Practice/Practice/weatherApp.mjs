import readline from "readline/promises";
import https from "https";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function weather(city) {
    const apiKey = "ce5cc60e25a84eaa8ba42602262007";
  const opitions = {
    hostname: "api.weatherapi.com",
    path: `/v1/current.json?key=${apiKey}&q=${city}`,
    method: "GET",
    headers: {
      "User-Agent": "Node.js Server",
    },
  };

  const client = https.request(opitions, (res) => {
    let body = ""
    res.on("data", (data) => {
        body += data;
    })

    res.on("end", () => {
        let parse = JSON.parse(body)

        console.log(res)
        console.log(`City is ${parse.location.name}`)
        console.log(`${parse.location.name} is ${parse.location.region}`)
        console.log(`${parse.location.name} in ${parse.location.country}`)
        console.log(`${parse.location.name} local time is ${parse.location.localtime}`)
        console.log(`Temp ${parse.current.temp_c}`)
        console.log(`Condition ${parse.current.condition.text}`)
        console.log(`Wind Speed is ${parse.current.wind_kph}KPH`)
        console.log(`Wind Direction is ${parse.current.wind_dir}`)
        console.log(`Humidity is ${parse.current.humidity}KPH`)
        console.log(`Clouds are ${parse.current.cloud}`)
        console.log(`Feels Like ${parse.current.feelslike_c}KPH`)
    })

  })

  client.on("error", (error) => {
    console.log(error)
  })

  client.end()

}


let name = await rl.question("Enter City Name: ");
weather(name.trim().toLowerCase())
rl.close()
// const API =  "ce5cc60e25a84eaa8ba42602262007"
// const client = https.request();
