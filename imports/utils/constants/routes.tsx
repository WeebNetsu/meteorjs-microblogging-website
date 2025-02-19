import React from "react";
import HomePage from "/imports/ui/HomePage";
import LoginPage from "/imports/ui/LoginPage";
import NotFoundPage from "/imports/ui/NotFoundPage";

/**
 * User does not have to be logged in to view these routes
 */
export const publicRoutes = {
	login: {
		path: "/login",
		element: (<LoginPage />) as React.ReactNode,
	},
	signup: {
		path: "/signup",
		element: (<LoginPage />) as React.ReactNode,
	},
	default: {
		path: "*",
		element: (<LoginPage />) as React.ReactNode,
	},
};

/**
 * User has to be logged in to view these routes
 */
export const protectedRoutes = {
	// NOTE: Route order matters, root routes should be below their children
	home: {
		path: "/",
		element: (<HomePage />) as React.ReactNode,
	},
	default: {
		path: "*",
		element: (<NotFoundPage />) as React.ReactNode,
	},
};
