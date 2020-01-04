import {floor} from "services/util";

export default class Color {
  /**
   * @param {string|Array} color CSS compatible color
   * @param {number} alpha transparency value, between 0-1.
   */
  constructor(color, {alpha=1}={}) {
    if (Array.isArray(color)) {
      this.rgb = color;
    } else {
      this.rgb = convertToRGB(color);
    }

    this.alpha = alpha;
  }

  /**
   * @returns {string} hex
   */
  toGrayScale() {
    //  All colors have the same luminance, and the gamma expansion is inversed.
    //  This gives a better grayscale than just averaging the values.
    const luminance = calculateLuminanceForColor(this.rgb);
    let grayValue = luminance <= 0.0031308
      ? luminance * 12.92
      : Math.pow(luminance, 1 / 2.4) * 1.055 - 0.055;
    
    //  Need to undo gamma compression
    grayValue = Math.round(grayValue * 255);

    return toHexCode([grayValue, grayValue, grayValue]);
  }

  /**
   * @returns {string} hex
   */
  toString() {
    let output = toHexCode(this.rgb);
    if (this.alpha < 1) {
      const alphaHex = Math.round(this.alpha * 255).toString(16);
      output += alphaHex;
    }

    return output;
  }

  /**
   * This assumes the current color is the background color.
   * @param {Color} color text color
   * @returns {number}
   */
  calculateContrastValue(color) {
    const backgroundLuminance = calculateLuminanceForColor(this.rgb);
    const textLuminance = calculateLuminanceForColor(color.rgb);

    //  Source: https://github.com/LeaVerou/contrast-ratio/blob/be62242e901f5d9ad60dedad1740ccc53673abc5/color.js#L106
    const l1 = backgroundLuminance + 0.05;
    const l2 = textLuminance + 0.05;
    let ratio = l1 / l2;
    if (l2 > l1) {
      ratio = 1 / ratio;
    }

    return floor(ratio, 2);
  }

  /**
   * @param {Color} color overlay color
   */
  blendWith(color) {
    //  Source: https://en.wikipedia.org/wiki/Alpha_compositing#Alpha_blending
    const coefficient = (1 - color.alpha) * this.alpha;
    const alpha = coefficient + color.alpha;

    return new Color(
      this.rgb.map((channel, index) => {
        return Math.round(
          (coefficient * channel + color.alpha * color.rgb[index]) / alpha
        );
      }),
      {
        alpha: alpha,
      }
    )
  }
}

/**
 * @param {string} color CSS compatible color
 * @returns {Array} [r, g, b]
 */
function convertToRGB(color) {
  if (!color.startsWith("#")) {
    //  Source: https://stackoverflow.com/a/47355187
    const context = document.createElement("canvas").getContext("2d");
    context.fillStyle = color;
    color = context.fillStyle;
  }

  color = color.substr(1);
  return [
      parseInt(color.slice(0, 2), 16),
      parseInt(color.slice(2, 4), 16),
      parseInt(color.slice(4, 6), 16),
  ];
}

/**
 * @param {Array} color [r, g, b]
 * @returns {string}
 */
function toHexCode(color) {
  const padding = 2;
  const hexValue = color.map((value) => {
    let output = value.toString(16);
    while (output.length < padding) {
      output = "0" + output;
    }

    return output.toUpperCase();
  }).join("");

  return `#${hexValue}`;
}

/**
 * @param {Array} color [r, g, b]
 */
function calculateLuminanceForColor(color) {
  const values = color.map(calculateLuminanceForChannel);

  //  Coefficients represent intensity perception of the typical trichromats humans see.
  //  Human vision is most sensitive to green, so it has the highest coefficient.
  return (
    values[0] * 0.2126 +
    values[1] * 0.7152 +
    values[2] * 0.0722
  );
}

/**
 * @param {number} value 0-255 (single RGB channel)
 */
function calculateLuminanceForChannel(value) {
  //  Source: https://stackoverflow.com/a/9733420
  //  For more details, check out the wiki page:
  //  https://en.wikipedia.org/wiki/Grayscale#Colorimetric_(perceptual_luminance-preserving)_conversion_to_grayscale
  
  //  First, we gamma-compress it so that it falls in a range of [0, 1]
  value /= 255;

  //  Then, we run the formula.
  return value <= 0.0405
    ? value / 12.92
    : Math.pow((value + 0.055) / 1.055, 2.4);
}