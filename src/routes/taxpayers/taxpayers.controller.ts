import type Elysia from "elysia";
// Removed MyInvoisClient specific imports as they are handled by the service
import {
  searchTaxpayerTINByParams,
  getTaxpayerInfoByQRCodeFromClient,
} from "./taxpayers.service";
import {
  SearchTaxpayerTINRequestQuerySchema,
  GetTaxpayerInfoByQRCodeRequestParamsSchema,
  TaxpayerTINScheme,
} from "src/schemes";

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
        async ({ query }) => {
          return await searchTaxpayerTINByParams(query);
        },
        {
          detail: {
            summary: "Search Taxpayer's TIN",
            description: `This API allows taxpayer’s ERP system to search for a specific
            Tax Identification Number (TIN) using the supported search parameters.`,
          },
          query: SearchTaxpayerTINRequestQuerySchema,
        }
      )
      .get(
        "/qrcode/:id",
        async ({ params, query }) => {
          return await getTaxpayerInfoByQRCodeFromClient(params, query);
        },
        {
          detail: {
            summary: "Get Taxpayer Detail by QR Code",
            description: `This API allows taxpayer’s ERP system to retrieve the
            information for a specific Taxpayer based on the Base64 formatted
            string obtained from scanning the respective QR code.`,
          },
          params: GetTaxpayerInfoByQRCodeRequestParamsSchema,
          query: TaxpayerTINScheme,
        }
      )
  );
};
