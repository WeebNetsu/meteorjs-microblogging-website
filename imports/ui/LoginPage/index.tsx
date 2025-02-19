import { checkStrEmpty, emailRegex } from "@netsu/js-utils";
import { Button, Input, message, Space, Typography } from "antd";
import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import { MethodSetUserCreateModel } from "/imports/api/users/models";
import { errorResponse } from "/imports/utils/errors";
import { clientContentError } from "/imports/utils/serverErrors";

const LoginPage: React.FC = () => {
	const [showLogin, setShowLogin] = useState(true);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async () => {
		if (checkStrEmpty([email, password])) {
			return message.error("All fields are required");
		}

		if (password.length < 8) {
			return message.error("Password is too short");
		}

		if (!emailRegex.test(email)) {
			return clientContentError("Email is invalid");
		}

		Meteor.loginWithPassword(email, password, (err: Meteor.Error) => {
			if (err) {
				return errorResponse(err, "Could not log in");
			}
		});
	};

	const handleSignUp = async () => {
		if (checkStrEmpty([email, firstName, lastName, password])) {
			return message.error("All fields are required");
		}

		if (password.length < 8) {
			return message.error("Password is too short");
		}

		if (!emailRegex.test(email)) {
			return clientContentError("Email is invalid");
		}

		try {
			const data: MethodSetUserCreateModel = {
				email,
				firstName,
				lastName,
				password,
			};

			await Meteor.callAsync("set.user.create", data);
		} catch (error) {
			return errorResponse(error as Meteor.Error, "Could not create account");
		}

		message.success("Account created");

		handleLogin();
	};

	return (
		<Space direction="vertical">
			{!showLogin && (
				<>
					<Space>
						<Typography>First Name</Typography>
						<Input
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
						/>
					</Space>

					<Space>
						<Typography>Last Name</Typography>
						<Input
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
						/>
					</Space>
				</>
			)}

			<Space>
				<Typography>Email</Typography>
				<Input value={email} onChange={(e) => setEmail(e.target.value)} />
			</Space>

			<Space>
				<Typography>Password</Typography>
				<Input.Password
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</Space>

			<Space>
				<Button onClick={showLogin ? handleLogin : handleSignUp}>
					{showLogin ? "Login" : "Sign Up"}
				</Button>
				<Typography>
					{showLogin ? "Don't have an account?" : "Already have an account?"}{" "}
					<Button onClick={() => setShowLogin((val) => !val)} type="link">
						{showLogin ? "Sign Up" : "Login"}
					</Button>
				</Typography>
			</Space>
		</Space>
	);
};

export default LoginPage;
