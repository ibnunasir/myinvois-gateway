import { Type, type Static } from "@sinclair/typebox";
import { TaxpayerTINScheme } from "../common";

export const CancelDocumentRequestParamsSchema = Type.Object({
  id: Type.String({
    description: "The unique identifier of the document to cancel",
    examples: ["JA206PVZ6BYQ3547TZTEARWJ10"],
  }),
});

export const CancelDocumentRequestQuerySchema = Type.Composite([
  TaxpayerTINScheme,
  Type.Object({
    reason: Type.String({
      description: "The reason for cancelling the document",
      examples: ["Incorrect item quantity"],
    }),
  }),
]);

export type CancelDocumentRequestParams = Static<
  typeof CancelDocumentRequestParamsSchema
>;
export type CancelDocumentRequestQuery = Static<
  typeof CancelDocumentRequestQuerySchema
>;
