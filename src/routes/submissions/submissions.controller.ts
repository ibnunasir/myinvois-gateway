import type Elysia from "elysia";
import { getSubmissionDetails } from "./submissions.service";
import {
  GetSubmissionRequestParamsSchema,
  GetSubmissionRequestQuerySchema,
} from "src/schemes";

export const submissionsController = (app: Elysia) => {
  return app.group("submissions", (app) =>
    app
      .guard({
        detail: {
          tags: ["Submissions"],
        },
      })
      .get(
        "/:id",
        async ({ params, query }) => {
          return await getSubmissionDetails(params, query);
        },
        {
          detail: {
            summary: "Get Submission Details",
            description: `This API allows caller to get details of a single submission
            to check its processing status after initially submitting it and getting
            back unique submission identifier.
            \nThis API is available to submitter only`,
          },
          params: GetSubmissionRequestParamsSchema,
          query: GetSubmissionRequestQuerySchema,
        }
      )
  );
};
