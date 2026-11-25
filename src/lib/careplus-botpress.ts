type BotpressApi = {
  on: (event: "webchat:initialized", callback: () => void) => (() => void) | void;
  open: () => void;
};

declare global {
  interface Window {
    botpress?: BotpressApi;
  }
}

let isBotpressInitialized = false;
let openWhenInitialized = false;
let initializationListenerInstalled = false;

export function connectCarePlusBotpress() {
  if (initializationListenerInstalled || !window.botpress) return;

  initializationListenerInstalled = true;
  window.botpress.on("webchat:initialized", () => {
    isBotpressInitialized = true;

    if (openWhenInitialized) {
      openWhenInitialized = false;
      window.botpress?.open();
    }
  });
}

export function openCarePlusBotpress() {
  if (isBotpressInitialized && window.botpress) {
    window.botpress.open();
    return;
  }

  openWhenInitialized = true;
}
