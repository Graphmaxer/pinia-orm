import { i as isArray, t as throwError, a as assert, g as generateId, b as isNullish, c as compareWithOperator, d as generateKey, e as isEmpty, f as isFunction, h as groupBy, o as orderBy, j as equals } from './shared/pinia-orm.1bd7d299.mjs';
import { defineStore, acceptHMRUpdate } from 'pinia';
import { schema, normalize } from '@pinia-orm/normalizr';
export { C as CastAttribute } from './shared/pinia-orm.4ff2e12f.mjs';

var __defProp$k = Object.defineProperty;
var __defNormalProp$k = (obj, key, value) => key in obj ? __defProp$k(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$k = (obj, key, value) => {
  __defNormalProp$k(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Attribute {
  /**
   * Create a new Attribute instance.
   */
  constructor(model) {
    /**
     * The model instance.
     */
    __publicField$k(this, "model");
    /**
     * The field name
     */
    __publicField$k(this, "key");
    this.model = model;
    this.key = "";
  }
  /**
   * Set the key name of the field
   */
  setKey(key) {
    this.key = key;
    return this;
  }
}

var __defProp$j = Object.defineProperty;
var __defNormalProp$j = (obj, key, value) => key in obj ? __defProp$j(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$j = (obj, key, value) => {
  __defNormalProp$j(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Relation extends Attribute {
  /**
   * Create a new relation instance.
   */
  constructor(parent, related) {
    super(parent);
    /**
     * The parent model.
     */
    __publicField$j(this, "parent");
    /**
     * The related model.
     */
    __publicField$j(this, "related");
    /**
     * The delete mode
     */
    __publicField$j(this, "onDeleteMode");
    this.parent = parent;
    this.related = related;
  }
  /**
   * Get the related model of the relation.
   */
  getRelated() {
    return this.related;
  }
  /**
   * Get all of the primary keys for an array of models.
   */
  getKeys(models, key) {
    return models.map((model) => model[key]);
  }
  /**
   * Specify how this model should behave on delete
   */
  onDelete(mode) {
    this.onDeleteMode = mode;
    return this;
  }
  /**
   * Run a dictionary map over the items.
   */
  mapToDictionary(models, callback) {
    return models.reduce((dictionary, model) => {
      const [key, value] = callback(model);
      if (!dictionary[key]) {
        dictionary[key] = [];
      }
      dictionary[key].push(value);
      return dictionary;
    }, {});
  }
  /**
   * Call a function for a current key match
   */
  compositeKeyMapper(foreignKey, localKey, call) {
    if (isArray(foreignKey) && isArray(localKey)) {
      foreignKey.forEach((key, index) => {
        call(key, localKey[index]);
      });
    } else if (!isArray(localKey) && !isArray(foreignKey)) {
      call(foreignKey, localKey);
    } else {
      throwError([
        "This relation cant be resolve. Either child or parent doesnt have different key types (composite)",
        JSON.stringify(foreignKey),
        JSON.stringify(localKey)
      ]);
    }
  }
  /**
   * Get the index key defined by the primary key or keys (composite)
   */
  getKey(key) {
    return isArray(key) ? `[${key.join(",")}]` : key;
  }
}

var __defProp$i = Object.defineProperty;
var __defNormalProp$i = (obj, key, value) => key in obj ? __defProp$i(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$i = (obj, key, value) => {
  __defNormalProp$i(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class MorphTo extends Relation {
  /**
   * Create a new morph-to relation instance.
   */
  constructor(parent, relatedModels, morphId, morphType, ownerKey) {
    super(parent, parent);
    /**
     * The related models.
     */
    __publicField$i(this, "relatedModels");
    /**
     * The related model dictionary.
     */
    __publicField$i(this, "relatedTypes");
    /**
     * The field name that contains id of the parent model.
     */
    __publicField$i(this, "morphId");
    /**
     * The field name that contains type of the parent model.
     */
    __publicField$i(this, "morphType");
    /**
     * The associated key of the child model.
     */
    __publicField$i(this, "ownerKey");
    this.relatedModels = relatedModels;
    this.relatedTypes = this.createRelatedTypes(relatedModels);
    this.morphId = morphId;
    this.morphType = morphType;
    this.ownerKey = ownerKey;
  }
  /**
   * Create a dictionary of relations keyed by their entity.
   */
  createRelatedTypes(models) {
    return models.reduce((types, model) => {
      types[model.$entity()] = model;
      return types;
    }, {});
  }
  /**
   * Get the type field name.
   */
  getType() {
    return this.morphType;
  }
  /**
   * Get all related models for the relationship.
   */
  getRelateds() {
    return this.relatedModels;
  }
  /**
   * Define the normalizr schema for the relation.
   */
  define(schema) {
    return schema.union(this.relatedModels, (value, parent, _key) => {
      const type = parent[this.morphType];
      const model = this.relatedTypes[type];
      const key = this.ownerKey || model.$getKeyName();
      parent[this.morphId] = value[key];
      return type;
    });
  }
  /**
   * Attach the relational key to the given record. Since morph-to relationship
   * doesn't have any foreign key, it would do nothing.
   */
  attach(_record, _child) {
  }
  /**
   * Add eager constraints. Since we do not know the related model ahead of time,
   * we cannot add any eager constraints.
   */
  addEagerConstraints(_query, _models) {
  }
  /**
   * Find and attach related children to their respective parents.
   */
  match(relation, models, query) {
    const dictionary = this.buildDictionary(query, models);
    models.forEach((model) => {
      const type = model[this.morphType];
      const id = model[this.morphId];
      const related = dictionary[type]?.[id] ?? null;
      model.$setRelation(relation, related);
    });
  }
  /**
   * Make a related model.
   */
  make(element, type) {
    if (!element || !type) {
      return null;
    }
    return this.relatedTypes[type].$newInstance(element);
  }
  /**
   * Build model dictionary keyed by the owner key for each entity.
   */
  buildDictionary(query, models) {
    const keys = this.getKeysByEntity(models);
    const dictionary = {};
    for (const entity in keys) {
      const model = this.relatedTypes[entity];
      assert(!!model, [
        `Trying to load "morph to" relation of \`${entity}\``,
        "but the model could not be found."
      ]);
      const ownerKey = this.ownerKey || model.$getKeyName();
      const results = query.newQueryWithConstraints(entity).whereIn(ownerKey, keys[entity]).get(false);
      dictionary[entity] = results.reduce(
        (dic, result) => {
          dic[result[ownerKey]] = result;
          return dic;
        },
        {}
      );
    }
    return dictionary;
  }
  /**
   * Get the relation's primary keys grouped by its entity.
   */
  getKeysByEntity(models) {
    return models.reduce((keys, model) => {
      const type = model[this.morphType];
      const id = model[this.morphId];
      if (id !== null && this.relatedTypes[type] !== void 0) {
        if (!keys[type]) {
          keys[type] = [];
        }
        keys[type].push(id);
      }
      return keys;
    }, {});
  }
}

var __defProp$h = Object.defineProperty;
var __defNormalProp$h = (obj, key, value) => key in obj ? __defProp$h(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$h = (obj, key, value) => {
  __defNormalProp$h(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Type extends Attribute {
  /**
   * Create a new Type attribute instance.
   */
  constructor(model, value = null) {
    super(model);
    /**
     * The default value for the attribute.
     */
    __publicField$h(this, "value");
    /**
     * Whether the attribute accepts `null` value or not.
     */
    __publicField$h(this, "isNullable", true);
    this.value = typeof value === "function" ? value() : value;
  }
  /**
   * Set the nullable option to false.
   */
  notNullable() {
    this.isNullable = false;
    return this;
  }
  makeReturn(type, value) {
    if (value === void 0) {
      return this.value;
    }
    if (value === null) {
      if (!this.isNullable) {
        this.throwWarning(["is set as non nullable!"]);
      }
      return value;
    }
    if (typeof value !== type) {
      this.throwWarning([value, "is not a", type]);
    }
    return value;
  }
  /**
   * Throw warning for wrong type
   */
  throwWarning(message) {
    console.warn(["[Pinia ORM]"].concat([`Field ${this.model.$entity()}:${this.key} - `, ...message]).join(" "));
  }
}

var __defProp$g = Object.defineProperty;
var __defNormalProp$g = (obj, key, value) => key in obj ? __defProp$g(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$g = (obj, key, value) => {
  __defNormalProp$g(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Uid extends Type {
  constructor(model, options = {}) {
    super(model);
    __publicField$g(this, "options");
    // This alphabet uses `A-Za-z0-9_-` symbols.
    // The order of characters is optimized for better gzip and brotli compression.
    // References to the same file (works both for gzip and brotli):
    // `'use`, `andom`, and `rict'`
    // References to the brotli default dictionary:
    // `-26T`, `1983`, `40px`, `75px`, `bush`, `jack`, `mind`, `very`, and `wolf`
    __publicField$g(this, "alphabet", "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict");
    __publicField$g(this, "size", 21);
    this.options = typeof options === "number" ? { size: options } : options;
    this.alphabet = this.options.alphabet ?? this.alphabet;
    this.size = this.options.size ?? this.size;
  }
  /**
   * Make the value for the attribute.
   */
  make(value) {
    const uidCast = this.model.$casts()[this.model.$getKeyName()];
    if (uidCast) {
      return value ?? uidCast.withParameters(this.options).newRawInstance(this.model.$fields()).set(value);
    }
    return value ?? generateId(this.size, this.alphabet);
  }
}

var __defProp$f = Object.defineProperty;
var __defNormalProp$f = (obj, key, value) => key in obj ? __defProp$f(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$f = (obj, key, value) => {
  __defNormalProp$f(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Schema {
  /**
   * Create a new Schema instance.
   */
  constructor(model) {
    /**
     * The list of generated schemas.
     */
    __publicField$f(this, "schemas", {});
    /**
     * The model instance.
     */
    __publicField$f(this, "model");
    this.model = model;
  }
  /**
   * Create a single schema.
   */
  one(model, parent) {
    model = model || this.model;
    parent = parent || this.model;
    const entity = `${model.$entity()}${parent.$entity()}`;
    if (this.schemas[entity]) {
      return this.schemas[entity];
    }
    const schema = this.newEntity(model, parent);
    this.schemas[entity] = schema;
    const definition = this.definition(model);
    schema.define(definition);
    return schema;
  }
  /**
   * Create an array schema for the given model.
   */
  many(model, parent) {
    return new schema.Array(this.one(model, parent));
  }
  /**
   * Create an union schema for the given models.
   */
  union(models, callback) {
    const schemas = models.reduce((schemas2, model) => {
      schemas2[model.$entity()] = this.one(model);
      return schemas2;
    }, {});
    return new schema.Union(schemas, callback);
  }
  /**
   * Create a new normalizr entity.
   */
  newEntity(model, parent) {
    const entity = model.$entity();
    const idAttribute = this.idAttribute(model, parent);
    return new schema.Entity(entity, {}, { idAttribute });
  }
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
  idAttribute(model, parent) {
    const uidFields = this.getUidPrimaryKeyPairs(model);
    return (record, parentRecord, key) => {
      if (key !== null) {
        parent.$fields()[key]?.attach(parentRecord, record);
      }
      for (const key2 in uidFields) {
        if (isNullish(record[key2])) {
          record[key2] = uidFields[key2].setKey(key2).make(record[key2]);
        }
      }
      if (["BelongsTo", "HasOne", "MorphOne", "MorphTo"].includes(parent.$fields()[key]?.constructor.name ?? "") && isArray(parentRecord[key])) {
        throwError(['You are passing a list to "', `${parent.$entity()}.${key}`, `" which is a one to one Relation(${parent.$fields()[key]?.constructor.name}):`, JSON.stringify(parentRecord[key])]);
      }
      const id = model.$getIndexId(record);
      return id;
    };
  }
  /**
   * Get all primary keys defined by the Uid attribute for the given model.
   */
  getUidPrimaryKeyPairs(model) {
    const fields = model.$fields();
    const key = model.$getKeyName();
    const keys = isArray(key) ? key : [key];
    const attributes = {};
    keys.forEach((k) => {
      const attr = fields[k];
      if (attr instanceof Uid) {
        attributes[k] = attr;
      }
    });
    return attributes;
  }
  /**
   * Create a definition for the given model.
   */
  definition(model) {
    const fields = model.$fields();
    const definition = {};
    for (const key in fields) {
      const field = fields[key];
      if (field instanceof Relation) {
        definition[key] = field.define(this);
      }
    }
    return definition;
  }
}

var __defProp$e = Object.defineProperty;
var __defNormalProp$e = (obj, key, value) => key in obj ? __defProp$e(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$e = (obj, key, value) => {
  __defNormalProp$e(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Interpreter {
  /**
   * Create a new Interpreter instance.
   */
  constructor(model) {
    /**
     * The model object.
     */
    __publicField$e(this, "model");
    this.model = model;
  }
  process(data) {
    const normalizedData = this.normalize(data);
    return [data, normalizedData];
  }
  /**
   * Normalize the given data.
   */
  normalize(data) {
    const schema = isArray(data) ? [this.getSchema()] : this.getSchema();
    return normalize(data, schema).entities;
  }
  /**
   * Get the schema from the database.
   */
  getSchema() {
    return new Schema(this.model).one();
  }
}

function useStoreActions(query) {
  return {
    save(records, triggerQueryAction = true) {
      this.data = Object.assign({}, this.data, records);
      if (triggerQueryAction && query) {
        query.newQuery(this.$id).save(Object.values(records));
      }
    },
    insert(records, triggerQueryAction = true) {
      this.data = Object.assign({}, this.data, records);
      if (triggerQueryAction && query) {
        query.newQuery(this.$id).insert(Object.values(records));
      }
    },
    update(records, triggerQueryAction = true) {
      this.data = Object.assign({}, this.data, records);
      if (triggerQueryAction && query) {
        query.newQuery(this.$id).update(Object.values(records));
      }
    },
    fresh(records, triggerQueryAction = true) {
      this.data = records;
      if (triggerQueryAction && query) {
        query.newQuery(this.$id).fresh(Object.values(records));
      }
    },
    destroy(ids, triggerQueryAction = true) {
      if (triggerQueryAction && query) {
        query.newQuery(this.$id).newQuery(this.$id).destroy(ids);
      } else {
        ids.forEach((id) => delete this.data[id]);
        if (this.data.__ob__) {
          this.data.__ob__.dep.notify();
        }
      }
    },
    /**
     * Commit `delete` change to the store.
     */
    delete(ids, triggerQueryAction = true) {
      if (triggerQueryAction && query) {
        query.whereId(ids).delete();
      } else {
        ids.forEach((id) => delete this.data[id]);
        if (this.data.__ob__) {
          this.data.__ob__.dep.notify();
        }
      }
    },
    flush(_records, triggerQueryAction = true) {
      this.data = {};
      if (triggerQueryAction && query) {
        query.newQuery(this.$id).flush();
      }
    }
  };
}

function useDataStore(id, options, query) {
  return defineStore(id, {
    state: () => ({ data: {} }),
    actions: useStoreActions(query),
    ...options
  });
}

var __defProp$d = Object.defineProperty;
var __defNormalProp$d = (obj, key, value) => key in obj ? __defProp$d(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$d = (obj, key, value) => {
  __defNormalProp$d(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class BelongsToMany extends Relation {
  /**
   * Create a new belongs to instance.
   */
  constructor(parent, related, pivot, foreignPivotKey, relatedPivotKey, parentKey, relatedKey) {
    super(parent, related);
    /**
     * The pivot model.
     */
    __publicField$d(this, "pivot");
    /**
     * The foreign key of the parent model.
     */
    __publicField$d(this, "foreignPivotKey");
    /**
     * The associated key of the relation.
     */
    __publicField$d(this, "relatedPivotKey");
    /**
     * The key name of the parent model.
     */
    __publicField$d(this, "parentKey");
    /**
     * The key name of the related model.
     */
    __publicField$d(this, "relatedKey");
    /**
     * The key name of the pivot data.
     */
    __publicField$d(this, "pivotKey", "pivot");
    this.pivot = pivot;
    this.foreignPivotKey = foreignPivotKey;
    this.relatedPivotKey = relatedPivotKey;
    this.parentKey = parentKey;
    this.relatedKey = relatedKey;
  }
  /**
   * Get all related models for the relationship.
   */
  getRelateds() {
    return [this.related, this.pivot];
  }
  /**
   * Define the normalizr schema for the relationship.
   */
  define(schema) {
    return schema.many(this.related, this.parent);
  }
  /**
   * Attach the parent type and id to the given relation.
   */
  attach(record, child) {
    const pivot = child.pivot ?? {};
    pivot[this.foreignPivotKey] = record[this.parentKey];
    pivot[this.relatedPivotKey] = child[this.relatedKey];
    child[`pivot_${this.pivot.$entity()}`] = pivot;
  }
  /**
   * Convert given value to the appropriate value for the attribute.
   */
  make(elements) {
    return elements ? elements.map((element) => this.related.$newInstance(element)) : [];
  }
  /**
   * Match the eagerly loaded results to their parents.
   */
  match(relation, models, query) {
    const relatedModels = query.get(false);
    const pivotModels = query.newQuery(this.pivot.$entity()).whereIn(this.relatedPivotKey, this.getKeys(relatedModels, this.relatedKey)).whereIn(this.foreignPivotKey, this.getKeys(models, this.parentKey)).groupBy(this.foreignPivotKey, this.relatedPivotKey).get();
    models.forEach((parentModel) => {
      const relationResults = [];
      relatedModels.forEach((relatedModel) => {
        const pivot = pivotModels[`[${parentModel[this.parentKey]},${relatedModel[this.relatedKey]}]`]?.[0] ?? null;
        const relatedModelCopy = relatedModel.$newInstance(relatedModel.$toJson());
        relatedModelCopy.$setRelation("pivot", pivot);
        if (pivot) {
          relationResults.push(relatedModelCopy);
        }
      });
      parentModel.$setRelation(relation, relationResults);
    });
  }
  /**
   * Set the constraints for the related relation.
   */
  addEagerConstraints(_query, _collection) {
  }
}

var __defProp$c = Object.defineProperty;
var __defNormalProp$c = (obj, key, value) => key in obj ? __defProp$c(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$c = (obj, key, value) => {
  __defNormalProp$c(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Query {
  /**
   * Create a new query instance.
   */
  constructor(database, model, cache, hydratedData, pinia) {
    /**
     * The database instance.
     */
    __publicField$c(this, "database");
    /**
     * The model object.
     */
    __publicField$c(this, "model");
    /**
     * The where constraints for the query.
     */
    __publicField$c(this, "wheres", []);
    /**
     * The orderings for the query.
     */
    __publicField$c(this, "orders", []);
    /**
     * The orderings for the query.
     */
    __publicField$c(this, "groups", []);
    /**
     * The maximum number of records to return.
     */
    __publicField$c(this, "take", null);
    /**
     * The number of records to skip.
     */
    __publicField$c(this, "skip", 0);
    /**
     * Fields that should be visible.
     */
    __publicField$c(this, "visible", ["*"]);
    /**
     * Fields that should be hidden.
     */
    __publicField$c(this, "hidden", []);
    /**
     * The cache object.
     */
    __publicField$c(this, "cache");
    /**
     * The relationships that should be eager loaded.
     */
    __publicField$c(this, "eagerLoad", {});
    /**
     * The pinia store.
     */
    __publicField$c(this, "pinia");
    __publicField$c(this, "fromCache", false);
    __publicField$c(this, "cacheConfig", {});
    __publicField$c(this, "getNewHydrated", false);
    /**
     * Hydrated models. They are stored to prevent rerendering of child components.
     */
    __publicField$c(this, "hydratedDataCache");
    this.database = database;
    this.model = model;
    this.pinia = pinia;
    this.cache = cache;
    this.hydratedDataCache = hydratedData;
    this.getNewHydrated = false;
  }
  /**
   * Create a new query instance for the given model.
   */
  newQuery(model) {
    this.getNewHydrated = true;
    return new Query(this.database, this.database.getModel(model), this.cache, this.hydratedDataCache, this.pinia);
  }
  /**
   * Create a new query instance with constraints for the given model.
   */
  newQueryWithConstraints(model) {
    const newQuery = new Query(this.database, this.database.getModel(model), this.cache, this.hydratedDataCache, this.pinia);
    newQuery.eagerLoad = { ...this.eagerLoad };
    newQuery.wheres = [...this.wheres];
    newQuery.orders = [...this.orders];
    newQuery.take = this.take;
    newQuery.skip = this.skip;
    newQuery.fromCache = this.fromCache;
    newQuery.cacheConfig = this.cacheConfig;
    return newQuery;
  }
  /**
   * Create a new query instance from the given relation.
   */
  newQueryForRelation(relation) {
    return new Query(this.database, relation.getRelated(), this.cache, /* @__PURE__ */ new Map(), this.pinia);
  }
  /**
   * Create a new interpreter instance.
   */
  newInterpreter() {
    return new Interpreter(this.model);
  }
  /**
   * Commit a store action and get the data
   */
  commit(name, payload) {
    const store = useDataStore(this.model.$storeName(), this.model.$piniaOptions(), this)(this.pinia);
    if (import.meta.hot) {
      import.meta.hot.accept(acceptHMRUpdate(store, import.meta.hot));
    }
    if (name && typeof store[name] === "function") {
      store[name](payload, false);
    }
    if (this.cache && ["get", "all", "insert", "flush", "delete", "update", "destroy"].includes(name)) {
      this.cache.clear();
    }
    return store.$state.data;
  }
  /**
   * Make meta field visible
   */
  withMeta() {
    return this.makeVisible(["_meta"]);
  }
  /**
   * Make hidden fields visible
   */
  makeVisible(fields) {
    this.visible = fields;
    this.getNewHydrated = true;
    return this;
  }
  /**
   * Make visible fields hidden
   */
  makeHidden(fields) {
    this.hidden = fields;
    this.getNewHydrated = true;
    return this;
  }
  /**
   * Add a basic where clause to the query.
   */
  where(field, value) {
    this.wheres.push({ field, value, boolean: "and" });
    return this;
  }
  /**
   * Add a "where in" clause to the query.
   */
  whereIn(field, values) {
    if (values instanceof Set) {
      values = Array.from(values);
    }
    this.wheres.push({ field, value: values, boolean: "and" });
    return this;
  }
  /**
   * Add a where clause on the primary key to the query.
   */
  whereId(ids) {
    return this.where(this.model.$getKeyName(), ids);
  }
  /**
   * Add an "or where" clause to the query.
   */
  orWhere(field, value) {
    this.wheres.push({ field, value, boolean: "or" });
    return this;
  }
  /**
   * Add a "where has" clause to the query.
   */
  whereHas(relation, callback = () => {
  }, operator, count) {
    return this.where(this.getFieldWhereForRelations(relation, callback, operator, count));
  }
  /**
   * Add an "or where has" clause to the query.
   */
  orWhereHas(relation, callback = () => {
  }, operator, count) {
    return this.orWhere(this.getFieldWhereForRelations(relation, callback, operator, count));
  }
  /**
   * Add a "has" clause to the query.
   */
  has(relation, operator, count) {
    return this.where(this.getFieldWhereForRelations(relation, () => {
    }, operator, count));
  }
  /**
   * Add an "or has" clause to the query.
   */
  orHas(relation, operator, count) {
    return this.orWhere(this.getFieldWhereForRelations(relation, () => {
    }, operator, count));
  }
  /**
   * Add a "doesn't have" clause to the query.
   */
  doesntHave(relation) {
    return this.where(this.getFieldWhereForRelations(relation, () => {
    }, "=", 0));
  }
  /**
   * Add a "doesn't have" clause to the query.
   */
  orDoesntHave(relation) {
    return this.orWhere(this.getFieldWhereForRelations(relation, () => {
    }, "=", 0));
  }
  /**
   * Add a "where doesn't have" clause to the query.
   */
  whereDoesntHave(relation, callback = () => {
  }) {
    return this.where(this.getFieldWhereForRelations(relation, callback, "=", 0));
  }
  /**
   * Add an "or where doesn't have" clause to the query.
   */
  orWhereDoesntHave(relation, callback = () => {
  }) {
    return this.orWhere(this.getFieldWhereForRelations(relation, callback, "=", 0));
  }
  /**
   * Add a "group by" clause to the query.
   */
  groupBy(...fields) {
    fields.forEach((field) => {
      this.groups.push({ field });
    });
    return this;
  }
  /**
   * Add an "order by" clause to the query.
   */
  orderBy(field, direction = "asc") {
    this.orders.push({ field, direction });
    return this;
  }
  /**
   * Set the "limit" value of the query.
   */
  limit(value) {
    this.take = value;
    return this;
  }
  /**
   * Set the "offset" value of the query.
   */
  offset(value) {
    this.skip = value;
    return this;
  }
  /**
   * Set the relationships that should be eager loaded.
   */
  with(name, callback = () => {
  }) {
    this.getNewHydrated = true;
    this.eagerLoad[name] = callback;
    return this;
  }
  /**
   * Set to eager load all top-level relationships. Constraint is set for all relationships.
   */
  withAll(callback = () => {
  }) {
    let fields = this.model.$fields();
    const typeModels = Object.values(this.model.$types());
    typeModels.forEach((typeModel) => {
      fields = { ...fields, ...typeModel.fields() };
    });
    for (const name in fields) {
      fields[name] instanceof Relation && this.with(name, callback);
    }
    return this;
  }
  /**
   * Set to eager load all relationships recursively.
   */
  withAllRecursive(depth = 3) {
    return this.withAll((query) => {
      depth > 0 && query.withAllRecursive(depth - 1);
    });
  }
  /**
   * Define to use the cache for a query
   */
  useCache(key, params) {
    this.fromCache = true;
    this.cacheConfig = {
      key,
      params
    };
    return this;
  }
  /**
   * Get where closure for relations
   */
  getFieldWhereForRelations(relation, callback = () => {
  }, operator, count) {
    const modelIdsByRelation = this.newQuery(this.model.$entity()).with(relation, callback).get(false).filter((model) => compareWithOperator(
      isArray(model[relation]) ? model[relation].length : model[relation] === null ? 0 : 1,
      typeof operator === "number" ? operator : count ?? 1,
      typeof operator === "number" || count === void 0 ? ">=" : operator
    )).map((model) => model.$getIndexId());
    return (model) => modelIdsByRelation.includes(model.$getIndexId());
  }
  /**
   * Get all models by id from the store. The difference with the `get` is that this
   * method will not process any query chain.
   */
  storeFind(ids = []) {
    const data = this.commit("all");
    const collection = [];
    const deduplicatedIds = new Set(ids);
    if (deduplicatedIds.size > 0) {
      deduplicatedIds.forEach((id) => {
        if (data[id]) {
          collection.push(this.hydrate(data[id], { visible: this.visible, hidden: this.hidden, operation: "get" }));
        }
      });
    } else {
      Object.values(data).forEach((value) => collection.push(this.hydrate(value, { visible: this.visible, hidden: this.hidden, operation: "get" })));
    }
    return collection;
  }
  /**
   * Get all models from the store. The difference with the `get` is that this
   * method will not process any query chain. It'll always retrieve all models.
   */
  all() {
    return this.storeFind();
  }
  get(triggerHook = true) {
    if (!this.fromCache || !this.cache) {
      return this.internalGet(triggerHook);
    }
    const key = this.cacheConfig.key ? this.cacheConfig.key + JSON.stringify(this.cacheConfig.params) : generateKey(this.model.$entity(), {
      where: this.wheres,
      groups: this.groups,
      orders: this.orders,
      eagerLoads: this.eagerLoad,
      skip: this.skip,
      take: this.take,
      hidden: this.hidden,
      visible: this.visible
    });
    const result = this.cache.get(key);
    if (result) {
      return result;
    }
    const queryResult = this.internalGet(triggerHook);
    this.cache.set(key, queryResult);
    return queryResult;
  }
  internalGet(triggerHook) {
    if (this.model.$entity() !== this.model.$baseEntity()) {
      this.where(this.model.$typeKey(), this.model.$fields()[this.model.$typeKey()].make());
    }
    const models = this.select();
    if (!isEmpty(models)) {
      this.eagerLoadRelations(models);
    }
    if (triggerHook) {
      models.forEach((model) => model.$self().retrieved(model));
    }
    if (this.groups.length > 0) {
      return this.filterGroup(models);
    }
    return models;
  }
  /**
   * Execute the query and get the first result.
   */
  first() {
    return this.limit(1).get()[0] ?? null;
  }
  find(ids) {
    return this.whereId(ids)[isArray(ids) ? "get" : "first"]();
  }
  /**
   * Retrieve models by processing all filters set to the query chain.
   */
  select() {
    let ids = [];
    const originalWheres = this.wheres;
    const whereIdsIndex = this.wheres.findIndex((where) => where.field === this.model.$getKeyName());
    if (whereIdsIndex > -1) {
      const whereIds = this.wheres[whereIdsIndex].value;
      ids = ((isFunction(whereIds) ? [] : isArray(whereIds) ? whereIds : [whereIds]) || []).map(String) || [];
      if (ids.length > 0) {
        this.wheres = [...this.wheres.slice(0, whereIdsIndex), ...this.wheres.slice(whereIdsIndex + 1)];
      }
    }
    let models = this.storeFind(ids);
    models = this.filterWhere(models);
    models = this.filterOrder(models);
    models = this.filterLimit(models);
    this.wheres = originalWheres;
    return models;
  }
  /**
   * Filter the given collection by the registered where clause.
   */
  filterWhere(models) {
    if (isEmpty(this.wheres)) {
      return models;
    }
    const comparator = this.getWhereComparator();
    return models.filter((model) => comparator(model));
  }
  /**
   * Get comparator for the where clause.
   */
  getWhereComparator() {
    const { and, or } = groupBy(this.wheres, (where) => where.boolean);
    return (model) => {
      const results = [];
      and && results.push(and.every((w) => this.whereComparator(model, w)));
      or && results.push(or.some((w) => this.whereComparator(model, w)));
      return results.includes(true);
    };
  }
  /**
   * The function to compare where clause to the given model.
   */
  whereComparator(model, where) {
    if (isFunction(where.field)) {
      return where.field(model);
    }
    if (isArray(where.value)) {
      return where.value.includes(model[where.field]);
    }
    if (isFunction(where.value)) {
      return where.value(model[where.field]);
    }
    return model[where.field] === where.value;
  }
  /**
   * Filter the given collection by the registered order conditions.
   */
  filterOrder(models) {
    if (this.orders.length === 0) {
      return models;
    }
    const fields = this.orders.map((order) => order.field);
    const directions = this.orders.map((order) => order.direction);
    return orderBy(models, fields, directions);
  }
  /**
   * Filter the given collection by the registered group conditions.
   */
  filterGroup(models) {
    const grouped = {};
    const fields = this.groups.map((group) => group.field);
    models.forEach((model) => {
      const key = fields.length === 1 ? model[fields[0]] : `[${fields.map((field) => model[field]).toString()}]`;
      grouped[key] = (grouped[key] || []).concat(model);
    });
    return grouped;
  }
  /**
   * Filter the given collection by the registered limit and offset values.
   */
  filterLimit(models) {
    return this.take !== null ? models.slice(this.skip, this.skip + this.take) : models.slice(this.skip);
  }
  /**
   * Eager load relations on the model.
   */
  load(models) {
    this.eagerLoadRelations(models);
  }
  /**
   * Eager load the relationships for the models.
   */
  eagerLoadRelations(models) {
    for (const name in this.eagerLoad) {
      this.eagerLoadRelation(models, name, this.eagerLoad[name]);
    }
  }
  /**
   * Eagerly load the relationship on a set of models.
   */
  eagerLoadRelation(models, name, constraints) {
    const relation = this.getRelation(name);
    const query = this.newQueryForRelation(relation);
    relation.addEagerConstraints(query, models);
    constraints(query);
    relation.match(name, models, query);
  }
  /**
   * Get the relation instance for the given relation name.
   */
  getRelation(name) {
    return this.model.$getRelation(name);
  }
  revive(schema) {
    return isArray(schema) ? this.reviveMany(schema) : this.reviveOne(schema);
  }
  /**
   * Revive single model from the given schema.
   */
  reviveOne(schema) {
    this.getNewHydrated = false;
    const id = this.model.$getIndexId(schema);
    const item = this.commit("get")[id] ?? null;
    if (!item) {
      return null;
    }
    const model = this.hydrate(item, { visible: this.visible, hidden: this.hidden, operation: "get" });
    this.reviveRelations(model, schema);
    return model;
  }
  /**
   * Revive multiple models from the given schema.
   */
  reviveMany(schema) {
    return schema.reduce((collection, item) => {
      const model = this.reviveOne(item);
      model && collection.push(model);
      return collection;
    }, []);
  }
  /**
   * Revive relations for the given schema and entity.
   */
  reviveRelations(model, schema) {
    const fields = this.model.$fields();
    for (const key in schema) {
      const attr = fields[key];
      if (!(attr instanceof Relation)) {
        continue;
      }
      const relatedSchema = schema[key];
      if (!relatedSchema) {
        return;
      }
      if (attr instanceof MorphTo) {
        const relatedType = model[attr.getType()];
        model[key] = this.newQuery(relatedType).reviveOne(relatedSchema);
        continue;
      }
      model[key] = isArray(relatedSchema) ? this.newQueryForRelation(attr).reviveMany(relatedSchema) : this.newQueryForRelation(attr).reviveOne(relatedSchema);
    }
  }
  /**
   * Create and persist model with default values.
   */
  new(persist = true) {
    let model = this.hydrate({}, { operation: persist ? "set" : "get" });
    const isCreating = model.$self().creating(model);
    const isSaving = model.$self().saving(model);
    if (isCreating === false || isSaving === false) {
      return null;
    }
    if (model.$isDirty()) {
      model = this.hydrate(model.$getAttributes(), { operation: persist ? "set" : "get" });
    }
    if (persist) {
      this.hydratedDataCache.set(this.model.$entity() + model.$getKey(void 0, true), this.hydrate(model.$getAttributes(), { operation: "get" }));
      model.$self().created(model);
      model.$self().saved(model);
      this.commit("insert", this.compile(model));
    }
    return model;
  }
  save(records) {
    let processedData = this.newInterpreter().process(records);
    const modelTypes = this.model.$types();
    const isChildEntity = this.model.$baseEntity() !== this.model.$entity();
    if (Object.values(modelTypes).length > 0 || isChildEntity) {
      const modelTypesKeys = Object.keys(modelTypes);
      const recordsByTypes = {};
      records = isArray(records) ? records : [records];
      records.forEach((record) => {
        const recordType = modelTypesKeys.includes(`${record[this.model.$typeKey()]}`) || isChildEntity ? record[this.model.$typeKey()] ?? this.model.$fields()[this.model.$typeKey()].value : modelTypesKeys[0];
        if (!recordsByTypes[recordType]) {
          recordsByTypes[recordType] = [];
        }
        recordsByTypes[recordType].push(record);
      });
      for (const entry in recordsByTypes) {
        const typeModel = modelTypes[entry];
        if (typeModel.entity === this.model.$entity()) {
          processedData = this.newInterpreter().process(recordsByTypes[entry]);
        } else {
          this.newQueryWithConstraints(typeModel.entity).save(recordsByTypes[entry]);
        }
      }
    }
    const [data, entities] = processedData;
    for (const entity in entities) {
      const query = this.newQuery(entity);
      const elements = entities[entity];
      query.saveElements(elements);
    }
    return this.revive(data);
  }
  /**
   * Save the given elements to the store.
   */
  saveElements(elements) {
    const newData = {};
    const currentData = this.commit("all");
    const afterSavingHooks = [];
    for (const id in elements) {
      const record = elements[id];
      const existing = currentData[id];
      let model = existing ? this.hydrate({ ...existing, ...record }, { operation: "set", action: "update" }) : this.hydrate(record, { operation: "set", action: "save" });
      const isSaving = model.$self().saving(model, record);
      const isUpdatingOrCreating = existing ? model.$self().updating(model, record) : model.$self().creating(model, record);
      if (isSaving === false || isUpdatingOrCreating === false) {
        continue;
      }
      if (model.$isDirty()) {
        model = this.hydrate(model.$getAttributes(), { operation: "set", action: existing ? "update" : "save" });
      }
      afterSavingHooks.push(() => model.$self().saved(model, record));
      afterSavingHooks.push(() => existing ? model.$self().updated(model, record) : model.$self().created(model, record));
      newData[id] = model.$getAttributes();
      if (Object.values(model.$types()).length > 0 && !newData[id][model.$typeKey()]) {
        newData[id][model.$typeKey()] = record[model.$typeKey()];
      }
    }
    if (Object.keys(newData).length > 0) {
      this.commit("save", newData);
      afterSavingHooks.forEach((hook) => hook());
    }
  }
  insert(records) {
    const models = this.hydrate(records, { operation: "set", action: "insert" });
    this.commit("insert", this.compile(models));
    return models;
  }
  fresh(records) {
    this.hydratedDataCache.clear();
    const models = this.hydrate(records, { action: "update" });
    this.commit("fresh", this.compile(models));
    return models;
  }
  /**
   * Update the reocrd matching the query chain.
   */
  update(record) {
    const models = this.get(false);
    if (isEmpty(models)) {
      return [];
    }
    const newModels = models.map((model) => {
      const newModel = this.hydrate({ ...model.$getAttributes(), ...record }, { action: "update", operation: "set" });
      if (model.$self().updating(model, record) === false) {
        return model;
      }
      newModel.$self().updated(newModel);
      return newModel;
    });
    this.commit("update", this.compile(newModels));
    return newModels;
  }
  destroy(ids) {
    return isArray(ids) ? this.destroyMany(ids) : this.destroyOne(ids);
  }
  destroyOne(id) {
    const model = this.find(id);
    if (!model) {
      return null;
    }
    const [afterHooks, removeIds] = this.dispatchDeleteHooks(model);
    if (!removeIds.includes(model.$getIndexId())) {
      this.commit("destroy", [model.$getIndexId()]);
      afterHooks.forEach((hook) => hook());
    }
    return model;
  }
  destroyMany(ids) {
    const models = this.find(ids);
    if (isEmpty(models)) {
      return [];
    }
    const [afterHooks, removeIds] = this.dispatchDeleteHooks(models);
    const checkedIds = this.getIndexIdsFromCollection(models).filter((id) => !removeIds.includes(id));
    this.commit("destroy", checkedIds);
    afterHooks.forEach((hook) => hook());
    return models;
  }
  /**
   * Delete records resolved by the query chain.
   */
  delete() {
    const models = this.get(false);
    if (isEmpty(models)) {
      return [];
    }
    const [afterHooks, removeIds] = this.dispatchDeleteHooks(models);
    const ids = this.getIndexIdsFromCollection(models).filter((id) => !removeIds.includes(id));
    this.commit("delete", ids);
    afterHooks.forEach((hook) => hook());
    return models;
  }
  /**
   * Delete all records in the store.
   */
  flush() {
    this.commit("flush");
    this.hydratedDataCache.clear();
    return this.get(false);
  }
  checkAndDeleteRelations(model) {
    const fields = model.$fields();
    for (const name in fields) {
      const relation = fields[name];
      if (fields[name] instanceof Relation && relation.onDeleteMode && model[name]) {
        const models = isArray(model[name]) ? model[name] : [model[name]];
        const relationIds = models.map((relation2) => {
          return relation2.$getKey(void 0, true);
        });
        const record = {};
        if (relation instanceof BelongsToMany) {
          this.newQuery(relation.pivot.$entity()).where(relation.foreignPivotKey, model[model.$getLocalKey()]).delete();
          continue;
        }
        switch (relation.onDeleteMode) {
          case "cascade": {
            this.newQueryForRelation(relation).destroy(relationIds);
            break;
          }
          case "set null": {
            if (relation.foreignKey) {
              record[relation.foreignKey] = null;
            }
            if (relation.morphId) {
              record[relation.morphId] = null;
              record[relation.morphType] = null;
            }
            this.newQueryForRelation(relation).whereId(relationIds).update(record);
            break;
          }
        }
      }
    }
  }
  dispatchDeleteHooks(models) {
    const afterHooks = [];
    const notDeletableIds = [];
    models = isArray(models) ? models : [models];
    this.withAll().load(models);
    models.forEach((currentModel) => {
      const isDeleting = currentModel.$self().deleting(currentModel);
      if (isDeleting === false) {
        notDeletableIds.push(currentModel.$getIndexId());
      } else {
        this.hydratedDataCache.delete(this.model.$entity() + currentModel.$getIndexId());
        afterHooks.push(() => currentModel.$self().deleted(currentModel));
        this.checkAndDeleteRelations(currentModel);
      }
    });
    return [afterHooks, notDeletableIds];
  }
  /**
   * Get an array of index ids from the given collection.
   */
  getIndexIdsFromCollection(models) {
    return models.map((model) => model.$getIndexId());
  }
  hydrate(records, options) {
    return isArray(records) ? records.map((record) => this.hydrate(record, options)) : this.getHydratedModel(records, { relations: false, ...options || {} });
  }
  /**
   * Convert given models into an indexed object that is ready to be saved to
   * the store.
   */
  compile(models) {
    const collection = isArray(models) ? models : [models];
    return collection.reduce((records, model) => {
      records[model.$getIndexId()] = model.$getAttributes();
      return records;
    }, {});
  }
  /**
   * Save already existing models and return them if they exist to prevent
   * an update event trigger in vue if the object is used.
   */
  getHydratedModel(record, options) {
    const id = this.model.$getKey(record, true);
    const savedHydratedModel = id && this.hydratedDataCache.get(this.model.$entity() + id);
    if (!this.getNewHydrated && options?.operation !== "set" && savedHydratedModel) {
      return savedHydratedModel;
    }
    const modelByType = this.model.$types()[record[this.model.$typeKey()]];
    const getNewInsance = (newOptions) => (modelByType ? modelByType.newRawInstance() : this.model).$newInstance(record, { relations: false, ...options || {}, ...newOptions });
    const hydratedModel = getNewInsance();
    if (id && !this.getNewHydrated && options?.operation !== "set") {
      this.hydratedDataCache.set(this.model.$entity() + id, hydratedModel);
    }
    if (id && options?.action === "update") {
      this.hydratedDataCache.set(this.model.$entity() + id, getNewInsance({ operation: "get" }));
    }
    return hydratedModel;
  }
}

var __defProp$b = Object.defineProperty;
var __defNormalProp$b = (obj, key, value) => key in obj ? __defProp$b(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$b = (obj, key, value) => {
  __defNormalProp$b(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var _a, _map;
class WeakCache {
  constructor() {
    // @ts-expect-error dont know
    __publicField$b(this, _a);
    __privateAdd(this, _map, /* @__PURE__ */ new Map());
  }
  has(key) {
    return !!(__privateGet(this, _map).has(key) && __privateGet(this, _map).get(key)?.deref());
  }
  get(key) {
    const weakRef = __privateGet(this, _map).get(key);
    if (!weakRef) {
      return void 0;
    }
    const value = weakRef.deref();
    if (value) {
      return value;
    }
    __privateGet(this, _map).delete(key);
    return void 0;
  }
  set(key, value) {
    __privateGet(this, _map).set(key, new WeakRef(value));
    return this;
  }
  get size() {
    return __privateGet(this, _map).size;
  }
  clear() {
    __privateGet(this, _map).clear();
  }
  delete(key) {
    __privateGet(this, _map).delete(key);
    return false;
  }
  forEach(cb) {
    for (const [key, value] of this) {
      cb(value, key, this);
    }
  }
  *[(_a = Symbol.toStringTag, Symbol.iterator)]() {
    for (const [key, weakRef] of __privateGet(this, _map)) {
      const ref = weakRef.deref();
      if (!ref) {
        __privateGet(this, _map).delete(key);
        continue;
      }
      yield [key, ref];
    }
  }
  *entries() {
    for (const [key, value] of this) {
      yield [key, value];
    }
  }
  *keys() {
    for (const [key] of this) {
      yield key;
    }
  }
  *values() {
    for (const [, value] of this) {
      yield value;
    }
  }
}
_map = new WeakMap();

const cache$1 = new WeakCache();

const cache = /* @__PURE__ */ new Map();

const CONFIG_DEFAULTS = {
  model: {
    namespace: "",
    withMeta: false,
    hidden: ["_meta"],
    visible: ["*"]
  },
  cache: {
    shared: true,
    provider: WeakCache
  }
};
const config = { ...CONFIG_DEFAULTS };

var __defProp$a = Object.defineProperty;
var __defNormalProp$a = (obj, key, value) => key in obj ? __defProp$a(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$a = (obj, key, value) => {
  __defNormalProp$a(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Repository {
  /**
   * Create a new Repository instance.
   */
  constructor(database, pinia) {
    /**
     * The database instance.
     */
    __publicField$a(this, "database");
    /**
     * The model instance.
     */
    __publicField$a(this, "model");
    /**
     * The pinia instance
     */
    __publicField$a(this, "pinia");
    /**
     * The cache instance
     */
    __publicField$a(this, "queryCache");
    /**
     * Hydrated models. They are stored to prevent rerendering of child components.
     */
    __publicField$a(this, "hydratedDataCache");
    /**
     * The model object to be used for the custom repository.
     */
    __publicField$a(this, "use");
    /**
     * Global config
     */
    __publicField$a(this, "config");
    this.config = config;
    this.database = database;
    this.pinia = pinia;
    this.hydratedDataCache = cache;
  }
  /**
   * Set the model
   */
  static setModel(model) {
    this.useModel = model;
    return this;
  }
  /**
   * Set the global config
   */
  setConfig(config) {
    this.config = config;
  }
  /**
   * Initialize the repository by setting the model instance.
   */
  initialize(model) {
    if (this.config.cache && this.config.cache !== true) {
      this.queryCache = this.config.cache.shared ? cache$1 : new this.config.cache.provider();
    }
    if (model) {
      this.model = model.newRawInstance();
      return this;
    }
    if (this.use || this.$self().useModel) {
      this.use = this.use ?? this.$self().useModel;
      this.model = this.use.newRawInstance();
      return this;
    }
    return this;
  }
  /**
   * Get the constructor for this model.
   */
  $self() {
    return this.constructor;
  }
  /**
   * Get the model instance. If the model is not registered to the repository,
   * it will throw an error. It happens when users use a custom repository
   * without setting `use` property.
   */
  getModel() {
    assert(!!this.model, [
      "The model is not registered. Please define the model to be used at",
      "`use` property of the repository class."
    ]);
    return this.model;
  }
  /**
   * Returns the pinia store used with this model
   */
  piniaStore() {
    return useDataStore(this.model.$storeName(), this.model.$piniaOptions(), this.query())(this.pinia);
  }
  repo(modelOrRepository) {
    return useRepo(modelOrRepository);
  }
  /**
   * Create a new Query instance.
   */
  query() {
    return new Query(this.database, this.getModel(), this.queryCache, this.hydratedDataCache, this.pinia);
  }
  /**
   * Create a new Query instance.
   */
  cache() {
    return this.queryCache;
  }
  /**
   * Add a basic where clause to the query.
   */
  where(field, value) {
    return this.query().where(field, value);
  }
  /**
   * Add an "or where" clause to the query.
   */
  orWhere(field, value) {
    return this.query().orWhere(field, value);
  }
  /**
   * Add a "where has" clause to the query.
   */
  whereHas(relation, callback = () => {
  }, operator, count) {
    return this.query().whereHas(relation, callback, operator, count);
  }
  /**
   * Add an "or where has" clause to the query.
   */
  orWhereHas(relation, callback = () => {
  }, operator, count) {
    return this.query().orWhereHas(relation, callback, operator, count);
  }
  /**
   * Add a "has" clause to the query.
   */
  has(relation, operator, count) {
    return this.query().has(relation, operator, count);
  }
  /**
   * Add an "or has" clause to the query.
   */
  orHas(relation, operator, count) {
    return this.query().orHas(relation, operator, count);
  }
  /**
   * Add a "doesn't have" clause to the query.
   */
  doesntHave(relation) {
    return this.query().doesntHave(relation);
  }
  /**
   * Add a "doesn't have" clause to the query.
   */
  orDoesntHave(relation) {
    return this.query().orDoesntHave(relation);
  }
  /**
   * Add a "where doesn't have" clause to the query.
   */
  whereDoesntHave(relation, callback = () => {
  }) {
    return this.query().whereDoesntHave(relation, callback);
  }
  /**
   * Add an "or where doesn't have" clause to the query.
   */
  orWhereDoesntHave(relation, callback = () => {
  }) {
    return this.query().orWhereDoesntHave(relation, callback);
  }
  /**
   * Make meta field visible
   */
  withMeta() {
    return this.query().withMeta();
  }
  /**
   * Make hidden fields visible
   */
  makeVisible(fields) {
    return this.query().makeVisible(fields);
  }
  /**
   * Make visible fields hidden
   */
  makeHidden(fields) {
    return this.query().makeHidden(fields);
  }
  /**
   * Add a "group by" clause to the query.
   */
  groupBy(...fields) {
    return this.query().groupBy(...fields);
  }
  /**
   * Add an "order by" clause to the query.
   */
  orderBy(field, direction) {
    return this.query().orderBy(field, direction);
  }
  /**
   * Set the "limit" value of the query.
   */
  limit(value) {
    return this.query().limit(value);
  }
  /**
   * Set the "offset" value of the query.
   */
  offset(value) {
    return this.query().offset(value);
  }
  /**
   * Set the relationships that should be eager loaded.
   */
  with(name, callback) {
    return this.query().with(name, callback);
  }
  /**
   * Set to eager load all top-level relationships. Constraint is set for all relationships.
   */
  withAll(callback) {
    return this.query().withAll(callback);
  }
  /**
   * Set to eager load all top-level relationships. Constraint is set for all relationships.
   */
  withAllRecursive(depth) {
    return this.query().withAllRecursive(depth);
  }
  /**
   * Define to use the cache for a query
   */
  useCache(key, params) {
    return this.query().useCache(key, params);
  }
  /**
   * Get all models from the store.
   */
  all() {
    return this.query().get();
  }
  find(ids) {
    return this.query().find(ids);
  }
  revive(schema) {
    return this.query().revive(schema);
  }
  make(records) {
    if (isArray(records)) {
      return records.map((record) => this.getModel().$newInstance(record, {
        relations: true
      }));
    }
    return this.getModel().$newInstance(records, {
      relations: true
    });
  }
  save(records) {
    return this.query().save(records);
  }
  /**
   * Create and persist model with default values.
   */
  new(persist = true) {
    return this.query().new(persist);
  }
  insert(records) {
    return this.query().insert(records);
  }
  fresh(records) {
    return this.query().fresh(records);
  }
  destroy(ids) {
    return this.query().destroy(ids);
  }
  /**
   * Delete all records in the store.
   */
  flush() {
    return this.query().flush();
  }
}
/**
 * A special flag to indicate if this is the repository class or not. It's
 * used when retrieving repository instance from `store.$repo()` method to
 * determine whether the passed in class is either a repository or a model.
 */
__publicField$a(Repository, "_isRepository", true);
/**
 * The model object to be used for the custom repository.
 */
__publicField$a(Repository, "useModel");

var __defProp$9 = Object.defineProperty;
var __defNormalProp$9 = (obj, key, value) => key in obj ? __defProp$9(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$9 = (obj, key, value) => {
  __defNormalProp$9(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Database {
  constructor() {
    /**
     * The list of registered models.
     */
    __publicField$9(this, "models", {});
  }
  /**
   * Register the given model.
   */
  register(model) {
    const entity = model.$entity();
    if (!this.models[entity]) {
      this.models[entity] = model;
      this.registerRelatedModels(model);
    }
  }
  /**
   * Register all related models.
   */
  registerRelatedModels(model) {
    const fields = model.$fields();
    for (const name in fields) {
      const attr = fields[name];
      if (attr instanceof Relation) {
        attr.getRelateds().forEach((m) => {
          this.register(m);
        });
      }
    }
  }
  /**
   * Get a model by the specified entity name.
   */
  getModel(name) {
    return this.models[name];
  }
}

const definePiniaOrmPlugin = (plugin) => plugin;
const plugins = [];
function registerPlugins(repository) {
  let config$1 = config;
  plugins.forEach((plugin) => {
    const pluginConfig = plugin({ config: config$1, repository, model: repository.getModel() });
    config$1 = { ...config$1, ...pluginConfig.config };
  });
  repository.setConfig(config$1);
  return repository;
}

function useRepo(ModelOrRepository, pinia) {
  const database = new Database();
  const repository = ModelOrRepository._isRepository ? new ModelOrRepository(database, pinia).initialize() : new Repository(database, pinia).initialize(ModelOrRepository);
  try {
    const typeModels = Object.values(repository.getModel().$types());
    if (typeModels.length > 0) {
      typeModels.forEach((typeModel) => repository.database.register(typeModel.newRawInstance()));
    } else {
      repository.database.register(repository.getModel());
    }
  } catch (e) {
  }
  return registerPlugins(repository);
}

function mapRepos(modelsOrRepositories) {
  const repositories = {};
  for (const name in modelsOrRepositories) {
    repositories[name] = function() {
      return useRepo(modelsOrRepositories[name]);
    };
  }
  return repositories;
}

function createORM(options) {
  config.model = { ...CONFIG_DEFAULTS.model, ...options?.model };
  config.cache = options?.cache === false ? false : { ...CONFIG_DEFAULTS.cache, ...options?.cache !== true && options?.cache };
  const orm = {
    use(plugin) {
      plugins.push(plugin);
      return this;
    }
  };
  return () => orm;
}

class Attr extends Type {
  /**
   * Make the value for the attribute.
   */
  make(value) {
    return value === void 0 ? this.value : value;
  }
}

let String$1 = class String extends Type {
  /**
   * Create a new String attribute instance.
   */
  constructor(model, value) {
    super(model, value);
  }
  /**
   * Make the value for the attribute.
   */
  make(value) {
    return this.makeReturn("string", value);
  }
};

class Number extends Type {
  /**
   * Create a new Number attribute instance.
   */
  constructor(model, value) {
    super(model, value);
  }
  /**
   * Make the value for the attribute.
   */
  make(value) {
    return this.makeReturn("number", value);
  }
}

class Boolean extends Type {
  /**
   * Create a new Boolean attribute instance.
   */
  constructor(model, value) {
    super(model, value);
  }
  /**
   * Make the value for the attribute.
   */
  make(value) {
    return this.makeReturn("boolean", value);
  }
}

var __defProp$8 = Object.defineProperty;
var __defNormalProp$8 = (obj, key, value) => key in obj ? __defProp$8(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$8 = (obj, key, value) => {
  __defNormalProp$8(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class HasOne extends Relation {
  /**
   * Create a new has-one relation instance.
   */
  constructor(parent, related, foreignKey, localKey) {
    super(parent, related);
    /**
     * The foreign key of the parent model.
     */
    __publicField$8(this, "foreignKey");
    /**
     * The local key of the parent model.
     */
    __publicField$8(this, "localKey");
    this.foreignKey = foreignKey;
    this.localKey = localKey;
  }
  /**
   * Get all related models for the relationship.
   */
  getRelateds() {
    return [this.related];
  }
  /**
   * Define the normalizr schema for the relation.
   */
  define(schema) {
    return schema.one(this.related, this.parent);
  }
  /**
   * Attach the relational key to the given relation.
   */
  attach(record, child) {
    this.compositeKeyMapper(
      this.foreignKey,
      this.localKey,
      (foreignKey, localKey) => {
        child[foreignKey] = record[localKey];
      }
    );
  }
  /**
   * Set the constraints for an eager load of the relation.
   */
  addEagerConstraints(query, models) {
    this.compositeKeyMapper(
      this.foreignKey,
      this.localKey,
      (foreignKey, localKey) => query.whereIn(foreignKey, this.getKeys(models, localKey))
    );
  }
  /**
   * Match the eagerly loaded results to their parents.
   */
  match(relation, models, query) {
    const dictionary = this.buildDictionary(query.get(false));
    models.forEach((model) => {
      const key = model[this.getKey(this.localKey)];
      dictionary[key] ? model.$setRelation(relation, dictionary[key][0]) : model.$setRelation(relation, null);
    });
  }
  /**
   * Build model dictionary keyed by the relation's foreign key.
   */
  buildDictionary(results) {
    return this.mapToDictionary(results, (result) => {
      return [result[this.getKey(this.foreignKey)], result];
    });
  }
  /**
   * Make a related model.
   */
  make(element) {
    return element ? this.related.$newInstance(element) : null;
  }
}

var __defProp$7 = Object.defineProperty;
var __defNormalProp$7 = (obj, key, value) => key in obj ? __defProp$7(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$7 = (obj, key, value) => {
  __defNormalProp$7(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class BelongsTo extends Relation {
  /**
   * Create a new belongs-to relation instance.
   */
  constructor(parent, child, foreignKey, ownerKey) {
    super(parent, child);
    /**
     * The child model instance of the relation.
     */
    __publicField$7(this, "child");
    /**
     * The foreign key of the parent model.
     */
    __publicField$7(this, "foreignKey");
    /**
     * The associated key on the parent model.
     */
    __publicField$7(this, "ownerKey");
    this.foreignKey = foreignKey;
    this.ownerKey = ownerKey;
    this.child = child;
  }
  /**
   * Get all related models for the relationship.
   */
  getRelateds() {
    return [this.child];
  }
  /**
   * Define the normalizr schema for the relation.
   */
  define(schema) {
    return schema.one(this.child, this.parent);
  }
  /**
   * Attach the relational key to the given relation.
   */
  attach(record, child) {
    this.compositeKeyMapper(
      this.foreignKey,
      this.ownerKey,
      (foreignKey, ownerKey) => {
        record[foreignKey] = child[ownerKey];
      }
    );
  }
  /**
   * Set the constraints for an eager load of the relation.
   */
  addEagerConstraints(query, models) {
    this.compositeKeyMapper(
      this.foreignKey,
      this.ownerKey,
      (foreignKey, ownerKey) => query.whereIn(ownerKey, this.getEagerModelKeys(models, foreignKey))
    );
  }
  /**
   * Gather the keys from a collection of related models.
   */
  getEagerModelKeys(models, foreignKey) {
    return models.reduce((keys, model) => {
      if (model[foreignKey] !== null) {
        keys.push(model[foreignKey]);
      }
      return keys;
    }, []);
  }
  /**
   * Match the eagerly loaded results to their respective parents.
   */
  match(relation, models, query) {
    const dictionary = this.buildDictionary(query.get(false));
    models.forEach((model) => {
      const key = model[this.getKey(this.foreignKey)];
      dictionary[key] ? model.$setRelation(relation, dictionary[key]) : model.$setRelation(relation, null);
    });
  }
  /**
   * Build model dictionary keyed by relation's parent key.
   */
  buildDictionary(models) {
    return models.reduce((dictionary, model) => {
      dictionary[model[this.getKey(this.ownerKey)]] = model;
      return dictionary;
    }, {});
  }
  /**
   * Make a related model.
   */
  make(element) {
    return element ? this.child.$newInstance(element) : null;
  }
}

var __defProp$6 = Object.defineProperty;
var __defNormalProp$6 = (obj, key, value) => key in obj ? __defProp$6(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$6 = (obj, key, value) => {
  __defNormalProp$6(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class HasMany extends Relation {
  /**
   * Create a new has-many relation instance.
   */
  constructor(parent, related, foreignKey, localKey) {
    super(parent, related);
    /**
     * The foreign key of the parent model.
     */
    __publicField$6(this, "foreignKey");
    /**
     * The local key of the parent model.
     */
    __publicField$6(this, "localKey");
    this.foreignKey = foreignKey;
    this.localKey = localKey;
  }
  /**
   * Get all related models for the relationship.
   */
  getRelateds() {
    return [this.related];
  }
  /**
   * Define the normalizr schema for the relation.
   */
  define(schema) {
    return schema.many(this.related, this.parent);
  }
  /**
   * Attach the relational key to the given relation.
   */
  attach(record, child) {
    this.compositeKeyMapper(
      this.foreignKey,
      this.localKey,
      (foreignKey, localKey) => {
        child[foreignKey] = record[localKey];
      }
    );
  }
  /**
   * Set the constraints for an eager load of the relation.
   */
  addEagerConstraints(query, models) {
    this.compositeKeyMapper(
      this.foreignKey,
      this.localKey,
      (foreignKey, localKey) => query.whereIn(foreignKey, this.getKeys(models, localKey))
    );
  }
  /**
   * Match the eagerly loaded results to their parents.
   */
  match(relation, models, query) {
    const dictionary = this.buildDictionary(query.get(false));
    models.forEach((model) => {
      const key = model[this.getKey(this.localKey)];
      dictionary[key] ? model.$setRelation(relation, dictionary[key]) : model.$setRelation(relation, []);
    });
  }
  /**
   * Build model dictionary keyed by the relation's foreign key.
   */
  buildDictionary(results) {
    return this.mapToDictionary(results, (result) => {
      const key = this.getKey(this.foreignKey);
      return [result[key], result];
    });
  }
  /**
   * Make related models.
   */
  make(elements) {
    return elements ? elements.map((element) => this.related.$newInstance(element)) : [];
  }
}

var __defProp$5 = Object.defineProperty;
var __defNormalProp$5 = (obj, key, value) => key in obj ? __defProp$5(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$5 = (obj, key, value) => {
  __defNormalProp$5(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class HasManyBy extends Relation {
  /**
   * Create a new has-many-by relation instance.
   */
  constructor(parent, child, foreignKey, ownerKey) {
    super(parent, child);
    /**
     * The child model instance of the relation.
     */
    __publicField$5(this, "child");
    /**
     * The foreign key of the parent model.
     */
    __publicField$5(this, "foreignKey");
    /**
     * The owner key of the parent model.
     */
    __publicField$5(this, "ownerKey");
    this.foreignKey = foreignKey;
    this.ownerKey = ownerKey;
    this.child = child;
  }
  /**
   * Get all related models for the relationship.
   */
  getRelateds() {
    return [this.child];
  }
  /**
   * Define the normalizr schema for the relation.
   */
  define(schema) {
    return schema.many(this.child, this.parent);
  }
  /**
   * Attach the relational key to the given relation.
   */
  attach(record, child) {
    if (child[this.ownerKey] === void 0) {
      return;
    }
    if (!record[this.foreignKey]) {
      record[this.foreignKey] = [];
    }
    this.attachIfMissing(record[this.foreignKey], child[this.ownerKey]);
  }
  /**
   * Push owner key to foregin key array if owner key doesn't exist in foreign
   * key array.
   */
  attachIfMissing(foreignKey, ownerKey) {
    if (!foreignKey.includes(ownerKey)) {
      foreignKey.push(ownerKey);
    }
  }
  /**
   * Set the constraints for an eager load of the relation.
   */
  addEagerConstraints(query, models) {
    query.whereIn(this.ownerKey, this.getEagerModelKeys(models));
  }
  /**
   * Gather the keys from a collection of related models.
   */
  getEagerModelKeys(models) {
    return models.reduce((keys, model) => {
      return [...keys, ...model[this.foreignKey]];
    }, []);
  }
  /**
   * Match the eagerly loaded results to their parents.
   */
  match(relation, models, query) {
    const dictionary = this.buildDictionary(query.get(false));
    models.forEach((model) => {
      const relatedModels = this.getRelatedModels(
        dictionary,
        model[this.foreignKey]
      );
      model.$setRelation(relation, relatedModels);
    });
  }
  /**
   * Build model dictionary keyed by the relation's foreign key.
   */
  buildDictionary(models) {
    return models.reduce((dictionary, model) => {
      dictionary[model[this.ownerKey]] = model;
      return dictionary;
    }, {});
  }
  /**
   * Get all related models from the given dictionary.
   */
  getRelatedModels(dictionary, keys) {
    return keys.reduce((items, key) => {
      const item = dictionary[key];
      item && items.push(item);
      return items;
    }, []);
  }
  /**
   * Make related models.
   */
  make(elements) {
    return elements ? elements.map((element) => this.child.$newInstance(element)) : [];
  }
}

var __defProp$4 = Object.defineProperty;
var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$4 = (obj, key, value) => {
  __defNormalProp$4(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class MorphOne extends Relation {
  /**
   * Create a new morph-one relation instance.
   */
  constructor(parent, related, morphId, morphType, localKey) {
    super(parent, related);
    /**
     * The field name that contains id of the parent model.
     */
    __publicField$4(this, "morphId");
    /**
     * The field name that contains type of the parent model.
     */
    __publicField$4(this, "morphType");
    /**
     * The local key of the model.
     */
    __publicField$4(this, "localKey");
    this.morphId = morphId;
    this.morphType = morphType;
    this.localKey = localKey;
  }
  /**
   * Get all related models for the relationship.
   */
  getRelateds() {
    return [this.related];
  }
  /**
   * Define the normalizr schema for the relation.
   */
  define(schema) {
    return schema.one(this.related, this.parent);
  }
  /**
   * Attach the parent type and id to the given relation.
   */
  attach(record, child) {
    child[this.morphId] = record[this.localKey];
    child[this.morphType] = this.parent.$entity();
  }
  /**
   * Set the constraints for an eager load of the relation.
   */
  addEagerConstraints(query, models) {
    query.where(this.morphType, this.parent.$entity()).whereIn(this.morphId, this.getKeys(models, this.localKey));
  }
  /**
   * Match the eagerly loaded results to their parents.
   */
  match(relation, models, query) {
    const dictionary = this.buildDictionary(query.get(false));
    models.forEach((model) => {
      const key = model[this.localKey];
      dictionary[key] ? model.$setRelation(relation, dictionary[key]) : model.$setRelation(relation, null);
    });
  }
  /**
   * Build model dictionary keyed by the relation's foreign key.
   */
  buildDictionary(models) {
    return models.reduce((dictionary, model) => {
      dictionary[model[this.morphId]] = model;
      return dictionary;
    }, {});
  }
  /**
   * Make a related model.
   */
  make(element) {
    return element ? this.related.$newInstance(element) : null;
  }
}

var __defProp$3 = Object.defineProperty;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$3 = (obj, key, value) => {
  __defNormalProp$3(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class MorphMany extends Relation {
  /**
   * Create a new morph-many relation instance.
   */
  constructor(parent, related, morphId, morphType, localKey) {
    super(parent, related);
    /**
     * The field name that contains id of the parent model.
     */
    __publicField$3(this, "morphId");
    /**
     * The field name that contains type of the parent model.
     */
    __publicField$3(this, "morphType");
    /**
     * The local key of the model.
     */
    __publicField$3(this, "localKey");
    this.morphId = morphId;
    this.morphType = morphType;
    this.localKey = localKey;
  }
  /**
   * Get all related models for the relationship.
   */
  getRelateds() {
    return [this.related];
  }
  /**
   * Define the normalizr schema for the relation.
   */
  define(schema) {
    return schema.many(this.related, this.parent);
  }
  /**
   * Attach the parent type and id to the given relation.
   */
  attach(record, child) {
    child[this.morphId] = record[this.localKey];
    child[this.morphType] = this.parent.$entity();
  }
  /**
   * Set the constraints for an eager load of the relation.
   */
  addEagerConstraints(query, models) {
    query.where(this.morphType, this.parent.$entity());
    query.whereIn(this.morphId, this.getKeys(models, this.localKey));
  }
  /**
   * Match the eagerly loaded results to their parents.
   */
  match(relation, models, query) {
    const dictionary = this.buildDictionary(query.get(false));
    models.forEach((model) => {
      const key = model[this.localKey];
      dictionary[key] ? model.$setRelation(relation, dictionary[key]) : model.$setRelation(relation, []);
    });
  }
  /**
   * Build model dictionary keyed by the relation's foreign key.
   */
  buildDictionary(results) {
    return this.mapToDictionary(results, (result) => {
      return [result[this.morphId], result];
    });
  }
  /**
   * Make related models.
   */
  make(elements) {
    return elements ? elements.map((element) => this.related.$newInstance(element)) : [];
  }
}

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => {
  __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class HasManyThrough extends Relation {
  /**
   * Create a new has-many-through relation instance.
   */
  constructor(parent, related, through, firstKey, secondKey, localKey, secondLocalKey) {
    super(parent, related);
    /**
     * The "through" parent model.
     */
    __publicField$2(this, "through");
    /**
     * The near key on the relationship.
     */
    __publicField$2(this, "firstKey");
    /**
     * The far key on the relationship.
     */
    __publicField$2(this, "secondKey");
    /**
     * The local key on the relationship.
     */
    __publicField$2(this, "localKey");
    /**
     * The local key on the intermediary model.
     */
    __publicField$2(this, "secondLocalKey");
    this.through = through;
    this.firstKey = firstKey;
    this.secondKey = secondKey;
    this.localKey = localKey;
    this.secondLocalKey = secondLocalKey;
  }
  /**
   * Get all related models for the relationship.
   */
  getRelateds() {
    return [this.related, this.through];
  }
  /**
   * Define the normalizr schema for the relation.
   */
  define(schema) {
    return schema.many(this.related, this.parent);
  }
  /**
   * Attach the relational key to the given data. Since has many through
   * relationship doesn't have any foreign key, it would do nothing.
   */
  attach(_record, _child) {
  }
  /**
   * Only register missing through relation
   */
  addEagerConstraints(_query, _models) {
  }
  /**
   * Match the eagerly loaded results to their parents.
   */
  match(relation, models, query) {
    const throughModels = query.newQuery(this.through.$entity()).where(this.firstKey, this.getKeys(models, this.localKey)).get(false);
    const relatedModels = query.where(this.secondKey, this.getKeys(throughModels, this.secondLocalKey)).groupBy(this.secondKey).get(false);
    const dictionary = this.buildDictionary(throughModels, relatedModels);
    models.forEach((model) => {
      const key = model[this.localKey];
      dictionary[key] ? model.$setRelation(relation, dictionary[key][0]) : model.$setRelation(relation, []);
    });
  }
  /**
   * Build model dictionary keyed by the relation's foreign key.
   */
  buildDictionary(throughResults, results) {
    return this.mapToDictionary(throughResults, (throughResult) => {
      return [throughResult[this.firstKey], results[throughResult[this.secondLocalKey]]];
    });
  }
  /**
   * Make related models.
   */
  make(elements) {
    return elements ? elements.map((element) => this.related.$newInstance(element)) : [];
  }
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => {
  __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class MorphToMany extends Relation {
  /**
   * Create a new morph to many to instance.
   */
  constructor(parent, related, pivot, relatedId, morphId, morphType, parentKey, relatedKey) {
    super(parent, related);
    /**
     * The pivot model.
     */
    __publicField$1(this, "pivot");
    /**
     * The field name that contains id of the parent model.
     */
    __publicField$1(this, "morphId");
    /**
     * The field name that contains type of the parent model.
     */
    __publicField$1(this, "morphType");
    /**
     * The associated key of the relation.
     */
    __publicField$1(this, "relatedId");
    /**
     * The key name of the parent model.
     */
    __publicField$1(this, "parentKey");
    /**
     * The key name of the related model.
     */
    __publicField$1(this, "relatedKey");
    /**
     * The key name of the pivot data.
     */
    __publicField$1(this, "pivotKey", "pivot");
    this.pivot = pivot;
    this.morphId = morphId;
    this.morphType = morphType;
    this.relatedId = relatedId;
    this.parentKey = parentKey;
    this.relatedKey = relatedKey;
  }
  /**
   * Get all related models for the relationship.
   */
  getRelateds() {
    return [this.related, this.pivot];
  }
  /**
   * Define the normalizr schema for the relationship.
   */
  define(schema) {
    return schema.many(this.related, this.parent);
  }
  /**
   * Attach the parent type and id to the given relation.
   */
  attach(record, child) {
    const pivot = child.pivot ?? {};
    pivot[this.morphId] = record[this.parentKey];
    pivot[this.morphType] = this.parent.$entity();
    pivot[this.relatedId] = child[this.relatedKey];
    child[`pivot_${this.pivot.$entity()}`] = pivot;
  }
  /**
   * Convert given value to the appropriate value for the attribute.
   */
  make(elements) {
    return elements ? elements.map((element) => this.related.$newInstance(element)) : [];
  }
  /**
   * Match the eagerly loaded results to their parents.
   */
  match(relation, models, query) {
    const relatedModels = query.get(false);
    const pivotModels = query.newQuery(this.pivot.$entity()).whereIn(this.relatedId, this.getKeys(relatedModels, this.relatedKey)).whereIn(this.morphId, this.getKeys(models, this.parentKey)).groupBy(this.morphId, this.relatedId, this.morphType).get();
    models.forEach((parentModel) => {
      const relationResults = [];
      relatedModels.forEach((relatedModel) => {
        const pivot = pivotModels[`[${parentModel[this.parentKey]},${relatedModel[this.relatedKey]},${this.parent.$entity()}]`]?.[0] ?? null;
        const relatedModelCopy = relatedModel.$newInstance(relatedModel.$toJson());
        relatedModelCopy.$setRelation("pivot", pivot);
        if (pivot) {
          relationResults.push(relatedModelCopy);
        }
      });
      parentModel.$setRelation(relation, relationResults);
    });
  }
  /**
   * Set the constraints for the related relation.
   */
  addEagerConstraints(_query, _collection) {
  }
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Model {
  /**
   * Create a new model instance.
   */
  constructor(attributes, options = { operation: "set" }) {
    this.$boot();
    const fill = options.fill ?? true;
    fill && this.$fill(attributes, options);
  }
  /**
   * Create a new model fields definition.
   */
  static fields() {
    return {};
  }
  /**
   * Build the schema by evaluating fields and registry.
   */
  static initializeSchema() {
    this.schemas[this.entity] = {};
    this.fieldsOnDelete[this.entity] = this.fieldsOnDelete[this.entity] ?? {};
    const registry = {
      ...this.fields(),
      ...this.registries[this.entity]
    };
    for (const key in registry) {
      const attribute = registry[key];
      this.schemas[this.entity][key] = typeof attribute === "function" ? attribute() : attribute;
      if (this.fieldsOnDelete[this.entity][key]) {
        this.schemas[this.entity][key] = this.schemas[this.entity][key].onDelete(this.fieldsOnDelete[this.entity][key]);
      }
    }
  }
  /**
   * Set the attribute to the registry.
   */
  static setRegistry(key, attribute) {
    if (!this.registries[this.entity]) {
      this.registries[this.entity] = {};
    }
    this.registries[this.entity][key] = attribute;
    return this;
  }
  /**
   * Set delete behaviour for relation field
   */
  static setFieldDeleteMode(key, mode) {
    this.fieldsOnDelete[this.entity] = this.fieldsOnDelete[this.entity] ?? {};
    this.fieldsOnDelete[this.entity][key] = mode;
    return this;
  }
  /**
   * Set an mutator for a field
   */
  static setMutator(key, mutator) {
    this.fieldMutators[key] = mutator;
    return this;
  }
  /**
   * Set a cast for a field
   */
  static setCast(key, to) {
    this.fieldCasts[key] = to;
    return this;
  }
  /**
   * Set a field to hidden
   */
  static setHidden(key) {
    this.hidden.push(key);
    return this;
  }
  /**
   * Clear the list of booted models so they can be re-booted.
   */
  static clearBootedModels() {
    this.booted = {};
    this.original = {};
    this.schemas = {};
    this.fieldMutators = {};
    this.fieldCasts = {};
    this.hidden = [];
    this.visible = [];
  }
  /**
   * Clear registries.
   */
  static clearRegistries() {
    this.registries = {};
  }
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
  static newRawInstance() {
    return new this(void 0, { fill: false });
  }
  /**
   * Create a new Attr attribute instance.
   */
  static attr(value) {
    return new Attr(this.newRawInstance(), value);
  }
  /**
   * Create a new String attribute instance.
   */
  static string(value) {
    return new String$1(this.newRawInstance(), value);
  }
  /**
   * Create a new Number attribute instance.
   */
  static number(value) {
    return new Number(this.newRawInstance(), value);
  }
  /**
   * Create a new Boolean attribute instance.
   */
  static boolean(value) {
    return new Boolean(this.newRawInstance(), value);
  }
  /**
   * Create a new Uid attribute instance.
   */
  static uid(options) {
    return new Uid(this.newRawInstance(), options);
  }
  /**
   * Create a new HasOne relation instance.
   */
  static hasOne(related, foreignKey, localKey) {
    const model = this.newRawInstance();
    localKey = localKey ?? model.$getKeyName();
    return new HasOne(model, related.newRawInstance(), foreignKey, localKey);
  }
  /**
   * Create a new BelongsTo relation instance.
   */
  static belongsTo(related, foreignKey, ownerKey) {
    const instance = related.newRawInstance();
    ownerKey = ownerKey ?? instance.$getKeyName();
    return new BelongsTo(this.newRawInstance(), instance, foreignKey, ownerKey);
  }
  /**
   * Create a new HasMany relation instance.
   */
  static belongsToMany(related, pivot, foreignPivotKey, relatedPivotKey, parentKey, relatedKey) {
    const instance = related.newRawInstance();
    const model = this.newRawInstance();
    const pivotInstance = pivot.newRawInstance();
    parentKey = parentKey ?? model.$getLocalKey();
    relatedKey = relatedKey ?? instance.$getLocalKey();
    this.schemas[related.entity][`pivot_${pivotInstance.$entity()}`] = new HasOne(instance, pivotInstance, relatedPivotKey, relatedKey);
    return new BelongsToMany(
      model,
      instance,
      pivotInstance,
      foreignPivotKey,
      relatedPivotKey,
      parentKey,
      relatedKey
    );
  }
  /**
   * Create a new MorphToMany relation instance.
   */
  static morphToMany(related, pivot, relatedId, id, type, parentKey, relatedKey) {
    const instance = related.newRawInstance();
    const model = this.newRawInstance();
    const pivotInstance = pivot.newRawInstance();
    parentKey = parentKey ?? model.$getLocalKey();
    relatedKey = relatedKey ?? instance.$getLocalKey();
    this.schemas[related.entity][`pivot_${pivotInstance.$entity()}`] = new MorphOne(instance, pivotInstance, relatedId, model.$entity(), relatedKey);
    return new MorphToMany(
      model,
      instance,
      pivotInstance,
      relatedId,
      id,
      type,
      parentKey,
      relatedKey
    );
  }
  /**
   * Create a new HasMany relation instance.
   */
  static hasMany(related, foreignKey, localKey) {
    const model = this.newRawInstance();
    localKey = localKey ?? model.$getKeyName();
    return new HasMany(model, related.newRawInstance(), foreignKey, localKey);
  }
  /**
   * Create a new HasManyBy relation instance.
   */
  static hasManyBy(related, foreignKey, ownerKey) {
    const instance = related.newRawInstance();
    ownerKey = ownerKey ?? instance.$getLocalKey();
    return new HasManyBy(this.newRawInstance(), instance, foreignKey, ownerKey);
  }
  /**
   * Create a new HasMany relation instance.
   */
  static hasManyThrough(related, through, firstKey, secondKey, localKey, secondLocalKey) {
    const model = this.newRawInstance();
    const throughModel = through.newRawInstance();
    localKey = localKey ?? model.$getLocalKey();
    secondLocalKey = secondLocalKey ?? throughModel.$getLocalKey();
    return new HasManyThrough(model, related.newRawInstance(), throughModel, firstKey, secondKey, localKey, secondLocalKey);
  }
  /**
   * Create a new MorphOne relation instance.
   */
  static morphOne(related, id, type, localKey) {
    const model = this.newRawInstance();
    localKey = localKey ?? model.$getLocalKey();
    return new MorphOne(model, related.newRawInstance(), id, type, localKey);
  }
  /**
   * Create a new MorphTo relation instance.
   */
  static morphTo(related, id, type, ownerKey = "") {
    const instance = this.newRawInstance();
    const relatedModels = related.map((model) => model.newRawInstance());
    return new MorphTo(instance, relatedModels, id, type, ownerKey);
  }
  /**
   * Create a new MorphMany relation instance.
   */
  static morphMany(related, id, type, localKey) {
    const model = this.newRawInstance();
    localKey = localKey ?? model.$getLocalKey();
    return new MorphMany(model, related.newRawInstance(), id, type, localKey);
  }
  /**
   * Mutators to mutate matching fields when instantiating the model.
   */
  static mutators() {
    return {};
  }
  /**
   * Casts to cast matching fields when instantiating the model.
   */
  static casts() {
    return {};
  }
  /**
   * Types mapping used to dispatch entities based on their discriminator field
   */
  static types() {
    return {};
  }
  /**
   * Get the constructor for this model.
   */
  $self() {
    return this.constructor;
  }
  /**
   * Get the entity for this model.
   */
  $entity() {
    return this.$self().entity;
  }
  /**
   * Get the model config.
   */
  $config() {
    return this.$self().config;
  }
  /**
   * Get the namespace.
   */
  $namespace() {
    return this.$self().namespace ?? config.model.namespace;
  }
  /**
   * Get the store name.
   */
  $storeName() {
    return (this.$namespace() ? this.$namespace() + "/" : "") + this.$baseEntity();
  }
  /**
   * Get the base entity for this model.
   */
  $baseEntity() {
    return this.$self().baseEntity ?? this.$entity();
  }
  /**
   * Get the type key for this model.
   */
  $typeKey() {
    return this.$self().typeKey;
  }
  /**
   * Get the types for this model.
   */
  $types() {
    return this.$self().types();
  }
  /**
   * Get the pinia options for this model.
   */
  $piniaOptions() {
    return this.$self().piniaOptions;
  }
  /**
   * Get the primary key for this model.
   */
  $primaryKey() {
    return this.$self().primaryKey;
  }
  /**
   * Get the model fields for this model.
   */
  $fields() {
    return this.$self().schemas[this.$entity()];
  }
  /**
   * Get the model hidden fields
   */
  $hidden() {
    return this.$self().hidden;
  }
  /**
   * Get the model visible fields
   */
  $visible() {
    return this.$self().visible;
  }
  /**
   * Create a new instance of this model. This method provides a convenient way
   * to re-generate a fresh instance of this model. It's particularly useful
   * during hydration through Query operations.
   */
  $newInstance(attributes, options) {
    const Self = this.$self();
    return new Self(attributes, options);
  }
  /**
   * Bootstrap this model.
   */
  $boot() {
    if (!this.$self().booted[this.$entity()]) {
      this.$self().booted[this.$entity()] = true;
      this.$initializeSchema();
    }
  }
  /**
   * Build the schema by evaluating fields and registry.
   */
  $initializeSchema() {
    this.$self().initializeSchema();
  }
  $casts() {
    return {
      ...this.$getCasts(),
      ...this.$self().fieldCasts
    };
  }
  /**
   * Fill this model by the given attributes. Missing fields will be populated
   * by the attributes default value.
   */
  $fill(attributes = {}, options = {}) {
    const operation = options.operation ?? "get";
    const modelConfig = {
      ...config.model,
      ...this.$config()
    };
    modelConfig.withMeta && (this.$self().schemas[this.$entity()][this.$self().metaKey] = this.$self().attr({}));
    const fields = this.$fields();
    const fillRelation = options.relations ?? true;
    const mutators = {
      ...this.$getMutators(),
      ...this.$self().fieldMutators
    };
    for (const key in fields) {
      if (operation === "get" && !this.isFieldVisible(key, this.$hidden(), this.$visible(), options)) {
        continue;
      }
      const attr = fields[key];
      let value = attributes[key];
      if (attr instanceof Relation && !fillRelation) {
        continue;
      }
      const mutator = mutators?.[key];
      const cast = this.$casts()[key]?.newRawInstance(fields);
      if (mutator && operation === "get") {
        value = typeof mutator === "function" ? mutator(value) : typeof mutator.get === "function" ? mutator.get(value) : value;
      }
      if (cast && operation === "get") {
        value = cast.get(value);
      }
      let keyValue = this.$fillField(key, attr, value);
      if (mutator && typeof mutator !== "function" && operation === "set" && mutator.set) {
        keyValue = mutator.set(keyValue);
      }
      if (cast && operation === "set") {
        keyValue = cast.set(keyValue);
      }
      this[key] = this[key] ?? keyValue;
    }
    operation === "set" && (this.$self().original[this.$getKey(this, true)] = this.$getAttributes());
    modelConfig.withMeta && operation === "set" && this.$fillMeta(options.action);
    return this;
  }
  $fillMeta(action = "save") {
    const timestamp = Math.floor(Date.now() / 1e3);
    if (action === "save") {
      this[this.$self().metaKey] = {
        createdAt: timestamp,
        updatedAt: timestamp
      };
    }
    if (action === "update") {
      this[this.$self().metaKey].updatedAt = timestamp;
    }
  }
  /**
   * Fill the given attribute with a given value specified by the given key.
   */
  $fillField(key, attr, value) {
    if (value !== void 0) {
      return attr instanceof MorphTo ? attr.setKey(key).make(value, this[attr.getType()]) : attr.setKey(key).make(value);
    }
    if (this[key] === void 0) {
      return attr.setKey(key).make();
    }
  }
  isFieldVisible(key, modelHidden, modelVisible, options) {
    const hidden = modelHidden.length > 0 ? modelHidden : config.model.hidden;
    const visible = [...modelVisible.length > 0 ? modelVisible : config.model.visible, String(this.$primaryKey())];
    const optionsVisible = options.visible ?? [];
    const optionsHidden = options.hidden ?? [];
    if ((hidden.includes("*") || hidden.includes(key)) && !optionsVisible.includes(key) || optionsHidden.includes(key)) {
      return false;
    }
    return (visible.includes("*") || visible.includes(key)) && !optionsHidden.includes(key) || optionsVisible.includes(key);
  }
  /**
   * Get the primary key field name.
   */
  $getKeyName() {
    return this.$primaryKey();
  }
  /**
   * Get primary key value for the model. If the model has the composite key,
   * it will return an array of ids.
   */
  $getKey(record, concatCompositeKey = false) {
    record = record ?? this;
    if (this.$hasCompositeKey()) {
      const compositeKey = this.$getCompositeKey(record);
      return concatCompositeKey ? "[" + compositeKey?.join(",") + "]" : compositeKey;
    }
    const id = record[this.$getKeyName()];
    return isNullish(id) ? null : id;
  }
  /**
   * Check whether the model has composite key.
   */
  $hasCompositeKey() {
    return isArray(this.$getKeyName());
  }
  /**
   * Get the composite key values for the given model as an array of ids.
   */
  $getCompositeKey(record) {
    let ids = [];
    this.$getKeyName().every((key) => {
      const id = record[key];
      if (isNullish(id)) {
        ids = null;
        return false;
      }
      ids.push(id);
      return true;
    });
    return ids === null ? null : ids;
  }
  /**
   * Get the index id of this model or for a given record.
   */
  $getIndexId(record) {
    const target = record ?? this;
    const id = this.$getKey(target);
    assert(id !== null, [
      "The record is missing the primary key. If you want to persist record",
      "without the primary key, please define the primary key field with the",
      "`uid` attribute."
    ]);
    return this.$stringifyId(id);
  }
  /**
   * Stringify the given id.
   */
  $stringifyId(id) {
    return isArray(id) ? JSON.stringify(id) : String(id);
  }
  /**
   * Get the local key name for the model.
   */
  $getLocalKey() {
    assert(!this.$hasCompositeKey(), [
      "Please provide the local key for the relationship. The model with the",
      "composite key can't infer its local key."
    ]);
    return this.$getKeyName();
  }
  /**
   * Get the relation instance for the given relation name.
   */
  $getRelation(name) {
    let relation = this.$fields()[name];
    const typeModels = Object.values(this.$types());
    typeModels.forEach((typeModel) => {
      if (relation === void 0) {
        relation = typeModel.fields()[name];
      }
    });
    assert(relation instanceof Relation, [
      `Relationship [${name}] on model [${this.$entity()}] not found.`
    ]);
    return relation;
  }
  /**
   * Set the given relationship on the model.
   */
  $setRelation(relation, model) {
    if (relation.includes("pivot")) {
      this.pivot = model;
      return this;
    }
    if (this.$fields()[relation]) {
      this[relation] = model;
    }
    return this;
  }
  /**
   * Get the mutators of the model
   */
  $getMutators() {
    return this.$self().mutators();
  }
  /**
   * Get the casts of the model
   */
  $getCasts() {
    return this.$self().casts();
  }
  /**
   * Get the original values of the model instance
   */
  $getOriginal() {
    return this.$self().original[this.$getKey(this, true)];
  }
  /**
   * Return the model instance with its original state
   */
  $refresh() {
    if (this.$isDirty()) {
      Object.entries(this.$getOriginal()).forEach((entry) => {
        this[entry[0]] = entry[1];
      });
    }
    return this;
  }
  /**
   * Checks if attributes were changed
   */
  $isDirty($attribute) {
    const original = this.$getOriginal();
    if ($attribute) {
      if (!Object.keys(original).includes($attribute)) {
        throwError(['The property"', $attribute, '"does not exit in the model "', this.$entity(), '"']);
      }
      return !equals(this[$attribute], original[$attribute]);
    }
    return !equals(original, this.$getAttributes());
  }
  /**
   * Get the serialized model attributes.
   */
  $getAttributes() {
    return this.$toJson(this, { relations: false });
  }
  /**
   * Serialize this model, or the given model, as POJO.
   */
  $toJson(model, options = {}) {
    model = model ?? this;
    const fields = model.$fields();
    const withRelation = options.relations ?? true;
    const record = {};
    for (const key in fields) {
      const attr = fields[key];
      const value = model[key];
      if (!(attr instanceof Relation)) {
        record[key] = this.serializeValue(value);
        continue;
      }
      if (withRelation) {
        record[key] = this.serializeRelation(value);
      }
    }
    return record;
  }
  /**
   * Serialize the given value.
   */
  serializeValue(value) {
    if (value === null) {
      return null;
    }
    if (isArray(value)) {
      return this.serializeArray(value);
    }
    if (typeof value === "object") {
      if (value instanceof Date && !isNaN(value.getTime()) && typeof value.toISOString === "function") {
        return value.toISOString();
      } else {
        return this.serializeObject(value);
      }
    }
    return value;
  }
  /**
   * Serialize the given array to JSON.
   */
  serializeArray(value) {
    return value.map((v) => this.serializeValue(v));
  }
  /**
   * Serialize the given object to JSON.
   */
  serializeObject(value) {
    const obj = {};
    for (const key in value) {
      obj[key] = this.serializeValue(value[key]);
    }
    return obj;
  }
  serializeRelation(relation) {
    if (relation === void 0) {
      return void 0;
    }
    if (relation === null) {
      return null;
    }
    return isArray(relation) ? relation.map((model) => model.$toJson()) : relation.$toJson();
  }
}
/**
 * The name of the model.
 */
__publicField(Model, "entity");
/**
 * The reference to the base entity name if the class extends a base entity.
 */
__publicField(Model, "baseEntity");
/**
 * Define a namespace if you have multiple equal entity names.
 * Resulting in "{namespace}/{entity}"
 */
__publicField(Model, "namespace");
/**
 * The primary key for the model.
 */
__publicField(Model, "primaryKey", "id");
/**
 * The meta key for the model.
 */
__publicField(Model, "metaKey", "_meta");
/**
 * Hidden properties
 */
__publicField(Model, "hidden", ["_meta"]);
/**
 * Visible properties
 */
__publicField(Model, "visible", []);
/**
 * The global install options
 */
__publicField(Model, "config");
/**
 * The type key for the model.
 */
__publicField(Model, "typeKey", "type");
/**
 * Behaviour for relational fields on delete.
 */
__publicField(Model, "fieldsOnDelete", {});
/**
 * Original model data.
 */
__publicField(Model, "original", {});
/**
 * The schema for the model. It contains the result of the `fields`
 * method or the attributes defined by decorators.
 */
__publicField(Model, "schemas", {});
/**
 * The registry for the model. It contains predefined model schema generated
 * by the property decorators and gets evaluated, and stored, on the `schema`
 * property when registering models to the database.
 */
__publicField(Model, "registries", {});
/**
 * The pinia options for the model. It can contain options which will passed
 * to the 'defineStore' function of pinia.
 */
__publicField(Model, "piniaOptions", {});
/**
 * The mutators for the model.
 */
__publicField(Model, "fieldMutators", {});
/**
 * The casts for the model.
 */
__publicField(Model, "fieldCasts", {});
/**
 * The array of booted models.
 */
__publicField(Model, "booted", {});
/**
 * Lifecycle hook for before saving
 */
__publicField(Model, "saving", () => {
});
/**
 * Lifecycle hook for before updating
 */
__publicField(Model, "updating", () => {
});
/**
 * Lifecycle hook for before creating
 */
__publicField(Model, "creating", () => {
});
/**
 * Lifecycle hook for before deleting
 */
__publicField(Model, "deleting", () => {
});
/**
 * Lifecycle hook for after getting data
 */
__publicField(Model, "retrieved", () => {
});
/**
 * Lifecycle hook for after saved
 */
__publicField(Model, "saved", () => {
});
/**
 * Lifecycle hook for after updated
 */
__publicField(Model, "updated", () => {
});
/**
 * Lifecycle hook for after created
 */
__publicField(Model, "created", () => {
});
/**
 * Lifecycle hook for after deleted
 */
__publicField(Model, "deleted", () => {
});

export { Attribute, BelongsTo, BelongsToMany, CONFIG_DEFAULTS, Database, HasMany, HasManyBy, HasManyThrough, HasOne, Interpreter, Model, MorphMany, MorphOne, MorphTo, MorphToMany, Query, Relation, Repository, Schema, Type, config, createORM, definePiniaOrmPlugin, mapRepos, plugins, registerPlugins, useDataStore, useRepo, useStoreActions };
