/*!
 * Koa CMS Backstage management
 *
 * Copyright JS siro
 * Released under the ISC license
 * Email siro@foxmail.com
 *
 */

// import md5 from 'blueimp-md5';
import {_md5} from "../../utils/cryp"
import * as PayServices from "../../services/api/pay"
import * as OrderServices from "../../services/api/order"
import { SuccessModel, ErrorModel, ErrorStatusModel,SuccessStatusModel } from "../../model/ResModel"
import { findPayFailInfo, findPayExceptionInfo, saveOrderFailInfo, noPayFailInfo, payPramFailInfo, listenPayFailInfo, payInterfaceFailInfo, payInitFailInfo,payTestFailInfo } from "../../model/ErrorInfo"
import { PayModel } from '../../db/model/index'
import { OrderModel } from '../../db/model/index'
import {getId} from '../../utils/generateids'
import {config} from '../../config'
// import * as cPay from 'cpay'

const fs = require('fs')
const Alipay = require('alipay-mobile').default



/**
 *  支付测试
 * @param {object} params 支付测试
 */

export const testPay = async (params?: any) => {
    try{
        // const read = filename => {
        //     return fs.readFileSync(path.resolve(__dirname, filename))
        //   }
          //notify_url: 异步通知url
          //app_id: 开放平台 appid
          //appPrivKeyFile: 你的应用私钥
          //alipayPubKeyFile: 蚂蚁金服公钥
          console.log("/controller/api/pay.ts----testPay-params---->")
          console.log(params)
         let {out_trade_no, total_amount} = params
          const options = {
            app_id: '2021002112674054',
            appPrivKeyFile: 'MIIEowIBAAKCAQEAll09KlQkiwtIdikocx+VfuIRu4pSqrQHcXeHdv1uvQ8nGNBZ4lWAR+7vLvhxXRhVF0hG0Fwn/Sjaz+f2cgWrC4riaH95JBx1v2q2seQ9iHcWLg0yrenNdV8FkbHGYs4Cm+0cok4PFRap4nmjna29zqhT5c+K6WwScPnOK1ArBgn064E37oj/Ut1+Xdfim0G169MOoIyeyHJIa21C6UJEntRcK9H2GNziTg9pZanPlZuYIa4I8l5C+NleGFr0f5X1/inhifgnlNo30zefI96eTpjZKDopRuUPXjljdhISLMexf2XwIPzmxitHip6cksVfHFrwG/05oP8mvy7ruLhiTwIDAQABAoIBADCHp1YiEilOWvTIE+YUK4voKxD8c/HkaQKWMYKWCUe7vEKl/Fywe9a7pzbhuLTzRYNeMHzPQZjTtsujckcazTnMeYaAnfipttcw+gYwRCvnQ6FZYSIAc++N255KYl1BYFYzESrRRszno60U1Vnu2XP5oBpsAcmUt97+wSv5k+k+jUWowVJufhSkr/xKJnw4hyeZagJgu4S8f/2ADiwjJ+ZYfbMqw29Gz1jVhkya9sOlaZ8iJ+pK/fxHV9NrkZkadDr/7wUZPGrjldkzIZEfQHI/FSxk6yevLwg6DITxiUbPtZgV0IAwgVHoiJ1tuJrGM1uSYsZOeWqTYsFWgGS7+gECgYEA5O6jfNFEisJ/mvHetuCO93WGkEsr8+Hy+b4BsLQ1aGW0Q7lZZfss3+g+Qy4Iqyl0FRSpOJtNkqkaIVGYkxYll5ocm52e4y2OfisiFXKqGZIioPo7oYJIP4k1ulzIsgKm4u/XyKKDnQTUuSeVTHQLQAClWa7gGBT80ZmvptOz/ZkCgYEAqCR9mRdEQWdHwbctzxbiujNKWArjNd88P6VJWSCzimO5BuC/KfFpifRIDvQ5sc0GC1KWvNMoNp0kE8lt499qyQYVSPXuWzQsWHw2IjvYhIY/Ilo3kIXwlEsHSEm4vl5/WYEWYIwETsLEnQgjxPq5LQeAKUxfXH/ZHkmYzzcqwCcCgYBUzODaV1ogXDOQXY+2BjBvEaWqxW2ehU/PmsZdgiNWbHX9sCahVA0nU4vcrqyfWleZh3G3ei+d5+258dOmiEmcgoWeTyCP3kwuCCQz9al0l2EkaAy2ot/ISTcRtVTSO5E99sHjm+9MtoFlpHf1Pfb82kBlnBV+VifgLCGYlkrR4QKBgQCBxMf6o25WW/ORmmKMdck+k99I2/5H0aaaKGLXmtl2cUiX+lUPdfZSNmp2wB7XDrkfe/pCeWWL4PO7IbbiK8gqpbs/uC7hzP58vEC7YxzUCxgm1yITNIxcpxtTuzIOGriGx44RrX6VmtRLrcCNgkPwcN2FAiCHL1TOf1akdptT+QKBgBfVJmuoGKLFvpBE/qDZnrPuqwejQ9DY4JH9gdN/m/djQfBev1uY0lGQQRhl3w1txt4NhfeZsEJyXbi/fQW0QHk+unMysjH1TjDA1Gw9NbocRd6OwgTQQ8DCQih9UstHo8IREixRQ6UFJmO6pB78QngpxxdhHiBnQ7dbOSlOFr01',
            alipayPubKeyFile: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtjGIVLCUNyVufdzvVbMwHKRBDThFW1fAHaBJpFA3s8+51PBoN2NYHysdiyFKtvpcBr7RfIe/KXFU7RFDD+GCGOYZKIEU2FaveqxDg5hmJPCu2ALlQ+geL60oBIwA09PS7XDDUb1EX83JL0Y2ImzvP13Y/FsU4CnTiiscpqUYlRXEPVKaHkOktIXYaSp5Q3UzFIlVpziWAnmXgM2vg7EO77f0+uLLhRvgwhVcAdYFjbPzyieMJirVdmUdV8IABSPsVRsk4LHGZSklV6THD2ZbCsNQmZDcPWsiX/21NHPoumhPpjIqvV+H0FEgDAQ3FTgkfV21qRoblyt2rLMJR9G4YQIDAQAB'
            // appPrivKeyFile: read('./keys/app_priv_key.pem'),
            // alipayPubKeyFile: read('./keys/alipay_public_key.pem')
          }
          
          const service = new Alipay(options)
          let data = {
            subject: '辣条',
            out_trade_no: String(out_trade_no),
            total_amount: String(total_amount),
            body: '订单描述在这里'
          }
          const basicParams = {
            return_url: 'http://127.0.0.1:8080'
          }
          const result = service.createWebOrderURL(data, basicParams)
        //   const result = service.createOrder(data)
        //   assert(result.code == 0, result.message)
        if (result) {
            console.log("result----->")
            console.log(result)
          return new SuccessModel(result);
        } else {
          return new ErrorModel(saveOrderFailInfo);
        }        
    }catch(error){
        console.log('支付测试失败', error);
        return new ErrorStatusModel(payTestFailInfo);        
    }

}

