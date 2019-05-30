const deepmerge = require('deepmerge');

function isObject(obj) {
  return (obj !== null && typeof obj === 'object');
}

const queryStrToArr = (value, keepArr = false) => {
  let containsArrays = false;
  const mapObj = (obj) => {
    return Object.keys(obj).reduce((acc, key) => {
      if (typeof obj[key] === 'string') { // turn into arrays for deep merge
        acc[key] = obj[key].split(',').filter(Boolean);
      } else if (isObject(obj[key])) {
        if (Array.isArray(obj[key])) {
          containsArrays = true;
          if (keepArr) {
            acc[key] = JSON.stringify(obj[key]);
          }
        } else {
          acc[key] = mapObj(obj[key]);
        }
      } else {
        acc[key] = obj[key];
      }
      return acc;
    }, {});
  }
  const queryObj = mapObj(value);
  return { queryObj, containsArrays };
}

const queryArrToStr = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    if (typeof obj[key] === 'string') {
      try {
        const val = JSON.parse(obj[key]);
        if (Array.isArray(val)) { // check if it's a stringified array
          acc[key] = val;
        }
      } catch (err) {
        acc[key] = obj[key]; // treat as a string (cannot parse it)
      }
    } else if (isObject(obj[key])) {
      if (Array.isArray(obj[key])) {
        acc[key] = obj[key].join(',');
      } else {
        acc[key] = queryArrToStr(obj[key]);
      }
    } else {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
};

const cleanSourceMap = (dirty, clean) => {
  // replace all original source values priot to merge arrays - i.e. use 'dirty' only for arrays
  return Object.keys(dirty).reduce((acc, key) => {
    if (isObject(dirty[key])) {
      if (Array.isArray(dirty[key])) {
        acc[key] = dirty[key];
      } else {
        acc[key] = cleanSourceMap(dirty[key], clean[key]);
      }
    } else if (clean.hasOwnProperty(key)) {
      acc[key] = clean[key];
    }
    return acc;
  }, {});
};

deepmerge.concat = function queries(target, source) {
  if (!isObject(target) || !isObject(source)) return new Error('Must recieve two objects to merge');
  if (Array.isArray(target) || Array.isArray(source)) return new Error('Must recieve two objects to merge');
  const { queryObj, containsArrays } = queryStrToArr(target);
  const targetQuery = queryObj;
  let sourceQuery;
  if (containsArrays) {
    // First merge all arrays in the queries
    const sourceMergedArrays = deepmerge(target, source);
    sourceQuery = queryStrToArr(cleanSourceMap(sourceMergedArrays, source), true).queryObj;
  } else {
    sourceQuery = queryStrToArr(source, true).queryObj;
  }
  const mergedQueries = deepmerge(targetQuery, sourceQuery);
  return queryArrToStr(mergedQueries);
};

module.exports = deepmerge;

