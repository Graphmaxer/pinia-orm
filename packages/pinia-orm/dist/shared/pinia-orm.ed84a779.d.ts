import * as pinia from 'pinia';
import { Pinia, DefineStoreOptionsBase } from 'pinia';
import { schema, Schema as Schema$1 } from '@pinia-orm/normalizr';
import * as __composables from '@/composables';

interface Constructor<T> {
    new (...args: any[]): T;
}
type Mutator<T> = (value: T) => T;
interface MutatorFunctions<T> {
    get?: Mutator<T>;
    set?: Mutator<T>;
}
interface Mutators {
    [name: string]: MutatorFunctions<any> | Mutator<any>;
}
interface CacheConfig {
    key?: string;
    params?: Record<string, any>;
}

declare class WeakCache<K, V extends object> implements Map<K, V> {
    #private;
    readonly [Symbol.toStringTag]: string;
    has(key: K): boolean;
    get(key: K): V;
    set(key: K, value: V): this;
    get size(): number;
    clear(): void;
    delete(key: K): boolean;
    forEach(cb: (value: V, key: K, map: Map<K, V>) => void): void;
    [Symbol.iterator](): IterableIterator<[K, V]>;
    entries(): IterableIterator<[K, V]>;
    keys(): IterableIterator<K>;
    values(): IterableIterator<V>;
}

interface PiniaOrmPluginContext {
    model: Model;
    repository: Repository;
    config: FilledInstallOptions & {
        [key: string]: any;
    };
}
interface PiniaOrmPlugin {
    (context: PiniaOrmPluginContext): PiniaOrmPluginContext;
}
declare const definePiniaOrmPlugin: (plugin: PiniaOrmPlugin) => PiniaOrmPlugin;
declare const plugins: PiniaOrmPlugin[];
declare function registerPlugins(repository: Repository): Repository<Model>;

interface ModelConfigOptions {
    withMeta?: boolean;
    hidden?: string[];
    namespace?: string;
    visible?: string[];
}
interface CacheConfigOptions {
    shared?: boolean;
    provider?: typeof WeakCache<string, Model[]>;
}
interface InstallOptions {
    model?: ModelConfigOptions;
    cache?: CacheConfigOptions | boolean;
}
interface FilledInstallOptions {
    model: Required<ModelConfigOptions>;
    cache: Required<CacheConfigOptions | boolean>;
}
interface CreatePiniaOrm {
    use(plugin: PiniaOrmPlugin): this;
}
/**
 * Install Pinia ORM to the store.
 */
declare function createORM(options?: InstallOptions): () => {
    use(plugin: PiniaOrmPlugin): any;
};

declare abstract class Attribute {
    /**
     * The model instance.
     */
    protected model: Model;
    /**
     * The field name
     */
    protected key: string;
    /**
     * Create a new Attribute instance.
     */
    constructor(model: Model);
    /**
     * Set the key name of the field
     */
    setKey(key: string): this;
    /**
     * Make the value for the attribute.
     */
    abstract make(value?: any): any;
}

type TypeDefault<T> = T | null | (() => T | null);
declare abstract class Type extends Attribute {
    /**
     * The default value for the attribute.
     */
    value: any;
    /**
     * Whether the attribute accepts `null` value or not.
     */
    protected isNullable: boolean;
    /**
     * Create a new Type attribute instance.
     */
    constructor(model: Model, value?: TypeDefault<any>);
    /**
     * Set the nullable option to false.
     */
    notNullable(): this;
    protected makeReturn<T>(type: 'boolean' | 'number' | 'string', value: any): T;
    /**
     * Throw warning for wrong type
     */
    protected throwWarning(message: string[]): void;
}

declare class Attr extends Type {
    /**
     * Make the value for the attribute.
     */
    make(value: any): any;
}

declare class String$1 extends Type {
    /**
     * Create a new String attribute instance.
     */
    constructor(model: Model, value: TypeDefault<string>);
    /**
     * Make the value for the attribute.
     */
    make(value: any): string | null;
}

declare class Number extends Type {
    /**
     * Create a new Number attribute instance.
     */
    constructor(model: Model, value: TypeDefault<number>);
    /**
     * Make the value for the attribute.
     */
    make(value: any): number | null;
}

declare class Boolean$1 extends Type {
    /**
     * Create a new Boolean attribute instance.
     */
    constructor(model: Model, value: TypeDefault<boolean>);
    /**
     * Make the value for the attribute.
     */
    make(value: any): boolean | null;
}

type PropertyDecorator = (target: Model, propertyKey: string) => void;
type UidOptions = NanoidOptions | number;
interface NanoidOptions {
    alphabet?: string;
    size?: number;
}
interface TypeOptions {
    notNullable?: boolean;
}

declare class Uid extends Type {
    protected options: Record<string, any>;
    protected alphabet: string;
    protected size: number;
    constructor(model: Model, options?: UidOptions);
    /**
     * Make the value for the attribute.
     */
    make(value: any): string;
}

type Schemas = Record<string, schema.Entity>;
declare class Schema {
    /**
     * The list of generated schemas.
     */
    private schemas;
    /**
     * The model instance.
     */
    private model;
    /**
     * Create a new Schema instance.
     */
    constructor(model: Model);
    /**
     * Create a single schema.
     */
    one(model?: Model, parent?: Model): schema.Entity;
    /**
     * Create an array schema for the given model.
     */
    many(model: Model, parent?: Model): schema.Array;
    /**
     * Create an union schema for the given models.
     */
    union(models: Model[], callback: schema.SchemaFunction): schema.Union;
    /**
     * Create a new normalizr entity.
     */
    private newEntity;
    /**
     * The `id` attribute option for the normalizr entity.
     *
     * Generates any missing primary keys declared by a Uid attribute. Missing
     * primary keys where the designated attributes do not exist will
     * throw an error.
     *
     * Note that this will only generate uids for primary key attributes since it
     * is required to generate the "index id" while the other attributes are not.
     *
     * It's especially important when attempting to "update" records since we'll
     * want to retain the missing attributes in-place to prevent them being
     * overridden by newly generated uid values.
     *
     * If uid primary keys are omitted, when invoking the "update" method, it will
     * fail because the uid values will never exist in the store.
     *
     * While it would be nice to throw an error in such a case, instead of
     * silently failing an update, we don't have a way to detect whether users
     * are trying to "update" records or "inserting" new records at this stage.
     * Something to consider for future revisions.
     */
    private idAttribute;
    /**
     * Get all primary keys defined by the Uid attribute for the given model.
     */
    private getUidPrimaryKeyPairs;
    /**
     * Create a definition for the given model.
     */
    private definition;
}

declare class Database {
    /**
     * The list of registered models.
     */
    models: Record<string, Model>;
    /**
     * Register the given model.
     */
    register<M extends Model>(model: M): void;
    /**
     * Register all related models.
     */
    private registerRelatedModels;
    /**
     * Get a model by the specified entity name.
     */
    getModel<M extends Model>(name: string): M;
}

