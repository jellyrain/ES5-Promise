function Promise(executor) {

    this.PromiseState = 'pending'
    this.PromiseResult = null
    this.callbacks = []
    const self = this

    function resolve(data) {
        if (self.PromiseState !== 'pending') return
        self.PromiseState = 'fulfilled'
        self.PromiseResult = data
        setTimeout(() => {
            self.callbacks.forEach(item => {
                item.onResolved(data)
            })
        })
    }
    function reject(data) {
        if (self.PromiseState !== 'pending') return
        self.PromiseState = 'rejected'
        self.PromiseResult = data
        setTimeout(() => {
            self.callbacks.forEach(item => {
                item.onRejected(data)
            })
        })
    }

    try {
        executor(resolve, reject)
    } catch (error) {
        reject(error)
    }
}

Promise.prototype.then = function (onResolved, onRejected) {
    const self = this
    if (typeof onResolved !== 'function') {
        onResolved = res => res
    }

    if (typeof onRejected !== 'function') {
        onRejected = err => {
            throw err
        }
    }
    return new Promise((resolve, reject) => {
        function callback(type) {
            try {
                let result = type(self.PromiseResult)
                if (result instanceof Promise) {
                    result.then(res => {
                        resolve(res)
                    }, err => {
                        reject(err)
                    })
                } else {
                    resolve(result)
                }
            } catch (error) {
                reject(error)
            }
        }
        if (this.PromiseState === 'fulfilled') {
            setTimeout(() => {
                callback(onResolved)
            })
        }
        if (this.PromiseState === 'rejected') {
            setTimeout(() => {
                callback(onRejected)
            })
        }
        if (this.PromiseState === 'pending') {
            this.callbacks.push({
                onResolved() {
                    callback(onResolved)
                },
                onRejected() {
                    callback(onRejected)
                }

            })
        }
    })
}

Promise.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected)
}

Promise.resolve = function (value) {
    return new Promise((resolve, reject) => {
        if (value instanceof Promise) {
            value.then(res => {
                resolve(res)
            }, err => {
                reject(err)
            })
        } else {
            resolve(value)
        }
    })
}

Promise.reject = function (reason) {
    return new Promise((resolve, reject) => {
        reject(reason)
    })
}

Promise.all = function (promises) {
    return new Promise((resolve, reject) => {
        let arr = []
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(res => {
                arr[i] = res
                if (arr.length === promises.length) {
                    resolve(arr)
                }
            }, err => {
                reject(err)
            })
        }
    })
}

Promise.race = function (promises) {
    return new Promise((resolve, reject) => {
        promises.forEach(item => {
            item.then(res => {
                resolve(res)
            }, err => {
                reject(err)
            })
        })
    })
}

Promise.allSettled = function (promises) {
    return new Promise((resolve, reject) => {
        let arr = []
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(res => {
                arr[i] = {
                    status: 'fulfilled',
                    value: res
                }
                if (arr.length === promises.length) resolve(arr)
            }, err => {
                arr[i] = {
                    status: 'rejected',
                    reason: err
                }
                if (arr.length === promises.length) resolve(arr)
            })
        }
    })
}