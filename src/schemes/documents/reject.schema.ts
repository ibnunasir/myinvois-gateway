import { Type, type Static } from "@sinclair/typebox";
import { TaxpayerTINScheme } from "../common";

export const RejectDocumentRequestParamsSchema = Type.Object({
  id: Type.String({
    description: "The unique identifier of the document to reject.",
    examples: ["F9D425P6DS7D8IU"], // Example document ID
  }),
});

export const RejectDocumentRequestQuerySchema = Type.Composite([
  TaxpayerTINScheme,
  Type.Object({
    reason: Type.String({
      description: "The reason for rejecting the document.",
      examples: ["Incorrect details provided", "Document is not applicable"],
    }),
  }),
]);

export type RejectDocumentRequestParams = Static<
  typeof RejectDocumentRequestParamsSchema
>;
export type RejectDocumentRequestQuery = Static<
  typeof RejectDocumentRequestQuerySchema
>;
