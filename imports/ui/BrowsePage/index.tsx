import { PlusOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import React, { useState } from 'react';
import CreatePost from '../components/CreatePost';

const BrowsePage: React.FC = () => {
    const [showCreatePost, setShowCreatePost] = useState(false);

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            {showCreatePost ? (
                <CreatePost show={showCreatePost} setShow={setShowCreatePost} />
            ) : (
                <Button onClick={() => setShowCreatePost(true)}>
                    <PlusOutlined /> New Post
                </Button>
            )}
        </Space>
    );
};

export default BrowsePage;
