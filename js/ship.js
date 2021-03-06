    var ship = {
        context : document.getElementById("playerCanvas").getContext("2d"),
        x : game.centerX - 60,
        y : game.height + 350,
        yMark : game.centerY * 3/2,
        width : 120,
        height : 75,
        animate : false,
        beenOut : true,
        lettersToSpitOut : [],
        letterStartRight: (Math.random() < 0.5) ? true : false,
        ignitedEngine: false
    };
    
    function shipAnimation()
    {
        ship.y -= 9;

        if(ship.y < - 100)
        {
            if(game.state == "game")
            {
                ship.yMark = game.centerY;
                ship.ignitedEngine = true;
            }            
            else if (game.state == "score" || game.state == "init")
            {
                ship.yMark = game.centerY * 3/2;
                ship.ignitedEngine = false;
            }
            else //(external input changed state)
            {
                ship.animate = false;
                return;
            }
                            
            ship.y = game.height + 200;
            ship.beenOut = true;
        }

        if(ship.y < ship.yMark && ship.beenOut)
        {
            ship.y = ship.yMark;
            ship.beenOut = false;
            ship.animate = false;
        }
    }

    function afterBurner() //rectangle
    {
        var w = Math.min(ship.width-15, background.starAcceleration*4 +15);
        var h = game.height + 100;
        var y = ship.y + 40;
        var x;

        if(Math.random() < 0.5) 
             x = ship.x + ship.width/2 - w/2 - Math.random();
        else
             x = ship.x + ship.width/2 - w/2 + Math.random();
        
        function updateLetters()
        {
            var xLimit = 5;
            for(var i in ship.lettersToSpitOut)
            {
                ship.lettersToSpitOut[i].y += Math.min(10, 10/background.starAcceleration);
                ship.lettersToSpitOut[i]. x += ship.lettersToSpitOut[i].drift * (background.starAcceleration/3);

                if(ship.lettersToSpitOut[i].x > x + w - xLimit*2.5)
                    ship.lettersToSpitOut[i].drift = -1;
                else if(ship.lettersToSpitOut[i].x < x + xLimit)
                    ship.lettersToSpitOut[i].drift = 1;

                if (ship.lettersToSpitOut[i].y > game.height + 15)
                    ship.lettersToSpitOut.splice(i,1);
            }    
        }
     
        updateLetters();

        var grV = ship.context.createLinearGradient(x, y, x+w, y);
        grV.intensity = 0.3 + background.starAcceleration / 7;

        if(ship.animate && ship.y < ship.yMark)
            grV.intensity += ship.y / 50; 

        grV.addColorStop(0, "rgba(241,247,127,"+grV.intensity+")");
        grV.addColorStop(0.2, "rgba(241,247,127,"+grV.intensity/3+")");
        grV.addColorStop(0.5, "rgba(241,247,127,"+grV.intensity/10+")");
        grV.addColorStop(0.8, "rgba(241,247,127,"+grV.intensity/3+")");
        grV.addColorStop(1, "rgba(241,247,127,"+grV.intensity+")");

        ship.context.fillStyle = grV;
        ship.context.fillRect(x, y, w, h);
    }

    function addLetterToSpit(letter)
    {
        var x = ship.x + ship.width/2;
        var y = ship.y + 40;
        var drift;
        var startRight = ship.letterStartRight;
        
        if(startRight)
            drift = -1;
        else
            drift = 1;
        
        ship.lettersToSpitOut.push({
            letter : letter,
            x : x,
            y : y,
            drift : drift
        });

        ship.letterStartRight = !ship.letterStartRight;
    }

    function spitLetters()
    {
        ship.context.fillStyle = "#656503";
        var font = "bold 16px monaco, Helvetica, monospace, sans-serif";
        ship.context.font = font;
        
        for(var i in ship.lettersToSpitOut)
        {
            var letterToDraw = ship.lettersToSpitOut[i];
            ship.context.fillText(letterToDraw.letter, letterToDraw.x, letterToDraw.y);
        }
    }

    function engineFxMan(time)
    {
        var boost = engineFx.rate();
        
        if(boost < background.starAcceleration/2)
            boost += (background.starAcceleration/2 - boost) / 60;
        else if(boost > background.starAcceleration/2)
            boost -= (boost - background.starAcceleration/2) / 60;
        
        engineFx.rate(boost);
    }