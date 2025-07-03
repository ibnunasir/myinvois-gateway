import type Elysia from "elysia";
import {
  getRecentDocuments,
  submitInvoices,
  cancelDocument,
  rejectDocument,
  searchDocuments,
  getDocument,
  getDocumentDetails,
  submitCreditNotes,
  submitDebitNotes,
  submitRefundNotes,
  submitSelfBilledInvoices,
  submitSelfBilledCreditNotes,
  submitSelfBilledDebitNotes,
  submitSelfBilledRefundNotes,
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
  SubmitCreditNoteDocumentsBodyScheme,
  SubmitCreditNoteDocumentsQueryScheme,
  SubmitDebitNoteDocumentsBodyScheme,
  SubmitDebitNoteDocumentsQueryScheme,
  SubmitRefundNoteDocumentsBodyScheme,
  SubmitRefundNoteDocumentsQueryScheme,
  SubmitSelfBilledCreditNoteDocumentsBodyScheme,
  SubmitSelfBilledCreditNoteDocumentsQueryScheme,
  SubmitSelfBilledDebitNoteDocumentsBodyScheme,
  SubmitSelfBilledDebitNoteDocumentsQueryScheme,
  SubmitSelfBilledInvoiceDocumentsBodyScheme,
  SubmitSelfBilledInvoiceDocumentsQueryScheme,
  SubmitSelfBilledRefundNoteDocumentsBodyScheme,
  SubmitSelfBilledRefundNoteDocumentsQueryScheme,
  GetDocumentRequestParamsSchema,
  GetDocumentRequestQuerySchema,
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
        ({ query, request }) => {
          return getRecentDocuments(query, request.headers);
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

      .put(
        "/:id/cancel",
        ({ params, query, request }) => {
          return cancelDocument(params, query, request.headers);
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
        ({ params, query, request }) => {
          return rejectDocument(params, query, request.headers);
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
        "/:id/raw",
        async ({ params, query, request }) => {
          return await getDocument(params, query, request.headers);
        },
        {
          detail: {
            summary: "Get Document",
            description: `Retrieve the raw document payload from MyInvois.`,
          },
          params: GetDocumentRequestParamsSchema,
          query: GetDocumentRequestQuerySchema,
        }
      )
      .get(
        "/:id",
        async ({ params, query, request }) => {
          return await getDocumentDetails(params, query, request.headers);
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
        ({ query, request }) => {
          return searchDocuments(query, request.headers); // Call searchDocuments service
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
      .post(
        "submit/invoice",
        ({ query, body, request }) => {
          return submitInvoices(query, body, request.headers);
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
      .post(
        "submit/credit-note",
        ({ query, body, request }) => {
          return submitCreditNotes(query, body, request.headers);
        },
        {
          detail: {
            summary: "Submit Credit Notes",
            description: `This API allows taxpayer to submit one or more Credit Note(s) to
            MyInvois System.`,
          },
          query: SubmitCreditNoteDocumentsQueryScheme,
          body: SubmitCreditNoteDocumentsBodyScheme,
        }
      )
      .post(
        "submit/debit-note",
        ({ query, body, request }) => {
          return submitDebitNotes(query, body, request.headers);
        },
        {
          detail: {
            summary: "Submit Debit Notes",
            description: `This API allows taxpayer to submit one or more Debit Note(s) to
            MyInvois System.`,
          },
          query: SubmitDebitNoteDocumentsQueryScheme,
          body: SubmitDebitNoteDocumentsBodyScheme,
        }
      )
      .post(
        "submit/refund-note",
        ({ query, body, request }) => {
          return submitRefundNotes(query, body, request.headers);
        },
        {
          detail: {
            summary: "Submit Refund Notes",
            description: `This API allows taxpayer to submit one or more Refund Note(s) to
            MyInvois System.`,
          },
          query: SubmitRefundNoteDocumentsQueryScheme,
          body: SubmitRefundNoteDocumentsBodyScheme,
        }
      )
      .post(
        "submit/self-billed-invoice",
        ({ query, body, request }) => {
          return submitSelfBilledInvoices(query, body, request.headers);
        },
        {
          detail: {
            summary: "Submit Self-Billed Invoices",
            description: `This API allows taxpayer to submit one or more Self-Billed Invoice(s) to
            MyInvois System.`,
          },
          query: SubmitSelfBilledInvoiceDocumentsQueryScheme,
          body: SubmitSelfBilledInvoiceDocumentsBodyScheme,
        }
      )
      .post(
        "submit/self-billed-credit-note",
        ({ query, body, request }) => {
          return submitSelfBilledCreditNotes(query, body, request.headers);
        },
        {
          detail: {
            summary: "Submit  Self-Billed Credit Notes",
            description: `This API allows taxpayer to submit one or more Self-Billed Credit Note(s) to
            MyInvois System.`,
          },
          query: SubmitSelfBilledCreditNoteDocumentsQueryScheme,
          body: SubmitSelfBilledCreditNoteDocumentsBodyScheme,
        }
      )
      .post(
        "submit/self-billed-debit-note",
        ({ query, body, request }) => {
          return submitSelfBilledDebitNotes(query, body, request.headers);
        },
        {
          detail: {
            summary: "Submit  Self-Billed Debit Notes",
            description: `This API allows taxpayer to submit one or more Self-Billed Debit Note(s) to
            MyInvois System.`,
          },
          query: SubmitSelfBilledDebitNoteDocumentsQueryScheme,
          body: SubmitSelfBilledDebitNoteDocumentsBodyScheme,
        }
      )
      .post(
        "submit/self-billed-refund-note",
        ({ query, body, request }) => {
          return submitSelfBilledRefundNotes(query, body, request.headers);
        },
        {
          detail: {
            summary: "Submit Self-Billed Refund Notes",
            description: `This API allows taxpayer to submit one or more Self-Billed Refund Note(s) to
            MyInvois System.`,
          },
          query: SubmitSelfBilledRefundNoteDocumentsQueryScheme,
          body: SubmitSelfBilledRefundNoteDocumentsBodyScheme,
        }
      )
  );
};
