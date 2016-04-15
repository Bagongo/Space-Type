//TODO: hook with database.....OR create randowords generator....
var game = (function(){        
         
    var width = $("#backgroundCanvas").width();
    var height = $("#backgroundCanvas").height();
    var centerX = width / 2;
    var centerY = height / 2;
    var images = [];
    var loadedImages = 0;
    var requiredImages = 0;
    var currentText = "";
    var textsArray = [];
    var currentLevel = 0;
    var actualLevel = false;
    var lvlTime = 0;
    var errorCount = 0;
    var keyStrokes = 0;      


    //function to get random int within a specified range
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    //initialize and keep count of how many images get successfully loaded....  
    function initImages(paths)
    {            
        requiredImages = paths.length;

        for(i in paths)
        {
            var img = new Image();
            img.src = paths[i];
            images[i] = img;

            images[i].onload = function(){
            loadedImages++;
            };
        }           
    }

    //check how many images are loaded against the whole expected amount
    function checkImagesLoading()
    {
        if(loadedImages >= requiredImages)
            pullAndPrepareText("facts_sheet.txt"); //if all the imgs are there we can pull the text....
        else
        {
            setTimeout(function(){
                checkImagesLoading(); //...if not check again... 
            }, 100);
        }            
    }
    
    function pullAndPrepareText(filepath)
    {
        //Use Ajax call when some file will be online or scrap from file or pull form DB....
        $.ajax({
            type: "GET",
            url: filepath,
            dataType: "text",
            success: function(text){
                textsArray = text.split("\n");
                for(i in textsArray)
                {
                    if(textsArray[i] == "")
                        textsArray.splice(i,1);
                }                  
                init();
            }
        });       
    }

    function levelAndScoreMan()
    {             
        if(!actualLevel)
        {
            currentLevel++;
            errorCount = 0;
            keyStrokes = 0;
            actualLevel = true;
            formatAndDisplayText();
        }
        else
        {
            var time = (($.now() - lvlTime)/1000).toFixed(2);
            var wpm = ((keyStrokes / 5) / (time/60)).toFixed(1);
            var accuracy = Math.round((keyStrokes - errorCount) / keyStrokes * 100).toFixed(1);
            actualLevel = false;
            formatAndDisplayText(time, accuracy, wpm);
        }                           
    }

    function formatAndDisplayText(time, accuracy, wpm)
    { 
        var fixedText = "";
        var textToType = "";
        
        if (currentLevel == 0)
        {    
            currentText = textsArray[0];           
            var textToType = "" ;
            
            for(var i=0; i<currentText.length; i++)
                textToType += "<span id='char"+i+"'>"+currentText[i]+"</span>";
                
            $("<br />" + textToType).appendTo("#word-displayer");         
            $("#word-displayer").slideDown("250", detectTyping);
            
            return;
        }

        if(time)
        {
            currentText = textsArray[0];
            fixedText = "GOOD TYPING!<br /><br />Your stats:<br />----------------<br />Time - " + time + "s" + "<br />Accuracy - " + accuracy + "%" + "<br />Gross WPM - "+ wpm +"<br />----------------<br />Ready for another ride? <br /><br />";
        }
        else
        {
            currentText = textsArray[getRandomInt(1, textsArray.length - 1)];
        }

        for(var i=0; i<currentText.length; i++)
            textToType += "<span id='char"+i+"'>"+currentText[i]+"</span>";

        $("#word-displayer").slideUp("250", function(){
            $(this).html("<span style='color:green;'>"+fixedText+"</span>" + "<br />" + textToType);
        });      
        $("#flash-effect").delay(800).fadeIn(500).fadeOut(500, function(){
            $("#word-displayer").slideDown("250", detectTyping);  
        });

        shipAnimation(actualLevel, currentLevel);
    }

    function detectTyping()
    {             
        var typedNow = "";
        var letterIDX = 0;
        var tempTyped = "";
        var errorMarked = false;
        lvlTime = $.now();

        $("#input-text").focus();

        $(document).on("keypress", function(){
            keyStrokes++;
        });

        $(document).on("keyup", function(){

            errorMarked = false;
            ship.inertialState = true;
            background.residualAcceleration = background.starAcceleration;
            residualFrequency = background.starFrequency;

            if(tempTyped == currentText)
            {
                $(document).off();
                $("#input-text").blur();
                levelAndScoreMan();
            }
        });                      

        $(document).on("keypress", function(event){

            typedNow = String.fromCharCode(event.which);

            if(currentText.charAt(letterIDX) == typedNow)
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
                    errorCount++;
                }                   

                if(currentText.charAt(letterIDX) == " ")
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
    
    //pass an array with the path to the game images
    initImages(["imgs/ship_001.png"]);        
    //start checking the images loading status
    checkImagesLoading(); 
    
    return {
        width : width,
        height : height,
        centerX : centerX, 
        centerY : centerY,
        images: images,
        requiredImages : requiredImages,
        loadedImages : loadedImages,
        textsArray : textsArray,
        currentText : currentText,
        currentLevel : currentLevel,
        actualLevel : actualLevel,
        getRandomInt : getRandomInt,
        formatAndDisplayText : formatAndDisplayText,
        detectTyping : detectTyping
    };
    
})();
  