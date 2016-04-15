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

    function shipAnimation(actualLevel, currentLevel)
    {
        ship.animate = true;
        ship.y -= 9;
                
        if(!actualLevel && currentLevel !== 0)
            audio.animationFx.play();

        if(ship.y < - 75)
        {
            ship.y = game.height + 350;
            ship.beenOut = true;
        }

        if(ship.y < ship.yMark && ship.beenOut)
        {
            ship.y = ship.yMark;
            ship.silent = false;
            ship.beenOut = false;
            ship.animate = false;
        }
    }

    function engineFxMan(time)
    {
        var boost = engineFx.rate();
        
        if(boost < background.starAcceleration/5)
            boost += (background.starAcceleration/5 - boost) / 60;
        else if(boost > background.starAcceleration/5)
            boost -= (boost - background.starAcceleration/5) / 60;
        
        engineFx.rate(boost);
    }