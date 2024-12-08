import { TelegramClient } from "@mtcute/bun"
import { Dispatcher, filters } from "@mtcute/dispatcher"
import { EventEmitter } from "events"
import * as env from "./env.ts"

// Create event emitter for notifications
export const notificationEmitter = new EventEmitter()

const tg = new TelegramClient({
  apiId: env.API_ID,
  apiHash: env.API_HASH,
  storage: "bot-data/session",
})

const dp = Dispatcher.for(tg)
dp.onNewMessage(filters.start, async (msg) => {
  await msg.answerText("Hello")
})

// Add notification handler
notificationEmitter.on("notify", async ({ userId, message }) => {
  try {
    await tg.sendText(userId, message)
  } catch (err) {
    console.error(`Failed to send notification to ${userId}:`, err)
  }
})

const user = await tg.start({ botToken: env.BOT_TOKEN })
console.log("Logged in as", user.username)
console.log("--")

// Test notification
setTimeout(() => {
  console.log("Sending test notification...")
  notificationEmitter.emit("notify", {
    userId: Number(process.env.TG_USER_ID),
    message: "👋 Test notification from mtcute bot!",
  })
}, 2000)
