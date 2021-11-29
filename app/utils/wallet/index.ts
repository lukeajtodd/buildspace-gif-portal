const walletTypes: string[] = [
    'slope'
]

declare global {
    interface Window {
      Slope: any;
    }
  }

export class Wallet {
    // This would do much more work to find which wallet is wanted
    // It could also pop some UI akin to @solana/wallet-adapter
    static find() {
        let wallet

        walletTypes.forEach(type => {
            switch (type) {
                case 'slope':
                    wallet = new SlopeWallet()
                default:
                    wallet = new SlopeWallet()
            }
        })

        return wallet
    }
}

interface connectResponse {
    msg: string
    data: {
        autoApprove: boolean
        method: string
        publicKey: string
    }
}

class SlopeWallet extends Wallet {
    private _data

    private async init() {
        const slope = new window.Slope()
        const { msg, data }: connectResponse = await slope.connect()

        if (msg === 'ok') {
            this._data = data
        } else {
            console.warn(msg)
        }

        return this
    }

    get publicKey() {
        return this._data.publicKey
    }
}