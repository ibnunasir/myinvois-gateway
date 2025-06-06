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
} from "../common";
import { type Static, Type } from "@sinclair/typebox";

const InvoiceLineSchema = Type.Object({
  id: Type.String({
    description:
      "Unique identifier for the invoice line (e.g., item number “1”, “2”, etc.).",
  }),
  quantity: Type.Number({
    description: " Number of units of the product or service. E.g., 1.00.",
  }),
  unitPrice: Type.Number(),
  subtotal: Type.Number({
    description:
      "Subtotal for the line item: Amount of each individual item/service, excluding taxes, charges, or discounts. Quantity * unit price ",
  }),
  unitCode: Type.Optional(
    Type.String({
      description:
        "Standard unit or system used to measure the product or service (UN/ECE Recommendation 20). E.g., 'KGM' for kilograms, 'XUN' for unit. https://sdk.myinvois.hasil.gov.my/codes/unit-types/",
    })
  ),
  itemDescription: Type.String({
    description:
      "Description of the product or service. E.g., 'Laptop Peripherals'.",
  }),
  itemCommodityClassification: ItemCommodityClassificationSchema,

  lineTaxTotal: Type.Optional(LineTaxTotalSchema),
  allowanceCharges: Type.Optional(AllowanceChargeScheme),
});

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
    invoiceLines: Type.Array(InvoiceLineSchema, {
      description: "List of invoice items, at least one item is required",
      minItems: 1,
    }),
    taxTotal: TaxTotalSchema,
    legalMonetaryTotal: LegalMonetaryTotalSchema,
    invoicePeriod: Type.Optional(Type.Array(PeriodSchema)),
    additionalDocumentReferences: Type.Optional(
      Type.Array(
        Type.Object({
          // Define additional document reference properties here if needed
        })
      )
    ),
    delivery: Type.Optional(
      Type.Array(
        Type.Object({
          // Define delivery properties here if needed
        })
      )
    ),
    paymentMeans: Type.Optional(
      Type.Array(
        Type.Object({
          // Define payment means properties here if needed
        })
      )
    ),
    paymentTerms: Type.Optional(
      Type.Array(
        Type.Object({
          // Define payment terms properties here if needed
        })
      )
    ),
    prepaidPayments: Type.Optional(
      Type.Array(
        Type.Object({
          // Define prepaid payments properties here if needed
        })
      )
    ),
    allowanceCharges: Type.Optional(AllowanceChargeScheme),
    ublExtensions: Type.Optional(
      Type.Object({
        // Define UBL extensions properties here if needed
      })
    ),
    signatureId: Type.Optional(Type.String()),
    signatureMethod: Type.Optional(Type.String()),
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
  documents: Type.Array(CreateInvoiceDocumentSchema),
});

export type SubmitInvoiceDocumentsBody = Static<
  typeof SubmitInvoiceDocumentsBodyScheme
>;
export const SubmitInvoiceDocumentsQueryScheme = Type.Composite([
  TaxpayerTINScheme,
  DryRunScheme,
]);

export type SubmitInvoiceDocumentsQuery = Static<
  typeof SubmitInvoiceDocumentsQueryScheme
>;
