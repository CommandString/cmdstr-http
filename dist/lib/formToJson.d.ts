export type JsonValue = string | number | boolean | JsonValue[] | JsonSerializable | JsonSerializable[];
export type JsonSerializable = {
    [k: string]: JsonValue;
};
export type FormInputElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
export type FormInputNames = 'text' | 'color' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'range' | 'number' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'email' | 'tel' | 'url' | 'search' | 'password' | 'hidden' | 'submit' | 'reset' | 'button' | 'image';
export type FormInputElements = {
    [k in FormInputNames]: k extends 'select' ? HTMLSelectElement : k extends 'textarea' ? HTMLTextAreaElement : HTMLInputElement;
};
export type FormInputToJsonValue<InputName extends FormInputNames> = (key: string, element: FormInputElements[InputName]) => FormInputJsonValues[InputName];
export type FormInputJsonValues = {
    [k in FormInputNames]: k extends 'number' | 'range' ? number : k extends 'checkbox' ? boolean : string;
};
export type FormToJsonConfig = {
    /**
     * Converters for converting specific form input values to a JSON-serializable type.
     */
    converters?: {
        [k in FormInputNames]?: FormInputToJsonValue<k>;
    };
};
export type FormSchema = {
    [k: string]: FormInputNames | FormSchema;
};
export type FormReturnSchema<Schema extends FormSchema> = {
    [K in keyof Schema]: Schema[K] extends FormSchema ? FormReturnSchema<Schema[K]> : Schema[K] extends FormInputNames ? FormInputJsonValues[Schema[K]] : never;
};
export declare function formToJson<Schema extends FormSchema>(form: HTMLFormElement, config?: FormToJsonConfig): FormReturnSchema<Schema>;
export declare function createDefaultConfig(): FormToJsonConfig;
