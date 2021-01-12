const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

const ownerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
}
,
{
  timestamps: true
});
ownerSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("Owner", ownerSchema);