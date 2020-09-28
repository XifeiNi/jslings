const { square } = require('../../../exercises/numbers/numbers2.js');

describe("numbers2", () => {
    it("can square a number", () => {
        expect(square(2)).toBe(4);
    });
});
