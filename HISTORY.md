1.2.2 / 2015-02-16
==================

  * deps: http-errors@~1.3.1
    - Construct errors using defined constructors from `createError`
    - Fix error names that are not identifiers
    - Set a meaningful `name` property on constructed errors

1.2.1 / 2015-01-19
==================

  * Fix root path disclosure

1.2.0 / 2015-01-05
==================

  * Change error to 403 Forbidden when outside root
  * Fix argument type errors to be consistent
  * Fix path traversal vulnerability
  * Use `http-errors` module directly

1.1.0 / 2014-12-27
==================

  * Resolve the root path argument
  * Use `http-assert` module

1.0.0 / 2014-03-23
==================

  * Initial release
