const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    username: {
        type: String,
    },
    phone_no:
    {
        type: String,
    },
    no_of_guests:
    {
        type: String,
    },
    reservation_type:
    {
        type: String,
    },
    special_requirement:
    {
        type: String,
    },
    createdAt: {
        type: Date,
        default:Date.now()
    }
}
,
{
  timestamps: true
});
userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User", userSchema);