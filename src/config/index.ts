import type { MyInvoisEnvironment } from "myinvois-client";

interface Config {
  env: MyInvoisEnvironment;
  clientId: string;
  clientSecret: string;
}

export const CONFIG: Config = {
  env: (process.env.ENVIRONMENT ?? "SANDBOX") as MyInvoisEnvironment,
  clientId: process.env.CLIENT_ID ?? "YOUR_CLIENT_ID",
  clientSecret: process.env.CLIENT_SECRET ?? "YOUR_CLIENT_SECRET",
};
