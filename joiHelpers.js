const Joi = require('joi');

let baseHandlers = {
    required: (joiBase, attributeDetails) => {
        if(attributeDetails.isRequired)
            return joiBase.required();
        else return joiBase;
    }
};

let stringHandlers = Object.assign({
    min: (joiString, attributeDetails) => {
        if(attributeDetails.options.min){
            // todo: support array type of min
            return joiString.min(attributeDetails.options.min);
        }else return joiString;
    }
}, baseHandlers);

let arrayHandlers = Object.assign({
    items: (joiArray, attributeDetails) => {
        return joiArray.items(callHandlers(attributeDetails.caster));
    }
}, baseHandlers);

// calls all functions for a handler type for a specific type
function callHandlerFunctions(joiObj, handler, attributeDetails){
    for(let funcKey in handler){
        joiObj = handler[funcKey](joiObj, attributeDetails);
    }
    return joiObj;
}

// finds and calls the appropriate handler
function callHandlers(objectDetails){
    switch(objectDetails.instance) {
        case 'String':
            return callHandlerFunctions(Joi.string(), stringHandlers, objectDetails);
            break;
        case 'Array':
            return callHandlerFunctions(Joi.array(), arrayHandlers, objectDetails);
            break;
        default:
            return callHandlerFunctions(Joi.any(), baseHandlers, objectDetails);
    }
}

// returns a joi schema using a mongoose schema
function getJoiSchema(mongoSchema){
    let joiSchema = {};
    const objectsDetails = mongoSchema.paths;

    for(let key in objectsDetails){
        if(objectsDetails.hasOwnProperty(key)){
            joiSchema[key] = callHandlers(objectsDetails[key]);
        }
    }
    return joiSchema;
}

exports.getJoiSchema = getJoiSchema;