declare class Interpreter {
    /**
     * The model object.
     */
    model: Model;
    /**
     * Create a new Interpreter instance.
     */
    constructor(model: Model);
    /**
     * Perform interpretation for the given data.
     */
    process(data: Element): [Element, NormalizedData];
    process(data: Element[]): [Element[], NormalizedData];
    /**
     * Normalize the given data.
     */
    private normalize;
    /**
     * Get the schema from the database.
     */
    private getSchema;
}

interface Where {
    field: WherePrimaryClosure | string;
    value: WhereSecondaryClosure | any;
    boolean: 'and' | 'or';
}
type WherePrimaryClosure = (model: any) => boolean;
type WhereSecondaryClosure = (value: any) => boolean;
interface WhereGroup {
    and?: Where[];
    or?: Where[];
}
interface Order {
    field: OrderBy;
    direction: OrderDirection;
}
interface Group {
    field: GroupBy;
}
type OrderBy = string | ((model: any) => any);
type GroupBy = string;
type GroupByFields = string[];
type OrderDirection = 'asc' | 'desc';
interface EagerLoad {
    [name: string]: EagerLoadConstraint;
}
type EagerLoadConstraint = (query: Query) => void;

declare class Query<M extends Model = Model> {
    /**
     * The database instance.
     */
    database: Database;
    /**
     * The model object.
     */
    protected model: M;
    /**
     * The where constraints for the query.
     */
    protected wheres: Where[];
    /**
     * The orderings for the query.
     */
    protected orders: Order[];
    /**
     * The orderings for the query.
     */
    protected groups: Group[];
    /**
     * The maximum number of records to return.
     */
    protected take: number | null;
    /**
     * The number of records to skip.
     */
    protected skip: number;
    /**
     * Fields that should be visible.
     */
    protected visible: string[];
    /**
     * Fields that should be hidden.
     */
    protected hidden: string[];
    /**
     * The cache object.
     */
    protected cache?: WeakCache<string, Collection<M> | GroupedCollection<M>> | undefined;
    /**
     * The relationships that should be eager loaded.
     */
    protected eagerLoad: EagerLoad;
    /**
     * The pinia store.
     */
    protected pinia?: Pinia;
    protected fromCache: boolean;
    protected cacheConfig: CacheConfig;
    protected getNewHydrated: boolean;
    /**
     * Hydrated models. They are stored to prevent rerendering of child components.
     */
    hydratedDataCache: Map<string, M>;
    /**
     * Create a new query instance.
     */
    constructor(database: Database, model: M, cache: WeakCache<string, Collection<M> | GroupedCollection<M>> | undefined, hydratedData: Map<string, M>, pinia?: Pinia);
    /**
     * Create a new query instance for the given model.
     */
    newQuery(model: string): Query;
    /**
     * Create a new query instance with constraints for the given model.
     */
    newQueryWithConstraints(model: string): Query;
    /**
     * Create a new query instance from the given relation.
     */
    newQueryForRelation(relation: Relation): Query;
    /**
     * Create a new interpreter instance.
     */
    protected newInterpreter(): Interpreter;
    /**
     * Commit a store action and get the data
     */
    protected commit(name: string, payload?: any): Record<string, any>;
    /**
     * Make meta field visible
     */
    withMeta(): this;
    /**
     * Make hidden fields visible
     */
    makeVisible(fields: string[]): this;
    /**
     * Make visible fields hidden
     */
    makeHidden(fields: string[]): this;
    /**
     * Add a basic where clause to the query.
     */
    where(field: WherePrimaryClosure | string, value?: WhereSecondaryClosure | any): this;
    /**
     * Add a "where in" clause to the query.
     */
    whereIn(field: string, values: any[] | Set<any>): this;
    /**
     * Add a where clause on the primary key to the query.
     */
    whereId(ids: string | number | (string | number)[]): this;
    /**
     * Add an "or where" clause to the query.
     */
    orWhere(field: WherePrimaryClosure | string, value?: WhereSecondaryClosure | any): this;
    /**
     * Add a "where has" clause to the query.
     */
    whereHas(relation: string, callback?: EagerLoadConstraint, operator?: string | number, count?: number): this;
    /**
     * Add an "or where has" clause to the query.
     */
    orWhereHas(relation: string, callback?: EagerLoadConstraint, operator?: string | number, count?: number): this;
    /**
     * Add a "has" clause to the query.
     */
    has(relation: string, operator?: string | number, count?: number): this;
    /**
     * Add an "or has" clause to the query.
     */
    orHas(relation: string, operator?: string | number, count?: number): this;
    /**
     * Add a "doesn't have" clause to the query.
     */
    doesntHave(relation: string): this;
    /**
     * Add a "doesn't have" clause to the query.
     */
    orDoesntHave(relation: string): this;
    /**
     * Add a "where doesn't have" clause to the query.
     */
    whereDoesntHave(relation: string, callback?: EagerLoadConstraint): this;
    /**
     * Add an "or where doesn't have" clause to the query.
     */
    orWhereDoesntHave(relation: string, callback?: EagerLoadConstraint): this;
    /**
     * Add a "group by" clause to the query.
     */
    groupBy(...fields: GroupByFields): this;
    /**
     * Add an "order by" clause to the query.
     */
    orderBy(field: OrderBy, direction?: OrderDirection): this;
    /**
     * Set the "limit" value of the query.
     */
    limit(value: number): this;
    /**
     * Set the "offset" value of the query.
     */
    offset(value: number): this;
    /**
     * Set the relationships that should be eager loaded.
     */
    with(name: string, callback?: EagerLoadConstraint): this;
    /**
     * Set to eager load all top-level relationships. Constraint is set for all relationships.
     */
    withAll(callback?: EagerLoadConstraint): this;
    /**
     * Set to eager load all relationships recursively.
     */
    withAllRecursive(depth?: number): this;
    /**
     * Define to use the cache for a query
     */
    useCache(key?: string, params?: Record<string, any>): this;
    /**
     * Get where closure for relations
     */
    protected getFieldWhereForRelations(relation: string, callback?: EagerLoadConstraint, operator?: string | number, count?: number): WherePrimaryClosure;
    /**
     * Get all models by id from the store. The difference with the `get` is that this
     * method will not process any query chain.
     */
    protected storeFind(ids?: string[]): Collection<M>;
    /**
     * Get all models from the store. The difference with the `get` is that this
     * method will not process any query chain. It'll always retrieve all models.
     */
    all(): Collection<M>;
    /**
     * Retrieve models by processing whole query chain.
     */
    get<T extends 'group' | 'collection' = 'collection'>(triggerHook?: boolean): T extends 'group' ? GroupedCollection<M> : Collection<M>;
    private internalGet;
    /**
     * Execute the query and get the first result.
     */
    first(): Item<M>;
    /**
     * Find a model by its primary key.
     */
    find(id: string | number): Item<M>;
    find(ids: (string | number)[]): Collection<M>;
    /**
     * Retrieve models by processing all filters set to the query chain.
     */
    select(): Collection<M>;
    /**
     * Filter the given collection by the registered where clause.
     */
    protected filterWhere(models: Collection<M>): Collection<M>;
    /**
     * Get comparator for the where clause.
     */
    protected getWhereComparator(): (model: any) => boolean;
    /**
     * The function to compare where clause to the given model.
     */
    protected whereComparator(model: M, where: Where): boolean;
    /**
     * Filter the given collection by the registered order conditions.
     */
    protected filterOrder(models: Collection<M>): Collection<M>;
    /**
     * Filter the given collection by the registered group conditions.
     */
    protected filterGroup(models: Collection<M>): Record<string, Collection<M>>;
    /**
     * Filter the given collection by the registered limit and offset values.
     */
    protected filterLimit(models: Collection<M>): Collection<M>;
    /**
     * Eager load relations on the model.
     */
    load(models: Collection<M>): void;
    /**
     * Eager load the relationships for the models.
     */
    protected eagerLoadRelations(models: Collection<M>): void;
    /**
     * Eagerly load the relationship on a set of models.
     */
    protected eagerLoadRelation(models: Collection<M>, name: string, constraints: EagerLoadConstraint): void;
    /**
     * Get the relation instance for the given relation name.
     */
    protected getRelation(name: string): Relation;
    revive(schema: Element[]): Collection<M>;
    revive(schema: Element): Item<M>;
    /**
     * Revive single model from the given schema.
     */
    reviveOne(schema: Element): Item<M>;
    /**
     * Revive multiple models from the given schema.
     */
    reviveMany(schema: Element[]): Collection<M>;
    /**
     * Revive relations for the given schema and entity.
     */
    protected reviveRelations(model: M, schema: Element): void;
    /**
     * Create and persist model with default values.
     */
    new(persist?: boolean): M | null;
    /**
     * Save the given records to the store with data normalization.
     */
    save(records: Element[]): M[];
    save(record: Element): M;
    /**
     * Save the given elements to the store.
     */
    saveElements(elements: Elements): void;
    /**
     * Insert the given record to the store.
     */
    insert(records: Element[]): Collection<M>;
    insert(record: Element): M;
    /**
     * Insert the given records to the store by replacing any existing records.
     */
    fresh(records: Element[]): Collection<M>;
    fresh(record: Element): M;
    /**
     * Update the reocrd matching the query chain.
     */
    update(record: Element): Collection<M>;
    /**
     * Destroy the models for the given id.
     */
    destroy(ids: (string | number)[]): Collection<M>;
    destroy(id: string | number): Item<M>;
    protected destroyOne(id: string | number): Item<M>;
    protected destroyMany(ids: (string | number)[]): Collection<M>;
    /**
     * Delete records resolved by the query chain.
     */
    delete(): M[];
    /**
     * Delete all records in the store.
     */
    flush(): Collection<M>;
    protected checkAndDeleteRelations(model: M): void;
    protected dispatchDeleteHooks(models: M | Collection<M>): [{
        (): void;
    }[], string[]];
    /**
     * Get an array of index ids from the given collection.
     */
    protected getIndexIdsFromCollection(models: Collection<M>): string[];
    /**
     * Instantiate new models with the given record.
     */
    protected hydrate(record: Element, options?: ModelOptions): M;
    protected hydrate(records: Element[], options?: ModelOptions): Collection<M>;
    /**
     * Convert given models into an indexed object that is ready to be saved to
     * the store.
     */
    protected compile(models: M | Collection<M>): Elements;
    /**
     * Save already existing models and return them if they exist to prevent
     * an update event trigger in vue if the object is used.
     */
    protected getHydratedModel(record: Element, options?: ModelOptions): M;
}

