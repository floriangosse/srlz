const { ObjectSerializer } = require('./');

class Person {
    name = null;
    age = null;

    static create(params) {
        const person = new Person();
        person.name = params.name;
        if (params.age) person.age = params.age;
        return person;
    }
}

class Car {
    wheels = 4;
    owner = null;

    static create(params) {
        const car = new Car();
        car.wheels = params.wheels;
        if (params.owner) car.owner = params.owner;
        return car;
    }
}

class PersonSerializer extends ObjectSerializer {
    fields = {
        name: { required: true },
        age: {}
    };

    serialize(value) {
        if (!(value instanceof Person)) {
            throw new TypeError('Cannot serialize object: Value is not instance of Person');
        }

        return super.serialize(value);
    }

    deserialize(value) {
        return Person.create(
            super.deserialize(value)
        );
    }
}

class CarSerializer extends ObjectSerializer {
    fields = {
        wheels: { required: true },
        owner: { serializer: PersonSerializer }
    };

    serialize(value) {
        if (!(value instanceof Car)) {
            throw new TypeError('Cannot serialize object: Value is not instance of Car');
        }

        return super.serialize(value);
    }

    deserialize(value) {
        return Car.create(
            super.deserialize(value)
        );
    }
}

// --- main ---

const carSerializer = new CarSerializer();

const inputCar = Car.create({
    wheels: 6,
    owner: Person.create({
        name: 'John'
    })
});
console.log('input:', inputCar);

const serializedCar = carSerializer.serialize(inputCar);
console.log('serizalied value:', serializedCar);

const outputCar = carSerializer.deserialize(serializedCar);
console.log('output:', outputCar);