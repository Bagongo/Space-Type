    var ship = {
        context : document.getElementById("playerCanvas").getContext("2d"),
        x : game.centerX - 61,
        y : game.height + 350,
        yMark : game.centerY * 3/2,
        width : 112,
        height : 75,
        inertialState : true,
        animate : false,
        beenOut : true,
    }

    function shipAnimation()
    {
        ship.animate = true;
        ship.y -= 9;

        if(ship.y < - 75)
        {
            ship.y = game.height + 350;
            ship.beenOut = true;
        }

        if(ship.y < ship.yMark && ship.beenOut)
        {
            ship.y = ship.yMark;
            ship.beenOut = false;
            ship.animate = false;
        }
    }