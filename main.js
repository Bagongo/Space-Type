        
        function init(){
           
            addStars(500, 1) 
            
            ship.animate = true;
            
            stateManager();
            
            loop();           
        }
        
        function update(){
            
            addStars(neededStars(), 2);           
            updateStars();
            
            decelarateStars(2.5);
            
            if(ship.animate)
                shipAnimation();
            
            engineFxMan();
                                    
            $("#controlpanel").html(background.starAcceleration +"\n");            
        }
        
        function render(){
            
            ship.context.clearRect(ship.x, ship.y, ship.width, game.height - ship.y);
                                     
            if(ship.ignitedEngine)
            {
                if(!ship.animate && ship.lettersToSpitOut.length > 0)
                    spitLetters(); 

                afterBurner();
            }

            ship.context.drawImage(game.images[0], ship.x, ship.y, ship.width, ship.height);
                                          
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

        function pullAndPrepareText(filepath)
        {
            //Use Ajax call when some file will be online or scrap from file or pull form DB....
            $.ajax({
                type: "GET",
                url: filepath,
                dataType: "text",
                success: function(text){
                    game.textsArray = text.split("\n");
                    for(i in game.textsArray)
                    {
                        if(game.textsArray[i] == "")
                            game.textsArray.splice(i,1);
                    }                  
                    init();
                }
            });       
        }
        
        //initialize and keep count of how many images get successfully loaded....  
        function initImages(paths)
        {            
            game.requiredImages = paths.length;
            
            for(i in paths)
            {
                var img = new Image();
                img.src = paths[i];
                game.images[i] = img;
                
                game.images[i].onload = function(){
                    game.loadedImages++;
                };
            }           
        }
        
        //check how many images are loaded against the whole expected amount
        function checkImagesLoading()
        {
            if(game.loadedImages >= game.requiredImages)
                pullAndPrepareText("facts_sheet.txt"); //if all the imgs are there we can pull the text....
            else
            {
                setTimeout(function(){
                    checkImagesLoading(); //...if not check again... 
                }, 100);
            }            
        }
  
        //pass an array with the path to the game images
        initImages(["imgs/ship_001.png"]);        
        //start checking the images loading status
        checkImagesLoading(); 
        
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