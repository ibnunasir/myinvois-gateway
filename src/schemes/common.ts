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

export const SignScheme = Type.Object({
  sign: Type.Optional(
    Type.Boolean({
      default: false,
      description:
        "Option to digitally sign the document. If set to `true`, ensures that the document is digitally signed before sending. Default is `false`.",
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
      'State or administrative subdivision code. For Malaysia, use `MalaysianStateCode` (e.g., from "../../../codes"). E.g., "14" for W.P. Kuala Lumpur. Refer to LHDN SDK for specific codes.',
  }),
  countryCode: Type.String({
    description:
      'ISO 3166-1 alpha-3 country code. Use `CountryCodeISO3166Alpha3` (e.g., from "../../../codes"). E.g., "MYS" for Malaysia. Refer to LHDN SDK for specific codes.',
  }),
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
    examples: ["BRN"],
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
        "Supplier's registration/identification number (e.g., MyKad, Business Registration Number). E.g., '202001234567'.",
    }),
    identificationScheme: IdentificationScheme,
    telephone: Type.String({
      description: "Supplier's contact telephone number. E.g., '+60123456789'.",
      pattern: "^\\+[1-9]\\d{1,14}$", // E.164 phone number format
    }),
    industryClassificationCode: Type.String({
      description:
        "Supplier's Malaysia Standard Industrial Classification (MSIC) Code (5-digit numeric). E.g., '01111'.",
      minLength: 5,
      maxLength: 5,
    }),
    industryClassificationName: Type.String({
      description:
        "Description of the supplier's business activity, corresponding to the MSIC code. E.g., 'Growing of maize'.",
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
    description: "Supplier (seller) details. Mandatory.",
  }
);

export const CustomerSchema = Type.Object(
  {
    TIN: Type.String({
      description:
        "Customer's Tax Identification Number (TIN). E.g., 'C2584563200'.",
    }),
    legalName: Type.String({
      description: "Customer's legal name. E.g., 'Hebat Group'.",
    }),
    identificationNumber: Type.String({
      description:
        "Customer's registration/identification number (e.g., MyKad, Business Registration Number). E.g., '202001234567'.",
    }),
    identificationScheme: IdentificationScheme,
    telephone: Type.String({
      description:
        "Customer's contact telephone number. E.g., '+60123456789'. Can be 'NA' for consolidated e-Invoices.",
      // Pattern allows E.164 or "NA"
      pattern: "^(\\+[1-9]\\d{1,14}|NA)$",
    }),
    address: AddressSchema,
    tourismTaxRegistrationNumber: Type.Optional(
      Type.String({
        description: "Customer's Tourism Tax Registration Number. Optional.",
      })
    ),
    sstRegistrationNumber: Type.Optional(
      Type.String({
        description:
          "Customer's SST Registration Number. Optional. Input 'NA' if not available/provided and schema requires it.",
      })
    ),
    additionalAccountId: Type.Optional(
      Type.String({
        description:
          "Customer's additional account ID. Optional, less common than for supplier.",
      })
    ),
    electronicMail: Type.Optional(
      Type.String({
        description:
          "Customer's e-mail address. Optional. E.g., 'name@buyer.com'.",
        format: "email",
      })
    ),
  },
  { description: "Customer (buyer) details. Mandatory." }
);

export const ItemCommodityClassificationSchema = Type.Object(
  {
    code: Type.String({
      description:
        "Classification code for the product or service. Use `ClassificationCode` (e.g., from \"../../../codes\"). E.g., '001'. Refer to LHDN SDK for specific codes. https://sdk.myinvois.hasil.gov.my/codes/classification-codes/",
    }),
    listID: Type.Optional(
      Type.String({
        description:
          "Identifier for the classification list used. E.g., 'CLASS' for general classification, 'PTC' for Product Tariff Code. Defaults to 'CLASS' if not provided.",
        default: "CLASS", // As per existing and reference
      })
    ),
  },
  { description: "Parameters for defining an item's commodity classification." }
);

export const TaxSubtotalSchema = Type.Object({
  taxableAmount: Type.Number({
    description:
      "Amount taxable under this specific tax category. E.g., 1460.50.",
  }),
  taxAmount: Type.Number({
    description:
      "Tax amount for this specific category. E.g., 87.63. If exempt, this is 0.",
  }),
  taxCategoryCode: Type.String({
    description:
      "Tax type code. Use `TaxTypeCode` (e.g., from \"../../../codes\"). E.g., '01' for Sales Tax, '02' for Service Tax, '03' for Exempt. Refer to LHDN SDK for specific codes.",
  }),
  taxExemptReason: Type.Optional(
    Type.String({
      description:
        "Description of tax exemption applicable. (e.g., Buyer’s sales tax exemption certificate number, special exemption as per gazette orders, etc.). The input is limited to the following special characters: period “.”, dash “-“, comma “,” and parenthesis “()”.",
    })
  ),
  percent: Type.Optional(
    Type.Number({
      description:
        "Tax rate percentage, if applicable (e.g., 10 for 10%). Optional.",
    })
  ),
});

export const LineTaxTotalSchema = Type.Object(
  {
    taxSubtotals: Type.Array(TaxSubtotalSchema, {
      description:
        "Breakdown of taxes for this line item by category/rate. At least one item is required.",
      minItems: 1,
    }),
    taxAmount: Type.Number({
      description: "Total tax amount for this line item. E.g., 8.76.",
    }),
  },
  { description: "Tax details for this specific line item." }
);

export const TaxTotalSchema = Type.Object(
  {
    totalTaxAmount: Type.Number({
      description: "Total tax amount for the entire document. E.g., 87.63.",
    }),
    taxSubtotals: Type.Array(TaxSubtotalSchema, {
      description:
        "Breakdown of taxes by category/rate for the entire document.",
      minItems: 1, // Usually at least one tax subtotal is expected if there's tax
    }),
    roundingAmount: Type.Optional(
      Type.Number({
        description:
          "Optional. Rounding amount applied to the total tax. E.g., 0.03 (for positive rounding).",
      })
    ),
  },
  { description: "Total tax for this document." }
);

export const LegalMonetaryTotalSchema = Type.Object(
  {
    lineExtensionAmount: Type.Number({
      description:
        "Total Net Amount: Sum of all line item subtotals. E.g., 1436.50.",
    }),
    taxExclusiveAmount: Type.Number({
      description:
        "Total Excluding Tax: Sum of amount (inclusive of discounts/charges), excluding taxes. E.g., 1436.50.",
    }),
    taxInclusiveAmount: Type.Number({
      description:
        "Total Including Tax: Sum of amount inclusive of total taxes. E.g., 1524.13.",
    }),
    allowanceTotalAmount: Type.Optional(
      Type.Number({
        description:
          "Total document-level discount amount. Optional. E.g., 100.00.",
      })
    ),
    chargeTotalAmount: Type.Optional(
      Type.Number({
        description:
          "Total document-level fee/charge amount. Optional. E.g., 50.00.",
      })
    ),
    prepaidAmount: Type.Optional(
      Type.Number({
        description: "Total prepaid amount. Optional. E.g., 200.00.",
      })
    ),
    payableRoundingAmount: Type.Optional(
      Type.Number({
        description:
          "Rounding amount applied to the final payable amount. Optional. E.g., 0.03.",
      })
    ),
    payableAmount: Type.Number({
      description:
        "Total Payable Amount: Final amount due after all taxes, charges, discounts, and rounding. E.g., 1324.13.",
    }),
  },
  {
    description: "Monetary totals (sum of all line items) for this document.",
  }
);

export const PeriodSchema = Type.Object({
  startDate: Type.Optional(
    Type.String({ format: "date", description: "Start date (YYYY-MM-DD)." })
  ),
  endDate: Type.Optional(
    Type.String({ format: "date", description: "End date (YYYY-MM-DD)." })
  ),
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
      // Add other fields if needed based on UBL, e.g., TaxCategory, MultiplierFactorNumeric
    },
    {
      description:
        "Parameters for defining an allowance or a charge (can be at document or line item level).",
    }
  )
);

