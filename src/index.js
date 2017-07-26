import { types } from 'mobx-state-tree'
import pointer from 'json-pointer'

// TODO: add validations?
export function fromSchema(s, root, ctx = {}) {
    // TODO: register by id to resolve environment
    if (s.hasOwnProperty('$ref')) {
        // TODO: handle uri cases
        var refSchema = pointer.get(root, s.$ref)

        if (ctx.hasOwnProperty(refSchema.$id)) {
            if (ctx[refSchema.$id]) {
                return ctx[refSchema.$id]
            } else {
                // if currently being resolved
                return types.late(() => ctx[refSchema.$id])
            }
        }

        return fromSchema(refSchema, root, ctx)
    }

    if (s.hasOwnProperty('$id')) {
        ctx[s.$id] = null
    }

    if (s.allOf) {
        return types.compose(...s.allOf.map(
            sub => fromSchema(sub, root, ctx)
         ))
    }

    if (s.oneOf) {
        return types.union(...s.oneOf.map(
            sub => fromSchema(sub, root, ctx)
        ))
        
    }

    if (s.anyOf) {
        return types.union(...s.anyOf.map(
            sub => fromSchema(sub, root, ctx)
        ))
    }

    var model
    switch (s.type) {
    case 'null':
        model = fromNull(s, root)
        break;
    case 'boolean':
        model = fromBoolean(s, root)
        break;
    case 'array':
        model = fromArray(s, root, ctx)
        break;
    case 'number':
        model = fromNumber(s, root)
        break;
    case 'string':
        model = fromString(s, root)
        break;
    case 'object':
        model = fromObject(s, root, ctx)
        break;
    default:
        // TODO: maybe don't need error here, run meta schema validator beforehand?
    }

    if (s.hasOwnProperty('$id')) {
        ctx[s.$id] = model
    }
    return model
}

export function fromNull(s, root)  {
    return types.null
}
    
export function fromBoolean(s, root) {
    return types.boolean
}

export function fromArray(s, root, ctx) {
    // var p
    // if (s.hasOwnProperty('minItems')) {
    // }
    // if (s.hasOwnProperty('maxItems')) {
    // }

    return types.array(
        fromSchema(s.items, root, ctx)
    )
}

export function fromNumber(s, root) {
    // var p
    // if (s.hasOwnProperty('minimum')) {
    // }
    // if (s.hasOwnProperty('maximum')) {
    // }

    return types.number
}

export function fromString(s, root) {
    // var p
    // if (s.hasOwnProperty('minLength')) {
    // }
    // if (s.hasOwnProperty('maxLength')) {
    // }

    return types.string
}

export function fromObject(s, root, ctx) {
    const props = {}

    if (s.properties) {
        for (let key in s.properties) {
            props[key] = fromSchema(s.properties[key], root, ctx)
        }
    }

    if (s.required) {
    }

    if (s.title) {
        return types.model(s.title, props)
    } else {
        return types.model(props)
    }
}

