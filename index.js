class GenericSerializer {
    serialize(value) {
        return value;
    }

    deserialize(value) {
        return value;
    }
}

class ObjectSerializer extends GenericSerializer {
    fields = {}

    serialize(input) {
        const output = {};

        for (let fieldName in this.fields) {
            const field = this.fields[fieldName];
            const inputFieldValue = input[fieldName];

            // Serialization
            const FieldSerializer = field.serializer || GenericSerializer;
            const fieldSerializer = new FieldSerializer();

            const outputFieldValue = fieldSerializer.serialize(inputFieldValue);

            output[fieldName] = outputFieldValue;
        }

        return output;
    }

    deserialize(input) {
        const output = {};

        for (let fieldName in this.fields) {
            const field = this.fields[fieldName];
            const inputFieldValue = input[fieldName];

            // Validation
            if (field.required) {
                if (typeof input[fieldName] === 'undefined' || input[fieldName] === null) {
                    throw new Error(`Cannot deserialize object: Field '${fieldName}' is required but missing in object.`);
                }
            }

            // (De)serialization
            const FieldSerializer = field.serializer || GenericSerializer;
            const fieldSerializer = new FieldSerializer();

            const outputFieldValue = fieldSerializer.deserialize(inputFieldValue);

            output[fieldName] = outputFieldValue;
        }

        return output;
    }
}

module.exports = {
    GenericSerializer,
    ObjectSerializer
};