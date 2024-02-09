import { $ as CastAttribute, aj as NanoidOptions, m as ModelFields, af as PropertyDecorator } from '../shared/pinia-orm.ed84a779.mjs';
import 'pinia';
import '@pinia-orm/normalizr';
import '@/composables';

declare class UidCast extends CastAttribute {
    static parameters?: NanoidOptions;
    /**
     * Create a new String attribute instance.
     */
    constructor(attributes: ModelFields);
    static withParameters(parameters?: NanoidOptions): typeof CastAttribute;
    /**
     * Make the value for the attribute.
     */
    set(value: any): string | null;
}

/**
 * Create a cast for an attribute property decorator.
 */
declare function Uid(options?: NanoidOptions): PropertyDecorator;

export { Uid, UidCast };
