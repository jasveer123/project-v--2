const axios = require('axios')

module.exports.getauth = async (person) =>{
    console.log("3")
    const res = await axios.post("http://localhost:7000/auth/signup",person)
    console.log("hello")
    data = res.data
    console.log(data)
    console.log("5")
    return data
}

module.exports.login = async (person) =>{

    const res = await axios.post("http://localhost:7000/auth/login",person)

    data = res.data
    return data

}