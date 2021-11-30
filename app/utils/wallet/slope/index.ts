export const slopeHelpers = {
  check() {
    return !!window.Slope;
  },

  init() {
    return new window.Slope();
  },

  async connect(slope) {
    return await slope.connect();
  },
};
