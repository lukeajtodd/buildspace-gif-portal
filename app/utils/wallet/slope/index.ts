import { reactive } from 'vue'

declare global {
  interface Window {
    Slope: any;
  }
}

interface connectResponse {
  msg: string;
  data: {
    autoApprove: boolean;
    method: string;
    publicKey: string;
  };
}

const slope = reactive({})
const data = reactive({})

export const check = () => {
  return !!window.Slope;
}

export const init = () => {
  slope = new window.Slope();
  return this;
}

export const SlopeWallet = {

  check() {
    return !!window.Slope;
  },

  init() {
    this.slope = new window.Slope();
    return this;
  },

  async connect() {
    if (this.data && this.data.publicKey) return;

    const { msg, data }: connectResponse = await this.slope.connect();

    if (msg === "ok") {
      this.data = data;
      console.log("Wallet is connected: ", this.publicKey);
    } else {
      console.warn(msg);
    }
  },
};
