export * from "./documents";
export * from "./common";

import { Type } from "@sinclair/typebox";

export const BillingReferenceSchema = Type.Object({
  invoiceId: Type.String(),
  invoiceIssueDate: Type.Optional(Type.String()),
});

// // Credit Note specific schemas
// const CreditNoteLineSchema = Type.Object({
//   id: Type.String(),
//   quantity: Type.Number(),
//   unitCode: Type.Optional(Type.String()),
//   subtotal: Type.Number(),
//   itemDescription: Type.Optional(Type.String()),
//   itemCommodityClassification: ItemCommodityClassificationSchema,
//   unitPrice: Type.Number(),
//   lineTaxTotal: Type.Optional(LineTaxTotalSchema),
//   allowanceCharges: Type.Optional(
//     Type.Array(
//       Type.Object({
//         // Define allowance charge properties here if needed
//       }),
//     ),
//   ),
// });

// const CreditNoteTaxTotalSchema = Type.Object({
//   totalTaxAmount: Type.Number(),
//   taxSubtotals: Type.Array(TaxSubtotalSchema),
//   roundingAmount: Type.Optional(Type.Number()),
// });

// const CreditNotePeriodSchema = Type.Object({
//   startDate: Type.Optional(Type.String()),
//   endDate: Type.Optional(Type.String()),
//   description: Type.Optional(Type.String()),
// });

// export const CreateCreditNoteDocumentSchema = Type.Object({
//   id: Type.String(),
//   issueDate: Type.String(),
//   issueTime: Type.String(),
//   invoiceTypeCode: Type.Optional(Type.Literal("02")), // Must be "02" for credit notes
//   documentCurrencyCode: Type.String(),
//   taxCurrencyCode: Type.Optional(Type.String()),

//   supplier: SupplierSchema,
//   customer: CustomerSchema,

//   creditNoteLines: Type.Array(CreditNoteLineSchema),
//   taxTotal: CreditNoteTaxTotalSchema,
//   legalMonetaryTotal: LegalMonetaryTotalSchema,

//   // Required for credit notes
//   billingReferences: Type.Array(BillingReferenceSchema),

//   // Optional fields
//   creditNotePeriod: Type.Optional(Type.Array(CreditNotePeriodSchema)),
//   additionalDocumentReferences: Type.Optional(
//     Type.Array(
//       Type.Object({
//         // Define additional document reference properties here if needed
//       }),
//     ),
//   ),
//   delivery: Type.Optional(
//     Type.Array(
//       Type.Object({
//         // Define delivery properties here if needed
//       }),
//     ),
//   ),
//   paymentMeans: Type.Optional(
//     Type.Array(
//       Type.Object({
//         // Define payment means properties here if needed
//       }),
//     ),
//   ),
//   paymentTerms: Type.Optional(
//     Type.Array(
//       Type.Object({
//         // Define payment terms properties here if needed
//       }),
//     ),
//   ),
//   prepaidPayments: Type.Optional(
//     Type.Array(
//       Type.Object({
//         // Define prepaid payments properties here if needed
//       }),
//     ),
//   ),
//   allowanceCharges: Type.Optional(
//     Type.Array(
//       Type.Object({
//         // Define allowance charges properties here if needed
//       }),
//     ),
//   ),
//   ublExtensions: Type.Optional(
//     Type.Object({
//       // Define UBL extensions properties here if needed
//     }),
//   ),

//   signatureId: Type.Optional(Type.String()),
//   signatureMethod: Type.Optional(Type.String()),
// });
