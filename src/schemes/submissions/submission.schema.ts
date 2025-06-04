import { type Static, Type } from "@sinclair/typebox";
import { TaxpayerTINScheme } from "../common";

export const GetSubmissionRequestParamsSchema = Type.Object({
  id: Type.String({
    description: "Unique ID of the document submission to retrieve.",
    examples: ["4GP7CCS5FE74GBZ5QFD7EXWJ10"],
  }),
});

export type GetSubmissionRequestParams = Static<
  typeof GetSubmissionRequestParamsSchema
>;

export const GetSubmissionRequestQuerySchema = Type.Composite([
  TaxpayerTINScheme,
  Type.Object({
    pageNo: Type.Optional(Type.Number({ examples: [1] })),
    pageSize: Type.Optional(Type.Number({ examples: [20] })),
  }),
]);

export type GetSubmissionRequestQuery = Static<
  typeof GetSubmissionRequestQuerySchema
>;
