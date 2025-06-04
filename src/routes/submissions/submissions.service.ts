import { CONFIG } from "src/config";
import { redisInstance } from "src/redis";
import { MyInvoisClient } from "myinvois-client";
import type {
  GetSubmissionRequestParams,
  GetSubmissionRequestQuery,
} from "src/schemes"; // Will define these types later

/**
 * Retrieves details for a specific submission.
 *
 * @param params - The request parameters, containing the submission ID.
 * @param query - The request query, containing the optional taxpayerTIN.
 * @returns The submission details from MyInvois.
 * @throws Error if fetching submission details fails.
 */
export async function getSubmissionDetails(
  params: GetSubmissionRequestParams,
  query: GetSubmissionRequestQuery
) {
  const client = new MyInvoisClient(
    CONFIG.clientId,
    CONFIG.clientSecret,
    CONFIG.env,
    redisInstance
  );

  const submissionId = params.id; // Assuming the submission ID is a path parameter named 'id'
  const taxpayerTIN = query.taxpayerTIN;

  try {
    const submissionDetails = await client.documents.getSubmissionDetails(
      submissionId,
      {
        pageNo: query.pageNo,
        pageSize: query.pageSize,
      },
      taxpayerTIN
    );
    return submissionDetails;
  } catch (error) {
    const action = taxpayerTIN
      ? `fetching submission ${submissionId} for TIN ${taxpayerTIN}`
      : `fetching submission ${submissionId} as taxpayer`;
    // console.error(`MyInvois Gateway: Error during ${action}:`, error);
    throw new Error(
      `Failed during ${action}. Original error: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

// Example Get Submission Details Response
// {
//   "submissionUid": "4GP7CCS5FE74GBZ5QFD7EXWJ10",
//   "documentCount": 1,
//   "dateTimeReceived": "2025-06-04T12:21:31Z",
//   "overallStatus": "Invalid",
//   "documentSummary": [
//     {
//       "uuid": "Z9JH44F9A9XXQQ30QFD7EXWJ10",
//       "submissionUid": "4GP7CCS5FE74GBZ5QFD7EXWJ10",
//       "longId": "",
//       "internalId": "22",
//       "typeName": "Invoice",
//       "typeVersionName": "Version 1",
//       "issuerTin": "IG23486228090",
//       "issuerName": "Test Supplier Sdn. Bhd.",
//       "receiverId": "IG23486228090",
//       "receiverName": "Hebat Group",
//       "dateTimeIssued": "2025-06-04T12:17:00Z",
//       "dateTimeReceived": "2025-06-04T12:21:31Z",
//       "dateTimeValidated": "2025-06-04T12:21:31Z",
//       "totalPayableAmount": 11,
//       "totalExcludingTax": 10,
//       "totalDiscount": 0,
//       "totalNetAmount": 10,
//       "status": "Invalid",
//       "cancelDateTime": null,
//       "rejectRequestDateTime": null,
//       "documentStatusReason": null,
//       "createdByUserId": "IG23486228090:ea34e901-bf8e-4c48-8162-e6d582c8ff39"
//     }
//   ]
// }
