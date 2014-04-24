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

})();