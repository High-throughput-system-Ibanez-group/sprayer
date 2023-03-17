import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import http from "http"
import { Server } from "socket.io"
import { SerialPort } from "serialport"

dotenv.config()
const app: Express = express()
const server = http.createServer(app)
const io = new Server(server)
const port = process.env.PORT

// const serialPort = new SerialPort({
// 	path: '/dev/tty.usbmodem1301',
// 	baudRate: 9600,
// })
// let val = false
// setInterval(() => {
//   console.log("in")
//   serialPort.write(val ? "open" : "close", err => {
//     if (err) {
//       return console.log('Error on write: ', err?.message)
//     }
//   })
//   val = !val
// }, 10000)

io.on("connection", (socket) => {
  console.log("a user connected")
})

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server")
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
