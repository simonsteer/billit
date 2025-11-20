import {
  BoxLayoutNode,
  FieldLayoutNode,
  ImageLayoutNode,
  LayoutMode,
  RootLayoutNode,
  TextLayoutNode,
} from '@/lib/layouts/types'
import { Box } from './Box'
import { Root } from './Root'
import { Text } from './Text'

export function LayoutNodeComponent({
  data,
  components,
  itemKey,
  node,
  mode,
}: {
  node:
    | RootLayoutNode
    | BoxLayoutNode
    | TextLayoutNode
    | FieldLayoutNode
    | ImageLayoutNode
  data: any
  components: any
  itemKey?: string
  mode: LayoutMode
}) {
  switch (node.type) {
    case 'box':
      return (
        <Box key={node.id} mode={mode} style={node.style}>
          {node.children.map(node => (
            <LayoutNodeComponent
              key={node.id}
              components={components}
              data={data}
              itemKey={itemKey}
              mode={mode}
              node={node}
            />
          ))}
        </Box>
      )
    case 'field':
      const value = data[node.value]
      const Component = components[node.value]
      if (node.template) {
        if (Array.isArray(value)) {
          if (value.length === 0) return null
          return (
            <Box key={node.id} mode={mode} style={node.style}>
              {value.map(item => {
                const itemKey = Component.key(item)
                return (
                  <LayoutNodeComponent
                    key={itemKey}
                    components={Component.components}
                    data={item}
                    itemKey={itemKey}
                    mode={mode}
                    node={node.template!}
                  />
                )
              })}
            </Box>
          )
        }
        return (
          <Box key={node.id} mode={mode} style={node.style}>
            <LayoutNodeComponent
              components={Component.components}
              data={value}
              itemKey={itemKey}
              mode={mode}
              node={node.template}
            />
          </Box>
        )
      }
      return <Component key={node.id} itemKey={itemKey} node={node} />
    case 'image':
      return null
    case 'text':
      return (
        <Text key={node.id} mode={mode} style={node.style}>
          {node.value as any}
        </Text>
      )
    case 'root':
      return (
        <Root key={node.id} mode={mode} style={node.style}>
          {node.children.map(node => (
            <LayoutNodeComponent
              key={node.id}
              components={components}
              data={data}
              itemKey={itemKey}
              mode={mode}
              node={node}
            />
          ))}
        </Root>
      )
    default:
      return null
  }
}
