const borrowedBookModel = require("../models/borrowedBook.js")

const getMostBookReader = async (req, res) => {
    try {
        const result = await borrowedBookModel.aggregate([
            {
                $group: {
                    _id: { userId: "$userId", bookId: "$bookId" },
                    borrowCount: { $sum: 1 } 
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id.bookId",
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
                    userId: "$_id.userId",
                    book: {
                        book_name:"$bookDetails.title",
                        borrowCount: "$borrowCount"
                    }
                }
            },

            {
                $group: {
                    _id: "$userId",
                    totalborrowbook: { $sum: "$book.borrowCount"},
                    books: { $push: "$book" }
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
                    totalborrowbook: 1,
                    books: 1
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

// const getMostBookReader = async (req, res) => {
//     try {
//         const result = await borrowedBookModel.aggregate([
//             {
//                 $group: {
//                     _id: { userId: "$userId", bookId: "$bookId" },
//                     borrowCount: { $sum: 1 }
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "books",
//                     localField: "_id.bookId",
//                     foreignField: "_id",
//                     as: "bookDetails"
//                 }
//             },
//             { $unwind: "$bookDetails" },
//             {
//                 $project: {
//                     _id: 0,
//                     userId: "$_id.userId",
//                     book: {
//                         title: "$bookDetails.title",
//                         borrowCount: "$borrowCount"
//                     }
//                 }
//             },
//             {
//                 $group: {
//                     _id: "$userId",
//                     totalborrowbook: { $sum: "$book.borrowCount" },
//                     books: { $push: "$book" }
//                 }
//             },
//             { $sort: { totalborrowbook: -1 } },
//             { $limit: 3 },
//             {
//                 $lookup: {
//                     from: "users",
//                     localField: "_id",
//                     foreignField: "_id",
//                     as: "userDetails"
//                 }
//             },
//             { $unwind: "$userDetails" },
//             {
//                 $project: {
//                     _id: 0,
//                     user_name: "$userDetails.name",
//                     email: "$userDetails.email",
//                     totalborrowbook: 1,
//                     books: 1
//                 }
//             }
//         ]);

//         res.status(200).json({ success: true, data: result });
//     } catch (error) {
//         console.log(error);
//         res.status(400).json({ success: false, message: "Something went wrong here.." });
//     }
// }


// const mostfamousBook = async (req, res) => {
//     try {
//         const result = await borrowedBookModel.aggregate([
//             {
//                 $group: {
//                     _id: "$bookId",
//                     userMostborrow: { $sum: 1 }
//                 }
//             },
//             { 
//                 $sort: { 
//                     userMostborrow: -1
//                 } 
//             },
//             { 
//                 $limit:  3
//             },
//             {
//                 $lookup: {
//                     from: "books",
//                     localField: "_id",
//                     foreignField: "_id",
//                     as: "bookDetails"
//                 }
//             },
//             { 
//                 $unwind: "$bookDetails" 
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     book_name: "$bookDetails.title",
//                     userMostborrow: 1
//                 }
//             }
//         ])

//         res.status(200).json({
//             success: true,
//             data: result
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(400).json({
//             success: false,
//             message: "Something went wrong here.."
//         })
//     }
// }

const mostfamousBook = async (req, res) => {
    try {
        const result = await borrowedBookModel.aggregate([
            {
                $group: {
                    _id: { userId: "$userId", bookId: "$bookId" },
                    borrowCount: { $sum: 1 } 
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id.userId",
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
                    bookId: "$_id.bookId",
                    user: {
                        user_name:"$userDetails.name",
                        // user_email: "$userDetails.email",
                        borrowCount: "$borrowCount"
                    }
                }
            },

            {
                $group: {
                    _id: "$bookId",
                    totalborrowbook: { $sum: "$user.borrowCount"},
                    users: { $push: "$user"}
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
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookDatails"
                }
            },
            { 
                $unwind: "$bookDatails" 
            },
            
            {
                $project: {
                    _id: 0,
                    book_name: "$bookDatails.title",
                    totalborrowbook: 1,
                    users: 1
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