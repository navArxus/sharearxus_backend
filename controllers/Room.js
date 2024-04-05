const projectModel = require("../Model/project")
const date = new Date(Date.now());


const createRoom = async (roomID,ownerID,firstlanguage) => {
    await projectModel.create({
        roomID: roomID,
        ownerID : ownerID,
        codeSnippet: [{
            name:"index",
            language:firstlanguage,
            code:""
        }],
        activity:[`Created room ${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`],
        document:[]
        
    })
}

const checkRoom = async (roomID) => {
    const res = await projectModel.findOne({roomID})
    if(!res){
        return false;
    }else{
        return true;
    }
}

module.exports = {
    createRoom,
    checkRoom
}