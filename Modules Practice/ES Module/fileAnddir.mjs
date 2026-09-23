import { fileURLToPath } from 'url';

// console.log(__filename)
// console.log(__dirname)

console.log(import.meta.url) 
console.log(new URL(import.meta.url))
console.log(new URL(import.meta.url).pathname)

console.log(fileURLToPath(import.meta.url))

console.log(import.meta.filename)

console.log(import.meta.dirname)

