const axios = require('axios');
const request = require('request');



module.exports.getid = async (step) => {
   

      console.log("error happen")
       res = await axios.get(`http://localhost:7000/ticket/${step.values.id}`)
      console.log("cjeack")
        const data = res.data;
        console.log("starts")
        console.log(data)

        return data;
}

module.exports.getdetails = async (step) =>{

   
  const params ={
    name:`${step.values.name.toUpperCase()}`,
   noOfParticipants :`${step.values.noOfParticipants}`,
    location:`${step.values.location.toUpperCase()}`,
    destination:`${step.values.destination.toUpperCase()}` ,
    date: `${step.values.date}`,
    time: `${step.values.time}`
}  

    console.log(params)
    res = await axios.get("http://localhost:7000/ticket",{params})

    const data = res.data;
    return data;
    
}



module.exports.postid = async (step) => {

  const params ={
            name:`${step.values.name.toUpperCase()}`,
            noOfParticipants :`${step.values.noOfParticipants}`,
            location:`${step.values.location.toUpperCase()}`,
            destination:`${step.values.destination.toUpperCase()}` ,
            date: `${step.values.date}`,
            time: `${step.values.time}`
        }   

    rep = await axios.post("http://localhost:7000/ticket", params)
    const data1 = rep.data;
    return data1
}


module.exports.deleteid = async(step) =>{
   
   // const params = {id:`${step.values.id}`}
    //console.log(step.values.id)
    res = await axios.delete(`http://localhost:7000/ticket/${step.values.id}`)
    return res
}


