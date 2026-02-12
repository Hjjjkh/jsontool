import type { JSONValue } from '../types';

export const isObject = (value: JSONValue): boolean => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

export const isArray = (value: JSONValue): boolean => {
  return Array.isArray(value);
};

export const deepClone = <T extends JSONValue>(value: T): T => {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  
  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item)) as T;
  }
  
  const cloned: Record<string, JSONValue> = {};
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      cloned[key] = deepClone(value[key]);
    }
  }
  
  return cloned as T;
};

export const deepEqual = (a: JSONValue, b: JSONValue): boolean => {
  if (a === b) return true;
  
  if (typeof a !== typeof b) return false;
  
  if (a === null || b === null) return a === b;
  
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }
  
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a as Record<string, JSONValue>);
    const keysB = Object.keys(b as Record<string, JSONValue>);
    
    if (keysA.length !== keysB.length) return false;
    
    return keysA.every((key) => {
      const objA = a as Record<string, JSONValue>;
      const objB = b as Record<string, JSONValue>;
      return Object.prototype.hasOwnProperty.call(objB, key) && deepEqual(objA[key], objB[key]);
    });
  }
  
  return false;
};
