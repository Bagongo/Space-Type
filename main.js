                
    function init(){

        addStars(500, 1)            
        ship.context.drawImage(game.images[0], ship.x, ship.y, ship.width, ship.height);

        shipAnimation();

        game.formatAndDisplayText();

        loop();           
    }

    function update(){

        addStars(background.starFrequency, 2);           
        updateStars();

        if(ship.inertialState)
            decelarateStars(2.5);

        if(ship.animate)
            shipAnimation();

        audio.engineFxMan();

        $("#controlpanel").html(audio.engineFx.rate() + "\n" + background.starAcceleration);
    }

    function render(){

        if(ship.animate)
        {
            ship.context.clearRect(ship.x, 0, ship.width, game.height);
            ship.context.drawImage(game.images[0], ship.x, ship.y, ship.width, ship.height);
        }

        background.context.fillStyle = "white";            
        background.context.clearRect(0, 0, game.width, game.height);
        //creates rects -stars- for every element in the background.stars array
        for(i in background.stars)
        {
            var individualStar = background.stars[i];
            background.context.fillRect(individualStar.x, 
                                            individualStar.y, 
                                            individualStar.size,
                                            individualStar.size);
        }
    }        

    function loop(){

        //calls itself (hence also render and update) once every given interval - see below
        requestAnimFrame(function(){
            loop();
        }); 

        update();
        render();
    }
        
//returns the supported version of requestAnimationFrame (OR returns custom 1000/60)
window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.oRequestAnimationFrame    ||
                window.msRequestAnimationFrame    ||            
                function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                };
})();