interface Dictionary {
    [id: string]: Model[];
}
type deleteModes = 'cascade' | 'set null';
declare abstract class Relation extends Attribute {
    /**
     * The parent model.
     */
    parent: Model;
    /**
     * The related model.
     */
    related: Model;
    /**
     * The delete mode
     */
    onDeleteMode?: deleteModes;
    /**
     * Create a new relation instance.
     */
    protected constructor(parent: Model, related: Model);
    /**
     * Get all related models for the relationship.
     */
    abstract getRelateds(): Model[];
    /**
     * Get the related model of the relation.
     */
    getRelated(): Model;
    /**
     * Define the normalizr schema for the relation.
     */
    abstract define(schema: Schema): Schema$1;
    /**
     * Attach the relational key to the given relation.
     */
    abstract attach(record: Element, child: Element): void;
    /**
     * Set the constraints for an eager loading relation.
     */
    abstract addEagerConstraints(query: Query, models: Collection): void;
    /**
     * Match the eagerly loaded results to their parents.
     */
    abstract match(relation: string, models: Collection, query: Query): void;
    /**
     * Get all of the primary keys for an array of models.
     */
    protected getKeys(models: Collection, key: string): (string | number)[];
    /**
     * Specify how this model should behave on delete
     */
    onDelete(mode?: deleteModes): this;
    /**
     * Run a dictionary map over the items.
     */
    protected mapToDictionary(models: Collection, callback: (model: Model) => [string, Model]): Dictionary;
    /**
     * Call a function for a current key match
     */
    protected compositeKeyMapper(foreignKey: PrimaryKey, localKey: PrimaryKey, call: (foreignKey: string, localKey: string) => void): void;
    /**
     * Get the index key defined by the primary key or keys (composite)
     */
    protected getKey(key: PrimaryKey): string;
}

declare class HasOne extends Relation {
    /**
     * The foreign key of the parent model.
     */
    foreignKey: PrimaryKey;
    /**
     * The local key of the parent model.
     */
    localKey: PrimaryKey;
    /**
     * Create a new has-one relation instance.
     */
    constructor(parent: Model, related: Model, foreignKey: PrimaryKey, localKey: PrimaryKey);
    /**
     * Get all related models for the relationship.
     */
    getRelateds(): Model[];
    /**
     * Define the normalizr schema for the relation.
     */
    define(schema: Schema): Schema$1;
    /**
     * Attach the relational key to the given relation.
     */
    attach(record: Element, child: Element): void;
    /**
     * Set the constraints for an eager load of the relation.
     */
    addEagerConstraints(query: Query, models: Collection): void;
    /**
     * Match the eagerly loaded results to their parents.
     */
    match(relation: string, models: Collection, query: Query): void;
    /**
     * Build model dictionary keyed by the relation's foreign key.
     */
    protected buildDictionary(results: Collection): Dictionary;
    /**
     * Make a related model.
     */
    make(element?: Element): Model | null;
}

