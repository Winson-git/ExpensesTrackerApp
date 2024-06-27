import { Query } from 'mongoose'
import { users } from '../dummyData/data.js';
import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const userResolver = { 

    Mutation: {
        // sign up function
        signUp: async(_, {input}, context) => {
            try {
                const { username, name, password, gender } = input;

                // check is there empty input 
				if (!username || !name || !password || !gender) {
					throw new Error("All fields are required");
				}

                // check the is user exist
                const existingUser = await User.findOne({ username });
				if (existingUser) {
					throw new Error("User already exists");
				}

                const salt = await bcrypt.genSalt(10); // added salt to password; password hash to 10 digit
				const hashedPassword = await bcrypt.hash(password, salt);

                // Profile picture API from 'https://avatar-placeholder.iran.liara.run'
                const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
				const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

                const newUser = new User({
					username,
					name,
					password: hashedPassword,
					gender,
					profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
				});

                await newUser.save();
				await context.login(newUser);
				return newUser;

            } catch (err) {
                console.error("Error in signUp: ", err);
				throw new Error(err.message || "Internal server error");
            }
        },

        // login function
        login: async (_, { input }, context) => {
			try {
				const { username, password } = input;
				if (!username || !password) throw new Error("All fields are required");
				const { user } = await context.authenticate("graphql-local", { username, password });

				await context.login(user);
				return user;
			} catch (err) {
				console.error("Error in login:", err);
				throw new Error(err.message || "Internal server error");
			}
		},

        // logout function
        logout: async (_, __, context) => {
			try {
				await context.logout();
				context.req.session.destroy((err) => {
					if (err) throw err;
				});
				context.res.clearCookie("connect.sid");

				return { message: "Logged out successfully" };
			} catch (err) {
				console.error("Error in logout:", err);
				throw new Error(err.message || "Internal server error");
			}
		},
    },

    Query: {
        authUser: async(_, __, context) => {
            try{
                const user = await context.getUser();
				return user;
            } catch (err){
                console.error("Error in authUser:", err);
				throw new Error(err.message || "Internal server error");
            }
        },
        user: async (_, { userId }) => {
			try {
				const user = await User.findById(userId);
				return user;
			} catch (err) {
				console.error("Error in user query:", err);
				throw new Error(err.message || "Error getting user");
			}
		},
    },

};

export default userResolver;