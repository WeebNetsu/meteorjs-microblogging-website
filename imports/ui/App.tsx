import { ConfigProvider, theme } from "antd";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import React from "react";
import { Route, Switch } from "wouter";
import { protectedRoutes, publicRoutes } from "../utils/constants/routes";

const App: React.FC = () => {
	const userId = useTracker(() => Meteor.userId());

	// user is not logged in
	if (userId === null) {
		// you can add any config providers here to cover all public routes
		return (
			<>
				<Switch>
					{Object.values(publicRoutes).map((route) => (
						<Route key={route.path} path={route.path}>
							{route.element}
						</Route>
					))}
				</Switch>
			</>
		);
	}

	// still loading data from backend
	if (!userId) return <p>Loading</p>;

	// you can add any config providers here to cover all protected routes
	return (
		<ConfigProvider
			theme={{
				// change to darkAlgorithm for dark theme
				algorithm: theme.defaultAlgorithm,
			}}
		>
			<Switch>
				{Object.values(protectedRoutes).map((route) => (
					<Route key={route.path} path={route.path}>
						{route.element}
					</Route>
				))}
			</Switch>
		</ConfigProvider>
	);
};

export default App;
