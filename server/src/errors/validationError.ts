export class ValidationError extends Error {
  issues: string[];

  constructor(issues: string[]) {
    super("Verification error");
    this.name = "ValidationError";
    this.issues = issues;
  }
}
