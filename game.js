
//TODO: hook with database.....OR create randowords generator....
        var gametext = "Ready!\nTo type professionally you have to use home row. If you want to learn more about home row you can visit our homerow tab.\nThere are many coding languages.\nIs Pluto a planet? Many argue that Pluto isn't a planet, but what do you think? Pluto is a mysterious planet. It takes 15.1 years to get to Pluto in a shuttle.\nThere are 100 billion stars per galaxy. Scientists estimate that there are over 10 billion galaxies in the universe.\nThe sun is really big. The sun is so big that one million earths can fit inside the Sun.\nThe first living thing to enter space were actually two dogs named Belka and Strelka. Both of them made it back alive.\n10 letters";
        
        var game = {           
            width : $("#backgroundCanvas").width(),
            height : $("#backgroundCanvas").height(),
            images : [],
            loadedImages : 0,
            requiredImages : 0,
            currentText : "",
            textsArray : [],
            currentLevel : 0,
            actualLevel: false,
            lvlTime : 0,
            errorCount : 0,
            keyStrokes: 0
        }
        
        game.centerX = game.width / 2;
        game.centerY = game.height / 2;

        var brakeFx = new Audio("sound/brake.ogg");
        var animationFx = new Audio("sound/swoosh_01.ogg"); 

        brakeFx.volume = 0.2;
        animationFx.volume = 0.2;

        /*var fx = new Howl({
            urls: ["sound/engine.ogg"],
            autoplay: false,
            loop: true,
            volume: 0.1,
            rate: 0.4
        });           
        fx.play();
        fx.rate = 2;
        */
                        
        //function to get random int within a specified range
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function levelAndScoreMan()
        {             
            if(!game.actualLevel)
            {
                game.currentLevel++;
                game.errorCount = 0;
                game.keyStrokes = 0;
                game.actualLevel = true;
                formatAndDisplayText();
            }
            else
            {
                var time = (($.now() - game.lvlTime)/1000).toFixed(2);
                var wpm = ((game.keyStrokes / 5) / (time/60)).toFixed(1);
                var accuracy = Math.round((game.keyStrokes - game.errorCount) / game.keyStrokes * 100).toFixed(1);
                game.actualLevel = false;
                formatAndDisplayText(time, accuracy, wpm);
            }                           
        }
        
        function formatAndDisplayText(time, accuracy, wpm)
        { 
            var fixedText = "";
            var textToType = ""; 
                       
            if(time)
            {
                game.currentText = game.textsArray[0];
                fixedText = "GOOD TYPING!<br /><br />Your stats:<br />----------------<br />Time - " + time + "s" + "<br />Accuracy - " + accuracy + "%" + "<br />Gross WPM - "+ wpm +"<br />----------------<br />Ready for another ride? <br /><br />";
            }
            else
            {
                game.currentText = game.textsArray[getRandomInt(1, game.textsArray.length - 1)];
            }
           
            for(var i=0; i<game.currentText.length; i++)
                textToType += "<span id='char"+i+"'>"+game.currentText[i]+"</span>";
            
            $("#word-displayer").slideUp("250", function(){
                $(this).html("<span style='color:green;'>"+fixedText+"</span>" + "<br />" + textToType);
            });      
            $("#flash-effect").delay(800).fadeIn(500).fadeOut(500, function(){
                $("#word-displayer").slideDown("250", detectTyping);  
            });  
            
            shipAnimation();
        }
        
        function detectTyping()
        {             
            var typedNow = "";
            var letterIDX = 0;
            var tempTyped = "";
            var errorMarked = false;
            game.lvlTime = $.now();
            
            $("#input-text").focus();
            
            $(document).on("keypress", function(){
                game.keyStrokes++;
            });
            
            $(document).on("keyup", function(){
    
                errorMarked = false;
                ship.inertialState = true;
                background.residualAcceleration = background.starAcceleration;
                residualFrequency = background.starFrequency;
                
                if(tempTyped == game.currentText)
                {
                    $(document).off();
                    $("#input-text").blur();
                    levelAndScoreMan();
                }
            });                      
            
            $(document).on("keypress", function(event){
                
                typedNow = String.fromCharCode(event.which);
                                
                if(game.currentText.charAt(letterIDX) == typedNow)
                {
                    ship.inertialState = false;
                    
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
                    thruster(true);
                    //console.log(tempTyped);
                }
                else
                {                       
                    if(!errorMarked)
                    {
                        errorMarked = true;
                        game.errorCount++;
                    }                   
                    
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
                    
                    thruster(false);
                }
            });   
        }
  