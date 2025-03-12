/* eslint-disable react/button-has-type */
import { AreaChartOutlined, HomeOutlined, LoginOutlined, LogoutOutlined, ProfileOutlined } from '@ant-design/icons';
import { limitText, removeUndefinedFromArray } from '@netsu/js-utils';
import { Avatar, Dropdown, Layout, Menu } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { MenuItemType } from 'antd/es/menu/interface';
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useLocation } from 'wouter';
import { BasicSiteProps } from '../../App';
import { AvailableUserRoles } from '/imports/api/roles/models';
import { SITE_NAME } from '/imports/utils/constants';
import { adminRoutes, publicRoutes } from '/imports/utils/constants/routes';

interface RouteRendererProps extends BasicSiteProps {}

interface RouteRenderMenuItem extends MenuItemType {
    label: string | React.JSX.Element;
}

const RouteRenderer: React.FC<RouteRendererProps> = ({ children, userId, userProfile, userRoles }) => {
    const [location, navigate] = useLocation();

    const items: (RouteRenderMenuItem | undefined)[] = [
        {
            key: 'home',
            icon: <HomeOutlined />,
            label: 'Home',
            onClick: () => navigate(publicRoutes.home.path),
        },
    ];

    if (userRoles?.includes(AvailableUserRoles.ADMIN)) {
        items.push({
            key: 'logs',
            icon: <AreaChartOutlined />,
            label: 'Logs',
            onClick: () => navigate(adminRoutes.logs.path),
        });
    }

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
                                    navigate(publicRoutes.userProfile.path.replace(':username', userProfile.username)),
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
