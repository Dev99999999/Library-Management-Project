const borrowedBookModel = require("../models/borrowedBook.js")

const perPersonFine = async (req,res) => {
    try {
        const result = await borrowedBookModel.aggregate([
            {
                $group: {
                    _id: "$userId",
                    totalFine: { $sum: "$fine"}
                }
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
                $unwind: '$userDetails'
            },
            {
                $project: {
                    _id: 0,
                    userId: "$_id",
                    name:"$userDetails.name",
                    totalFine: "$totalFine"
                }
            }
        ])

        return res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({
            success: false,
            message: "Something went erong here!!.."
        })
    }
}

module.exports = { perPersonFine }