const vstore = require('../src/index.js');

describe('vstore.create', function () {

  it('should allow the creation of a new store', function () {
    var store = vstore.create({ foo: 'bar' });

    expect(store).not.toEqual(undefined);
  });

});

describe('vstore.get', function () {

  it('should get key', function () {
    var store = vstore.create({ foo: 'bar' });

    expect(store.get('foo')).toEqual('bar');
  });

  it('should get nested key', function () {
    var store = vstore.create({ foo: { bar: 'baz' } });

    expect(store.get('foo.bar')).toEqual('baz');
  });

  it('should get full current state when passed no arguments', function () {
    var state = { foo: 'bar' };
    var store = vstore.create(state);

    expect(store.get()).toEqual(state);
  });

  it('should not allow an object in store to be mutated by reference', function () {
    var store = vstore.create({ foo: { bar: 'baz' } });
    var val = store.get('foo');

    val.bar = 'qux';

    expect(store.get('foo.bar')).toEqual('baz');
  });

  it('should not allow an array in store to be mutated by reference', function () {
    var store = vstore.create({ ids: [3, 4, 2, 1] });
    var val = store.get('ids');

    val.sort();

    expect(store.get('ids')).toEqual([3, 4, 2, 1]);
  });
});

describe('vstore.set', function () {

  it('should set key', function () {
    var store = vstore.create({ foo: 'bar' });

    store.set('foo', 'baz');

    expect(store.get('foo')).toEqual('baz');
  });

  it('should set nested key', function () {
    var store = vstore.create({ foo: { bar: 'baz' } });

    store.set('foo.bar', 'qux');

    expect(store.get('foo.bar')).toEqual('qux');
  });

  it('should get full updated state when passed no arguments', function () {
    var state = { foo: 'bar' };
    var store = vstore.create(state);

    store.set('foo', 'baz');

    expect(store.get()).not.toEqual(state);
  });
});

describe('vstore.subscribe', function () {
  var counter = 0;
  var counterIncrement = function () { counter = counter+1; };
  var TIMEOUT_WAIT = 1;

  beforeEach(function () {
    counter = 0;
  });

  it('should subscribe to all changes when only passing in a callback', function (done) {
    var store = vstore.create({ foo: 'bar', items: 2 });

    store.subscribe(counterIncrement);
    store.set('foo', 'baz');
    store.set('items', 42);

    setTimeout(function () {
      expect(counter).toEqual(2);
      done();
    }, TIMEOUT_WAIT);
  });

  it('should subscribe to key', function (done) {
    var store = vstore.create({ foo: 'bar' });

    store.subscribe('foo', counterIncrement);
    store.set('foo', 'baz');

    setTimeout(function () {
      expect(counter).toEqual(1);
      done();
    }, TIMEOUT_WAIT);
  });

  it('should return the current store instance as the first argument in a callback', function (done) {
    var store = vstore.create({ foo: 'bar' });
    var result;

    store.subscribe('foo', function (res) { result = res; });
    store.set('foo', 'baz');

    setTimeout(function () {
      expect(result).toEqual(store);
      done();
    }, TIMEOUT_WAIT);
  });

  it('should return the current store state as the second argument in a callback', function (done) {
    var store = vstore.create({ foo: 'bar' });
    var result;

    store.subscribe('foo', function (_, res) { result = res; });
    store.set('foo', 'baz');

    setTimeout(function () {
      expect(result).toEqual(store.get());
      done();
    }, TIMEOUT_WAIT);
  });
});