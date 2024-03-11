import plugin from "tailwindcss/plugin"
import { Config } from "./config"
import { getFontPaths } from "./file"
import { SimplifiedFont, prepareFonts } from "./font"
import * as fs from "fs"

/**
 * Create the @font-face rules for the fonts
 * @param fonts The fonts
 * @param webPerformance Whether to apply font swapping to the fonts
 * @returns An array of @font-face rules
 */
const createFontFaces = (fonts: SimplifiedFont[], webPerformance: boolean): any[] => {
  return fonts.map((font) => {
    return {
      "@font-face": {
        "font-family": `"${font.name}"`,
        "font-weight": font.weight.toString(),
        "font-style": font.style,
        "font-stretch": font.stretch,
        "font-display": webPerformance ? "swap" : "block",
        src: `url("${font.path}") format("${font.format}")`,
      },
    }
  })
}

/**
 * Create the font-family classes for the fonts
 * @param fonts The fonts
 * @param fallback The fallback font
 * @returns An array of font-family classes
 */
const createFontClasses = (fonts: SimplifiedFont[], fallback: string | boolean, cached?: boolean): any[] => {
  return fonts.map((font) => {
    const friendlyName = !cached ? font.name.replace(/\s/g, "-").toLowerCase() : font.name
    return {
      [`.font-${friendlyName}`]: {
        "font-family": `"${font.name}"${fallback ? `, ${fallback}` : ""}`,
      },
    }
  })
}

/**
 * Tailwind CSS plugin to generate font-face and font-family classes
 * @param opts - Configuration options
 * @returns Tailwind CSS plugin
 */
export default plugin.withOptions((opts: Config) => {
  const localFontPath = opts.localFontPath ?? "src/fonts"
  const destinationPath = opts.destinationPath ?? "/assets/fonts"
  const autoClasses = opts.autoClasses ?? false
  const webPerformance = opts.webPerformance ?? false
  const buildPerformance = opts.buildPerformance ?? false
  const fallback = opts.autoClasses ? opts.fallback ?? "sans-serif" : false

  if (buildPerformance && fs.existsSync("font-cache.json")) {
    // Read from the config file
    const fontCache = fs.readFileSync("font-cache.json", "utf-8")
    const json = JSON.parse(fontCache)
    const fontFaces = createFontFaces(json.fonts, json.webPerformance)
    const fontClasses = createFontClasses(json.classes, json.fallback, true)

    return ({ addBase, addUtilities }) => {
      addBase(fontFaces)
      addUtilities(fontClasses)
    }
  }

  const fontPaths = []
  if (typeof localFontPath === "string") {
    fontPaths.push(localFontPath)
  } else {
    fontPaths.push(...localFontPath)
  }

  const fontFiles = fontPaths.flatMap((path) => getFontPaths(path))
  const fonts = prepareFonts(fontFiles, destinationPath)

  const fontFaces = createFontFaces(fonts, webPerformance)
  const fontClasses = autoClasses ? createFontClasses(fonts, fallback) : []

  if (buildPerformance) {
    // Write to the config file
    const json = {
      fonts,
      webPerformance,
      classes: fontClasses,
      fallback,
    }
    fs.writeFileSync("font-cache.json", JSON.stringify(json))
  }

  return ({ addBase, addUtilities }) => {
    addBase(fontFaces)
    addUtilities(fontClasses)
  }
})
