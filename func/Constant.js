const {dataBaseModel: modeldb} = require("../model/mongo");
//Все глобальные константы для доступа из любого места приложения
Constant=
{
    accessGroup:{},//груупы уровней доступа
    typeValue:{},//типы дынных
    limitResponse:10,//лимит ответов по умолчанию
    frontPath:"",//приватное поле для хранения пути
    async Constructor()
    {
        let col=modeldb.link.collection('constant');
        let prom;
        prom=await col.findOne({name:"accessGroup"}).then((aResult)=> {
            this.accessGroup=aResult.accessGroup;
        }).catch((error)=>{
            console.log(error)
            modeldb.InitDatabase().then((m)=>{{console.log(m)}}).catch((e)=>{console.log(e)})

        });
        prom=await col.findOne({name:"typeValue"}).then((aResult)=> {
            this.typeValue=aResult.typeValue;
        });
        return prom;
    },
    SetFrontPath(path)//установка пути для главного файла фронта
    {
        this.frontPath=path;
    },
    GetFrontPath(path)//получение пути до главного файла порта
    {
        return this.frontPath;
    }
}
exports.Constant=Constant;