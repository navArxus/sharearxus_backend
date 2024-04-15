const express = require("express")
const userModel = require("../Model/user")
const router = express.Router()
const sendemail = require("../services/nodemailer")
const otpGenerator = require('otp-generator')
const otpmodel = require("../Model/otp")

router.post("/login", async (req, res) => {
    const result = await userModel.matchpassword(req.body.email, req.body.password)
    console.log(result);
    if (result) {
        res.cookie("token", result, {
            httpOnly: true,
            path: "https://sharearxus.vercel.app/"
        })
        res.status(200).json({ message: result })
    } else {
        res.status(203).json({ message: 'Invalid Email or Password' });
    }
})
router.post("/signup", async (req, res) => {
    const id = "socketID"
    const user = await userModel.create({
        firstName: req.body.firstName,
        email: req.body.email,
        password: req.body.password,
        temparayID: id,
    })
    try {
        const genratedotp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        const otp = await otpmodel.create({
            email: req.body.email,
            otp: genratedotp,
        })
        // send mail with the generated OTP to the registered Email ID
        await sendemail(req.body.email, "Verification for shareARXUS", "Your One Time Password  is : " + genratedotp);
        console.log("Email sent to ", req.body.email)
        res.json({message:"Email sent successfully",email:user.email});
    } catch (error) {
        console.log(error)
        res.status(203).json({message:"Could not sent successfully",email:user.email});
    }

})
router.post("/verifyotp", async (req, res) => {
    const { email, otp } = req.body
    const emailindatabase = await otpmodel.findOne({ email: email })
    if (!emailindatabase) {
        return res.status(403).send("Invalid User")
    } else {
        if (otp === emailindatabase.otp) {
            await otpmodel.deleteOne({ email: email })
            res.status(200).send({ message: 'OTP verified' })
        } else {
            res.status(203).send({ message: 'Wrong OTP Entered' })
        }
    }
})


module.exports = router;