/**
 *  准备支付
 * @param {object} params 准备支付
 */
export const initPay = async (params: any) => {
  //传入订单 和支付方式
  let {id, order_id, orderType, payType, method, amount, user_id}  = params;
  let data = {
    id, order_id, orderType, payType, method, amount, user_id
  };
  if (!order_id) {
    return new ErrorStatusModel(payPramFailInfo);
  }
    try{
        let pay = await PayServices.findOnePay(order_id)
        if (pay && (pay as any).code === 200) {
            return new SuccessStatusModel({
                message: '该订单已完成支付！',
                data:{
                    status: 302
                }
            })
        }
        if (pay) {      //如果该订单已经提交 但是没有支付 重新初始化订单
            pay.remove();
        }
        let payData = {
            amount: amount,       //这里都是设置1分钱支付
            tradeName: '外卖订单支付',  //商户自定义订单标题
            outTradeNo: id + '',   //商户自主生成的订单号
            payType: payType,    //支付渠道
            payuserid: user_id,            //商家支付id
            notifyUrl: config.notifyUrl, //服务器异步通知
            synNotifyUrl: config.synNotifyUrl,
            appkey: config.appkey,          //appKey
            method,
            timestamp: new Date().getTime() + '',
            version: '1.0',
            sign:''
        }

        let sign: string = ''
        if (method === 'trpay.trade.create.scan') {     //扫码支付
            sign = signed(payData);
            payData['sign'] = sign;
            let result = await scanPay(payData);
            if (result.code !== '0000') {
                return new ErrorStatusModel(payInterfaceFailInfo)
            }
            let getQRCodeResult = await PayServices.savePay2({method: 'scan', id, order_id, payType})
            if (getQRCodeResult){
                return new SuccessStatusModel({
                    message: '获取二维码成功，请扫码支付',
                    data: {status: 1, order_id, ...result, ...payData}
                })
            }
        } else {                                                             //调用app支付
            payData.synNotifyUrl = `${config.synNotifyUrl}/#/order_detail?id=${order_id}`;            //客户端同步跳转
            sign = signed(payData);
            payData['sign'] = sign;
            let callAppPayResult = await PayServices.savePay2({method: 'wap', id, order_id, payType, code: 0});
            if (callAppPayResult){
                return new SuccessStatusModel({
                    message: '调用app支付初始化成功',
                    data: {status: 200, ...payData}
                })
            }
        }
    }catch(error){
        console.log('初始化支付失败', error);
        return new ErrorStatusModel(payInitFailInfo);
      }

  // console.log(tel, address, person);
  let result = await PayServices.savePay(data);
  if (result) {
    return new SuccessModel(result);
  } else {
    return new ErrorModel(saveOrderFailInfo);
  }
};


