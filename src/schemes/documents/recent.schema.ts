import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";
import { Nullable, TaxpayerTINScheme } from "../common";
// import * as Codegen from "@sinclair/typebox-codegen";

export const GetRecentDocumentsRequestParamsSchema = Type.Object({
  pageNo: Type.Optional(Type.Integer()),
  pageSize: Type.Optional(Type.Integer()),
  submissionDateFrom: Type.Optional(Type.String()),
  submissionDateTo: Type.Optional(Type.String()),
  issueDateFrom: Type.Optional(Type.String()),
  issueDateTo: Type.Optional(Type.String()),
  invoiceDirection: Type.Optional(
    Type.Union(
      [
        Type.Literal("Sent", { title: "Sent" }),
        Type.Literal("Received", { title: "Received" }),
      ],
      {
        error() {
          return "test";
        },
      }
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
      { title: "Document Status" }
    )
  ),
  documentType: Type.Optional(
    Type.Union([
      Type.Literal("01", { title: "Invoice" }),
      Type.Literal("02", { title: "Credit Note" }),
      Type.Literal("03", { title: "Debit Note" }),
      Type.Literal("04", { title: "Refund Note" }),
      Type.Literal("11", { title: "Self-billed Invoice" }),
      Type.Literal("12", { title: "Self-billed Credit Note" }),
      Type.Literal("13", { title: "Self-billed Debit Note" }),
      Type.Literal("14", { title: "Self-billed Refund Note" }),
    ])
  ),
  receiverIdType: Type.Optional(
    Type.Union([
      Type.Literal("BRN", { title: "Business Registration Number" }),
      Type.Literal("PASSPORT", { title: "Passport" }),
      Type.Literal("NRIC", { title: "NRIC" }),
      Type.Literal("ARMY", { title: "Army ID" }),
    ])
  ),
  receiverId: Type.Optional(Type.String()),
  issuerIdType: Type.Optional(
    Type.Union([
      Type.Literal("BRN", { title: "Business Registration Number" }),
      Type.Literal("PASSPORT", { title: "Passport" }),
      Type.Literal("NRIC", { title: "NRIC" }),
      Type.Literal("ARMY", { title: "Army ID" }),
    ])
  ),
  issuerId: Type.Optional(Type.String()),
  receiverTin: Type.Optional(Type.String()),
  issuerTin: Type.Optional(Type.String()),
});
export const GetRecentDocumentsRequestQueryScheme = Type.Composite([
  TaxpayerTINScheme,
  GetRecentDocumentsRequestParamsSchema,
]);

export type GetRecentDocumentsRequestQuery = Static<
  typeof GetRecentDocumentsRequestQueryScheme
>;

export const RecentDocumentInfoSchema = Type.Object({
  uuid: Type.String(),
  submissionUid: Type.String(),
  longId: Type.String(),
  internalId: Type.String(),
  typeName: Type.String(),
  typeVersionName: Type.String(),
  issuerTIN: Type.String(),
  issuerName: Type.Optional(Type.String()),
  receiverTIN: Nullable(Type.String()),
  receiverId: Type.Optional(Type.String()),
  receiverName: Nullable(Type.String()),
  dateTimeIssued: Type.String({ format: "date-time" }),
  dateTimeReceived: Type.String({ format: "date-time" }),
  dateTimeValidated: Nullable(Type.String({ format: "date-time" })),
  totalSales: Nullable(Type.Number()),
  totalDiscount: Nullable(Type.Number()),
  netAmount: Nullable(Type.Number()),
  total: Type.Number(),
  status: Type.Union([
    Type.Literal("Submitted"),
    Type.Literal("Valid"),
    Type.Literal("Invalid"),
    Type.Literal("Cancelled"),
    Type.Literal("Requested for Rejection"),
  ]),
  cancelDateTime: Nullable(Type.String({ format: "date-time" })),
  rejectRequestDateTime: Nullable(Type.String({ format: "date-time" })),
  documentStatusReason: Nullable(Type.String()),
  createdByUserId: Nullable(Type.String()),
  supplierTIN: Nullable(Type.String()),
  supplierName: Nullable(Type.String()),
  submissionChannel: Nullable(Type.String()), // Can be refined with more literals if needed
  intermediaryName: Nullable(Type.String()),
  intermediaryTIN: Nullable(Type.String()),
  intermediaryROB: Nullable(Type.String()),
  buyerName: Nullable(Type.String()),
  buyerTIN: Nullable(Type.String()),
});

export const RecentDocumentsMetadataSchema = Type.Object({
  totalPages: Type.Number(),
  totalCount: Type.Number(),
});

export const GetRecentDocumentsResponseSchema = Type.Object({
  result: Type.Array(RecentDocumentInfoSchema, {
    examples: [
      {
        uuid: "JA206PVZ6BYQ3547TZTEARWJ10",
        submissionUid: "XVYN69FHBPSW71KYTZTEARWJ10",
        longId: "",
        internalId: "TEST-INV10-1748867967916",
        typeName: "Invoice",
        typeVersionName: "1.0",
        supplierTIN: "IG23486228090",
        supplierName: "Test Supplier Sdn. Bhd.",
        receiverTIN: "IG23486228090",
        issuerTIN: "IG23486228090",
        receiverName: "Test Customer Bhd.",
        dateTimeIssued: "2025-06-02T12:39:00Z",
        dateTimeReceived: "2025-06-02T12:39:27.9939186Z",
        dateTimeValidated: "2025-06-02T12:39:28.9741726Z",
        totalSales: 10,
        totalDiscount: 0,
        netAmount: 10,
        total: 11,
        status: "Invalid",
        submissionChannel: "ERP",
        intermediaryName: null,
        intermediaryTIN: null,
        intermediaryROB: null,
        submitterROB: null,
        cancelDateTime: null,
        rejectRequestDateTime: null,
        documentStatusReason: null,
        createdByUserId: "IG23486228090:ea34e901-bf8e-4c48-8162-e6d582c8ff39",
        buyerName: "Test Customer Bhd.",
        buyerTIN: "IG23486228090",
        receiverID: "901101011234",
        receiverIDType: "NRIC",
        issuerID: "901101012345",
        issuerIDType: "NRIC",
        documentCurrency: "MYR",
      },
    ],
  }),
  metadata: RecentDocumentsMetadataSchema,
});

// const def = Codegen.ModelToTypeScript.Generate({
//   types: [GetRecentDocumentsResponseSchema],
// });

// console.log(def);
