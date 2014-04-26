/*jslint browser: true, devel: true, debug: true */

"use strict";

/**
 * Add helper methods
 */

Function.prototype.method = function (name, func) {
    if (!this.prototype[name]) {
        this.prototype[name] = func;
        return this;
    }
};

if (typeof Object.create !== "function") {
    Object.create = function (o) {
        var F = function () {
        };
        F.prototype = o;
        return new F();
    };
}

Object.method("superior", function (name) {
    var that = this,
        method = that[name];
    return function () {
        return method.apply(that, arguments);
    };
});

/**
 * Example: Using the functional inheritance pattern to gain privacy and super functionality
 */

var functionalPeople = {

    /**
     * Creates a casual person Object
     *
     * @param   {Object}    spec     The spec containing the values to use
     *
     * @return  {Object}
     */
    casualPerson: function (spec) {
        spec.male = (spec.male === undefined) ? true : !!spec.male;
        var that = {};
        that.getName = function () {
            return spec.firstName || "";
        };
        that.getEmail = function () {
            return spec.email || "";
        };
        that.isMale = function () {
            return spec.male;
        };
        that.toString = function () {
            return "\n\t" + that.getName() + "\n\t" + that.getEmail();
        };
        return that;
    },

    /**
     * Creates a professional person Object
     *
     * @param   {Object}    spec     The spec containing the values to use
     *
     * @return  {Object}
     */
    professionalPerson: function (spec) {
        var that = this.casualPerson(spec),
            superGetName = that.superior("getName");
        that.getName = function () {
            return that.getTitle() + superGetName() + " " + spec.lastName;
        };
        that.getTitle = function () {
            return that.isMale() ? "Mr. " : "Miss. ";
        };
        that.getCompany = function () {
            return spec.company || "";
        };
        that.toString = function () {
            return "\n\t" + that.getName() + "\n\t" + that.getEmail() + "\n\t" + that.getCompany();
        };
        return that;
    }
};

(function () {

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

    console.log("\nsomeGuy: " + someGuy.toString());
    console.log("\nsomeProfessional: " + someProfessional.toString());
}());

/**
 * Example: Some custom Number utility methods added to the Number prototype
 */

(function () {

    var inputNumber, constrainedNumber, randomBoolean;

    /**
     * Constrains a Number to within a range
     *
     * var inputNumber = 13;
     * var constrainedNumber = inputNumber.constrainToRange(0, 6);
     *
     * @param   {Number}    min     The minimum range Number
     * @param   {Number}    max     The maximum range Number
     *
     * @return  {Number}    The constrained Number
     */
    Number.method("constrainToRange", function () {
        return function constrainToRange(min, max) {
            try {
                if (typeof min !== "number" || typeof max !== "number") {
                    throw new TypeError("constrainToRange(...) requires Number args");
                }

                if (this >= min) {
                    return (this <= max) ? this.valueOf() : max;
                }
                return min;
            } catch (e) {
                console.log(e.name + ": " + e.message);
                throw e; // rethrow to inform unit tests
            }
        };
    }());

    inputNumber = 13;
    constrainedNumber = inputNumber.constrainToRange(0, 6);

    console.log("\ninputNumber: " + inputNumber + ", inputNumber.constrainedNumber(0, 6): " + constrainedNumber);
    console.log("typeof constrainedNumber: " + typeof constrainedNumber);

    Number.method("integer", function () {
        return Math[this < 0 ? "ceil" : "floor"](this);
    });

    console.log("\n(-9 / 2).integer(): " + (-9 / 2).integer());

    /**
     * Returns a random Number within a range
     *
     * var randomNumber = Number().randomWithinRange(0, 10);
     * var randomBoolean = !!Number().randomWithinRange(0, 1);
     *
     * @param   {Number}    min             The minimum range Number
     * @param   {Number}    max             The maximum range Number
     * @param   {Boolean}   [round=true]    Round the return value.
     *
     * @return  {Number}    The random Number
     */
    Number.method("randomWithinRange", function () {
        return function randomWithinRange(min, max, round) {
            try {
                if (typeof min !== "number" || typeof max !== "number") {
                    throw new TypeError("randomWithinRange(...) requires Number args");
                }

                if (max < min) {
                    throw new RangeError("randomWithinRange(...) max should not be less than min");
                }

                if (max === min) {
                    return max;
                }

                round = (round === undefined) ? true : !!round;

                var value = Math.random() * (max - min) + min;
                return round ? Math.round(value) : value;

            } catch (e) {
                console.log(e.name + ": " + e.message);
                throw e; // rethrow to inform unit tests
            }
        };
    }());

    console.log("\nNumber().randomWithinRange(0, 10): " + Number().randomWithinRange(0, 10));

    randomBoolean = !!Number().randomWithinRange(0, 1);
    console.log("randomBoolean = !!Number().randomWithinRange(0, 1): " + randomBoolean);

}());

