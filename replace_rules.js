import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const uid = process.env.VITE_ADMIN_UID;

let rules = fs.readFileSync("firestore.rules", "utf8");

rules = rules.replace(
  "ADMIN_UID",
  uid
);

fs.writeFileSync("firestore.deploy.rules", rules);