const {MongoClient} = require("mongodb");

const dataBaseModel=
    {
        "clientDB":"false",
        "users_init":"false",
        "errorMessage":"",
        "link":"no",

        async connectMongo(url,port,dbname){
            let MongoClient = require('mongodb').MongoClient;

            try {
                let fullurl='mongodb://'+url+':'+port+'/';
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




    }

exports.dataBaseModel=dataBaseModel;

