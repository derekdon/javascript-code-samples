/*jslint browser: true, devel: true, debug: true */
/*global describe, it, before, beforeEach, after, afterEach, expect, spyOn, functionalPeople */

describe("Functional person example", function () {

    "use strict";

    var someGuy = functionalPeople.casualPerson({
            firstName: "Derek",
            email: "derek@derekdonnelly.com"
        }),
        someProfessional = functionalPeople.professionalPerson({
            firstName: "Derek",
            lastName: "Donnelly",
            email: "derek@codex9.com",
            company: "Codex9 Ltd.",
            male: true
        });

    beforeEach(function () {
        spyOn(someProfessional, "getTitle").andCallThrough();
    });

    it("someGuy.getName() returns first name only", function () {
        expect(someGuy.getName()).toBe("Derek");
    });

    it("people default to male when not specified in spec", function () {
        expect(someGuy.isMale()).toBe(true);
    });

    it("someProfessional.getName() returns full name with title", function () {
        expect(someProfessional.getName()).toBe("Mr. Derek Donnelly");
        expect(someProfessional.getTitle).toHaveBeenCalled();
    });

    it("someProfessional.isMale() reports male as specified in spec", function () {
        expect(someProfessional.isMale()).toBe(true);
    });

    it("ensure someGuy.getCompany() is not defined", function () {
        expect(someGuy.getCompany).not.toBeDefined();
    });

    it("ensure someProfessional.getCompany() is defined", function () {
        expect(someProfessional.getCompany).toBeDefined();
    });
});

describe("Number utilities", function () {

    "use strict";

    describe("constrainedNumber", function () {

        var inputNumber, min, max, constrainedNumber, typeErrorMsg = "constrainToRange(...) requires Number args";

        beforeEach(function () {
            inputNumber = 13;
            min = 3;
            max = 9;
        });

        it("inputNumber greater than max should be constrained to max", function () {
            constrainedNumber = inputNumber.constrainToRange(min, max);
            expect(constrainedNumber).toEqual(max);
        });

        it("inputNumber less than min should be constrained to min", function () {
            inputNumber = 0;
            constrainedNumber = inputNumber.constrainToRange(min, max);
            expect(constrainedNumber).toEqual(min);
        });

        it("in range inputNumbers should not be changed", function () {
            for (inputNumber = min; inputNumber <= max; inputNumber += 1) {
                constrainedNumber = inputNumber.constrainToRange(min, max);
                expect(constrainedNumber).toEqual(inputNumber);
            }
        });

        it("throws an error when passed a non-numerical min", function () {
            expect(inputNumber.constrainToRange.bind(null, "min", max)).toThrow(typeErrorMsg);
            expect(inputNumber.constrainToRange.bind(null, null, max)).toThrow(typeErrorMsg);
            expect(inputNumber.constrainToRange.bind(null, undefined, max)).toThrow(typeErrorMsg);
            expect(inputNumber.constrainToRange.bind(null, true, max)).toThrow(typeErrorMsg);
            expect(inputNumber.constrainToRange.bind(null, {}, max)).toThrow(typeErrorMsg);
        });

        it("throws an error when passed a non-numerical max", function () {
            expect(inputNumber.constrainToRange.bind(null, min, "max")).toThrow(typeErrorMsg);
            expect(inputNumber.constrainToRange.bind(null, min, null)).toThrow(typeErrorMsg);
            expect(inputNumber.constrainToRange.bind(null, min, undefined)).toThrow(typeErrorMsg);
            expect(inputNumber.constrainToRange.bind(null, min, true)).toThrow(typeErrorMsg);
            expect(inputNumber.constrainToRange.bind(null, min, {})).toThrow(typeErrorMsg);
        });
    });

    describe("integer", function () {

        it("negative numbers are ceiled", function () {
            expect((-4.5).integer()).toEqual(-4);
        });

        it("positive numbers are floored", function () {
            expect((4.5).integer()).toEqual(4);
        });
    });

    describe("randomWithinRange", function () {

        var typeErrorMsg = "randomWithinRange(...) requires Number args",
            rangeErrorMsg = "randomWithinRange(...) max should not be less than min";

        it("random number stays within range", function () {
            var randomNumber = Number().randomWithinRange(0, 5);
            expect(randomNumber).toBeGreaterThan(-1);
            expect(randomNumber).toBeLessThan(6);
        });

        it("can create a random boolean", function () {
            var randomBoolean = !!Number().randomWithinRange(0, 1);
            expect(typeof randomBoolean).toBe("boolean");
        });

        it("throws an error when passed a non-numerical min", function () {
            expect(Number().randomWithinRange.bind(null, "0", 10)).toThrow(typeErrorMsg);
            expect(Number().randomWithinRange.bind(null, null, 10)).toThrow(typeErrorMsg);
            expect(Number().randomWithinRange.bind(null, undefined, 10)).toThrow(typeErrorMsg);
            expect(Number().randomWithinRange.bind(null, true, 10)).toThrow(typeErrorMsg);
            expect(Number().randomWithinRange.bind(null, {}, 10)).toThrow(typeErrorMsg);
        });

        it("throws an error when passed a non-numerical max", function () {
            expect(Number().randomWithinRange.bind(null, 0, "10")).toThrow(typeErrorMsg);
            expect(Number().randomWithinRange.bind(null, 0, null)).toThrow(typeErrorMsg);
            expect(Number().randomWithinRange.bind(null, 0, undefined)).toThrow(typeErrorMsg);
            expect(Number().randomWithinRange.bind(null, 0, true)).toThrow(typeErrorMsg);
            expect(Number().randomWithinRange.bind(null, 0, {})).toThrow(typeErrorMsg);
        });

        it("throws an error when max is less than min", function () {
            expect(Number().randomWithinRange.bind(null, 10, 0)).toThrow(rangeErrorMsg);
        });
    });
});

