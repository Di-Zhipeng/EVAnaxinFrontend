import React from 'react';
import '../node_modules/antd/dist/antd.css';
import { Typography, Layout, Button, Form, Input, Checkbox, Radio, Icon, message, Modal, BackTop } from 'antd';
import background from "./background2.jpg";
const apiBaseUrl = ''
const { Header, Footer, Sider, Content } = Layout;
const FormItem = Form.Item;
const { confirm } = Modal;
const { Title } = Typography;
class SheetStatus {
  constructor() {
    this.available = true;
  }
  available: boolean;
}

class SheetData {
  constructor() {
    this.adjustment = false;
    this.time1 = this.time2 = this.time3 = this.time4 = this.time5 = this.time6 = this.time7 = [0]
    this.name = this.id = this.major = this.email = this.phone = this.firstReason = this.secondReason = this.question1 = this.question2 = '';
    this.firstWish = this.secondWish = this.sex = this.grade = -1;
  }
  name: string;
  id: string;
  sex: number;
  grade: number;
  major: string;
  email: string;
  phone: string;
  firstWish: number;
  secondWish: number;
  adjustment: boolean;
  firstReason: string;
  secondReason: string;
  question1: string;
  question2: string;
  time1: number[];
  time2: number[];
  time3: number[];
  time4: number[];
  time5: number[];
  time6: number[];
  time7: number[];

}

class SheetDto {
  constructor(sheet: SheetData) {
    this.name = sheet.name;
    this.id = sheet.id;
    this.sex = sheet.sex;
    this.grade = sheet.grade;
    this.major = sheet.major;
    this.email = sheet.email;
    this.phone = sheet.phone;
    this.firstWish = sheet.firstWish;
    this.secondWish = sheet.secondWish;
    this.adjustment = sheet.adjustment;
    this.firstReason = sheet.firstReason;
    this.secondReason = sheet.secondReason;
    this.question1 = sheet.question1;
    this.question2 = sheet.question2;
    for (let i in sheet.time1)
      this.time1 += 1 << (sheet.time1[i] - 1);
    for (let i in sheet.time2)
      this.time2 += 1 << (sheet.time2[i] - 1);
    for (let i in sheet.time3)
      this.time3 += 1 << (sheet.time3[i] - 1);
    for (let i in sheet.time4)
      this.time4 += 1 << (sheet.time4[i] - 1);
    for (let i in sheet.time5)
      this.time5 += 1 << (sheet.time5[i] - 1);
    for (let i in sheet.time6)
      this.time6 += 1 << (sheet.time6[i] - 1);
    for (let i in sheet.time7)
      this.time7 += 1 << (sheet.time7[i] - 1);
  }
  name: string = '';
  id: string = '';
  sex: number = -1;
  grade: number = -1;
  major: string = '';
  email: string = '';
  phone: string = '';
  firstWish: number = -1;
  secondWish: number = -1;
  adjustment: boolean = false;
  firstReason: string = '';
  secondReason: string = '';
  question1: string = '';
  question2: string = '';
  time1: number = 0;
  time2: number = 0;
  time3: number = 0;
  time4: number = 0;
  time5: number = 0;
  time6: number = 0;
  time7: number = 0;
}

let a: SheetData = {
  name: '',
  id: '',
  sex: -1,
  grade: -1,
  major: '',
  email: '',
  phone: '',
  firstWish: -1,
  secondWish: -1,
  adjustment: false,
  firstReason: '',
  secondReason: '',
  question1: '',
  question2: '',
  time1: [0],
  time2: [0],
  time3: [0],
  time4: [0],
  time5: [0],
  time6: [0],
  time7: [0]
};
let b: SheetStatus = {
  available: true
};

class SheetState {
  constructor() {
    this.status = b;
    this.data = a;
  }
  status: SheetStatus;
  data: SheetData;
}

interface FormProps {
  form: any;
}

