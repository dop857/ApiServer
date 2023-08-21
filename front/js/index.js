DOM=
    {
        lastClickTarget: "",
        interrelatedElements: [],
        elementForMouseMove: "",
        captureElement: "",
        currentInterrelatedElement:"",
        bufferforprestyle:"",


        Init() {
                CANVAS.Init();
                document.addEventListener("click", async (event) => {
                console.log(DOM)

                if (this.CheckChangeEventElement(event.target)) this.HideUnUseElements(event);
                this.lastClickTarget = event.target;
                if (this.elementForMouseMove != "" && event.target.id != this.elementForMouseMove.id) {

                    this.elementForMouseMove.remove();
                    this.elementForMouseMove = "";
                }
                this.AddCapteredElementToScreenBlock(event);
                if (event.target.className=="programsBlock" || event.target.parentElement.className == "programsBlock")
                {
                    console.log("IN TRUE CHEK IS PROGRAm LIST CLICK")
                    DOM.FindParentClassName(event.target,"popupMenuMainBody").style.display="none";

                    DOM.FindParentClassName(event.target,"programsBlock").style.outline="solid 1px black"
                    this.currentInterrelatedElement=DOM.FindParentClassName(event.target,"programsBlock");
                    let menuElemets=document.getElementById("menuElemets");
                    console.log(menuElemets)
                    console.log(this.currentInterrelatedElement.id)
                    console.log(SDK.programPacks)
                    for(dev in SDK.programPacks)
                    {
                        console.log(SDK.programPacks[dev])
                        for(prog in SDK.programPacks[dev])
                        {
                            if(SDK.programPacks[dev][prog]._id==this.currentInterrelatedElement.id)
                            {
                                document.querySelector(".popupMenuMainButton").innerHTML=""+SDK.programPacks[dev][prog].nameData+ " - "+SDK.programPacks[dev][prog].message
                                console.log(SDK.programPacks[dev][prog].message)
                            }
                        }
                    }
                    //console.log(SDK.programPacks.forEach(program=>{program.forEach(prog=>{if(prog._id==this.currentInterrelatedElement.id)console.log(prog.message)})}))
                    DOM.AddInterrelatedElements(this.currentInterrelatedElement,menuElemets);
                    menuElemets.style.display="block";

                }
                await this.EventIdHandler(event);
                await this.EventClassHandler(event);







            })
            document.addEventListener("mousemove", (event) => {
                this.MoveCapturedElement(event);
            })
        },
        async EventIdHandler(event)
        {
            switch (event.target.id) {
                case "archive1h"://Выбран пункт меню построения графика за 1 час
                    period=3600*1000;
                    datestart=Date.now()-period;
                    archiveData=await SDK.GetArchiveData(period,datestart);
                    if(archiveData.archive!=undefined)await SDK.ShowGraphScreen(archiveData.archive);
                    break;
                case "archive1d"://Выбран пункт меню построения графика за 1 день
                    period=24*3600*1000;
                    datestart=Date.now()-period;
                    archiveData=await SDK.GetArchiveData(period,datestart);
                    if(archiveData.archive!=undefined)await SDK.ShowGraphScreen(archiveData.archive);
                    break;
                case "archive1m"://Выбран пункт меню построения графика за 1 месяц
                    period=30*24*3600*1000;
                    datestart=Date.now()-period;
                    archiveData=await SDK.GetArchiveData(period,datestart);
                    if(archiveData.archive!=undefined)await SDK.ShowGraphScreen(archiveData.archive);
                    break;

                case "archiveCustom":
                    document.getElementById("archiveCustomDialogBox").style.display="block"
                    break;
                case "closeButtonCanvas":
                    clearTimeout(CANVAS.shoulder);
                    document.getElementById("canvasWithMenu").style.display="none";
                    break;

                case "addProgramPackInDeviceButtonSend":
                    if(await SDK.AddNewProgramPackToDevice()==0)
                        DOM.FindParentClassName(event.target,"fullscreenDialogBox").style.display="none"

                    break;
                case "archiveCustomButtonSend"://диалог ручного ввода даты построения графика
                    windowEl=DOM.FindParentClassName(event.target,"fullscreenDialogBoxWindow");
                    dateStart=windowEl.querySelector("input[name='dateStart']").value
                    dateEnd=windowEl.querySelector("input[name='dateEnd']").value
                    console.log("archive Custom  ButtonSend")
                    if(dateStart.length>0 && dateEnd.length>0 )
                    {
                        dateST=Date.parse(dateStart)
                        dateEND=Date.parse(dateEnd);
                        if(dateST<dateEND)
                        {
                            period=Number(dateEND)-Number(dateST);
                            archiveData=await SDK.GetArchiveData(period,dateST);
                            if(archiveData.archive!=undefined)await SDK.ShowGraphScreen(archiveData.archive);
                        }
                        else
                        {
                            console.log("ERROR DIALOG BOX")
                        }

                    }
                    else
                    {
                        console.log("ERROR DIALOG BOX")
                    }

                    break;
                case "ccPPEnable":
                    currentProg=this.interrelatedElements["0"].initElement;
                    programPack=await fetcher(SDK.serverUrlPort,"/programPack?id="+currentProg.id,"GET",)
                    console.log(programPack)
                    programPack=programPack.programPack[0];
                    data={programPackId:programPack._id,deviceId:programPack.deviceId,stationId:programPack.stationId,actual:true}
                    console.log(data)
                    fetcher(SDK.serverUrlPort,"/programPack/setActualState","POST",JSON.stringify(data))

                break;
                case "ccPPDisable":
                    currentProg=this.interrelatedElements["0"].initElement;
                    programPack=await fetcher(SDK.serverUrlPort,"/programPack?id="+currentProg.id,"GET",)
                    console.log(programPack)
                    programPack=programPack.programPack[0];
                    data={programPackId:programPack._id,deviceId:programPack.deviceId,stationId:programPack.stationId,actual:false}
                    console.log(data)
                    fetcher(SDK.serverUrlPort,"/programPack/setActualState","POST",JSON.stringify(data))
                break;
                case "ccPPTime":
                    dialogBox=document.getElementById("PPChangeTimeBox")
                    dialogBox.style.display="block";
                    currentProg=this.interrelatedElements["0"].initElement;
                    programPack=await fetcher(SDK.serverUrlPort,"/programPack?id="+currentProg.id,"GET",)
                    programPack=programPack.programPack[0];
                    dialogBox.querySelector("input[name='periodArchive']").value=programPack.periodArchive;
                    dialogBox.querySelector("input[name='periodTime']").value=programPack.periodTime;
                    ppid=dialogBox.querySelector("#ppId")
                    ppid.innerHTML="Настройка ТЭГа<br>"+programPack._id;
                    ppid.setAttribute("ppid",programPack._id)
                    ppid.setAttribute("deviceId",programPack.deviceId)
                    ppid.setAttribute("stationId",programPack.stationId)
                break;
                case "PPChangeTimeBoxButtonSend":
                    windowEl=DOM.FindParentClassName(event.target,"fullscreenDialogBoxWindow");
                    ppid=windowEl.querySelector("#ppId");
                    progid=ppid.getAttribute("ppid");
                    progdeviceId=ppid.getAttribute("deviceId");
                     progstationId=ppid.getAttribute("stationId");
                    periodArchive=windowEl.querySelector("input[name='periodArchive']").value;
                    periodTime=windowEl.querySelector("input[name='periodTime']").value;
                    data={"programPackId":progid,deviceId:progdeviceId,stationId:progstationId,"periodArchive":periodArchive,"periodTime":periodTime}
                    fetcher(SDK.serverUrlPort,"/programPack/setTiming","POST",JSON.stringify(data))
                break;
            }
        },
        async EventClassHandler(event)
        {
            switch (event.target.className || event.target.parentElement.className)
            {
                case "popupMenuMainButton":
                    console.log("IN popupMenuMainButton")
                    console.log(event.target)
                    console.log(document.querySelector(".popupMenuMainBody").style.display)
                    switch (document.querySelector(".popupMenuMainBody").style.display)
                    {
                        case "none":
                            console.log("IN DISPLAY NONE")
                            document.querySelector(".popupMenuMainBody").style.display="block";
                            document.querySelector(".popupMenuMainButton").innerHTML="Отмена"
                            document.querySelectorAll(".popupMenuElement").forEach(el=>{console.log("IN FOARECH");console.log(el);el.style.display="block"})

                            break;
                        case "block":
                            document.querySelector(".popupMenuMainBody").style.display="none";
                            document.querySelector(".popupMenuMainButton").innerHTML="Создать элемент"
                            //document.querySelectorAll(".popupMenuElement").forEach(el=>{console.log("IN FOARECH");console.log(el);el.style.display="block"})

                            break;

                    }


                    break;
                case "popupMenuElement":
                    console.log("IN popupMenuElement")
                    event.target.querySelectorAll(".popupMenuElementDevice").forEach(el=>{console.log("IN FOARECH");console.log(el);el.style.display="block"})
                    break;
                case "popupMenuElementDevice":
                    console.log("IN popupMenuElement")
                    event.target.querySelectorAll(".programsList").forEach(el=>{console.log("IN FOARECH");console.log(el);el.style.display="block"})
                    break;
                case "programsList":
                    console.log("IN popupMenuElement")
                    event.target.querySelectorAll(".programsBlock").forEach(el=>{console.log("IN FOARECH");console.log(el);el.style.display="block"})
                    break;
                case "closeDialog"://кнопка закрытия всплывающего окна
                    DOM.FindParentClassName(event.target,"fullscreenDialogBox").style.display="none"
                    break;
                case "addProgramPackRightMenuButton"://
                    document.querySelector("#addProgramPackInDevice").style.display="block"
                    break;
                case "searchStationForDialog"://
                    parent=event.target.parentElement;
                    list=event.target.parentElement.querySelector(".popupList");
                    for(station in SDK.stations)
                    {
                        st=SDK.stations[station];
                        el=DOM.CreateElement("div",st._id,"popupListElement","",list)
                        el.innerHTML=st.name+" "+st.company+" "+st.placeName;

                        el.addEventListener("click",(event)=>{
                            inp=parent.querySelector("input")
                            inp.value=event.target.innerHTML;
                            inp.setAttribute("stationId",event.target.id)
                            popList=DOM.FindParentClassName(event.target,"popupList");

                            while (popList.children.length>0)
                            {
                                popList.children[0].remove();
                            }
                        })
                    }

                    break;
                case "searchDeviceForDialog"://
                    if(document.querySelector('input[name="station"]').value.length>0)
                    {
                        stId=document.querySelector('input[name="station"]').getAttribute("stationId");
                        parent=event.target.parentElement;
                        list=event.target.parentElement.querySelector(".popupList");
                        for(device in SDK.devices[stId])
                        {
                            dev=SDK.devices[stId][device];
                            el=DOM.CreateElement("div",dev._id,"popupListElement","",list)
                            el.innerHTML=dev.name+" "+dev.ip+" "+dev.port;

                            el.addEventListener("click",(event)=>{
                                inp=parent.querySelector("input")
                                inp.value=event.target.innerHTML;
                                inp.setAttribute("deviceId",event.target.id)
                                popList=DOM.FindParentClassName(event.target,"popupList");

                                while (popList.children.length>0)
                                {
                                    popList.children[0].remove();
                                }
                            })
                        }
                    }



                    break;
                case "searchTypeVariableForDialog"://

                    typesValue=await fetcher(SDK.serverUrlPort,"/typeVariable","GET",);
                    typesValue=typesValue.typeValue;
                    console.log(typesValue)

                    parent=event.target.parentElement;
                    list=event.target.parentElement.querySelector(".popupList");
                    list.style.top="250px";
                    for(type in typesValue)
                    {
                        ty=typesValue[type];
                        el=DOM.CreateElement("div",ty.name,"popupListElement","",list)

                        el.innerHTML=ty.name;
                        el.addEventListener("click",(event)=>{
                            inp=parent.querySelector("input")
                            inp.value=event.target.innerHTML;
                            inp.setAttribute("typeVariable",event.target.id)
                            popList=DOM.FindParentClassName(event.target,"popupList");

                            while (popList.children.length>0)
                            {
                                popList.children[0].remove();
                            }
                        })
                    }




                    break;
                case "stationControlCenterRightMenuButton":
                    console.log(SDK.currentUser)
                    if(SDK.currentUser.user.accessGroup=="root" || SDK.currentUser.user.accessGroup=="admin" || SDK.currentUser.user.accessGroup=="engineer")
                    {
                        await ViewStationControlCenter();
                        LOGIC.RightNavMenu(LOGIC.rightNavMenuStates.INSTATIONCONTROLCENTER);
                    }
                    break;
                case "screenMakerRightMenuButton":
                    console.log(SDK.currentUser)
                    if(SDK.currentUser.user.accessGroup=="root" || SDK.currentUser.user.accessGroup=="admin" || SDK.currentUser.user.accessGroup=="engineer")
                    {
                        await AdminHandler();
                        LOGIC.RightNavMenu(LOGIC.rightNavMenuStates.INSCREENMAKER);
                    }
                    break;
                case "ccPP":
                    console.log("IN CCPP")
                    if(document.getElementById("ccPPMenu").style.display=="none")
                    {
                        menu=document.getElementById("ccPPMenu")
                        menu.style='display: block; position: absolute;z-index:3';
                        console.log(event)
                        menu.style.top=event.pageY+"px";
                        menu.style.left=event.x+"px";
                        DOM.AddInterrelatedElements(DOM.FindParentClassName(event.target,"ccPP"),document.getElementById("ccPPMenu"))

                    }

                    //else document.getElementById("ccPPMenu").style.display="none"
                    break;
            }
        },
        CreateElement(tag, id, classs, style, parent) {
            let element = document.createElement(tag);
            element.setAttribute('id', id);
            element.setAttribute('class', classs);
            element.setAttribute('style', style);
            parent.appendChild(element);
            return element;
        },
        CheckChangeEventElement(target) {
            if (this.lastClickTarget != target) return true;
            else return false;
        },
        AddInterrelatedElements(initElement, dependentElement) {
            this.interrelatedElements["0"]={initElement: initElement, dependentElement: dependentElement};
        },
        HideUnUseElements(event) {
            let target = event.target;
            console.log("IN HIDE UNUSE")
            bufferforprestyle="";
            /*for (element in this.interrelatedElements) {*/
                console.log(this.interrelatedElements)
                console.log(target)
            if(this.interrelatedElements["0"]!=undefined) {
                if (this.interrelatedElements["0"].initElement == target || target.parentElement == this.interrelatedElements["0"].initElement) {
                    console.log(this.interrelatedElements["0"].dependentElement)
                    this.interrelatedElements["0"].dependentElement.style.display = "block";
                    if (this.interrelatedElements["0"].dependentElement.className == "popupMenu") {
                        this.interrelatedElements["0"].dependentElement.style.position = "absolute";
                        this.interrelatedElements["0"].dependentElement.style.left = event.layerX + "px";
                        this.interrelatedElements["0"].dependentElement.style.top = event.y + "px";
                        this.interrelatedElements["0"].dependentElement.style.width = "105px";


                    }
                    if (this.interrelatedElements["0"].dependentElement.className == "archiveCreateMenu") {
                        this.interrelatedElements["0"].dependentElement.style.position = "absolute";
                        this.interrelatedElements["0"].dependentElement.style.left = event.x + "px";
                        console.log(event.layerX)
                        this.interrelatedElements["0"].dependentElement.style.top = Number(event.layerY) - 50 + "px";
                        this.interrelatedElements["0"].dependentElement.style.width = "200px";
                        this.interrelatedElements["0"].dependentElement.style.zIndex = "2";
                        this.bufferforprestyle = this.interrelatedElements["0"].initElement.style.outline;
                        this.interrelatedElements["0"].initElement.style.outline = "3px solid #325ddf"
                        console.log("IN POPUM MENU ")

                    }
                    console.log("IN HIDE UNUSE TRUE")


                } else {
                    this.interrelatedElements["0"].dependentElement.style.display = "none";
                    this.interrelatedElements["0"].initElement.style.outline = this.bufferforprestyle;

                    console.log("IN HIDE UNUSE FALSE")


                }
            }
        },
        AddElementForMoseMove(element) {
            newel = element.cloneNode(true);
            body = document.getElementsByTagName("body");
            body = body[0];
            body.appendChild(newel)
            this.elementForMouseMove = newel;
        },
        AddElementForCaptureForScreenPlace(element) {
            let newel = element.cloneNode(true);
            this.captureElement = newel;
        },
        FindParentClassName(element,classname)
        {
            if(element.className==classname) return element;
            while ((element = element.parentElement) && !element.classList.contains(classname));
            return element;
        },
        AddCapteredElementToScreenBlock(event)
        {
            if (this.captureElement != "") {
                if (event.target.className == "screenBlock" && this.currentInterrelatedElement.className=="programsBlock") {

                    console.log("IN IF TARGE SCREENBLOCK")

                    DOM.CreateElement("div",this.currentInterrelatedElement.id,"programPack","display:none",this.captureElement);
                    sEValey=this.captureElement.querySelector(".screenElementValue")

                    if(sEValey!==null)
                    {
                        if(this.currentInterrelatedElement.getAttribute("typevalue").includes("32"))
                        {
                           sEValey.style="font-size:medium"
                        }
                        if(this.currentInterrelatedElement.getAttribute("typevalue").includes("64"))
                        {
                            sEValey.style="font-size:small"
                        }
                    }
                    this.currentInterrelatedElement.style=""
                    this.currentInterrelatedElement="";
                    event.target.appendChild(this.captureElement.cloneNode(true));
                    this.captureElement.remove();
                    document.querySelector(".popupMenuMainButton").innerHTML="Создать элемент"
                }
            }
        },
        MoveCapturedElement(event)
        {
            if (this.elementForMouseMove != "" || this.elementForMouseMove == undefined) {
                this.elementForMouseMove.style.left = Number(event.x + 20) + "px";
                this.elementForMouseMove.style.position = "absolute";
                this.elementForMouseMove.style.top = event.pageY + "px";
                this.elementForMouseMove.style.display = "block";
                //console.log(event)
            }
        },
        async ShowMenuScreens(screens,inShowElement)
        {
            screenChooseMenu=document.querySelector(".screenChooseMenu")
            screenChooseMenu.style.display="block"
            inShowElement.appendChild(screenChooseMenu)
            screenChooseMenuMiddleCenter=document.querySelector(".screenChooseMenuMiddleCenter")
            console.log("ShowMenuScreens")
            console.log(screenChooseMenuMiddleCenter)
            for(i=0;i<screens.length;i++)
            {
                console.log(screenChooseMenuMiddleCenter)
                element=DOM.CreateElement("div",screen[i]._id,"screenChooseMenuElement","",screenChooseMenuMiddleCenter)
                element.innerHTML="<img src='"+screen[i].preImage+"'>"
                element.addEventListener("click",(event)=>{
                    screenChooseMenuElement=DOM.FindParentClassName(event.target,"screenChooseMenuElement");
                    img=screenChooseMenuElement.querySelector("img");
                    img.style.width="600px"
                    screenChooseMenuElement.style.width="600px"
                    screenChooseMenuElement.style.height="600px"

                    for(el in elems=screenChooseMenu.querySelectorAll("img"))
                    {
                        console.log(elems)
                        console.log(elems[el])
                        if(elems[el]!=img && elems[el].style!=undefined)
                        {
                            elems[el].style.width="0px";
                            elems[el].parentElement.style.width="0px";
                            elems[el].parentElement.style.outline="";
                            elems[el].parentElement.addEventListener("onmouseover",(event)=>{event.target.style.outline=""})
                        }

                    }
                    //screenChooseMenuElement.style="position:absolute;"

                    setTimeout(()=>{
                        DOM.ShowScreen(screens.find(e=>e._id==screenChooseMenuElement.id),inShowElement);

                        screenChooseMenu.style.display="none";},300)


                })
            }


        },
        async ShowScreen(screen,parentElement)
        {
            screenEl= DOM.CreateElement("div",screen._id,"","",parentElement)
            screenEl.innerHTML=screen.code;
            programPackElement=screenEl.querySelectorAll(".programPack")

            for(i=0;i<programPackElement.length;i++)
            {
                progpackresult = await fetcher(SDK.serverUrlPort,"/programPack?id="+programPackElement[i].id,"GET","");

                progpackresult=progpackresult.programPack
                for(ipp=0;ipp<progpackresult.length;ipp++)
                {
                    prog=progpackresult[ipp];
                    console.log("P RO G")
                    console.log(prog)
                    if(prog.periodTime>0)
                    {
                        console.log("3424")
                        SDK.AddProgramForPeriodicRequest(prog._id,prog.periodTime);
                    }
                    else
                    {
                        console.log("000")
                        SDK.AddProgramForSendMessage(prog,programPackElement[i])
                    }

                }
            }
            screenEl.addEventListener("click",(event)=>
            {
                screenBlock=DOM.FindParentClassName(event.target,"screenBlock")
                console.log("SCREEN BLOCK")
                console.log(screenBlock);
                screenElementBlock=screenBlock.querySelector(".screenElementBlock")
                //console.log(screenElementBlock.querySelector("input"));

                if(screenElementBlock!==null && screenElementBlock.querySelector("input")==null)
                {
                    archiveMenu=document.getElementById("archiveMenu");
                    DOM.AddInterrelatedElements(screenElementBlock,archiveMenu);
                }
            })

            await SDK.InitScreenElements(screenEl);
            await SDK.AddAllExistDeviceToPeriodRequest();
            //await SDK.AddAllExistStationToPeriodRequest();
            SDK.StartPeriodRequest(screenEl);
        },
        CreateHeadScreen(prescreen)
        {
            let prescreenHead=DOM.CreateElement("div","screenMainHead","screenMainHead","",prescreen);
            let prescreenHeadLeft=DOM.CreateElement("div","screenMainHeadLeft","screenMainHeadLeft","",prescreenHead);
            prescreenHeadLeft.innerHTML="<div class='activeStation'> </div>"
            let prescreenHeadCenter=DOM.CreateElement("div","screenMainHeadCenter","screenMainHeadCenter","",prescreenHead);
            prescreenHeadCenter.innerHTML="<div><H2>Наименование</H2><input id='inputnamescreen' type='text' placeholder='Наименование экрана' style='width:96%'></input></div>"
            let prescreenHeadRight=DOM.CreateElement("div","screenMainHeadRight","screenMainHeadRight","",prescreenHead);
            prescreenHeadRight.innerHTML="<div><h2>Авктивность:</h2><div id='activeDevice'></div></div>";
        },
        CreateMenuCreateElementOfScreen(form)
        {
            menuAddPacket=DOM.CreateElement("div","menuAddPacket","stepMenu","",form);
            menuElemets=DOM.CreateElement("div","menuElemets","popupMenu","display:none",form);
            menuAddPacketMainButton=DOM.CreateElement("div","menuAddPacketButton","popupMenuMainButton","width: 300px; display: block;z-index: 0;background-color: #eae6f7;",menuAddPacket);
            menuAddPacketMainButton.innerHTML="Создать эелемент";
            menuAddPacketMainBody=DOM.CreateElement("div","","popupMenuMainBody","width: 300px; display: none;position: absolute;z-index: 0;background-color: #eae6f7;",menuAddPacket);


        }


    }
