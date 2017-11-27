# mongoose-to-joi-translator [![Build Status](https://travis-ci.com/wearereasonablepeople/mongoose-to-joi-translator.svg?token=yQTBKvDF8NXw5WvCpzqf&branch=master)](https://travis-ci.com/wearereasonablepeople/mongoose-to-joi-translator) [![codecov](https://codecov.io/gh/wearereasonablepeople/mongoose-to-joi-translator/branch/master/graph/badge.svg?token=i5p2uk2acI)](https://codecov.io/gh/wearereasonablepeople/mongoose-to-joi-translator)
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
const getJoiSchema = require('mongoose-to-joi-translator');
const joiSchema = getJoiSchema(new Schema({ word: { type: String } }));
const { error, value } = Joi.validate({ word: 'hello' }, joiSchema);
```

### Usage when combined with generic-joi-validator
[generic-joi-validator](https://github.com/Amri91/generic-joi-validator)
```
const { JoiValidator } = require('generic-joi-validator');
const joiValidator = new JoiValidator();

// Use a translator to extract Joi schema from your database
const mongoose = require('mongoose');
const { Schema } = mongoose;
const getJoiSchema = require('mongoose-to-joi-translator');
joiValidator.schemata.stores = getJoiSchema(new Schema({
    name: {
        type: String,
        required: true
    },
    location: new Schema({
        latitude: {
            type: String,
            required: true
        },
        longitude: {
            type: String,
            required: true
        }
    })
}));


// or add your schema manually
joiValidator.schemata.stores = {
    name: Joi.string().required(),
    location: {
        latitude: Joi.string().required(),
        longitude: Joi.string().required()
    }
};

// With koa
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');

const router = new Router();
const app = new Koa();

app.use(bodyParser());

const koaValidator = async (ctx, next) => {
    const { error, value } = joiValidator.prepare(ctx.url.substr(ctx.url.lastIndexOf('/') + 1), ctx.request.body);
    ctx.assert(!error, 400, value);
    ctx.state.data = value;
    return next();
};

router.post(
    '/stores',
    koaValidator,
    async (ctx, next) => {
        ctx.body = ctx.state.data;
        return next();
    }
);

app.use(router.allowedMethods({ throw: true }));
app.use(router.routes());

app.listen(3000);
```