/*!
 * Koa CMS Backstage management
 *
 * Copyright JS suwenhao
 * Released under the ISC license
 * Email swh1057607246@qq.com
 *
 */
interface IProps {
  erron?: number;
  message?: any;
  data?: any;
}
/**
 *  基础模型 
 */
class BaseModel {
  erron?: number;
  message?: string;
  data?: any;
  constructor({ erron, message, data }: IProps) {
    this.erron = erron
    this.message = message
    this.data = data
  }
}

/**
 *  成功的数据模型 
 */

export class SuccessModel extends BaseModel {
  constructor(data = {}) {
    super({
      erron: 0,
      message: null,
      data
    })
  }
}

/**
 *  失败的数据模型
 */

export class ErrorModel extends BaseModel {
  constructor({ erron, message }: IProps) {
    super({
      erron,
      message,
      data: null
    })
  }
}

/**
 *  失败带数据反馈的模型
 */

export class ErrorStatusModel extends BaseModel {
  constructor({ message, data = {} }: IProps) {
    super({
      erron: 0,
      message,
      data,
    })
  }
}

/**
 *  失败带数据反馈的模型
 */

export class SuccessStatusModel extends BaseModel {
  constructor({ message, data = {} }: IProps) {
    super({
      erron: 0,
      message,
      data,
    })
  }
}

export default {
  SuccessModel,
  ErrorModel,
  ErrorStatusModel,
  SuccessStatusModel
}