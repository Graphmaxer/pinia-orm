import { V1Options } from 'uuid';
import { $ as CastAttribute, m as ModelFields, af as PropertyDecorator } from '../shared/pinia-orm.ed84a779.cjs';
import 'pinia';
import '@pinia-orm/normalizr';
import '@/composables';

declare class UidCast extends CastAttribute {
    static parameters?: V1Options;
    /**
     * Create a new String attribute instance.
     */
    constructor(attributes: ModelFields);
    static withParameters(parameters?: V1Options): typeof CastAttribute;
    /**
     * Make the value for the attribute.
     */
    set(value: any): string | null;
}

/**
 * Create a cast for an attribute property decorator.
 */
declare function Uid(options?: V1Options): PropertyDecorator;

export { Uid, UidCast };
