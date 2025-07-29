/**
 * Recursively flattens a JS object or array into FormData keys using bracket notation.
 * @param {object|array} obj - The input object or array to flatten.
 * @param {FormData} formData - An existing FormData instance.
 * @param {string} [parentKey] - The key prefix for nested props.
 */
export function flattenObjectToFormData(obj, formData = new FormData(), parentKey = '') {
  if (obj === null || obj === undefined) return formData;

  if (obj instanceof File) {
    formData.append(parentKey, obj);
  } else if (Array.isArray(obj)) {
    obj.forEach((value, index) => {
      flattenObjectToFormData(value, formData, `${parentKey}[${index}]`);
    });
  } else if (typeof obj === 'object') {
    Object.entries(obj).forEach(([key, value]) => {
      const newKey = parentKey ? `${parentKey}[${key}]` : key;
      flattenObjectToFormData(value, formData, newKey);
    });
  } else {
    formData.append(parentKey, obj);
  }

  return formData;
}