SDK=
{
    programPeriodicRequest:[],
    devicePeriodRequest:[],
    fasterPeriodScreen:0,
    stationPeriodRequest:[],
    stations:{},
    devices:{},
    programPacks:{},
    serverUrlPort:"127.0.0.1",
    currentUser:{},
    translator:{},

    AddProgramForPeriodicRequest(id,period)
    {
        console.log(id)
        console.log(period)
        console.log(Number(this.fasterPeriodScreen))
        if(period!=0)
            this.programPeriodicRequest.push(id);
        if(Number(this.fasterPeriodScreen)==0 && period!=0)
        {
            this.fasterPeriodScreen=period;
        }
        if(Number(this.fasterPeriodScreen)>Number(period) && period!=0)
        {
            this.fasterPeriodScreen=period;
        }

    },
    async AddAllExistDeviceToPeriodRequest()
    {
        activeDeviceElement=document.querySelectorAll(".activeDeviceElement");


        for(i=0;i<activeDeviceElement.length;i++)
        {
            device=await fetcher(SDK.serverUrlPort, "/device?id="+ activeDeviceElement[i].id, "GET", "");
            this.devicePeriodRequest.push(activeDeviceElement[i].id)
            this.stationPeriodRequest.push(device.device["0"].placeStation)
            activeDeviceElement[i].innerHTML = "<div><div class='nameDevice' style='float:left'>" + device.device["0"].name + " </div><div class='DeviceState' ></div></div>"
        }
    },

    AddProgramForSendMessage(prog,element)
    {

        screenElementBlock=DOM.FindParentClassName(element,"screenElementBlock");
        if(screenElementBlock.querySelector(".screenElementInput")!=null)
        {
            nameElement=screenElementBlock.querySelector(".screenElementName");
            nameElement.innerHTML=prog.nameData;

            inputElement=screenElementBlock.querySelector(".screenElementInput");
            inputt=inputElement.querySelector("input");


            buttonElement=screenElementBlock.querySelector(".screenElementButtonInput");
            buttonElement.addEventListener("click",async ()=>
            {
                val=inputt.value;
                if(val.length>0)
                {
                    let addresult=await fetcher(SDK.serverUrlPort,"/sendNumberToDevice","POST",JSON.stringify({"programPackId":prog._id,"number":val}));
                }


                //console.log(message)
            })

        }
        else
        {
            nameElement=screenElementBlock.querySelector(".screenElementName");
            nameElement.innerHTML=prog.nameData;
            screenElementBlock.addEventListener("click",async ()=>
            {

                let addresult=await fetcher(SDK.serverUrlPort,"/station/command/addOnceProgramPacket","POST",JSON.stringify({"deviceId":prog.deviceId,"packet":prog.message}));
            })
        }

    },
    async AddNewProgramPackToDevice()
    {
        addProgramPackInDevice=document.getElementById("addProgramPackInDevice");
        inputs=addProgramPackInDevice.querySelectorAll("input")
        console.log(inputs)
        err=0;
        data={};
        for(input in inputs)
        {
            switch (inputs[input].name) {
                case "station":
                    if(inputs[input].getAttribute("stationId").length!=24){alert("Поле станции опроса ошибка");err=1}
                    else data['stationId']=inputs[input].getAttribute("stationId")
                break;
                case "device":
                    if(inputs[input].getAttribute("deviceId").length!=24){alert("Поле устройства ошибка");err=1}
                    else data['deviceId']=inputs[input].getAttribute("deviceId")
                    break;
                case "type":
                    data['type']="ModbusTCP"
                    break;
                case "message":
                    if(inputs[input].value.length<1){alert("Поле сообщения ошибка");err=1}
                    else data['message']=inputs[input].value
                    break;
                case "nameData":
                    if(inputs[input].value.length<1){alert("Поле наименование ошибка");err=1}
                    else data['nameData']=inputs[input].value
                    break;
                case "units":
                    if(inputs[input].value.length<1){alert("Поле единицы измеренияе ошибка");err=1}
                    else data['units']=inputs[input].value
                    break;
                case "archivePeriod":
                    if(inputs[input].value.length<1){alert("Поле архивировать значение ошибка");err=1}
                    else data['periodArchive']=inputs[input].value
                    break;
                case "period":
                    if(inputs[input].value.length<1){alert("Поле обновлять значение ошибка");err=1}
                    else data['periodTime']=inputs[input].value
                    break;
                case "typeVariable":
                    if(inputs[input].value.length<1){alert("Поле значение переменной ошибка");err=1}
                    else data['variableType']=inputs[input].getAttribute("typevariable")
                    break;

            }
        }
        if(err==0)
        {
            data["userId"]=SDK.currentUser.user.userId;
            console.log(data)
            await fetcher(SDK.serverUrlPort,"/station/device/addProgram","POST",JSON.stringify(data))
        }
        return err;

    },
    async SaveScreenToServer()
    {
        screenblocks=document.querySelectorAll(".screenBlock")
        for(i=0;i<screenblocks.length;i++)
        {
            screenblocks[i].style="";//очистить линии сетки элементов экрана
        }
        //подготовка экрана к сохранению
        document.getElementById("SaveScreenButton").style="display:none";
        document.getElementById("LoadImageScreenButton").style="display:none";
        val=document.getElementById("inputnamescreen").value;
        document.getElementById("inputnamescreen").style="display:none";
        nameScreen=DOM.CreateElement("div","screenName","screenNameBlock","",document.getElementById("screenMainHeadCenter"))
        //содание миниатюры
        nameScreen.innerHTML=val;
        prescreen=document.getElementById("screenMain");

        canvas=await html2canvas(prescreen);


        let addresult=await fetcher(SDK.serverUrlPort,"/screen","POST",JSON.stringify({"code":prescreen.outerHTML,"preImage":canvas.toDataURL(),"name":val}));
        //показать полученный экран на 3 секунды а затем вернуть экран в первоначальное состояние для того чтоб можно было создать новый экран
        setTimeout(()=>{
            SDK.ClearScreen();
        },3000)
    },
    async GetScreensFromServer()
    {
        screen = await fetcher(SDK.serverUrlPort, "/screen", "GET", "");
        screen=screen.screen;
        return screen;
     },


    ClearScreen()
    {
        screenblocks=document.querySelectorAll(".screenBlock")
        for(i=0;i<screenblocks.length;i++)
        {
            screenblocks[i].style="outline: solid 1px black;";
            screenblocks[i].innerHTML="";
        }
        document.querySelector(".screenNameBlock").outerHTML=""
        document.getElementById("SaveScreenButton").style="display:block";
        document.getElementById("LoadImageScreenButton").style="display:block";
        document.getElementById("inputnamescreen").value="";
        document.getElementById("inputnamescreen").style="display:block; width:100%";
        document.getElementById("screenMainMiddle").style.background=""

    },
    async InitScreenElements(screenEl)
    {
        for(i=0;i<this.programPeriodicRequest.length;i++) {
            progpackresult = await fetcher(SDK.serverUrlPort, "/programPack?id=" + this.programPeriodicRequest[i], "GET", "");
            scrennElelementBlock = DOM.FindParentClassName(document.getElementById(progpackresult.programPack[0]._id), "screenElementBlock");

            nameElement = scrennElelementBlock.querySelector(".screenElementName");
            valueElement = scrennElelementBlock.querySelector(".screenElementValue");
            unitElement = scrennElelementBlock.querySelector(".screenElementUnits");

            nameElement.innerHTML = progpackresult.programPack[0].nameData;
            valueElement.innerHTML = progpackresult.programPack[0].lastAnswerDec;
            unitElement.innerHTML = progpackresult.programPack[0].units;


        }
    },
    async StartPeriodRequest(screen)
    {
        console.log("START PERIOD REQUEST__");
        console.log(this.fasterPeriodScreen);

        setInterval(async ()=>{

            progpackresult = await fetcher(SDK.serverUrlPort,"/programPackArray","POST",JSON.stringify({programPack:this.programPeriodicRequest,device:this.devicePeriodRequest}));
            console.log("progpackresult__");
            console.log(progpackresult);
            for(i=0;i<progpackresult.p.length;i++)
            {
                scrennElelementBlock=DOM.FindParentClassName(document.getElementById(progpackresult.p[i]._id),"screenElementBlock");
                valueElement=scrennElelementBlock.querySelector(".screenElementValue");
                valueElement.innerHTML=progpackresult.p[i].lastAnswerDec;
                deviceStateElement=document.querySelectorAll(".DeviceState");

            }
            for(i=0;i<deviceStateElement.length;i++)
            {


                 if (progpackresult.d[i].connected === "true")
                 {
                     deviceStateElement[i].innerHTML = "-в сети"
                 }
                 else
                 {
                     deviceStateElement[i].innerHTML = "<div style='color:red'>-не в сети</div>"
                 }
            }


        },this.fasterPeriodScreen)
        await this.StartRequestStation();

    },
    async GetArchiveData(period,startDate)
    {
        programPack=DOM.interrelatedElements[0].initElement.querySelector(".programPack");
        archiveData= await fetcher(SDK.serverUrlPort,"/programPack/archive?id="+programPack.id+"&period="+period+"&dateStart="+startDate,"GET","")
        //archiveData= await fetcher(SDK.serverUrlPort,"/programPack/archive?id="+programPack.id+"&period="+period+"&dateStart="+startDate+"&divider=10&func=average","GET","")
        console.log(archiveData)
        return archiveData;

    },
    async ShowGraphScreen(data)
    {
        await CANVAS.Render(data);
    },
    async StartRequestStation(stationId)
    {
        //console.log("IN START REQUEST STATION ")
        //console.log(stationId)
        if(stationId!=undefined)
        {
            activeStationElement=document.querySelector(".activeStation");
            stationLastActive= await fetcher(SDK.serverUrlPort,"/station/lastActive?id="+stationId,"GET","")
            stationLastActive=stationLastActive.lastActive;
            if(stationLastActive.activeBool==0)
            {
                console.log("Станция опроса №"+stationId+" НЕ АКТИВНА");
                document.querySelector(".screenMainHeadRight").style.display="none";

                console.log(activeStationElement.children)
                if(activeStationElement.children.length==0)
                {
                    activeStationElement.innerHTML="<div style='color:white;background-color: red;padding: 2px;top:10px;border: 1px solid white;'>Станция не активна</div>"
                }
                else
                {
                    if(activeStationElement.children[0].style.color=="red" )
                    {
                        activeStationElement.innerHTML="<div style='color:white;background-color: red;padding: 2px;top:10px;border: 1px solid white;'>Станция не активна</div>"
                    }
                    else
                    {
                        activeStationElement.innerHTML="<div style='color:red;background-color: white;padding: 2px;top:10px;border: 1px solid red;'>Станция не активна</div>"
                    }
                }



            }
            else
            {
                document.querySelector(".screenMainHeadRight").style.display="block";
                activeStationElement.innerHTML=""
            }
            setTimeout(()=>{console.log("IN SET TIMEOUT");console.log(stationId);SDK.StartRequestStation(stationId)},Number(stationLastActive.interval));
        }
        else
        {
            for(st in this.stationPeriodRequest)
            {
                stationLastActive= await fetcher(SDK.serverUrlPort,"/station/lastActive?id="+this.stationPeriodRequest[st],"GET","")
                stationLastActive=stationLastActive.lastActive;
                if(stationLastActive.activeBool==0)console.log("Станция опроса"+this.stationPeriodRequest[st]+" НЕ АКТИВНА")
                setTimeout(this.StartRequestStation,stationLastActive.interval,this.stationPeriodRequest[st]);
            }
        }


    },
    GetTranslate(string,context,lang)
    {
        //console.log()
        for(ob in SDK.translator)
        {
            if(SDK.translator[ob].context==context)
            {
                trans=SDK.translator[ob];
                return trans[lang][string];
            }
        }
    }
}
LOGIC=
{
    rightNavMenuStates:
        {
            "INSTATIONCONTROLCENTER":"INSTATIONCONTROLCENTER",
            "INSCREENMAKER":"INSCREENMAKER"
        },
    DecToHex(value,num)
    {
        numhex=Number(value).toString(16)
        r="";
        i=Number(num-(numhex.length%num));
        while(i>0 && i<num)
        {
            r=r+"0";
            i--;
        }
        numhex=r+numhex;
        return numhex;
    },
    MaxRange(value,rang)
    {

    },
    RightNavMenu(state)
    {
        switch (state)
        {
            case LOGIC.rightNavMenuStates.INSTATIONCONTROLCENTER:
                document.querySelector(".rightNav").innerHTML="<li><a class='addProgramPackRightMenuButton' href=\"#\">Добавить ТЭГ</a></li>" +
                    "<li><a class='screenMakerRightMenuButton' href=\"#\">Создание экранов</a></li>"

            break;
            case LOGIC.rightNavMenuStates.INSCREENMAKER:
                document.querySelector(".rightNav").innerHTML="<li><a class='addProgramPackRightMenuButton' href=\"#\">Добавить ТЭГ</a></li>" +
                    "<li><a class='stationControlCenterRightMenuButton' href=\"#\">Управление станциями</a></li>"

            break;
        }
    }

}
CANVAS=
{
    canvas:{},
    ctx:{},
    bufcanvas:"",
    bufctx:"",
    mouseX:"",
    mouseY:"",
    fixMouseX:"",
    fixMouseY:"",
    renderingXY:"",
    RendData:{},
    shoulder:"",
    Init()
    {
        this.canvas = document.getElementById("canvasId");
        this.bufcanvas = document.createElement("canvas");

        this.ctx=this.canvas.getContext("2d");
        this.bufctx=this.bufcanvas.getContext("2d");
        this.bufcanvas.width=this.canvas.width;
        this.bufcanvas.height=this.canvas.height;
        this.mouseX="";
        this.mouseY="";
        this.fixMouseX="";
        this.fixMouseY="";

        this.renderingXY=true;
        this.canvas.addEventListener("mousemove",(event)=>{
            this.mouseX=event.offsetX;
            this.mouseY=event.y;
            if(this.renderingXY==true)
            {
                this.mouseX=event.offsetX;
                this.mouseY=event.y;
            }
            else
            {
                this.mouseX=this.canvas.fixMouseX;
                this.mouseY=this.canvas.fixMouseY;
            }

        })
        this.canvas.addEventListener("click",(event)=> {
                if (this.renderingXY == true) {
                    this.fixMouseX=this.canvas.mouseX;
                    this.fixMouseY=this.canvas.mouseY;
                    this.renderingXY = false;
                    clearInterval(CANVAS.shoulder);
                } else {
                    this.renderingXY = true;
                    CANVAS.shoulder=setInterval(CANVAS.CiclRender,50)
                }
            }
        )



        this.canvas.offset = 0;
    },
    async Render(data)
    {
        canvasWindow=document.getElementById("canvasWithMenu")
        canvasWindow.style.display="block";
        canvasWindow.querySelector(".fullscreenDialogBoxHeader").innerHTML="График"

        console.log(data)

        console.log("IN SHOW Screen")
        //console.log(data)

        await this.OnceRender(data);
        this.shoulder=setInterval(CANVAS.CiclRender,50 );







    },
    async OnceRender(data)
    {
        //console.log(mouseX)
        canvas=this.bufcanvas;
        ctx=this.bufctx;
        //console.log(data)
        RD=this.RendData;
        const pointsNumber=data.length;
        aD=data;
        RD.pointsNumber=pointsNumber;
        RD.data=data;

        fieldDataX=100;//размер под вычет для поля данных оси Х
        fieldDataY=50;//размер под вычет для поля данных оси Y
        RD.fieldDataX=fieldDataX;//размер под вычет для поля данных оси Х
        RD.fieldDataY=fieldDataY;//размер под вычет для поля данных оси Y

        RD.graphHeight=graphHeight=canvas.height-fieldDataX;//Высота поля отрисовки графика
        RD.graphWidth=graphWidth=canvas.width-fieldDataY;//Ширина поля отрисовки графика

        RD.stepForDataX=stepForDataX=10;//количество делений по Х
        RD.stepForDataY=stepForDataY=10;//количество делений по У


        //Найти минимальное и максимальное значение числовых значений для получения диапазона
        RD.maxValue=maxValue=Number(aD["0"].dec);
        RD.minValue=minValue=Number(aD["0"].dec);


        for(i=0;i<pointsNumber;i++)
        {
            if(aD[i].dec>maxValue)maxValue=Number(aD[i].dec);
            if(aD[i].dec<minValue)minValue=Number(aD[i].dec);

        }

        RD.maxDate=maxDate=Number(aD["0"].date);
        RD.minDate=minDate=Number(aD["0"].date);
        RD.minStepDate=minStepDate=""
        RD.avarageMinStepDate=avarageMinStepDate="";
        RD.countForAvarage=countForAvarage=2;
        for(i=0;i<pointsNumber;i++)
        {
            if(aD[i].date>maxValue)maxDate=Number(aD[i].date);
            if(aD[i].date<minValue)minDate=Number(aD[i].date);
            if(i>0 && i<pointsNumber)
            {
                if(minStepDate=="")minStepDate=aD[i].date-aD[i-1].date;
                if(aD[i].date-aD[i-1].date<minStepDate)minStepDate=aD[i].date-aD[i-1].date;

                if(countForAvarage<10){avarageMinStepDate=(Number(avarageMinStepDate)+Number(aD[i].date-aD[i-1].date))/Number(2);countForAvarage++}
                else
                {
                    if(avarageMinStepDate-minStepDate>1000)minStepDate=avarageMinStepDate;
                }
            }

        }
        RD.maxValue=maxValue
        RD.minValue=minValue
        RD.deltaDate=deltaDate=maxDate-minDate;

        RD.deltaValue=deltaValue=maxValue-minValue;
        mnozhDateToPx=graphWidth/deltaDate;//множитель на который нужно умножать номер точки для получения X координаты в пикселях
        mnozhValueToPx=graphHeight/deltaValue;
        RD.mnozhDateToPx=mnozhDateToPx;
        RD.mnozhValueToPx=mnozhValueToPx;



        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.fillStyle='#FFFFFF';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle='#000000';

        //Отрисовка кривой данных
        ctx.beginPath();
        ctx.setLineDash([1, 0]);
        ctx.lineWidth = 1; // толщина линии
        ctx.strokeStyle = 'black';
        ctx.moveTo(0+fieldDataY, (graphHeight-((Number(aD["0"].dec)-Number(minValue))*mnozhValueToPx)));
        //deltaDateLast=0;
        for(i=0;i<pointsNumber;i++)
        {
            xP=(Number(aD[i].date)-Number(minDate))*mnozhDateToPx;
            yP=graphHeight-((Number(aD[i].dec)-Number(minValue))*mnozhValueToPx);
            xP=xP+fieldDataY;//добавить отступы для полей данных по Х для Y не добавляется , график сужается и внизу остается место под Y

            //deltaDateLast=Number(aD[i].date);
            ctx.lineTo(xP, yP);
            if((i+1)<pointsNumber)
            {
                if(aD[i+1].date-aD[i].date>(minStepDate)*1.5)
                {
                    ctx.lineTo(xP, graphHeight);
                    xP=(Number(aD[i+1].date)-Number(minDate))*mnozhDateToPx;
                    xP=xP+fieldDataY;
                    ctx.lineTo(xP, graphHeight);
                }
            }
        }
        ctx.stroke();

        //Отрисовка осей
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(0+fieldDataY,canvas.height-fieldDataX);
        ctx.lineTo(canvas.width, canvas.height-fieldDataX);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(0+fieldDataY,canvas.height-fieldDataX);
        ctx.lineTo(fieldDataY, 0);
        ctx.stroke();

        //отрисовка наименований осей По Х
        ctx.beginPath();
        ctx.moveTo(0+fieldDataY,canvas.height-fieldDataX);
        RD.xstep=xstep=graphWidth/stepForDataX;
        RD.stepDate=stepDate=deltaDate/stepForDataX;
        for(i=0;i<stepForDataX;i++)
        {
            ctx.beginPath();
            ctx.setLineDash([2, 10]);
            ctx.lineWidth = 0.5;
            ctx.moveTo((i*xstep)+fieldDataY,canvas.height-fieldDataX+2);
            ctx.lineTo((i*xstep)+fieldDataY, 0);
            ctx.stroke();

            date=new Date(minDate+(stepDate*i));

            ctx.save()
            ctx.translate( (i*xstep)+fieldDataY,canvas.height-fieldDataX+30)
            ctx.rotate(0.2)
            //ctx.fillText(date.toISOString(), (i*xstep)+fieldDataY, canvas.height-fieldDataX+50);
            date=Number(date)+(5*60*60*1000);
            date=new Date(date);
            ctx.fillText(date.toISOString(), 0, 0);
            ctx.restore();
        }

        //отрисовка наименований осей По Y
        ctx.beginPath();
        ctx.moveTo(10,canvas.height-fieldDataX);
        RD.ystep=ystep=graphHeight/stepForDataY;
        RD.stepValue=stepValue=deltaValue/stepForDataY;

        for(i=0;i<stepForDataY;i++)
        {
            ctx.beginPath();
            ctx.setLineDash([2, 10]);
            ctx.lineWidth = 0.5;
            ctx.moveTo(fieldDataY-2,canvas.height-(fieldDataX+(i*stepValue*mnozhValueToPx)));
            ctx.lineTo(canvas.width, canvas.height-(fieldDataX+(i*stepValue*mnozhValueToPx)));
            ctx.stroke();

            valueText=minValue+stepValue*i;

            ctx.save()
            ctx.translate( fieldDataY-50,canvas.height-(fieldDataX+(i*stepValue*mnozhValueToPx)))
            //ctx.rotate(0.2)
            //ctx.fillText(date.toISOString(), (i*xstep)+fieldDataY, canvas.height-fieldDataX+50);
            ctx.fillText(Math.round(valueText), 0, 0);
            ctx.restore();
        }






    },
    async CiclRender()
    {
        //Отрисовка вспомогательных линий координат мыши
        let mouseX=CANVAS.mouseX;
        let mouseY=CANVAS.mouseY;
        canvas=CANVAS.canvas;
        ctx=CANVAS.ctx;
        RD=CANVAS.RendData;
        ctx.drawImage(CANVAS.bufcanvas,0,0)

        mnozhValueToPx=RD.mnozhValueToPx;
        mnozhDateToPx=RD.mnozhDateToPx;
        minValue=RD.minValue;
        fieldDataX=RD.fieldDataX;
        fieldDataY=RD.fieldDataY;
        graphHeight=RD.graphHeight;
        graphWidth=RD.graphWidth;
        data=RD.data;

        //отрисова Х паралели
        //valueText=(canvas.height-fieldDataX)/mnozhValueToPx-(minValue+((mouseY-fieldDataX/2+3)/mnozhValueToPx));
        valueText=((canvas.height-fieldDataX)/mnozhValueToPx)-(minValue+((mouseY-fieldDataX/2+3)/mnozhValueToPx));

        if(valueText>minValue )
        {

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 10]);
            ctx.strokeStyle = 'red';
            ctx.moveTo(0+fieldDataY,mouseY-fieldDataX/2+3);
            ctx.lineTo(canvas.width, mouseY-fieldDataX/2+3);
            ctx.stroke();

            ctx.save()
            ctx.translate( fieldDataY-50,mouseY-fieldDataX/2+3)

            ctx.fillStyle='#FFFFFF';
            ctx.fillRect(0,5+(1000/mouseY),40,-17);
            ctx.fillStyle='#000000'

            ctx.fillStyle = 'red';
            ctx.font = "small-caps 14px Arial";
            //(valueText/1000/4)
            ctx.fillText(Math.round(valueText), 0, 1000/mouseY);
            ctx.restore();
            ctx.strokeStyle = 'black';
        }
        //отрисова У паралели

        if(mouseX>fieldDataY )
        {
            valueText=mouseX/mnozhDateToPx
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 10]);
            ctx.strokeStyle = 'red';
            ctx.moveTo(mouseX,canvas.height-fieldDataX);
            ctx.lineTo(mouseX, 0);
            ctx.stroke();

            ctx.save()
            ctx.translate( mouseX-(mouseX/7),graphHeight+fieldDataX/4)
            ctx.rotate(0.2)
            ctx.fillStyle='#FFFFFF';
            ctx.fillRect(0,5,200,-17);
            ctx.fillStyle='#000000'

            date=new Date(minDate+((mouseX-fieldDataY)/mnozhDateToPx));
            date=Number(date)+(5*60*60*1000);
            date=new Date(date);
            ctx.fillStyle = 'red';
            ctx.font = "small-caps 14px Arial";

            ctx.fillText(date.toISOString(), 0, 0);
            ctx.restore();
            ctx.strokeStyle = 'black';
        }
    }
}
DOM.Init();
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }
async function  fetcher(urlport,entryPoint,method,data)
{
    let keyAuthor=localStorage.getItem("key")
    let result;
    //console.log("In FETCHEr")
    if(method=="POST")
    {
        result=await fetch("http://"+urlport+entryPoint,{method: method,headers:{'Authorization':keyAuthor,'Accept': 'application/json, text/plain, */*','Content-Type': 'application/json'},body: data
        });
        result = await result.text();
        try {
            result = JSON.parse(result);
        }
        catch (e)
        {
           console.log(e)
        }

    }
    else
    {
        result=await fetch("http://"+urlport+entryPoint,{headers:{'Authorization':keyAuthor}});
        result = await result.text();
        result=JSON.parse(result);
    }

    return result;
}
async function fetchFormJSON(nameForm)
{
    
    const response = await fetch(nameForm);//'/form/authorization'
    console.log(response);
    if(response.status!=200){return null;}
    else
    {
        const form = await response.json();
        return form[0];
    }
}
async function fetchStationsJSON()
{
    const response = await fetch('/station/');
    if(response.status!=200){return null;}
    else
    {
        const stations = await response.json();
        return stations;
    }
}
async function fetchStationsActiveJSON(id)
{
    const response = await fetch('/station/'+id+'/lastActive');
    if(response.status!=200){return null;}
    else
    {
        const stations = await response.json();
        return stations;
    }
}


