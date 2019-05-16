let pmt = require("../functions/pmt");
let expect = require('chai').expect;
let assert = require('chai').assert;


describe('#pmt()', function() {

    context("With argument as an empty string", function() {
        it("should return an object", function() {
        assert.isObject( pmt(""), "it returns an Object")
        })
    })
  
    context("With empty arguments", function() {
        it("returns undefined timestamp", function() {
        assert(pmt().timestamp === "");
        })
    })

    context("With null argument", function() {
        it("returns null timestamp", function() {
        assert(pmt(null).timestamp === "");
        })
    })

    context("With arguments that are numbers", function() {
        it("returns null timestamp", function() {
        assert(pmt(33).timestamp === "");
        })
    })
    
    context("With arguments that are numbers", function() {
        it("returns null timestamp", function() {
        assert(pmt("33").timestamp === "");
        })
    })
    
    /*
    it('should return argument when only one argument is passed', function() {
      expect(sum(5)).to.equal(5)
    })
  })
  
  context('with non-number arguments', function() {
    it('should throw error', function() {
      expect(function() {
        sum(1, 2, '3', [4], 5)
      }).to.throw(TypeError, 'sum() expects only numbers.')
    })
  })
  */
  
}) //end fo describe 