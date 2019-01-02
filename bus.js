class Subject { // 主题
	constructor(name) {
		this.name = name; // 主题名
		this.subscribers = []; // 订阅者数组
	}

	// 通知所有的订阅者更新状态
	notify(data) {
		this.subscribers.forEach(element => {
			element.handle(data);
		});
	}

	// 将订阅者push进维护的数组中
	attach(ob) {
		this.subscribers.push(ob)
	}
}


class Subscriber { // 订阅者
	constructor() { 
		this.cb = null; // 订阅者注册 在主题更新时执行的回调方法
		this.subject = null; // 订阅的主题
	}

	/**
	 * @description: 订阅主题 调用主题的attach方法 将自身push进数组中
	 * @param {Subject}  subject 订阅主题
	 * @param {FUnction} cb 回调方法
	 */
	subscribe(subject, cb) {
		this.subject = subject;
		this.cb = cb;
		this.subject.attach(this);
	}

	handle(data) { // 订阅者注册的回调函数
		this.cb(data);
	}
}



// 事件总线类
class Bus {
	constructor() {
		this.subjectArr = []; // 存放所有主题的数组
		this.historyFires = {}; // 所有主题最后一次更新对应的数据
	}

	subjectIsExist(subjectName) { // 判断是否存在该主题
		for (let i = 0; i < this.subjectArr.length; i++) {
			if (this.subjectArr[i].name == subjectName) { // 存在直接返回
				return this.subjectArr[i]
			}
		}
		return false;
	}

	/**
	 * @description: 监听自定义事件
	 * @param {String} subjectName 事件名
	 * @param {Function} cb 事件触发时要执行的方法
	 */
	on(subjectName, cb) {
		let curSubject = null;
		if (!this.subjectIsExist(subjectName)) { // 不存在直接实例化当前主题 并推入主题数组
			curSubject = new Subject(subjectName);
			this.subjectArr.push(curSubject);
		} else {
			curSubject = this.subjectIsExist(subjectName);
		}
		let subscriber = new Subscriber(); // 实例化一个订阅者
		subscriber.subscribe(curSubject, cb);
		if (this.historyFires[subjectName]) { // 如果该事件曾经触发过则直接执行回调方法 并传入历史数据
			cb(this.historyFires[subjectName])
		}
	}

	/**
	 * @description: 触发某事件
	 * @param {String} subjectName 事件名
	 * @param {Any} data 要传递的数据
	 */
	fire(subjectName, data) {
		let tarSubject = this.subjectArr.find(item => {
			return item.name === subjectName
		});
		if (tarSubject) tarSubject.notify(data);
		this.historyFires[subjectName] = data; // 更新最后一次触发时传入的data
	}

	// 取消事件监听
	off(subjectName) {
		if (this.subjectIsExist(subjectName)) { // 找到目标主题
			let idx = this.subjectArr.findIndex((item) => {
				return item.name === subjectName
			})
			this.subjectArr.splice(idx, 1);
		} else {
			throw new Error(`${subjectName} is not been registered`)
		}
	}
}

export default new Bus();



