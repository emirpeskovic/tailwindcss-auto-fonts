# tailwindcss-auto-fonts

A tailwindcss plugin that scans one or multiple directories for various font files, uses [opentype.js](https://github.com/opentypejs/opentype.js) to gather the necessary information, and then automatically adds the `@font-face` CSS rules.  
If specified, will also create `.font-<font-name>` classes for quick access of fonts.

This project was mainly created because I couldn't find anything similar to it (closest I could find was [@VicGUTT/tailwindcss-font-face](https://github.com/VicGUTT/tailwindcss-font-face) which partly inspired me to make this plugin), and some fonts I use are not available on [google fonts](https://fonts.google.com).

## Features

- Automatically creates relevant `@font-face` CSS rules
- (Optional) Automatically creates relevant `font-<font-name>` CSS classes
- (Optional) Automatically falls back to another font if the desired font can not be loaded

## Installation

Use [npm](http://npmjs.org/) or your favorite package manager:  
`npm install --save-dev tailwindcss-auto-fonts`  
Then add the plugin to your `tailwind.config.js` file:

```javascript
module.exports = {
	// ...
	plugins: [
		require("tailwindcss-auto-fonts")({
			// ... optional configuration
			localFontPath: "src/fonts", // recommended to set
			destinationPath: "/assets/fonts", // recommended to set
		}),
		// ...
	],
}
```

## Configuration

No configuration is required, however the default values might not match with your project structure, so be sure to at least specify `localFontPath` and `destinationPath`, or modify your project structure to match the default values.  
| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| `localFontPath` | `string \| string[]` | `false` | `src/fonts` | The path or paths to the locally stored fonts, can be relative or absolute |
| `destinationPath` | `string` | `false` | `/assets/fonts` | The path to append to the URL for reading paths, e.g.: `src: url(/assets/fonts/Roboto.ttf)` |
| `autoClasses` | `boolean` | `false` | `false` | Define whether or not the plugin should automatically create font classes for quick usage, e.g.: `font-roboto` |
| `webPerformance` | `boolean` | `false` | `false` | Define whether it should use [font-display: swap;](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display#swap) |
| `buildPerformance` | `boolean` | `false` | `false` | If `true`, on first build will create a `font-cache.json` file that it will read from, instead of checking the font path(s) on every rebuild, suggested to turn off |
| `fallback` | `string \| boolean` | `false` | `sans-serif` | If `true`, will use sans-serif as fallback if a font file isn't being read, otherwise if defined as a `string`, will use the value of the string as the fallback, e.g.: `fallback: "Helvetica, Roboto, sans-serif"` |

## License

[MIT License](https://github.com/emirpeskovic/tailwindcss-auto-fonts/blob/master/LICENSE)
