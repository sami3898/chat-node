const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Signup User
const createUser = async (req, res) => {
    try {
        bcrypt
            .hash(req.body.password, 10)
            .then(async (hashedPassword) => {
                const user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword,
                });

                // save
                const result = await user.save();

                if (result) {
                    // create token
                    const token = jwt.sign(
                        {
                            userId: result._id,
                            userEmail: result.email,
                        },
                        "RANDOM_TOKEN"
                    );

                    res.status(200).json({
                        status: "SUCCESS",
                        message: "User created successfully",
                        user: result,
                        token,
                    });
                } else {
                    res.status(400).json({
                        status: "FAILED",
                        message: "Something went wrong",
                    });
                }
            })
            .catch((error) => {
                if (error.keyPattern.email == 1) {
                    res.status(400).json({
                        status: "FAILED",
                        message: "Email already exists",
                        error: error,
                    });
                } else {
                    res.status(400).json({
                        status: "FAILED",
                        message: "Password not hashed successfully",
                        // error: error
                    });
                }
            });
    } catch (error) {
        res.send(error);
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        User.findOne({ email: req.body.email })
            .then((user) => {
                bcrypt
                    .compare(req.body.password, user.password)
                    .then((passwordCheck) => {
                        if (!passwordCheck) {
                            res.status(400).json({
                                message: "Password does not match",
                            });
                        } else {
                            // create token
                            const token = jwt.sign(
                                {
                                    userId: user._id,
                                    userEmail: user.email,
                                },
                                "RANDOM_TOKEN"
                            );

                            res.status(200).json({
                                status: "SUCCESS",
                                message: "User login successfully",
                                user: user,
                                token,
                            });
                        }
                    });
            })
            .catch((error) => {
                res.status(400).json({
                    status: "FAILED",
                    message: "Email not found"
                })
            });
    } catch (error) {
        res.status(400).json({
            status: "FAILED",
            message: "Email not found"
        })
    }
};

// Update User
const updateProfilePicture = async (req, res) => {
    try {
        const userId  = req.params.id;
        const image = req.body.image;

        console.log(userId)

        const updateUser = await User.findOneAndUpdate(
            { _id: userId },
            {
                $set: { avatarImage: image },
            },
            { new: true }
        );


        if (updateUser) {
            res.status(200).json({
                status: "SUCCESS",
                message: "Avatar image updated",
                user: updateUser
            })
        } else {
            res.status(400).json({
                message: "Something went wrong"
            })
        }
    } catch (error) {
        res.send(error)
    }
}

// Get users
const getAllUsers = async (req, res) => {
    try {

        const token = await req.headers.authorization.split(" ")[1];

        const decodeToken = jwt.decode(token, "RANDOM-TOKEN");

        const user = await decodeToken;

        const users = await User.find({ _id: { $ne: user.userId }}).select([
            "name",
            "email",
            "avatarImage",
            "_id"
        ])

        if (users) {
            res.status(200).json({
                status: "SUCCESS",
                message: "User fetched successfully",
                users: users
            })
        } else {
            res.status(400).json({
                status: "FAILED",
                message: "Something wend wrong"
            })
        }

    } catch (error) {
        res.send(error)
    }
}

module.exports = { createUser, loginUser, updateProfilePicture, getAllUsers };
