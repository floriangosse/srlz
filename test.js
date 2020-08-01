const test = require('ava');

const { GenericSerializer, ObjectSerializer } = require('./index');

test('serialize generic value', (t) => {
    const serializer = new GenericSerializer();

    const input = 'John Doe';
    const output = serializer.serialize(input);

    t.is(output, 'John Doe');
});

test('deserialize generic value', (t) => {
    const serializer = new GenericSerializer();

    const input = 'John Doe';
    const output = serializer.deserialize(input);

    t.is(output, 'John Doe');
});

test('serialize plain object', (t) => {
    class PersonSerializer extends ObjectSerializer {
        fields = {
            name: {},
            age: {}
        };
    };
    class HouseSerializer extends ObjectSerializer {
        fields = {
            doors: {},
            owner: { serializer: PersonSerializer }
        };
    };

    const serializer = new HouseSerializer();
    const input = {
        doors: 3,
        owner: {
            name: 'John',
            age: 37
        }
    };
    const output = serializer.serialize(input);

    t.deepEqual(output, {
        doors: 3,
        owner: {
            name: 'John',
            age: 37
        }
    });
});

test('deserialize to plain object', (t) => {
    class PersonSerializer extends ObjectSerializer {
        fields = {
            name: {},
            age: {}
        };
    };
    class HouseSerializer extends ObjectSerializer {
        fields = {
            doors: {},
            owner: { serializer: PersonSerializer }
        };
    };

    const serializer = new HouseSerializer();
    const input = {
        doors: 3,
        owner: {
            name: 'John',
            age: 37
        }
    };
    const output = serializer.deserialize(input);

    t.deepEqual(output, {
        doors: 3,
        owner: {
            name: 'John',
            age: 37
        }
    });
});