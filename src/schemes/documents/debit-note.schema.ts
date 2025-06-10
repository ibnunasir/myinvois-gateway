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

const DebitNoteLineSchema = CommonInvoiceLineSchema;

export const CreateDebitNoteDocumentSchema = Type.Object(
  {
    id: Type.String({
      description: "Unique identifier for the debit note.",
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
      description: "Specific currency for the e-Debit Note. E.g., “MYR”.",
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
    invoiceLines: Type.Array(DebitNoteLineSchema, {
      description: "List of debit note items, at least one item is required.",
      minItems: 1,
    }),
    taxTotal: TaxTotalSchema,
    legalMonetaryTotal: LegalMonetaryTotalSchema,
    debitNotePeriod: Type.Optional(
      Type.Array(PeriodSchema, {
        description:
          "The period(s) to which the debit note applies, if applicable.",
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
        id: "DN001",
        issueDate: new Date().toISOString().split("T")[0],
        issueTime: new Date().toISOString().substring(11, 16) + ":00Z",
        documentCurrencyCode: "MYR",
        billingReferences: [
          {
            uuid: "4GP7CCS5FE74GBZ5QFD7EXWJ10", // LHDNM UUID of the original Invoice
            internalId: "INV12345", // Internal ID of the original Invoice
          },
        ],
        supplier: {
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
            unitPrice: 25.0,
            unitCode: "XUN",
            subtotal: 25.0,
            itemDescription: "Additional handling fee",
            itemCommodityClassification: {
              code: "002",
              listID: "CLASS",
            },
            lineTaxTotal: {
              taxAmount: 2.5,
              taxSubtotals: [
                {
                  taxableAmount: 25.0,
                  taxAmount: 2.5,
                  taxCategoryCode: "01", // Standard Rate
                  percent: 10,
                },
              ],
            },
          },
        ],
        taxTotal: {
          totalTaxAmount: 2.5,
          taxSubtotals: [
            {
              taxableAmount: 25.0,
              taxAmount: 2.5,
              taxCategoryCode: "01",
              percent: 10,
            },
          ],
        },
        legalMonetaryTotal: {
          lineExtensionAmount: 25.0, // Sum of all line item subtotals
          taxExclusiveAmount: 25.0, // Total amount excluding tax
          taxInclusiveAmount: 27.5, // Total amount including tax
          payableAmount: 27.5, // The final amount due
        },
      },
    ],
  }
);

export type CreateDebitNoteDocument = Static<
  typeof CreateDebitNoteDocumentSchema
>;

export const SubmitDebitNoteDocumentsBodyScheme = Type.Object({
  documents: Type.Array(CreateDebitNoteDocumentSchema, { minItems: 1 }),
});

export type SubmitDebitNoteDocumentsBody = Static<
  typeof SubmitDebitNoteDocumentsBodyScheme
>;

export const SubmitDebitNoteDocumentsQueryScheme = Type.Composite([
  TaxpayerTINScheme,
  DryRunScheme,
  SignScheme,
]);

export type SubmitDebitNoteDocumentsQuery = Static<
  typeof SubmitDebitNoteDocumentsQueryScheme
>;
