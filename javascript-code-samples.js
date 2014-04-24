/*jslint browser: true, devel: true, debug: true */

(function () {
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

    (function () {

        var casualPerson, professionalPerson, someGuy, someProfessional;

        /**
         * Creates a casual person Object
         *
         * @param   {Object}    spec     The spec containing the values to use
         *
         * @return  {Object}
         */
        casualPerson = function (spec) {
            spec.male = (spec.male === undefined) ? true : !!spec.male;
            var that = {};
            that.getName = function () {
                return spec.firstName || "";
            };
            that.getEmail = function () {
                return spec.email || "";
            };
            that.getGender = function () {
                return spec.male;
            };
            that.toString = function () {
                return "\n\t" + that.getName() + "\n\t" + that.getEmail();
            };
            return that;
        };

        /**
         * Creates a professional person Object
         *
         * @param   {Object}    spec     The spec containing the values to use
         *
         * @return  {Object}
         */
        professionalPerson = function (spec) {
            var that = casualPerson(spec),
                superGetName = that.superior("getName");
            that.getName = function () {
                return that.getTitle() + superGetName() + " " + spec.lastName;
            };
            that.getTitle = function () {
                return that.getGender() ? "Mr. " : "Miss. ";
            };
            that.getCompany = function () {
                return spec.company || "";
            };
            that.toString = function () {
                return "\n\t" + that.getName() + "\n\t" + that.getEmail() + "\n\t" + that.getCompany();
            };
            return that;
        };

        someGuy = casualPerson({
            firstName: "Derek",
            email: "derek@derekdonnelly.com"
        });

        someProfessional = professionalPerson({
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
                        throw {
                            name: "TypeError",
                            message: "constrainToRange(...) requires Number args"
                        };
                    }

                    if (this >= min) {
                        return (this <= max) ? this.valueOf() : max;
                    }
                    return min;
                } catch (e) {
                    console.log(e.name + ": " + e.message);
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
         * var randomNumber = Number().randomWithinRange(0, 10)
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
                        throw {
                            name: "TypeError",
                            message: "randomWithinRange(...) requires Number args"
                        };
                    }

                    if (max < min) {
                        throw {
                            name: "TypeError",
                            message: "randomWithinRange(...) max should not be less than min"
                        };
                    }

                    if (max === min) {
                        return max;
                    }

                    round = (round === undefined) ? true : !!round;

                    var value = Math.random() * (max - min) + min;
                    return round ? Math.round(value) : value;

                } catch (e) {
                    console.log(e.name + ": " + e.message);
                }
            };
        }());

        console.log("\nNumber().randomWithinRange(0, 10): " + Number().randomWithinRange(0, 10));

        randomBoolean = !!Number().randomWithinRange(0, 1);
        console.log("randomBoolean = !!Number().randomWithinRange(0, 1): " + randomBoolean);

    }());

})();