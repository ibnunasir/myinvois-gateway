import type Elysia from "elysia";
import {
  getRecentDocuments,
  submitInvoices,
  cancelDocument,
  rejectDocument,
  searchDocuments,
  getDocumentDetails,
} from "./documents.service";
import {
  GetRecentDocumentsRequestQueryScheme,
  GetRecentDocumentsResponseSchema,
  SubmitInvoiceDocumentsQueryScheme,
  SubmitInvoiceDocumentsBodyScheme,
  CancelDocumentRequestQuerySchema,
  CancelDocumentRequestParamsSchema,
  RejectDocumentRequestParamsSchema,
  RejectDocumentRequestQuerySchema,
  SearchDocumentsRequestQuerySchema,
  GetDocumentDetailsRequestParamsSchema,
  GetDocumentDetailsRequestQuerySchema,
} from "src/schemes";

export const documentsController = (app: Elysia) => {
  return app.group("documents", (app) =>
    app
      .guard({
        detail: {
          tags: ["Documents"],
        },
      })
      .get(
        "/",
        ({ query }) => {
          return getRecentDocuments(query);
        },
        {
          detail: {
            summary: "Get Recent Documents",
            description: `This API allows taxpayer's systems to search the documents
            sent or received which are available on the MyInvois System using various
            filters. This API will only return documents that are issued within the
            last 31 days.`,
          },
          query: GetRecentDocumentsRequestQueryScheme,
          response: GetRecentDocumentsResponseSchema,
        }
      )
      .post(
        "submit/invoice",
        ({ query, body }) => {
          return submitInvoices(query, body);
        },
        {
          detail: {
            summary: "Submit Invoices",
            description: `This API allows taxpayer to submit one or more invoices to
            MyInvois System.`,
          },
          query: SubmitInvoiceDocumentsQueryScheme,
          body: SubmitInvoiceDocumentsBodyScheme,
        }
      )
      .put(
        "/:id/cancel",
        ({ params, query }) => {
          return cancelDocument(params, query);
        },
        {
          detail: {
            summary: "Cancel Document",
            description: `This API allows issuer to cancel previously issued document,
            either self-induced cancellation or by accepting a rejection request made
            by the buyer.`,
          },
          params: CancelDocumentRequestParamsSchema,
          query: CancelDocumentRequestQuerySchema,
        }
      )
      .put(
        "/:id/reject",
        ({ params, query }) => {
          return rejectDocument(params, query);
        },
        {
          detail: {
            summary: "Reject Document",
            description: `This API allows a buyer that received an invoice to reject it
            and request the supplier to cancel it. The document ID is required as a
            path parameter, and a reason for rejection must be provided in the query.`,
          },
          params: RejectDocumentRequestParamsSchema,
          query: RejectDocumentRequestQuerySchema,
        }
      )
      .get(
        "/:id",
        async ({ params, query }) => {
          return await getDocumentDetails(params, query);
        },
        {
          detail: {
            summary: "Get Document Details",
            description: `This API allows taxpayers to retrieve a single document's full
            details. The document ID (UUID) is required as a path parameter.
            An optional taxpayerTIN can be provided in the query if the caller
            is an ERP system acting on behalf of a taxpayer.`,
          },
          params: GetDocumentDetailsRequestParamsSchema,
          query: GetDocumentDetailsRequestQuerySchema,
          // No response schema specified by user
        }
      )
      .put(
        "search",
        ({ query }) => {
          return searchDocuments(query); // Call searchDocuments service
        },
        {
          detail: {
            summary: "Search Documents",
            description: `This API allows taxpayer's systems to search the documents
            sent or received which are available on the MyInvois System using various
            filters.`,
          },
          query: SearchDocumentsRequestQuerySchema, // Added query schema
          // response: GetRecentDocumentsResponseSchema, // Response schema can be added if defined
        }
      )
  );
};
