import { $ as CastAttribute, m as ModelFields } from './shared/pinia-orm.ed84a779.js';
import 'pinia';
import '@pinia-orm/normalizr';
import '@/composables';

declare class ArrayCast extends CastAttribute {
    /**
     * Create a new String attribute instance.
     */
    constructor(attributes: ModelFields);
    get(value?: any): any;
    /**
     * Make the value for the attribute.
     */
    set(value: any): string | null;
}

declare class StringCast extends CastAttribute {
    /**
     * Create a new String attribute instance.
     */
    constructor(attributes: ModelFields);
    get(value?: any): any;
    /**
     * Make the value for the attribute.
     */
    set(value: any): string | null;
}

declare class BooleanCast extends CastAttribute {
    /**
     * Create a new String attribute instance.
     */
    constructor(attributes: ModelFields);
    get(value?: any): any;
    /**
     * Make the value for the attribute.
     */
    set(value: any): string | null;
}

declare class NumberCast extends CastAttribute {
    /**
     * Create a new String attribute instance.
     */
    constructor(attributes: ModelFields);
    get(value?: any): any;
    /**
     * Make the value for the attribute.
     */
    set(value: any): string | null;
}

declare class DateCast extends CastAttribute {
    /**
     * Create a new String attribute instance.
     */
    constructor(attributes: ModelFields);
    get(value: string | null): Date | null;
    /**
     * Make the value for the attribute.
     */
    set(value: string | Date | null): string | null;
}

export { ArrayCast, BooleanCast, DateCast, NumberCast, StringCast };