declare class BelongsTo extends Relation {
    /**
     * The child model instance of the relation.
     */
    child: Model;
    /**
     * The foreign key of the parent model.
     */
    foreignKey: PrimaryKey;
    /**
     * The associated key on the parent model.
     */
    ownerKey: PrimaryKey;
    /**
     * Create a new belongs-to relation instance.
     */
    constructor(parent: Model, child: Model, foreignKey: PrimaryKey, ownerKey: PrimaryKey);
    /**
     * Get all related models for the relationship.
     */
    getRelateds(): Model[];
    /**
     * Define the normalizr schema for the relation.
     */
    define(schema: Schema): Schema$1;
    /**
     * Attach the relational key to the given relation.
     */
    attach(record: Element, child: Element): void;
    /**
     * Set the constraints for an eager load of the relation.
     */
    addEagerConstraints(query: Query, models: Collection): void;
    /**
     * Gather the keys from a collection of related models.
     */
    protected getEagerModelKeys(models: Collection, foreignKey: string): (string | number)[];
    /**
     * Match the eagerly loaded results to their respective parents.
     */
    match(relation: string, models: Collection, query: Query): void;
    /**
     * Build model dictionary keyed by relation's parent key.
     */
    protected buildDictionary(models: Collection): Record<string, Model>;
    /**
     * Make a related model.
     */
    make(element?: Element): Model | null;
}

declare class BelongsToMany extends Relation {
    /**
     * The pivot model.
     */
    pivot: Model;
    /**
     * The foreign key of the parent model.
     */
    foreignPivotKey: string;
    /**
     * The associated key of the relation.
     */
    relatedPivotKey: string;
    /**
     * The key name of the parent model.
     */
    parentKey: string;
    /**
     * The key name of the related model.
     */
    relatedKey: string;
    /**
     * The key name of the pivot data.
     */
    pivotKey: string;
    /**
     * Create a new belongs to instance.
     */
    constructor(parent: Model, related: Model, pivot: Model, foreignPivotKey: string, relatedPivotKey: string, parentKey: string, relatedKey: string);
    /**
     * Get all related models for the relationship.
     */
    getRelateds(): Model[];
    /**
     * Define the normalizr schema for the relationship.
     */
    define(schema: Schema): Schema$1;
    /**
     * Attach the parent type and id to the given relation.
     */
    attach(record: Element, child: Element): void;
    /**
     * Convert given value to the appropriate value for the attribute.
     */
    make(elements?: Element[]): Model[];
    /**
     * Match the eagerly loaded results to their parents.
     */
    match(relation: string, models: Collection, query: Query): void;
    /**
     * Set the constraints for the related relation.
     */
    addEagerConstraints(_query: Query, _collection: Collection): void;
}

declare class HasMany extends Relation {
    /**
     * The foreign key of the parent model.
     */
    foreignKey: PrimaryKey;
    /**
     * The local key of the parent model.
     */
    localKey: PrimaryKey;
    /**
     * Create a new has-many relation instance.
     */
    constructor(parent: Model, related: Model, foreignKey: PrimaryKey, localKey: PrimaryKey);
    /**
     * Get all related models for the relationship.
     */
    getRelateds(): Model[];
    /**
     * Define the normalizr schema for the relation.
     */
    define(schema: Schema): Schema$1;
    /**
     * Attach the relational key to the given relation.
     */
    attach(record: Element, child: Element): void;
    /**
     * Set the constraints for an eager load of the relation.
     */
    addEagerConstraints(query: Query, models: Collection): void;
    /**
     * Match the eagerly loaded results to their parents.
     */
    match(relation: string, models: Collection, query: Query): void;
    /**
     * Build model dictionary keyed by the relation's foreign key.
     */
    protected buildDictionary(results: Collection): Dictionary;
    /**
     * Make related models.
     */
    make(elements?: Element[]): Model[];
}

declare class HasManyBy extends Relation {
    /**
     * The child model instance of the relation.
     */
    child: Model;
    /**
     * The foreign key of the parent model.
     */
    foreignKey: string;
    /**
     * The owner key of the parent model.
     */
    ownerKey: string;
    /**
     * Create a new has-many-by relation instance.
     */
    constructor(parent: Model, child: Model, foreignKey: string, ownerKey: string);
    /**
     * Get all related models for the relationship.
     */
    getRelateds(): Model[];
    /**
     * Define the normalizr schema for the relation.
     */
    define(schema: Schema): Schema$1;
    /**
     * Attach the relational key to the given relation.
     */
    attach(record: Element, child: Element): void;
    /**
     * Push owner key to foregin key array if owner key doesn't exist in foreign
     * key array.
     */
    protected attachIfMissing(foreignKey: (string | number)[], ownerKey: string | number): void;
    /**
     * Set the constraints for an eager load of the relation.
     */
    addEagerConstraints(query: Query, models: Collection): void;
    /**
     * Gather the keys from a collection of related models.
     */
    protected getEagerModelKeys(models: Collection): (string | number)[];
    /**
     * Match the eagerly loaded results to their parents.
     */
    match(relation: string, models: Collection, query: Query): void;
    /**
     * Build model dictionary keyed by the relation's foreign key.
     */
    protected buildDictionary(models: Collection): Record<string, Model>;
    /**
     * Get all related models from the given dictionary.
     */
    protected getRelatedModels(dictionary: Record<string, Model>, keys: (string | number)[]): Model[];
    /**
     * Make related models.
     */
    make(elements?: Element[]): Model[];
}

declare class MorphOne extends Relation {
    /**
     * The field name that contains id of the parent model.
     */
    morphId: string;
    /**
     * The field name that contains type of the parent model.
     */
    morphType: string;
    /**
     * The local key of the model.
     */
    localKey: string;
    /**
     * Create a new morph-one relation instance.
     */
    constructor(parent: Model, related: Model, morphId: string, morphType: string, localKey: string);
    /**
     * Get all related models for the relationship.
     */
    getRelateds(): Model[];
    /**
     * Define the normalizr schema for the relation.
     */
    define(schema: Schema): Schema$1;
    /**
     * Attach the parent type and id to the given relation.
     */
    attach(record: Element, child: Element): void;
    /**
     * Set the constraints for an eager load of the relation.
     */
    addEagerConstraints(query: Query, models: Collection): void;
    /**
     * Match the eagerly loaded results to their parents.
     */
    match(relation: string, models: Collection, query: Query): void;
    /**
     * Build model dictionary keyed by the relation's foreign key.
     */
    protected buildDictionary(models: Collection): Record<string, Model>;
    /**
     * Make a related model.
     */
    make(element?: Element): Model | null;
}

