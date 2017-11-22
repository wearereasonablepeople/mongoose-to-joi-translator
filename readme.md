# mongoose-to-joi-translator

This project aims at reducing the amount of work needed when validation is required for the database and another location, e.g. API. It also aims at unifying the way validation errors are handled. This is a proof of concept that works only on mongoose's validation.

### Prerequisites
 - node >= 7.6
 - npm >= 5

### Supported validations
Before investing more time on this, I want to make sure this is useful, if you think this library is useful, let me know and I'll support more validations.

All types:
- required
Strings:
- min
Arrays:
- element types

Deeply nested document validation is supported, i.e. Objects within Objects, Arrays within Objects etc.

### Testing

```
npm test
```

### Usage
```
const Joi = require('joi');
const joiSchema = getJoiSchema(new Schema({ word: { type: String } }));
const { error, value } = Joi.validate({ word: 'hello' }, joiSchema);
```