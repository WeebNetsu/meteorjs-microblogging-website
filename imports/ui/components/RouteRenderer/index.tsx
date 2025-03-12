/* eslint-disable react/button-has-type */
import { HomeOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import { removeUndefinedFromArray } from '@netsu/js-utils';
import { Layout, Menu } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { MenuItemType } from 'antd/es/menu/interface';
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useLocation } from 'wouter';
import { ComponentProps } from '/imports/types/interfaces';
import { SITE_NAME } from '/imports/utils/constants';
import { publicRoutes } from '/imports/utils/constants/routes';

interface RouteRendererProps extends ComponentProps {
    loggedIn?: boolean;
}

interface RouteRenderMenuItem extends MenuItemType {
    label: string | React.JSX.Element;
}

const RouteRenderer: React.FC<RouteRendererProps> = ({ children, loggedIn }) => {
    const [location, navigate] = useLocation();
    // const {
    //     token: { colorBgContainer, borderRadiusLG },
    // } = theme.useToken();

    // add your navigation UI
    // return (
    // 	<>
    // 		<button onClick={() => navigate(protectedRoutes.home.path)}>Home</button>
    // 		{/* <button onClick={() => navigate(protectedRoutes.admin.path)}>Admin</button> */}

    // 		{/* render route data */}
    // 		{children}
    // 	</>
    // );

    const items: (RouteRenderMenuItem | undefined)[] = [
        {
            key: 'home',
            icon: <HomeOutlined />,
            label: 'Home',
            onClick: () => navigate(publicRoutes.home.path),
        },
    ];

    if (loggedIn) {
        items.push({
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            onClick: () => Meteor.logout(),
        });
    } else {
        items.push({
            key: 'login',
            icon: <LoginOutlined />,
            label: 'Login',
            onClick: () => navigate(publicRoutes.login.path),
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
                {SITE_NAME} ©{new Date().getFullYear()}
            </Footer>
        </Layout>
    );
};

export default RouteRenderer;
