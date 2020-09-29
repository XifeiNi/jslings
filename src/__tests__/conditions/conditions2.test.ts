const { animalSoundsTernary } = require('../../../exercises/conditions/conditions2.js');

describe("conditions1", () => {
    it("returns the correct animal sounds", () => {
        expect(animalSoundsTernary('cat')).toBe('MEOW');
        expect(animalSoundsTernary('dog')).toBe('WOOF');
    });
});
