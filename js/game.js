
//TODO: hook with database.....OR create randowords generator....
        
var game = {           
    width : $("#backgroundCanvas").width(),
    height : $("#backgroundCanvas").height(),
    images : [],
    loadedImages : 0,
    requiredImages : 0,
    currentText : "",
    textsArray : [],
    settings : {
            loggedIn: false,
            username: "",
            score: {
                besttime: 0,
                bestacc: 0,
                bestwpm: 0
            }              
               },
    introMessage: $("#intro-message").html(),
    aboutMessage : $("#about-message").html(),
    screenDelays: 500,
    state : null,
    prevState: null,
    currentLevel : 0,
    lvlTime : 0,
    errorCount : 0,
    keyStrokes: 0
};

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
            case "about":
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

function displayHiscore(data)
{
    var localBestMsg;
    
    if(game.settings.score.besttime === 0)
        localBestMsg = "You haven't set any hi-score yet<br />or you are not logged in...";
    else    
        localBestMsg = "Your Hi-score:<br />----------------<br />Best time - "+game.settings.score.besttime+"s" + "<br />Best accuracy - " + game.settings.score.bestacc+"%" + "<br />Best gross WPM - " + game.settings.score.bestwpm + "<br />----------------<br />";

    var globalbestMsg = "<br /><br />World's Best Spacetypers:<br />----------------<br /><br />";
    var medals = ["#fcbc47", "#A8A8A8", "#965A38"];
    for (var i in data)  
        globalbestMsg += ("<span style='color:"+medals[i]+"'>" + (i*1+1) + ": " + data[i][0] + " - Fastest type: " + data[i][1]+ "</span><br /><br />");

    var htmlToDisplay = localBestMsg + "<br />" + globalbestMsg + "----------------";

    $("#word-displayer").html(htmlToDisplay).slideDown(game.screenDelays);
}

function getSetHighscore(newHiscore)
{            
    $.ajax({
    type        : 'POST',
    url         : '/php/get_set_hiscore.php',
    data        : newHiscore,
    dataType    : 'json',
    encode      : true
        })
    .done(function(data){       
        if(!newHiscore && data)
            displayHiscore(data);
    });
}

function switchScreen()
{    
    $(document).off();
    
    ship.ignitedEngine = false;
    ship.animate = true;
    
    var displayText;
    
    $("#word-displayer").slideUp(game.screenDelays, function(){
        
        if(game.state == "hi-score")
        {
            getSetHighscore();
            return;           
        }
        else if(game.state == "init")
        {
            formatText();
            return;
        }
        else if(game.state == "about")
        {
            displayText = game.aboutMessage;                       
        }
        
        //following code not reachable. Use switch statement instead?????
        
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

function elaborateScore()
{
    var time = Number((($.now() - game.lvlTime)/1000).toFixed(2));
    var accuracy = Number(((game.keyStrokes - game.errorCount) / game.keyStrokes * 100).toFixed(1));
    var wpm = Number(((game.keyStrokes / 5) / (time/60)).toFixed(1));
    
    var newBest;
    var hiscorePrep = "*** NEW HI-SCORE *** - ";
    
    if(game.settings.loggedIn)
    { 
        if(time < game.settings.score.besttime || game.settings.score.besttime === 0)
        {
            newBest = true;
            game.settings.score.besttime = time;
            time = hiscorePrep + time;
        }
        if(accuracy > game.settings.score.bestacc)
        {
            newBest = true;
            game.settings.score.bestacc = accuracy;
            accuracy = hiscorePrep + accuracy;
        }
        if(wpm > game.settings.score.bestwpm)
        {
            newBest = true;
            game.settings.score.bestwpm = wpm;
            wpm = hiscorePrep + wpm;        
        }
    }
    
    var elaboratedScore = {time:time, accuracy:accuracy, wpm:wpm};
    
    return {elaboratedScore:elaboratedScore, newBest:newBest};    
}

function levelAndScoreMan()
{ 
    if(game.state == "init")
        game.currentLevel = 0;
    else if(game.state == "game")
        game.currentLevel++;
    else if (game.state == "score")
    {
        var scoreResult = elaborateScore();    
        formatText(scoreResult.elaboratedScore.time, scoreResult.elaboratedScore.accuracy, scoreResult.elaboratedScore.wpm);
        
        if(scoreResult.newBest && game.settings.loggedIn)               
            getSetHighscore(game.settings.score);
    }
    
    game.errorCount = 0;
    game.keyStrokes = 0; 
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
        fixedText = "GOOD TYPING!<br /><br />Your stats:<br />----------------<br />Time - " + time + "s" + "<br />Accuracy - " + accuracy + "%" + "<br />Gross WPM - " + wpm + "<br />----------------<br />Ready for another ride? <br /><br />";
        game.currentText = game.textsArray[0];
    }

    if(game.state == "game")
    {
        game.currentText = game.textsArray[getRandomInt(1, game.textsArray.length - 1)];
    }
    
        for(var i=0; i<game.currentText.length; i++)
            textToType += "<span id='char"+i+"' style='color:#656503'>"+game.currentText[i]+"</span>";
   
    $("#word-displayer").html( fixedText + "<br />" + textToType);

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
        
        game.keyStrokes++;

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
