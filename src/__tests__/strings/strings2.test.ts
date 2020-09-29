const { strlen } = require('../../../exercises/strings/strings2.js');

describe("strings2", () => {
    it("can find length of string", () => {
        expect(strlen("I am a string")).toBe(13);
    });
});
