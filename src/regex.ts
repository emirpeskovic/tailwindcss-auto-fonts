// TODO: There is definitely a better way to make this regex, but this is fine for now
export const fontNameRegex =
  /(normal|regular|thin|black|medium|italic|oblique|(extra)?[-_ ]?light|(extra|semi)?[-_ ]?bold|(ultra|extra|semi)?[-_ ]?(condensed|expanded))/gi
export const fontWeightRegex = /(thin|black|medium|(extra)?[-_ ]?light|(extra|semi)?[-_ ]?bold)/gi
export const fontStyleRegex = /(normal|italic|oblique)/gi
export const fontStretchRegex = /(ultra|extra|semi)?[-_ ]?(condensed|expanded)/gi
