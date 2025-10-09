const { authMiddleware } = require("../middleware/auth.js");
const jwt = require("jsonwebtoken")
const book = require("../models/book.js");
const borrowedBookModel = require("../models/borrowedBook.js")
const moment = require("moment");

const borrowed = async (req, res) => {
    try {
        const Borrow = await borrowedBookModel.create(req.body)
        // await user.save()

        res.status(200).json({
            success: true,
            data: Borrow
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: false,
            message: "Some Error Issue here.."
        })
    }
}

const borrowedUserbyBook = async (req, res) => {
    try {
        
        const token = req.headers["authorization"]?.split(" ")[1]

        if(!token){
            return res.status(402).json({
                success: false,
                message: "Token is required!!"
            })
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err,decoded) =>{
            if(err) return res.status(401).json({ message: "Invalid Token.."})

            req.user = decoded    
        })

        // console.log(req.user)

        const Borrow = await borrowedBookModel.create({
            bookId: req.body.bookId,
            userId: req.user.id
        })
        // await user.save()

        res.status(200).json({
            success: true,
            data: Borrow
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: false,
            message: "Some Error Issue here.."
        })
    }
}

const alldata = async (req, res) => {
    try {
        const result = await borrowedBookModel.aggregate([

            // {
            //     $addFields: {
            //         userId: { 
            //             $toObjectId: "$userId" 
            //         },
            //         bookId: { 
            //             $toObjectId: "$bookId" 
            //         }
            //     }
            // },
            
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            
            {
                $lookup: {
                    from: "books",
                    localField: "bookId",
                    foreignField: "_id",
                    as: "bookDetails"
                }
            },
            { $unwind: "$bookDetails" },
            {
                $project: {
                    _id: 0,
                    name: "$userDetails.name",
                    book: "$bookDetails.title",
                    borrowDate: 1,
                    returnDate: 1,
                    // borrowDate: moment(borrowedBookModel.borrowDate).format("YYYY-MM-DD hh:mm A"),
                    // returnDate: borrowedBookModel.returnDate ? moment(borrowedBookModel.returnDate).format("YYYY-MM-DD hh:mm A") : null,
                    fine: 1,
                }
            }
        ]);

        // console.log(result)

        const formattedResult = result.map(item => ({
            name: item.name,
            book: item.book,
            borrowDate: moment(item.borrowDate).format("YYYY-MM-DD hh:mm A"),
            returnDate: item.returnDate ? moment(item.returnDate).format("YYYY-MM-DD hh:mm A") : null,
            fine: item.fine,
        }));


        res.status(200).json({
            success: true,
            // data: result
            data: formattedResult
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: false,
            message: "Some Error Issue here.."
        })
    }
}

const getBorrowedBook = async (req, res) => {
    try {
        const result = await borrowedBookModel.aggregate([

            // {
            //     $addFields: {
            //         userId: { 
            //             $toObjectId: "$userId" 
            //         },
            //         bookId: { 
            //             $toObjectId: "$bookId" 
            //         }
            //     }
            // },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            {
                $lookup: {
                    from: "books",
                    localField: "bookId",
                    foreignField: "_id",
                    as: "bookDetails"
                }
            },
            { $unwind: "$bookDetails" },
            {
                $project: {
                    _id: 0,
                    "userDetails.name": 1,
                    "bookDetails.title": 1,
                    borrowDate: 1,
                    returnDate: 1,
                    fine: 1
                }
            }
            
        ]);


        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: false,
            message: "Some Error Issue here.."
        })
    }
}

const totalFine = async (req, res) => {
    try {
        const result = await borrowedBookModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalFine: { $sum: "$fine" }
                }
            }
        ])

        res.status(200).json({
            success: true,
            totalFine: result[0]?.totalFine || 0
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: false,
            message: "Some Error Issue here.."
        })
    }
}

// const perPersonFine = async (req,res) => {
//     try {
        
//     } catch (error) {
//         console.log(error.message)
//         return res.status(400).json({
//             success: false,
//             message: "Something went erong here!!.."
//         })
//     }
// }



module.exports = {
    borrowed,
    getBorrowedBook,
    totalFine,
    alldata,
    borrowedUserbyBook
}