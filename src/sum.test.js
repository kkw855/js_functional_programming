"use strict";

const lib = require("./monad");

const C = lib.Common;

test('첫 글자를 대문자로', () => {
  expect(C.upperFirst("fred")).toBe("Fred");
  expect(C.upperFirst("fRED")).toBe("FRED");
});

test('Query String URL', () => {
  expect(C.buildQueryStringURL("https://www.example.com", {
    a: 3.14,
    b: "abc",
    c: 'c'
  })).toBe("https://www.example.com?a=3.14&b=abc&c=c");
});
