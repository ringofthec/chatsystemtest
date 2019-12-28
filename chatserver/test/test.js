import test from 'ava';
var wordfilter = require("../lib/util/filterword");

ava.test("word filter", t => {
    t.is(wordfilter.scan.replace("dfdfuckdfdf"), "dfd****dfdf");
});