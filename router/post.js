const {dataBaseModel: modeldb} = require("../model/mongo");
const {Station} = require("../func/station");
const {Device} = require("../func/device");
const {ObjectId} = require("mongodb");
const {Errors} = require("../func/Errors");
const {Access} = require("../func/Access");
const {Constant} = require("../func/Constant");
const {Counters} = require("../func/Counters");

const RouterPost= {

    Constructor(app)
    {
        app.use((req, res, next) =>
        {
            Counters.Add("PostReq");
            next();
        })
        app.post('/receiver/station/regNew',(req,res,next)=>
        {
            console.log("IN /receiver/station/regNew NEW STATION CONNECT ")
            let col=modeldb.link.collection('station');
            delete req.body.server;
            delete req.body._id;
            delete req.body.port;
            delete req.body.entryPoint;
            col.insertOne(req.body).then(()=>
            {
                res.send(req.body);
            }).catch((e)=>{console.log(e);res.send({error:e})});
        });

        app.post('/receiver/station',(req,res,next)=>
        {
            //console.log(req.body);
            Station.SessionHandle(req,res);




        });
        app.post('/receiver/device/verification',(req,res,next)=>
        {
            console.log("IN  /// receiver/device/verification")
            console.log(req.body);
            Device.GetIdDevicesResultVerification(req).then(async (r)=>{
                console.log("GetIdDevicesResultVerification");
                console.log(r);
                for(let rr in r)
                {
                    console.log("GetIdDevicesResultVerification FOR RR");
                    console.log(rr);//r[rr] = _id:"535434f34f34f" айди устройства
                    console.log("GetIdDevicesResultVerification FOR R[RR]");
                    console.log(r[rr]);//r[rr] = _id:"535434f34f34f" айди устройства
                    await Station.AddComandFromSystem(Station.ComandStation.addDevice,r[rr],req.body.stationId);
                }
                res.sendStatus(200);

            });



        });
        app.post('/receiver/device',async (req,res,next)=>
        {
            const device={};
            console.log("IN reciver/device");
            console.log(req.body);
            let col=modeldb.link.collection('device');
            let query=
                {
                    //placeStation:req.body.stationId,
                    "_id":new ObjectId(req.body._id)
                };
            console.log(query);
            resultD = await col.find(query).toArray()
            if (resultD.length > 0)
            {
                device["device"]=resultD;
                col=modeldb.link.collection('programPack');
                query=
                    {
                        //placeStation:req.body.stationId,
                        "deviceId":req.body._id,
                        "actual":true
                    };
                console.log(query);
                resultPP=await col.find(query).toArray()

                if (resultPP.length > 0)
                {
                    device["program"]=resultPP;
                    res.send(device);

                }
                else
                {
                    device["program"]={};
                    res.send(device);

                }

            }
            else
            {
                res.status(200).send({status:"Device not found"});
            }


        });
        app.post('/receiver/packet',(req,res,next)=>
        {
            //console.log("in receiver packet");

            //console.log(req.body.currentData)
            let col=modeldb.link.collection('programPack');
            dataSet={"dateLastAnswer":req.body.currentData.date,"lastAnswerDec":req.body.currentData.dec,"lastAnswerBit":req.body.currentData.bit}

            col.updateOne({_id:new ObjectId(req.body.currentData.programPackId)}, {$set:dataSet}, {upsert:false})
                .then(async ()=>
                {
                    dataSet={"connected":"true"}
                    if(req.body.currentData.type=="errorDevice")
                    {
                        console.log(req.body)
                        dataSet["deviceCurrentErrors"]=req.body.deviceCurrentErrors
                        col=modeldb.link.collection('device');
                        col.updateOne({_id:new ObjectId(req.body.deviceId)},{$set:dataSet},{upsert:false})
                    }



                    if(req.body.currentData.type=="programCycl")
                    {
                        //console.log("IN PACKET INSERT ARCHIVE programCycl")
                        //console.log(req.body)
                        if(req.body.archiveRecord=="true")
                        {
                            col=modeldb.link.collection('archivePacket');
                            col.insertOne(req.body.currentData).then(()=> {
                               // console.log("IN PACKET INSERT ARCHIVE archiveRecord")
                                res.status(200).send({status:"ok"});
                            });
                        }
                        else
                        {
                            res.status(200).send({status:"ok"});
                        }
                    }
                    if(req.body.currentData.type=="errorDevice")
                    {
                        console.log(req.body)
                        if(req.body.currentData.buferrors!=undefined)
                        {
                            if(Object.keys(req.body.currentData.buferrors).length>0)
                            {
                                dateInsertMas=[]
                                for(er in req.body.currentData.buferrors)
                                {
                                    curEr=req.body.currentData.buferrors[er];
                                    dataInsert=curEr;
                                    dataInsert["deviceId"]=req.body.deviceId;
                                    dataInsert["date"]=req.body.currentData.date;
                                    dateInsertMas.push(dataInsert);

                                }
                                col=modeldb.link.collection('archiveTrig');
                                console.log(dateInsertMas)
                                col.insertMany(dateInsertMas).then(()=> {
                                    res.status(200).send({status:"ok"});
                                });
                            }
                            else
                                res.status(200).send({status:"ok"});
                        }
                        else
                            res.status(200).send({status:"ok"});

                    }






                }).catch((e) =>
            {            console.log(e);res.send({status:"error",message:e});        });

        });
        app.post('/receiver/bigPacket',(req,res,next)=>
        {
           //console.log(req.body)
            let col=modeldb.link.collection('programPack');
            let colArch=modeldb.link.collection('archivePacket');
            let colDevice=modeldb.link.collection('device');
            let colArchTrig=modeldb.link.collection('archiveTrig');
            if(req.body.pp!=undefined)
            {
                for(p in req.body.pp)
                {
                    let pp=req.body.pp[p];
                    dataSet={"dateLastAnswer":req.body.date,"lastAnswerDec":pp.lastAnswerDec,"lastAnswerBit":pp.lastAnswerBit}
                    col.updateOne({_id:new ObjectId(p)}, {$set:dataSet}, {upsert:false})
                    if(pp.archive==true)
                    {
                        console.log('\x1b[41m%s\x1b[0m', 'IN ARCVIVE RECIVE');
                        dataInsert={"type":pp.type,"programPackId":p,"date":req.body.date,"dec":pp.lastAnswerDec,"bit":pp.lastAnswerBit}
                        colArch.insertOne(dataInsert);
                    }
                }
            }


            if(req.body.buferrors!=undefined)
            {
                if(req.body.buferrors.length>0)
                {
                    dateInsertMas=[]
                    for(er in req.body.buferrors)
                    {
                        curEr=req.body.buferrors[er];
                        dataInsert=curEr;
                        dataInsert["deviceId"]=req.body.deviceId;
                        dataInsert["date"]=req.body.date;
                        dateInsertMas.push(dataInsert);

                    }

                    console.log(dateInsertMas)
                    colArchTrig.insertMany(dateInsertMas);

                }
               // else
                    //res.status(200).send({status:"ok"});
            }
            //else
              //  res.status(200).send({status:"ok"});
            if(req.body.deviceCurrentErrors!=undefined)
            {
                console.log('\x1b[42m%s\x1b[0m', 'IN deviceCurrentErrors RECIVE');
                console.log(req.body.deviceCurrentErrors);


                    let dataSet={}
                    dataSet["deviceCurrentErrors"]=req.body.deviceCurrentErrors

                    colDevice.updateOne({_id:new ObjectId(req.body.deviceId)},{$set:dataSet},{upsert:false})

            }


            res.send({result:"OK"});
        });
        app.post('/receiver/getProgram',(req,res,next)=>
        {
            //id program
            let col=modeldb.link.collection('programPack');
            col.findOne({_id:new ObjectId(req.body._id)}).then((result)=>{
                res.send({programPack:result});
            }).catch((e)=>{console.log(e);res.send({status:"error",message:e.toString()});})
        });
        app.post('/receiver/error',(req,res,next)=>
        {
            console.log("IN receiver ERRORS")
            console.log(req.body);

            let col=modeldb.link.collection('device');
            col=modeldb.link.collection('device');
            if(req.body.error=="error Device Close Socket")
            {
                col.updateOne({_id:new ObjectId(req.body._id)},{$set:{"connected":"false"}},{upsert:false}).then(()=> {
                    col=modeldb.link.collection('error');
                    col.insertOne({deviceId:req.body._id,message:req.body.error,date:req.body.date}).then(()=>{
                        res.status(200).send({status:"ok"});
                    }).catch((er)=>{console.log("IN receiver ERRORS" + er);res.status(200).send({status:"error"});})

                })

            }
            else
            {
                res.status(200).send({status:"ok"});
            }



        });

        /*app.post('/station/device/add',(req,res,next)=>
        {
            //placeStation,userId,ip,port,name,programPackets{1:}packet,p
            let parametr={deviceId:req.body.deviceId,packet:req.body.packet};
            Station.AddComandFromUser(Station.ComandStation.addOnceProgramPacket,parametr,req.body.stationId,req.body.userId).then((id)=>
            {
                res.send({commandId:id});

            }).catch((e)=>console.log("ERROR station/command/add "+e));


        });*/
        app.post('/station/device/addOnceProgramPacket',(req,res,next)=>
        {
            //stationId,userId,deviceId,packet

            modeldb.VerificationRequestScheme(req.body,"/station/device/addProgram").then(()=>
            {
                let parametr={deviceId:req.body.deviceId,packet:req.body.packet};
                //console.log("/station/command/addOnceProgramPacket   "+req.body);
                //console.log(req.body);
                Station.AddComandFromUser(Station.ComandStation.addOnceProgramPacket,parametr,req.body.stationId,req.body.userId).then((id)=>
                {
                    res.send({commandId:id});

                }).catch((e)=>console.log("ERROR station/command/add "+e));
             }).catch((e)=>{console.log(e);res.send(Errors.Show(9001,e));});

        });



       /*app.post('/station',(req,res,next)=>
        {
            let col=modeldb.link.collection('station');

            col.findOne({}).then((result)=>{
                res.send({station:result});
            }).catch((e)=>{console.log(e);res.send({status:"error",message:e.toString()});})
        });*/
        app.post('/station/device/addProgram',(req,res,next)=>
        {
            //stationId,userId,deviceId,nameData,typeData,units,variableType,periodArchive,periodTime,message
            let col=modeldb.link.collection('programPack');
            modeldb.VerificationRequestScheme(req.body,"/station/device/addProgram").then(()=>
            {
                col.findOne({message:req.body.message}).then((messageresult)=>{
                    if(messageresult==null)
                    {
                        col=modeldb.link.collection('programPack');
                        req.body["actual"]=true;
                        col.insertOne(req.body).then(()=>
                        {
                            //дать команду станции опроса на верификацию или дать команду станции опроса на добавление программы
                            Station.AddComandFromUser(Station.ComandStation.addProgram,req.body._id,req.body.stationId,req.body.userId).then(()=>
                            {
                                res.status(200).send({status:"ok"});
                            }).catch((e)=>{console.log(e);res.send({status:"error",message:e.toString()});});


                        }).catch((e) =>
                        { console.log(e);res.send({status:"error",message:e.toString()});        });
                    }
                    else
                    {
                        res.send(Errors.Show(2001));
                    }
                }).catch(()=>{res.send(Errors.Show(2001));  });

            }).catch((e)=>{console.log(e);res.send(Errors.Show(9001,e));});

        });
        app.post('/programPack/setActualState',(req,res,next)=>
        {
            let col=modeldb.link.collection('programPack');
            modeldb.VerificationRequestScheme(req.body,"/programPack/setActualState").then(()=>
            {

                col.updateOne({_id:new ObjectId(req.body.programPackId)},{$set:{actual:req.body.actual}}).then(()=>{
                        console.log("IN set Actual ")
                        Station.AddComandFromSystem(Station.ComandStation.changeActualProgram,{programPackId:req.body.programPackId,deviceId:req.body.deviceId,actual:req.body.actual},req.body.stationId);
                        res.send("OK");




                })


            }).catch((e)=>{console.log(e);res.send(Errors.Show(9001,e));});

            /*
            let col=modeldb.link.collection('programPack');
            modeldb.VerificationRequestScheme(req.body,"/station/device/addProgram").then(()=>
            {
                col.replaceOne({_id:new ObjectId(req.body)}).then((messageresult)=>{

                }).catch(()=>{res.send({status:"error",message:"Program is allready exist"});  });

            }).catch((e)=>{console.log(e);res.send({status:"error",message:e.toString()});});

            */




        });
        app.post('/programPack/setTiming',(req,res,next)=>
        {
            console.log(req);
            let col=modeldb.link.collection('programPack');
            modeldb.VerificationRequestScheme(req.body,"/programPack/setTiming").then(()=>
            {

                col.updateOne({_id:new ObjectId(req.body.programPackId)},{$set:{periodArchive:req.body.periodArchive,periodTime:req.body.periodTime}}).then(()=>{
                    console.log("IN set setTiming ")
                    Station.AddComandFromSystem(Station.ComandStation.updateProgram,{programPackId:req.body.programPackId,deviceId:req.body.deviceId},req.body.stationId);
                    res.send("OK");




                })


            }).catch((e)=>{console.log(e);res.send(Errors.Show(9001,e));});






        });
        app.post('/station/command/addOnceProgramPacket',(req,res,next)=>
        {
            //stationId,userId,deviceId,packet
            let parametr={deviceId:req.body.deviceId,packet:req.body.packet};
            console.log("/station/command/addOnceProgramPacket   "+req.body);
            console.log(req.body);
            Station.AddComandFromUser(Station.ComandStation.addOnceProgramPacket,parametr,req.body.stationId,req.body.userId).then((id)=>
            {
                res.send({commandId:id});

            }).catch((e)=>console.log("ERROR station/command/add "+e));


        });
        app.post('/sendNumberToDevice',(req,res,next)=>
        {
            console.log(" IN /sendNumberToDevice")

            modeldb.VerificationRequestScheme(req.body,"/sendNumberToDevice").then(async ()=>
            {

                let col = modeldb.link.collection('programPack');
                let queryDB={nodata:"nodata"};
                //if(req.query.offset==undefined)req.query.offset=0;

                try{queryDB={_id:new ObjectId(req.body.programPackId)}}
                catch (e) { }


                    //
                try
                {
                    resultpPP = await col.findOne(queryDB);
                    console.log(resultpPP)
                }
                catch (e) { console.log(e);res.send({status: "error", message: e.toString()});}





                try{queryDB={_id:new ObjectId(resultpPP.deviceId)}}
                catch (e) { }
                //chek number for send
                number=req.body.number;
                typeVarible=resultpPP.variableType;
                message=resultpPP.message;

                //number=number.match(/[0-9,-]/i);
                numhex=false;

                if(Number(number)!=NaN)
                {
                    if(Mathem.CheckNumberVariableType(number,typeVarible)==true)
                    {
                        switch (typeVarible)
                        {
                            case Constant.typeValue.Uint16.name:
                                numhex=Mathem.decU2hex(number,Constant.typeValue.Uint16.signed)
                                message=message.replace(/....$/i,numhex);
                                console.log(message)
                                break;
                            case Constant.typeValue.Int16.name:
                                //numhex=Mathem.decS2hex(number,Constant.typeValue.Uint16.signed)
                                break;
                        }
                    }



                }
                else
                {
                   // res.send(Errors.Show(9001));
                }
                if(numhex!==false)
                {
                    console.log("IN SEND DEVICE")
                    console.log(numhex)
                    let parametr={deviceId:resultpPP.deviceId,packet:message};
                    Station.AddComandFromUser(Station.ComandStation.addOnceProgramPacket,parametr,resultpPP.stationId,Access.GetCurrentUser()).then((id)=>
                    {
                        res.send({commandId:id});

                    }).catch((e)=>console.log("ERROR station/command/add "+e));
                    //res.send({status:"OK"});
                }
                else
                {
                    res.send(Errors.Show(9002));
                }

            }).catch((e)=>{console.log(e);res.send(Errors.Show(9001,e));});

        })
        app.post('/programPackArray',(req,res,next)=>
        {
            let col=modeldb.link.collection('programPack');
            //console.log(req.body);
            let reqmasPP=[];
            if(req.body.programPack!=undefined)
            {
                for (i = 0; i < req.body.programPack.length; i++) {
                    reqmasPP.push(new ObjectId(req.body.programPack[i]))
                }
            }

            let reqmasD=[];
            if(req.body.device!=undefined)
            {
                for(i=0;i<req.body.device.length;i++)
                {
                    reqmasD.push(new ObjectId(req.body.device[i]))
                }
            }



            col.find({_id:{$in:reqmasPP}},{projection:{lastAnswerDec: 1}}).toArray().then((resultPP)=>
            {
                //console.log(reqmasPP)
                //console.log(resultPP)


                let orderedResults;
                if(req.body.programPack!=undefined)
                {
                    orderedResults = reqmasPP.map(function(id) {
                    return resultPP.find(function(document) {
                        return document._id.equals(id);
                    });
                });
                }
                if(req.body.device!=undefined)
                {
                    col = modeldb.link.collection('device');
                    col.find({_id: {$in: reqmasD}}, {projection: {connected: 1}}).toArray().then((resultD) => {
                        res.send({p: orderedResults, d: resultD})
                    })
                }
                else
                {
                    res.send({p: orderedResults})
                }


            }).catch((e)=>{console.log(e);res.send(e);});
            //res.send({status:"OK"})
        })
        app.post('/user/login',(req,res,next)=>
        {
            //stationId,userId,deviceId,packet
            let col=modeldb.link.collection('user');
            modeldb.VerificationRequestScheme(req.body,"/user/login").then(()=>
            {
                console.log(req.body.login);
                console.log(req.body.password);
                col.findOne({login:req.body.login,password:req.body.password}).then((result)=>{
                    if(result!=null)
                    {
                        col=modeldb.link.collection('authorization');
                        let datebreak=new Date();

                        datebreak.setDate(datebreak.getDate()+1);
                        col.insertOne({"userId":result._id,"accessGroupId":result.accessGroupId,"dateBreak":Date.parse(datebreak)}).then((result)=>{
                            res.send({authorToken:result.insertedId});
                        })
                    }
                    else
                    {
                        res.send(Errors.Show(1003));
                    }

                }).catch((e)=>{console.log(e);res.send(Errors.Show(1003));});
            }).catch((e)=>{console.log(e);res.send(Errors.Show(9001,e));});


        });
        app.post('/admin/user/add',(req,res,next)=>
        {
            let col=modeldb.link.collection('user');
            modeldb.VerificationRequestScheme(req.body,"/admin/user/add").then(()=>
            {
                if(Number(Access.GetCurrentUser().accessGroupId)<2 && Number(req.body.accessGroupId)!=1)//Если уровень текущего пользователя это администратор или рут и создается не рут
                {
                    col.findOne({login:req.body.login}).then((resultLogin)=>{
                        if(resultLogin==null)
                        {
                            col.insertOne(req.body).then(()=>{
                                delete req.body.password;
                                req.body.accessGroup=Constant.accessGroup[req.body.accessGroupId];
                                delete req.body.accessGroupId;
                                res.send({user:req.body});
                            });

                        }
                        else
                        {
                            res.send(Errors.Show(5001));
                        }
                    })
                }
                else
                {
                    res.send(Errors.Show(1005));
                }

            }).catch((e)=>{console.log(e);res.send(Errors.Show(9001,e));});
        });
        app.post('/screen',(req,res,next)=>{
            let col=modeldb.link.collection('screen');
            /*modeldb.VerificationRequestScheme(req.body,"/screen").then(()=> {

            });*/
            col.insertOne({code:req.body.code,preImage:req.body.preImage,name:req.body.name}).then(()=>{
                res.send("OK");
            }).catch((e)=>{console.log(e);res.send(e);});
        });
        app.post('/clear',(req,res,next)=>{
            let col
            if(req.body.p=="da" && req.body.colection!=undefined)
            {
                col=modeldb.link.collection(req.body.colection);
                col.deleteMany({}).then(()=>{
                    res.send("OK");
                })
            }
            else
            res.send("ERROR");

        });
        app.post('/test/:id',(req,res,next)=>
        {
            //stationId,userId,deviceId,packet
            console.log(req.params);
            console.log(req.body);
            res.send(req.params.id);


        });



    }
}
exports.RouterPost=RouterPost;