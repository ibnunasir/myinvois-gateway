import { Type } from "@sinclair/typebox";
import { TaxpayerTINScheme } from "../common";
export const GetTaxpayerInfoByQRCodeRequestParamsSchema = Type.Object({
  id: Type.String({
    description:
      "The Base64 decoded string obtained from scanning a taxpayer's QR code.",
    examples: ["0b8d4613-c995-492b-bc1a-a5ff464b2bad"],
  }),
});

export const GetTaxpayerInfoByQRCodeRequestQuerySchema = TaxpayerTINScheme;

export type GetTaxpayerInfoByQRCodeRequestParams =
  typeof GetTaxpayerInfoByQRCodeRequestParamsSchema.static;
export type GetTaxpayerInfoByQRCodeRequestQuery =
  typeof GetTaxpayerInfoByQRCodeRequestQuerySchema.static;
