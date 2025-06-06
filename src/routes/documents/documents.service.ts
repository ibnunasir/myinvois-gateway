import { CONFIG } from "src/config";
// Assume you have a Redis client initialized and exported, e.g.:
import { redisInstance } from "src/redis"; // Path to your gateway's Redis client instance
import {
  type CreateInvoiceDocumentParams,
  MyInvoisClient,
  createDocumentSubmissionItemFromInvoice,
  type DocumentSubmissionItem,
} from "myinvois-client";
import type {
  GetRecentDocumentsRequestQuery,
  SubmitInvoiceDocumentsBody,
  SubmitInvoiceDocumentsQuery,
  CancelDocumentRequestParams,
  CancelDocumentRequestQuery,
  RejectDocumentRequestParams,
  RejectDocumentRequestQuery,
} from "src/schemes";

export async function getRecentDocuments(
  query: GetRecentDocumentsRequestQuery
) {
  const client = new MyInvoisClient(
    CONFIG.clientId,
    CONFIG.clientSecret,
    CONFIG.env,
    redisInstance
  );

  const { taxpayerTIN: taxpayerTIN, ...params } = query;
  try {
    const documents = await client.documents.getRecentDocuments(
      params,
      taxpayerTIN
    );
    return documents;
  } catch (error) {
    const action = taxpayerTIN
      ? `fetching documents for TIN ${taxpayerTIN}`
      : "fetching documents as taxpayer";
    // console.error(`MyInvois Gateway: Error during ${action}:`, error);
    throw new Error(
      `Failed during ${action}. Original error: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export async function rejectDocument(
  params: RejectDocumentRequestParams,
  query: RejectDocumentRequestQuery
) {
  const client = new MyInvoisClient(
    CONFIG.clientId,
    CONFIG.clientSecret,
    CONFIG.env,
    redisInstance
  );

  const { id } = params;
  const { reason, taxpayerTIN } = query;

  try {
    // Assuming MyInvoisClient has a method like `rejectDocument`
    // The actual method signature might differ, adjust as needed.
    const result = await client.documents.rejectDocument(
      id,
      reason,
      taxpayerTIN
    );
    return result;
  } catch (error) {
    const action = taxpayerTIN
      ? `rejecting document ${id} with reason "${reason}" for TIN ${taxpayerTIN}`
      : `rejecting document ${id} with reason "${reason}" as taxpayer`;
    // console.error(`MyInvois Gateway: Error during ${action}:`, error);
    throw new Error(
      `Failed during ${action}. Original error: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export async function cancelDocument(
  params: CancelDocumentRequestParams,
  query: CancelDocumentRequestQuery
) {
  const client = new MyInvoisClient(
    CONFIG.clientId,
    CONFIG.clientSecret,
    CONFIG.env,
    redisInstance
  );

  const { id } = params;
  const taxpayerTIN = query.taxpayerTIN;

  try {
    const result = await client.documents.cancelDocument(
      id,
      query.reason,
      taxpayerTIN
    );
    return result;
  } catch (error) {
    const action = taxpayerTIN
      ? `cancelling document ${id} for TIN ${taxpayerTIN}`
      : `cancelling document ${id} as taxpayer`;
    throw new Error(
      `Failed during ${action}. Original error: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export async function submitInvoices(
  query: SubmitInvoiceDocumentsQuery,
  body: SubmitInvoiceDocumentsBody
) {
  const client = new MyInvoisClient(
    CONFIG.clientId,
    CONFIG.clientSecret,
    CONFIG.env,
    redisInstance
  );

  const taxpayerTIN = query.taxpayerTIN;
  const _documents = body.documents;
  try {
    const documents: DocumentSubmissionItem[] = _documents.map((doc) => {
      return createDocumentSubmissionItemFromInvoice(
        doc as CreateInvoiceDocumentParams,
        "1.0"
      );
    });

    if (query.dryRun) return documents;
    const result = await client.documents.submitDocuments(
      { documents: documents },
      taxpayerTIN
    );
    return result;
  } catch (error) {
    const action = taxpayerTIN
      ? `submitting documents for TIN ${taxpayerTIN}`
      : "submitting documents as taxpayer";
    // console.error(`MyInvois Gateway: Error during ${action}:`, error);
    throw new Error(
      `Failed during ${action}. Original error: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
