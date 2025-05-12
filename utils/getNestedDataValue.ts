/**
 * retrieves the value from a nested object based on a given key path
 * @param obj - Json obj
 * @param keyPath - The keyPath is keys using split('.'). 
 * @returns 
 */
export function getNestedDataValue(obj: any, keyPath: string) {
    return keyPath.split('.').reduce((acc, key) => {
        return acc && acc[key] !== undefined ? acc[key] : null;
    }, obj);
}
