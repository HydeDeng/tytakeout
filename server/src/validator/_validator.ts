import * as Ajv from 'ajv'

const ajv = new Ajv({
  // allErrors: true  // 输出所有错误
})

/**
 * json schema 校验
 * @param {object} schema json schema 规则
 * @param {object} data 待校验数据 
 */
export const validator = (schema: any, data = {}) => {
  const valid = ajv.validate(schema, data)
  if (!valid) {
    return ajv.errors[0]
  }
}
export default {
  validator
}
