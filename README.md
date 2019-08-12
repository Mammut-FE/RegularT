# RegularT
regularjs support typescript 

## 安装

`npm i regularts`

## 使用

1. 定义 Regular

```typescript
import Regular from 'regularjs';
import { RegularT } from 'regularts';

RegularT.setRegular(Regular);
```

2. 通过 class 语法编写组件

```typescript
export type Placement = 'left' | 'right' | 'bottom' | 'top' | string;
export type Trigger = 'hover' | 'click' | string;

// 定义外部传入变量
export interface TooltipProps {
    title: string;
    placement: Placement;
    visible: boolean;
    trigger: Trigger;
}

// 定义组件内部变量
export interface TooltipStats {
}

// 定义组件类
export class TooltipComponent extends RegularT<TooltipProps, TooltipStats> {
    template = template;
    name = 'ui-tooltip';
    tooltipWrapRef: Element = null;
    tooltipContext = null;
    showTooltipHandle = null;
    hideTooltipHandle = null;
    showTooltipTimer = null;
    hideTooltipTimer = null;

    data = {
        title: '',
        placement: 'top',
        visible: false,
        styles: styles,
        trigger: 'hover'
    };

    config(data?: TooltipProps & TooltipStats) {
        this.tooltipContext = new TooltipContext({
            data
        });
        this.tooltipContext.$inject(document.body);

        this.tooltipContext.$on('enter', () => {
            this.clearTimer();
        });

        this.tooltipContext.$on('out', () => {
            this.hideTooltip();
        });
    }

    init(data?: TooltipProps & TooltipStats) {
        this.tooltipWrapRef = this.$refs['wrap'];
        this.initEvent();
    }

    destroy() {
        this.tooltipContext.destroy();
        this.offEvent();
        this.supr();
    }

    initEvent() {
        const {trigger} = this.data;
        this.showTooltipHandle = ($event: MouseEvent) => {
            this.showTooltip();
        };
        this.hideTooltipHandle = ($event: MouseEvent) => {
            if (this.tooltipWrapRef.contains($event.relatedTarget as Node)) {
                return;
            }

            this.hideTooltip();
        };

        switch (trigger) {
            case 'click':
                break;
            case 'hover':
                this.tooltipWrapRef.addEventListener('mouseenter', this.showTooltipHandle);
                this.tooltipWrapRef.addEventListener('mouseout', this.hideTooltipHandle);
                break;
        }
    }

    offEvent() {
        const {trigger} = this.data;

        switch (trigger) {
            case 'click':
                break;
            case 'hover':
                this.tooltipWrapRef.removeEventListener('mouseenter', this.showTooltipHandle);
                this.tooltipWrapRef.removeEventListener('mouseout', this.hideTooltipHandle);
                break;
        }
    }

    clearTimer() {
        if (this.hideTooltipTimer) {
            clearTimeout(this.hideTooltipTimer);
            this.hideTooltipTimer = null;
        }

        if (this.showTooltipTimer) {
            clearTimeout(this.showTooltipTimer);
            this.showTooltipTimer = null;
        }
    }

    showTooltip() {
        this.clearTimer();

        this.showTooltipTimer = setTimeout(() => {
            const {visible} = this.data;

            if (visible) {
                return;
            }

            const wrapPosition = this.tooltipWrapRef.getBoundingClientRect();
            this.tooltipContext.$show(wrapPosition);
            this.data.visible = true;
        }, 100);
    }

    hideTooltip() {
        this.clearTimer();

        this.hideTooltipTimer = setTimeout(() => {
            this.tooltipContext.$hide();
            this.data.visible = false;
        }, 100);
    }
}
```

3. 注册 Regular 组件

```typescript
export const Tooltip = RegularT.extend(TooltipComponent);
```

## 核心原理

`Regular` 注册组件时，需要我们传入一个特定的对象。`Regular` 会对传入的对象进行扩展，返回最终的组件。

所以我们只需要将我们通过 class 创建的对象转换成 Regular 所需要的对象即可。

由于需要实现语法提示，我在 `RegularT` 定义了 `Regular` 的内部函数，如 `init`、`config` 等，在转换是需要将其去掉，最终通过下面函数实现

```typescript
class RegularT {
  static extend(regularT: { new(): RegularT }) {
      const regularTInstance = new regularT();
      const regularObject = Object.create({});

      let prototype: any = regularTInstance;

      while (prototype) {
        if (prototype.constructor === RegularT) {
          break;
        }

        Object.keys(prototype).forEach(key => {
          regularObject[key] = prototype[key];
        });

        prototype = prototype.__proto__;
      }

      delete regularObject.constructor;

      return RegularJs.extend(regularObject);
    }  
}
```



## 开发计划

- [ ] 扩展内部方法，以期在 node 环境下模拟运行 Regular，方便测试组件
- [ ] 添加依赖注入


