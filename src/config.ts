export interface Config {
  // The path or paths to the locally stored fonts
  // Can be relative or absolute
  // Defaults to "src/fonts"
  localFontPath?: string | string[]

  // The (ideally) static path the fonts will be linked to in the final CSS file
  // Defaults to "/assets/fonts"
  destinationPath?: string

  // Whether to automatically add classes for the fonts
  // Defaults to false
  autoClasses?: boolean

  // Whether to apply font swapping to the fonts
  // Defaults to false
  webPerformance?: boolean

  // Save the first build to a config file to speed up subsequent builds
  // Enabling this will ignore any changes to the font files, and can only be updated by deleting the config file or disabling this option again
  // Good for subsequent builds, but not for development
  // Defaults to false
  buildPerformance?: boolean

  // The fallback font to use if the specified font is not available
  // Only works if autoClasses is true
  // Defaults to "sans-serif"
  fallback?: string | boolean
}
