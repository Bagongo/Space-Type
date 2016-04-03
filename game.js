
//TODO: hook with database.....OR create randowords generator....
        var gametext = "Ready!\nTo type professionally you have to use home row. If you want to learn more about home row you can visit our homerow tab.\nThere are many coding languages.\nIs Pluto a planet? Many argue that Pluto isn't a planet, but what do you think? Pluto is a mysterious planet. It takes 15.1 years to get to Pluto in a shuttle.";
        
        var game = {           
            width : $("#backgroundCanvas").width(),
            height : $("#backgroundCanvas").height(),
            images : [],
            loadedImages : 0,
            requiredImages : 0,
            currentText : "",
            textsArray : [],
            currentLevel : 0,
            errorCount : 0,
            keyStrokes: 0
        }        
        game.centerX = game.width / 2;
        game.centerY = game.height / 2;
                
        //function to get random int within a specified range
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        
        function pullAndPrepareText(text)
        {
            /*Use Ajax call when some file will be online or scrap from file or pull form DB....
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
            }); */
            
            game.textsArray = text.split("\n");
            for(i in game.textsArray)
            {
                if(game.textsArray[i] == "")
                    game.textsArray.splice(i,1);
            }                  
            init();          
        }

        function levelManager()
        {       
                game.errorCount = 0;
                game.keyStrokes = 0;
                game.currentLevel++;
                game.currentText = game.textsArray[getRandomInt(1, game.textsArray.length - 1)];
                formatAndDisplayText();                            
        }
        
        function formatAndDisplayText()
        {                            
            var htmlToFill = "";           
            for(var i=0; i<game.currentText.length; i++)
                htmlToFill += "<span id='char"+i+"'>"+game.currentText[i]+"</span>";

            shipAnimation();
            
            $("#word-displayer").slideUp("250", function(){
                $(this).html(htmlToFill);
            });      
            $("#flash-effect").delay(800).fadeIn(500).fadeOut(500, function(){
                $("#word-displayer").slideDown("250", detectTyping);  
            });            
        }
        
        function detectTyping()
        {             
            var typedNow = "";
            var letterIDX = 0;
            var tempTyped = "";
            var errorMarked = false;
            
            $(document).on("keypress", function(){
                game.keyStrokes++;
            });
            
            $(document).on("keyup", function(){
                
                $("#controlpanel").html(game.errorCount);

                errorMarked = false;
                ship.inertialState = true;
                background.residualAcceleration = background.starAcceleration;
                residualFrequency = background.starFrequency;
                
                if(tempTyped == game.currentText)
                {
                    $(document).off();            
                    levelManager();
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
  