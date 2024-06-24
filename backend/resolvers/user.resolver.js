import { Query } from 'mongoose'
import { users } from '../dummyData/data.js';
import bcrypt from "bcryptjs";

const userResolver = { 

    Mutation: {
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
        }
    },

    Query: {
        users: (_, __, { req, res }) => {
            return users;
        },
        user: (_, {userId}) => {
            return users.find((user) => user._id === userId);
        }
    },

};

export default userResolver;