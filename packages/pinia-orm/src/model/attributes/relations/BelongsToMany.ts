import type { Schema as NormalizrSchema } from '@pinia-orm/normalizr'
import type { Schema } from '../../../schema/Schema'
import type { Collection, Element } from '../../../data/Data'
import type { Query } from '../../../query/Query'
import type { Model } from '../../Model'
import { Relation } from './Relation'

export class BelongsToMany extends Relation {
  /**
   * The pivot model.
   */
  pivot: Model

  /**
   * The foreign key of the parent model.
   */
  foreignPivotKey: string

  /**
   * The associated key of the relation.
   */
  relatedPivotKey: string

  /**
   * The key name of the parent model.
   */
  parentKey: string

  /**
   * The key name of the related model.
   */
  relatedKey: string

  /**
   * The key name of the pivot data.
   */
  pivotKey = 'pivot'

  /**
   * Create a new belongs to instance.
   */
  constructor(
    parent: Model,
    related: Model,
    pivot: Model,
    foreignPivotKey: string,
    relatedPivotKey: string,
    parentKey: string,
    relatedKey: string,
  ) {
    super(parent, related)

    this.pivot = pivot
    this.foreignPivotKey = foreignPivotKey
    this.relatedPivotKey = relatedPivotKey
    this.parentKey = parentKey
    this.relatedKey = relatedKey
  }

  /**
   * Get all related models for the relationship.
   */
  getRelateds(): Model[] {
    return [this.related]
  }

  /**
   * Define the normalizr schema for the relationship.
   */
  define(schema: Schema): NormalizrSchema {
    return schema.many(this.related, this.parent)
  }

  /**
   * Attach the parent type and id to the given relation.
   */
  attach(record: Element, child: Element): void {
    const pivot = child.pivot ?? {}
    pivot[this.foreignPivotKey] = record[this.parentKey]
    pivot[this.relatedPivotKey] = child[this.relatedKey]
    child.pivot = pivot
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  make(elements?: Element[]): Model[] {
    return elements
      ? elements.map(element => this.related.$newInstance(element))
      : []
  }

  /**
   * Match the eagerly loaded results to their parents.
   */
  match(relation: string, models: Collection, query: Query): void {
    const relatedModels = query.get(false)
    models.forEach((parentModel) => {
      const relationResults: Model[] = []
      relatedModels.forEach((relatedModel) => {
        const key = relatedModel[this.relatedKey]
        const pivot = query.newQuery(this.pivot.$entity())
          .where(this.relatedPivotKey, key)
          .where(this.foreignPivotKey, parentModel[this.parentKey])
          .first()
        relatedModel.$setRelation('pivot', pivot)
        if (pivot)
          relationResults.push(relatedModel)
      })
      parentModel.$setRelation(relation, relationResults)
    })
  }

  /**
   * Set the constraints for the related relation.
   */
  addEagerConstraints(query: Query, collection: Collection): void {
    query.database.register(this.pivot)

    const pivotKeys = query.newQuery(this.pivot.$entity()).where(
      this.foreignPivotKey,
      this.getKeys(collection, this.parentKey),
    ).get(false).map((item: Model) => item[this.relatedPivotKey])

    query.whereIn(
      this.relatedKey,
      pivotKeys,
    )
  }
}
