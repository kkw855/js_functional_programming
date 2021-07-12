var Monad = (function Monad(ex) {
  function Maybe(value) {
    return Maybe.fromNullable(value);
  }
  Maybe.fromNullable = function(value) {
    return R.isNil(value) ? new Nothing() : new Just(value);
  }
  Maybe.prototype.nothing = function() {
    return new Nothing();
  }
  Maybe.prototype.just = function(value) {
    return new Just(value);
  }
  Maybe.prototype.isEmpty = function() {
    return this instanceof Nothing;
  }
  Maybe.prototype.get = function() {
    throw new TypeError("Maybe.get");
  }
  Maybe.prototype.map = function(f) {
    return this.isEmpty() ? this : this.just(f(this.get()));
  }

  function Just(value) {
    this.value = value;
  }
  Just.prototype = Object.create(Maybe.prototype);
  Just.prototype.get = function() {
    return this.value;
  }

  function Nothing() {}
  Nothing.prototype = Object.create(Maybe.prototype);
  Nothing.prototype.get = function() {
    throw new TypeError("Nothing.get");
  }

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
  }

  return ex;
}(Common || {}))
