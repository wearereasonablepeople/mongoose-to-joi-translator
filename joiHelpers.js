const Joi = require('joi');

/**
 * contains base options to be used for all types included unknown ones
 */
let baseHandlers = {
    /**
     * Adds a check for the existence of an attribute
     * @param {Object} joiBase a Joi.Any() object
     * @param {Object} attributeDetails
     * @returns {Object} a Joi.Any() object
     */
    required: (joiBase, attributeDetails) => {
        if(attributeDetails.isRequired)
            return joiBase.required();
        else return joiBase;
    }
};

/**
 * contains String options
 */
let stringHandlers = Object.assign({
    /**
     * Adds a check for string minimum characters, does not support array type of min option yet
     * @param {Object} joiString a Joi.string() object
     * @param {Object} attributeDetails
     * @returns {Object} a Joi.string() object
     */
    min: (joiString, attributeDetails) => {
        if(attributeDetails.options.min){
            // todo: support array type of min
            return joiString.min(attributeDetails.options.min);
        }else return joiString;
    }
}, baseHandlers);

/**
 * contains Array options
 */
let arrayHandlers = Object.assign({
    /**
     * Adds a check for array element types
     * @param {Object} joiArray a Joi.Array() object
     * @param {Object} objectDetails
     * @param {Object} objectDetails.caster shows the type of the nested element
     * @returns {Object} a Joi.Array() object
     */
    items: (joiArray, objectDetails) => {
        return joiArray.items(director(objectDetails.caster));
    }
}, baseHandlers);

/**
 * calls all functions in a handler for a specific type
 * @param {Object} joiObj a Joi object
 * @param {Object} handler contains the supported options for each type
 * @param {Object} objectDetails
 */
function callHandlerFunctions(joiObj, handler, objectDetails){
    for(let funcKey in handler){
        joiObj = handler[funcKey](joiObj, objectDetails);
    }
    return joiObj;
}

/**
 * finds and calls the appropriate next function
 * @param {Object} objectDetails
 * @param {String} [objectDetails.instance] contains the type of the object
 * @param {Object} [objectDetails.schema] contains the full mongoose embedded schema
 */
function director(objectDetails){
    switch(objectDetails.instance) {
        case 'String':
            return callHandlerFunctions(Joi.string(), stringHandlers, objectDetails);
            break;
        case 'Array':
            return callHandlerFunctions(Joi.array(), arrayHandlers, objectDetails);
            break;
        case 'Embedded':
            return getJoiSchema(objectDetails.schema);
            break;
        default:
            return callHandlerFunctions(Joi.any(), baseHandlers, objectDetails);
    }
}

/**
 * extracts a Joi schema from mongoose
 * @param {Object} mongoSchema mongoose schema
 * @returns {Object}
 */
function getJoiSchema(mongoSchema){
    let joiSchema = {};
    const objectsDetails = mongoSchema.paths;

    for(let key in objectsDetails){
        if(objectsDetails.hasOwnProperty(key)){
            joiSchema[key] = director(objectsDetails[key]);
        }
    }
    return joiSchema;
}

exports.getJoiSchema = getJoiSchema;