interface DictionaryByEntities {
    [entity: string]: {
        [id: string]: Model;
    };
}
declare class MorphTo extends Relation {
    /**
     * The related models.
     */
    relatedModels: Model[];
    /**
     * The related model dictionary.
     */
    relatedTypes: Record<string, Model>;
    /**
     * The field name that contains id of the parent model.
     */
    morphId: string;
    /**
     * The field name that contains type of the parent model.
     */
    morphType: string;
    /**
     * The associated key of the child model.
     */
    ownerKey: string;
    /**
     * Create a new morph-to relation instance.
     */
    constructor(parent: Model, relatedModels: Model[], morphId: string, morphType: string, ownerKey: string);
    /**
     * Create a dictionary of relations keyed by their entity.
     */
    protected createRelatedTypes(models: Model[]): Record<string, Model>;
    /**
     * Get the type field name.
     */
    getType(): string;
    /**
     * Get all related models for the relationship.
     */
    getRelateds(): Model[];
    /**
     * Define the normalizr schema for the relation.
     */
    define(schema: Schema): Schema$1;
    /**
     * Attach the relational key to the given record. Since morph-to relationship
     * doesn't have any foreign key, it would do nothing.
     */
    attach(_record: Element, _child: Element): void;
    /**
     * Add eager constraints. Since we do not know the related model ahead of time,
     * we cannot add any eager constraints.
     */
    addEagerConstraints(_query: Query, _models: Collection): void;
    /**
     * Find and attach related children to their respective parents.
     */
    match(relation: string, models: Collection, query: Query): void;
    /**
     * Make a related model.
     */
    make(element?: Element, type?: string): Model | null;
    /**
     * Build model dictionary keyed by the owner key for each entity.
     */
    protected buildDictionary(query: Query, models: Collection): DictionaryByEntities;
    /**
     * Get the relation's primary keys grouped by its entity.
     */
    protected getKeysByEntity(models: Collection): Record<string, (string | number)[]>;
}

declare class MorphMany extends Relation {
    /**
     * The field name that contains id of the parent model.
     */
    morphId: string;
    /**
     * The field name that contains type of the parent model.
     */
    morphType: string;
    /**
     * The local key of the model.
     */
    localKey: string;
    /**
     * Create a new morph-many relation instance.
     */
    constructor(parent: Model, related: Model, morphId: string, morphType: string, localKey: string);
    /**
     * Get all related models for the relationship.
     */
    getRelateds(): Model[];
    /**
     * Define the normalizr schema for the relation.
     */
    define(schema: Schema): Schema$1;
    /**
     * Attach the parent type and id to the given relation.
     */
    attach(record: Element, child: Element): void;
    /**
     * Set the constraints for an eager load of the relation.
     */
    addEagerConstraints(query: Query, models: Collection): void;
    /**
     * Match the eagerly loaded results to their parents.
     */
    match(relation: string, models: Collection, query: Query): void;
    /**
     * Build model dictionary keyed by the relation's foreign key.
     */
    protected buildDictionary(results: Collection): Dictionary;
    /**
     * Make related models.
     */
    make(elements?: Element[]): Model[];
}

interface Casts {
    [name: string]: typeof CastAttribute;
}
declare class CastAttribute {
    /**
     * The model instance.
     */
    protected static attributes: ModelFields | undefined;
    /**
     * Cast parameters
     */
    static parameters?: Record<string, any>;
    /**
     * Default parameters
     */
    $parameters?: Record<string, any>;
    /**
     * Create a new Attribute instance.
     */
    constructor(attributes: ModelFields | undefined);
    /**
     * Get the value for return.
     */
    get(value?: any): any;
    /**
     * Set the value for the store.
     */
    set(value?: any): any;
    static withParameters(parameters?: Record<string, any>): typeof CastAttribute;
    /**
     * Get the cast parameters
     */
    getParameters(): Record<string, any> | undefined;
    /**
     * Get the constructor for this cast.
     */
    $self(): typeof CastAttribute;
    /**
     * Generate new instance of cast
     */
    static newRawInstance<M extends typeof CastAttribute>(this: M, attributes: any): InstanceType<M>;
}

declare class HasManyThrough extends Relation {
    /**
     * The "through" parent model.
     */
    through: Model;
    /**
     * The near key on the relationship.
     */
    firstKey: string;
    /**
     * The far key on the relationship.
     */
    secondKey: string;
    /**
     * The local key on the relationship.
     */
    localKey: string;
    /**
     * The local key on the intermediary model.
     */
    secondLocalKey: string;
    /**
     * Create a new has-many-through relation instance.
     */
    constructor(parent: Model, related: Model, through: Model, firstKey: string, secondKey: string, localKey: string, secondLocalKey: string);
    /**
     * Get all related models for the relationship.
     */
    getRelateds(): Model[];
    /**
     * Define the normalizr schema for the relation.
     */
    define(schema: Schema): Schema$1;
    /**
     * Attach the relational key to the given data. Since has many through
     * relationship doesn't have any foreign key, it would do nothing.
     */
    attach(_record: Element, _child: Element): void;
    /**
     * Only register missing through relation
     */
    addEagerConstraints(_query: Query, _models: Collection): void;
    /**
     * Match the eagerly loaded results to their parents.
     */
    match(relation: string, models: Collection, query: Query): void;
    /**
     * Build model dictionary keyed by the relation's foreign key.
     */
    protected buildDictionary(throughResults: Collection, results: Collection): Dictionary;
    /**
     * Make related models.
     */
    make(elements?: Element[]): Model[];
}

declare class MorphToMany extends Relation {
    /**
     * The pivot model.
     */
    pivot: Model;
    /**
     * The field name that contains id of the parent model.
     */
    morphId: string;
    /**
     * The field name that contains type of the parent model.
     */
    morphType: string;
    /**
     * The associated key of the relation.
     */
    relatedId: string;
    /**
     * The key name of the parent model.
     */
    parentKey: string;
    /**
     * The key name of the related model.
     */
    relatedKey: string;
    /**
     * The key name of the pivot data.
     */
    pivotKey: string;
    /**
     * Create a new morph to many to instance.
     */
    constructor(parent: Model, related: Model, pivot: Model, relatedId: string, morphId: string, morphType: string, parentKey: string, relatedKey: string);
    /**
     * Get all related models for the relationship.
     */
    getRelateds(): Model[];
    /**
     * Define the normalizr schema for the relationship.
     */
    define(schema: Schema): Schema$1;
    /**
     * Attach the parent type and id to the given relation.
     */
    attach(record: Element, child: Element): void;
    /**
     * Convert given value to the appropriate value for the attribute.
     */
    make(elements?: Element[]): Model[];
    /**
     * Match the eagerly loaded results to their parents.
     */
    match(relation: string, models: Collection, query: Query): void;
    /**
     * Set the constraints for the related relation.
     */
    addEagerConstraints(_query: Query, _collection: Collection): void;
}

