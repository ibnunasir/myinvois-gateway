import type Elysia from "elysia";
import type {
  MyInvoisEnvironment,
  TaxpayerIdType,
  SearchTaxpayerTINRequestParams,
} from "myinvois-client";
import { MyInvoisClient } from "myinvois-client";

export const taxpayersController = (app: Elysia) => {
  return app.group("taxpayers", (app) =>
    app
      .guard({
        detail: {
          tags: ["Taxpayers"],
        },
      })
      .get(
        "/search/tin",
        async () => {
          const CLIENT_ID = process.env.CLIENT_ID ?? "";
          const CLIENT_SECRET = process.env.CLIENT_SECRET ?? "";
          const environment = (process.env.MYINVOIS_ENVIRONMENT ??
            "SANDBOX") as MyInvoisEnvironment;

          if (!["SANDBOX", "PRODUCTION"].includes(environment)) {
            throw new Error("Invalid Environment");
          }
          const client = new MyInvoisClient(
            CLIENT_ID,
            CLIENT_SECRET,
            environment
          );
          const paramsById: SearchTaxpayerTINRequestParams = {
            idType: "NRIC" as TaxpayerIdType, // Business Registration Number
            idValue: "901103035388", // Replace with a known BRN
          };
          const result = await client.taxpayer.searchTaxpayerTIN(
            paramsById,
            "123"
          );
          return result;
        },
        {
          detail: {
            summary: "Search Taxpayer's TIN",
            description: `This API allows taxpayer’s ERP system to search for a specific
            Tax Identification Number (TIN) using the supported search parameters.`,
          },
        }
      )
      .get(
        "/qrcode/:id",
        () => {
          return "Get Taxpayer Detail by QR Code";
        },
        {
          detail: {
            summary: "Get Taxpayer Detail by QR Code",
            description: `This API allows taxpayer’s ERP system to retrieve the
            information for a specific Taxpayer based on the Base64 formatted
            string obtained from scanning the respective QR code.`,
          },
        }
      )
  );
};
