const { uppercase } = require('../../../exercises/strings/strings1.js');

describe("strings1", () => {
    it("can return string in uppercase", () => {
        expect(uppercase("I am a string")).toBe("I AM A STRING");
    });
});
