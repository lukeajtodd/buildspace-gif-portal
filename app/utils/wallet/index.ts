import { SlopeWallet } from "./slope";

const walletTypes: any[] = [
  {
    key: "slope",
    obj: SlopeWallet,
  },
];

export const findWallet = () => {
  const result = walletTypes.find(({ key, obj }) => obj.check());

  if (result && result.obj) {
    return result.obj.init();
  }

  return null;
};
