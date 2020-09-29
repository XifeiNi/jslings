const { variableDeclaration } = require('../../../exercises/variables/variables2.js');

describe("variables2", () => {
    it("Variables2 should compile", () => {
        expect(variableDeclaration(2)).toBe(2);
    });
});
