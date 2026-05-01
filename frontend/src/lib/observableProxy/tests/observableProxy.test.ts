import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  ObservableProxy,
  ownKeysSymbol,
  protoSymbol,
  extensibleSymbol,
  type Callback,
} from '../observableProxy'

describe('ObservableProxy', () => {
  let onRead: Callback<any>
  let onChange: Callback<any>

  beforeEach(() => {
    onRead = vi.fn()
    onChange = vi.fn()
  })

  it('tracks property read', () => {
    const obj = { a: 1 }
    const proxy = ObservableProxy<typeof obj>(obj, onRead, onChange)

    expect(proxy.a).toBe(1)

    expect(onRead).toHaveBeenCalledTimes(1)
    expect(onRead).toHaveBeenCalledWith(obj, 'a')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('tracks property write', () => {
    const obj = { a: 1 }
    const proxy = ObservableProxy<typeof obj>(obj, onRead, onChange)

    proxy.a = 2

    expect(obj.a).toBe(2)

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(obj, 'a')
  })

  it('does not trigger onChange when value stays same', () => {
    const obj = { a: 1 }
    const proxy = ObservableProxy<typeof obj>(obj, onRead, onChange)

    proxy.a = 1

    expect(onChange).not.toHaveBeenCalled()
  })

  it('tracks defineProperty for new property', () => {
    const obj = {}
    const proxy = ObservableProxy<typeof obj>(obj, onRead, onChange)

    Object.defineProperty(proxy, 'x', {
      value: 123,
      configurable: true,
      writable: true,
    })

    expect(onChange).toHaveBeenCalledWith(obj, 'x')
    expect(onChange).toHaveBeenCalledWith(obj, ownKeysSymbol)
  })

  it('tracks defineProperty update', () => {
    const obj = { a: 1 }
    const proxy = ObservableProxy<typeof obj>(obj, onRead, onChange)

    Object.defineProperty(proxy, 'a', {
      value: 2,
      configurable: true,
      writable: true,
    })

    expect(onChange).toHaveBeenCalledWith(obj, 'a')
  })

  it('tracks deleteProperty', () => {
    const obj: { a?: number } = { a: 1 }
    const proxy = ObservableProxy<typeof obj>(obj, onRead, onChange)

    delete proxy.a

    expect(onChange).toHaveBeenCalledWith(obj, 'a')
    expect(onChange).toHaveBeenCalledWith(obj, ownKeysSymbol)
  })

  it('tracks ownKeys read', () => {
    const obj = { a: 1, b: 2 }
    const proxy = ObservableProxy<typeof obj>(obj, onRead, onChange)

    Object.keys(proxy)

    expect(onRead).toHaveBeenCalledWith(obj, ownKeysSymbol)
  })

  it('tracks getPrototypeOf read', () => {
    const obj = {}
    const proxy = ObservableProxy<typeof obj>(obj, onRead, onChange)

    Object.getPrototypeOf(proxy)

    expect(onRead).toHaveBeenCalledWith(obj, protoSymbol)
  })

  it('tracks setPrototypeOf change', () => {
    const obj = {}
    const proxy = ObservableProxy<typeof obj>(obj, onRead, onChange)

    const newProto = { x: 1 }

    Object.setPrototypeOf(proxy, newProto)

    expect(onChange).toHaveBeenCalledWith(obj, protoSymbol)
  })

  it('tracks extensible read', () => {
    const obj = {}
    const proxy = ObservableProxy<typeof obj>(obj, onRead, onChange)

    Object.isExtensible(proxy)

    expect(onRead).toHaveBeenCalledWith(obj, extensibleSymbol)
  })

  it('tracks preventExtensions change', () => {
    const obj = {}
    const proxy = ObservableProxy<typeof obj>(obj, onRead, onChange)

    Object.preventExtensions(proxy)

    expect(onChange).toHaveBeenCalledWith(obj, extensibleSymbol)
  })

  it('tracks "in" operator as read', () => {
    const obj = { a: 1 }
    const proxy = ObservableProxy<typeof obj>(obj, onRead, onChange)

    expect('a' in proxy).toBe(true)

    expect(onRead).toHaveBeenCalledWith(obj, 'a')
  })

  it('deduplicates nested reads', () => {
    const obj = {
      a: 1,
      get b() {
        return this.a
      }
    }

    const proxy = ObservableProxy<typeof obj>(obj, onRead, onChange)

    proxy.b

    expect(onRead).toHaveBeenCalledTimes(2)
    expect(onRead).toHaveBeenCalledWith(obj, 'b')
    expect(onRead).toHaveBeenCalledWith(obj, 'a')
  })

  it('deduplicates repeated reads of same property in single transaction', () => {
    const obj = {
      get a() {
        return 1
      }
    }

    const proxy = ObservableProxy<typeof obj>(obj, onRead, onChange)

    proxy.a
    proxy.a

    expect(onRead).toHaveBeenCalledTimes(2)
  })

  it('deduplicates repeated nested reads inside one call stack', () => {
    const obj = {
      get a() {
        return this.b + this.b
      },
      b: 1
    }

    const proxy = ObservableProxy<typeof obj>(obj, onRead, onChange)

    proxy.a

    const calls = (onRead as ReturnType<typeof vi.fn>).mock.calls.map(c => c[1])

    expect(calls.filter(k => k === 'b')).toHaveLength(1)
    expect(calls).toContain('a')
  })

  it('tracks array length read', () => {
    const arr = [1, 2, 3]
    const proxy = ObservableProxy<typeof arr>(arr, onRead, onChange)

    expect(proxy.length).toBe(3)

    expect(onRead).toHaveBeenCalledWith(arr, 'length')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('tracks array length change after push', () => {
    const arr = [1, 2]
    const proxy = ObservableProxy<typeof arr>(arr, onRead, onChange)

    proxy.push(3)

    expect(arr).toEqual([1, 2, 3])

    expect(onChange).toHaveBeenCalledWith(arr, '2')
    expect(onChange).toHaveBeenCalledWith(arr, 'length')
  })

  it('tracks array length change after pop', () => {
    const arr = [1, 2, 3]
    const proxy = ObservableProxy<typeof arr>(arr, onRead, onChange)

    proxy.pop()

    expect(arr).toEqual([1, 2])

    expect(onChange).toHaveBeenCalledWith(arr, '2')
    expect(onChange).toHaveBeenCalledWith(arr, 'length')
  })

  it('tracks splice changes', () => {
    const arr = [1, 2, 3]
    const proxy = ObservableProxy<typeof arr>(arr, onRead, onChange)

    proxy.splice(1, 1, 99)

    expect(arr).toEqual([1, 99, 3])

    expect(onChange).toHaveBeenCalledWith(arr, '1')
  })

  it('tracks spread operator reads', () => {
    const arr = [1, 2, 3]
    const proxy = ObservableProxy<typeof arr>(arr, onRead, onChange)

    const result = [...proxy]

    expect(result).toEqual([1, 2, 3])

    expect(onRead).toHaveBeenCalledWith(arr, Symbol.iterator)
    expect(onRead).toHaveBeenCalledWith(arr, 'length')
    expect(onRead).toHaveBeenCalledWith(arr, '0')
    expect(onRead).toHaveBeenCalledWith(arr, '1')
    expect(onRead).toHaveBeenCalledWith(arr, '2')
  })

  it('tracks Array.from reads', () => {
    const arr = [1, 2]
    const proxy = ObservableProxy<typeof arr>(arr, onRead, onChange)

    const result = Array.from(proxy)

    expect(result).toEqual([1, 2])

    expect(onRead).toHaveBeenCalledWith(arr, Symbol.iterator)
  })

  it('tracks for...of iteration reads', () => {
    const arr = [1, 2, 3]
    const proxy = ObservableProxy<typeof arr>(arr, onRead, onChange)

    const result = []

    for (const item of proxy) {
      result.push(item)
    }

    expect(result).toEqual([1, 2, 3])

    expect(onRead).toHaveBeenCalledWith(arr, Symbol.iterator)
  })

  it('tracks Object.keys on array', () => {
    const arr = [1, 2, 3]
    const proxy = ObservableProxy<typeof arr>(arr, onRead, onChange)

    const keys = Object.keys(proxy)

    expect(keys).toEqual(['0', '1', '2'])
    expect(onRead).toHaveBeenCalledWith(arr, ownKeysSymbol)
  })

  it('tracks direct index write', () => {
    const arr = [1, 2, 3]
    const proxy = ObservableProxy<typeof arr>(arr, onRead, onChange)

    proxy[1] = 42

    expect(arr).toEqual([1, 42, 3])

    expect(onChange).toHaveBeenCalledWith(arr, '1')
  })

  it('tracks length truncation', () => {
    const arr = [1, 2, 3, 4]
    const proxy = ObservableProxy<typeof arr>(arr, onRead, onChange)

    proxy.length = 2

    expect(arr).toEqual([1, 2])

    expect(onChange).toHaveBeenCalledWith(arr, 'length')
  })
})