import express from "express"

const app = express()

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send(`${process.pid}`)
})

const server = app.listen(PORT, () => {
    console.log("App is Runnibg")
})

process.on("SIGINT", () => {
    console.log("Closing HTTP server safely...")
    server.close(() => {
        process.exit(0)
    })
})