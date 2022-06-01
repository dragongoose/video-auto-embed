/*
  autocomplete: {
    type: {
      choices: ["Manual Verification", "Captcha", "none"],
    },
*/

/**
 * Choices for autocomplete.
 * Im commands, if you have a
 * command that you want to autocomplete,
 * you can use this.
 *
 * the `options` property for a command
 * is an array of options, you then use
 * this autocomplete property to specify
 * what the values are.
 */
export interface AutocompleteChoices {
  [key: string]: string[];
}
