#!/usr/bin/env node

import path from "node:path";
import { config as loadEnv } from "dotenv";

loadEnv({
  path: process.env.DOTENV_CONFIG_PATH ?? path.resolve(process.cwd(), ".env"),
});

const commands = {
  all: async () => {
    const { seedAll } = await import("./index");
    await seedAll();
  },
  basics: async () => {
    const { seedBasics } = await import("./basics");
    await seedBasics();
  },
  relations: async () => {
    const { seedRelations } = await import("./relations");
    const { seedBasics } = await import("./basics");
    const basics = await seedBasics();
    await seedRelations(basics);
  },
};

async function run() {
  const cmd = (process.argv[2] || "all") as keyof typeof commands;
  const { closeDbConnection } = await import("../../index");

  try {
    await commands[cmd]();
    console.log("✅ Seed finished successfully");
  } catch (err) {
    console.error("❌ Seed failed", err);
  } finally {
    await closeDbConnection();
  }
}

run();
