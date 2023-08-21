const {dataBaseModel: modeldb} = require("../model/mongo");
const {Access} = require("../func/Access");
const {Constant} = require("../func/Constant");
const {ObjectId} = require("mongodb");
const {Counters} = require("../func/Counters");

//обработка GET запросов
const RouterGet=
{

    Constructor(app,sse)
    {
        app.use((req, res, next) =>
        {
            if (req.params.offset === undefined) req.params.offset = 0;
            if (req.query.offset === undefined) req.query.offset = 0;
            Counters.Add("GetReq");
            next();
        })
        app.get('/events', sse, (req, res) =>
        {
            res.json("event1");

        });
        app.get('/', (req, res) =>
        {
            res.sendFile(process.cwd() + Constant.GetFrontPath());

        });
        app.get('/admin/user', (req, res, next) =>
        {

            let col = modeldb.link.collection('user');
            col.count().then((count) => {
                col.find({}).skip(Number(req.query.offset)).limit(10).toArray().then((resultUser) => {
                    res.send({user: resultUser, offset: req.query.offset, count: count});
                })
            }).catch((e) => {console.log(e);res.send({status: "error", message: e.toString()});});
        });
        app.get('/user/login', (req, res, next) =>
        {
            let user = Access.GetCurrentUser();
            console.log(user);
            user.accessGroup = Constant.accessGroup[user.accessGroupId];
            delete user.accessGroupId;

            let col = modeldb.link.collection('user');
            col.findOne({_id: new ObjectId(user.userId)}, {
                projection: {
                    _id: 0,
                    password: 0,
                    accessGroupId: 0
                }
            }).then((result) => {

                user = Object.assign(user, result);
                user.token = user._id;
                delete user._id;
                res.send({"user": user});
            }).catch((e) => {console.log(e);res.send({status: "error", message: e.toString()});;});

        });
        app.get('/screen', (req, res, next) =>
        {
            let col = modeldb.link.collection('screen');
            c_useriD = Access.GetCurrentUser().userId;
            queryDB = {$or: [{userId: c_useriD}, {accessGroup: {$lte: c_useriD.accessGroupId}}]};
            if (req.query.id != undefined) {
                try {
                    queryDB = {_id: new ObjectId(req.query.id)}
                } catch (e) {
                }
            }

            col.count().then((count) => {
                col.find(queryDB).skip(Number(req.query.offset)).limit(Constant.limitResponse).toArray().then((resultStation) => {
                    res.send({screen: resultStation, offset: req.query.offset, count: count});
                })
            }).catch((e) => {
                console.log(e);
                res.send({status: "error", message: e.toString()});
            });
        });
        app.get('/element', (req, res, next) =>
        {
            let col = modeldb.link.collection('element');
            let queryDB = {};
            console.log(req.query)
            if (req.query.id != undefined) {
                try {
                    queryDB = {_id: new ObjectId(req.query.id)}
                } catch (e) {
                }
            }
            if (req.query.variableType != undefined) {
                queryDB = {typeValue: req.query.variableType};
                console.log(req.query.variableType);
            }
            col.count().then((count) => {
                col.find(queryDB).skip(Number(req.query.offset)).limit(Constant.limitResponse).toArray().then((resultStation) => {
                    res.send({element: resultStation, offset: req.query.offset, count: count});
                })
            }).catch((e) => {
                console.log(e);
                res.send({status: "error", message: e.toString()});
            });
        });
        app.get('/station', (req, res, next) =>
        {
            let col = modeldb.link.collection('station');
            let queryDB = {};
            if (req.query.id != undefined) {
                try {
                    queryDB = {_id: new ObjectId(req.query.id)}
                } catch (e) {
                }
            }
            if(req.query.offset==undefined)req.query.offset=0;
            col.count().then((count) => {
                console.log(" FOR DEBUG IN COUNT")
               // col.find(queryDB).skip(Number(req.query.offset)).limit(Constant.limitResponse).toArray().then((resultStation) => {
                col.find(queryDB).skip(Number(req.query.offset)).limit(Constant.limitResponse).toArray().then((resultStation) => {
                    console.log(" FOR DEBUG IN FIND")
                    res.send({station: resultStation, offset: req.query.offset, count: count});
                })
            }).catch((e) => {
                console.log(e);
                res.send({status: "error", message: e.toString()});
            });
        });
        app.get('/station/lastActive', async (req, res, next) =>
        {

            let col = modeldb.link.collection('stationActive');
            try {
                //rd=await col.deleteMany({});
                //console.log(rd)
                result = await col.findOne({stationId: req.query.id}, {
                    sort: {lastActive: -1},
                    projection: {_id: 0, lastActive: 1, interval: 1}
                })
                if (result != undefined) {
                    if (Date.now() - result.lastActive > (result.interval * 2.5)) result["activeBool"] = 0;
                    else result["activeBool"] = 1;
                    res.send({lastActive: result});
                } else {
                    res.send({lastActive: {activeBool: 0}});
                }
            } catch (e) {
                console.log(e);
                res.send({status: "error", message: e.toString()});
            }


        });
        app.get('/station/device', (req, res, next) =>
        {
            let col = modeldb.link.collection('device');
            col.count().then((count) => {
                col.find({placeStation: req.query.stationId}).skip(Number(req.query.offset)).limit(Constant.limitResponse).toArray().then((resultDevice) => {
                    res.send({devices: resultDevice, offset: req.query.offset, count: count});
                })
            }).catch((e) => {
                console.log(e);
                res.send({status: "error", message: e.toString()});
            });
        });
        app.get('/device', (req, res, next) =>
        {
            let col = modeldb.link.collection('device');
            let queryDB = {nodata: "nodata"};
            //if(req.query.offset==undefined)req.query.offset=0;
            if (req.query.id != undefined) {
                try {
                    queryDB = {_id: new ObjectId(req.query.id)}
                } catch (e) {
                }
            }
            col.count().then((count) => {
                //
                col.find(queryDB).skip(Number(req.query.offset)).limit(Constant.limitResponse).toArray().then((resultpDev) => {
                    console.log(queryDB);
                    console.log(resultpDev);
                    res.send({device: resultpDev, offset: req.query.offset, count: count});
                })
            }).catch((e) => {
                console.log(e);
                res.send({status: "error", message: e.toString()});
            });
        });
        app.get('/device/programPack', (req, res, next) =>
        {
            let col = modeldb.link.collection('programPack');
            //лобавить лимиты
            col.count().then((count) => {
                col.find({deviceId: req.query.deviceId}).skip(Number(req.query.offset)).toArray().then((resultpP) => {
                    res.send({programPack: resultpP, offset: req.query.offset, count: count});
                })
            }).catch((e) => {
                console.log(e);
                res.send({status: "error", message: e.toString()});
            });
        });
        app.get('/programPack', (req, res, next) =>
        {
            let col = modeldb.link.collection('programPack');
            let queryDB = {nodata: "nodata"};
            //if(req.query.offset==undefined)req.query.offset=0;
            if (req.query.id != undefined)
            {
                try
                {
                    queryDB = {_id: new ObjectId(req.query.id)}
                }
                catch (e)
                {

                }
            }
            col.count().then((count) => {
                //
                col.find(queryDB).skip(Number(req.query.offset)).limit(Constant.limitResponse).toArray().then((resultpPP) => {
                    //console.log(queryDB);
                    //console.log(resultpPP);
                    res.send({programPack: resultpPP, offset: req.query.offset, count: count});
                })
            }).catch((e) => {
                console.log(e);
                res.send({status: "error", message: e.toString()});
            });
        });
        app.get('/programPack/archive', (req, res, next) =>
        {
            //period , dateStart, id(programPack)
            let col = modeldb.link.collection('archivePacket');
            let maxDate;
            let minDate;
            if (req.query.period > 0 && req.query.dateStart > 0) {

                minDate = req.query.dateStart;
                maxDate = Number(minDate) + Number(req.query.period);
            } else {
                console.log("in false");
                minDate = Number(Date.now()) - Number(86400000);
                maxDate = Number(Date.now());
            }
         //   console.log(Date.now())
             console.log(minDate)
             console.log(maxDate)
           // console.log(req.query)
            //date: {$lte: Number(maxDate), $gte: Number(minDate)}
            col.find(
                {
                programPackId: req.query.id,
                date: { $gte: Number(minDate),$lte: Number(maxDate)}
            }).toArray().then((result) =>
            {
                 console.log(result);
                if (result.length > 0) {
                    if (req.query.func != undefined) {
                        switch (req.query.func) {
                            case "average":
                                if (req.query.divider != undefined) {
                                    div = req.query.divider;
                                    pLen = result.length;
                                    bufdec = 0;
                                    arr = [];
                                    elem = 0;
                                    bufresult = {};
                                    bufresult[elem] = {"dec": 0};
                                    resmas = [];
                                    count = 0;
                                    //console.log("pLen")
                                    //console.log(pLen)
                                    for (i = 0; i < pLen; i++) {
                                       // console.log(result[i].dec)
                                        bufdec = Number(bufdec) + Number(result[i].dec)
                                        count++;
                                       // console.log("IN % divider" )
                                       // console.log(bufdec)
                                       // console.log(i % div)
                                        if (i % div == Number(div-1)) {
                                            bufresult[elem] = {dec: Math.round(bufdec / count)}
                                            if (elem == 0) bufresult[elem]["date"] = result[0].date;
                                            else bufresult[elem]["date"] = result[i].date;
                                            bufresult[elem]["programPackId"] = result[i].programPackId;
                                            //console.log("IN % divider" )
                                            resmas.push(bufresult[elem])
                                            bufdec = 0;
                                            count = 0;
                                            elem++;
                                        }
                                    }
                                    console.log("AVARAGE")
                                    //console.log(resmas)

                                    res.send({archive: resmas});
                                }
                                break;
                        }
                    }
                    else
                        res.send({archive: result});
                }
                else
                    res.send({status: "error", message: "Not Found"});
            }).catch((e) => {
                console.log(e);
                res.send({status: "error", message: e.toString()});
            })
        });
        app.get('/typeVariable', (req, res, next) =>
        {
            res.send({typeValue: Constant.typeValue});

        });
        app.get('/translator', (req, res, next) =>
        {
            let col = modeldb.link.collection('translator');
            let queryDB = {};
            //if(req.query.offset==undefined)req.query.offset=0;
            if (req.query.context != undefined) {
                try {
                    queryDB = {context: req.query.context}
                } catch (e) {
                }
            }


            col.find(queryDB).toArray().then((resultpTR) => {
                console.log(queryDB);
                console.log(resultpTR);
                res.send({translator: resultpTR});
            }).catch((e) => {
                console.log(e);
                res.send({status: "error", message: e.toString()});
            });


        });
        app.get('/device/error', (req, res, next) =>
        {
            let col = modeldb.link.collection('device');
            let queryDB = {};
            arresult = [];
            //if(req.query.offset==undefined)req.query.offset=0;
            if (req.query.deviceId != undefined) {
                try {
                    queryDB = {"_id": new ObjectId(req.query.deviceId)};
                    //console.log(queryDB)
                } catch (e) {
                    console.log(e)
                }
            }


            col.findOne(queryDB).then(async (dev) => {
                //console.log(dev)
                res.send({errorDevice: dev.deviceCurrentErrors});
            }).catch((e) => {
                console.log(e);
                res.send({status: "error", message: e.toString()});
            });


        });
        app.get('/device/archiveErrors', (req, res, next) =>
        {
            //http://127.0.0.1:80/device/archiveErrors?deviceId=647ea168652edbe984336ebf&limit=100
            let col = modeldb.link.collection('archiveTrig');
            let queryDB
            let maxDate;
            let minDate;
            if (req.query.period > 0 && req.query.dateStart > 0)
            {

                minDate = req.query.dateStart;
                maxDate = Number(minDate) + Number(req.query.period);
            } else
            {
                //console.log("in false");
                minDate = Number(Date.now()) - Number(86400000);
                maxDate = Number(Date.now());
            }
            if (req.query.deviceId != undefined)
            {
                try {
                    if (req.query.period > 0 && req.query.dateStart > 0)
                        queryDB = {deviceId: req.query.deviceId, date: {$lte: Number(maxDate), $gte: Number(minDate)}}
                    else
                        queryDB = {deviceId: req.query.deviceId}
                } catch (e) {
                }
            }
            let limit;
            let offset;
            if (req.query.offset == undefined)offset=  0;
            else offset=req.query.offset;
            if (req.query.limit == undefined) limit = Constant.limitResponse;
            else limit=Number(req.query.limit);
            col.find(queryDB,{sort:{date:-1}}).skip(Number(offset)).limit(limit).toArray().then((resultArch) =>
            {
                res.send({errorArchive: resultArch, offset: req.query.offset});
            }).catch((e) =>
            {

                res.send({status: "error", message: e.toString()});
            });



        });

    }
}
exports.RouterGet=RouterGet;