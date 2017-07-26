import { expect } from 'chai'
import { types } from 'mobx-state-tree'
import {
    fromSchema,
    fromString,
    fromNumber,
    fromBoolean,
    fromNull,
    fromArray,
    fromObject
} from '../src'

describe('fromString', function() {
    it('handles plain string', function() {
        expect(
            fromString({ type: 'string' })
        ).to.equal(types.string)
    })
})

describe('fromNumber', function() {
    it('handles plain number', function() {
        expect(
            fromNumber({ type: 'number' })
        ).to.equal(types.number)
    })
})

describe('fromBoolean', function() {
    it('handles plain boolean', function() {
        expect(
            fromBoolean({ type: 'boolean' })
        ).to.equal(types.boolean)
    })
})

describe('fromNull', function() {
    it('handles null', function() {
        expect(
            fromNull({ type: 'null' })
        ).to.equal(types.null)
    })
})

describe('fromArray', function() {
    it('handles array of primitives', function() {
        var tree = fromArray({
            type: 'array',
            items: {
                type: 'string'
            }
        })
        expect(tree.constructor.name).to.equal('ArrayType')
        expect(tree.name).to.equal('string[]')
    })
})

describe('fromObject', function() {
    it('handles basic object with properties', function() {
        var tree = fromObject({
            type: 'object',
            properties: {
                name: { type: 'string' },
                age: { type: 'number' }
            }
        })
        expect(tree.constructor.name).to.equal('ObjectType')
    })

    it('handles no properties', function() {
        expect(
            (function() {
                fromObject({
                    type: 'object'
                })
            })
        ).to.not.throw()
    })

    it('handles named object', function() {
        var tree = fromObject({
            type: 'object',
            title: 'Car'
        })

        expect(tree.name).to.equal('Car')
    })

    it('handles composed models', function() {
        var tree = fromSchema({
            allOf: [{
                type: 'object',
                properties: {
                    name: { type: 'string' }
                }
            }, {
                type: 'object',
                properties: {
                    age: { type: 'number' }
                }
            }]
        })

        expect(Object.keys(tree.props)).to.deep.equal(['name', 'age'])
    })

    it('handles union models', function() {
        var tree = fromSchema({
            anyOf: [{
                title: 'Car',
                type: 'object',
                properties: {
                    brand: { type: 'string' }
                }
            }, {
                title: 'Person',
                type: 'object',
                properties: {
                    name: { type: 'string' }
                }
            }]
        })

        // TODO: test order...
        expect(tree.name).to.equal('Person | Car')
    })
})
