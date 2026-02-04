const {
  default: makeWASocket,
  useMultiFileAuthState
} = require("@whiskeysockets/baileys")

const P = require("pino")
const readline = require("readline")

async function startRemex() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth")

  const sock = makeWASocket({
    logger: P({ level: "silent" }),
    auth: state,
    printQRInTerminal: false
  })

  sock.ev.on("creds.update", saveCreds)

  // ===== PAIRING CODE =====
  if (!state.creds.registered) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    rl.question("Enter your WhatsApp number (country code + number): ", async (number) => {
      const code = await sock.requestPairingCode(number.trim())
      console.log("\nPAIRING CODE:", code)
      console.log("Enter this code in WhatsApp → Linked devices → Link with phone number\n")
      rl.close()
    })
  }

  sock.ev.on("connection.update", (update) => {
    if (update.connection === "open") {
      console.log("✅ Remex is connected to WhatsApp")
    }
  })

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message || msg.key.fromMe) return

    const from = msg.key.remoteJid
    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text

    if (!text) return

    const body = text.toLowerCase()

    if (body === "hi") {
      await sock.sendMessage(from, { text: "Hello 👋 I'm Remex." })
    }

    if (body === "name" || body === "your name") {
      await sock.sendMessage(from, { text: "My name is Remex 🤖" })
    }

    if (body === "ping") {
      await sock.sendMessage(from, { text: "pong 🏓" })
    }
  })
}

startRemex()
