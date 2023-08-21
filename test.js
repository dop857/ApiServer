const {dataBaseModel: modeldb} = require("./model/mongo");

let Client = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
let client;
let link;

let req= {
    userId: "6405b649b535d8a2a4cf77b6",
    stationId: "6405b649b535d8a2a4cf77b6",
    deviceId: "6405b649b535d8a2a4cf77b6",
    message: "d",
    nameData: "dsfdf",
    type: "dsfdsf",
    units: "fdfsff",
    periodArchive: 100,
    periodTime: 60
}
console.log(req["userrId"]);


async function VerificationRequestScheme()
{
    //stationId,userId,deviceId,nameData,typeData,units,variableType,periodArchive,periodTime,message
    let result=false;


    let col=link.collection('schemeRequest');
    await col.findOne({entryPoint:"/station/device/addProgram"}).then((result)=>{
        let scheme=result.scheme;
        for(let key in scheme)
        {
            console.log(key);
            console.log(req[key]);
            if(req[key]===undefined)
            {
                console.log("UNDEFINED");
                break;
            }
            else
            {
                if(scheme[key].type=="String")
                {
                    if(req[key].length<scheme[key].min || req[key].length>scheme[key].max)
                    {
                        console.log("LEngth key  ERROR");
                    }
                }
                if(scheme[key].type=="Uint")
                {
                    if(!isNaN(req[key]))
                    {
                        if(Number(req[key])<scheme[key].min || Number(req[key])>scheme[key].max)
                        {
                            console.log("DIAPAZON key  ERROR");
                        }
                    }
                    else
                    {
                        throw new SyntaxError("TYPE ERROR in key: "+key);
                        //console.log("TYPE key  ERROR");
                    }
                }
            }
        }
        console.log(scheme);
    });




}


Client.connect('mongodb://127.0.0.1:27717/',{"serverSelectionTimeoutMS":"100"}).then((cl)=>{
    client=cl;
    link=cl.db("scada");
    console.log("do");
    let col=link.collection('programPack');
    //проверить на исуществование пакета
    col.findOne({_id:new ObjectId("6411a9b0946361502a3300d0")}).then((e)=>
    {
        console.log(e);//res.send({status:"error",message:"Program is allrerady exist"});
    }).catch((r)=>{
        //Добавить программу в базу данных
        console.log(r);
        console.log("DOBAVIT BAZU");
    });


});

/*
console.log("1");
ff();
console.log("2");
function ff()
{
    for(let i=1;i>0;i++)
    {

    }
}*/