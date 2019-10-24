class message {
    constructor(customDialogue) {
        this.customDialogue = customDialogue
    }

    defaultMesssage() {
        let message
        let now = (new Date()).getHours()
        if (now > 23 || now <= 5) {
            message = '这么晚了还不睡么?  明天再来嘛! 愿你有个好梦!'
        } else if (now > 5 && now <= 7) {
            message = '早安朋友！一日之计在于晨,新的一天开始了'
        } else if (now > 7 && now <= 12) {
            message = '上午好呀! 工作顺利么? 不要久坐,多活动活动'
        } else if (now > 12 && now <= 14) {
            message = '中午了,现在是午餐时间! 饭要好好吃哟'
        } else if (now > 14 && now <= 16) {
            message = '午后容易犯困,打起精神来！我的朋友'
        } else if (now > 17 && now <= 19) {
            message = '傍晚了！ 窗外夕阳的依旧柔红,再多看一眼,在多保存一份美丽'
        } else if (now > 19 && now <= 21) {
            message = '晚上好! 今天过的怎么样啊? 未留下悔恨么?'
        } else if (now > 21 && now <= 23) {
            message = '已经这么晚了呀，早点休息吧，晚安~'
        } else {
            message = `大爷，欢迎来玩啊`
        }
        return message
    }

    monitor(showCallback, hideCallback) {
        let elMouseover = this.customDialogue.mouseover
        let elClick = this.customDialogue.click
        for (let itemMouseover of elMouseover) {
            for (let iMouseover = 0, lenMouseover = itemMouseover.selector.length; iMouseover < lenMouseover; iMouseover++) {
                let selectorMouseover = document.querySelector(itemMouseover.selector[iMouseover])
                if (selectorMouseover) {
                    selectorMouseover.removeEventListener('mouseenter', () => showCallback(itemMouseover.message))
                    selectorMouseover.addEventListener('mouseenter', () => showCallback(itemMouseover.message))
                    selectorMouseover.removeEventListener('mouseleave', () => hideCallback())
                    selectorMouseover.addEventListener('mouseleave', () => hideCallback())
                }
            }
        }
        for (let itemClick of elClick) {
            for (let iClick = 0, lenClick = itemClick.selector.length; iClick < lenClick; iClick++) {
                let selectorClick = document.querySelector(itemClick.selector[iClick])
                if (selectorClick) {
                    selectorClick.removeEventListener('click', () => showCallback(itemClick.message))
                    selectorClick.addEventListener('click', () => showCallback(itemClick.message))
                    selectorClick.removeEventListener('mouseleave', () => hideCallback())
                    selectorClick.addEventListener('mouseleave', () => hideCallback())
                }
            }
        }
    }

    randomInteger(max, min = 0) {
        return Math.round(Math.random() * (max - min) + min)
    }
}

export default message