import { gql } from "@apollo/client";

export const SIGN_UP = gql`
	mutation SignUp($input: SignUpInput!) { # the $input is a var to call later 
		signUp(input: $input) { # the input: is follow the string we set in user.typeDef.js in backend
			_id
			name
			username
		}
	}
`;

export const LOGIN = gql`
	mutation Login($input: LoginInput!) {
		login(input: $input) {
			_id
			name
			username
		}
	}
`;

export const LOGOUT = gql`
	mutation Logout {
		logout {
			message
		}
	}
`;