/**
 *  //扫码支付实时监听
 * @param {object} params 扫码支付实时监听
 */
export const listenStatus = async (params: any) => {
    let {id} = params.query.outTradeNo;
    let pay: any = {};
    try {
        pay = await PayServices.find(id);
        console.log('pay', pay)
        if (pay.code === 200) {
            return new SuccessModel({
                    data:{status: 200},
                    message: '支付完成'
                })
        } else {
           return new ErrorStatusModel(noPayFailInfo);
        }
    } catch (err) {
        return new ErrorStatusModel(listenPayFailInfo);
    }
  };


/**
 *  //查找支付订单
 * @param {object} params 通过order_id查找支付订单
 */
export const findPay = async (params: any) => {
    let {order_id} = params;
    console.log("params-------->")
    console.log(params)
    console.log(order_id)
    let result: any = {};
    try {
        result = await PayServices.findPayByOrderId(order_id);
        console.log('findPay result', result)
        if (result) {
            return new SuccessModel(result);
        } else {
           return new ErrorStatusModel(findPayFailInfo);
        }
    } catch (err) {
        return new ErrorStatusModel(findPayExceptionInfo);
    }
  };

/**
 *  //保存支付订单
 * @param {object} params 保存支付订单
 */
export const savePay = async (params: any) => {
    // // id:out_trade_no, //创建订单的时候，由服务器自增创建。out_trade_no
    // amount:this.amount, 
    // payType:this.payType, //支付渠道,1=支付宝，2=微信
    // // orderType: { type: Number, default: 1 }, // 订单状态 1，未支付，2，待发货，3，待收货，4，待评价，5，已取消
    // //status: 未支付，支付成功
    // method: "wap", //wap or scan
    // order_id: this.order_id,
    // // code:200
    // user_id: this.user_id, // 用户id
    // created_time:new Date().getTime(), 
    let created_time = new Date().getTime() + '';
    let out_trade_no = await getId('ty_pay_id') //自增id

    let {amount,payType,method,order_id,user_id } = params;
    let data = {
        amount,
        payType,
        method,
        order_id,
        user_id,
        created_time,
        id:out_trade_no
    }
    console.log("params-------->")
    console.log(params)
    console.log(data)
    let result: any = {};
    try {
        result = await PayServices.savePay(data);
        console.log('savePay result', result)
        if (result) {
            return new SuccessModel(result);
        } else {
           return new ErrorStatusModel(findPayFailInfo);
        }
    } catch (err) {
        return new ErrorStatusModel(findPayExceptionInfo);
    }
  };

