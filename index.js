import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from "@whiskeysockets/baileys";
import Pino from "pino";

const PHONE_NUMBER = "2348057228108"; // ← PUT YOUR NUMBER HERE (NO +)

async function startRemex() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket({
    auth: state,
    logger: Pino({ level: "silent" }),
    printQRInTerminal: false,
    browser: ["Remex", "Chrome", "1.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const reason =
        lastDisconnect?.error?.output?.statusCode;

      if (reason !== DisconnectReason.loggedOut) {
        console.log("🔄 Connection lost. Reconnecting...");
        startRemex();
      } else {
        console.log("❌ Logged out. Delete auth folder and restart.");
      }
    }

    if (connection === "open") {
      console.log("✅ Remex is connected!");
    }
  });

  if (!state.creds.registered) {
    try {
      const code = await sock.requestPairingCode(PHONE_NUMBER);
      console.log("🔑 Pairing Code:", code);
    } catch (err) {
      console.log("❌ Pairing failed:", err.message);
    }
  }

  // SIMPLE AUTO-REPLY
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text;

    if (!text) return;

    await sock.sendMessage(msg.key.remoteJid, {
      text: `🤖 Remex here!\nYou said: ${text}`
    });
  });
}

startRemex();
