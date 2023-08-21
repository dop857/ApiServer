//счетчики для логирования запросов, чтоб логировать с переодичностью
const Counters=
{
    counter:{},
    handlersAutoReset:{},
    handlersAutoIncrement:{},
    increments:{},
    start:{},
    Construct(name,options=null)//start=0,increment=1,autoIncrementMS=0,autoResetMS=0
    {
        Counters.start[name]=(options.start==undefined)?0:options.start;

        Counters.counter[name] = Number(Counters.start[name]);
        Counters.increments[name]=options.increments==undefined?1:options.increments;
        if (options?.autoResetMS > 0)
        {
            Counters.handlersAutoReset[name]=setInterval(()=>{
                Counters.counter[name]=Counters.start[name];
            },Number(options.autoResetMS))
        }
        if (options?.autoIncrementMS > 0)
        {
            Counters.handlersAutoIncrement[name]=setInterval(()=>{
                Counters.counter[name]=Number(Counters.counter[name])+Number(Counters.increments[name]);
            },Number(options.autoIncrementMS))
        }
    },
    Add(name)
    {
        Counters.counter[name]=Number(Counters.counter[name])+Number(Counters.increments[name]);
    },
    Get(name)
    {
        return    Counters.counter[name];
    },
    GetAndReset(name)
    {
        let res=Counters.counter[name];
        Counters.counter[name]=0;
        return    res;
    },
    BreakAutoIncrement(name)
    {
        clearInterval(Counters.handlersAutoIncrement[name]);
    },
    BreakAutoReset(name)
    {
        clearInterval(Counters.handlersAutoReset[name]);
    }
}
module.exports.Counters=Counters;