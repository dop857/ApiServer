const {dataBaseModel: modeldb} = require("./model/mongo");
const {MongoClient} = require("mongodb");
let link;
let client;

MongoClient.connect('mongodb://127.0.0.1:27017').then((cl)=>{
    client=cl;
    link=cl.db("scada");
    console.log("do");

    let col=link.collection('stationActive');

    //проверить на исуществование пакета

    col.deleteMany({}).then((e)=>
    {
        console.log(e);//res.send({status:"error",message:"Program is allrerady exist"});
    }).catch((r)=>{
        //Добавить программу в базу данных
        console.log(r);
        console.log("DOBAVIT BAZU");
    });


});


/*const {spawn} = require("child_process");
async function restore(dbName, archivePath) {
    const child = spawn("mongorestore", [
        `--host=localhost`,
        `--archive=./model/archive/backup-280623.gz`,

        "--gzip",
    ]);

    return new Promise((resolve, reject) => {
        child.stdout.on("data", (data) => {
            console.log("stdout:\n", data);
        });
        child.stderr.on("data", (data) => {
            console.log("stderr:\n", Buffer.from(data).toString());
        });
        child.on("error", (error) => {
            console.log("error:\n", error);
            reject(error);
        });
        child.on("exit", (code, signal) => {
            if (code) {
                console.log("Process exit with code:", code);
                reject(new Error(`Process exit with code: ${code}`));
            } else if (signal) {
                console.log("Process killed with signal:", signal);
                reject(new Error(`Process killed with signal: ${signal}`));
            } else {
                console.log("Restore is successful ✅");
                resolve("Restore is successful ✅");
            }
        });
    });
}
restore("fgdg","dfdfd").then((r)=>{console.log(r)}).catch((r)=>{console.log(r)})

/*
const { backap } = require("mongod-backup");

const { backup } = require("mongod-backup");

const dbUri = "mongodb://localhost:27017/";

backup(dbUri)
    .then((backupPath) => {
        console.log(`Backup successful. Archive file path: ${backupPath}`);
    })
    .catch((error) => {
        console.log("Backup failed.", error);
    });
/*
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

*/


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