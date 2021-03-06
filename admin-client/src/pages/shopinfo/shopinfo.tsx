import React, { Component } from 'react'
// antd
import {
  Card,
  Form,
  Row,
  Col,
  Input,
  InputNumber,
  DatePicker,
  Modal,
  Button,
  message
} from 'antd'
// component
import PictureWall from '../../components/PictureWall'
// redux
import { connect } from 'react-redux'
// base
import BaseComponent, { IBreadcrumb } from '../../base/base'
// router
import { RouteComponentProps } from 'react-router-dom'
// api
import {
  reqShopInfo,
  reqEditShopInfo
} from '../../api'
import { IMAGE_URL } from '../../config'
// plugin
import moment from '../../utils/moment';
// type
import { FormComponentProps } from 'antd/lib/form'
// css
import './shopinfo.less'

const Item = Form.Item


type IProps = FormComponentProps & RouteComponentProps & {
  mobile: boolean;
  backTop?: any;
  state?: any;
}
class ShopInfo extends Component<IProps> {
  public shopImgRef: any;
  public formRef: any;
  public state = {
    loading: false,
    visible: false,
    name: '',
    data: null,
    type: 'look',
    legal_person: '',
    licenses_number: '',
    licenses_scope: '',
    registered_address: '',
    registered_number: '',
    licenses_date: moment(),
    identificate_date: moment(),
    identificate_agency: '',
    company_name: '',
    shop_header_image: '',
    currentImg: '',
    submitLoad: false
  }
  private setSubmitLoad = (submitLoad: boolean = true) => {
    this.setState({
      submitLoad
    })
  }
  private handleSubmit = async (e: any) => {
    e.preventDefault();
    let { form } = this.props
    this.setSubmitLoad()
    form.validateFields(async (err: any, values: any) => {
      if (!err) {
        values.shop_header_image = this.shopImgRef.getImg()
        this.editShopInfo(values)
      }
    })
    return false;
  }
  private setShopInfo = async (data: any) => {
    let { identification: {
      company_name,
      identificate_agency,
      identificate_date,
      legal_person,
      licenses_date,
      licenses_number,
      licenses_scope,
      registered_address,
      registered_number
    }, shop_header_image, name} = data
    let identificateDate = identificate_date ? moment(identificate_date) : moment();
    let licensesDate = licenses_date ? moment(licenses_date) : moment()
    this.setState({
      data,
      loading: false,
      name,
      company_name,
      identificate_agency,
      identificate_date: identificateDate,
      legal_person,
      licenses_date: licensesDate,
      licenses_number,
      licenses_scope,
      registered_address,
      registered_number,
      shop_header_image
    })
  }
  private editShopInfo = async (values: any) => {
    // @ts-ignore
    let { _id } = this.props.match.params
    let { 
      company_name,
      identificate_agency,
      identificate_date,
      legal_person,
      licenses_date,
      licenses_number,
      licenses_scope,
      registered_address,
      registered_number,
      shop_header_image
    } = values
    try {
      let params = {
        _id,
        data: {
          identification: {
            company_name,
            identificate_agency,
            identificate_date: identificate_date.valueOf(),
            legal_person,
            licenses_date: licenses_date.valueOf(),
            licenses_number,
            licenses_scope,
            registered_address,
            registered_number
          },
          shop_header_image
        }
      }
      let { data } = await reqEditShopInfo(params)
      if (data.erron === 0){
        message.success('????????????')
        this.setState({
          type: 'look',
          submitLoad: false
        })
      }
    } catch (error) {}
      
  }
  private getShopInfo = async () => {
    try {
      this.setState({
        loading: true
      })
      // @ts-ignore
      let { _id } = this.props.match.params
      let { data } = await reqShopInfo({ _id })
      if (data.erron === 0) {
        this.setShopInfo(data.data)
        console.log(data.data)
      }
    } catch (error) {}
  }
  public componentDidMount() {
    this.getShopInfo()
  }
  render() {
    let { form: { getFieldDecorator }, mobile } = this.props
    let {
      type,
      loading,
      name,
      legal_person,
      licenses_number,
      licenses_scope,
      registered_address,
      registered_number,
      licenses_date,
      identificate_date,
      identificate_agency,
      company_name,
      shop_header_image,
      submitLoad,
      visible,
      currentImg,
    } = this.state
    // ??????Item?????????????????????
    const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 18 } }
    const tailFormItemLayout = { wrapperCol: mobile ? { span: 22 } : { span: 18, offset: 4 } }
    const CardExtra = (
      <Button onClick={() => {
        let type = this.state.type === 'look' ? 'edit' : 'look'
        this.setState({
          type
        })
      }} size="default" type="primary">
        ??????{type === 'edit' ? '??????' : '??????'}
      </Button>
    )

    return (
      <div className="add-edit-food">
        <Card extra={CardExtra} loading={loading} title={type === 'edit' ? '??????????????????' : '??????????????????'}>
          <Row>
            <Col span={mobile ? 24 : 18}>
              <Form onSubmit={this.handleSubmit} className="add-form">
                <Item className="form-itme" label="????????????" {...formItemLayout}>
                  {name}
                </Item>
                <Item className="form-itme" label="????????????" {...formItemLayout}>
                  <PictureWall
                    disabled={type === 'look' ? true : false}
                    imageName={shop_header_image}
                    onRef={(ref: any) => { this.shopImgRef = ref }}
                  ></PictureWall>
                  {
                    type === 'look'?
                    <Button onClick={() => {
                      this.setState({
                        visible: true,
                        currentImg: this.shopImgRef.getImg()
                      })
                    }} type="primary" size="small">??????</Button>
                    :<></>
                  }
                </Item>
                <Item className="form-itme" label='???????????????' {...formItemLayout}>
                  {
                    getFieldDecorator('company_name', {
                      initialValue: company_name
                    })(
                      <Input disabled={type === 'look' ? true : false} />
                    )
                  }
                </Item>
                <Item className="form-itme" label='???????????????' {...formItemLayout}>
                  {
                    getFieldDecorator('legal_person', {
                      initialValue: legal_person
                    })(
                      <Input disabled={type === 'look' ? true : false} />
                    )
                  }
                </Item>
                <Item className="form-itme" label='?????????????????????' {...formItemLayout}>
                  {
                    getFieldDecorator('licenses_number', {
                      initialValue: licenses_number
                    })(
                      <Input disabled={type === 'look' ? true : false} />
                    )
                  }
                </Item>
                <Item className="form-itme" label='??????????????????' {...formItemLayout}>
                  {
                    getFieldDecorator('licenses_scope', {
                      initialValue: licenses_scope
                    })(
                      <Input disabled={type === 'look' ? true : false} />
                    )
                  }
                </Item>
                <Item className="form-itme" label='????????????' {...formItemLayout}>
                  {
                    getFieldDecorator('registered_address', {
                      initialValue: registered_address
                    })(
                      <Input disabled={type === 'look' ? true : false} />
                    )
                  }
                </Item>
                <Item className="form-itme" label='????????????' {...formItemLayout}>
                  {
                    getFieldDecorator('registered_number', {
                      initialValue: registered_number
                    })(
                      <InputNumber min={0} disabled={type === 'look' ? true : false} />
                    )
                  }
                </Item>
                <Item className="form-itme" label='?????????????????????' {...formItemLayout}>
                  {
                    getFieldDecorator('licenses_date', {
                      initialValue: licenses_date
                    })(
                      <DatePicker disabled={type === 'look' ? true : false} />
                    )
                  }
                </Item>
                <Item className="form-itme" label='??????????????????' {...formItemLayout}>
                  {
                    getFieldDecorator('identificate_date', {
                      initialValue: identificate_date
                    })(
                      <DatePicker disabled={type === 'look' ? true : false} />
                    )
                  }
                </Item>
                <Item className="form-itme" label='????????????' {...formItemLayout}>
                  {
                    getFieldDecorator('identificate_agency', {
                      initialValue: identificate_agency
                    })(
                      <Input min={0} disabled={type === 'look' ? true : false} />
                    )
                  }
                </Item>
                <Item className="form-itme" {...tailFormItemLayout}>
                  {
                    type === 'look' ?
                      <></>
                      :
                      <Button style={{ marginRight: 10 }} disabled={submitLoad} type="primary" htmlType="submit">
                        ??????
                      </Button>
                  }
                  <Button style={{ marginRight: 10 }} type="default" onClick={() => {
                    this.props.history.push('/shoplist')
                  }}>
                    ??????
                  </Button>
                </Item>
              </Form>
            </Col>
          </Row>
        </Card>
        <Modal
          width={400}
          title="????????????"
          visible={visible}
          footer={false}
          onCancel={() => {
            this.setState({
              visible: false
            })
          }}
        >
          <img width="100%" src={IMAGE_URL + currentImg} alt="" />
        </Modal>
        <div style={{ height: 20 }}></div>
      </div>
    );
  }
}

// ?????????
const breadcrumb: IBreadcrumb[] = [
  {
    key: 0,
    link: false,
    text: '??????',
    path: '/home'
  },
  {
    key: 1,
    link: false,
    text: '????????????',
    path: ''
  },
  {
    key: 2,
    link: true,
    text: '????????????',
    path: '/shoplist'
  },
  {
    key: 3,
    link: false,
    text: '????????????',
    path: ''
  },
]

export default connect(({ global }: any) => ({
  mobile: global.mobile,
}))(BaseComponent(Form.create<IProps>()(ShopInfo), breadcrumb))
