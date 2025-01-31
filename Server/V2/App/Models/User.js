// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const { Schema, model } = mongoose


// Define the schema for the User model
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true, collection: "users" });

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Static method to create a user
userSchema.statics.createUser = async function (username, email, password) {
    try {
        const user = new this({ username, email, password });
        return await user.save();
    } catch (error) {
        throw new Error(error.message || "Error creating user");
    }
};

// Static method to find a user by email
userSchema.statics.findByEmail = async function (email) {
    try {
        return await this.findOne({ email });
    } catch (error) {
        throw new Error(error.message || "Error finding user by email");
    }
};

// Instance method to validate a password
userSchema.methods.validatePassword = async function (providedPassword) {
    try {
        return await bcrypt.compare(providedPassword, this.password);
    } catch (error) {
        throw new Error(error.message || "Error validating password");
    }
};

export default model('User', userSchema);




