
//TODO: hook with database.....OR create randowords generator....
        
var game = {           
    width : $("#backgroundCanvas").width(),
    height : $("#backgroundCanvas").height(),
    images : [],
    loadedImages : 0,
    requiredImages : 0,
    currentText : "",
    textsArray : [],
    introMessage: $("#intro-message").html(),
    screenDelays: 500,
    state : null,
    prevState: null,
    currentLevel : 0,
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

function stateManager(externalInput)
{
    if(externalInput)
    {   
        game.state = externalInput;
        
        switch(game.state)
        {
            case "play":
                game.state = "init";
                switchScreen();
                break;
            case "hi-score":
                switchScreen();
                break;               
        }
    }
    else
    { 
        switch (game.state)
        {    
            case null:
                game.state = "init";
                formatText();
                break;
            case "init":
            case "score":
                game.state = "game";
                levelAndScoreMan();
                formatText();
                break;
            case "game": 
                game.state = "score";
                levelAndScoreMan();
                break;
            default :
                $("#word-displayer").slideUp("250", function(){
                    $(this).html("Opps!!! A state-related error has occured....");
                }).slideDown("250");
        }
    }
}

function switchScreen()
{
    ship.ignitedEngine = false;
    ship.animate = true;
    
    $("#word-displayer").slideUp(game.screenDelays, function(){
        
        if(game.state == "hi-score")
        {
           var displayText = "<span style='color:green;'>your high-score: </span>"; 
        }
        else if(game.state == "init")
        {
            formatText();
            return;
        }
        
        $(this).html(displayText);
        
    }).delay(game.screenDelays).slideDown(game.screenDelays);   
}

function screenCleared()
{
    ship.animate = true;
    
    $("#word-displayer").slideUp(game.screenDelays, function(){
        
        if(game.state == "game")
        {
            $("#flash-effect").fadeIn(game.screenDelays/2).fadeOut(game.screenDelays/2);
            animationFx.play();            
        }         
        stateManager();
    });
}

function levelAndScoreMan()
{ 
    if(game.state == "init")
        game.currentLevel = 0;
    if(game.state == "game")
    {
        game.currentLevel++;
        game.errorCount = 0;
        game.keyStrokes = 0;
    }
    else if (game.state == "score")
    {
        var time = (($.now() - game.lvlTime)/1000).toFixed(2);
        var wpm = ((game.keyStrokes / 5) / (time/60)).toFixed(1);
        var accuracy = Math.round((game.keyStrokes - game.errorCount) / game.keyStrokes * 100).toFixed(1);
        formatText(time, accuracy, wpm);
    } 
}

function formatText(time, accuracy, wpm)
{ 
    var fixedText = "";
    var textToType = "";

    if(game.state == "init")
    {
        fixedText = game.introMessage;
        game.currentText = game.textsArray[0];
    }

    if(game.state == "score")
    {                      
        fixedText = "GOOD TYPING!<br /><br />Your stats:<br />----------------<br />Time - " + time + "s" + "<br />Accuracy - " + accuracy + "%" + "<br />Gross WPM - "+ wpm +"<br />----------------<br />Ready for another ride? <br /><br />";
        game.currentText = game.textsArray[0];
    }

    if(game.state == "game")
    {
        game.currentText = game.textsArray[getRandomInt(1, game.textsArray.length - 1)];
    }
    
        for(var i=0; i<game.currentText.length; i++)
            textToType += "<span id='char"+i+"'>"+game.currentText[i]+"</span>";
   
    $("#word-displayer").html("<span style='color:green;'>"+fixedText+"</span>" + "<br />" + textToType);

    displayText();
}

function displayText()
{
    $("#word-displayer").delay(game.screenDelays).slideDown(game.screenDelays, detectTyping);  
}

function detectTyping()
{             
    var typedNow = "";
    var letterIDX = 0;
    var tempTyped = "";
    var errorMarked = false;
    game.lvlTime = $.now();

    $(document).on("keypress", function(){
        game.keyStrokes++;
    });

    $(document).on("keyup", function(){

        errorMarked = false;
        background.residualAcceleration = background.starAcceleration;
        residualFrequency = background.starFrequency;

        if(tempTyped == game.currentText)
        {
            $(document).off();
            screenCleared();
        }
    });                      

    $(document).on("keypress", function(event){

        if(event.which == 32  || event.which == 39)
            event.preventDefault();

        typedNow = String.fromCharCode(event.which);

        if(game.currentText.charAt(letterIDX) == typedNow)
        {
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

            if(game.state == "game")
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
