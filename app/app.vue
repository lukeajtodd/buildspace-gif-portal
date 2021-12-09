<template>
  <div class="App">
    <div :class="store.address ? 'authed-container' : 'container'">
      <div class="header-container">
        <p class="header">🐉 GIF Portal</p>
        <p class="sub-text">View your GIF collection in the metaverse 🐢</p>
        <button
          v-if="!store.address"
          class="cta-button connect-wallet-button"
          @click="handleConnect"
        >Connect to Wallet</button>
        <template v-else>
          <template v-if="loading">
            <h2>Loading...</h2>
          </template>
          <template v-else-if="gifList === null">
            <div class="connected-container">
              <button
                class="cta-button submit-gif-button"
                @click="createAccount"
              >Do One-Time Initialization For GIF Program Account</button>
            </div>
          </template>
          <template v-else>
            <div class="connected-container">
              <form @submit.prevent="sendGif">
                <input v-model="input" type="text" placeholder="Enter gif link!" />
                <button type="submit" class="cta-button submit-gif-button">Submit</button>
              </form>
              <div class="gif-grid">
                <div class="gif-item" :key="gif" v-for="gif in gifList">
                  <img :src="gif" :alt="gif" />
                </div>
              </div>
            </div>
          </template>
        </template>
      </div>
      <div class="footer-container">
        <a
          class="footer-text"
          :href="twitterLink"
          target="_blank"
          rel="noreferrer"
        >{{ `built on @${twitterHandle}` }}</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'
import { Program, Provider, web3 } from '@project-serum/anchor'

import idl from '@/utils/json/idl.json'
import { usePhantomWallet } from '@/stores/wallet'

const { SystemProgram, Keypair } = web3
const baseAccount = Keypair.generate()
const programID = new PublicKey(idl.metadata.address)
const network = clusterApiUrl('devnet')
// Determines how long we wait for the transaction
// 'processed' is usually just for the connected node
// 'finalized' is for the whole transaction to be completed
const opts: web3.ConfirmOptions = {
  preflightCommitment: "processed"
}

const GIFS = [
  'https://media.giphy.com/media/IkLhbMyv1TOymOM9Zi/giphy.gif',
  'https://media.giphy.com/media/2RYkUXJi4tHHD1RxxP/giphy.gif',
  'https://media.giphy.com/media/BaSnOKasWWNig/giphy.gif',
  'https://media.giphy.com/media/YrgpQheSc45Fu/giphy.gif',
  'https://media.giphy.com/media/11O3jeRFgWaQ0w/giphy.gif'
]

const twitterHandle = '_buildspace';
const twitterLink = `https://twitter.com/${twitterHandle}`;

const store = usePhantomWallet()
const input = ref('')
const gifList = ref([])
const address = ref('')
const loading = ref(true)

const createAccount = async () => {
  try {
    const provider = getProvider()
    const program = new Program((idl as any), programID, provider)
    await program.rpc.start({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId
      },
      signers: [baseAccount]
    })

    console.log('Created a new base account: ', baseAccount.publicKey.toString())
    await fetchGifs()
  } catch (err) {
    console.error(err)
  }
}

const fetchGifs = async () => {
  try {
    const provider = getProvider()
    const program = new Program((idl as any), programID, provider)
    const account = await program.account.baseAccount.fetch(baseAccount.publicKey)

    console.log('Got the account: ', account)
    gifList.value = account.gifList
  } catch (err) {
    console.error(err)
    gifList.value = null
  }
}

watch(address, async (v) => {
  if (v && v.length) {
    console.log('Fetching GIFs...')
    try {
      await fetchGifs()
      loading.value = false
    } catch (err) {
      console.error(err)
    }
  }
})

const sendGif = async () => {
  if (input.value.length > 0) {
    console.log('Gif link:', input.value)
    gifList.value = [...gifList.value, input.value]
    input.value = ''
  } else {
    console.log('Empty input. Try again.')
  }
}

const getProvider = () => {
  const connection = new Connection(network, opts.preflightCommitment)
  const provider = new Provider(
    connection, window.solana, opts
  )
  return provider
}

const handleConnect = async () => {
  await store.connect()
  address.value = store.address
}

</script>

<style>
.App {
  height: 100vh;
  background-color: #1a202c;
  overflow: auto;
  text-align: center;
}

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 30px 0 30px;
}

.authed-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 30px;
}

.header {
  margin: 0;
  font-size: 50px;
  font-weight: bold;
  color: white;
}

.sub-text {
  font-size: 25px;
  color: white;
}

.gradient-text {
  background: linear-gradient(to left, #60c657 30%, #35aee2 60%);
  background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.cta-button {
  height: 45px;
  border: 0;
  width: auto;
  padding-left: 40px;
  padding-right: 40px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: white;
}

.connect-wallet-button {
  background: linear-gradient(to left, #60c657, #35aee2);
  background-size: 200% 200%;
  animation: gradient-animation 4s ease infinite;
}

.submit-gif-button {
  background: linear-gradient(to left, #4e44ce, #35aee2);
  background-size: 200% 200%;
  animation: gradient-animation 4s ease infinite;
  margin-left: 10px;
}

.footer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  padding-bottom: 45px;
}

.twitter-logo {
  width: 35px;
  height: 35px;
}

.footer-text {
  color: white;
  font-size: 16px;
  font-weight: bold;
}

.gif-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  grid-gap: 1.5rem;
  justify-items: center;
  margin: 0;
  padding: 0;
}

.gif-grid .gif-item {
  display: flex;
  flex-direction: column;
  position: relative;
  justify-self: center;
  align-self: center;
}

.gif-item img {
  width: 100%;
  height: 300px;
  border-radius: 10px;
  object-fit: cover;
}

.connected-container input[type="text"] {
  display: inline-block;
  color: white;
  padding: 10px;
  width: 50%;
  height: 60px;
  font-size: 16px;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.25);
  border: none;
  border-radius: 10px;
  margin: 50px auto;
}

.connected-container button {
  height: 50px;
}
</style>