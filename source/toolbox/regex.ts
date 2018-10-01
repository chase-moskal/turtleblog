
/**
 * Run a regular expression on a string, and return a single capture group
 * @param re regular expression
 * @param subject string to execute against
 * @param n capture group to return (default=1)
 * @returns captured string, or if no match, null
 */
export const regex = (re: RegExp, subject: string, n: number = 1) => {
	const results = re.exec(subject)
	return results ? results[n] : null
}
