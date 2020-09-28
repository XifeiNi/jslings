const { animalSounds } = require('../../../exercises/conditions/conditions1.js');

describe("conditions1", () => {
    it("returns the correct animal sounds", () => {
        expect(animalSounds('cat')).toBe('MEOW');
        expect(animalSounds('dog')).toBe('WOOF');
    });
});
