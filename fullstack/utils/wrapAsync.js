function wrapAsync (fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next) // don't forget to pass next(err)
  }
}

module.exports = wrapAsync
