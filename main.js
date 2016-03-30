//wrapping all our code elements into a self-executing function to prevent external (hacking) access....
//(NOT strictly necessary since '(document).ready(function){};' has already wrapping functionality....)

(function(){ 
    $(document).ready(function(){
    
        var game = {};
        
        /* TODO: manage canvases size programatically from here????
        $("canvas").width(500);
        $("canvas").height($("canvas").width() * 4 / 3);
        
        game.width = $("canvas").width();
        game.height = $("canvas").height();
        */
        
        //point contexts to the canvases
        game.backgroundContext = document.getElementById("backgroundCanvas").getContext("2d");
        game.playerContext = document.getElementById("playerCanvas").getContext("2d");
        //game.flashFX = document.getElementById("flash-effect").getContext("2d");
        
        //set global positioning and scale vars
        game.width = $("#backgroundCanvas").width();
        game.height = $("#backgroundCanvas").height();       
        game.centerX = game.width / 2;
        game.centerY = game.height / 2;
        
        //create images array and counters
        game.images = [];
        game.loadedImages = 0;
        game.requiredImages = 0;   
        
        //array holding background stars data....
        game.BGstars = [];
        game.starFrequency = 1;
        game.starAcceleration = 1;
        
        game.player = {
            x : game.centerX - 61,
            y : game.centerY * 3/2,
            yStart : game.centerY * 3/2,
            width : 112,
            height : 75,
            animte : false
        };
        
        game.inertialState = true;
        game.residualAcceleration;
        game.residualFrequency;
                
        //TODO: hook with database.....OR create randowords generator....
        game.textsArray = [];  
        
        game.currentText = "";    
        //game.wordComplete = false;
        //game.wordDisplayed = false;
        
        //function to get random int within a specified range
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        
        //init function - starting point of the game interactivity
        function init(){
                        
            addStars(500, game.starFrequency)
            
            //draws the player TODO: create function to draw all elements!!!! 
            game.playerContext.drawImage(game.images[0], game.player.x, game.player.y);
            
            //console.log("from Init(): " + game.textsArray);
            
            selectAndDisplayText();
            
            loop();           
        }
                                      
        function detectTyping()
        {
            var typedNow = "";
            var letterIDX = 0;
            var tempTyped = "";
            
            $(document).on("keyup", function(){
                
                game.inertialState = true;
                game.residualAcceleration = game.starAcceleration;
                game.residualFrequency = game.starFrequency;
                
                if(tempTyped == game.currentText)
                    selectAndDisplayText();
            });                      
            
            $(document).on("keypress", function(event){
                typedNow = String.fromCharCode(event.which);
                
                game.player.animate = true;
                
                if(game.currentText.charAt(letterIDX) == typedNow)
                {
                    game.inertialState = false;
                    
                    $("#char" + letterIDX).css("color", "green");
                    $("#char" + letterIDX).animate({
                        marginRight: "1px"
                    }).animate({
                        marginRight: "0"
                    });
                    
                    if(typedNow == " ")
                        $("#char" + letterIDX).text(" ");
                    
                    tempTyped += typedNow;
                    letterIDX++;
                    starsThrusting(true);
                    //console.log(tempTyped);
                }
                else
                {
                    if(game.currentText.charAt(letterIDX) == " ")
                        $("#char" + letterIDX).text("_");
                    
                    $("#char" + letterIDX).css("color", "red");
                    $("#char" + letterIDX).stop(true).animate({
                        fontSize: "1.2em",
                        margin: "1px"
                    }).animate({
                        fontSize: "1em",
                        margin: "0"
                    });
                    
                    starsThrusting(false);
                }
            });   
        }
        
        function pullAndFormatText(filepath)
        {
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

        function selectAndDisplayText(){
    
            $(document).off();            
            
            game.currentText = game.textsArray[getRandomInt(0, game.textsArray.length - 1)];
            
            var htmlToFill = "";           
            for(var i=0; i<game.currentText.length; i++)
                htmlToFill += "<span id='char"+i+"'>"+game.currentText[i]+"</span>";
                        
            $("#word-displayer").slideUp("250", function(){
                        $(this).html(htmlToFill);
            });
            
            $("#flash-effect").fadeIn(500).fadeOut(500);            
            $("#word-displayer").slideDown("250", detectTyping());  
        }

        function starsThrusting(upThrust)
        {
            if(upThrust)
            {
                game.starAcceleration = Math.min(20, game.starAcceleration + 1);
                game.starFrequency = Math.max(1, game.starAcceleration/4);
            }
            else
            {
                game.starAcceleration =  Math.max(1, game.starAcceleration - 1);
                game.starFrequency = Math.max(1, game.starAcceleration/4);
            }                    
        }
            
        function decelarateStars(time)
        {
            if (game.starAcceleration > 1)
            {
                game.starAcceleration -= game.residualAcceleration / (60 * time);
                game.starFrequency += game.residualFrequency / (time * 60 * 4);  
            }
            else
            {
                game.starAcceleration = 1;
                game.starFrequency = 1;
            }
        }
        
        function shipAnimation()
        {
            var beenOut = false;
            game.player.y -= 4;
            
            if(game.player.y < -100)
            {
                game.player.y = game.height + 100;
                beenOut = true;
            }
            if(game.player.y > game.player.yStart && beenOut)
            {
                game.player.y = game.player.yStart;
                beenOut = false;
                game.player.animate = false;
            }
            
            //console.log(game.player.y + " " + beenOut);
        }
        
        //updates all the data regarding game objects
        function update(){
            
            addStars(game.starFrequency, 2);
            
            for(i in game.BGstars)
            {     
                game.BGstars[i].y += (game.BGstars[i].speed * game.starAcceleration);
                
                if(game.BGstars[i].y > game.height)
                    game.BGstars.splice(i,1);
            }
            
            if(game.inertialState)
                decelarateStars(2);
            
            if(game.player.animate)
                shipAnimation();
                
            $("#controlpanel").html(game.starAcceleration);               
        }
        
        //renders the changes to game objects occured in 'update'
        function render(){
            
            
             
            game.backgroundContext.fillStyle = "white";            
            game.backgroundContext.clearRect(0, 0, game.width, game.height); //clears the screen on every interval

            //creates rects -stars- for every element in the BGstars array
            for(i in game.BGstars)
            {
                var individualStar = game.BGstars[i];
                game.backgroundContext.fillRect(individualStar.x, 
                                                individualStar.y, 
                                                individualStar.size,
                                                individualStar.size);
            }
        }
        
        //put num of elements in the BGstars array (/w properly randomized properties)....
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
                                                               
                game.BGstars.push({
                    x: Math.floor(Math.random() * game.width),
                    y: starH,
                    size: starS,
                    speed: starSpeed
                });
            }           
        }
        
        //the core of the game engine powered by 'requestAnimFrame'
        function loop(){
            
            //calls itself (hence also render and update) once every given interval - see below
            requestAnimFrame(function(){
                loop();
            }); 

            update();
            render();
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
        
        //check how many images are loaded against the whole expect amount
        function checkImagesLoading()
        {
            if(game.loadedImages >= game.requiredImages)
                pullAndFormatText("SpaceType_paragraphs.txt"); //if all the imgs are there we can pull the text from the text file....
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
        
    });
})();

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