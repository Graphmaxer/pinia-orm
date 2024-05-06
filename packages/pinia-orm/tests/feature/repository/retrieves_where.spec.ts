import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, Num, Str } from '../../../src/decorators'
import { assertInstanceOf, assertModels, fillState } from '../../helpers'

describe('feature/repository/retrieves_where', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
    @Num(0) age!: number
  }

  it('can filter the query by the `where` clause', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe', age: 30 },
        2: { id: 2, name: 'Jane Doe', age: 30 },
        3: { id: 3, name: 'Johnny Doe', age: 20 },
      },
    })

    const users = userRepo.where('age', 30).get()

    const expected = [
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'Jane Doe', age: 30 },
    ]

    expect(users).toHaveLength(2)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })

  it('can chain multiple `where` clause', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe', age: 30 },
        2: { id: 2, name: 'Jane Doe', age: 30 },
        3: { id: 3, name: 'Johnny Doe', age: 20 },
      },
    })

    const users = userRepo.where('name', 'John Doe').where('age', 30).get()

    const expected = [{ id: 1, name: 'John Doe', age: 30 }]

    expect(users).toHaveLength(1)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })

  it('can filter records by passing closure as a value', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe', age: 30 },
        2: { id: 2, name: 'Jane Doe', age: 30 },
        3: { id: 3, name: 'Johnny Doe', age: 20 },
      },
    })

    const users = userRepo.where('age', (value: any) => value === 30).get()

    const expected = [
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'Jane Doe', age: 30 },
    ]

    expect(users).toHaveLength(2)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })

  it('can filter records by passing closure as a field', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe', age: 30 },
        2: { id: 2, name: 'Jane Doe', age: 30 },
        3: { id: 3, name: 'Johnny Doe', age: 20 },
      },
    })

    const users = userRepo.where(user => user.age === 30).get()

    const expected = [
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'Jane Doe', age: 30 },
    ]

    expect(users).toHaveLength(2)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })

  it('can filter records by Set with whereIn', () => {
    const userRepo = useRepo(User)

    const ages = new Set([40, 30])

    fillState({
      users: {
        1: { id: 1, name: 'John Doe', age: 40 },
        2: { id: 2, name: 'Jane Doe', age: 30 },
        3: { id: 3, name: 'Johnny Doe', age: 20 },
      },
    })

    const users = userRepo.whereIn('age', ages).get()

    const expected = [
      { id: 1, name: 'John Doe', age: 40 },
      { id: 2, name: 'Jane Doe', age: 30 },
    ]

    expect(users).toHaveLength(2)
    assertInstanceOf(users, User)
    assertModels(users, expected)

    const users2 = userRepo.whereNotIn('age', ages).get()

    const expected2 = [
      { id: 3, name: 'Johnny Doe', age: 20 },
    ]

    expect(users2).toHaveLength(1)
    assertInstanceOf(users2, User)
    assertModels(users2, expected2)

    const users3 = userRepo.orWhereIn('name', new Set(['John Doe'])).orWhereNotIn('age', ages).get()

    const expected3 = [
      { id: 1, name: 'John Doe', age: 40 },
      { id: 3, name: 'Johnny Doe', age: 20 },
    ]

    expect(users3).toHaveLength(2)
    assertInstanceOf(users3, User)
    assertModels(users3, expected3)
  })

  it('can filter records with whereNULL and whereNotNull', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe', age: null },
        2: { id: 2, name: 'Jane Doe', age: 30 },
        3: { id: 3, name: 'Johnny Doe', age: 20 },
      },
    })

    const users = userRepo.whereNull('age').get()

    const expected = [
      { id: 1, name: 'John Doe', age: null },
    ]

    expect(users).toHaveLength(1)
    assertInstanceOf(users, User)
    assertModels(users, expected)

    const users2 = userRepo.whereNotNull('age').get()

    const expected2 = [
      { id: 2, name: 'Jane Doe', age: 30 },
      { id: 3, name: 'Johnny Doe', age: 20 },
    ]

    expect(users2).toHaveLength(2)
    assertInstanceOf(users2, User)
    assertModels(users2, expected2)
  })
})
