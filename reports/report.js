const borrowedBook = require("../models/borrowedBook.js")
const borrowedBookModel = require("../models/borrowedBook.js")
const user = require("../models/user.js")

const getMostBookReader = async (req, res) => {
    try {
        const result = await borrowedBookModel.aggregate([
            {
                $group: {
                    _id: "$userId",
                    totalborrowbook: { $sum: 1 }
                }
            },
            { 
                $sort: { 
                    totalborrowbook: -1
                } 
            },
            { 
                $limit:  3
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { 
                $unwind: "$userDetails" 
            },
            {
                $project: {
                    _id: 0,
                    user_name: "$userDetails.name",
                    email: "$userDetails.email",
                    totalborrowbook: 1
                }
            }
        ])

        res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: false,
            message: "Something went wrong here.."
        })
    }
}

const mostfamousBook = async (req, res) => {
    try {
        const result = await borrowedBookModel.aggregate([
            {
                $group: {
                    _id: "$bookId",
                    userMostborrow: { $sum: 1 }
                }
            },
            { 
                $sort: { 
                    userMostborrow: -1
                } 
            },
            { 
                $limit:  3
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookDetails"
                }
            },
            { 
                $unwind: "$bookDetails" 
            },
            {
                $project: {
                    _id: 0,
                    book_name: "$bookDetails.title",
                    userMostborrow: 1
                }
            }
        ])

        res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: false,
            message: "Something went wrong here.."
        })
    }
}

module.exports = {
    getMostBookReader,
    mostfamousBook
}