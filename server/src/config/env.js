import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  DIR_SETUP_URL: process.env.DIR_SETUP_URL,
  // Assumption: the {pwd} placeholder is filled from a shared secret,
  // since neither User nor Organization has a key/password field.
  // If each org actually has its own key, that needs a column on
  // Organization instead (e.g. organization.setupKey) — see note below.
  DIR_SETUP_KEY: process.env.DIR_SETUP_KEY,
};