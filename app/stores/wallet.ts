import { toRaw } from 'vue'
import { defineStore } from "pinia";

declare global {
  interface Window {
    Slope: any;
    solana: any;
  }
}

interface slopeConnectResponse {
  msg: string;
  data: {
    autoApprove: boolean;
    method: string;
    publicKey: string;
  };
}

interface phantomConnectResponse {
  publicKey: string;
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

      const { msg, data }: slopeConnectResponse = await toRaw(this._slope).connect(this.slope)

      this._slope.publicKey = data.publicKey

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

export const usePhantomWallet = defineStore("phantomWallet", {
  state: () => ({
    address: null
  }),
  getters: {
    solana() {
      return window.solana
    }
  },
  actions: {
    async connect() {
      if (!window.solana) {
        console.warn('Phantom is not available on your current device.')
        return null
      }

      const { publicKey }: phantomConnectResponse = await window.solana.connect()
      const key: string = publicKey.toString()

      if (key) {
        this.address = key;
        console.log("Wallet is connected: ", key);
      } else {
        console.warn('There has been an issue.');
      }
    },
    async disconnect() {
      return true
    }
  },
});
