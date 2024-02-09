import { $ as CastAttribute, aj as NanoidOptions, m as ModelFields, af as PropertyDecorator } from '../shared/pinia-orm.ed84a779.js';
import 'pinia';
import '@pinia-orm/normalizr';
import '@/composables';

/**
 * Create a cast nanoid/async.
 * @deprecated will be removed in v2 because nanoid v5 dropped it
 */
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
    set(value: any): Promise<string | null>;
}

/**
 * Creates an uuid based on nanoid/async.
 * @deprecated will be removed in v2 because nanoid v5 dropped it
 */
declare function Uid(options?: NanoidOptions): PropertyDecorator;

export { Uid, UidCast };
