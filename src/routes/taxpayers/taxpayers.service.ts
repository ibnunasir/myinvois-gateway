import { NotFoundError } from "elysia";
import {
  MyInvoisClient,
  type SearchTaxpayerTINRequestParams,
  type TaxpayerIdType,
} from "myinvois-client";
import { CONFIG } from "src/config";
import { redisInstance } from "src/redis";
import type {
  GetTaxpayerInfoByQRCodeRequestParams,
  GetTaxpayerInfoByQRCodeRequestQuery,
  SearchTaxpayerTINRequestQuery,
} from "../../schemes";

/**
 * Searches for a Taxpayer's TIN using the provided parameters.
 *
 * @param query - The search parameters, including idType, idValue, page, and size.
 * @returns The search result from MyInvois.
 * @throws Error if Client ID, Client Secret are not configured, or if the environment is invalid.
 */
export const searchTaxpayerTINByParams = async (
  query: SearchTaxpayerTINRequestQuery
) => {
  const client = new MyInvoisClient(
    CONFIG.clientId,
    CONFIG.clientSecret,
    CONFIG.env,
    redisInstance
  );

  const params: SearchTaxpayerTINRequestParams = {
    idType: query.idType as TaxpayerIdType, // Ensure schema aligns with this type
    idValue: query.idValue,
  };

  try {
    const result = await client.taxpayer.searchTaxpayerTIN(
      params,
      query.taxpayerTIN
    );
    return result;
  } catch (error) {
    throw new NotFoundError(`Unable to find user's TIN`);
  }
};

/**
 * Retrieves taxpayer information using a decoded QR code string.
 *
 * @param params - The request parameters, containing the 'id' as qrCodeText.
 * @param query - The request query, containing the optional 'onBehalfOfTIN'.
 * @returns The taxpayer's information from MyInvois.
 * @throws Error if Client ID, Client Secret are not configured, or if the environment is invalid.
 * @throws NotFoundError if taxpayer information cannot be retrieved for the given QR code.
 */
export const getTaxpayerInfoByQRCodeFromClient = async (
  params: GetTaxpayerInfoByQRCodeRequestParams,
  query: GetTaxpayerInfoByQRCodeRequestQuery
) => {
  const client = new MyInvoisClient(
    CONFIG.clientId,
    CONFIG.clientSecret,
    CONFIG.env,
    redisInstance
  );

  try {
    const result = await client.taxpayer.getTaxpayerInfoByQRCode(
      params.id, // 'id' from the path parameter is the qrCodeText
      query.taxpayerTIN
    );
    return result;
  } catch (error) {
    // You might want to log the original error for debugging purposes
    // console.error("Error fetching taxpayer info by QR code:", error);
    throw new NotFoundError(
      `Unable to retrieve taxpayer information for the provided value`
    );
  }
};

// MGI4ZDQ2MTMtYzk5NS00OTJiLWJjMWEtYTVmZjQ2NGIyYmFk
