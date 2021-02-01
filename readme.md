# srlz

> A small serialization library that can be adapted to your own needs.

## API

### `GenericSerializer`

A generic serializer which returns the input value and is the base for every serializer implementation.


### `ObjectSerializer`

A serializer which serializes / deserializes values based on the configures fields and corresponding serializers.

In most cases the class has to be extends by a more specific serializer class which takes care about a specific object
type.

#### fields

*Instance member*

Type: `Object`

Each key of the objects maps to a field name and each value to a field specification.

##### Field specification

* `serializer` (optional)<br>
    Type: `Class extends GenericSerializer`<br>
    Defines the serializer class which should be used for the field.
* `required` (optional)<br>
    Type: `boolean`<br>
    Throws an error if the field is missing during deserialization.


## Usage

### Custom serializer

Creates serializer which convers the given array to a string by using a configured seperator.

```js
import { GenericSerializer } from 'srlz';
// OR
const { GenericSerializer } = require('srlz');

class JoinedArraySerializer extends GenericSerializer {
    separator = '||';

    serialize(value) {
        return value.join(this.separator);
    }

    deserialize(value) {
        return value.splut(this.separator);
    }
}

const serializer = new JoinedArraySerializer();
serializer.serialize([ 1, 2, 3, 4, 5 ]);
// Output: '1||2||3||4||5'
```

### Custom object serializer

Converts a person object into an object in which the skills are represented as string.

```js
import { ObjectSerializer } from 'srlz';
// OR
const { ObjectSerializer } = require('srlz');

class PersonSerializer extends ObjectSerializer {
    fields = {
        name: {},
        skills: { serializer: JoinedArraySerializer }
    }
}

const serializer = new PersonSerializer();
serializer.serialize({
    name: 'John Doe',
    skills: [ 'Javascript', 'Typescript' ]
});
// Output: {
//   name: 'John Doe',
//   skills: 'Javascript||Typescript'
// }
```

### Complex example

This example shows how to create custom serializers and how a serialization for the non scalar type `Date` could look
like.

```js
const { GenericSerializer, ObjectSerializer } = require('srlz');

const post = {
    title: 'My Blog Title',
    publishedAt: new Date('2020-08-01T09:30:00.000Z')
};

class ISODateSerializer extends GenericSerializer {
    serialize(value) {
        return value.toISOString();
    }

    deserialize(value) {
        return new Date(value);
    }
}

class PostSerializer extends ObjectSerializer {
    fields = {
        title: {},
        publishedAt: { serializer: ISODateSerializer }
    }
}

const postSerializer = new PostSerializer();
postSerializer.serialize(post);
// Output: {
//   title: 'My Blog Title',
//   publishedAt: '2020-08-01T09:30:00.000Z'
// }
```
