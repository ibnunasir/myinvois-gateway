import {
  CustomerSchema, // Represents the Buyer (Issuer of Self-Billed Invoice)
  SupplierSchema, // Represents the Seller (Receiver of Self-Billed Invoice)
  TaxpayerTINScheme,
  TaxTotalSchema,
  LineTaxTotalSchema,
  PeriodSchema,
  LegalMonetaryTotalSchema,
  ItemCommodityClassificationSchema,
  AllowanceChargeScheme,
  DryRunScheme,
  PaymentMeansSchema,
  AdditionalDocRefSchema,
  PaymentTermsSchema,
  PrepaidPaymentSchema,
  BillingReferenceSchema, // Referencing documents like Purchase Orders
} from "../common";
import { type Static, Type } from "@sinclair/typebox";

const SelfBilledInvoiceLineSchema = Type.Object({
  id: Type.String({
    description:
      "Unique identifier for the self-billed invoice line (e.g., item number “1”, “2”, etc.).",
  }),
  quantity: Type.Number({
    description:
      "Number of units of the product or service purchased. E.g., 1.00.",
  }),
  unitPrice: Type.Number({
    description: "Unit price of the product or service purchased.",
  }),
  subtotal: Type.Number({
    description:
      "Subtotal for the line item: Amount of each individual item/service, excluding taxes, charges, or discounts. Quantity * unit price.",
  }),
  unitCode: Type.Optional(
    Type.String({
      description:
        "Standard unit or system used to measure the product or service (UN/ECE Recommendation 20). E.g., 'KGM' for kilograms, 'XUN' for unit. https://sdk.myinvois.hasil.gov.my/codes/unit-types/",
    })
  ),
  itemDescription: Type.String({
    description:
      "Description of the product or service purchased. E.g., 'Raw Materials'.",
  }),
  itemCommodityClassification: ItemCommodityClassificationSchema,

  lineTaxTotal: Type.Optional(LineTaxTotalSchema),
  allowanceCharges: Type.Optional(AllowanceChargeScheme),
});

export const CreateSelfBilledInvoiceDocumentSchema = Type.Object(
  {
    id: Type.String({
      description: "Unique identifier for the self-billed invoice.",
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
        "Specific currency for the e-Self-Billed Invoice. E.g., “MYR”.",
      default: "MYR",
    }),
    taxCurrencyCode: Type.Optional(
      Type.String({
        description:
          "Optional. If not provided, defaults to `documentCurrencyCode`",
      })
    ),
    billingReference: Type.Array(
      BillingReferenceSchema, // Self-Billed Invoice often references POs or Delivery Notes
      {
        description:
          "Reference to the original document(s) (e.g., Purchase Order, Delivery Note) to which this self-billed invoice applies.",
        minItems: 1, // Assuming at least one reference is usually required for self-billing
      }
    ),
    supplier: SupplierSchema, // Represents the Seller (Receiver)
    customer: CustomerSchema, // Represents the Buyer (Issuer)
    selfBilledInvoiceLines: Type.Array(SelfBilledInvoiceLineSchema, {
      description: "List of items purchased, at least one item is required.",
      minItems: 1,
    }),
    taxTotal: TaxTotalSchema,
    legalMonetaryTotal: LegalMonetaryTotalSchema,
    invoicePeriod: Type.Optional(
      // Using invoicePeriod as it relates to the period of goods/services received
      Type.Array(PeriodSchema, {
        description:
          "The period(s) to which the self-billed invoice applies, if applicable.",
      })
    ),
    additionalDocumentReferences: Type.Optional(
      Type.Array(AdditionalDocRefSchema)
    ),
    paymentMeans: Type.Optional(Type.Array(PaymentMeansSchema)),
    paymentTerms: Type.Optional(Type.Array(PaymentTermsSchema)),
    prepaidPayments: Type.Optional(Type.Array(PrepaidPaymentSchema)),
    allowanceCharges: Type.Optional(AllowanceChargeScheme), // Document level allowance/charges
    ublExtensions: Type.Optional(
      Type.Object({
        // TODO Define UBL extensions properties
      })
    ),
    signatureId: Type.Optional(Type.String()),
    signatureMethod: Type.Optional(Type.String()),
  },
  {
    examples: [
      {
        id: "SBI001",
        issueDate: new Date().toISOString().split("T")[0],
        issueTime: new Date().toISOString().substring(11, 16) + ":00Z",
        documentCurrencyCode: "MYR",
        billingReference: [
          // Example billing reference
          {
            uuid: "PO12345-LHDNM-UUID", // LHDNM UUID of the Purchase Order or Delivery Note
            internalId: "PO12345", // Internal ID of the Purchase Order
          },
        ],
        supplier: {
          // Example Seller (Receiver of SBI) data
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
          // Example Buyer (Issuer of SBI) data
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
        selfBilledInvoiceLines: [
          {
            id: "1",
            quantity: 100,
            unitPrice: 5.5,
            unitCode: "XUN",
            subtotal: 550.0,
            itemDescription: "Component XYZ",
            itemCommodityClassification: {
              code: "002", // Example classification code
              listID: "CLASS",
            },
            lineTaxTotal: {
              // Example tax details
              taxAmount: 33.0, // 6% SST
              taxSubtotals: [
                {
                  taxableAmount: 550.0,
                  taxAmount: 33.0,
                  taxCategoryCode: "02", // Service Tax (example, should be Sales Tax if applicable)
                  percent: 6,
                },
              ],
            },
          },
        ],
        taxTotal: {
          // Example total tax
          totalTaxAmount: 33.0,
          taxSubtotals: [
            {
              taxableAmount: 550.0,
              taxAmount: 33.0,
              taxCategoryCode: "02",
              percent: 6,
            },
          ],
        },
        legalMonetaryTotal: {
          // Example monetary total
          lineExtensionAmount: 550.0,
          taxExclusiveAmount: 550.0,
          taxInclusiveAmount: 583.0,
          payableAmount: 583.0, // Amount payable by the issuer (customer) to the receiver (supplier)
        },
      },
    ],
  }
);

export type CreateSelfBilledInvoiceDocument = Static<
  typeof CreateSelfBilledInvoiceDocumentSchema
>;

export const SubmitSelfBilledInvoiceDocumentsBodyScheme = Type.Object({
  documents: Type.Array(CreateSelfBilledInvoiceDocumentSchema, { minItems: 1 }),
});

export type SubmitSelfBilledInvoiceDocumentsBody = Static<
  typeof SubmitSelfBilledInvoiceDocumentsBodyScheme
>;

export const SubmitSelfBilledInvoiceDocumentsQueryScheme = Type.Composite([
  TaxpayerTINScheme, // Taxpayer TIN of the issuer (Buyer)
  DryRunScheme,
]);

export type SubmitSelfBilledInvoiceDocumentsQuery = Static<
  typeof SubmitSelfBilledInvoiceDocumentsQueryScheme
>;
