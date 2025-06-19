const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Crop name is required'],
        trim: true
    },
    image: {
        type: String,
        required: [true, 'Image URL is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        trim: true
    },
    quantity: {
        type: Number,
        default: 1,
        min: [0, 'Quantity cannot be negative']
    },
    unit: {
        type: String,
        enum: ['kg', 'ton', 'piece', 'box'],
        default: 'kg'
    },
    harvestDate: {
        type: Date
    },
    expiryDate: {
        type: Date
    },
    category: {
        type: String,
        enum: ['vegetables', 'fruits', 'grains', 'dairy', 'other'],
        default: 'other'
    },
    organic: {
        type: Boolean,
        default: false
    },
    certification: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Index for faster queries
cropSchema.index({ farmerId: 1, isAvailable: 1 });
cropSchema.index({ category: 1, isAvailable: 1 });
cropSchema.index({ location: 1 });

// Virtual for crop age
cropSchema.virtual('age').get(function() {
    if (!this.harvestDate) return null;
    const now = new Date();
    const harvest = new Date(this.harvestDate);
    const diffTime = Math.abs(now - harvest);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
});

// Method to check if crop is expired
cropSchema.methods.isExpired = function() {
    if (!this.expiryDate) return false;
    return new Date() > new Date(this.expiryDate);
};

// Method to update availability
cropSchema.methods.updateAvailability = function(available) {
    this.isAvailable = available;
    return this.save();
};

// Pre-save middleware to validate dates
cropSchema.pre('save', function(next) {
    if (this.harvestDate && this.expiryDate) {
        if (new Date(this.harvestDate) > new Date(this.expiryDate)) {
            next(new Error('Harvest date cannot be after expiry date'));
        }
    }
    next();
});

const Crop = mongoose.model('Crop', cropSchema);

module.exports = Crop; 