type ModelFields = Record<string, Attribute>;
type ModelSchemas = Record<string, ModelFields>;
type ModelRegistries = Record<string, ModelRegistry>;
type ModelRegistry = Record<string, () => Attribute>;
type PrimaryKey = string | string[];
interface ModelOptions {
    config?: ModelConfigOptions;
    fill?: boolean;
    relations?: boolean;
    operation?: 'set' | 'get';
    visible?: string[];
    hidden?: string[];
    action?: 'save' | 'update' | 'insert';
}
interface MetaValues {
    createdAt: number;
    updatedAt: number;
}
interface BeforeHook {
    (model: typeof Model & any, record?: Element): void | boolean;
}
interface AfterHook {
    (model: typeof Model & any, record?: Element): void;
}
interface InheritanceTypes {
    [key: string]: typeof Model;
}
declare class Model {
    [s: keyof ModelFields]: any;
    _meta: undefined | MetaValues;
    /**
     * The name of the model.
     */
    static entity: string;
    /**
     * The reference to the base entity name if the class extends a base entity.
     */
    static baseEntity: string;
    /**
     * Define a namespace if you have multiple equal entity names.
     * Resulting in "{namespace}/{entity}"
     */
    static namespace: string;
    /**
     * The primary key for the model.
     */
    static primaryKey: string | string[];
    /**
     * The meta key for the model.
     */
    static metaKey: string;
    /**
     * Hidden properties
     */
    static hidden: [keyof ModelFields] | string[];
    /**
     * Visible properties
     */
    static visible: [keyof ModelFields] | string[];
    /**
     * The global install options
     */
    static config: ModelConfigOptions & {
        [key: string]: any;
    };
    /**
     * The type key for the model.
     */
    static typeKey: string;
    /**
     * Behaviour for relational fields on delete.
     */
    static fieldsOnDelete: Record<string, any>;
    /**
     * Original model data.
     */
    protected static original: Record<string, any>;
    /**
     * The schema for the model. It contains the result of the `fields`
     * method or the attributes defined by decorators.
     */
    protected static schemas: ModelSchemas;
    /**
     * The registry for the model. It contains predefined model schema generated
     * by the property decorators and gets evaluated, and stored, on the `schema`
     * property when registering models to the database.
     */
    protected static registries: ModelRegistries;
    /**
     * The pinia options for the model. It can contain options which will passed
     * to the 'defineStore' function of pinia.
     */
    protected static piniaOptions: {};
    /**
     * The mutators for the model.
     */
    protected static fieldMutators: Mutators;
    /**
     * The casts for the model.
     */
    protected static fieldCasts: Record<string, any>;
    /**
     * The array of booted models.
     */
    protected static booted: Record<string, boolean>;
    /**
     * Create a new model instance.
     */
    constructor(attributes?: Element, options?: ModelOptions);
    /**
     * Create a new model fields definition.
     */
    static fields(): ModelFields;
    /**
     * Build the schema by evaluating fields and registry.
     */
    protected static initializeSchema(): void;
    /**
     * Set the attribute to the registry.
     */
    static setRegistry<M extends typeof Model>(this: M, key: string, attribute: () => Attribute): M;
    /**
     * Set delete behaviour for relation field
     */
    static setFieldDeleteMode<M extends typeof Model>(this: M, key: string, mode: deleteModes): M;
    /**
     * Set an mutator for a field
     */
    static setMutator<M extends typeof Model>(this: M, key: string, mutator: MutatorFunctions<any>): M;
    /**
     * Set a cast for a field
     */
    static setCast<M extends typeof Model>(this: M, key: string, to: typeof CastAttribute): M;
    /**
     * Set a field to hidden
     */
    static setHidden<M extends typeof Model>(this: M, key: keyof ModelFields): M;
    /**
     * Clear the list of booted models so they can be re-booted.
     */
    static clearBootedModels(): void;
    /**
     * Clear registries.
     */
    static clearRegistries(): void;
    /**
     * Create a new model instance without field values being populated.
     *
     * This method is mainly for the internal use when registering models to the
     * database. Since all pre-registered models are for referencing its model
     * setting during the various process, but the fields are not required.
     *
     * Use this method when you want create a new model instance for:
     * - Registering model to a component (eg. Repository, Query, etc.)
     * - Registering model to attributes (String, Has Many, etc.)
     */
    static newRawInstance<M extends typeof Model>(this: M): InstanceType<M>;
    /**
     * Create a new Attr attribute instance.
     */
    static attr(value: TypeDefault<any>): Attr;
    /**
     * Create a new String attribute instance.
     */
    static string(value: TypeDefault<string>): String$1;
    /**
     * Create a new Number attribute instance.
     */
    static number(value: TypeDefault<number>): Number;
    /**
     * Create a new Boolean attribute instance.
     */
    static boolean(value: TypeDefault<boolean>): Boolean$1;
    /**
     * Create a new Uid attribute instance.
     */
    static uid(options?: UidOptions): Uid;
    /**
     * Create a new HasOne relation instance.
     */
    static hasOne(related: typeof Model, foreignKey: PrimaryKey, localKey?: PrimaryKey): HasOne;
    /**
     * Create a new BelongsTo relation instance.
     */
    static belongsTo(related: typeof Model, foreignKey: PrimaryKey, ownerKey?: PrimaryKey): BelongsTo;
    /**
     * Create a new HasMany relation instance.
     */
    static belongsToMany(related: typeof Model, pivot: typeof Model, foreignPivotKey: string, relatedPivotKey: string, parentKey?: string, relatedKey?: string): BelongsToMany;
    /**
     * Create a new MorphToMany relation instance.
     */
    static morphToMany(related: typeof Model, pivot: typeof Model, relatedId: string, id: string, type: string, parentKey?: string, relatedKey?: string): MorphToMany;
    /**
     * Create a new HasMany relation instance.
     */
    static hasMany(related: typeof Model, foreignKey: PrimaryKey, localKey?: PrimaryKey): HasMany;
    /**
     * Create a new HasManyBy relation instance.
     */
    static hasManyBy(related: typeof Model, foreignKey: string, ownerKey?: string): HasManyBy;
    /**
     * Create a new HasMany relation instance.
     */
    static hasManyThrough(related: typeof Model, through: typeof Model, firstKey: string, secondKey: string, localKey?: string, secondLocalKey?: string): HasManyThrough;
    /**
     * Create a new MorphOne relation instance.
     */
    static morphOne(related: typeof Model, id: string, type: string, localKey?: string): MorphOne;
    /**
     * Create a new MorphTo relation instance.
     */
    static morphTo(related: typeof Model[], id: string, type: string, ownerKey?: string): MorphTo;
    /**
     * Create a new MorphMany relation instance.
     */
    static morphMany(related: typeof Model, id: string, type: string, localKey?: string): MorphMany;
    /**
     * Lifecycle hook for before saving
     */
    static saving: BeforeHook;
    /**
     * Lifecycle hook for before updating
     */
    static updating: BeforeHook;
    /**
     * Lifecycle hook for before creating
     */
    static creating: BeforeHook;
    /**
     * Lifecycle hook for before deleting
     */
    static deleting: BeforeHook;
    /**
     * Lifecycle hook for after getting data
     */
    static retrieved: AfterHook;
    /**
     * Lifecycle hook for after saved
     */
    static saved: AfterHook;
    /**
     * Lifecycle hook for after updated
     */
    static updated: AfterHook;
    /**
     * Lifecycle hook for after created
     */
    static created: AfterHook;
    /**
     * Lifecycle hook for after deleted
     */
    static deleted: AfterHook;
    /**
     * Mutators to mutate matching fields when instantiating the model.
     */
    static mutators(): Mutators;
    /**
     * Casts to cast matching fields when instantiating the model.
     */
    static casts(): Casts;
    /**
     * Types mapping used to dispatch entities based on their discriminator field
     */
    static types(): InheritanceTypes;
    /**
     * Get the constructor for this model.
     */
    $self(): typeof Model;
    /**
     * Get the entity for this model.
     */
    $entity(): string;
    /**
     * Get the model config.
     */
    $config(): ModelConfigOptions & {
        [key: string]: any;
    };
    /**
     * Get the namespace.
     */
    $namespace(): String;
    /**
     * Get the store name.
     */
    $storeName(): string;
    /**
     * Get the base entity for this model.
     */
    $baseEntity(): string;
    /**
     * Get the type key for this model.
     */
    $typeKey(): string;
    /**
     * Get the types for this model.
     */
    $types(): InheritanceTypes;
    /**
     * Get the pinia options for this model.
     */
    $piniaOptions(): {};
    /**
     * Get the primary key for this model.
     */
    $primaryKey(): string | string[];
    /**
     * Get the model fields for this model.
     */
    $fields(): ModelFields;
    /**
     * Get the model hidden fields
     */
    $hidden(): string[];
    /**
     * Get the model visible fields
     */
    $visible(): string[];
    /**
     * Create a new instance of this model. This method provides a convenient way
     * to re-generate a fresh instance of this model. It's particularly useful
     * during hydration through Query operations.
     */
    $newInstance(attributes?: Element, options?: ModelOptions): this;
    /**
     * Bootstrap this model.
     */
    protected $boot(): void;
    /**
     * Build the schema by evaluating fields and registry.
     */
    protected $initializeSchema(): void;
    $casts(): Casts;
    /**
     * Fill this model by the given attributes. Missing fields will be populated
     * by the attributes default value.
     */
    $fill(attributes?: Element, options?: ModelOptions): this;
    protected $fillMeta(action?: string): void;
    /**
     * Fill the given attribute with a given value specified by the given key.
     */
    protected $fillField(key: string, attr: Attribute, value: any): any;
    protected isFieldVisible(key: string, modelHidden: string[], modelVisible: string[], options: ModelOptions): boolean;
    /**
     * Get the primary key field name.
     */
    $getKeyName(): string | string[];
    /**
     * Get primary key value for the model. If the model has the composite key,
     * it will return an array of ids.
     */
    $getKey(record?: Element, concatCompositeKey?: boolean): string | number | (string | number)[] | null;
    /**
     * Check whether the model has composite key.
     */
    $hasCompositeKey(): boolean;
    /**
     * Get the composite key values for the given model as an array of ids.
     */
    protected $getCompositeKey(record: Element): (string | number)[] | null;
    /**
     * Get the index id of this model or for a given record.
     */
    $getIndexId(record?: Element): string;
    /**
     * Stringify the given id.
     */
    protected $stringifyId(id: string | number | (string | number)[]): string;
    /**
     * Get the local key name for the model.
     */
    $getLocalKey(): string;
    /**
     * Get the relation instance for the given relation name.
     */
    $getRelation(name: string): Relation;
    /**
     * Set the given relationship on the model.
     */
    $setRelation(relation: string, model: Model | Model[] | null): this;
    /**
     * Get the mutators of the model
     */
    $getMutators(): Mutators;
    /**
     * Get the casts of the model
     */
    $getCasts(): Casts;
    /**
     * Get the original values of the model instance
     */
    $getOriginal(): Element;
    /**
     * Return the model instance with its original state
     */
    $refresh(): this;
    /**
     * Checks if attributes were changed
     */
    $isDirty($attribute?: keyof ModelFields): Boolean;
    /**
     * Get the serialized model attributes.
     */
    $getAttributes(): Element;
    /**
     * Serialize this model, or the given model, as POJO.
     */
    $toJson(model?: Model, options?: ModelOptions): Element;
    /**
     * Serialize the given value.
     */
    protected serializeValue(value: any): any;
    /**
     * Serialize the given array to JSON.
     */
    protected serializeArray(value: any[]): any[];
    /**
     * Serialize the given object to JSON.
     */
    protected serializeObject(value: {
        [index: string]: number | string;
    }): object;
    /**
     * Serialize the given relation to JSON.
     */
    protected serializeRelation(relation: Item): Element | null;
    protected serializeRelation(relation: Collection): Element[];
}

