"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formToJson = formToJson;
exports.createDefaultConfig = createDefaultConfig;
function formToJson(form, config) {
    const c = config !== null && config !== void 0 ? config : createDefaultConfig();
    let inputs = Array.from(form.querySelectorAll('input, select, textarea').values());
    let normalizeFields = (inputs) => {
        var _a, _b;
        let result = {};
        for (let element of inputs) {
            let keys = element.name.split('.');
            let lastKey = keys.pop();
            let nestedObject = result;
            let type;
            if (element instanceof HTMLTextAreaElement) {
                type = 'textarea';
            }
            else if (element instanceof HTMLSelectElement) {
                type = 'select';
            }
            else {
                type = element.type;
            }
            for (let part of keys) {
                nestedObject[part] = nestedObject[part] || {};
                nestedObject = nestedObject[part];
            }
            const converter = (_b = ((_a = c.converters) !== null && _a !== void 0 ? _a : {})[type]) !== null && _b !== void 0 ? _b : null;
            // @ts-expect-error - This is an implementation of FormInputNames
            nestedObject[lastKey] = converter !== null ? converter(lastKey, element) : element.value;
        }
        return result;
    };
    return normalizeFields(inputs);
}
function returnInputValue(key, element) {
    return element.value;
}
function convertInputValue(converter) {
    return (k, e) => converter(e.value);
}
function createDefaultConfig() {
    return {
        converters: {
            checkbox: (key, element) => element.checked,
            range: convertInputValue(parseFloat),
            number: convertInputValue(parseFloat),
            text: returnInputValue,
            color: returnInputValue,
            textarea: returnInputValue,
            select: returnInputValue,
            radio: returnInputValue,
            date: returnInputValue,
            time: returnInputValue,
            'datetime-local': returnInputValue,
            month: returnInputValue,
            week: returnInputValue,
            email: returnInputValue,
            tel: returnInputValue,
            url: returnInputValue,
            search: returnInputValue,
            password: returnInputValue,
            hidden: returnInputValue,
            submit: returnInputValue,
            reset: returnInputValue,
            button: returnInputValue,
            image: returnInputValue,
        }
    };
}
