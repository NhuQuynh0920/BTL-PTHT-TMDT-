import { getShippingInfo } from '../services/shippingService.js';
import axios from 'axios';
import User from '../models/User.js';
import fs from 'fs';
import path from 'path';



export const calculateShipping = async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) return res.status(400).json({ message: 'Vui lòng cung cấp địa chỉ' });
    const result = await getShippingInfo(address);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Lỗi tính phí vận chuyển' });
  }
};



export const addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { label, name, phone, address, isDefault } = req.body;

        // If this is the first address, or isDefault is true, unset other defaults
        if (isDefault || user.addresses.length === 0) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        user.addresses.push({ 
            label: label || 'Nhà riêng', 
            name, 
            phone, 
            address, 
            isDefault: isDefault || user.addresses.length === 0 
        });
        
        await user.save();
        res.status(201).json(user.addresses);
    } catch (error) {
        console.error('Error adding address:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
export const getAddresses = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update address
// @route   PUT /api/users/addresses/:id
// @access  Private
export const updateAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { label, name, phone, address, isDefault } = req.body;
        const addressItem = user.addresses.id(req.params.id);

        if (!addressItem) return res.status(404).json({ message: 'Address not found' });

        if (isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        addressItem.label = label || addressItem.label;
        addressItem.name = name || addressItem.name;
        addressItem.phone = phone || addressItem.phone;
        addressItem.address = address || addressItem.address;
        addressItem.isDefault = isDefault !== undefined ? isDefault : addressItem.isDefault;

        await user.save();
        res.json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete address
// @route   DELETE /api/users/addresses/:id
// @access  Private
export const deleteAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
        
        // If we deleted the default, set a new one if possible
        if (user.addresses.length > 0 && !user.addresses.some(a => a.isDefault)) {
            user.addresses[0].isDefault = true;
        }

        await user.save();
        res.json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getLocations = (req, res) => {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'danhmucxaphuong.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    res.json(JSON.parse(rawData));
  } catch (error) {
    console.error('Error reading location data:', error);
    res.status(500).json({ message: 'Lỗi tải dữ liệu địa chỉ' });
  }
};
