let invalidChlorineLevels = require("../public/src/modules/invalidChlorineLevels");
let expect = require('chai').expect;
let assert = require('chai').assert;


describe('#invalidChlorineLevels()', function() {

    context("With string argument", function() {
        it("should return null", function() {
        assert.isNull( invalidChlorineLevels(""), "return null.")
        })
    })
  
    context("With null argument", function() {
        it("should return null", function() {
        assert.isNull( invalidChlorineLevels(), "return null.")
        })
    })

    context("With undefined arguments", function() {
        it("should return null", function() {
        assert.isNull( invalidChlorineLevels(undefined), "return null.")
        })
    })

    context("With number arguments", function() {
        it("should return null", function() {
        assert.isNull( invalidChlorineLevels(undefined), "return null.")
        })
    })

    context("With NaN arguments", function() {
        it("should return null", function() {
        assert.isNull( invalidChlorineLevels(NaN), "return null.")
        })
    })

    context("With object arguments", function() {
        it("should return number", function() {
        assert.isNotNaN( invalidChlorineLevels({"value": null, "timestamp": "2019-05-16T00:56:48-04:00"}), "return object.")
        })
    })

}) //end fo describe 