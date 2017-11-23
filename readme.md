# mongoose-to-joi-translator [![Build Status](https://travis-ci.com/wearereasonablepeople/mongoose-to-joi-translator.svg?token=yQTBKvDF8NXw5WvCpzqf&branch=master)](https://travis-ci.com/wearereasonablepeople/mongoose-to-joi-translator)

> This project aims at reducing the amount of work needed when validation is required for the database and another location, e.g. API. It also aims at unifying the way validation errors are handled. This is a proof of concept that works only on mongoose's validation.

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

### Usage when combined with Joi-API

```
const catSchema = new mongoose.Schema({
    name: String,
    location: new mongoose.Schema({ latitude: String, longitude: String }),
    token: String
})

...
router.post('/:id',  bodyData('name location.latitude location.longitude'), paramData('id'), allData('token'), async (ctx) => {
    // ctx.bodyData = a validated object { name, location: { latitude, longitude } }
    // ctx.allData = a validated object containing all the request data sent via params, query, or body
});
```