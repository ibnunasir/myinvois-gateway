import { type Static, Type } from "@sinclair/typebox";
import {
  AdditionalDocRefSchema,
  AllowanceChargeScheme,
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

const InvoiceLineScheme = CommonInvoiceLineSchema;

export const CreateInvoiceDocumentSchema = Type.Object(
  {
    id: Type.String({ minLength: 1 }),
    issueDate: Type.String({
      format: "date",
      description: "The current date in UTC timezone (YYYY-MM-DD) ",
    }),
    issueTime: Type.String({
      format: "time",
      description: "The current time in UTC timezone (hh:mm:ssZ)",
    }),
    documentCurrencyCode: Type.String({
      description: "Specific currency for the e-Invoice. E.g., “MYR”.",
      default: "MYR",
    }),
    taxCurrencyCode: Type.Optional(
      Type.String({
        description:
          "Optional. If not provided, defaults to `documentCurrencyCode`",
      })
    ),
    supplier: SupplierSchema,
    customer: CustomerSchema,
    invoiceLines: Type.Array(InvoiceLineScheme, {
      description: "List of invoice items, at least one item is required",
      minItems: 1,
    }),
    taxTotal: TaxTotalSchema,
    legalMonetaryTotal: LegalMonetaryTotalSchema,
    invoicePeriod: Type.Optional(
      Type.Array(PeriodSchema, {
        description:
          "The period(s) to which the invoice applies, if applicable.",
      })
    ),
    additionalDocumentReferences: Type.Optional(
      Type.Array(AdditionalDocRefSchema)
    ),
    paymentMeans: Type.Optional(Type.Array(PaymentMeansSchema)),
    paymentTerms: Type.Optional(Type.Array(PaymentTermsSchema)),
    prepaidPayments: Type.Optional(Type.Array(PrepaidPaymentSchema)),
    allowanceCharges: Type.Optional(AllowanceChargeScheme),
  },
  {
    examples: [
      {
        id: "22",
        issueDate: new Date().toISOString().split("T")[0],
        issueTime: new Date().toISOString().substring(11, 16) + ":00Z",
        documentCurrencyCode: "MYR",
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
            unitPrice: 10.0,
            unitCode: "XUN",
            subtotal: 10.0,
            itemDescription: "Test Item",
            itemCommodityClassification: {
              code: "001",
              listID: "CLASS",
            },
            lineTaxTotal: {
              taxAmount: 1.0,
              taxSubtotals: [
                {
                  taxableAmount: 10.0,
                  taxAmount: 1.0,
                  taxCategoryCode: "01",
                  percent: 10,
                },
              ],
            },
          },
        ],
        taxTotal: {
          totalTaxAmount: 1.0,
          taxSubtotals: [
            {
              taxableAmount: 10.0,
              taxAmount: 1.0,
              taxCategoryCode: "01",
              percent: 10,
            },
          ],
        },
        legalMonetaryTotal: {
          lineExtensionAmount: 10.0,
          taxExclusiveAmount: 10.0,
          taxInclusiveAmount: 11.0,
          payableAmount: 11.0,
        },
      },
    ],
  }
);

export type CreateInvoiceDocument = Static<typeof CreateInvoiceDocumentSchema>;

export const SubmitInvoiceDocumentsBodyScheme = Type.Object({
  documents: Type.Array(CreateInvoiceDocumentSchema, { minItems: 1 }),
});

export type SubmitInvoiceDocumentsBody = Static<
  typeof SubmitInvoiceDocumentsBodyScheme
>;
export const SubmitInvoiceDocumentsQueryScheme = Type.Composite([
  TaxpayerTINScheme,
  DryRunScheme,
  SignScheme,
]);

export type SubmitInvoiceDocumentsQuery = Static<
  typeof SubmitInvoiceDocumentsQueryScheme
>;
