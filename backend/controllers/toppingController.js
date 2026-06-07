import asyncHandler from 'express-async-handler';
import Topping from '../models/Topping.js';

// @desc    Get all toppings
// @route   GET /api/toppings
// @access  Public
export const getToppings = asyncHandler(async (req, res) => {
    const toppings = await Topping.find({});
    res.json(toppings);
});

// @desc    Create a topping
// @route   POST /api/toppings
// @access  Private/Admin
export const createTopping = asyncHandler(async (req, res) => {
    const { name, price } = req.body;

    const toppingExists = await Topping.findOne({ name });

    if (toppingExists) {
        res.status(400);
        throw new Error('Topping already exists');
    }

    const topping = await Topping.create({
        name,
        price
    });

    if (topping) {
        res.status(201).json(topping);
    } else {
        res.status(400);
        throw new Error('Invalid topping data');
    }
});

// @desc    Update a topping
// @route   PUT /api/toppings/:id
// @access  Private/Admin
export const updateTopping = asyncHandler(async (req, res) => {
    const { name, price, isAvailable } = req.body;

    const topping = await Topping.findById(req.params.id);

    if (topping) {
        topping.name = name || topping.name;
        topping.price = price !== undefined ? price : topping.price;
        topping.isAvailable = isAvailable !== undefined ? isAvailable : topping.isAvailable;

        const updatedTopping = await topping.save();
        res.json(updatedTopping);
    } else {
        res.status(404);
        throw new Error('Topping not found');
    }
});

// @desc    Delete a topping
// @route   DELETE /api/toppings/:id
// @access  Private/Admin
export const deleteTopping = asyncHandler(async (req, res) => {
    const topping = await Topping.findById(req.params.id);

    if (topping) {
        await topping.deleteOne();
        res.json({ message: 'Topping removed' });
    } else {
        res.status(404);
        throw new Error('Topping not found');
    }
});
