const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    citizenNo: {
        type: String,
        required: true,
        // trim: true,
        minlength: 14
    }
    // password: {
    //     type: String,
    //     required: true,
    //     minlength: 6
    // }
})

// userSchema.path('name').validate(function(n) {
//     return n.length === 14;
// }, 'Invalid CitizenNO');

const User = mongoose.model('User', userSchema)
module.exports = {User}