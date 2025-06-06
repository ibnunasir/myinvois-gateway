import { Type, type Static } from "@sinclair/typebox";
import { TaxpayerTINScheme } from "../common";

export const GetDocumentDetailsRequestParamsSchema = Type.Object({
  id: Type.String({
    description: "The unique identifier (UUID) of the document to retrieve.",
    examples: ["JA206PVZ6BYQ3547TZTEARWJ10"], // Example UUID
  }),
});

export type GetDocumentDetailsRequestParams = Static<
  typeof GetDocumentDetailsRequestParamsSchema
>;

export const GetDocumentDetailsRequestQuerySchema = TaxpayerTINScheme;

export type GetDocumentDetailsRequestQuery = Static<
  typeof GetDocumentDetailsRequestQuerySchema
>;
