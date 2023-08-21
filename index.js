const express = require('express');
const app = express();
const Errors = require('./func/Errors').Errors;
const Access = require('./func/Access').Access;
const Constant = require('./func/Constant').Constant;
const longpoll = require("express-longpoll")(app);
const cors=require('cors');
const sse=require('connect-sse')();
const RouterGet = require('./router/get');
const RouterPost = require('./router/post');
const RouterPut = require('./router/put');
const RouterPoll = require('./router/poll');
const fs = require("fs/promises");
const modeldb=require('./model/mongo').dataBaseModel;
const Log = require("./func/LoggerManager").LoggerManager;
const Counters = require("./func/Counters").Counters;

let port ;
let allSystemReady=0;//переменная отслеживания готовности подключения к базе данных

//Раскоментировать для логирования всех исключений в файл
//app.use(express.bodyParser({limit: '50mb'}));
/*process.on('uncaughtException', (err, origin) => {
    fs.writeFile('./logs/'+Date.now()+' errors.log',process.stderr.fd+
        `Caught exception: ${err}\n` +
        `Exception origin: ${origin}`)

});*/

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

async function StartSystem()
{

    //прочитать конфигурацию из файла "listenPort": номер порта,"databaseAddress": ip адрес базы данных,"databasePort": Порт Базы данных,"timeClearLog": время сохранения логов,"frontPath": путь к главному файлу фронта
    await fs.readFile('./config.json', {encoding: 'utf8'}).then(async (filedata) => {
        config = JSON.parse(filedata);
        port = config.listenPort;
        await modeldb.connectMongo(config.databaseAddress, config.databasePort, "scada").then(() => {
            if (modeldb.clientDB == "false")
            {
                console.log("Database Connect Error");
            }
            else
            {
                allSystemReady = 1;
                //инициализация ошибок из базы данных
                Errors.Constructor().then((errors) =>
                {
                    //инициализация констант из базы данных
                    Constant.Constructor().then(() =>
                    {

                        Constant.SetFrontPath(String(config.frontPath));
                        let path = String("./");

                        //Инициализация системы логирования
                        Counters.Construct("GetReq", {autoResetMS: 10000});
                        Counters.Construct("PostReq", {autoResetMS: 10000});
                        Log.Construct(1000, "Server", path, config.timeClearLog);
                        Log.emitter.on("loggerUpdateExe", () => {
                            Log.add(Counters.Get("GetReq"), "GetReq");
                            Log.add(Counters.Get("PostReq"), "PostReq");
                        });

                        //Старт
                        app.listen(port, () => {
                            console.log("Start");
                        });
                    })

                })
            }
        }).catch((e) => {
            console.log(e);
            console.log("CONNECT MONGO ERROR")
        });
    })
    /*
    */
    //если подключение к базе данных присутсвует то происходит роутинг запросов
    if (allSystemReady == 1)
    {
        Access.CheckAuthorization(app);
        RouterGet.RouterGet.Constructor(app, sse);
        RouterPost.RouterPost.Constructor(app);
        RouterPut.RouterPut.Constructor(app);
        RouterPoll.Poll.Constructor(longpoll);
    }
    else
    {
        setTimeout(StartSystem,1000);
    }

}
StartSystem();





