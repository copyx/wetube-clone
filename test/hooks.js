import db from "../src/db";

export const mochaHooks = {
  beforeAll() {
    db.connect();
  },
  afterAll() {
    db.disconnect();
  },
};
