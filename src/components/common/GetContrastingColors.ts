const ColorScheme: any = require("color-scheme");

export function GetContrastingColors(hue: number): [string, string]
{
  const scheme = new ColorScheme();
  scheme.from_hue(hue).scheme("contrast").variation("default");
  const colors: string[] = scheme.colors();

  return ["#" + colors[3], "#" + colors[7]];
}
