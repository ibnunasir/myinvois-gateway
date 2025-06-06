import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";
import { TaxpayerTINScheme } from "../common";

// Base schema with all parameters as optional
const BaseSearchDocumentsParamsSchema = Type.Object({
  pageNo: Type.Optional(
    Type.Integer({ default: 1, description: "Page number for pagination." })
  ),
  pageSize: Type.Optional(
    Type.Integer({ default: 10, description: "Number of documents per page." })
  ),
  submissionDateFrom: Type.Optional(
    Type.String({
      format: "date",
      description: "Filter by submission date from (YYYY-MM-DD).",
    })
  ),
  submissionDateTo: Type.Optional(
    Type.String({
      format: "date",
      description: "Filter by submission date to (YYYY-MM-DD).",
    })
  ),
  issueDateFrom: Type.Optional(
    Type.String({
      format: "date",
      description: "Filter by issue date from (YYYY-MM-DD).",
    })
  ),
  issueDateTo: Type.Optional(
    Type.String({
      format: "date",
      description: "Filter by issue date to (YYYY-MM-DD).",
    })
  ),
  invoiceDirection: Type.Optional(
    Type.Union(
      [
        Type.Literal("Sent", { title: "Sent" }),
        Type.Literal("Received", { title: "Received" }),
      ],
      { description: "Direction of the invoice (Sent or Received)." }
    )
  ),
  status: Type.Optional(
    Type.Union(
      [
        Type.Literal("Valid", { title: "Valid" }),
        Type.Literal("Invalid", { title: "Invalid" }),
        Type.Literal("Cancelled", { title: "Cancelled" }),
        Type.Literal("Submitted", { title: "Submitted" }),
      ],
      { title: "Document Status", description: "Filter by document status." }
    )
  ),
  documentType: Type.Optional(
    Type.Union(
      [
        Type.Literal("01", { title: "Invoice" }),
        Type.Literal("02", { title: "Credit Note" }),
        Type.Literal("03", { title: "Debit Note" }),
        Type.Literal("04", { title: "Refund Note" }),
        Type.Literal("11", { title: "Self-billed Invoice" }),
        Type.Literal("12", { title: "Self-billed Credit Note" }),
        Type.Literal("13", { title: "Self-billed Debit Note" }),
        Type.Literal("14", { title: "Self-billed Refund Note" }),
      ],
      { description: "Filter by document type." }
    )
  ),
  uuid: Type.Optional(Type.String({ description: "Document's UUID." })),
  searchQuery: Type.Optional(
    Type.String({
      description: `Optional: Free Text can be given.
        Possible Search parameters: (uuid,buyerTIN,supplierTIN,buyerName,supplierName,internalID,total )
        Special characters are not allowed`,
    })
  ),
});

// Schema to enforce that at least one date pair is provided
const RequiredDateFilterSchema = Type.Union(
  [
    Type.Object({
      submissionDateFrom: Type.String({
        format: "date",
        description: "Filter by submission date from (YYYY-MM-DD).",
      }),
      submissionDateTo: Type.String({
        format: "date",
        description: "Filter by submission date to (YYYY-MM-DD).",
      }),
    }),
    Type.Object({
      issueDateFrom: Type.String({
        format: "date",
        description: "Filter by issue date from (YYYY-MM-DD).",
      }),
      issueDateTo: Type.String({
        format: "date",
        description: "Filter by issue date to (YYYY-MM-DD).",
      }),
    }),
  ],
  {
    error:
      "Either (submissionDateFrom AND submissionDateTo) OR (issueDateFrom AND issueDateTo) must be provided for searching documents.",
  }
);

// Intersect the base schema with the date filter requirement
export const SearchDocumentsRequestParamsSchema = Type.Intersect(
  [BaseSearchDocumentsParamsSchema, RequiredDateFilterSchema],
  {
    description:
      "Parameters for searching documents. Requires either submission date range or issue date range.",
  }
);

// Combine with TaxpayerTINScheme for the full query schema
export const SearchDocumentsRequestQuerySchema = Type.Composite([
  TaxpayerTINScheme,
  SearchDocumentsRequestParamsSchema,
]);

// Define the static types for TypeScript
export type SearchDocumentsRequestQuery = Static<
  typeof SearchDocumentsRequestQuerySchema
>;

export type SearchDocumentsRequestParams = Static<
  typeof SearchDocumentsRequestParamsSchema
>;
