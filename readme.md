![Mongoose-to-joi-translator Logo](https://raw.github.com/wearereasonablepeople/mongoose-to-joi-translator/master/images/mtj.png)

# mongoose-to-joi-translator 
[![Build Status](https://travis-ci.org/wearereasonablepeople/mongoose-to-joi-translator.svg?branch=master)](https://travis-ci.org/wearereasonablepeople/mongoose-to-joi-translator)
[![codecov](https://codecov.io/gh/wearereasonablepeople/mongoose-to-joi-translator/branch/master/graph/badge.svg?token=i5p2uk2acI)](https://codecov.io/gh/wearereasonablepeople/mongoose-to-joi-translator)

### Description
Translates Mongoose schema to Joi. You can use Joi schema to do the validation. The idea is to write database models once and validate everywhere.
You may use this package with [generic-joi-validator](https://github.com/wearereasonablepeople/generic-joi-validator).

### Installation
```
npm install mongoose-to-joi-translator
```

### Supported validations

 1. All types
    * required
    * valid (enum validation)
 2. Strings
    * min
 3. Arrays
    * items (element types)
 4. Numbers
 5. Objects
 6. Dates
 7. ObjectID

Deeply nested document validation is supported, i.e. Objects within Objects, Arrays within Objects etc.

### Testing

```
npm test
```

### Usage
```
// Require the library
const getJoiSchema = require('mongoose-to-joi-translator');
// Extract schema
const joiSchema = getJoiSchema(new Schema({ word: { type: String } }));
// Validate manually or use a package such as generic-joi-validator
const { error, value } = Joi.validate({ word: 'hello' }, joiSchema);
```
