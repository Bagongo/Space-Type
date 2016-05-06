    
    var background = {
        context : document.getElementById("backgroundCanvas").getContext("2d"),
        stars : [],
        starFrequency : 1,
        starAcceleration : 1,
        maxAcceleration: 30,
        residualAcceleration : 0,
        residualFrequency : 1
    }
   
    function neededStars()
    {        
        if(background.stars.length < 500)
            return 500 - background.stars.length;
    }

    function addStars(num, type)
    {            
        var starH;
        var starS;
        var starSpeed;
     
        for(var i=0;i<num; i++)
        {
            if(type == 1)
                starH = Math.floor(Math.random() * game.height);
            else if(type == 2)
                starH = - 10;
            else if(type == 3)
                starH = Math.floor((Math.random() * game.height) - game.height);

            if(Math.random() > .5)
            {
                starS = Math.random() * getRandomInt(1,2);
                starSpeed = .5;
            }
            else
            {
                starS = Math.random() * getRandomInt(3,4); 
                starSpeed = 1;
            }

            background.stars.push({
                x: Math.floor(Math.random() * game.width),
                y: starH,
                size: starS,
                speed: starSpeed
            });
        }           
    }

    function updateStars()
    {               
        for(i in background.stars)
        {     
            background.stars[i].y += (background.stars[i].speed * background.starAcceleration);

            if(background.stars[i].y > game.height)
                background.stars.splice(i,1);
        }
    }

    function decelarateStars(time)
    {
        if (background.starAcceleration > 1)
            background.starAcceleration -= background.starAcceleration / (60 * time);
        else
            background.starAcceleration = 1;
    }

    function thruster(onward)
    {
        if(onward)
            background.starAcceleration = Math.min(background.maxAcceleration, background.starAcceleration + 1);
        else
        { 
            background.starAcceleration =  Math.max(1, background.starAcceleration - 0.5);
            
            if(!brakeFx.paused)
                brakeFx.currentTime=0;
            else
                brakeFx.play();
        }
    }
    