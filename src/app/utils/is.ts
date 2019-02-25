const nativeToString = Object.prototype.toString;

export function isUndef(val) {
    return val === undefined || val === null;
}

export function isDef(val) {
    return val !== undefined && val !== null;
}

export function isTrue(val) {
    return val === true;
}

export function isFalse(val) {
    return val === false;
}

export function baseIsNaN(val) {
    // eslint-disable-next-line
  return val !== val;
}

export function isPrimitive(val) {
    return (
        typeof val === 'string' ||
        typeof val === 'number' ||
        typeof val === 'boolean'
    );
}

export function isString(val) {
    return typeof val === 'string';
}

export function isObject(val) {
    return val !== null && typeof val === 'object';
}

export function isDate(val) {
    return nativeToString.call(val) === '[object Date]';
}

export function isNumber(val) {
    return typeof val === 'number' && !isNaN(val);
}

export function isArray(val) {
    return nativeToString.call(val) === '[object Array]';
}

export function isBlob(val) {
    return nativeToString.call(val) === '[object Blob]';
}

export function isArrayBuffer(val) {
    return nativeToString.call(val) === '[object ArrayBuffer]';
}

export function isFormData(val) {
    // eslint-disable-next-line
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

export function isFile(val) {
    return nativeToString.call(val) === '[object File]';
}

export function isFunction(val) {
    return nativeToString.call(val) === '[object Function]';
}

export function isStream(val) {
    return isObject(val) && isFunction(val.pipe);
}

export function isPlainObject(val) {
    return nativeToString.call(val) === '[object Object]';
}

export function isRegExp(val) {
    return nativeToString.call(val) === '[object RegExp]';
}

export function isValidArrayIndex(val) {
    const n = parseFloat(val);
    return n >= 0 && Math.floor(n) === n && isFinite(val);
}

export function isURLSearchParams(val) {
    // eslint-disable-next-line
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

export function isArrayBufferView(val) {
    let result;
    if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
        result = ArrayBuffer.isView(val);
    } else {
        result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
    }
    return result;
}

export function isAbsoluteURL(url) {
    // eslint-disable-next-line
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}

export function isEmail(val) {
    return /^[\w-]+(?:\.[\w-]+)*@[\w-]+(?:\.[\w-]+)+$/.test(val.trim());
}

export function isPhone(val) {
    return /^\d{7,14}$/.test(val.trim());
}

export function isIdentity(x, y) {
    // SameValue algorithm
    if (x === y) {
        // Steps 1-5, 7-10
        // Steps 6.b-6.e: +0 != -0
        // Added the nonzero y check to make Flow happy, but it is redundant
        return x !== 0 || y !== 0 || 1 / x === 1 / y;
    } else {
        // Step 6.a: NaN == NaN
        return x !== x && y !== y;
    }
}
