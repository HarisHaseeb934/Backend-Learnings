// module.exports = function add(a, b){
//     return a + b;
// }

// module.exports.add = (a, b) => a + b;
// module.exports.sub = (a, b) => a - b;

const add = (a, b) => a + b;
const sub = (a, b) => a - b;


// module.exports.add replaced with below
// module.exports = {add, sub}

console.log("connecting");
exports = {connecting : "modules"};