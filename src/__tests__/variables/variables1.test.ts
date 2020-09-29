const { constVariable } = require('../../../exercises/variables/variables1.js');


describe("variables1", () => {
    it("const variables shouldn't be mutated", () => {
        expect(constVariable(2)).toBe(2);
    });
});
