const mongoose = require("mongoose");
var brandSchema = new mongoose.Schema(
    {
        title: {
            type : String,
            required: true,
            unique: true,
            index: true,
        },

    },
    {
        timestamps: true,
    }


);

///export the model
module.exports = mongoose.model("Brand",brandSchema);