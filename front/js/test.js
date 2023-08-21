function testfetch() {
    console.log("FRONT TEST JS");


    let data = JSON.stringify({"a": "7", "str": 'Строка: &=&'})
    console.log(data);
    fetch('/station',{method: "GET", headers: {'Accept': 'application/json, text/plain, */*','Content-Type': 'application/json'},})
    .then(function (data) {
        console.log(data);
        // ... Делаем что-то с данными.
    }).catch(function (error) {
        // ... Обрабатываем ошибки.
    });
}
//style="background-color: #a12424;color:white;width: 20px;text-align: center;float: right;"