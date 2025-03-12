/* eslint-disable react/button-has-type */
import { HomeOutlined, LoadingOutlined, LoginOutlined, LogoutOutlined, ProfileOutlined } from '@ant-design/icons';
import { limitText, removeUndefinedFromArray } from '@netsu/js-utils';
import { Avatar, Dropdown, Layout, Menu } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { MenuItemType } from 'antd/es/menu/interface';
import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import UserProfileModel from '/imports/api/userProfile/models';
import { AvailableCollectionNames, MethodUtilMethodsFindCollectionModel } from '/imports/api/utils/models';
import { ComponentProps } from '/imports/types/interfaces';
import { SITE_NAME } from '/imports/utils/constants';
import { protectedRoutes, publicRoutes } from '/imports/utils/constants/routes';
import { errorResponse } from '/imports/utils/errors';

interface MiniRouteRenderUserProfileModel extends Pick<UserProfileModel, '_id' | 'username'> {}

const miniRouteRenderUserProfileFields = {
    _id: 1,
    username: 1,
};

interface RouteRendererProps extends ComponentProps {
    userId?: string;
}

interface RouteRenderMenuItem extends MenuItemType {
    label: string | React.JSX.Element;
}

const RouteRenderer: React.FC<RouteRendererProps> = ({ children, userId }) => {
    const [location, navigate] = useLocation();
    const [loading, setLoading] = useState(!!userId);
    const [userProfile, setUserProfile] = useState<MiniRouteRenderUserProfileModel | undefined>();

    const fetchUserProfile = async () => {
        if (!userId) return;

        try {
            const findData: MethodUtilMethodsFindCollectionModel = {
                collection: AvailableCollectionNames.USER_PROFILE,
                selector: {
                    userId,
                },
                options: {
                    fields: miniRouteRenderUserProfileFields,
                },
                onlyOne: true,
            };

            const res: MiniRouteRenderUserProfileModel | undefined = await Meteor.callAsync(
                'utilMethods.findCollection',
                findData,
            );

            setUserProfile(res);

            return res;
        } catch (error) {
            errorResponse(error as Meteor.Error, 'Could not get users');
        }

        return undefined;
    };

    const fetchData = async (silent = false) => {
        setLoading(!silent);

        if (userId) await fetchUserProfile();

        setLoading(false);
    };

    useEffect(() => {
        if (userId) {
            fetchData();
        } else {
            setUserProfile(undefined);
        }
    }, [userId]);

    if (loading) return <LoadingOutlined />;

    const items: (RouteRenderMenuItem | undefined)[] = [
        {
            key: 'home',
            icon: <HomeOutlined />,
            label: 'Home',
            onClick: () => navigate(publicRoutes.home.path),
        },
    ];

    if (userId && userProfile) {
        items.push({
            key: 'login',
            style: { marginLeft: 'auto' },
            label: (
                <Dropdown
                    menu={{
                        items: [
                            {
                                label: 'Your Profile',
                                key: 'your-profile',
                                icon: <ProfileOutlined />,
                                onClick: () =>
                                    navigate(
                                        protectedRoutes.userProfile.path.replace(':username', userProfile.username),
                                    ),
                            },
                            {
                                label: 'Logout',
                                key: 'logout',
                                icon: <LogoutOutlined />,
                                onClick: () => Meteor.logout(),
                            },
                        ],
                    }}
                    trigger={['click']}
                >
                    <Avatar style={{ backgroundColor: '#ff98ad', verticalAlign: 'middle' }} size="large" gap={4}>
                        {limitText(userProfile.username, 7)}
                    </Avatar>
                </Dropdown>
            ),
        });
    } else {
        items.push({
            key: 'login',
            icon: <LoginOutlined />,
            label: 'Login',
            onClick: () => navigate(publicRoutes.login.path),
            style: { marginLeft: 'auto' },
        });
    }

    return (
        <Layout style={{ height: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div className="demo-logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['home']}
                    items={removeUndefinedFromArray(items)}
                    style={{ flex: 1, minWidth: 0 }}
                />
            </Header>

            <Content style={{ padding: '1rem 4rem' }}>{children}</Content>

            <Footer style={{ textAlign: 'center' }}>
                {SITE_NAME} © {new Date().getFullYear()}
            </Footer>
        </Layout>
    );
};

export default RouteRenderer;
