
export const regex = (re: RegExp, subject: string, n: number = 1) => {
	const results = re.exec(subject)
	return results ? results[n] : null
}
