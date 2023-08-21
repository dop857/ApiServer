const {dataBaseModel: modeldb} = require("../model/mongo");
//модуль обработки ошибок
const Errors=
{
    buffer:"",//все ошибки подгружаются из базы в буфер далее возвращаются по номерам через функцию Show()
    async Constructor()
    {
        let col;
        try {
            col=modeldb.link.collection('errors');
            this.buffer=await col.find({}).toArray();
        }
        catch (e) {
            console.log(" IN FIRST ERROR MONGO")
        }
        return this.buffer;
    },
    Show(number,errorthrow="no")
    {
        errorthrow=errorthrow||"no";
        let result=this.buffer.find(num=>num.number===number);
        result["status"]="error";
        if(errorthrow!="no")result["details"]=errorthrow;
        delete result._id;
        return result;
    }
}
exports.Errors=Errors;