import { R as Repository, C as Constructor, M as Model, Q as Query, D as DataStore, E as Elements, W as WeakCache, F as FilledInstallOptions } from './shared/pinia-orm.ed84a779.js';
export { A as AfterHook, x as Attribute, B as BeforeHook, J as BelongsTo, K as BelongsToMany, g as CacheConfigOptions, $ as CastAttribute, _ as Casts, b as Collection, i as CreatePiniaOrm, c as DataStoreState, k as Database, y as Dictionary, ad as EagerLoad, ae as EagerLoadConstraint, a as Element, a8 as Group, aa as GroupBy, ab as GroupByFields, G as GroupedCollection, L as HasMany, T as HasManyBy, U as HasManyThrough, O as HasOne, w as InheritanceTypes, h as InstallOptions, a2 as Interpreter, I as Item, v as MetaValues, f as ModelConfigOptions, m as ModelFields, t as ModelOptions, o as ModelRegistries, q as ModelRegistry, n as ModelSchemas, V as MorphMany, Z as MorphOne, X as MorphTo, Y as MorphToMany, N as NormalizedData, a7 as Order, a9 as OrderBy, ac as OrderDirection, d as PiniaOrmPlugin, P as PiniaOrmPluginContext, s as PrimaryKey, H as Relation, l as Schema, S as Schemas, a1 as Type, a0 as TypeDefault, a3 as Where, a6 as WhereGroup, a4 as WherePrimaryClosure, a5 as WhereSecondaryClosure, j as createORM, e as definePiniaOrmPlugin, z as deleteModes, p as plugins, r as registerPlugins, u as useDataStore } from './shared/pinia-orm.ed84a779.js';
import { Pinia } from 'pinia';
import '@pinia-orm/normalizr';
import '@/composables';

declare function useRepo<R extends Repository>(repository: R | Constructor<R>, pinia?: Pinia): R;
declare function useRepo<M extends Model>(model: Constructor<M>, pinia?: Pinia): Repository<M>;

declare function useStoreActions(query?: Query): {
    save(this: DataStore, records: Elements, triggerQueryAction?: boolean): void;
    insert(this: DataStore, records: Elements, triggerQueryAction?: boolean): void;
    update(this: DataStore, records: Elements, triggerQueryAction?: boolean): void;
    fresh(this: DataStore, records: Elements, triggerQueryAction?: boolean): void;
    destroy(this: DataStore, ids: (string | number)[], triggerQueryAction?: boolean): void;
    /**
     * Commit `delete` change to the store.
     */
    delete(this: DataStore, ids: (string | number)[], triggerQueryAction?: boolean): void;
    flush(this: DataStore, _records?: Elements, triggerQueryAction?: boolean): void;
};

type ModelOrRepository<M extends typeof Model, R extends typeof Repository> = M | R;
type ModelsOrRepositories<M extends typeof Model = any, R extends typeof Repository = any> = Record<string, ModelOrRepository<M, R>>;
type MappedRepositories<MR extends ModelsOrRepositories> = {
    [K in keyof MR]: MR[K] extends typeof Model ? () => Repository<InstanceType<MR[K]>> : () => InstanceType<MR[K]>;
};
/**
 * Map given models or repositories to the Vue Component.
 */
declare function mapRepos<MR extends ModelsOrRepositories>(modelsOrRepositories: MR): MappedRepositories<MR>;

declare const CONFIG_DEFAULTS: {
    model: {
        namespace: string;
        withMeta: boolean;
        hidden: string[];
        visible: string[];
    };
    cache: {
        shared: boolean;
        provider: typeof WeakCache;
    };
};
declare const config: FilledInstallOptions & {
    [key: string]: any;
};

export { CONFIG_DEFAULTS, DataStore, Elements, FilledInstallOptions, type MappedRepositories, Model, type ModelOrRepository, type ModelsOrRepositories, Query, Repository, config, mapRepos, useRepo, useStoreActions };
