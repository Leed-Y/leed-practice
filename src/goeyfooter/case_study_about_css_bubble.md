# 案例解析：CSS不规则气泡的生成
案例来源: https://codepen.io/z-/pen/zYxdRQy  

### 源码分析
页面部分：
```pug
div.main
        div.footer
            div.bubbles
                - for (var i = 0; i < 128; i++) //Small numbers looks nice too
                    div.bubble(style=`--size:${2+Math.random()*4}rem; --distance:${6+Math.random()*4}rem; --position:${-5+Math.random()*110}%; --time:${2+Math.random()*2}s; --delay:${-1*(2+Math.random()*2)}s;`)
            div.content
        svg(style="position:fixed; top:100vh")
            defs
                filter#blob
                    feGaussianBlur(in="SourceGraphic" stdDeviation="10" result="blur")
                    feColorMatrix(in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="blob")
                    feComposite(in="SourceGraphic" in2="blob" operator="atop")
```
页面部分的结构很清晰，主要关注四个元素`div.bubbles`，`dic.content`，`svg`，以及在`svg`中定义的`filter#blob`，相关的CSS如下(非完整代码)：  
```scss
.bubbles {
    position: absolute;
    top:0;
    left:0;
    right:0;
    filter:url("#blob");
    .bubble {
        position: absolute;
        left:var(--position, 50%);
        background:var(--footer-background);
        border-radius:100%;
        animation:bubble-size var(--time, 4s) ease-in infinite var(--delay, 0s),
                  bubble-move var(--time, 4s) ease-in infinite var(--delay, 0s);
        transform:translate(-50%, 100%);
    }
}       
@keyframes bubble-size {}
@keyframes bubble-move {}
```
结合两部分的源码，在此案例中使用到的相关技术有：
1. pug模版`(相关文档：https://pugjs.org/zh-cn/api/getting-started.html)`
2. CSS`animation`属性及自定义animation：`@keyframes`
3. SVG filter  

逆向推导作者的设计思路：
1. 确定单形`div.bubble`，设置`border-radius:100%;`，将单形变为圆形
2. 为单形添加`animation`，`transform`，实现动态效果
3. 为单形配置`svg filter#blob`，使单形在动画过程中表现更加平滑
4. 复制多个单形于`div.bubbles`中，并使用`div.content`作为遮罩层
  
### 相关技术
#### CSS animation

#### SVG filter

### 延伸设计
#### 设计思路
#### 具体实现
#### 界面效果