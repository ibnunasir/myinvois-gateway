import type Elysia from "elysia";

export const submissionsController = (app: Elysia) => {
  return app.group("submissions", (app) =>
    app
      .guard({
        detail: {
          tags: ["Submissions"],
        },
      })
      .get(
        "/",
        () => {
          return "Get Submission - WIP";
        },
        {
          detail: {
            summary: "Get Submission",
            description: `This API allows caller to get details of a single submission
            to check its processing status after initially submitting it and getting
            back unique submission identifier.
            \nThis API is available to submitter only`,
          },
        }
      )
  );
};
