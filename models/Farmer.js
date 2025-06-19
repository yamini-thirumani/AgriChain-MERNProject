const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    crops: [{
        name: String,
        variety: String,
        sowingDate: Date,
        harvestingDate: Date,
        area: Number,
        irrigationType: String,
        marketPrice: Number
    }],
    location: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        default: 0
    },
    certification: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        default: 0
    },
    totalRatings: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Method to get public profile
farmerSchema.methods.getPublicProfile = function() {
    const farmerObject = this.toObject();
    delete farmerObject.__v;
    return farmerObject;
};

const Farmer = mongoose.model('Farmer', farmerSchema);

module.exports = Farmer; 