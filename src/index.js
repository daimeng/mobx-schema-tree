import { types } from 'mobx-state-tree'
import pointer from 'json-pointer'

export function fromSchema(s, root) {

    if (s.$ref) {
        // TODO: handle uri id cases
        return fromSchema(pointer.get(root, s.$ref))
    }

    if (s.anyOf) {
        
    }

    if (s.allOf) {
        
    }

    if (s.anyOf) {
        
    }

    switch (s.type) {
    case 'null':
        return fromNull(s, root)
    case 'boolean':
        return fromBoolean(s, root)
    case 'array':
        return fromArray(s, root)
    case 'number':
        return fromNumber(s, root)
    case 'string':
        return fromString(s, root)
    case 'object':
        return fromObject(s, root)
    default:
        // TODO: maybe don't need error here, run meta schema validator beforehand?
    }
}

export function fromNull(s, root)  {
    return types.null
}
    
export function fromBoolean(s, root) {
    return types.boolean
}

export function fromArray(s, root) {
    // var p
    // if (s.hasOwnProperty('minItems')) {
    // }
    // if (s.hasOwnProperty('maxItems')) {
    // }

    return types.array(
        fromSchema(s.items, root)
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

export function fromObject(s, root) {
    const props = {}

    if (s.properties) {
        for (let key in s.properties) {
            props[key] = fromSchema(s.properties[key])
        }
    }

    if (s.title) {
        return types.model(s.title, props)
    } else {
        return types.model(props)
    }
}