type Element = Record<string, any>;
interface Elements {
    [id: string]: Element;
}
interface NormalizedData {
    [entity: string]: Elements;
}
type Item<M extends Model = Model> = M | null;
type Collection<M extends Model = Model> = M[];
type GroupedCollection<M extends Model = Model> = Record<string, M[]>;

interface ModelConstructor<M extends Model> extends Constructor<M> {
    newRawInstance(): M;
}

declare function useDataStore<S extends DataStoreState, T extends DataStore = DataStore>(id: string, options: DefineStoreOptionsBase<S, T>, query?: Query): pinia.StoreDefinition<string, S, {}, {
    save(this: any, records: Elements, triggerQueryAction?: boolean): void;
    insert(this: any, records: Elements, triggerQueryAction?: boolean): void;
    update(this: any, records: Elements, triggerQueryAction?: boolean): void;
    fresh(this: any, records: Elements, triggerQueryAction?: boolean): void;
    destroy(this: any, ids: (string | number)[], triggerQueryAction?: boolean): void;
    delete(this: any, ids: (string | number)[], triggerQueryAction?: boolean): void;
    flush(this: any, _records?: Elements | undefined, triggerQueryAction?: boolean): void;
}>;
interface DataStoreState {
    data: Record<string, any>;
    [s: string]: any;
}
type DataStore = ReturnType<typeof __composables['useDataStore']>;

