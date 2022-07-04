import { describe, it, expect } from 'vitest'

import { Model, Attr, Str, Num, useRepo } from '../../../src'
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

    const users = userRepo.where((user) => user.age === 30).get()

    const expected = [
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'Jane Doe', age: 30 },
    ]

    expect(users).toHaveLength(2)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })
})