import { FontFile } from "./file"
import { loadSync } from "opentype.js"
import { fontNameRegex, fontWeightRegex, fontStyleRegex, fontStretchRegex } from "./regex"

export enum FontWeight {
	Thin = 100,
	ExtraLight = 200,
	Light = 300,
	Normal = 400,
	Medium = 500,
	SemiBold = 600,
	Bold = 700,
	ExtraBold = 800,
	Black = 900,
}

export enum FontStyle {
	Normal = "normal",
	Italic = "italic",
	Oblique = "oblique",
}

export enum FontStretch {
	UltraCondensed = "ultra-condensed",
	ExtraCondensed = "extra-condensed",
	Condensed = "condensed",
	SemiCondensed = "semi-condensed",
	Normal = "normal",
	SemiExpanded = "semi-expanded",
	Expanded = "expanded",
	ExtraExpanded = "extra-expanded",
	UltraExpanded = "ultra-expanded",
}

export interface SimplifiedFont {
	name: string
	weight: FontWeight
	style: FontStyle
	stretch: FontStretch
	format: "opentype" | "truetype" | "woff" | "woff2"
	path: string
}

/**
 * Get the common name of a font using the font file and the font object
 * @param file The font file
 * @param font The font object
 * @returns The common name of the font
 */
const getCommonName = (file: FontFile, font: any): string => {
	const name = (font.names?.fontFamily?.en || font.names?.fullName?.en || font.names?.preferredFamily?.en || file.name).replace(fontNameRegex, "").trim()

	return name
}

/**
 * Get the font weight of a font
 * @param file The font file
 * @param font The font object
 * @returns The font weight
 */
const getFontWeight = (file: FontFile, font: any): FontWeight => {
	const weight = font.tables?.os2?.usWeightClass || file.name.match(fontWeightRegex)?.[0] || FontWeight.Normal // Fall back to normal if no weight is found

	if (weight < 100) {
		// Sometimes the weight is not multiple of 100, but instead just a numeric representation of the index in the FontWeight enum
		// @see: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-weight#common_weight_name_mapping
		return Object.values(FontWeight)[weight - 1] as FontWeight
	}

	return weight
}

/**
 * Get the font style of a font
 * @param file The font file
 * @param font The font object
 * @returns The font style
 */
const getFontStyle = (file: FontFile, font: any): FontStyle => {
	const style = font.tables?.os2?.fsSelection?.italic || font.tables?.post?.italicAngle !== 0 || file.name.match(fontStyleRegex)?.[0] || FontStyle.Normal // Fall back to normal if no style is found
	return style
}

/**
 * Get the font stretch of a font
 * @param file The font file
 * @param font The font object
 * @returns The font stretch
 */
const getFontStretch = (file: FontFile, font: any): FontStretch => {
	const stretch = font.tables?.os2?.usWidthClass

	if (!isNaN(stretch)) {
		// When the stretch is a number, it's the index in the FontStretch enum
		// @see: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-stretch#keyword_to_numeric_mapping
		return Object.values(FontStretch)[stretch - 1] as FontStretch
	}

	if (file.name.match(fontStretchRegex)) {
		return file.name.match(fontStretchRegex)?.[0] as FontStretch
	}

	return FontStretch.Normal
}

/**
 * Returns a simplified version of the font object to easily add to CSS
 * @param fontFiles The font files
 * @param destinationPath The path to the destination folder
 * @returns An array of simplified font objects
 */
export const prepareFonts = (fontFiles: FontFile[], destinationPath: string): SimplifiedFont[] => {
	return fontFiles.map((file) => {
		const font = loadSync(file.path)

		const name = getCommonName(file, font)
		const weight = getFontWeight(file, font)
		const style = getFontStyle(file, font)
		const stretch = getFontStretch(file, font)
		const format = file.type
		const path = `${destinationPath}/${file.name}.${file.extension}`

		return { name, weight, style, stretch, format, path }
	})
}
