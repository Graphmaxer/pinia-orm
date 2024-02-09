import { a0 as TypeDefault, af as PropertyDecorator, ag as TypeOptions, ah as UidOptions, M as Model, s as PrimaryKey, z as deleteModes, $ as CastAttribute, ai as Mutator } from './shared/pinia-orm.ed84a779.js';
export { aj as NanoidOptions } from './shared/pinia-orm.ed84a779.js';
import 'pinia';
import '@pinia-orm/normalizr';
import '@/composables';

/**
 * Create an Attr attribute property decorator.
 */
declare function Attr(value?: TypeDefault<any>): PropertyDecorator;

/**
 * Create a String attribute property decorator.
 */
declare function Str(value: TypeDefault<string>, options?: TypeOptions): PropertyDecorator;

/**
 * Create a Number attribute property decorator.
 */
declare function Num(value: TypeDefault<number>, options?: TypeOptions): PropertyDecorator;

/**
 * Create a Boolean attribute property decorator.
 */
declare function Bool(value: TypeDefault<boolean>, options?: TypeOptions): PropertyDecorator;

/**
 * Create a Uid attribute property decorator.
 */
declare function Uid(options?: UidOptions): PropertyDecorator;

/**
 * Create a has-one attribute property decorator.
 */
declare function HasOne(related: () => typeof Model, foreignKey: PrimaryKey, localKey?: PrimaryKey): PropertyDecorator;

/**
 * Create a belongs-to attribute property decorator.
 */
declare function BelongsTo(related: () => typeof Model, foreignKey: PrimaryKey, ownerKey?: PrimaryKey): PropertyDecorator;

/**
 * Create a belongs-to-many attribute property decorator.
 */
declare function BelongsToMany(related: () => typeof Model, pivot: () => typeof Model, foreignPivotKey: string, relatedPivotKey: string, parentKey?: string, relatedKey?: string): PropertyDecorator;

/**
 * Create a has-many attribute property decorator.
 */
declare function HasMany(related: () => typeof Model, foreignKey: PrimaryKey, localKey?: PrimaryKey): PropertyDecorator;

/**
 * Create a has-many-by attribute property decorator.
 */
declare function HasManyBy(related: () => typeof Model, foreignKey: string, ownerKey?: string): PropertyDecorator;

/**
 * Create a has-many attribute property decorator.
 */
declare function HasManyThrough(related: () => typeof Model, through: () => typeof Model, firstKey: string, secondKey: string, localKey?: string, secondLocalKey?: string): PropertyDecorator;

/**
 * Create a morph-one attribute property decorator.
 */
declare function MorphOne(related: () => typeof Model, id: string, type: string, localKey?: string): PropertyDecorator;

/**
 * Create a morph-to attribute property decorator.
 */
declare function MorphTo(related: () => typeof Model[], id: string, type: string, ownerKey?: string): PropertyDecorator;

/**
 * Create a morph-to-many attribute property decorator.
 */
declare function MorphToMany(related: () => typeof Model, pivot: () => typeof Model, relatedId: string, id: string, type: string, parentKey?: string, relatedKey?: string): PropertyDecorator;

/**
 * Create a morph-many attribute property decorator.
 */
declare function MorphMany(related: () => typeof Model, id: string, type: string, localKey?: string): PropertyDecorator;

/**
 * Define the delete behaviour for a relation
 */
declare function OnDelete(mode: deleteModes): PropertyDecorator;

/**
 * Create a cast for an attribute property decorator.
 */
declare function Cast(to: (() => typeof CastAttribute)): PropertyDecorator;

/**
 * Create an Mutate attribute property decorator.
 */
declare function Mutate(get?: Mutator<any>, set?: Mutator<any>): PropertyDecorator;

/**
 * Create an Mutate attribute property decorator.
 */
declare function Hidden(): PropertyDecorator;

/**
 * Sets an object property to be innumerable.
 */
declare function NonEnumerable(target: any, propertyKey: string): void;

export { Attr, BelongsTo, BelongsToMany, Bool, Cast, HasMany, HasManyBy, HasManyThrough, HasOne, Hidden, MorphMany, MorphOne, MorphTo, MorphToMany, Mutate, NonEnumerable, Num, OnDelete, PropertyDecorator, Str, TypeOptions, Uid, UidOptions };
