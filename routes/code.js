const express = require("express")
const router = express.Router()
const projectModel = require("../Model/project")
router.post("/:roomID/commit", async (req, res) => {
    const date = new Date(Date.now())
    try {
        // console.log(req.params.roomID)
        const modelexist = await projectModel.findOne({ roomID: req.params.roomID })
        if (!modelexist) {
            return res.status(401).send({ message: 'Room does not exist' })
        } else {
            const model = await projectModel.findOneAndUpdate({ roomID: req.params.roomID, 'codeSnippet.name': req.body.snippetName }, {
                $set: {
                    'codeSnippet.$.code': req.body.newCode
                }
            })
            await projectModel.findOneAndUpdate({ roomID: req.params.roomID }, {
                $push: {
                    activity: `Commit on ${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
                }
            })
        }
        return res.status(200).json({
            message: "Updated code"
        })
    } catch (error) {
        console.log(error);
    }
})

router.get("/:roomID/detail", async (req, res) => {
    // console.log(req.params.roomID, "requested data")
    try {
        const modelexist = await projectModel.findOne({ roomID: req.params.roomID })
        if (!modelexist) {
            return res.status(401).send({ message: "Room not found" })
        }
        return res.status(200).json(modelexist)
    } catch (error) {
        console.log(error)
    }
})

module.exports = router