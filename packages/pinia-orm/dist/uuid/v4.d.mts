import { V4Options } from 'uuid';
import { $ as CastAttribute, m as ModelFields, af as PropertyDecorator } from '../shared/pinia-orm.ed84a779.mjs';
import 'pinia';
import '@pinia-orm/normalizr';
import '@/composables';

declare class UidCast extends CastAttribute {
    static parameters?: V4Options;
    /**
     * Create a new String attribute instance.
     */
    constructor(attributes: ModelFields);
    static withParameters(parameters?: V4Options): typeof CastAttribute;
    /**
     * Make the value for the attribute.
     */
    set(value: any): string | null;
}

/**
 * Create a cast for an attribute property decorator.
 */
declare function Uid(options?: V4Options): PropertyDecorator;

export { Uid, UidCast };
