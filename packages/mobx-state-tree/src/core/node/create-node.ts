import {
    fail,
    ObjectNode,
    ScalarNode,
    AnyNode,
    getStateTreeNodeSafe,
    AnyObjectNode,
    ComplexType,
    SimpleType
} from "../../internal"

/**
 * @internal
 * @hidden
 */
export function createObjectNode<C, S, T>(
    type: ComplexType<C, S, T>,
    parent: AnyObjectNode | null,
    subpath: string,
    environment: any,
    initialValue: C | T
): ObjectNode<C, S, T> {
    const existingNode = getStateTreeNodeSafe(initialValue)
    if (existingNode) {
        if (existingNode.isRoot) {
            existingNode.setParent(parent, subpath)
            return existingNode
        }

        throw fail(
            `Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '${
                parent ? parent.path : ""
            }/${subpath}', but it lives already at '${existingNode.path}'`
        )
    }

    // not a node, a snapshot
    return new ObjectNode(type, parent, subpath, environment, initialValue as C)
}

/**
 * @internal
 * @hidden
 */
export function createScalarNode<C, S, T>(
    type: SimpleType<C, S, T>,
    parent: AnyObjectNode | null,
    subpath: string,
    environment: any,
    initialValue: C
): ScalarNode<C, S, T> {
    return new ScalarNode(type, parent, subpath, environment, initialValue)
}

/**
 * @internal
 * @hidden
 */
export function isNode(value: any): value is AnyNode {
    return value instanceof ScalarNode || value instanceof ObjectNode
}
