import { type Static, Type } from "@sinclair/typebox";
import {
  AdditionalDocRefSchema,
  AllowanceChargeScheme,
  BillingReferenceSchema,
  CommonInvoiceLineSchema,
  CustomerSchema,
  DryRunScheme,
  LegalMonetaryTotalSchema,
  PaymentMeansSchema,
  PaymentTermsSchema,
  PeriodSchema,
  PrepaidPaymentSchema,
  SignScheme,
  SupplierSchema,
  TaxpayerTINScheme,
  TaxTotalSchema,
} from "../common";

const RefundNoteLineSchema = CommonInvoiceLineSchema;

export const CreateRefundNoteDocumentSchema = Type.Object(
  {
    id: Type.String({
      description: "Unique identifier for the refund note.",
      minLength: 1,
    }),
    issueDate: Type.String({
      format: "date",
      description: "The current date in UTC timezone (YYYY-MM-DD)",
    }),
    issueTime: Type.String({
      format: "time",
      description: "The current time in UTC timezone (hh:mm:ssZ)",
    }),
    documentCurrencyCode: Type.String({
      description: "Specific currency for the e-Refund Note. E.g., “MYR”.",
      default: "MYR",
    }),
    taxCurrencyCode: Type.Optional(
      Type.String({
        description:
          "Optional. If not provided, defaults to `documentCurrencyCode`",
      })
    ),
    billingReferences: Type.Array(BillingReferenceSchema, { min: 1 }),
    supplier: SupplierSchema,
    customer: CustomerSchema,
    invoiceLines: Type.Array(RefundNoteLineSchema, {
      description: "List of refund note items, at least one item is required.",
      minItems: 1,
    }),
    taxTotal: TaxTotalSchema,
    legalMonetaryTotal: LegalMonetaryTotalSchema,
    refundNotePeriod: Type.Optional(
      Type.Array(PeriodSchema, {
        description:
          "The period(s) to which the refund note applies, if applicable.",
      })
    ),
    additionalDocumentReferences: Type.Optional(
      Type.Array(AdditionalDocRefSchema)
    ),
    paymentMeans: Type.Optional(Type.Array(PaymentMeansSchema)),
    paymentTerms: Type.Optional(Type.Array(PaymentTermsSchema)),
    prepaidPayments: Type.Optional(Type.Array(PrepaidPaymentSchema)),
    allowanceCharges: Type.Optional(AllowanceChargeScheme), // Document level allowance/charges
  },
  {
    examples: [
      {
        id: "RN001",
        issueDate: new Date().toISOString().split("T")[0],
        issueTime: new Date().toISOString().substring(11, 16) + ":00Z",
        documentCurrencyCode: "MYR",
        billingReferences: [
          {
            uuid: "PREVIOUS_DOC_LHDNM_UUID", // LHDNM UUID of the original Invoice
            internalId: "PREVIOUS_DOC_INTERNAL_ID", // Internal ID of the original Invoice
          },
        ],
        supplier: {
          // Example supplier data
          TIN: "C2584563222",
          legalName: "Test Supplier Sdn. Bhd.",
          identificationNumber: "202001234567",
          identificationScheme: "BRN",
          telephone: "+60123456789",
          industryClassificationCode: "01111",
          industryClassificationName: "Growing of maize",
          address: {
            addressLines: ["Lot 66, Bangunan Merdeka", "Persiaran Jaya"],
            cityName: "Kuala Lumpur",
            postalZone: "50480",
            countrySubentityCode: "14",
            countryCode: "MYS",
          },
        },
        customer: {
          // Example customer data
          TIN: "C2584563200",
          legalName: "Hebat Group",
          identificationNumber: "202001234567",
          identificationScheme: "BRN",
          telephone: "+60123456789",
          address: {
            addressLines: ["Lot 66, Bangunan Merdeka", "Persiaran Jaya"],
            cityName: "Kuala Lumpur",
            postalZone: "50480",
            countrySubentityCode: "14",
            countryCode: "MYS",
          },
        },
        invoiceLines: [
          {
            id: "1",
            quantity: 1,
            unitPrice: 50.0,
            unitCode: "XUN",
            subtotal: 50.0,
            itemDescription: "Refund for returned goods",
            itemCommodityClassification: {
              code: "001",
              listID: "CLASS",
            },
            lineTaxTotal: {
              taxAmount: 5.0,
              taxSubtotals: [
                {
                  taxableAmount: 50.0,
                  taxAmount: 5.0,
                  taxCategoryCode: "01",
                  percent: 10,
                },
              ],
            },
          },
        ],
        taxTotal: {
          totalTaxAmount: 5.0,
          taxSubtotals: [
            {
              taxableAmount: 50.0,
              taxAmount: 5.0,
              taxCategoryCode: "01",
              percent: 10,
            },
          ],
        },
        legalMonetaryTotal: {
          lineExtensionAmount: 50.0,
          taxExclusiveAmount: 50.0,
          taxInclusiveAmount: 55.0,
          payableAmount: 55.0, // This should be the amount being refunded
        },
      },
    ],
  }
);

export type CreateRefundNoteDocument = Static<
  typeof CreateRefundNoteDocumentSchema
>;

export const SubmitRefundNoteDocumentsBodyScheme = Type.Object({
  documents: Type.Array(CreateRefundNoteDocumentSchema, { minItems: 1 }),
});

export type SubmitRefundNoteDocumentsBody = Static<
  typeof SubmitRefundNoteDocumentsBodyScheme
>;

export const SubmitRefundNoteDocumentsQueryScheme = Type.Composite([
  TaxpayerTINScheme,
  DryRunScheme,
  SignScheme,
]);

export type SubmitRefundNoteDocumentsQuery = Static<
  typeof SubmitRefundNoteDocumentsQueryScheme
>;
