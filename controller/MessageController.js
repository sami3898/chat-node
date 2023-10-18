const Message = require("../model/Message");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Add message to db
const addMessage = async (req, res) => {
    try {
        const { from, to, message } = req.body
        const msg = new Message({
            message: { text: message },
            users: [from, to],
            sender: from
        })
        const result = await msg.save()
        if (result) {
            res.status(200).json({
                status: "SUCCESS",
                message: "Message added successfully",
                data: result
            })
        } else {
            res.status(400).json({
                status: "FAILED",
                message: "Something went wrong"
            })
        }
    } catch (error) {
        res.send(error);
    }
};

// Get messages
const getMessages = async (req, res) => {
    try {
        const { from, to } = req.body
        const message = await Message.find({
            users: {$all:[from, to]}
        }).sort({ updatedAt: 1})

        if (message) {
            res.status(200).json({
                status: "SUCCESS",
                message: "Message fetched successfully",
                data: message
            })
        } else {
            res.status(400).json({
                status: "FAILED",
                message: "Error while fetching messages"
            })
        }

    } catch (error) {
        res.send(error)
    }
}

module.exports = { addMessage, getMessages }