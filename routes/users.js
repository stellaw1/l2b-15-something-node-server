const express = require('express')
const { status } = require('express/lib/response')
const router = express.Router()
const User = require('../models/user')

// GET all
router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

// GET one
router.get('/:id', getUser, (req, res) => {
    res.json(res.user)
})


// POST one
router.post('/', async (req, res) => {
    const user = new User({
        id: req.body.id,
        pet_colour: req.body.pet_colour,
        friendship_points: 0
    })
    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// DELETE one
router.delete('/:id', getUser, async (req, res) => {
    try {
        await res.user.remove()
        res.json({message: 'Deleted user'})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

// UPDATE one
router.patch('/:id', getUser, async (req, res) => {
    if (req.body.id != null) {
        res.user.id = req.user.id
    }
    if (req.body.pet_colour != null) {
        res.user.pet_colour = req.body.pet_colour
    }
    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

async function getUser(req, res, next) {
    let user
    try {
        user = await User.findById(req.params.id)
        if (user == null) {
            return res.status(404).json({message: 'Cannot find user'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }

    res.user = user
    next()
}

module.exports = router