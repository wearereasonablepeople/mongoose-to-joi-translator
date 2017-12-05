/* eslint-disable no-use-before-define */

'use strict';

const Joi = require('joi');

/**
 * contains base options to be used for all types included unknown ones
 */
class AnyHandler {
  constructor(objectDetails, baseJoiObj) {
    this.objectDetails = objectDetails;
    this.joiObj = baseJoiObj || Joi.any();
    this.handlers = [this.required, this.valid];
  }

  /**
   * calls all functions in a handler for a specific type
   */
  handle() {
    this.handlers.forEach(func => func.call(this));
  }

  /**
   * Adds a check for the existence of an attribute
   */
  required() {
    if(this.objectDetails.isRequired) {this.joiObj = this.joiObj.required();}
  }
  /**
   * Adds a check for enums
   */
  valid() {
    if(this.objectDetails.options.enum) {
      this.joiObj = this.joiObj.valid(this.objectDetails.options.enum);
    }
  }
}

/**
 * contains String options
 */
class StringHandler extends AnyHandler {
  constructor(objectDetails, baseJoiObject) {
    super(objectDetails, baseJoiObject || Joi.string());
    this.handlers = this.handlers.concat([this.min]);
  }

  /**
   * Adds a check for string minimum characters, does not support array type of min option yet
   */
  min() {
    if(this.objectDetails.options.min) {
      // eslint-disable-next-line no-warning-comments
      // todo: support array type of min
      this.joiObj = this.joiObj.min(this.objectDetails.options.min);
    }
  }
}

/**
 * contains Number options
 */
class NumberHandlers extends AnyHandler {
  constructor(objectDetails, baseJoiObject) {
    super(objectDetails, baseJoiObject || Joi.number());
  }
}

/**
 * contains Date options
 */
class DateHandlers extends AnyHandler {
  constructor(objectDetails, baseJoiObject) {
    super(objectDetails, baseJoiObject || Joi.date());
  }
}

/**
 * contains Array options
 */
class ArrayHandlers extends AnyHandler {
  constructor(objectDetails, baseJoiObject) {
    super(objectDetails, baseJoiObject || Joi.array());
    this.handlers = this.handlers.concat([this.items]);
  }
  /**
   * Adds a check for array element types
   */
  items() {
    this.joiObj = this.joiObj.items(director(this.objectDetails.caster));
  }
}

/**
 * finds and calls the appropriate next function
 * @param {Object} objectDetails
 * @param {String} [objectDetails.instance] contains the type of the object
 * @param {Object} [objectDetails.schema] contains the full mongoose embedded schema
 */
// eslint-disable-next-line func-style
function director(objectDetails) {
  let handler;

  switch(objectDetails.instance) {
    case 'String':
      handler = new StringHandler(objectDetails);
      break;
    case 'Number':
      handler = new NumberHandlers(objectDetails);
      break;
    case 'Array':
      handler = new ArrayHandlers(objectDetails);
      break;
    case 'Date':
      handler = new DateHandlers(objectDetails);
      break;
    case 'Embedded':
      return getJoiSchema(objectDetails.schema);
    case 'ObjectID':
      handler = new StringHandler(objectDetails, Joi.string().hex().length(24).required());
      break;
    default:
      handler = new AnyHandler(objectDetails);
      break;
  }
  handler.handle();
  return handler.joiObj;
}

/**
 * extracts a Joi schema from mongoose
 * @param {Object} mongoSchema mongoose schema
 * @returns {Object}
 */
const getJoiSchema = mongoSchema => {
  const joiSchema = {};
  const objectsDetails = mongoSchema.paths;

  for(const key in objectsDetails) {
    // eslint-disable-next-line no-prototype-builtins
    if(objectsDetails.hasOwnProperty(key)) {
      joiSchema[key] = director(objectsDetails[key]);
    }
  }
  return joiSchema;
};

exports.getJoiSchema = getJoiSchema;