declare class Repository<M extends Model = Model> {
    [index: string]: any;
    /**
     * A special flag to indicate if this is the repository class or not. It's
     * used when retrieving repository instance from `store.$repo()` method to
     * determine whether the passed in class is either a repository or a model.
     */
    static _isRepository: boolean;
    /**
     * The database instance.
     */
    database: Database;
    /**
     * The model instance.
     */
    protected model: M;
    /**
     * The pinia instance
     */
    protected pinia?: Pinia;
    /**
     * The cache instance
     */
    queryCache?: WeakCache<string, M[]>;
    /**
     * Hydrated models. They are stored to prevent rerendering of child components.
     */
    hydratedDataCache: Map<string, M>;
    /**
     * The model object to be used for the custom repository.
     */
    use?: typeof Model;
    /**
     * The model object to be used for the custom repository.
     */
    static useModel?: Model;
    /**
     * Global config
     */
    config: FilledInstallOptions & {
        [key: string]: any;
    };
    /**
     * Create a new Repository instance.
     */
    constructor(database: Database, pinia?: Pinia);
    /**
     * Set the model
     */
    static setModel(model: Model): typeof Repository;
    /**
     * Set the global config
     */
    setConfig(config: FilledInstallOptions): void;
    /**
     * Initialize the repository by setting the model instance.
     */
    initialize(model?: ModelConstructor<M>): this;
    /**
     * Get the constructor for this model.
     */
    $self(): typeof Repository;
    /**
     * Get the model instance. If the model is not registered to the repository,
     * it will throw an error. It happens when users use a custom repository
     * without setting `use` property.
     */
    getModel(): M;
    /**
     * Returns the pinia store used with this model
     */
    piniaStore<S extends DataStoreState = DataStoreState>(): pinia.Store<string, S, {}, {
        save(this: any, records: Elements, triggerQueryAction?: boolean): void;
        insert(this: any, records: Elements, triggerQueryAction?: boolean): void;
        update(this: any, records: Elements, triggerQueryAction?: boolean): void;
        fresh(this: any, records: Elements, triggerQueryAction?: boolean): void;
        destroy(this: any, ids: (string | number)[], triggerQueryAction?: boolean): void;
        delete(this: any, ids: (string | number)[], triggerQueryAction?: boolean): void;
        flush(this: any, _records?: Elements | undefined, triggerQueryAction?: boolean): void;
    }>;
    /**
     * Create a new repository with the given model.
     */
    repo<M extends Model>(model: Constructor<M>): Repository<M>;
    repo<R extends Repository<any>>(repository: Constructor<R>): R;
    /**
     * Create a new Query instance.
     */
    query(): Query<M>;
    /**
     * Create a new Query instance.
     */
    cache(): WeakCache<string, M[]> | undefined;
    /**
     * Add a basic where clause to the query.
     */
    where(field: WherePrimaryClosure | string, value?: WhereSecondaryClosure | any): Query<M>;
    /**
     * Add an "or where" clause to the query.
     */
    orWhere(field: WherePrimaryClosure | string, value?: WhereSecondaryClosure | any): Query<M>;
    /**
     * Add a "where has" clause to the query.
     */
    whereHas(relation: string, callback?: EagerLoadConstraint, operator?: string | number, count?: number): Query<M>;
    /**
     * Add an "or where has" clause to the query.
     */
    orWhereHas(relation: string, callback?: EagerLoadConstraint, operator?: string | number, count?: number): Query<M>;
    /**
     * Add a "has" clause to the query.
     */
    has(relation: string, operator?: string | number, count?: number): Query<M>;
    /**
     * Add an "or has" clause to the query.
     */
    orHas(relation: string, operator?: string | number, count?: number): Query<M>;
    /**
     * Add a "doesn't have" clause to the query.
     */
    doesntHave(relation: string): Query<M>;
    /**
     * Add a "doesn't have" clause to the query.
     */
    orDoesntHave(relation: string): Query<M>;
    /**
     * Add a "where doesn't have" clause to the query.
     */
    whereDoesntHave(relation: string, callback?: EagerLoadConstraint): Query<M>;
    /**
     * Add an "or where doesn't have" clause to the query.
     */
    orWhereDoesntHave(relation: string, callback?: EagerLoadConstraint): Query<M>;
    /**
     * Make meta field visible
     */
    withMeta(): Query<M>;
    /**
     * Make hidden fields visible
     */
    makeVisible(fields: string[]): Query<M>;
    /**
     * Make visible fields hidden
     */
    makeHidden(fields: string[]): Query<M>;
    /**
     * Add a "group by" clause to the query.
     */
    groupBy(...fields: GroupByFields): Query<M>;
    /**
     * Add an "order by" clause to the query.
     */
    orderBy(field: OrderBy, direction?: OrderDirection): Query<M>;
    /**
     * Set the "limit" value of the query.
     */
    limit(value: number): Query<M>;
    /**
     * Set the "offset" value of the query.
     */
    offset(value: number): Query<M>;
    /**
     * Set the relationships that should be eager loaded.
     */
    with(name: string, callback?: EagerLoadConstraint): Query<M>;
    /**
     * Set to eager load all top-level relationships. Constraint is set for all relationships.
     */
    withAll(callback?: EagerLoadConstraint): Query<M>;
    /**
     * Set to eager load all top-level relationships. Constraint is set for all relationships.
     */
    withAllRecursive(depth?: number): Query<M>;
    /**
     * Define to use the cache for a query
     */
    useCache(key?: string, params?: Record<string, any>): Query<M>;
    /**
     * Get all models from the store.
     */
    all(): Collection<M>;
    /**
     * Find the model with the given id.
     */
    find(id: string | number): Item<M>;
    find(ids: (string | number)[]): Collection<M>;
    /**
     * Retrieves the models from the store by following the given
     * normalized schema.
     */
    revive(schema: Element[]): Collection<M>;
    revive(schema: Element): Item<M>;
    /**
     * Create a new model instance. This method will not save the model to the
     * store. It's pretty much the alternative to `new Model()`, but it injects
     * the store instance to support model instance methods in SSR environment.
     */
    make(records: Element[]): M[];
    make(record?: Element): M;
    save(records: Element[]): M[];
    save(record: Element): M;
    /**
     * Create and persist model with default values.
     */
    new(persist?: boolean): M | null;
    /**
     * Insert the given records to the store.
     */
    insert(records: Element[]): Collection<M>;
    insert(record: Element): M;
    /**
     * Insert the given records to the store by replacing any existing records.
     */
    fresh(records: Element[]): Collection<M>;
    fresh(record: Element): M;
    /**
     * Destroy the models for the given id.
     */
    destroy(ids: (string | number)[]): Collection<M>;
    destroy(id: string | number): Item<M>;
    /**
     * Delete all records in the store.
     */
    flush(): M[];
}

export { CastAttribute as $, type AfterHook as A, type BeforeHook as B, type Constructor as C, type DataStore as D, type Elements as E, type FilledInstallOptions as F, type GroupedCollection as G, Relation as H, type Item as I, BelongsTo as J, BelongsToMany as K, HasMany as L, Model as M, type NormalizedData as N, HasOne as O, type PiniaOrmPluginContext as P, Query as Q, Repository as R, type Schemas as S, HasManyBy as T, HasManyThrough as U, MorphMany as V, WeakCache as W, MorphTo as X, MorphToMany as Y, MorphOne as Z, type Casts as _, type Element as a, type TypeDefault as a0, Type as a1, Interpreter as a2, type Where as a3, type WherePrimaryClosure as a4, type WhereSecondaryClosure as a5, type WhereGroup as a6, type Order as a7, type Group as a8, type OrderBy as a9, type GroupBy as aa, type GroupByFields as ab, type OrderDirection as ac, type EagerLoad as ad, type EagerLoadConstraint as ae, type PropertyDecorator as af, type TypeOptions as ag, type UidOptions as ah, type Mutator as ai, type NanoidOptions as aj, type Collection as b, type DataStoreState as c, type PiniaOrmPlugin as d, definePiniaOrmPlugin as e, type ModelConfigOptions as f, type CacheConfigOptions as g, type InstallOptions as h, type CreatePiniaOrm as i, createORM as j, Database as k, Schema as l, type ModelFields as m, type ModelSchemas as n, type ModelRegistries as o, plugins as p, type ModelRegistry as q, registerPlugins as r, type PrimaryKey as s, type ModelOptions as t, useDataStore as u, type MetaValues as v, type InheritanceTypes as w, Attribute as x, type Dictionary as y, type deleteModes as z };
