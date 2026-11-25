type BotpressApi = {
  on: (
    event: "webchat:initialized" | "webchat:ready",
    callback: () => void,
  ) => (() => void) | void;
  open: () => void;
  sendMessage: (message: string) => Promise<void>;
};

declare global {
  interface Window {
    botpress?: BotpressApi;
  }
}

let isBotpressInitialized = false;
let isWebchatReady = false;
let openWhenInitialized = false;
let initializationListenerInstalled = false;
let isSendingMessages = false;
const pendingMessages: string[] = [];

const PRODUCT_ENQUIRY_MESSAGE =
  "Hi, I’d like to browse the available products at CarePlus Pharmacy.";

async function sendPendingMessages() {
  if (!isWebchatReady || !window.botpress || isSendingMessages) return;

  isSendingMessages = true;
  try {
    while (pendingMessages.length > 0 && window.botpress) {
      const message = pendingMessages.shift();
      if (message) await window.botpress.sendMessage(message);
    }
  } catch (error) {
    console.error("CarePlus Pharmacy enquiry message could not be sent.", error);
  } finally {
    isSendingMessages = false;
    if (pendingMessages.length > 0) void sendPendingMessages();
  }
}

export function connectCarePlusBotpress() {
  if (initializationListenerInstalled || !window.botpress) return;

  initializationListenerInstalled = true;
  window.botpress.on("webchat:initialized", () => {
    isBotpressInitialized = true;

    if (!openWhenInitialized) return;

    openWhenInitialized = false;
    window.botpress?.open();
  });
  window.botpress.on("webchat:ready", () => {
    isWebchatReady = true;
    void sendPendingMessages();
  });
}

export function startCarePlusProductEnquiry() {
  pendingMessages.push(PRODUCT_ENQUIRY_MESSAGE);

  if (isBotpressInitialized && window.botpress) {
    window.botpress.open();
    void sendPendingMessages();
  } else {
    openWhenInitialized = true;
  }
}
