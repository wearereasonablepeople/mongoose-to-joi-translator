const { Schema } = require('mongoose');
const { Types: { Mixed } } = Schema;
const joiHelpers = require('../joiHelpers');
const Joi = require('joi');

// integration test
describe('joiHelpers', () => {
    describe('#getJoiSchema', () => {
        it('should validate string type', () => {
            const joiSchema = joiHelpers.getJoiSchema(new Schema({ word: { type: String } }));
            expect(Joi.validate({ word: 'hello' }, joiSchema).error).toBeNull();
            expect(Joi.validate({ word: 123 }, joiSchema).error).toBeTruthy();
        });
        it('should validate string.min', () => {
            const joiSchema = joiHelpers.getJoiSchema(new Schema({ word: { type: String, min: 2 } }));
            expect(Joi.validate({ word: 'hello' }, joiSchema).error).toBeNull();
            expect(Joi.validate({ word: 'h' }, joiSchema).error).toBeTruthy();
        });
        it('should validate any.required', () => {
            const joiSchema = joiHelpers.getJoiSchema(new Schema({ word: { type: String, required: true } }));
            expect(Joi.validate({ word: 'hello' }, joiSchema).error).toBeNull();
            expect(Joi.validate({ }, joiSchema).error).toBeTruthy();
        });
        it('should validate array type', () => {
            const joiSchema = joiHelpers.getJoiSchema(new Schema({ words: [] }));
            expect(Joi.validate({ words: ['hello', 'world']}, joiSchema).error).toBeNull();
            expect(Joi.validate({ words: 123 }, joiSchema).error).toBeTruthy();
        });
        it('should validate arrays with specific type', () => {
            const joiSchema = joiHelpers.getJoiSchema(new Schema({ words: [String] }));
            expect(Joi.validate({ words: ['hello', 'world']}, joiSchema).error).toBeNull();
            expect(Joi.validate({ words: [123, 'world']}, joiSchema).error).toBeTruthy();
        });
        it('should validate embedded documents', () => {
            const joiSchema = joiHelpers.getJoiSchema(new Schema({ location: new Schema({ latitude: String, longitude: String }) }));
            expect(Joi.validate({ location: { latitude: '123', longitude: '456' } }, joiSchema).error).toBeNull();
            expect(Joi.validate({ location: { latitude: '123', longitude: 456 } }, joiSchema).error).toBeTruthy();
        });
        it('should validate unknown types', () => {
            const joiSchema = joiHelpers.getJoiSchema(new Schema({ anything: { type: Mixed, required: true } }));
            expect(Joi.validate({ anything: 'hello' }, joiSchema).error).toBeNull();
            expect(Joi.validate({ anything: 123 }, joiSchema).error).toBeNull();
            expect(Joi.validate({ anything: undefined }, joiSchema).error).toBeTruthy();
        });
    })
});