
import context from '../main.js'
console.log(context)

const Base = class {
    // 设置请求
    setUrl (value) {
        this.url = process.env.VUE_APP_HOST + value;
    }

    // 设置请求头
    setHeader (value) {
        this.header = Object.assign({
            'Content-Type':'application/json'
        }, value);
    }

};

export default class extends Base {
    // 请求地址
    url;
    // 请求头
    header = {};
    // 发送参数
    sendData = {};
    // 发送方法
    method = 'POST';

    

    setUrl(value) {
        this.url
    }
    
};