import { existsSync, unlinkSync } from "node:fs";

if (existsSync("local.db")) {
  unlinkSync("local.db");
  console.log("Removed local.db");
} else {
  console.log("No local.db to remove");
}
