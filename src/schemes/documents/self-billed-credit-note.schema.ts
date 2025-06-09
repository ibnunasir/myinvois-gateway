import {
  CustomerSchema, // Represents the Buyer (Issuer of Self-Billed Credit Note)
  SupplierSchema, // Represents the Seller (Receiver of Self-Billed Credit Note)
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

const SelfBilledCreditNoteLineSchema = Type.Object({
  id: Type.String({
    description:
      "Unique identifier for the self-billed credit note line (e.g., item number “1”, “2”, etc.).",
  }),
  quantity: Type.Number({
    description:
      "Number of units of the product or service being credited in the self-billed context. E.g., 1.00.",
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
      "Description of the product or service being credited. E.g., 'Return of Raw Materials'.",
  }),
  itemCommodityClassification: ItemCommodityClassificationSchema,
  lineTaxTotal: Type.Optional(LineTaxTotalSchema),
  allowanceCharges: Type.Optional(AllowanceChargeScheme),
});

export const CreateSelfBilledCreditNoteDocumentSchema = Type.Object(
  {
    id: Type.String({
      description: "Unique identifier for the self-billed credit note.",
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
      description:
        "Specific currency for the e-Self-Billed Credit Note. E.g., “MYR”.",
      default: "MYR",
    }),
    taxCurrencyCode: Type.Optional(
      Type.String({
        description:
          "Optional. If not provided, defaults to `documentCurrencyCode`",
      })
    ),
    billingReferences: Type.Array(BillingReferenceSchema, { min: 1 }),
    supplier: SupplierSchema, // Represents the Seller (Receiver of SBCN)
    customer: CustomerSchema, // Represents the Buyer (Issuer of SBCN)
    selfBilledCreditNoteLines: Type.Array(SelfBilledCreditNoteLineSchema, {
      description:
        "List of items being credited, at least one item is required.",
      minItems: 1,
    }),
    taxTotal: TaxTotalSchema,
    legalMonetaryTotal: LegalMonetaryTotalSchema,
    creditNotePeriod: Type.Optional(
      Type.Array(PeriodSchema, {
        description:
          "The period(s) to which the self-billed credit note applies, if applicable.",
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
        id: "SBCN001",
        issueDate: new Date().toISOString().split("T")[0],
        issueTime: new Date().toISOString().substring(11, 16) + ":00Z",
        documentCurrencyCode: "MYR",
        billingReferences: [
          {
            uuid: "SBI001-LHDNM-UUID", // LHDNM UUID of the Self-Billed Invoice
            internalId: "SBI001", // Internal ID of the Self-Billed Invoice
          },
        ],
        supplier: {
          // Example Seller (Receiver of SBCN) data - same as SBI Seller
          TIN: "S1234567890",
          legalName: "Seller Company Sdn. Bhd.",
          identificationNumber: "201501012345",
          identificationScheme: "BRN",
          telephone: "+60312345678",
          industryClassificationCode: "46590", // Example MSIC for Wholesale of other machinery
          industryClassificationName:
            "Wholesale of other machinery and equipment",
          address: {
            addressLines: ["Level 10, Example Building", "Jalan Contoh"],
            cityName: "Petaling Jaya",
            postalZone: "46050",
            countrySubentityCode: "10", // Selangor
            countryCode: "MYS",
          },
        },
        customer: {
          // Example Buyer (Issuer of SBCN) data - same as SBI Buyer
          TIN: "B0987654321",
          legalName: "Buyer Corporation Bhd.",
          identificationNumber: "201801054321",
          identificationScheme: "BRN",
          telephone: "+60398765432",
          address: {
            addressLines: ["Unit 5, Innovation Center", "Persiaran Maju"],
            cityName: "Cyberjaya",
            postalZone: "63000",
            countrySubentityCode: "10", // Selangor
            countryCode: "MYS",
          },
        },
        selfBilledCreditNoteLines: [
          {
            id: "1",
            quantity: 5, // Crediting 5 units
            unitPrice: 5.5,
            unitCode: "XUN",
            subtotal: 27.5, // 5 * 5.50
            itemDescription: "Return of Component XYZ",
            itemCommodityClassification: {
              code: "002",
              listID: "CLASS",
            },
            lineTaxTotal: {
              // Example tax details for the credited amount
              taxAmount: 1.65, // 6% of 27.50
              taxSubtotals: [
                {
                  taxableAmount: 27.5,
                  taxAmount: 1.65,
                  taxCategoryCode: "02", // Service Tax (example, should be Sales Tax if applicable)
                  percent: 6,
                },
              ],
            },
          },
        ],
        taxTotal: {
          // Example total tax for the credited amount
          totalTaxAmount: 1.65,
          taxSubtotals: [
            {
              taxableAmount: 27.5,
              taxAmount: 1.65,
              taxCategoryCode: "02",
              percent: 6,
            },
          ],
        },
        legalMonetaryTotal: {
          // Example monetary total for the credit
          lineExtensionAmount: 27.5,
          taxExclusiveAmount: 27.5,
          taxInclusiveAmount: 29.15, // 27.50 + 1.65
          payableAmount: 29.15, // Amount to be credited back to the buyer
        },
      },
    ],
  }
);

export type CreateSelfBilledCreditNoteDocument = Static<
  typeof CreateSelfBilledCreditNoteDocumentSchema
>;

export const SubmitSelfBilledCreditNoteDocumentsBodyScheme = Type.Object({
  documents: Type.Array(CreateSelfBilledCreditNoteDocumentSchema, {
    minItems: 1,
  }),
});

export type SubmitSelfBilledCreditNoteDocumentsBody = Static<
  typeof SubmitSelfBilledCreditNoteDocumentsBodyScheme
>;

export const SubmitSelfBilledCreditNoteDocumentsQueryScheme = Type.Composite([
  TaxpayerTINScheme, // Taxpayer TIN of the issuer (Buyer)
  DryRunScheme,
]);

export type SubmitSelfBilledCreditNoteDocumentsQuery = Static<
  typeof SubmitSelfBilledCreditNoteDocumentsQueryScheme
>;
