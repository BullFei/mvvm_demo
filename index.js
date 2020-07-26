// 自己实现的 vue 源码
//提供一个 类 Event 类
class Event{
  constructor(){
    this.dep = {}
  }
  $on(eventName, callback){
    if(!this.dep[eventName]){
      this.dep[eventName] = [];
    }
    this.dep[eventName].push(callback);
  }
  $emit(eventName, payload){
    if(this.dep[eventName]){
      this.dep[eventName].forEach(item => {
        item(payload);
      })
    }
  }
}
// 提供一个 Vue 的构造函数，或者实现一个 Vue 的类

class Vue {
  //构造函数
  constructor(options) {
    this.$el = document.querySelector(options.el);
    this.$data = options.data;

    //实现代理属性
    this.observer(this.$data);

    //生成一个Event的实例
    this._ev = new Event();

    //解析
    new Compile(this.$el, this);
  }
  /*
    将传递过来的对象中的属性直接绑定到实例对象上
    observer(data)
  */
  observer(data) {
    //遍历 data 这个对象
    Object.keys(data).forEach((key) => {
      Object.defineProperty(this, key, {
        set(newValue) {
          data[key] = newValue;
          //数据更新了，触发事件
          this._ev.$emit(key, newValue);
        },

        get() {
          return data[key];
        },
      });
    });
  }
}

//提供一个 Compile 类，来做页面解析工作
class Compile {
  /**
   * @param {DocumentFragment} el DOM对象
   * @param {Vue} vm
   */
  constructor(el, vm) {
    //将 vm 绑定到当前 Compile 的实例上
    this.vm = vm;
    //遍历el这个dom对象
    this.compile(el);
  }
  compile(el) {
    el.childNodes.forEach((node) => {
      //判断节点类型
      if (node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)) {
        console.log(node.textContent);
        //直接将当前的 node.textContent 给修改了
        let exp = RegExp.$1.trim();
        node.textContent = this.vm[exp];

        //监听
        this.vm._ev.$on(exp, () => {
          node.textContent = this.vm[exp];
        })
      }
      //递归判断子节点
      if(node.childNodes){
        this.compile(node);
      }
    });


  }
}
