import { DeleteOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons';
import { formatToHumanDate } from '@netsu/js-utils';
import { Avatar, Button, Card, Space, Typography } from 'antd';
import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useMemo } from 'react';
import { useLocation } from 'wouter';
import { MiniBrowsePagePostModel, MiniBrowsePageUserProfileModel } from '../..';
import PostModel from '/imports/api/post/models';
import {
    MethodPublishPostLikeTotalLikesModel,
    MethodPublishPostLikeUserLikedModel,
    MethodSetPostLikeLikeOrUnlikeModel,
} from '/imports/api/postLike/models';
import PostLikeCollection from '/imports/api/postLike/postLike';
import { AppUserIdModel } from '/imports/ui/App';
import { publicRoutes } from '/imports/utils/constants/routes';
import { errorResponse } from '/imports/utils/errors';

interface PostCardProps {
    post: MiniBrowsePagePostModel;
    userId?: AppUserIdModel;
    postUser: MiniBrowsePageUserProfileModel;
}

const PostCard: React.FC<PostCardProps> = ({ post, userId, postUser }) => {
    const [location, navigate] = useLocation();

    const loadingLikes = useTracker(() => {
        // Note that this subscription will get cleaned up
        // when your component is unmounted or deps change.
        const totalLikeData: MethodPublishPostLikeTotalLikesModel = {
            postId: post._id,
        };
        const loadingTotalLikes = Meteor.subscribe('publish.postLike.totalLikes', totalLikeData);

        let loadingUserLike: Meteor.SubscriptionHandle | undefined;
        if (userId) {
            const userLikeData: MethodPublishPostLikeUserLikedModel = {
                postId: post._id,
                userId,
            };
            loadingUserLike = Meteor.subscribe('publish.postLike.userLiked', userLikeData);
        }

        return !(loadingUserLike?.ready() ?? true) || !loadingTotalLikes.ready();
    }, [post._id]);
    const postLikes: number | undefined = useTracker(() => {
        const res = PostLikeCollection.find({ postId: post._id }).count();
        return res;
    }, [post._id]);
    const userLike: Partial<PostModel> | undefined = useTracker(
        () => PostLikeCollection.find({ postId: post._id, userId }).count(),
        [post._id, userId],
    );

    const handleLikeOrUnlikePost = useMemo(
        () =>
            _.debounce(async () => {
                try {
                    const data: MethodSetPostLikeLikeOrUnlikeModel = {
                        postId: post._id,
                    };

                    await Meteor.callAsync('set.postLike.likeOrUnlike', data);
                } catch (error) {
                    errorResponse(error as Meteor.Error, 'Could not like or unlike post');
                }
            }, 1000),
        [],
    );

    const postActions = [
        <Button type="text" onClick={handleLikeOrUnlikePost}>
            {loadingLikes ? (
                <HeartOutlined />
            ) : (
                <>
                    {postLikes ?? ''} {userLike ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
                </>
            )}
        </Button>,
    ];

    if (postUser.userId === userId) {
        postActions.push(<DeleteOutlined />);
    }

    return (
        <Card key={post._id} actions={postActions} style={{ minWidth: 300 }}>
            <Card.Meta
                avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />}
                description={
                    <Space direction="vertical">
                        <Typography>{post.text}</Typography>
                        <Typography>
                            {formatToHumanDate(post.createdAt)} By{' '}
                            <Button
                                type="link"
                                onClick={() =>
                                    navigate(publicRoutes.userProfile.path.replace(':username', postUser.username))
                                }
                            >
                                {postUser.username}
                            </Button>
                        </Typography>
                    </Space>
                }
            />
        </Card>
    );
};

export default PostCard;
