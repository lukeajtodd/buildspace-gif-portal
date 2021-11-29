import { ref } from "vue";

declare global {
  interface Window {
    Slope: any;
  }
}

interface iSlope {
  connect?: () => any;
}

interface iData {
  autoApprove?: boolean;
  method?: string;
  publicKey?: string;
}

interface connectResponse {
  msg: string;
  data: iData;
}

let slope: iSlope = {};
let _data: iData = {};

const check = () => {
  if (!window.Slope) {
    console.error("You do not have the Slope wallet installed.");
    return false
  }

  return true
};

const init = () => {
  slope = new window.Slope();
};

const connect = async () => {
  if (_data && _data.publicKey) return;

  const { msg, data }: connectResponse = await slope.connect();

  if (msg === "ok") {
    _data = data;
    console.log("Wallet is connected: ", _data.publicKey);
  } else {
    console.warn(msg);
  }
};

const disconnect = () => {}

export const useWallet = () => {
    if (!check()) {
        return {}
    }

    init()

    return {
        slope,
        data: ref(_data),
        connect,
        disconnect
    }
};
