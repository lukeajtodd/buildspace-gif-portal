import { toRaw } from 'vue'
import { defineStore } from "pinia";

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

export const useSlopeWallet = defineStore("slopeWallet", {
  state: () => ({
    available: null,
    _slope: null,
    address: null
  }),
  getters: {
    slope() {
      return toRaw(this._slope)
    }
  },
  actions: {
    init() {
      if (!window.Slope) {
        console.log('Slope is not available on your current device.')
        return null
      }

      this._slope = new window.Slope()
    },
    async connect() {
      if (!this._slope) {
        this.init()
      }

      const { msg, data }: connectResponse = await toRaw(this._slope).connect(this.slope)

      if (msg === "ok") {
        this.address = data.publicKey;
        console.log("Wallet is connected: ", data.publicKey);
      } else {
        console.warn(msg);
      }
    },
    async disconnect() {
      return true
    }
  },
});
