![Mongoose-to-joi-translator Logo](https://raw.github.com/wearereasonablepeople/mongoose-to-joi-translator/master/images/mtj.png)

# mongoose-to-joi-translator 
[![Build Status](https://travis-ci.org/wearereasonablepeople/mongoose-to-joi-translator.svg?branch=master)](https://travis-ci.org/wearereasonablepeople/mongoose-to-joi-translator)
[![codecov](https://codecov.io/gh/wearereasonablepeople/mongoose-to-joi-translator/branch/master/graph/badge.svg?token=i5p2uk2acI)](https://codecov.io/gh/wearereasonablepeople/mongoose-to-joi-translator)
[![dependencies Status](https://david-dm.org/wearereasonablepeople/mongoose-to-joi-translator/status.svg)](https://david-dm.org/wearereasonablepeople/mongoose-to-joi-translator)
[![devDependencies Status](https://david-dm.org/wearereasonablepeople/mongoose-to-joi-translator/dev-status.svg)](https://david-dm.org/wearereasonablepeople/mongoose-to-joi-translator?type=dev)

### Description
Translates Mongoose schema to Joi. You can use Joi schema to do the validation. The idea is to write database models once and validate everywhere.

### Installation
```
npm install mongoose-to-joi-translator
```

### Supported validations

 1. All types
    * required
    * valid (enum validation)
    * default
 2. Strings
    * min
 3. Arrays
    * items (element types)
 4. Numbers
    * min
    * max
 5. Objects
 6. Dates
 7. ObjectIDs
 8. Booleans
 9. Custom sync validators as documented [here](http://mongoosejs.com/docs/validation.html#custom-validators)

Deeply nested document validation is supported, i.e. Objects within Objects, Arrays within Objects etc.

### Testing

```
npm test
```

### Usage
```
// Require the library
const getJoiSchema = require('mongoose-to-joi-translator');
const schema = new Schema({ word: { type: String } });
const ModelName = mongoose.model('ModelName', schema);
// Extract schema
const joiSchema = getJoiSchema(ModelName);
// Use Joi to validate
const { error, value } = Joi.validate({ word: 'hello' }, joiSchema);
```
