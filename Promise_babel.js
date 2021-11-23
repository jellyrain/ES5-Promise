"use strict";

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

function Promise(executor) {
  this.PromiseState = 'pending';
  this.PromiseResult = null;
  this.callbacks = [];
  var self = this;

  function resolve(data) {
    var _this = this;

    if (self.PromiseState !== 'pending') return;
    self.PromiseState = 'fulfilled';
    self.PromiseResult = data;
    setTimeout(function () {
      var _this2 = this;

      _newArrowCheck(this, _this);

      self.callbacks.forEach(function (item) {
        _newArrowCheck(this, _this2);

        item.onResolved(data);
      }.bind(this));
    }.bind(this));
  }

  function reject(data) {
    var _this3 = this;

    if (self.PromiseState !== 'pending') return;
    self.PromiseState = 'rejected';
    self.PromiseResult = data;
    setTimeout(function () {
      var _this4 = this;

      _newArrowCheck(this, _this3);

      self.callbacks.forEach(function (item) {
        _newArrowCheck(this, _this4);

        item.onRejected(data);
      }.bind(this));
    }.bind(this));
  }

  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

Promise.prototype.then = function (_onResolved, _onRejected) {
  var _this5 = this;

  var self = this;

  if (typeof _onResolved !== 'function') {
    _onResolved = function onResolved(res) {
      _newArrowCheck(this, _this5);

      return res;
    }.bind(this);
  }

  if (typeof _onRejected !== 'function') {
    _onRejected = function onRejected(err) {
      _newArrowCheck(this, _this5);

      throw err;
    }.bind(this);
  }

  return new Promise(function (resolve, reject) {
    var _this7 = this;

    _newArrowCheck(this, _this5);

    function callback(type) {
      var _this6 = this;

      try {
        var result = type(self.PromiseResult);

        if (result instanceof Promise) {
          result.then(function (res) {
            _newArrowCheck(this, _this6);

            resolve(res);
          }.bind(this), function (err) {
            _newArrowCheck(this, _this6);

            reject(err);
          }.bind(this));
        } else {
          resolve(result);
        }
      } catch (error) {
        reject(error);
      }
    }

    if (this.PromiseState === 'fulfilled') {
      setTimeout(function () {
        _newArrowCheck(this, _this7);

        callback(_onResolved);
      }.bind(this));
    }

    if (this.PromiseState === 'rejected') {
      setTimeout(function () {
        _newArrowCheck(this, _this7);

        callback(_onRejected);
      }.bind(this));
    }

    if (this.PromiseState === 'pending') {
      this.callbacks.push({
        onResolved: function onResolved() {
          callback(_onResolved);
        },
        onRejected: function onRejected() {
          callback(_onRejected);
        }
      });
    }
  }.bind(this));
};

Promise.prototype["catch"] = function (onRejected) {
  return this.then(undefined, onRejected);
};

Promise.resolve = function (value) {
  var _this8 = this;

  return new Promise(function (resolve, reject) {
    var _this9 = this;

    _newArrowCheck(this, _this8);

    if (value instanceof Promise) {
      value.then(function (res) {
        _newArrowCheck(this, _this9);

        resolve(res);
      }.bind(this), function (err) {
        _newArrowCheck(this, _this9);

        reject(err);
      }.bind(this));
    } else {
      resolve(value);
    }
  }.bind(this));
};

Promise.reject = function (reason) {
  var _this10 = this;

  return new Promise(function (resolve, reject) {
    _newArrowCheck(this, _this10);

    reject(reason);
  }.bind(this));
};

Promise.all = function (promises) {
  var _this11 = this;

  return new Promise(function (resolve, reject) {
    _newArrowCheck(this, _this11);

    var arr = [];

    var _loop = function _loop(i) {
      var _this12 = this;

      promises[i].then(function (res) {
        _newArrowCheck(this, _this12);

        arr[i] = res;

        if (arr.length === promises.length) {
          resolve(arr);
        }
      }.bind(this), function (err) {
        _newArrowCheck(this, _this12);

        reject(err);
      }.bind(this));
    };

    for (var i = 0; i < promises.length; i++) {
      _loop(i);
    }
  }.bind(this));
};

Promise.race = function (promises) {
  var _this13 = this;

  return new Promise(function (resolve, reject) {
    var _this14 = this;

    _newArrowCheck(this, _this13);

    promises.forEach(function (item) {
      var _this15 = this;

      _newArrowCheck(this, _this14);

      item.then(function (res) {
        _newArrowCheck(this, _this15);

        resolve(res);
      }.bind(this), function (err) {
        _newArrowCheck(this, _this15);

        reject(err);
      }.bind(this));
    }.bind(this));
  }.bind(this));
};

Promise.allSettled = function (promises) {
  var _this16 = this;

  return new Promise(function (resolve, reject) {
    _newArrowCheck(this, _this16);

    var arr = [];

    var _loop2 = function _loop2(i) {
      var _this17 = this;

      promises[i].then(function (res) {
        _newArrowCheck(this, _this17);

        arr[i] = {
          status: 'fulfilled',
          value: res
        };
        if (arr.length === promises.length) resolve(arr);
      }.bind(this), function (err) {
        _newArrowCheck(this, _this17);

        arr[i] = {
          status: 'rejected',
          reason: err
        };
        if (arr.length === promises.length) resolve(arr);
      }.bind(this));
    };

    for (var i = 0; i < promises.length; i++) {
      _loop2(i);
    }
  }.bind(this));
};