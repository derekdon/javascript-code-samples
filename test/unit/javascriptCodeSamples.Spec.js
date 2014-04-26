/*jslint browser: true, devel: true, debug: true */
/*global describe, it, before, beforeEach, after, afterEach, expect */

describe("Number utilities", function () {

    "use strict";

    describe("constrainedNumber", function () {

        var inputNumber,
            min = 3,
            max = 9,
            constrainedNumber;

        it("inputNumber greater than max should be constrained to max", function () {
            inputNumber = 13;
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

        it("random number stays within range", function () {
            var randomNumber = Number().randomWithinRange(0, 5);
            expect(randomNumber).toBeGreaterThan(-1);
            expect(randomNumber).toBeLessThan(6);
        });

        it("can create a random boolean", function () {
            var randomBoolean = !!Number().randomWithinRange(0, 1);
            expect(typeof randomBoolean).toBe("boolean");
        });
    });
});

describe("String utilities", function () {

    "use strict";

    var decodedString = "<@{Hello&/World}£\\<>",
        encodedString = "&lt;&#64;&#123;Hello&amp;&#47;World&#125;&#163;&#92;&lt;&gt;";

    describe("encodeEntities", function () {
        it("string encodes correctly", function () {
            expect(decodedString.encodeEntities()).toBe(encodedString);
        });
    });

    describe("decodeEntities", function () {
        it("string decodes correctly", function () {
            expect(encodedString.decodeEntities()).toBe(decodedString);
        });
    });

    describe("trim", function () {
        var fatString = "           Hello World             ",
            trimString = "Hello World";
        it("string trimmed correctly", function () {
            expect(fatString.trim()).toBe(trimString);
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
        it("out of bounds indices are wrapped correctly", function () {
            var someArray = [
                0,
                1,
                2,
                3,
                4
            ];
            expect(someArray.wrappedIndex(-3)).toEqual(2);
            expect(someArray.wrappedIndex(6)).toEqual(1);
        });
    });
});