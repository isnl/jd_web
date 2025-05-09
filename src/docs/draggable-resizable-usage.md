# vue-draggable-resizable-next 使用指南

本项目使用 `vue-draggable-resizable-next` 实现了元素的拖拽、缩放和旋转功能。这是一个专为 Vue 3 设计的组件库。

## 基本使用

```vue
<vue-draggable-resizable
  :x="element.x"
  :y="element.y"
  :w="element.width"
  :h="element.height"
  :parent="true"
  :draggable="true"
  :resizable="true"
  :active="isActive"
  :handles="['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml']"
  @activated="onActivated"
  @dragstop="onDragStop"
  @resize="onResize"
>
  <!-- 内容放这里 -->
</vue-draggable-resizable>
```

## 关键属性说明

| 属性                 | 类型    | 默认值                                           | 说明                         |
| -------------------- | ------- | ------------------------------------------------ | ---------------------------- |
| x                    | Number  | 0                                                | 元素的 X 坐标                |
| y                    | Number  | 0                                                | 元素的 Y 坐标                |
| w                    | Number  | 200                                              | 元素的宽度                   |
| h                    | Number  | 200                                              | 元素的高度                   |
| parent               | Boolean | false                                            | 是否将拖拽范围限制在父元素内 |
| draggable            | Boolean | true                                             | 是否可拖拽                   |
| resizable            | Boolean | true                                             | 是否可调整大小               |
| active               | Boolean | false                                            | 元素是否处于激活状态         |
| handles              | Array   | ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'] | 调整大小的手柄               |
| r                    | Number  | 0                                                | 旋转角度（度）               |
| rotatable            | Boolean | false                                            | 是否可旋转                   |
| min-width            | Number  | 50                                               | 最小宽度                     |
| min-height           | Number  | 50                                               | 最小高度                     |
| prevent-deactivation | Boolean | false                                            | 阻止元素失去激活状态         |

## 事件

| 事件名      | 参数                        | 说明                   |
| ----------- | --------------------------- | ---------------------- |
| activated   | -                           | 元素被激活时触发       |
| deactivated | -                           | 元素失去激活状态时触发 |
| dragstart   | -                           | 开始拖拽时触发         |
| drag        | x, y                        | 拖拽过程中触发         |
| dragstop    | x, y                        | 结束拖拽时触发         |
| resizestart | handle                      | 开始调整大小时触发     |
| resize      | handle, x, y, width, height | 调整大小过程中触发     |
| resizestop  | handle, x, y, width, height | 结束调整大小时触发     |
| rotate      | rotation                    | 旋转时触发             |

## 样式自定义

可以通过以下属性自定义组件样式：

- `class-name`: 组件的基础类名
- `class-name-active`: 组件激活时的类名
- `class-name-handle`: 调整大小手柄的类名
- `class-name-rotate-handle`: 旋转手柄的类名

示例：

```vue
<vue-draggable-resizable
  class-name="my-element"
  class-name-active="my-element-active"
  class-name-handle="my-handle"
  class-name-rotate-handle="my-rotate-handle"
>
  <!-- 内容 -->
</vue-draggable-resizable>
```

## CSS样式示例

```css
/* 自定义调整手柄样式 */
.my-handle {
  width: 10px !important;
  height: 10px !important;
  background-color: white !important;
  border: 1px solid #1976D2 !important;
  border-radius: 50% !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2) !important;
}

/* 旋转手柄样式 */
.my-rotate-handle {
  width: 14px !important;
  height: 14px !important;
  background-color: #1976D2 !important;
  border-radius: 50% !important;
  top: -25px !important;
  left: 50% !important;
  margin-left: -7px !important;
  cursor: crosshair !important;
}

/* 选中元素时显示半透明边框 */
.my-element-active {
  border: 2px dashed rgba(25, 118, 210, 0.7) !important;
  box-shadow: 0 0 8px rgba(25, 118, 210, 0.3) !important;
}

/* 元素初始无边框 */
.my-element {
  border: 1px solid transparent;
  transition: border 0.3s ease, box-shadow 0.3s ease;
}
```

## 更多信息

查看官方文档以获取更多信息：[vue-draggable-resizable](https://github.com/mauricius/vue-draggable-resizable) 