async function fetchUsersJSON() 
{
    const response = await fetch('/admincp/users');
    if(response.status!=200)
    {
        return null;
    }
    else
    {
        const users = await response.json();
        return users;
    }
    
}
async function fetchUsersLoginJSON(formEl) 
{
    test=formEl.querySelectorAll("input");
    console.log(test);
    strPOST={};
    for(inputData in EL=formEl.querySelectorAll("input"))
    {
        console.log(EL[inputData]["value"]);
        strPOST[EL[inputData]["name"]]=EL[inputData]["value"];
    }
    console.log(strPOST);
    const response = await fetch('/user/login',{
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify(strPOST)
    });
    console.log(response);
    if(response.status!=200)
    {
        return null;
    }
    else
    {
        const users = await response.json();
        console.log(users);
        return users;
    }
    
}
async function fetchUserKeyJSON() 
{
    const response = await fetch('/admincp/users/add');
    if(response.status!=200)
    {
        return null;
    }
    else
    {
        const userKey = await response.json();
        return userKey;
    }
    
}
function createFormFromJSON(formJSON,divElement)
{
    eldiv=document.createElement("div");
    eldiv.setAttribute("class","form");
    headerel=document.createElement("h3");
    headel.innerHTML=formJSON["head"]["RU"];
    eldiv.appendChild(headerel);
   
    for(field in formJSON["field"])
    {
        labelEl=document.createElement("label");
        labelEl.innerHTML=formJSON["field"][field]["RU"]["label"];
        inputEl=document.createElement("input");
        inputEl.setAttribute("name",field);
        
        inputEl.setAttribute("title",formJSON["field"][field]["RU"]["title"]);
        eldiv.appendChild(labelEl);
        eldiv.appendChild(inputEl);

    }
    button=document.createElement("button");
    for(targ in formJSON["target"]){button.setAttribute(targ,formJSON["target"][targ]);}
    button.setAttribute("class","sendButton");
    button.innerHTML="Отправить";
    
    eldiv.appendChild(button);
    
    divElement.appendChild(eldiv);
    
}
function ViewLoginForm(block)
{

    block.innerHTML="<div class='form'>" +
        "              <p>Логин</p>" +
        "               <input type='text' name='login'>" +
        "               <p>Пароль</p>" +
        "               <input type='text' name='password'>        " +
        "               <button id='sendButton' >Отправить</button>" +
        "         </div>" +
        "" +
        "";
        document.getElementById('sendButton').addEventListener("click",()=>{sendJS(block)})


}

