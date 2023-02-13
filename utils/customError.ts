/**
 * @typedef {string} ErrorMatcherIndex0 - pretty version of the error msg
 * @typedef {string} ErrorMatcherIndex1 - string to match against raw error msg
 * @typedef {[ErrorMatcherIndex0, ErrorMatcherIndex1]} ErrorMatcher
 */
type ErrorMatcher = readonly [string, string];

export class CustomError {
  private errorMatchers: readonly ErrorMatcher[] = [];
  public errorInstance: Error | null = null;

  constructor(errorMatchers: readonly ErrorMatcher[]) {
    this.errorMatchers = errorMatchers;
  }

  init(err: Error): CustomError {
    console.error(err);
    this.errorInstance = err;
    return this;
  }

  getPrettyMsg() {
    if (!this.errorInstance) return "";

    const rawMsgLowercase = this.errorInstance.message.toLowerCase();

    for (const [prettyMsg, matcher] of this.errorMatchers) {
      if (rawMsgLowercase.includes(matcher.toLowerCase())) {
        return prettyMsg;
      }
    }

    return "An unexpected error ocurred";
  }
}