export const BillingReferenceSchema = Type.Object({
  uuid: Type.String({
    description:
      "LHDNM's unique identifier number for the referenced document.",
  }),
  internalId: Type.String({
    description:
      "User's internal identifier for the referenced document, as used in their system.",
  }),
});

export const PaymentMeansSchema = Type.Object({
  paymentMeansCode: Type.Union(
    [
      Type.Literal("01", { title: "Cash" }),
      Type.Literal("02", { title: "Cheque" }),
      Type.Literal("03", { title: "Bank Transfer" }),
      Type.Literal("04", { title: "Credit Card" }),
      Type.Literal("05", { title: "Debit Card" }),
      Type.Literal("06", { title: "e-Wallet / Digital Wallet" }),
      Type.Literal("07", { title: "Digital Bank" }),
      Type.Literal("08", { title: "Others" }),
    ],
    {
      description: "Code for the mode of payment. Use `PaymentMode` ",
    }
  ),
  payeeFinancialAccountId: Type.Optional(
    Type.String({
      description:
        "Supplier’s bank account number for payment. Optional. E.g., '1234567890123'.",
    })
  ),
});

export const PaymentTermsSchema = Type.Object({
  note: Type.String({
    description:
      'A note describing the payment terms. E.g., "Payment method is Cash".',
  }),
});

