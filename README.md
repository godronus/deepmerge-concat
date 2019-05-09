This package is an extension of `deepmerge`

Adds capability to concat strings and arrays whilst merging two objects


**USAGE:**

First import package into project

`npm install deepmerge-concat --save`

Example:

```
const deepmerge = require('deepmerge-concat');

const obj1 = {
  include: 'one,two,three',
  fields: 'one,two,three',
  sort: {
    test: 'one,two,three',
    arr: ['one', 'two', 'three']
  },
  help: false
};

const obj2 = {
  include: 'four,five',
  fields: 'four,five',
  sort: {
    test: 'four,five',
    arr: ['four', 'five'],
  },
  help: true
};

deepmerge.concat(obj1, obj2);

```

Result:

```
{
  "include": "one,two,three,four,five",
  "fields": "one,two,three,four,five",
  "sort": {
    "test": "one,two,three,four,five",
    "arr": ["one","two","three","four","five"]
  },
  "help": true
}

```

As you can see this concats and string/array values found within the nested objects.

Other primitives (e.g. numbers/bools) are still overwritten as per deepmerge functionality.

