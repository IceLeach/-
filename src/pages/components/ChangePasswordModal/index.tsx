import { UpdatePassword } from '@/services/api';
import { Button, Form, Input, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = (props) => {
  const { visible, onClose } = props;
  const [form] = Form.useForm();
  const [currentUser, setCurrentUser] = useState<any>({});

  useEffect(() => {
    if (visible) {
      const cookies = document.cookie;
      const cookieList: { [key: string]: string } = {};
      cookies
        .trim()
        .split(';')
        .forEach((item) => {
          const itemArray = item.split('=');
          cookieList[itemArray[0].trim()] = itemArray[1];
        });
      // console.log('userName', userName, document.cookie, cookieList)
      setCurrentUser(cookieList);
    }
  }, [visible]);

  const onFinish = (value: any) => {
    // console.log('finish', value);
    UpdatePassword({
      userId: currentUser.userId ? parseInt(currentUser.userId) : undefined,
      oldPassword: value.oldPassword,
      newPassword: value.newPassword,
    }).then((res) => {
      // console.log('update', res)
      if (res.code === 0) {
        message.success('修改成功');
        onClose();
      } else {
        message.error(res.msg);
      }
    });
  };

  return (
    <Modal
      title="修改密码"
      visible={visible}
      centered
      onCancel={onClose}
      afterClose={() => {
        form.resetFields();
      }}
      width={400}
      footer={
        <Button onClick={() => form.submit()} type="primary">
          保存
        </Button>
      }
    >
      <Form form={form} onFinish={onFinish} autoComplete="off">
        <Form.Item label="用户名">{currentUser.userName}</Form.Item>
        <Form.Item hidden>
          <Input.Password style={{ display: 'none' }} />
        </Form.Item>
        <Form.Item
          name="oldPassword"
          label="原密码"
          getValueFromEvent={(event) => {
            const newString = event.target.value.replace(
              /[\u4E00-\u9FA5]/g,
              '',
            );
            return newString.replace(/\s/g, '');
          }}
          rules={[{ required: true, message: '原密码不能为空' }]}
        >
          <Input.Password placeholder="请输入" autoComplete="off" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="新密码"
          rules={[{ required: true, message: '新密码不能为空' }]}
        >
          <Input.Password placeholder="请输入" autoComplete="off" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
