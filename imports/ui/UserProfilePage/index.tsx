import { LoadingOutlined } from '@ant-design/icons';
import { Space, Typography } from 'antd';
import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { AppUserIdModel } from '../App';
import NotFoundPage from '../NotFoundPage';
import UserProfileModel from '/imports/api/userProfile/models';
import { AvailableCollectionNames, MethodUtilMethodsFindCollectionModel } from '/imports/api/utils/models';
import { errorResponse } from '/imports/utils/errors';

interface MiniUserProfilePageUserProfileModel extends Pick<UserProfileModel, '_id' | 'username'> {}

const miniUserProfilePageUserProfileFields = {
    _id: 1,
    username: 1,
};

interface UserProfilePageProps {
    userId?: AppUserIdModel;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ userId }) => {
    const { username } = useParams();

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<MiniUserProfilePageUserProfileModel | undefined>();

    const fetchUserProfile = async () => {
        if (!username) return;

        try {
            const findData: MethodUtilMethodsFindCollectionModel = {
                collection: AvailableCollectionNames.USER_PROFILE,
                selector: {
                    username,
                },
                options: {
                    fields: miniUserProfilePageUserProfileFields,
                },
                onlyOne: true,
            };

            const res: MiniUserProfilePageUserProfileModel | undefined = await Meteor.callAsync(
                'utilMethods.findCollection',
                findData,
            );

            setUser(res);

            return res;
        } catch (error) {
            errorResponse(error as Meteor.Error, 'Could not get users');
        }

        return undefined;
    };

    const fetchData = async (silent?: boolean) => {
        setLoading(!silent);

        await fetchUserProfile();

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <LoadingOutlined />;
    if (!user) return <NotFoundPage message={`User ${username} was not found`} />;

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Typography.Title level={2}>{user.username}</Typography.Title>
        </Space>
    );
};

export default UserProfilePage;
