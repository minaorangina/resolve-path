
var assert = require('assert')
var path = require('path')
var resolvePath = require('..')

var join = path.join
var normalize = path.normalize
var resolve = path.resolve

describe('resolvePath(relativePath)', function () {
  describe('arguments', function () {
    describe('relativePath', function () {
      it('should be required', function () {
        assert.throws(resolvePath.bind(null, undefined),
          /argument relativePath is required/)
      })

      it('should reject non-strings', function () {
        assert.throws(resolvePath.bind(null, 42),
          /argument relativePath must be a string/)
        assert.throws(resolvePath.bind(null, {}),
          /argument relativePath must be a string/)
        assert.throws(resolvePath.bind(null, []),
          /argument relativePath must be a string/)
      })

      it('should resolve relative to cwd', function () {
        assert.equal(normalize(resolvePath('index.js')),
          normalize(resolve('index.js')))
      })
    })
  })

  describe('when relativePath is absolute', function () {
    it('should throw Malicious Path error', function () {
      assert.throws(resolvePath.bind(null, __dirname),
        expectError(400, 'Malicious Path'))
    })
  })

  describe('when relativePath contains a NULL byte', function () {
    it('should throw Malicious Path error', function () {
      assert.throws(resolvePath.bind(null, 'hi\0there'),
        expectError(400, 'Malicious Path'))
    })
  })

  describe('when relativePath resolves outside cwd', function () {
    it('should throw Malicious Path error', function () {
      assert.throws(resolvePath.bind(null, '../index.js'),
        expectError(400, 'Malicious Path'))
    })
  })
})

describe('resolvePath(rootPath, relativePath)', function () {
  describe('arguments', function () {
    describe('rootPath', function () {
      it('should be required', function () {
        assert.throws(resolvePath.bind(null, undefined, 'index.js'),
          /argument rootPath is required/)
      })

      it('should reject non-strings', function () {
        assert.throws(resolvePath.bind(null, 42, 'index.js'),
          /argument rootPath must be a string/)
        assert.throws(resolvePath.bind(null, {}, 'index.js'),
          /argument rootPath must be a string/)
        assert.throws(resolvePath.bind(null, [], 'index.js'),
          /argument rootPath must be a string/)
      })

      it('should resolve relative to rootPath', function () {
        assert.equal(normalize(resolvePath(__dirname, 'index.js')),
          normalize(resolve(__dirname, 'index.js')))
      })

      it('should accept relative path', function () {
        assert.equal(normalize(resolvePath(join(__dirname, '..'), 'index.js')),
          normalize(resolve(join(__dirname, '..'), 'index.js')))
      })
    })

    describe('relativePath', function () {
      it('should be required', function () {
        assert.throws(resolvePath.bind(null, __dirname, undefined),
          /argument relativePath is required/)
      })

      it('should reject non-strings', function () {
        assert.throws(resolvePath.bind(null, __dirname, 42),
          /argument relativePath must be a string/)
        assert.throws(resolvePath.bind(null, __dirname, {}),
          /argument relativePath must be a string/)
        assert.throws(resolvePath.bind(null, __dirname, []),
          /argument relativePath must be a string/)
      })

      it('should resolve relative to rootPath', function () {
        assert.equal(normalize(resolvePath(__dirname, 'index.js')),
          normalize(resolve(__dirname, 'index.js')))
      })
    })
  })

  describe('when relativePath is absolute', function () {
    it('should throw Malicious Path error', function () {
      assert.throws(resolvePath.bind(null, __dirname, __dirname),
        expectError(400, 'Malicious Path'))
    })
  })

  describe('when relativePath contains a NULL byte', function () {
    it('should throw Malicious Path error', function () {
      assert.throws(resolvePath.bind(null, __dirname, 'hi\0there'),
        expectError(400, 'Malicious Path'))
    })
  })

  describe('when relativePath resolves outside cwd', function () {
    it('should throw Malicious Path error', function () {
      assert.throws(resolvePath.bind(null, __dirname, '../index.js'),
        expectError(400, 'Malicious Path'))
    })
  })
})

function expectError(status, message) {
  return function expected(actual) {
    return actual
      && actual.status === status
      && actual.message === message
  }
}
