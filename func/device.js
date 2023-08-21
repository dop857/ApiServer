const {dataBaseModel: modeldb} = require("../model/mongo");
const Device=
{
    async GetIdDevicesResultVerification(req)
    {
        console.log("in GetDevicesResultVerification");
        let query={};
        let col=modeldb.link.collection('device');
        if(Object.hasOwn(req.body,"idDevices"))
        {
            if(Object.keys(req.body.idDevices).length>0 )
            {
                let devmas=[];
                for(dev in req.body.idDevices)
                {
                    id=req.body.idDevices[dev];
                    devmas.push({_id:id});

                }
                console.log(devmas);
                //ДОПИСАТЬ!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            }
            else
            {
                res=col.find({placeStation: req.body.stationId},{projection:{_id:1}}).toArray();
                console.log(res);
                return await col.find({placeStation: req.body.stationId},{projection:{_id:1}}).toArray();

            }

            /*let query=
                {
                    stationId:req.body.stationId,
                    dateCreate:{$ne:"0"},
                    dateSend:"0"
                };
            col.find()*/

        }


    }


}
exports.Device=Device;
