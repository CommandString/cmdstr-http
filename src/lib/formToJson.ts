export type JsonValue = string | number | boolean | JsonValue[] | JsonSerializable | JsonSerializable[];

export type JsonSerializable = {
    [k: string]: JsonValue;
}

export type FormInputElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export type FormInputNames =
    'text' |
    'color' |
    'textarea' |
    'select' |
    'radio' |
    'checkbox' |
    'range' |
    'number' |
    'date' |
    'time' |
    'datetime-local' |
    'month' |
    'week' |
    'email' |
    'tel' |
    'url' |
    'search' |
    'password' |
    'hidden' |
    'submit' |
    'reset' |
    'button' |
    'image';

export type FormInputElements = {
    [k in FormInputNames]: k extends 'select' ? HTMLSelectElement : k extends 'textarea' ? HTMLTextAreaElement : HTMLInputElement;
}

export type FormInputToJsonValue<InputName extends FormInputNames> = (key: string, element: FormInputElements[InputName]) => FormInputJsonValues[InputName];

export type FormInputJsonValues = {
    [k in FormInputNames]: k extends 'number'|'range' ? number : k extends 'checkbox' ? boolean : string;
}

export type FormToJsonConfig = {
    /**
     * Converters for converting specific form input values to a JSON-serializable type.
     */
    converters?: {
        [k in FormInputNames]?: FormInputToJsonValue<k>
    }
}

export type FormSchema = {
    [k: string]: FormInputNames | FormSchema
}

export type FormReturnSchema<Schema extends FormSchema> = {
    [K in keyof Schema]: Schema[K] extends FormSchema
        ? FormReturnSchema<Schema[K]>
        : Schema[K] extends FormInputNames
            ? FormInputJsonValues[Schema[K]]
            : never;
};

export function formToJson<Schema extends FormSchema>(form: HTMLFormElement, config?: FormToJsonConfig): FormReturnSchema<Schema> {
    const c: FormToJsonConfig = config ?? createDefaultConfig();

    let inputs = Array.from(form.querySelectorAll('input, select, textarea').values() as IterableIterator<FormInputElement>);

    let normalizeFields = (inputs: FormInputElement[]) => {
        let result: JsonSerializable = {};

        for (let element of inputs) {
            let keys = element.name.split('.');
            let lastKey: string = keys.pop()!;
            let nestedObject: JsonSerializable = result;

            let type: FormInputNames;

            if (element instanceof HTMLTextAreaElement) {
                type = 'textarea';
            } else if (element instanceof HTMLSelectElement) {
                type = 'select';
            } else {
                type = element.type as FormInputNames;
            }

            for (let part of keys) {
                nestedObject[part] = nestedObject[part] || {};
                nestedObject = nestedObject[part] as JsonSerializable;
            }

            const converter = (c.converters ?? {})[type] ?? null;

            // @ts-expect-error - This is an implementation of FormInputNames
            nestedObject[lastKey] = converter !== null ? converter(lastKey, element) : element.value;
        }

        return result;
    }

    return normalizeFields(inputs) as FormReturnSchema<Schema>;
}

function returnInputValue(key: string, element: FormInputElement): string {
    return element.value;
}

function convertInputValue<InputName extends FormInputNames>(converter: (value: string) => FormInputJsonValues[InputName]): FormInputToJsonValue<InputName> {
    return (k, e) => converter(e.value);
}

export function createDefaultConfig(): FormToJsonConfig {
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
    }
}