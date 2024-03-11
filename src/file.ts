import * as fs from "fs"

// The file types we want to include
const fileTypes = ["woff", "woff2", "ttf", "otf"]

export interface FontFile {
	// The name of the font, e.g. "Roboto"
	name: string

	// The path to the font file, e.g. "src/fonts/Roboto.woff"
	path: string

	// The file extension, e.g. "woff", "woff2", "ttf", "otf"
	extension: string

	// The type of font (truetype, opentype, woof, woof2)
	type: "truetype" | "opentype" | "woff" | "woff2"
}

/**
 * Read all font files in a directory
 * @param path - The path to the directory
 * @returns An array of all files in the directory
 */
export const getFontPaths = (path: string): FontFile[] => {
	if (!fs.existsSync(path)) {
		return []
	}

	const files = fs.readdirSync(path)
	const fontFiles = files.map((file) => {
		const extension = file.split(".").pop()
		if (!extension || !fileTypes.includes(extension)) {
			return null
		}

		const name = file.split(".").shift()
		const type = extension === "ttf" ? "truetype" : extension === "otf" ? "opentype" : extension

		return {
			name,
			path: `${path}/${file}`,
			extension,
			type,
		}
	})

	return fontFiles.filter((file) => file !== null) as FontFile[]
}
