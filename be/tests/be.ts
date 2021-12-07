import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Be } from '../target/types/be';

describe('be', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.Be as Program<Be>;

  it('Is initialized!', async () => {
    // Add your test here.
    const tx = await program.rpc.start({});
    console.log("Your transaction signature", tx);
  });
});