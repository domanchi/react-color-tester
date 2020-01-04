import {expect} from "chai";
import {JSDOM} from "jsdom";

import Color from "services/logic/Color";


describe("Color", () => {
  describe("convertToRGB", () => {
    before(() => {
      const dom = new JSDOM("<!DOCTYPE html><html></html>");
      global.document = dom.window.document;
    });

    it("should handle preformatted RGB values", () => {
      const color = new Color([1, 2, 3]);

      expect(color.rgb).to.deep.equal([1, 2, 3]);
    });

    it("should handle hex values", () => {
      const color = new Color("#FFFFFF");

      expect(color.rgb).to.deep.equal([255, 255, 255]);
    });

    it("should handle browser specified colors", () => {
      const color = new Color("black");

      expect(color.rgb).to.deep.equal([0, 0, 0]);
    });
  });

  describe("toGrayScale", () => {
    it("should be the same if already gray", () => {
      const color = new Color([128, 128, 128]);

      expect(color.toGrayScale()).to.equal("#808080");
    });

    it("should not merely take the average", () => {
      const color = new Color([0, 255, 127]);

      //  If averaged, it will be #7F7F7F
      expect(color.toGrayScale()).to.equal("#DEDEDE");
    });
  });
  
  describe("toString", () => {
    it("should handle basic cases", () => {
      const color = new Color([0, 128, 255]);

      expect(color.toString()).to.equal("#0080FF");
    });

    it("should handle alpha values", () => {
      const color = new Color([0, 0, 0], {alpha: 0.4});

      expect(color.toString()).to.equal("#00000066");
    });
  });

  //  This uses https://contrast-ratio.com/ as a source of truth.
  describe("calculateContrastValue", () => {
    it("should handle basic cases", () => {
      const colorA = new Color("#FFFFFF");
      const colorB = new Color("#345678");
  
      expect(colorA.calculateContrastValue(colorB)).to.equal(7.64);
      expect(colorB.calculateContrastValue(colorA)).to.equal(7.64);
    });
  });

  //  The true values were obtained through manual modifications with photopea.com
  describe("blendWith", () => {
    it("should handle basic cases", () => {
      const colorA = new Color([0, 255, 0]);
      const colorB = new Color([128, 128, 128], {alpha: 0.62});

      const newColor = colorA.blendWith(colorB);
      expect(newColor.rgb).to.deep.equal([79, 176, 79]);
      expect(newColor.alpha).to.equal(1)
    });

    it("should return base color, if overlay is transparent", () => {
      const colorA = new Color([0, 255, 0]);
      const colorB = new Color([0, 0, 0], {alpha: 0});

      const newColor = colorA.blendWith(colorB);
      expect(newColor.rgb).to.deep.equal(colorA.rgb);
      expect(newColor.alpha).to.equal(colorA.alpha);
    });

    it("should return overlay color, if base is transparent", () => {
      const colorA = new Color([0, 255, 0], {alpha: 0});
      const colorB = new Color([0, 0, 0]);

      const newColor = colorA.blendWith(colorB);
      expect(newColor.rgb).to.deep.equal(colorB.rgb);
      expect(newColor.alpha).to.equal(colorB.alpha);
    });

    it("handle cases where both have non-opaque colors", () => {
      const colorA = new Color([0, 255, 0], {alpha: 0.67});
      const colorB = new Color([0, 0, 255], {alpha: 0.36});

      const newColor = colorA.blendWith(colorB);
      expect(newColor.rgb).to.deep.equal([0, 139, 116]);
      expect(newColor.alpha).to.equal(0.7888);
    });
  })
});