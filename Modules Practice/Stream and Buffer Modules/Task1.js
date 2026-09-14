const str = "Node.js Backend";

const buf = Buffer.from(str);

console.log("Buffer: " , buf);

console.log("Buffer Length: " , buf.length);

console.log(buf.toString("base64"))

const base = buf.toString("base64");

const buf2 = Buffer.from(base, "base64");

console.log("UTF: " , buf2.toString("utf-8"))