function sendJS(form)
{
    console.log("In FUNC SEND SENDJS")
    let strjs=FromFormToJson(form);
    console.log(SDK.serverUrlPort);
    fetcher(SDK.serverUrlPort,"/user/login", "POST",strjs
    ).then((r)=>{


            console.log(r)
            let rjs=r;
            if(rjs.authorToken==undefined)
            {
                let p=document.createElement("p");

                p.innerHTML="<p>"+rjs["ru"]+"</p>";
                form.appendChild(p);
                console.log("IN IF")
            }
            else
            {
                console.log("IN ELSE")

                localStorage.setItem('key', rjs.authorToken);
                location.reload();


            }


        })


}

function FromFormToJson(form)
{
    console.log(form);
    let inputs=form.querySelectorAll("input");
    console.log(inputs);
    let inpstr="{";
    for(let i=0;i<inputs.length;i++)
    {
        inpstr=inpstr+"\""+inputs[i].name+"\""+":"+"\""+inputs[i].value+"\"";
        if(Number(i)+1<inputs.length){
            inpstr=inpstr+"," ;
        }
        else
            inpstr=inpstr+"}" ;
    }
    return inpstr;
}




//test
async function  LoginGood()
{

    let user = await fetcher(SDK.serverUrlPort,"/user/login","GET","");

    if(user.user.accessGroup=="looker")
    {
        await LookerHandler();
    }
    if(user.user.accessGroup=="root"||user.user.accessGroup=="engineer")
    {
        await AdminHandler();
    }

}
async function LookerHandler()
{
    let form=document.getElementById("mainBlock");
    form.innerHTML="";

    screens= await SDK.GetScreensFromServer();
    await DOM.ShowMenuScreens(screens,form);


}
async function AdminHandler()
{
    let form=document.getElementById("mainBlock");
    form.innerHTML="";

    menuAddPacketMainButton=document.querySelector(".popupMenuMainButton")
    DOM.CreateMenuCreateElementOfScreen(form);

    let prescreen=DOM.CreateElement("div","screenMain","screenMain","display:none",form);
    prescreen.setAttribute('style', "");

    DOM.CreateHeadScreen(prescreen)

    let prescreenMiddle=DOM.CreateElement("div","screenMainMiddle","screenMainMiddle","width: 600px;  height: 600px; background-color: white; ",prescreen);
    let prescreenFoot=DOM.CreateElement("div","screenMainFoot","screenMainFoot","",prescreen);

    LOGIC.RightNavMenu(LOGIC.rightNavMenuStates.INSCREENMAKER);

    translator=await fetcher(SDK.serverUrlPort,"/translator","GET","")
    SDK.translator=translator.translator;

    let stations=await fetcher(SDK.serverUrlPort,"/station","GET","")
    stations=stations.station;
    SDK.stations=stations;
    console.log(stations)
    for(i=0;i<stations.length;i++)
    {
        let stationDiv=DOM.CreateElement("div",stations[i]._id,"popupMenuElement","display:none",document.querySelector(".popupMenuMainBody"));
        stationDiv.innerHTML=stations[i].company+" "+stations[i].placeName;
        let devices=await fetcher(SDK.serverUrlPort,"/station/device?stationId="+stations[i]._id)

        console.log(devices)
        devices=devices.devices;
        SDK.devices[stations[i]._id]=devices;
        for(idev=0;idev<devices.length;idev++)
        {
            let deviceDiv=DOM.CreateElement("div",devices[idev]._id,"popupMenuElementDevice","display:none",stationDiv);
            deviceDiv.innerHTML=devices[idev].name;
            activeDevice=document.getElementById("activeDevice")
            let activedeviceElement=DOM.CreateElement("div",devices[idev]._id,"activeDeviceElement","",activeDevice);
            if(devices[idev].connected==="true") activedeviceElement.innerHTML="<div>"+devices[idev].name +"  в сети</div>"
            else activedeviceElement.innerHTML="<div style='color:red; background-color: darkorange'>"+devices[idev].name +"  не в сети</div>"



            let programs=await fetcher(SDK.serverUrlPort,"/device/programPack?deviceId="+devices[idev]._id);
            console.log(programs)
            programs=programs.programPack;
            SDK.programPacks[devices[idev]._id]=programs;
            let programsDiv=DOM.CreateElement("div","","programsList","display:none",deviceDiv);
            for(ipp=0;ipp<programs.length;ipp++)
            {


                let id=programs[ipp]._id;
                let programBlock=DOM.CreateElement("div",id,"programsBlock","",programsDiv);
                programBlock.innerHTML="<p>"+programs[ipp].message+" "+programs[ipp].nameData+"</p>";
                programBlock.setAttribute("typeValue",programs[ipp].variableType);



            }


        }
    }


    console.log(stations)


    let elements=await fetcher(SDK.serverUrlPort,"/element");
    console.log(elements);
    elements=elements.element;

    for(i=0;i<elements.length;i++)
    {
        elementsDiv=document.createElement("div");
        elementsDiv.innerHTML=elements[i].insertCode;
        elementsDiv.addEventListener("click",(e)=>
        {
            newel=DOM.FindParentClassName(e.target,"screenElementBlock")
            DOM.AddElementForMoseMove(newel);
            DOM.AddElementForCaptureForScreenPlace(newel);

        })
        menuElemets.appendChild(elementsDiv);
    }

    for(i=0;i<36;i++)
    {
        let screenBlock=DOM.CreateElement("div","screenBlock","screenBlock","outline: solid 1px black;",prescreenMiddle)
        screenBlock.setAttribute('count', i);


    }

    let menuPreScreen=DOM.CreateElement("div","","bottomScreenMenu","position: inherit;bottom: 0px;background-color: #3b3db3;color: whitesmoke; width: 100%;display: flex;",prescreenFoot);
    let menuPreScreenButtonSaveScreen=DOM.CreateElement("div","SaveScreenButton","buttonMenu","",menuPreScreen);
    menuPreScreenButtonSaveScreen.innerHTML="Сохранить";
    menuPreScreenButtonSaveScreen.addEventListener("click",async ()=>{
        SDK.SaveScreenToServer();

    })
    let menuPreScreenButtonLoadImage=DOM.CreateElement("div","LoadImageScreenButton","buttonMenu","",menuPreScreen);

    menuPreScreenButtonLoadImage.innerHTML="Загрузить изображение<input id='fileloadinput' type='file'  style='display:none'>";
    fileinputer=document.getElementById("fileloadinput");
    fileinputer.addEventListener('change',(event)=>{
        console.log("ON CHANGE")
        console.log(event)
        console.log(event.target.value)
        filereader = new FileReader();
        filereader.onload = function () {
            console.log(this.result)
            prescreenMiddle.style.background="0%/ 600px 600px no-repeat url("+this.result+")";
        }
        filereader.readAsDataURL(event.target.files[0]);


    })
    menuPreScreenButtonLoadImage.addEventListener("click",async ()=>{
        document.getElementById("fileloadinput").click();

    })
}
async function ViewStationControlCenter()
{

    let form=document.getElementById("mainBlock");
    form.innerHTML="";
    ccBlock=DOM.CreateElement("div","","ControlCenterBlock","",form);
    for(station in SDK.stations)
    {
        stationEl=DOM.CreateElement("div",SDK.stations[station]._id,"ccStation","",ccBlock);
        block="<div>Станция:<br> ";
        for(st in SDK.stations[station])
        {
            block=block+SDK.GetTranslate(st,"station","RU")+" - "+SDK.stations[station][st]+" | ";

        }
        block=block+"</div>";
        stationEl.innerHTML=block;

        for(device in SDK.devices[SDK.stations[station]._id])
        {
            devEl=DOM.CreateElement("div",SDK.devices[SDK.stations[station]._id],"ccDevice","",stationEl);
            dev=SDK.devices[SDK.stations[station]._id][device]
            block="<div>Устройство: <br>";
            for(dv in dev)
            {
                block=block+SDK.GetTranslate(dv,"device","RU")+" - "+dev[dv]+" | ";
            }
            block=block+"</div>";
            devEl.innerHTML=block;
            for(program in SDK.programPacks[dev._id])
            {
                prog=SDK.programPacks[dev._id][program];
                progEl=DOM.CreateElement("div",prog._id,"ccPP","",devEl);
                block="<div>Программа(ТЭГ): <br>";
                actualFlag=1;
                for(pg in prog)
                {
                    block=block+SDK.GetTranslate(pg,"programPack","RU")+" - "+prog[pg]+" |<br> ";
                    if(pg=="actual" && prog[pg]==false)actualFlag=0;
                }
                block=block+"</div>";
                progEl.innerHTML=block;
                if(actualFlag==0)progEl.style="background:grey;color:#9d9d9d"
            }
        }

    }


}

if(localStorage.getItem('key')==null)
{
    console.log("noligin")
    document.getElementById("mainBlock").innerHTML="";
    ViewLoginForm(document.getElementById("mainBlock"))
}
else
{
   fetcher(SDK.serverUrlPort,"/user/login","GET",).then((users)=>{SDK.currentUser=users;console.log(SDK.currentUser)});

    LoginGood().then();

}
