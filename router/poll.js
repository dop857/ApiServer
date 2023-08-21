
let Poll=
{
    Constructor(poll)
    {
        var data = { text: "Some data" };
        poll.create("/errorpoll");
        poll.publish("/errorpoll", data);
        setInterval(function () {
            poll.publish("/errorpoll", data);
        }, 5000);
    }
}
exports.Poll=Poll;