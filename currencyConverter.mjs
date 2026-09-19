import readline from "readline/promises";
import https from "https";
import { hostname } from "os";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const options = {
  hostname: "v6.exchangerate-api.com",
  path: "/v6/latest/USD",
  method: "GET",
  headers: {
    Authorization: "Bearer a7950db7e37ce6ffa2afae38",
    USER_AGENT: "Node.js Server",
  },
};

const clientReq = https.request(options, (res) => {
  let body = "";
  res.on("data", (data) => {
    body += data;
  });

  res.on("end", async () => {
    let currency = JSON.parse(body);
    console.log("USD Converter");
    try {
      let amount = await rl.question("Enter Amount: ");
      let code = await rl.question(
        "Enter Code Where You want to convert (INR, PKR): ",
      );
      console.log(code)
      let rate = currency["conversion_rates"][code.toUpperCase()]
      console.log(`${amount} is Approximately ${amount * rate}`)
      
    } catch (error) {
      console.log(error.message);
    }finally{
        rl.close()
    }
  });
});

clientReq.on("error", (error) => {
  console.log(error);
});

clientReq.end();
