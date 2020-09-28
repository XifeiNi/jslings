const { sum } = require('../../../exercises/numbers/numbers1.js');

describe("numbers1", () => {
    it("can add two numbers together", () => {
        expect(sum(2, 2)).toBe(4);
    });
});