/**
 *  //更新支付订单
 * @param {object} params 更新支付订单
 */
export const updatePay = async (params: any) => {
    // // id:out_trade_no, //创建订单的时候，由服务器自增创建。out_trade_no
    // amount:this.amount, 
    // payType:this.payType, //支付渠道,1=支付宝，2=微信
    // // orderType: { type: Number, default: 1 }, // 订单状态 1，未支付，2，待发货，3，待收货，4，待评价，5，已取消
    // //my_status: 未支付，支付成功
    // method: "wap", //wap or scan
    // order_id: this.order_id,
    // // code:200
    // user_id: this.user_id, // 用户id
    // created_time:new Date().getTime(), 

    let {amount,payType,method,order_id,id} = params;
    let data = {
        amount,
        payType,
        method,
        order_id,
        id
    }
    console.log("params-------->")
    console.log(params)
    console.log(data)
    let result: any = {};
    try {
        result = await PayServices.updatePay(data);
        console.log('updatePay result', result)
        if (result) {
            return new SuccessModel(result);
        } else {
           return new ErrorStatusModel(findPayFailInfo);
        }
    } catch (err) {
        return new ErrorStatusModel(findPayExceptionInfo);
    }
  };  


/**
 *  //扫码支付
 * @param {object} params 扫码支付实时监听
 */
const scanPay = async (payData:any) => {
    let formData = new FormData();
    for (let key in payData) {
        formData.append(key, payData[key]);
    }
    let result = await fetch('http://pay.trsoft.xin/order/trpayGetWay', {
        method: 'POST',
        body: formData
    })
    return result = await result.json();
}

// interface PayObject {
//     status?: string,
//     code?: Number,
//     order_id?: Object
// }  

//支付异步通知
export const payNotice = async (params: any) => {
    let noticeData = params.body;
    // let pay: any = {};
    // let order: any = {};
    console.log('noticeData---->', noticeData)
    try {
        let sign = noticeData.sign;
        delete noticeData.sign;
        let verifySign = signed(noticeData)
        console.log('verifySign === sign', verifySign === sign)
        if (verifySign === sign && noticeData.status === '2') { 
            // let pay:any = await PayModel.findOne({_id: noticeData.outTradeNo});           
            let pay = await PayServices.findOnePay(noticeData.outTradeNo);
            (pay as any).status = '支付成功';
            (pay as any).code = 200;
            let order = await OrderServices.findOneOrderByObjId((pay as any).order_id);
            (order as any).status = '支付成功';
            (order as any).code = 200;
            // order.code = 200;
            //更新支付信息，更新订单
            await pay.save();
            await order.save();
            // res.send(200);
            return new SuccessModel({
                status: 200,
                message: '支付完成'
            })
        }
    } catch (err) {
        console.log('支付失败', err);
    }
};

let signed = (payData:any) => {
    let keys = Object.keys(payData);
    keys = keys.sort();
    let string = '';
    for (let i = 0; i < keys.length; i++) {
        string = string + keys[i] + '=' + payData[keys[i]] + '&'
    }
    string = string + "appSecret=" + config.appSecret;
    // return md5(string).toUpperCase();
    return _md5(string).toUpperCase();
};