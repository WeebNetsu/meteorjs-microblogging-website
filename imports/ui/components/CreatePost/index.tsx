import { CloseOutlined } from '@ant-design/icons';
import { Button, Flex, Input, Space } from 'antd';
import React from 'react';

interface CreatePostProps {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreatePost: React.FC<CreatePostProps> = ({ show, setShow }) => {
    if (!show) return <></>;

    return (
        <Flex style={{ width: '100%' }} gap={'large'}>
            <Input.TextArea />

            <Space direction="vertical" style={{ alignItems: 'center' }}>
                <Button>Post</Button>
                <Button type="text" onClick={() => setShow(false)}>
                    <CloseOutlined />
                </Button>
            </Space>
        </Flex>
    );
};

export default CreatePost;
