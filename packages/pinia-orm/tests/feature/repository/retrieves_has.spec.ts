import { describe, expect, it, vi } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, HasMany, Num, Str } from '../../../src/decorators'
import { assertInstanceOf, assertModels, fillState } from '../../helpers'

describe('feature/repository/retrieves_has', () => {
  class Post extends Model {
    static entity = 'posts'

    @Num(0) id!: number
    @Attr() userId!: number
    @Str('') title!: string
  }

  class User extends Model {
    static entity = 'users'

    @Num(0) id!: number
    @Str('') name!: string

    @HasMany(() => Post, 'userId')
      posts!: Post[]
  }

  it('can filter the query by the has clause', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
        2: { id: 2, userId: 1, title: 'Title 02' },
        3: { id: 3, userId: 2, title: 'Title 03' },
      },
    })

    const users = userRepo.has('posts').get()

    const expected = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
    ]

    expect(users).toHaveLength(2)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })

  it('can filter by has clause with number', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
        2: { id: 2, userId: 1, title: 'Title 02' },
        3: { id: 3, userId: 2, title: 'Title 03' },
      },
    })

    const users = userRepo.has('posts', 2).get()

    const expected = [
      { id: 1, name: 'John Doe' },
    ]

    expect(users).toHaveLength(1)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })

  it('can filter by "has" clause with operator and number', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
        2: { id: 2, userId: 1, title: 'Title 02' },
        3: { id: 3, userId: 2, title: 'Title 03' },
      },
    })

    const users = userRepo.has('posts', '<', 2).get()

    const expected = [
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Johnny Doe' },
    ]

    expect(users).toHaveLength(2)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })

  it('can filter by "doesnt have" clause', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
        2: { id: 2, userId: 1, title: 'Title 02' },
        3: { id: 3, userId: 2, title: 'Title 03' },
      },
    })

    const users = userRepo.doesntHave('posts').get()

    const expected = [
      { id: 3, name: 'Johnny Doe' },
    ]

    expect(users).toHaveLength(1)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })

  it('can filter by "where has" clauses with closure', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 03' },
        2: { id: 2, userId: 1, title: 'Title 03' },
        3: { id: 3, userId: 2, title: 'Title 03' },
      },
    })

    const users = userRepo.whereHas('posts', (query) => {
      query.where('title', 'Title 03')
    }, '=', 1).get()

    const expected = [
      { id: 2, name: 'Jane Doe' },
    ]

    expect(users).toHaveLength(1)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })

  it('can filter by "where has" clauses with closure', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 03' },
        2: { id: 2, userId: 1, title: 'Title 03' },
        3: { id: 3, userId: 2, title: 'Title 02' },
      },
    })

    const users = userRepo.whereDoesntHave('posts', (query) => {
      query.where('title', 'Title 03')
    }).get()

    const expected = [
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Johnny Doe' },
    ]

    expect(users).toHaveLength(2)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })

  it.skip('can throw an error if a wrong relation is queried', () => {
    const userRepo = useRepo(User)

    const hasMeethod = vi.spyOn(userRepo, 'has')

    fillState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
        2: { id: 2, userId: 1, title: 'Title 02' },
        3: { id: 3, userId: 2, title: 'Title 03' },
      },
    })

    userRepo.has('postss', '<', 2).get()

    expect(hasMeethod).toThrowError('[Pinia ORM] Relationship [postss] on model [users] not found.')
  })
})