describe("String utilities", function () {

    "use strict";

    var decodedString = "<@{Hello&/World}£\\<>",
        encodedString = "&lt;&#64;&#123;Hello&amp;&#47;World&#125;&#163;&#92;&lt;&gt;";

    describe("encodeEntities", function () {
        it("string encodes correctly", function () {
            expect(decodedString.encodeEntities()).toEqual(encodedString);
        });
    });

    describe("decodeEntities", function () {
        it("string decodes correctly", function () {
            expect(encodedString.decodeEntities()).toEqual(decodedString);
        });
    });

    describe("trim", function () {
        var fatString = "           Hello World             ",
            trimString = "Hello World";
        it("string trimmed correctly", function () {
            expect(fatString.trim()).toEqual(trimString);
        });
    });

    describe("isEmpty", function () {

        it("empty strings are reported correctly", function () {
            expect("".isEmpty()).toBe(true);
            expect("     ".isEmpty()).toBe(true);
        });

        it("non-empty strings are reported correctly", function () {
            expect("''".isEmpty()).toBe(false);
            expect("hello world".isEmpty()).toBe(false);
        });
    });

    describe("containsTags", function () {

        it("strings with tags are reported correctly", function () {
            expect("Hello &lt;p&gt;World&lt;&#47;p&gt;".containsTags()).toBe(true);
            expect("Hello <span class=\"earth\">World</span>".containsTags()).toBe(true);
        });

        it("strings without tags are reported correctly", function () {
            expect("Hello World".containsTags()).toBe(false);
        });
    });
});

describe("Array utilities", function () {

    "use strict";

    describe("wrappedIndex", function () {

        var someArray = [
                0,
                1,
                2,
                3,
                4
            ],
            typeErrorMsg = "wrappedIndex(...) requires a Number arg";

        it("out of bounds indices are wrapped correctly", function () {
            expect(someArray.wrappedIndex(-3)).toEqual(2);
            expect(someArray.wrappedIndex(6)).toEqual(1);
        });

        it("throws an error when passed a non-numerical index", function () {
            expect(someArray.wrappedIndex.bind(null, "6")).toThrow(typeErrorMsg);
            expect(someArray.wrappedIndex.bind(null, null)).toThrow(typeErrorMsg);
            expect(someArray.wrappedIndex.bind(null, undefined)).toThrow(typeErrorMsg);
            expect(someArray.wrappedIndex.bind(null, true)).toThrow(typeErrorMsg);
            expect(someArray.wrappedIndex.bind(null, {})).toThrow(typeErrorMsg);
        });
    });
});