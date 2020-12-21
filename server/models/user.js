const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
},
{
    collection: "users"
});

const User = mongoose.model('User', UserSchema);
module.exports = User;