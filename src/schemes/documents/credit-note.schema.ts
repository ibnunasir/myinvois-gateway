import {
  CustomerSchema,
  SupplierSchema,
  TaxpayerTINScheme,
  TaxTotalSchema,
  LineTaxTotalSchema,
  PeriodSchema,
  LegalMonetaryTotalSchema,
  ItemCommodityClassificationSchema,
  AllowanceChargeScheme,
  DryRunScheme,
  AdditionalDocRefSchema,
  PaymentMeansSchema,
  PaymentTermsSchema,
  PrepaidPaymentSchema,
  BillingReferenceSchema,
} from "../common";
import { type Static, Type } from "@sinclair/typebox";

const CreditNoteLineSchema = Type.Object({
  id: Type.String({
    description:
      "Unique identifier for the credit note line (e.g., item number “1”, “2”, etc.).",
  }),
  quantity: Type.Number({
    description:
      "Number of units of the product or service being credited. E.g., 1.00.",
  }),
  unitPrice: Type.Number({
    description: "Unit price of the product or service being credited.",
  }),
  subtotal: Type.Number({
    description:
      "Subtotal for the line item being credited: Amount of each individual item/service, excluding taxes, charges, or discounts. Quantity * unit price.",
  }),
  unitCode: Type.Optional(
    Type.String({
      description:
        "Standard unit or system used to measure the product or service (UN/ECE Recommendation 20). E.g., 'KGM' for kilograms, 'XUN' for unit. https://sdk.myinvois.hasil.gov.my/codes/unit-types/",
    })
  ),
  itemDescription: Type.String({
    description:
      "Description of the product or service being credited. E.g., 'Return of Laptop Peripherals'.",
  }),
  itemCommodityClassification: ItemCommodityClassificationSchema,
  lineTaxTotal: Type.Optional(LineTaxTotalSchema),
  allowanceCharges: Type.Optional(AllowanceChargeScheme),
});

export const CreateCreditNoteDocumentSchema = Type.Object(
  {
    id: Type.String({
      description: "Unique identifier for the credit note.",
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
      description: "Specific currency for the e-Credit Note. E.g., “MYR”.",
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
    creditNoteLines: Type.Array(CreditNoteLineSchema, {
      description: "List of credit note items, at least one item is required.",
      minItems: 1,
    }),
    taxTotal: TaxTotalSchema,
    legalMonetaryTotal: LegalMonetaryTotalSchema,
    creditNotePeriod: Type.Optional(
      Type.Array(PeriodSchema, {
        description:
          "The period(s) to which the credit note applies, if applicable.",
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
        id: "CN001",
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
        creditNoteLines: [
          {
            id: "1",
            quantity: 1,
            unitPrice: 50.0,
            unitCode: "XUN",
            subtotal: 50.0,
            itemDescription: "Credit for returned goods",
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
          payableAmount: 55.0,
        },
      },
    ],
  }
);

export type CreateCreditNoteDocument = Static<
  typeof CreateCreditNoteDocumentSchema
>;

export const SubmitCreditNoteDocumentsBodyScheme = Type.Object({
  documents: Type.Array(CreateCreditNoteDocumentSchema, { minItems: 1 }),
});

export type SubmitCreditNoteDocumentsBody = Static<
  typeof SubmitCreditNoteDocumentsBodyScheme
>;

export const SubmitCreditNoteDocumentsQueryScheme = Type.Composite([
  TaxpayerTINScheme,
  DryRunScheme,
]);

export type SubmitCreditNoteDocumentsQuery = Static<
  typeof SubmitCreditNoteDocumentsQueryScheme
>;