export const PrepaidPaymentSchema = Type.Object({
  id: Type.Optional(
    Type.String({
      description:
        "Prepayment reference number. Optional. E.g., 'E12345678912'.",
    })
  ),
  paidAmount: Type.Optional(
    Type.Number({
      description: "The amount that was prepaid. E.g., 1.00.",
    })
  ),
  paidDate: Type.Optional(
    Type.String({
      format: "date",
      description:
        "Date of prepayment (YYYY-MM-DD). Optional. E.g., '2000-01-01'.",
    })
  ),
  paidTime: Type.Optional(
    Type.String({
      format: "time",
      description:
        "Time of prepayment (hh:mm:ssZ). Optional. E.g., '12:00:00Z'.",
    })
  ),
});

export const AdditionalDocRefSchema = Type.Object({
  id: Type.String({
    description: "Identifier of the referenced document.",
  }),
  documentType: Type.Optional(
    Type.String({
      description: "Type of the document. Optional.",
    })
  ),
  documentDescription: Type.Optional(
    Type.String({
      description: "Description of the document. Optional.",
    })
  ),
  // Add other fields like Attachment (for embedded documents) if needed
});

export const SignatureScheme = Type.Object(
  {
    documentToSign: Type.Any({
      description:
        "The main UBL document object (e.g., Invoice, CreditNote JSON object) that needs to be signed. This document will be processed (minified, parts excluded) to generate the document digest.",
    }),
    privateKey: Type.Any({
      description:
        "The signer's private key as a CryptoKey object, used for signing the document digest.",
    }),
    signingCertificateBase64: Type.String({
      description:
        "The signer's X.509 certificate, base64 encoded. This certificate is included in the signature.",
    }),
    certificateDigestBase64: Type.String({
      description:
        'Base64 encoded SHA-256 digest of the signing certificate (also known as "CertDigest"). This is required for the XAdES properties within the signature.',
    }),
    certificateIssuerName: Type.String({
      description: "Issuer name extracted from the signing certificate.",
    }),
    certificateSerialNumber: Type.String({
      description: "Serial number extracted from the signing certificate.",
    }),
    extensionUri: Type.Optional(
      Type.String({
        description:
          'URI for the UBL extension that identifies the type of extension. For enveloped XAdES signatures, this is typically "urn:oasis:names:specification:ubl:dsig:enveloped:xades".',
        default: "urn:oasis:names:specification:ubl:dsig:enveloped:xades",
      })
    ),
    signatureInformationId: Type.Optional(
      Type.String({
        description:
          'ID for the SignatureInformation block within the UBLExtensions. Example: "urn:oasis:names:specification:ubl:signature:1"',
        default: "urn:oasis:names:specification:ubl:signature:1",
      })
    ),
    signatureId: Type.Optional(
      Type.String({
        description:
          'This ID should match the ID of the <cac:Signature> element in the main UBL document (e.g., Invoice.Signature[0].ID[0]._). It links the extension to that specific signature placeholder. Example: "urn:oasis:names:specification:ubl:signature:Invoice" for an Invoice document.',
        default: "urn:oasis:names:specification:ubl:signature:Invoice",
      })
    ),
    documentTransformationKeys: Type.Optional(
      Type.Array(Type.String(), {
        description:
          'An array of top-level keys to exclude from the `documentToSign` object before generating its digest. These keys typically include "UBLExtensions" and "Signature" itself.',
        default: ["UBLExtensions", "Signature"],
      })
    ),
  },
  {
    description:
      "Parameters for building the UBL Extensions, specifically for embedding a digital signature. This scheme collects the necessary data to generate the <UBLExtensions> block containing the digital signature information as per MyInvois requirements.",
  }
);
