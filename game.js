
//TODO: hook with database.....OR create randowords generator....
        
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
                       
            if(time || accuracy || wpm)
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
            
            if(ship.ignitedEngine)
                $("#flash-effect").delay(500).fadeIn(500).fadeOut(500, function(){
                    $("#word-displayer").slideDown("250", detectTyping);  
                });
            else
                $("#word-displayer").delay(1500).slideDown("250", detectTyping);
            
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
                    addLetterToSpit(typedNow);
                    
                    if(game.actualLevel)
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
  