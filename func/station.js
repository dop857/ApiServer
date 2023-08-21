const {dataBaseModel: modeldb} = require("../model/mongo");
const {ObjectId} = require("mongodb");
//модуль взаимодействия со станцией опроса
const Station=
    {


    AccesChek(req)
    {

        return true;
    },
    async SessionHandle(req,res)
    {
        if(Station.AccesChek(req))
        {
            stationIsBreakConnection=await Station.IsStationBreakConnection(req)
            if(stationIsBreakConnection || req.body.isFirstSession==true)
            {
                await Station.AddComandFromSystem(Station.ComandStation.verification,"0",req.body.stationId);

            }
            Station.AddActivePoint(req);

            let col=modeldb.link.collection('comand');
            let query=
                {
                    stationId:req.body.stationId,
                    dateCreate:{$ne:"0"},
                    dateSend:0
                };
            col.find(query).project({stationId:1,comand:1}).toArray().then((result)=>
            {


                if(result.length>0)
                {
                    querytextidarray=[];
                    for(let r in result)
                    {
                        querytextidarray.push(new ObjectId(result[r]._id));
                    }
                    query={_id:{$in:querytextidarray}};
                    col.updateMany(query, {$set: {dateSend : Date.now()}})
                    res.status(200).send({comand: result});
                    //console.log("inresul>0");
                    console.log("comand: result");
                    console.log(result);
                }
                else
                {
                    res.sendStatus(204);
                    //console.log("inresul00");
                }
                console.log("Close connection /receiver/station");

                //console.log(result);
            }).catch((e)=>console.log(e));

        }
    },

    async IsStationBreakConnection(req)
    {
        console.log("in IsStationBreakConnection");
        let col=modeldb.link.collection('stationActive');
        //console.log(req.body.stationId);
        let result=true;
        await col.findOne({stationId:req.body.stationId},{sort:{lastActive:-1},projection:{lastActive:1}}).then((r)=>{
            //console.log(r.lastActive);console.log("        ");console.log(req.body.lastActive);
            if(Number(req.body.lastActive)-Number(r.lastActive)>(Number(req.body.interval)*2))
            {
                console.log("in Timeout interval");
                result=true;
            }
            else  result=false;

        }).catch((e)=>console.log(e));

        return result;
    },
    AddActivePoint(req)
    {
        console.log("in AddActivePoint");
        let col=modeldb.link.collection('stationActive');
        //col.insertOne(req.body).then(/*()=>res.sendStatus(200)*/
        delete req.body.isFirstSession;
        col.replaceOne({stationId:req.body.stationId},req.body,{upsert:true}
        ).catch((e) => {            console.log(e)        });
    }
    ,
    ParseModbus(req)
    {
        console.log("inFuncaccesChekStation");
        return true;
    },
    async AddComandFromSystem(comand,parametr=0,stationId)
    {

        let com={};com[comand]=parametr;
        console.log(com);
        com=JSON.stringify(com);
        console.log("IN AddComandFromSystsem"+com+stationId)
        let col=modeldb.link.collection('comand');
        let queryInsert={stationId:stationId, comand:com,dateCreate:Date.now().toString(),dateOK:"0",result:"",dateSend:0,userId:"system"}
        console.log(queryInsert)
        await col.insertOne(queryInsert).catch((e)=>console.log(e));

    },
    async AddComandFromUser(comand,parametr=0,stationId,userId)
    {
        let col=modeldb.link.collection('comand');
        //col.find()
        console.log(parametr);
        let com={};com[comand]=parametr;
        console.log(com);
        com=JSON.stringify(com);
        console.log("IN AddComandFromUser"+com+stationId)
        //col=modeldb.link.collection('comand');
        let dateCreateComand=Date.now().toString();
        await col.insertOne({stationId:stationId, comand:com,dateCreate:dateCreateComand,dateOK:"0",result:"",dateSend:0,userId:userId}).catch((e)=>{console.log(e);return e;});
        return col.findOne({stationId:stationId, comand:com,dateCreate:dateCreateComand},{projection:{_id:1}});
    },
    ComandStation:
    {
        verification:"verification",
        addDevice:"addDevice",
        addOnceProgramPacket:"addOnceProgramPacket",
        addProgram:"addProgram",
        deactivateProgram:"deactivateProgram",
        activateProgram:"activateProgram",
        changeActualProgram:"changeActualProgram",
        updateProgram:"updateProgram"
    }
}
    const device=
    {
        
    }
exports.Station=Station;
