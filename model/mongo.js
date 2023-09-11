const {MongoClient} = require("mongodb");
const { restore } = require("mongod-backup");
const {spawn} = require("child_process");

const dataBaseModel=
    {
        "clientDB":"false",
        "users_init":"false",
        "errorMessage":"",
        "link":"no",
        "fullurl":"",
        "onlyURL":"",
        async connectMongo(url,port,dbname){
            let MongoClient = require('mongodb').MongoClient;

            try {
                this.fullurl='mongodb://' + url + ':' + port+'/scada' ;
                this.onlyURL=url;
                await MongoClient.connect('mongodb://'+url+':'+port+'/',{"serverSelectionTimeoutMS":"100","maxIdleTimeMS":60000}).then((cl)=>
                {
                    this.clientDB=cl;
                    this.link=cl.db(dbname);
                }).catch((e)=>{console.log("IN CONNECT MONGOCLIENT ERROR"+e)});


            }
            catch (e) {
                console.log("Timeout DATABASE is break connection")
                this.errorMessage="Timeout is break connection";
            }

        },
        async VerificationRequestScheme(req,entryPoint)
        {
            //stationId,userId,deviceId,nameData,typeData,units,variableType,periodArchive,periodTime,message
            let resultFunc;

                let col=this.link.collection('schemeRequest');
                await col.findOne({entryPoint:entryPoint}).then((result)=>{
                    let scheme=result.scheme;
                    for(let key in scheme)
                    {
                        console.log(key);
                        console.log(req[key]);
                        if(req[key]===undefined)
                        {

                            throw new SyntaxError("UNDEFINED ERROR in key: "+key);
                            //break;
                        }
                        else
                        {
                            if(scheme[key].type=="String")
                            {
                                if(req[key].length<scheme[key].min || req[key].length>scheme[key].max)
                                {

                                    throw new SyntaxError("Lenth ERROR in key: "+key);
                                }
                            }
                            if(scheme[key].type=="Uint")
                            {
                                if(!isNaN(req[key]))
                                {
                                    if(Number(req[key])<scheme[key].min || Number(req[key])>scheme[key].max)
                                    {

                                        throw new SyntaxError("RANGE ERROR in key: "+key);
                                    }

                                }
                                else
                                {

                                    throw new SyntaxError("TYPE ERROR in key: "+key);
                                }
                            }
                            if(scheme[key].type=="Bool")
                            {
                                if(req[key]==true || req[key]==false)
                                {

                                }
                                else
                                {
                                    throw new SyntaxError("TYPE ERROR in key: "+key);
                                }
                            }
                        }
                    }
                });





            return true;
        },
        async InitDatabase()
        {
            //`--archive=${archivePath}`,

           //let prom = await restore("", "/model/archive/backup-280623.gz");
            {
                const child = spawn("mongorestore", [
                    `--host=${this.onlyURL}`,
                    `--archive=./model/archive/install.gz`,
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

        },
        async IsInitOK()
        {
            let col=this.link.collection('schemeRequest');
            let result;
            try {
                result=await col.findOne({})
            }
            catch {
                (() => {
                    result=null;
                })
            }

            console.log("IsInitOK")
            console.log(result)
            return new Promise((resolve, reject) => {
                if(result!=undefined && result!=null)resolve("ok")
                else resolve(undefined)
            })
        }




    }

exports.dataBaseModel=dataBaseModel;

