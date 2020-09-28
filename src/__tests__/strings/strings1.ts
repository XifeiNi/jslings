import { add } from "../../../exercises/strings/strings1";

describe("addition", () => {
    it("returns true", () => {
        expect(add(2, 2)).toBe(4);
    });
});
