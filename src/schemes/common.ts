import type { TSchema } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";

export const Nullable = <T extends TSchema>(schema: T) =>
  Type.Union([schema, Type.Null()]);

export const DryRunScheme = Type.Object({
  dryRun: Type.Optional(
    Type.Boolean({
      description:
        "Option to dry run. Dry running meaning no submission to MyInvois API. Use this if you only want the UBL Formatted Json ",
    })
  ),
});

export const TaxpayerTINScheme = Type.Object({
  taxpayerTIN: Type.Optional(
    Type.String({
      description:
        "Optional Taxpayer TIN. Fill this, if you are an ERP and submitting on behalf of the taxpayer",
    })
  ),
});

export const AddressSchema = Type.Object({
  addressLines: Type.Array(
    Type.String({
      description:
        'Street lines of the address. E.g., "Lot 66, Bangunan Merdeka", "Persiaran Jaya".',
    }),
    {
      description:
        "List of street address lines. At least one line is typically expected.",
      minItems: 1,
    }
  ),
  cityName: Type.String({
    description: 'City name. E.g., "Kuala Lumpur".',
  }),
  postalZone: Type.Optional(
    Type.String({
      description: 'Postal zone or postcode. E.g., "50480".',
    })
  ),
  countrySubentityCode: Type.String({
    description:
      'State or subdivision code. For Malaysia, use `MalaysianStateCode`. E.g., "14" for W.P. Kuala Lumpur. https://www.iso.org/obp/ui/#iso:code:3166:MY',
  }),
  countryCode: Type.String({
    description:
      'ISO 3166-1 alpha-3 country code. E.g., "MYS" for Malaysia. https://www.iban.com/country-codes',
  }),
});

export const ItemCommodityClassificationSchema = Type.Object(
  {
    code: Type.String({
      description:
        "Classification code for the product or service. E.g., '001'. https://sdk.myinvois.hasil.gov.my/codes/classification-codes/",
    }),
    listID: Type.Optional(
      Type.String({
        description:
          "Identifier for the classification list used. Defaults to 'CLASS'  if not provided.",
        default: "CLASS",
      })
    ),
  },
  { description: "Parameters for defining an item's commodity classification" }
);

const TaxSubtotalSchema = Type.Object({
  taxableAmount: Type.Number({
    description:
      "Amount taxable under this specific tax category. E.g., 1460.50.",
  }),
  taxAmount: Type.Number({
    description:
      "Tax amount for this specific category. E.g., 87.63. If exempt, this is 0.",
  }),
  taxCategoryCode: Type.String({
    description: "Tax type code (e.g., Sales Tax, Service Tax, Exempt). ",
  }),
  taxExemptReason: Type.Optional(
    Type.String({
      description:
        "Description of tax exemption applicable on the invoice level.(e.g., Buyer’s sales tax exemption certificate number, special exemption as per gazette orders, etc.). The input is limited to the following special characters: period “.”, dash “-“, comma “,” and parenthesis “()",
    })
  ),
  percent: Type.Optional(
    Type.Number({
      description:
        "Tax rate percentage, if applicable (e.g., 10 for 10%). Optional.",
    })
  ),
});

export const IdentificationScheme = Type.Union(
  [
    Type.Literal("NRIC", { title: "NRIC" }),
    Type.Literal("BRN", { title: "BRN" }),
    Type.Literal("PASSPORT", { title: "PASSPORT" }),
    Type.Literal("ARMY", { title: "ARMY" }),
  ],
  {
    description:
      "Scheme for the `identificationNumber` (NRIC, BRN, PASSPORT, ARMY).",
  }
);

export const SupplierSchema = Type.Object(
  {
    TIN: Type.String({
      description:
        "Supplier's Tax Identification Number (TIN). E.g., 'C2584563222'.",
    }),
    legalName: Type.String({
      description: "Supplier's legal name. E.g., 'AMS Setia Jaya Sdn. Bhd.'",
    }),
    identificationNumber: Type.String({
      description:
        "Supplier's registration/identification number (e.g., MyKad, Business Registration Number). E.g., '202001234567'. ",
    }),
    identificationScheme: IdentificationScheme,
    telephone: Type.String({
      description: "Supplier's contact telephone number. E.g., '+60123456789'.",
      pattern: "^\\+[1-9]\\d{1,14}$",
    }),
    industryClassificationCode: Type.String({
      description:
        "Supplier's Malaysia Standard Industrial Classification (MSIC) Code (5-digit numeric). E.g., '01111'.",
      minLength: 5,
      maxLength: 5,
    }),
    industryClassificationName: Type.String({
      description:
        "Description of the supplier's business activity, corresponding to the MSIC code. E.g., 'Growing of maize'. ",
    }),
    address: AddressSchema,
    additionalAccountId: Type.Optional(
      Type.String({
        description:
          "Supplier's additional account ID. Can be used for specific purposes like Authorisation Number for Certified Exporter (e.g., ATIGA number). E.g., 'CPT-CCN-W-211111-KL-000002'.",
      })
    ),
    tourismTaxRegistrationNumber: Type.Optional(
      Type.String({
        description:
          "Supplier's Tourism Tax Registration Number. Optional. Input 'NA' if not applicable and required by schema. E.g., '123-4567-89012345'.",
      })
    ),
    sstRegistrationNumber: Type.Optional(
      Type.String({
        description:
          "Supplier's SST Registration Number. Optional. Input 'NA' if not applicable and required by schema. E.g., 'A01-2345-67891012'.",
      })
    ),
    electronicMail: Type.Optional(
      Type.String({
        description:
          "Supplier's e-mail address. Optional. E.g., 'general.ams@supplier.com'.",
        format: "email",
      })
    ),
  },
  {
    title: "Supplier",
    description: "Supplier (seller) details. Mandatory",
  }
);

