"use restrict";

const R = require("ramda");

var Monad = (function Monad(ex) {
  function Maybe(value) {
    this.value = value;
    throw new TypeError("Must use Just or Nothing.");
  }
  Maybe.fromNullable = function(value) {
    return R.isNil(value) ? new Nothing() : new Just(value);
  };
  Maybe.lift = R.curry(function (f, value) {
    return Maybe.fromNullable(value).map(f);
  });
  Maybe.just = function (value) {
    return new Just(value);
  };
  Maybe.nothing = function () {
    return new Nothing();
  }
  Maybe.prototype.isEmpty = function() {
    return this instanceof Nothing;
  };
  // Maybe.prototype.get = function() {
  //   return this.isEmpty() ?
  //     throw new TypeError("Maybe.get") :
  //     this.value;
  // };
  Maybe.prototype.isNothing = function () {
    return this.isEmpty();
  }
  Maybe.prototype.isJust = function () {
    return !this.isEmpty();
  }
  Maybe.prototype.map = function(f) {
    return this.isEmpty() ?
      Maybe.nothing() :
      Maybe.fromNullable(f(this.value));
  };

  function Just(value) {
    this.value = value;
  }
  Just.prototype = Object.create(Maybe.prototype);
  Just.prototype.map = function(f) {
    return Maybe.fromNullable(f(this.value));
  };
  Just.prototype.getOrElse = function() {
    return this.value;
  };
  Just.prototype.filter = function(f) {
    return Maybe.fromNullable(f(this.value) ?
      this.value :
      null
    );
  };
  Just.prototype.chain = function(f) {
    return f(this.value);
  };
  Just.prototype.toString = function() {
    return "Maybe.Just(" + this.value + ")";
  };

  function Nothing() {}
  Nothing.prototype = Object.create(Maybe.prototype);
  Nothing.prototype.map = function() {
    return this;
  };
  Nothing.prototype.getOrElse = function(other) {
    return other;
  };
  Nothing.prototype.filter = function() {
    return this;
  };
  Nothing.prototype.chain = function() {
    return this;
  };
  Nothing.prototype.toString = function() {
    return "Maybe.Nothing";
  };

  ex.Maybe = Maybe;
  ex.Just = Just;
  ex.Nothing = Nothing;

  function Either() {

  }
  Either.fromNullable = function(value) {
    return value === null || value === undefined ? new Left(value) : new Just(value);
  }
  Either.left = function(a) {
    return new Left(a);
  }
  Either.right = function(b) {
    return new Right(b);
  }
  Either.prototype.get = function() {
    throw new TypeError("Either.get");
  }
  Either.prototype.map = function(fb) {
    return this instanceof Left ? this : new Right(fb(this.get()));
  }

  function Left(a) {
    this.a = a;
  }
  Left.prototype = Object.create(Either.prototype);
  Left.prototype.get = function() {
    return this.a;
  }

  function Right(b) {
    this.b = b;
  }
  Right.prototype = Object.create(Either.prototype);
  Right.prototype.get = function() {
    return this.b;
  }

  ex.Either = Either;

  function IO(effect) {
    if (typeof effect !== "function") {
      throw TypeError("effect is not a function");
    }

    this.effect = effect;
  }
  IO.from = function(fn) {
    return new IO(fn);
  }
  IO.prototype.map = function(fn) {
    const self = this;
    return new IO(function() {
      fn(self.effect());
    });
  }
  IO.prototype.run = function() {
    return this.effect();
  }

  ex.IO = IO;

  return ex;
}(Monad || {}))

var Common = (function Common(ex) {
  const Maybe = Monad.Maybe;

  ex.safeQuerySelector = function (query) {
    return Maybe.fromNullable(document.querySelector(query));
  };

  ex.upperFirst = function (str) {
    return R.toUpper(R.head(str)) + R.tail(str);
  };

  ex.buildQueryString = function (domain, query) {
    const queryString = objToString("=", "&")(query);
    return domain + "?" + queryString;
  };

  const objToString = R.curry(function (pair, separator, obj) {
    return R.pipe(
      R.zipWith(function (key, value) {
        return key + pair + value
      }),
      R.join(separator)
    )(R.keys(obj), R.values(obj));
  });

  return ex;
}(Common || {}))

exports.Monad = Monad;
exports.Common = Common;
