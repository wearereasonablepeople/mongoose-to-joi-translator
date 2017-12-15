'use strict';

const {Schema, Types: {ObjectId}} = require('mongoose');
const joiHelpers = require('../joiHelpers');
const Joi = require('joi');

// integration test
describe('joiHelpers', () => {
  describe('#getJoiSchema', () => {
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
    it('should validate any.required', () => {
      const joiSchema = joiHelpers.getJoiSchema(new Schema({word: {type: String, required: true}}));
      delete joiSchema._id;
      expect(Joi.validate({word: 'hello'}, joiSchema).error).toBeNull();
      expect(Joi.validate({ }, joiSchema).error).toBeTruthy();
    });
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
    it('should validate embedded documents', () => {
      const joiSchema = joiHelpers.getJoiSchema(new Schema({location:
          new Schema({latitude: String, longitude: String})}));
      delete joiSchema._id;
      delete joiSchema.location._id;
      expect(Joi.validate({location: {latitude: '123', longitude: '456'}}, joiSchema).error)
      .toBeNull();
      expect(Joi.validate({location: {latitude: '123', longitude: 456}}, joiSchema).error)
      .toBeTruthy();
    });
    it('should validate deeply nested documents', () => {
      const joiSchema = joiHelpers.getJoiSchema(new Schema({location:
          new Schema({latitude: String, longitude: String, customSch:
              new Schema({someAtt: String})})}));
      delete joiSchema._id;
      delete joiSchema.location._id;
      delete joiSchema.location.customSch._id;
      expect(Joi.validate({location: {latitude: '123', longitude: '456', customSch:
            {someAtt: 'hello'}}}, joiSchema).error).toBeNull();
      expect(Joi.validate({location: {latitude: '123', longitude: '123', customSch:
            {someAtt: 123}}}, joiSchema).error).toBeTruthy();
    });
    it('should validate arrays within nested documents', () => {
      const joiSchema = joiHelpers.getJoiSchema(new Schema({location:
          new Schema({latitude: String, longitude: String, customSch:
              new Schema({someAtt: [String]})})}));
      delete joiSchema._id;
      delete joiSchema.location._id;
      delete joiSchema.location.customSch._id;
      expect(Joi.validate({location: {latitude: '123', longitude: '456', customSch:
            {someAtt: ['hello']}}}, joiSchema).error).toBeNull();
      expect(Joi.validate({location: {latitude: '123', longitude: '123', customSch:
            {someAtt: 123}}}, joiSchema).error).toBeTruthy();
    });
    it('should validate number types', () => {
      const joiSchema = joiHelpers.getJoiSchema(new Schema({anything: Number}));
      delete joiSchema._id;
      expect(Joi.validate({anything: 123}, joiSchema).error).toBeNull();
      expect(Joi.validate({anything: 'hello'}, joiSchema).error).toBeTruthy();
    });
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
      expect(Joi.validate({phone: '111'}, joiSchema).error).toBeTruthy();
    });
  });
});
