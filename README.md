# Vue 数据绑定原理

## 一句话概括

> 基于 ES5 的 Object.defineProperty() 这个方法对数据做劫持。劫持数据的 setter 与 getter 。然后结合
发布订阅模式在数据发生数据，通知页面进行更新。

> 由于 ES5 的 Object.defineProperty() 这个方法不兼容 IE8 。所以我们的 vue 的兼容性也是不兼容 IE8 既以下版本

## 自己简单实现一个 Vue 源代码

1. 提供一个 Vue 类
2. 在 类中 定义 构造函数
3. 实现 $el $data 这两个实例属性
4. 实现 代理属性
  vm.name   => 张三
  vm.age    => 18

  <!--
      取值： this.name 的时候，会进入到 get 函数中
      赋值： this.name = xxxx 的时候，会进入到 set 函数中
   -->
  Object.defineProperty(this, 'name', {
    get () {
      console.log('取值')
      return '我的天'
    },

    set (value) {
      console.log('赋值', value)
    }
  })

5. 实现 页面的解析
  {{ name }} => 张三
  {{ age }}  => 18

  1. 给你一个 DOM 对象，输出这个 DOM 对象中的所有文本节点

    <div id="app">
      <p>{{ name }}</p>

      <p>{{ age }}</p>
    </div>

    el.childNodes   => [text, p, text, p, text]

    还需要拿到  {{ name }} 与 {{ age }}

6. 数据变化时，引起页面的更新

  使用 发布订阅模式。类似 之前 $on()  $emit()

  在使用了数据时，做一个 $on() 监听
  在数据发生变化时，做一个 $emit() 触发

# Vue 数据双向绑定的原理

基于 数据绑定原理，再监听表单元素的input事件，在input里面修改了数据。

v-model => :value @input