class SignUpForm extends React.Component<FormProps, any> {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  };

  loadLocalStorage = () => {
    const values = JSON.parse(localStorage.getItem('formCache') || '{}');
    this.props.form.setFieldsValue(values);
  }
  saveLocalStorage = () => {
    const values = this.props.form.getFieldsValue();
    localStorage.setItem('formCache', JSON.stringify(values));
  }
  componentDidMount() {
    this.loadLocalStorage();
  }
  handleSubmit = (e: any) => {
    e.preventDefault();
    this.saveLocalStorage();

    const formProps = this.props.form;

    confirm({
      title: '提交报名表',
      content: String.raw`
        您填写的表格已经保存在浏览器中，以后可以修改后覆盖提交。
        点击 OK 进行提交。
        `,
      onOk() {
        return new Promise((resolve, reject) => {
          formProps.validateFieldsAndScroll((err: any, values: SheetData) => {
            if (!err) {
              let dto = new SheetDto(values);
              fetch('https://joinus-backend.zjueva.net/api/submit', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(dto)
              }).then(async (res: any) => {
                if (res.ok) {
                  let body = await res.json();
                  if (body.success === 1) {
                    message.success('提交成功！后续的面试时间会以短信形式通知，期待你的加入！');
                  }
                  else {
                    message.error('提交失败，可能为网络原因。');
                  }
                }
                else {
                  message.error('提交失败，可能为网络原因。')
                }
                resolve(42);
              }).catch(err => {
                message.error('提交失败，可能为网络原因。');
                reject('network or fetch error!');
              });
            } else {
              message.error('填写不正确，请按照提示修改');
              reject('validation error!');
            }
          })
        }).catch((err: any) => console.log(err));
      },
      onCancel() { }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };




    const timeOptions1 = [
      { label: '9月24日18:30-19:00', value: 1 },
      { label: '9月24日19:10-19:40', value: 2 },
      { label: '9月24日19:50-20:20', value: 3 },
      { label: '9月24日20:30-21:00', value: 4 },
      { label: '9月24日21:10-21:40', value: 5 },
    ]
    const timeOptions2 = [
      { label: '9月25日18:30-19:00', value: 1 },
      { label: '9月25日19:10-19:40', value: 2 },
      { label: '9月25日19:50-20:20', value: 3 },
      { label: '9月25日20:30-21:00', value: 4 },
      { label: '9月25日21:10-21:40', value: 5 },
    ]
    const timeOptions3 = [
      { label: '9月26日18:30-19:00', value: 1 },
      { label: '9月26日19:10-19:40', value: 2 },
      { label: '9月26日19:50-20:20', value: 3 },
      { label: '9月26日20:30-21:00', value: 4 },
      { label: '9月26日21:10-21:40', value: 5 },
    ]
    const timeOptions4 = [
      { label: '9月27日18:30-19:00', value: 1 },
      { label: '9月27日19:10-19:40', value: 2 },
      { label: '9月27日19:50-20:20', value: 3 },
      { label: '9月27日20:30-21:00', value: 4 },
      { label: '9月27日21:10-21:40', value: 5 },
    ]
    const timeOptions5 = [
      { label: '9月28日18:30-19:00', value: 1 },
      { label: '9月28日19:10-19:40', value: 2 },
      { label: '9月28日19:50-20:20', value: 3 },
      { label: '9月28日20:30-21:00', value: 4 },
      { label: '9月28日21:10-21:40', value: 5 },
    ]
    const timeOptions6 = [
      { label: '9月29日18:30-19:00', value: 1 },
      { label: '9月29日19:10-19:40', value: 2 },
      { label: '9月29日19:50-20:20', value: 3 },
      { label: '9月29日20:30-21:00', value: 4 },
      { label: '9月29日21:10-21:40', value: 5 },
    ]
    const timeOptions7 = [
      { label: '9月30日18:30-19:00', value: 1 },
      { label: '9月30日19:10-19:40', value: 2 },
      { label: '9月30日19:50-20:20', value: 3 },
      { label: '9月30日20:30-21:00', value: 4 },
      { label: '9月30日21:10-21:40', value: 5 },
    ]




    return (

      <Layout style={{
        backgroundImage: `url(${background})`
      }}>
        <Content style={{
          opacity: 0.8
        }}>
          <div style={{ background: '#fff', paddingTop: 48,paddingLeft:24,paddingRight:24, marginTop: 24, marginLeft: 24, marginRight: 24 }}>
            <Title level={2} style={{
              textAlign: 'center'
            }} >
              浙江大学学生E志者协会2019年秋季纳新报名表</Title>
            <p><br /></p>
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <Form.Item
                label="姓名">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请在此处填入你的姓名' }],
                })(<Input />)}
              </Form.Item>

              <Form.Item label="学号" >
                {getFieldDecorator('id', {
                  rules: [
                    {
                      required: true,
                      message: '请在此处填入你的学号',
                    },
                    { pattern: /^[0-9]+$/, message: "混进去了数字以外的东西呀" }

                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="性别">
                {
                  getFieldDecorator('sex', {
                    rules: [
                      {
                        required: true,
                        message: '请选择你的性别'
                      }
                    ]
                  }
                  )
                    (
                      <Radio.Group>
                        <Radio.Button value={0} ><div><Icon type="man" />男</div></Radio.Button>
                        <Radio.Button value={1} ><div><Icon type="woman" />女</div></Radio.Button>
                      </Radio.Group>
                    )
                }
              </Form.Item>
              <Form.Item label="年级">
                {
                  getFieldDecorator('grade', {
                    rules: [
                      {
                        required: true,
                        message: '请选择你的年级'

                      }
                    ]
                  }
                  )
                    (
                      <Radio.Group >
                        <Radio.Button value={1}>大一</Radio.Button>
                        <Radio.Button value={2}>大二</Radio.Button>
                        <Radio.Button value={3}>大三</Radio.Button>
                        <Radio.Button value={4}>大四</Radio.Button>
                      </Radio.Group>
                    )
                }
              </Form.Item>
              <Form.Item label="专业/大类">
                {
                  getFieldDecorator('major', {
                    rules: [
                      {
                        required: true,
                        message: '请在这里填入你的专业'

                      }
                    ]
                  }
                  )(
                    <Input placeholder="例如：工科试验班(电气)" />
                  )
                }
              </Form.Item>
              <Form.Item label="E-mail">
                {getFieldDecorator('email', {
                  rules: [
                    {
                      required: true,
                      message: '请在此处填入你的E-mail'
                    }, { type: 'email', message: "邮箱格式不正确" }
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="联系电话">
                {getFieldDecorator('phone', {
                  rules: [
                    {
                      required: true,
                      message: '请在此处填入你的电话号码',
                    },
                    { pattern: /^[0-9]+$/, message: "混进去了数字以外的东西呀" }
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="第一志愿（两个志愿请不要选择同一部门）">
                {getFieldDecorator('firstWish', {
                  rules: [
                    {
                      required: true,
                      message: '请选择你的第一志愿',
                    },
                  ],
                })(
                  <Radio.Group buttonStyle="solid">
                    <Radio.Button value={1}>电器部</Radio.Button>
                    <Radio.Button value={2}>电脑部</Radio.Button>
                    <Radio.Button value={3}>文宣部</Radio.Button>
                    <Radio.Button value={4}>人资部</Radio.Button>
                    <Radio.Button value={5}>财外部</Radio.Button>
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item label="第二志愿（两个志愿请不要均在技术部（即电器、电脑部）中选择）">
                {getFieldDecorator('secondWish', {
                  rules: [
                    {
                      required: true,
                      message: '请选择你的第二志愿',
                    },
                  ],
                })(
                  <Radio.Group buttonStyle="solid">
                    <Radio.Button value={1}>电器部</Radio.Button>
                    <Radio.Button value={2}>电脑部</Radio.Button>
                    <Radio.Button value={3}>文宣部</Radio.Button>
                    <Radio.Button value={4}>人资部</Radio.Button>
                    <Radio.Button value={5}>财外部</Radio.Button>
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item label="是否服从调剂">
                {
                  getFieldDecorator('adjustment', {
                    rules: [
                      {
                        required: true,
                        message: '请选择是否服从调剂'
                      }
                    ]
                  }
                  )(
                    <Radio.Group >
                      <Radio value={true}>是</Radio>
                      <Radio value={false}>否</Radio>
                    </Radio.Group>
                  )
                }
              </Form.Item>
              <Form.Item label="简述你选择第一志愿的原因">
                {
                  getFieldDecorator('firstReason', {
                    rules: [
                      {
                        required: true,
                        message: '请填入你选择志愿的原因'
                      }
                    ]
                  }
                  )(
                    <Input.TextArea rows={4} />
                  )
                }
              </Form.Item>
              <Form.Item label="简述你选择第二志愿的原因">
                {
                  getFieldDecorator('secondReason', {
                    rules: [
                      {
                        required: true,
                        message: '请填入你选择志愿的原因'
                      }
                    ]
                  }
                  )
                    (
                      <Input.TextArea rows={4} />
                    )
                }
              </Form.Item>
              <Form.Item label="个人简介（包括编程经验、竞赛获奖、特长、兴趣、社团经历、爱好、性格等方面）">
                {
                  getFieldDecorator('question1', {
                    rules: [
                      {
                        required: true,
                        message: '请简单介绍一下你自己'
                      }
                    ]
                  }
                  )
                    (
                      <Input.TextArea rows={4} />
                    )
                }
              </Form.Item>
              <Form.Item label="你希望未来能在E志者协会得到什么？又能为E志付出什么？">
                {
                  getFieldDecorator('question2', {
                    rules: [
                      {
                        required: true,
                        message: '请填入问题的回答'
                      }
                    ]
                  }
                  )
                    (
                      <Input.TextArea rows={4} />
                    )
                }
              </Form.Item>
              {/* <Form.Item label='选择你希望的面试时间吧（尽量多选）9月24日'>
                {
                  getFieldDecorator('time1', {
                    rules: [
                      {
                        required: false,
                        message: '请选择你希望的面试时间'
                      }
                    ]
                  }
                  )(

                    <Checkbox.Group options={timeOptions1} />

                  )
                }
              </Form.Item>
              <Form.Item label='9月25日'>
                {
                  getFieldDecorator('time2', {
                    rules: [
                      {
                        required: false,
                        message: '请选择你希望的面试时间'
                      }
                    ]
                  }
                  )(

                    <Checkbox.Group options={timeOptions2} />

                  )
                }
              </Form.Item>
              <Form.Item label='9月26日'>
                {
                  getFieldDecorator('time3', {
                    rules: [
                      {
                        required: false,
                        message: '请选择你希望的面试时间'
                      }
                    ]
                  }
                  )(

                    <Checkbox.Group options={timeOptions3} />

                  )
                }
              </Form.Item>
              <Form.Item label='9月27日'>
                {
                  getFieldDecorator('time4', {
                    rules: [
                      {
                        required: false,
                        message: '请选择你希望的面试时间'
                      }
                    ]
                  }
                  )(

                    <Checkbox.Group options={timeOptions4} />

                  )
                }
              </Form.Item>
              <Form.Item label='9月28日'>
                {
                  getFieldDecorator('time5', {
                    rules: [
                      {
                        required: false,
                        message: '请选择你希望的面试时间'
                      }
                    ]
                  }
                  )(

                    <Checkbox.Group options={timeOptions5} />

                  )
                }
              </Form.Item>
              <Form.Item label='9月29日'>
                {
                  getFieldDecorator('time6', {
                    rules: [
                      {
                        required: false,
                        message: '请选择你希望的面试时间'
                      }
                    ]
                  }
                  )(

                    <Checkbox.Group options={timeOptions6} />

                  )
                }
              </Form.Item>
              <Form.Item label='9月30日'>
                {
                  getFieldDecorator('time7', {
                    rules: [
                      {
                        required: false,
                        message: '请选择你希望的面试时间'
                      }
                    ]
                  }
                  )(

                    <Checkbox.Group options={timeOptions7} />

                  )
                }
              </Form.Item> */}
              <Form.Item {...tailFormItemLayout}>
                <Button icon="copy" style={{ textAlign: 'center' }} type="primary" htmlType="submit">提交</Button>
                <Button icon="save" style={{ margin: "20px", textAlign: 'center' }} onClick={() => { this.saveLocalStorage(); message.success('草稿已保存') }}>保存草稿</Button>
              </Form.Item>
            </Form></div>


          <p style={{
            textAlign: 'center',
          }}>
            浙江大学学生E志者协会©2019 Created by EVATech
          </p>
        </Content>
      </Layout>





    );
  }
}

class Sheet extends React.Component<any, SheetState> {


  render() {
    const WrappedForm = Form.create({})(SignUpForm);
    return (
      <div style={{ minHeight: "300px", alignContent: "center" }} className="form-panel">

        <WrappedForm />
        <BackTop visibilityHeight={200} />
      </div>
    );
  }
}
export default Sheet;
