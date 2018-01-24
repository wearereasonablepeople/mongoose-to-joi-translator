'use strict';

const mongoose = require('mongoose');
const {Schema, Types: {ObjectId}} = mongoose;
const joiHelpers = require('../joiHelpers');
const Joi = require('joi');

// schema creator helper, it just removes the _id from the schema to make validation easier.
const sc = obj => new Schema(obj, {_id: false});

// integration test
describe('joiHelpers', () => {
  describe('#getJoiSchema', () => {
    /**
     * String
     */
    it('should validate string type', () => {
      const joiSchema = joiHelpers.getJoiSchema(new Schema({word: {type: String}}));
      delete joiSchema._id;
      expect(Joi.validate({word: 'hello'}, joiSchema).error).toBeNull();
      expect(Joi.validate({word: 123}, joiSchema).error).toBeTruthy();
    });
    it('should validate string.min', () => {
      const joiSchema = joiHelpers.getJoiSchema(new Schema({word: {type: String, min: 2}}));
      delete joiSchema._id;
      expect(Joi.validate({word: 'hello'}, joiSchema).error).toBeNull();
      expect(Joi.validate({word: 'h'}, joiSchema).error).toBeTruthy();
    });
    /**
     * Any
     */
    it('should validate any.required', () => {
      const joiSchema = joiHelpers.getJoiSchema(new Schema({word: {type: String, required: true}}));
      delete joiSchema._id;
      expect(Joi.validate({word: 'hello'}, joiSchema).error).toBeNull();
      expect(Joi.validate({ }, joiSchema).error).toBeTruthy();
    });
    /**
     * Arrays
     */
    it('should validate array type', () => {
      const joiSchema = joiHelpers.getJoiSchema(new Schema({words: []}));
      delete joiSchema._id;
      expect(Joi.validate({words: ['hello', 'world']}, joiSchema).error).toBeNull();
      expect(Joi.validate({words: 123}, joiSchema).error).toBeTruthy();
    });
    it('should validate arrays with specific type', () => {
      const joiSchema = joiHelpers.getJoiSchema(new Schema({words: [String]}));
      delete joiSchema._id;
      expect(Joi.validate({words: ['hello', 'world']}, joiSchema).error).toBeNull();
      expect(Joi.validate({words: [123, 'world']}, joiSchema).error).toBeTruthy();
    });
    /**
     * Embedded documents
     */
    it('should validate embedded documents', () => {
      const joiSchema = joiHelpers.getJoiSchema(
        sc({location: sc({latitude: String, longitude: String})}));
      expect(Joi.validate({location: {latitude: '123', longitude: '456'}}, joiSchema).error)
      .toBeNull();
      expect(Joi.validate({location: {latitude: '123', longitude: 456}}, joiSchema).error)
      .toBeTruthy();
    });
    it('should validate required embedded documents', () => {
      const joiSchema = joiHelpers.getJoiSchema(
        sc({location: {type: sc({latitude: String, longitude: String}), required: true}})
      );
      expect(Joi.validate({}, joiSchema).error).toBeTruthy();
      expect(Joi.validate({location: {}}, joiSchema).error).toBeNull();
    });
    it('should validate deeply nested documents', () => {
      const joiSchema = joiHelpers.getJoiSchema(
        sc({location: sc({latitude: String, longitude: String, customSch: sc({someAtt: String})})})
      );
      expect(Joi.validate({location: {latitude: '123', longitude: '456', customSch:
            {someAtt: 'hello'}}}, joiSchema).error).toBeNull();
      expect(Joi.validate({location: {latitude: '123', longitude: '123', customSch:
            {someAtt: 123}}}, joiSchema).error).toBeTruthy();
    });
    it('should validate arrays within nested documents', () => {
      const joiSchema = joiHelpers.getJoiSchema(
        sc({
          location: sc({latitude: String, longitude: String, customSch: sc({someAtt: [String]})})
        })
      );
      expect(Joi.validate({location: {latitude: '123', longitude: '456', customSch:
            {someAtt: ['hello']}}}, joiSchema).error).toBeNull();
      expect(Joi.validate({location: {latitude: '123', longitude: '123', customSch:
            {someAtt: 123}}}, joiSchema).error).toBeTruthy();
    });

    it('should validate arrays of documents', () => {
      const joiSchema = joiHelpers.getJoiSchema(new Schema({
        locations:
          [
            new Schema({latitude: String, longitude: String}, {_id: false})
          ]
      }));
      delete joiSchema._id;
      expect(Joi.validate({locations: [{latitude: '123', longitude: '456'}]}, joiSchema).error)
      .toBeNull();
      expect(Joi.validate({locations: [1]}, joiSchema).error).toBeTruthy();
    });
    it('should validate simple mongoose Model', () => {
      const schema = sc({location: sc({latitude: String, longitude: String})});
      const Model = mongoose.model('SomeModelName', schema);
      const joiSchema = joiHelpers.getJoiSchema(Model);
      expect(Joi.validate({location: {latitude: '123', longitude: '456'}}, joiSchema).error)
      .toBeNull();
      expect(Joi.validate({location: {latitude: '123', longitude: 456}}, joiSchema).error)
      .toBeTruthy();
    });
    it('should validate simple mongoose Model.schema (for backward compatibility)', () => {
      const schema = sc({location: sc({latitude: String, longitude: String})});
      const Model = mongoose.model('AnotherModelName', schema);
      const joiSchema = joiHelpers.getJoiSchema(Model.schema);
      expect(Joi.validate({location: {latitude: '123', longitude: '456'}}, joiSchema).error)
      .toBeNull();
      expect(Joi.validate({location: {latitude: '123', longitude: 456}}, joiSchema).error)
      .toBeTruthy();
    });
    /**
     * Number type
     */
    it('should validate number types', () => {
      const joiSchema = joiHelpers.getJoiSchema(new Schema({anything: Number}));
      delete joiSchema._id;
      expect(Joi.validate({anything: 123}, joiSchema).error).toBeNull();
      expect(Joi.validate({anything: 'hello'}, joiSchema).error).toBeTruthy();
    });
    it('should validate numbers using min and max validators', () => {
      const joiSchema = joiHelpers.getJoiSchema(new Schema(
        {anything: {type: Number, min: 0, max: 1}},
        {_id: false}
      ));
      expect(Joi.validate({anything: 0}, joiSchema).error).toBeNull();
      expect(Joi.validate({anything: 1}, joiSchema).error).toBeNull();
      expect(Joi.validate({anything: -1}, joiSchema).error).toBeTruthy();
      expect(Joi.validate({anything: 2}, joiSchema).error).toBeTruthy();
    });
    /**
     * Date type
     */
    it('should validate date types', () => {
      const joiSchema = joiHelpers.getJoiSchema(new Schema({anything: Date}));
      delete joiSchema._id;
      expect(Joi.validate({anything: new Date()}, joiSchema).error).toBeNull();
      expect(Joi.validate({anything: 'hi'}, joiSchema).error).toBeTruthy();
    });
    it('should validate ObjectId', () => {
      const joiSchema = joiHelpers.getJoiSchema(new Schema());
      expect(Joi.validate({_id: new ObjectId().toHexString()}, joiSchema).error).toBeNull();
      expect(Joi.validate({anything: 'hi'}, joiSchema).error).toBeTruthy();
    });
    it('should validate unknown types', () => {
      const joiSchema = joiHelpers.getJoiSchema(new Schema({anything: {type:
          Schema.Types.Mixed, required: true}}));
      delete joiSchema._id;
      expect(Joi.validate({anything: 'hello'}, joiSchema).error).toBeNull();
      expect(Joi.validate({anything: 123}, joiSchema).error).toBeNull();
      expect(Joi.validate({anything: undefined}, joiSchema).error).toBeTruthy();
    });
    it('should validate enums', () => {
      const joiSchema = joiHelpers.getJoiSchema(
        new Schema({color: {type: String, enum: ['white', 'black']}})
      );
      delete joiSchema._id;
      expect(Joi.validate({color: 'white'}, joiSchema).error).toBeNull();
      expect(Joi.validate({color: 'blue'}, joiSchema).error).toBeTruthy();
    });
    it('should validate using custom validators', () => {
      const joiSchema = joiHelpers.getJoiSchema(new Schema({
        phone: {
          type: String,
          validate: {
            validator: function(v) {
              return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message: 'is not a valid phone number!'
          },
          required: [true, 'User phone number required']
        }
      }));
      delete joiSchema._id;
      expect(Joi.validate({phone: '111-222-3333'}, joiSchema).error).toBeNull();
      expect(Joi.validate({phone: '111-222-3333'}, joiSchema).value.phone).toEqual('111-222-3333');
      expect(Joi.validate({phone: '111'}, joiSchema).error).toBeTruthy();
    });
    it('should handle defaults', () => {
      const joiSchema = joiHelpers.getJoiSchema(
        new Schema({color: {type: String, default: 'blue'}})
      );
      delete joiSchema._id;
      const {error, value} = Joi.validate({}, joiSchema);
      expect(error).toBeNull();
      expect(value).toEqual({color: 'blue'});
      expect(Joi.validate({color: ''}, joiSchema).error).toBeTruthy();
    });
    it('should apply default of falsy values', () => {
      const joiSchema = joiHelpers.getJoiSchema(
        new Schema({someBool: {type: Boolean, default: false}}, {_id: false})
      );
      expect(Joi.validate({someBool: true}, joiSchema).error).toBeNull();
      let {error, value} = Joi.validate({}, joiSchema);
      expect(error).toBeNull();
      expect(value).toEqual({someBool: false});

      ({error, value} = Joi.validate({someBool: undefined}, joiSchema));
      expect(error).toBeNull();
      expect(value).toEqual({someBool: false});
      // fails on values that are not boolean
      expect(Joi.validate({someBool: null}, joiSchema).error).toBeTruthy();
    });
  });
});
