const mongooose = require("mongoose")

const auth_schema= new mongooose.Schema({
    email:{type:String, require:true , unique:true },
    passward:{type:String, require:true},
    name:{type:String,require:true},
    dob:{type:String,require:true}

})

const auth_menu = new mongooose.model("Auth",auth_schema)

module.exports = auth_menu;