/**
 * Example: Some custom String utility methods added to the String prototype
 */

(function () {

    var rawString;

    /**
     * Returns an encoded String
     *
     * var raw = "<@{Hello&/World}£\\<>";
     * var encoded = raw.encodeEntities(); // "&lt;&#64;&#123;Hello&amp;&#47;World&#125;&#163;&#92;&lt;&gt;"
     *
     * @return  {String}    The encoded String
     */
    String.method("encodeEntities", function () {
        return function encodeEntities() {
            var regExp, value = this;
            regExp = /&/gi;
            value = value.replace(regExp, "&amp;");
            regExp = /</gi;
            value = value.replace(regExp, "&lt;");
            regExp = />/gi;
            value = value.replace(regExp, "&gt;");
            regExp = /\(/gi;
            value = value.replace(regExp, "&#40;");
            regExp = /\)/gi;
            value = value.replace(regExp, "&#41;");
            regExp = /\[/gi;
            value = value.replace(regExp, "&#91;");
            regExp = /\]/gi;
            value = value.replace(regExp, "&#93;");
            regExp = /\{/gi;
            value = value.replace(regExp, "&#123;");
            regExp = /\}/gi;
            value = value.replace(regExp, "&#125;");
            regExp = /"/gi;
            value = value.replace(regExp, "&quot;");
            regExp = /“/gi;
            value = value.replace(regExp, "&#8220;");
            regExp = /”/gi;
            value = value.replace(regExp, "&#8221;");
            regExp = /'/gi;
            value = value.replace(regExp, "&apos;");
            regExp = /‘/gi;
            value = value.replace(regExp, "&#8216;");
            regExp = /’/gi;
            value = value.replace(regExp, "&#8217;");
            regExp = /\//gi;
            value = value.replace(regExp, "&#47;");
            regExp = /\\/gi;
            value = value.replace(regExp, "&#92;");
            regExp = /£/gi;
            value = value.replace(regExp, "&#163;");
            regExp = /€/gi;
            value = value.replace(regExp, "&#8364;");
            regExp = /©/gi;
            value = value.replace(regExp, "&#169;");
            regExp = /®/gi;
            value = value.replace(regExp, "&#174;");
            regExp = /™/gi;
            value = value.replace(regExp, "&#8482;");
            regExp = /@/gi;
            value = value.replace(regExp, "&#64;");
            return value;
        };
    }());

    rawString = "<@{Hello&/World}£\\<>";
    console.log("\nrawString: " + rawString + ", encodedString: " + rawString.encodeEntities());

    /**
     * Returns a decoded String, matches against entity code, number and name
     *
     * var raw = "&lt;&#64;&#123;Hello&amp;&#47;World&#125;&#163;&#92;&lt;&gt;";
     * var decoded = raw.decodeEntities(); // "<@{Hello&/World}£\\<>"
     *
     * @return  {String}    The decoded String
     */
    String.method("decodeEntities", function () {
        return function decodeEntities() {
            var regExp, value = this;
            regExp = /(%26|&#38;|&amp;)/gi;
            value = value.replace(regExp, "&");
            regExp = /(%A0|&#160;|&nbsp;)/gi;
            value = value.replace(regExp, " ");
            regExp = /(%3C|&#60;|&lt;)/gi;
            value = value.replace(regExp, "<");
            regExp = /(%3E|&#62;|&gt;)/gi;
            value = value.replace(regExp, ">");
            regExp = /(%28|&#40;)/gi;
            value = value.replace(regExp, "(");
            regExp = /(%29|&#41;)/gi;
            value = value.replace(regExp, ")");
            regExp = /(%5B|&#91;)/gi;
            value = value.replace(regExp, "[");
            regExp = /(%5D|&#93;)/gi;
            value = value.replace(regExp, "]");
            regExp = /(%7B|&#123;)/gi;
            value = value.replace(regExp, "{");
            regExp = /(%7D|&#125;)/gi;
            value = value.replace(regExp, "}");
            regExp = /(%22|&#34;|&quot;)/gi;
            value = value.replace(regExp, "\"");
            regExp = /(%93|&#8220;|&ldquo;)/gi;
            value = value.replace(regExp, "“");
            regExp = /(%94|&#8221;|&rdquo;)/gi;
            value = value.replace(regExp, "”");
            regExp = /(%27|&#39;|&apos;)/gi;
            value = value.replace(regExp, "'");
            regExp = /(%91|&#8216;|&lsquo;)/gi;
            value = value.replace(regExp, "‘");
            regExp = /(%92|&#8217;|&rsquo;)/gi;
            value = value.replace(regExp, "’");
            regExp = /(%2F|&#47;|&frasl;)/gi;
            value = value.replace(regExp, "/");
            regExp = /(%5C|&#92;)/gi;
            value = value.replace(regExp, "\\");
            regExp = /(%A3|&#163;|&pound;)/gi;
            value = value.replace(regExp, "£");
            regExp = /(%80|&#8364;|&euro;)/gi;
            value = value.replace(regExp, "€");
            regExp = /(%A9|&#169;|&copy;)/gi;
            value = value.replace(regExp, "©");
            regExp = /(%AE|&#174;|&reg;)/gi;
            value = value.replace(regExp, "®");
            regExp = /(%99|&#8482;|&#153;|&trade;)/gi;
            value = value.replace(regExp, "™");
            regExp = /(%40|&#64;)/gi;
            value = value.replace(regExp, "@");
            return value;
        };
    }());

    rawString = "&lt;&#64;&#123;Hello&amp;&#47;World&#125;&#163;&#92;&lt;&gt;";
    console.log("\nrawString: " + rawString + ", decodedString: " + rawString.decodeEntities());

    /**
     * Trim whitespace
     *
     * var raw = "      hello world      ";
     * var trimmed = raw.trim(); // "hello world"
     *
     * @return  {String}    The trimmed String
     */
    String.method("trim", function () {
        return this.replace(/^\s+|\s+$/g, "");
    });

    rawString = "      hello world      ";
    console.log("\nrawString: " + rawString + ", trimmedString: " + rawString.trim());

    /**
     * Check if the String is empty
     *
     * "hello world".isEmpty() // false;
     * "".isEmpty() // true;
     * "   ".isEmpty() // true
     * "''".isEmpty() // false
     *
     * @return  {Boolean}
     */
    String.method("isEmpty", function () {
        return this === "" || this.trim() === "";
    });

    console.log('\n"".isEmpty(): ' + "".isEmpty());
    console.log('"   ".isEmpty(): ' + "   ".isEmpty());
    console.log('"  hello world  ".isEmpty(): ' + "  hello world  ".isEmpty());

    /**
     * Check if the String contains traces of common HTML/XML tags
     *
     * "Hello World".containsTags() // false
     * "Hello <strong>World</strong>".containsTags() // true
     * "Hello <span class='earth'>World</span>".containsTags() // true
     * 'Hello "> World'.containsTags() // true
     * "Hello &lt;p&gt;World&lt;&#47;p&gt;".containsTags() // true
     *
     * @return  {Boolean}
     */
    String.method("containsTags", function () {
        var searchTags = [
                "</",
                '/>',
                '">',
                "<span",
                "<p",
                "<br"
            ],
            searchTagCount = searchTags.length;
        return function containsTags() {
            var i, value, tag;
            if (!this.isEmpty()) {
                value = this.decodeEntities().toLowerCase();
                for (i = 0; i < searchTagCount; i += 1) {
                    tag = searchTags[i];
                    if (value.indexOf(tag) !== -1) {
                        return true;
                    }
                }
            }
            return false;
        };
    }());

    console.log('\n"Hello World".containsTags(): ' + "Hello World".containsTags());
    console.log('"Hello &lt;p&gt;World&lt;&#47;p&gt;".containsTags(): ' + "Hello &lt;p&gt;World&lt;&#47;p&gt;".containsTags());
    console.log('"Hello <span class=\"earth\">World</span>".containsTags(): ' + "Hello <span class=\"earth\">World</span>".containsTags());
    console.log('"Hello \"> World".containsTags(): ' + "Hello \"> World".containsTags());

}());

/**
 * Example: A custom Array utility method added to the Array prototype
 */

(function () {

    var someArray = [
        {data: 1},
        {data: 2},
        {data: 3},
        {data: 4},
        {data: 5}
    ];

    /**
     * Return an out of bounds index as if it wraps the Array length
     *
     * var someArray = [{data:0}, {data:1}, {data:2}, {data:3}, {data:4}];
     * var wrappedNegative = someArray.wrappedIndex(-3); // 2
     * var wrappedPositive = someArray.wrappedIndex(6); // 1
     *
     * @param   {Number}    index   Index to wrap
     *
     * @return  {Number}    The wrapped index
     */
    Array.method("wrappedIndex", function () {
        return function wrappedIndex(index) {
            try {
                if (typeof index !== "number") {
                    throw new TypeError("wrappedIndex(...) requires a Number arg");
                }

                return (index % this.length + this.length) % this.length;
            } catch (e) {
                console.log(e.name + ": " + e.message);
                throw e; // rethrow to inform unit tests
            }
        };
    }());

    console.log("\nsomeArray.length: " + someArray.length + ", someArray.wrappedIndex(6): " + someArray.wrappedIndex(6));

}());