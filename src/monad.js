var Monad = (function Monad(ex) {
  function Option(value) {
    return Option.fromNullable(value);
  }
  Option.fromNullable = function(value) {
    return value === null || value === undefined ? new None() : new Some(value);
  }
  Option.prototype.none = function() {
    return new None();
  }
  Option.prototype.some = function(value) {
    return new Some(value);
  }
  Option.prototype.isEmpty = function() {
    return this instanceof None;
  }
  Option.prototype.get = function() {
    throw new TypeError("Option.get");
  }
  Option.prototype.map = function(f) {
    return this.isEmpty() ? this.none() : this.some(f(this.get()));
  }

  function Some(value) {
    this.value = value;
  }
  Some.prototype = Object.create(Option.prototype);
  Some.prototype.get = function() {
    return this.value;
  }

  function None() {}
  None.prototype = Object.create(Option.prototype);
  None.prototype.get = function() {
    throw new TypeError("None.get");
  }

  ex.Option = Option;
  ex.Some = Some;
  ex.None = None;

  function Either() {

  }
  Either.fromNullable = function(value) {
    return value === null || value === undefined ? new Left(value) : new Some(value);
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
