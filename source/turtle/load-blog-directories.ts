
import {listDirectories} from "../files/list-directories"

export async function loadBlogDirectories({source, blog}: {
	source: string
	blog: string
}) {

	let blogDirectories = []
	const blogPath = `${source}/${blog}`
	const years = await listDirectories(blogPath)

	for (const year of years) {
		const yearPath = `${blogPath}/${year}`
		const months = await listDirectories(yearPath)

		for (const month of months) {
			const monthPath = `${yearPath}/${month}`
			const days = await listDirectories(monthPath)

			for (const day of days) {
				const dayPath = `${monthPath}/${day}`
				blogDirectories = [
					...blogDirectories,
					...await listDirectories(dayPath)
				]
			}
		}
	}

	return blogDirectories
}
