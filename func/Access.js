//Система проверки уровня доступа запросов
const {dataBaseModel: modeldb} = require("../model/mongo");
const {Errors} = require("./Errors");
const {ObjectId} = require("mongodb");
const CRC32 = require("crc-32");
const {Constant} = require("./Constant");
Access={
    currentUserObject: {},
    CheckAuthorization(app)
    {
        app.use(function access(req, res, next)
        {
           //обработка запросов от станции проверка всегда по хэшу плюс соль
            if(req.path.match(/^\/receiver/))
            {
                let dataString=JSON.stringify(req.body);
                let keyAuthor=CRC32.str(dataString+"mer");
                if(keyAuthor==req.headers.authorization)next();
                if(req.path=='/receiver/station/regNew')next();

            }
            else
            {
                //все остальное
                if(req.headers.authorization==undefined || req.headers.authorization=="null")
                {
                    if((req.path=='/user/login' && req.method=="POST")||(req.path=='/' && req.method=="GET")||(req.path.includes('/static') && req.method=="GET"))
                    {
                         next();
                    }
                    else
                    {
                        console.log("Not author User");
                        res.send(Errors.Show(1001));
                    }


                }
                else//если ключ авторизации присутсвует
                {

                    try
                    {
                        //проверяем по ключу что за юзер его группу и доступен ли запрос для этой группы
                        let idobj=new ObjectId(req.headers.authorization);
                        let isfound=0;
                        let col=modeldb.link.collection('authorization');
                        col.findOne({"_id":idobj}).then((aResult)=>{

                            col=modeldb.link.collection('access');
                            col.find({access:{$gte:Number(aResult.accessGroupId)}}).toArray().then((array)=>
                            {

                                this.Access.currentUserObject=aResult;
                                for(let el in array)
                                {

                                    if(req.path==array[el].entryPoint && req.method==array[el].method)
                                    {
                                        isfound=1;
                                        next();
                                    }
                                }
                                if(isfound == 0)
                                    res.send(Errors.Show(1002));
                            }).catch((e)=>{console.log(e);res.send(Errors.Show(1004));})
                        }).catch((e)=>{
                            console.log(e);
                            res.send(Errors.Show(1004));
                        })
                    }
                    catch (e) {
                        console.log("In ERR OBJID")
                        console.log(e);
                        res.send(Errors.Show(1004));
                    }
                }
            }
        });
    },
    GetCurrentUser()//_id: new ObjectId("6423b227aa99e0ee0aaf6ce1"),userId: new ObjectId("63ff11c247bb8b28752d86da"),accessGroupId: '1',dateBreak: 1680147367000
    {
      return this.currentUserObject;
    }
}
exports.Access=Access;