export const CustomerSchema = Type.Object(
  {
    TIN: Type.String({
      description:
        "Customer's Tax Identification Number (TIN). E.g., 'C2584563200'.",
    }),
    legalName: Type.String({
      description: "Customer's legal name. E.g., 'Hebat Group'",
    }),
    identificationNumber: Type.String({
      description:
        "Customer's registration/identification number (e.g., MyKad, Business Registration Number). E.g., '202001234567'. ",
    }),
    identificationScheme: IdentificationScheme,
    telephone: Type.String({
      description: "Customer's contact telephone number. E.g., '+60123456789'.",
      pattern: "^\\+[1-9]\\d{1,14}$",
    }),
  },
  { description: "Customer (buyer) details. Mandatory" }
);

export const LineTaxTotalSchema = Type.Object(
  {
    taxSubtotals: Type.Array(TaxSubtotalSchema, {
      description:
        "Breakdown of taxes for this line item by category/rate. At least one item is required",
      minItems: 1,
    }),
    taxAmount: Type.Number({
      description: " Total tax amount for this line item. E.g., 8.76.",
    }),
  },
  { description: "Tax details for this specific line item." }
);

export const TaxTotalSchema = Type.Object(
  {
    totalTaxAmount: Type.Number({
      description: " Total tax amount for the entire invoice. E.g., 87.63. ",
    }),
    taxSubtotals: Type.Array(TaxSubtotalSchema, {
      description:
        "Breakdown of taxes by category/rate for the entire document.",
    }),
    roundingAmount: Type.Optional(
      Type.Number({
        description:
          "Optional. Rounding amount applied to the total tax. E.g., 0.03 (for positive rounding).",
      })
    ),
  },
  { description: "Total tax for this document" }
);

export const LegalMonetaryTotalSchema = Type.Object(
  {
    lineExtensionAmount: Type.Number({
      description: "Total Net Amount: Sum of all line item subtotals",
    }),
    taxExclusiveAmount: Type.Number({
      description:
        "Total Excluding Tax: Sum of amount (inclusive of discounts/charges), excluding taxes.",
    }),
    taxInclusiveAmount: Type.Number({
      description:
        "Total Including Tax: Sum of amount inclusive of total taxes.",
    }),
    allowanceTotalAmount: Type.Optional(
      Type.Number({
        description: "Total document-level discount amount. Optional.",
      })
    ),
    chargeTotalAmount: Type.Optional(
      Type.Number({ description: " Total document-level fee/charge amount." })
    ),
    prepaidAmount: Type.Optional(
      Type.Number({ description: " Total prepaid amount" })
    ),
    payableAmount: Type.Number({
      description:
        "Total Payable Amount: Final amount due after all taxes, charges, discounts, and rounding.",
    }),
  },
  { description: "Monetary totals (sum of all line items) for this document" }
);

export const PeriodSchema = Type.Object({
  startDate: Type.Optional(Type.String()),
  endDate: Type.Optional(Type.String()),
  description: Type.Optional(Type.String()),
});

export const AllowanceChargeScheme = Type.Array(
  Type.Object(
    {
      isCharge: Type.Boolean({
        description:
          "True if this is a charge, false if it is an allowance (discount).",
      }),
      amount: Type.Number({
        description: "Amount of the allowance or charge. E.g., 100.00.",
      }),
      reason: Type.Optional(
        Type.String({
          description:
            'Reason for the allowance or charge. Optional. E.g., "Volume Discount" or "Service Fee".',
        })
      ),
    },
    {
      description:
        "Parameters for defining an allowance or a charge (can be at document or line item level).",
    }
  )
);
