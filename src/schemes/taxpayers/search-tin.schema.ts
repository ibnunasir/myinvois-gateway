import { Type, type Static } from "@sinclair/typebox";
import { IdentificationScheme, TaxpayerTINScheme } from "../common";
export const SearchTaxpayerTINRequestQuerySchema = Type.Composite([
  TaxpayerTINScheme,
  Type.Object({
    idType: IdentificationScheme,
    idValue: Type.String({
      description:
        "The actual value of the ID Type selected. For example, if NRIC selected as ID Type, then pass the NRIC value here.",
      examples: ["201901234567"],
    }),
    // disabled since it seems like it is not from official LHDN?
    // taxpayerName: Type.Optional(
    //   Type.String({
    //     description:
    //       "Taxpayer name. Mandatory if idType and idValue are not passed",
    //   })
    // ),
  }),
]);

export type SearchTaxpayerTINRequestQuery = Static<
  typeof SearchTaxpayerTINRequestQuerySchema
>;
