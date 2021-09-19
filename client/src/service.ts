import request from "./utils/request"
/**
 * 获取城市列表
*/
export const getCityList = <T>(data: any = {}) => request<T>({
    url: `/api/city/list`,
    data
});
/**
 * 获取城市输入地点列表
*/
export const getSearchAddressList = <T>(data: any = {query: '车陂', region: '广州'}) => request<T>({
    url: `/api/city/address_list`,
    data
})
/**
 * 获取城市输入地点列表
*/
export const getAddressDetail = <T>(data: any = {geohash: '23.12013,113.391723'}) => request<T>({
    url: `/api/city/address_detail`,
    data
})
/**
 * 获取分类列表
*/
export const getCategorieList = <T>(data: {parent_id: number} = {parent_id: 0}) => request<T>({
    url: `/api/categorie/list`,
    data
})

/**
 * 获取餐馆列表
*/
export const getShoppingList = <T>(data: any) => request<T>({
    url: `/api/shopping/restaurants`,
    data
})

/**
 * 搜索餐馆和食品
*/
export const searchRestaurantsAndFoods = <T>(data: any) => request<T>({
    url: `/api/searching/restaurants_and_foods`,
    data
})

/**
 * 获取优惠活动列表
*/
export const getPromotionList = <T>(data: any) => request<T>({
    url: `/api/promotion/list`,
    data
})

/**
 * 获取优惠活动列表
*/
export const getShopInfo = <T>(data: any) => request<T>({
    url: `/api/shopping/info`,
    data
})
/**
 * 获取验证码
*/
export const getSms = <T>(data: any) => request<T>({
    url: `/api/sms`,
    data
})
/**
 * 登录
*/
export const login = <T>(data: any) => request<T>({
    url: `/api/login`,
    method: 'post',
    data
})
/**
 * 获取个人信息
*/
export const getUserInfo = <T>(data: any) => request<T>({
    url: `/api/center/info`,
    data
})
/**
 * 获取个人地址列表
*/
export const getArealist = <T>(data: any) => request<T>({
    url: `/api/center/myaddress`,
    data
})
/**
 * 获取省市区列表
*/
export const getAreaData = <T>(data: any) => request<T>({
    url: `/api/center/area`,
    data
})
/**
 * 添加我的地址
*/
export const addMyAddress = <T>(data: any) => request<T>({
    url: `/api/center/add_address`,
    method: 'post',
    data
})
/**
 * 修改我的地址
*/
export const editMyAddress = <T>(data: any) => request<T>({
    url: `/api/center/edit_address`,
    method: 'post',
    data
})
/**
 * 删除我的地址
*/
export const deleteMyAddress = <T>(data: any) => request<T>({
    url: `/api/center/delete_address`,
    method: 'post',
    data
})
/**
 * 上传头像
*/
export const uploadAvatar = <T>(data: any) => request<T>({
    url: `/api/uploadfile`,
    method: 'post',
    data
})

/**
 * 获取店铺评论列表
*/
export const getShopComments = <T>(data: any = {shop_id: '5de73461959ed742d83e74ca'}) => request<T>({
    url: `/api/comments/list`,
    data
})

// //提交订单
// export const submitOrder = (data) => {
//     let req = {
//       data,
//       url: 'v1/order'
//     };
//     return _post(req);
//   }
/**
 * 提交订单
*/
export const saveOrder = <T>(data: any) => request<T>({
    url: `/api/order/save`,
    method: 'post',
    data
})

/**
 * 查询指定订单
*/
export const findOrder = <T>(data: any) => request<T>({
    url: `/api/order/find`,
    data
})

/**
 * 更新订单
*/
export const updateOrder = <T>(data: any) => request<T>({
    url: `/api/order/update`,
    method: 'post',
    data
})

/**
 * 获取订单列表
*/
export const orderList = <T>(data: any) => request<T>({
    url: `/api/order/list`,
})

/**
 * 获取订单信息
*/
export const orderInfo = <T>(data: any) => request<T>({
    url: `/api/order/info`,
    data
  });

/**
 * 准备支付
*/
export const initPay = <T>(data: any = {}) => request<T>({
    url: `/api/pay/init`,
    method: 'post',
    data
  });

//获取我的订单
// export const orders = (data) => {
//     let req = {
//       data,
//       url: 'v1/orders'
//     }
//     return _get(req);
//   }

//获取我的订单
export const myOrders = <T>(data: any = {}) => request<T>({
    url: `/api/order/myOrders`,
    data
  });

//订单评论
export const addComment = <T>(data: any) => request<T>({
    url: `/api/comments/add`,
    method: 'post',
    data
});

//请求支付
export const requestPay = <T>(data: any) => request<T>({
    url: '/https://pay.ispay.cn/core/api/request/pay/',
    method: 'post',
    data
});
  
  //监听扫码支付状态
export const listenStatus = <T>(data: any) => request<T>({
    url: '/api/pay/listen_status',
    data
});
  

//支付测试
export const testPay = <T>(data: any = {out_trade_no: '1000000001'})  => request<T>({
    url: '/api/pay/testpay',
    method: 'post',
    data
});

//保存支付
export const savePay = <T>(data: any = {out_trade_no: '1000000001'})  => request<T>({
    url: '/api/pay/savepay',
    method: 'post',
    data
});

//保存支付
export const findPay = <T>(data: any = {out_trade_no: '1000000001'})  => request<T>({
    url: '/api/pay/findpay',
    data
});

//更新支付
export const updatePay = <T>(data: any = {out_trade_no: '1000000001'})  => request<T>({
    url: '/api/pay/updatepay',
    method: 'post',
    data
});