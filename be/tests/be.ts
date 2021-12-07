import * as anchor from '@project-serum/anchor';
import { assert, expect } from 'chai'
import { Program } from '@project-serum/anchor';
import { Be } from '../target/types/be';

const { SystemProgram } = anchor.web3;

describe('be', () => {

  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env()
  anchor.setProvider(provider);

  const program = anchor.workspace.Be as Program<Be>;
  const baseAccount = anchor.web3.Keypair.generate();

  it('Is initialized!', async () => {
    // Add your test here.
    const tx = await program.rpc.start({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [ baseAccount ]
    });

    console.log("Your transaction signature", tx);
    return assert.ok(tx);
  });

  it('Has a GIF Count', async () => {
    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('Gif Count: ', account.totalGifs.toString());
    return expect(account.totalGifs.toString()).to.eql('0')
  })

  it('Can increment the GIF Count', async () => {
    await program.rpc.addGif({
      accounts: {
        baseAccount: baseAccount.publicKey
      }
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('Gif Count: ', account.totalGifs.toString());

    return expect(account.totalGifs.toString()).to.eql('1')
  })
});