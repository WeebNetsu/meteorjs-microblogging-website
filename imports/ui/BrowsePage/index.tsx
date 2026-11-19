import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import { BasicSiteProps } from '../App';
import CreatePost from '../components/CreatePost';
import PostCard from './components/PostCard';
import PostModel, { AvailablePostMethods, ResultGetPostsLatestModel } from '/imports/api/post/models';
import UserProfileModel from '/imports/api/userProfile/models';
import { errorResponse } from '/imports/utils/errors';

export interface MiniBrowsePagePostModel extends Pick<PostModel, '_id' | 'createdAt' | 'text' | 'userId'> {}

export interface MiniBrowsePageUserProfileModel
    extends Pick<UserProfileModel, '_id' | 'username' | 'userId' | 'photo'> {}

interface BrowsePageProps extends BasicSiteProps {}

/**
 * This is the general way all fetch data's are defined
 */
export type FetchDataType = (silent?: boolean) => Promise<void>;

const BrowsePage: React.FC<BrowsePageProps> = ({ userId, userRoles }) => {
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<MiniBrowsePagePostModel[]>([]);
    /**
     * Note user profiles are filtered based on posts
     */
    const [userProfiles, setUserProfiles] = useState<MiniBrowsePageUserProfileModel[]>([]);

    const fetchPosts = async () => {
        try {
            const res: ResultGetPostsLatestModel = await Meteor.callAsync(
                AvailablePostMethods.GET_LATEST_WITH_USER_PROFILES,
            );

            setPosts(res.posts);
            setUserProfiles(res.users);
        } catch (error) {
            errorResponse(error as Meteor.Error, 'Could not get posts');
        }
    };

    const fetchData = async (silent?: boolean) => {
        setLoading(!silent);

        await fetchPosts();

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <LoadingOutlined />;

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            {showCreatePost ? (
                <CreatePost fetchParentData={fetchData} show={showCreatePost} setShow={setShowCreatePost} />
            ) : (
                <Button onClick={() => setShowCreatePost(true)} disabled={!userId}>
                    <PlusOutlined /> New Post {!userId && '(Log In To Post)'}
                </Button>
            )}

            {posts.map((post) => {
                const postUser = userProfiles.find((up) => up.userId === post.userId);

                // if we don't know the post user, don't show the post
                if (!postUser) return null;

                return (
                    <PostCard
                        fetchParentData={fetchData}
                        userRoles={userRoles}
                        key={post._id}
                        post={post}
                        postUser={postUser}
                        userId={userId}
                    />
                );
            })}
        </Space>
    );
};

export default BrowsePage;
