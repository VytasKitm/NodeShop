const User = require("../models/userModel.js")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const asyncHandler = require("express-async-handler")

const generatedToken = (id)=>{
        return jwt.sign({id},process.env.JWT_SALT,{
                expiresIn: "30d"
        });
}

// REGISTER
// @ROUTE (/users)

const registerUser = asyncHandler(async(req,res)=>{
        const {name,email,password}=req.body
        if(!name || !email || !password) {
                res.status(400);
                throw new Error("Please add all fields")
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
                res.status(400)
                throw new Error("Toks vartotojas jau yra")
        }

        const salt = await bcrypt.genSalt(8)
        const hashedPassword = await bcrypt.hash(password,salt)

        const user = await User.create({
                name,
                password: hashedPassword,
                email,
                role: "simple"
        })

        if(user) {
                res.status(201).json({
                        _id: user.id,
                        name: user.name,
                        email: user.email,
                        token: generatedToken(user._id),
                        role:user.role
                })
        }
})


// LOGIN
// @ROUTE (/users/login)


const loginUser = asyncHandler(async(req,res) => {
        const {email, password} =req.body;

        const user = await User.findOne({email})
        
        if (user && (await bcrypt.compare(password, user.password))) {
                res.json({
                        _id: user.id,
                        name: user.name,
                        token: generatedToken(user._id),
                        role: user.role
                });
        } else {
                res.status(400);
                throw new Error ("Invalid credentials")
        }
})

// @description gets user by id
// @route GET /api/users/:id

const getUserById = asyncHandler(async (req, res) => {
        const user = await User.findById({_id: req.params.id}).select('-password -email -role -_id')
        res.status(200).json(user);
})



// @description Get user data
// @route GET /api/users/user
// @access PRIVATE

const getUserF = asyncHandler(async (req, res) => {
        // const user = await req.user
        // console.log(user)
        // if (!req.user || !req.user._id) {
        //         res.status(401)
        //         throw new Error ("User not authenticated")
        // }
        // console.log(user)
        // res.status(200).json(user);
        // const {status, response} = await getUser(req)
        res.status(200).json(req.user)

        // if (status===200) {
        //         req.user=response
        //         next()
        // }
        // else {
        //         res.send(status, response)
        // }
});

// @description Get users data
// @route GET /api/users/list
// @access PRIVATE

const getUsers = asyncHandler(async (req, res) => {
        const users = await User.aggregate([
                {
                        $lookup: {
                                from: "ads",
                                localField: "_id",
                                foreignField: "user",
                                as: "ads",
                        },
                },
                {
                        $match: {role: {$in: ["simple", "admin"]}},
                },
                {
                        $unset: [
                                "password",
                                "createdAt",
                                "updatedAt",
                                "gaols.createdAt",
                                "ads.updatedAt",
                                "ads.__v",
                                "__v",
                        ],
                },
        ]);

        res.status(200).json(users)
})

// @route /api/users/delete/:id

const deleteUser = asyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);

        if (!req.user) {
                res.status(401)
                throw new Error("User not found")
        }

        if (req.user.role === "simple") {
                if (ad.user.toString() !== req.user.id) {
                        res.status(401)
                        throw new Error("User not authorized")
                }  
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({id: req.params.id})
})

module.exports = {registerUser, loginUser, getUsers, getUserById, getUserF, deleteUser}