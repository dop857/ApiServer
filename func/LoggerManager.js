const fs=require("fs/promises");
const Emitter = require("events");
const {Counters} = require("./Counters");


//Логгирование. Конструктор запускает интервал обновления записей логирования по веремени timeUpdate, timeClear  определяет время хранения, по пути path создается дерево папок и фалов распределенных по дате и времени
const LoggerManager=
{
   // Name:"",
    timeUpdate:"",
    emitter:"",
    path:"",
    data: {},
    timeClear:"",
    Construct(timeUpdate,name="",path,timeClear)
    {
        //this.Name=name;
        this.path=path;
        this.emitter=new Emitter();
        this.timeClear=timeClear;
        this.emitter.on("loggerUpdateExe",this.RecordData);
        setInterval(this.UpdateData,timeUpdate);
    },
    UpdateData()//приватная
    {
        LoggerManager.ClearHandler();
        LoggerManager.emitter.emit("loggerUpdateExe");
    },
    async RecordData()//приватная. Записывает данные в файл
    {

        let date=new Date(Date.now());
        let datepath=String(("0" + (date.getMonth() + 1)).slice(-2))+String(date.getFullYear());
        let dateday=String(("0" + (date.getDate() )).slice(-2));
        let data=date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+JSON.stringify(LoggerManager.data)+";\r\n";
        await fs.access(LoggerManager.path+'/logs/'  + datepath +'/'+ dateday+'.log',fs.constants.F_OK).catch(async ()=>{
            await LoggerManager.CreateFolders();
            await LoggerManager.AddDataToFirstFile();
        })


       fs.appendFile(LoggerManager.path+'/logs/'  + datepath +'/'+ dateday+'.log', data).then()
            .catch(async()=>
            {
               fs.writeFile(LoggerManager.path+'/logs/' +  datepath +'/'+ dateday+'.log', data).then()
            })
    },
    add(data,tagName)//добавить данные data в логи по разновидности данных tagName
    {
        LoggerManager.data[tagName]=data;
    },
    ClearHandler()//приватная. удаление папок и файлов вне диапазона времени хранения (очистка)
    {
        const resultRegex=LoggerManager.timeClear.match(/(\d*)(\S*)/g);
        const numberTime=resultRegex[0];
        const textTime=resultRegex[2];
        let period=1000*60*60*24*1;
        switch (textTime)
        {
            case "Month":
                period= 1000*60*60*24*30*Number(numberTime);
            break;
            case "Day":
                period= 1000*60*60*24*Number(numberTime);
            break;
        }
        const compareDate=Date.now()-period;
        fs.readFile(LoggerManager.path+'/logs/data.log','utf8').then((dataFile)=>
        {
            let allLines=dataFile.split('\r\n');
            let line = allLines[0];
            let lineJSON=JSON.parse(line)
            if(lineJSON.timestamp<=compareDate)
            {
                resultStringForRecord=dataFile.substring(line.length+2);
                fs.rm(LoggerManager.path+'/logs/' +  lineJSON.datepath +'/'+ lineJSON.dateday+'.log').then();
                fs.writeFile(LoggerManager.path+'/logs/data.log',resultStringForRecord).then();
            }
            //console.log(line)
        }).catch((e)=>{console.log(e)})
    },
    async CreateFolders()//приватная. создает структуру папок
    {
        let date=new Date(Date.now());
        let datepath=String(("0" + (date.getMonth() + 1)).slice(-2))+String(date.getFullYear());
        let dateday=String(("0" + (date.getDate() )).slice(-2));
        await fs.mkdir(LoggerManager.path+'/logs/' +   datepath,{ recursive: true } );


    },
    async AddDataToFirstFile()//приватная. добавить данные в файл о существующих логах для быстрого отслеживания и поиска просроченных данных
    {
        let date=new Date(Date.now());
        let datepath=String(("0" + (date.getMonth() + 1)).slice(-2))+String(date.getFullYear());
        let dateday=String(("0" + (date.getDate() )).slice(-2));
        datarecord={"datepath":datepath,"dateday":dateday,"timestamp":Date.now()}
        await fs.appendFile(LoggerManager.path+'/logs/data.log',JSON.stringify(datarecord)+"\r\n").catch(()=>{
            fs.writeFile(LoggerManager.path+'/logs/data.log',JSON.stringify(datarecord)+"\r\n").then();
        });
    }

}
module.exports.LoggerManager=LoggerManager;