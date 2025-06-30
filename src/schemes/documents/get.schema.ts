import { Type, type Static } from "@sinclair/typebox";
import { TaxpayerTINScheme } from "../common";

export const GetDocumentRequestParamsSchema = Type.Object({
  id: Type.String({
    description: "Unique ID of the document to retrieve.",
    examples: ["JA206PVZ6BYQ3547TZTEARWJ10"],
  }),
});

export type GetDocumentRequestParams = Static<typeof GetDocumentRequestParamsSchema>;

export const GetDocumentRequestQuerySchema = TaxpayerTINScheme;

export type GetDocumentRequestQuery = Static<typeof GetDocumentRequestQuerySchema>;
