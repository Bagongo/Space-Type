
$.ajax({
    type        : 'POST',
    url         : 'check_user.php',
    dataType    : 'json',
    encode      : true
        })
    .done(function(data){        
        if(data)
        {
            game.settings = data;
            displayLoggedUser();
        }
    });
       
var logoContext = document.getElementById("logo").getContext("2d");

for(var i=1; i<=200; i++)
{   
    var x = getRandomInt(50, 750);
    var y = getRandomInt(10, 160);
    var size = getRandomInt(1,3);
    var colors = ["#bed9dd", "#b0dce3", "#8ecdd8" ];
    logoContext.fillStyle = colors[getRandomInt(1, 3)];
    logoContext.fillRect(x,y,size,size);
        
//    if(i%8 == 0)
//    {
//        lx = getRandomInt(100, 700);
//        ly = getRandomInt(10, 160);
//        var charset = "abcdefghijklmnopqrstuvwxyz";
//        var randLetter = charset.charAt(Math.floor(Math.random() * charset.length));
//        logoContext.font = "bold " + getRandomInt(5, 15)+"px" + " monaco";
//        logoContext.fillStyle = "#35f085";
//        logoContext.fillText(randLetter, lx, ly);   
//    }
}

//setInterval(twinkleStars, 2000);
//
//function twinkleStars()
//{
//    for(var i=0; i < logoStrs.length; i+= getRandomInt(1,2))
//    {
//        logoContext.clearRect(logoStrs[i].x, logoStrs[i].y, logoStrs[i].size, logoStrs[i].size);
//        logoContext.fillStyle = colors[getRandomInt(1, 3)];
//        var size = getRandomInt(1,3);
//        logoContext.fillRect(logoStrs[i].x, logoStrs[i].y, size, size);
//    }
//}
    


logoContext.shadowColor = "#209ac7";
logoContext.shadowOffsetX = 0; 
logoContext.shadowOffsetY = 5; 
logoContext.shadowBlur = 90;
logoContext.font = "bold 100px monaco";
logoContext.fillStyle = "#24ef52";
logoContext.baseline = "middle";
logoContext.textAlign = "center";

logoContext.fillText("SpaceType", 400, 110);
logoContext.fillStyle = "green";
logoContext.fillText("SpaceType", 400, 105);

var buttonClickEnabled = true;

$(".deck-button").hover(function(){
    var $pushable = $(this).children().eq(1);
    var $label = $(this).children().eq(2);

    $pushable.attr("cy", "78");
    $pushable.attr("ry", "11");
    $pushable.attr("rx", "29");
    
    $label.attr("fill", "#fcfcb1")}, 
    
    function(){    
        var $pushable = $(this).children().eq(1);
        var $label = $(this).children().eq(2);

        $pushable.attr("cy", "77");
        $pushable.attr("ry", "12");
        $pushable.attr("rx", "30");

        $label.attr("fill", "blue")
    });

$(".deck-button").on("click", function(){
    
    if(buttonClickEnabled)
    {
        $(document).off();
        
        var labelText = $(this).children().eq(2).text().toLowerCase();

        if(game.state !== labelText)       
            stateManager(labelText);

        buttonClickEnabled = false;
    }
    
    setTimeout(function(){
        buttonClickEnabled = true;
    }, 2000);
});

$("form").submit(function(event) { //if buttonClickEnabled????

        var formData = {
            'submit'    : $(this).find('input[type=submit]').attr("value"),
            'username'              : $(this).find('input[name=username]').val(),
            'pw'             : $(this).find('input[name=pw]').val(),
            'confirmpw'    : $(this).find('input[name=confirmpw]').val()
        };
    
        //console.log(formData.score);

        $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : 'signup_login.php', // the url where we want to POST
            data        : formData, // our data object
            dataType    : 'json', // what type of data do we expect back from the server
            encode      : true
        })
            .done(function(data) {
            
                if(!data.errorMsg)
                    game.settings = data;
                
                handleFormResult(formData.submit, data.errorMsg);
        });

        event.preventDefault();
    });

function handleFormResult(source, errormsg)
{
    if(buttonClickEnabled)
    {   
        buttonClickEnabled = false;
        var $thisDisplayer = $("[value='"+source+"']").parents("form").siblings(".messagedisplayer"); 
        
        alert($thisDisplayer.html());
      
        
        
        var successMsg;
            
        $(".messagedisplayer").slideUp(250); 
        
        setTimeout(function(){          
            if(errormsg)
                $thisDisplayer.html(errormsg).css("color", "red").slideDown(250);
            else
            {               
                if(source === "Log In!")
                    successMsg = "You successfully logged in as: ";
                else if (source === "Sign Up!")
                    successMsg = "You successfully signed up as: ";
                else if (source === "Log Out!")
                    successMsg = "You logged out!"
                
                $thisDisplayer.html(successMsg).css("color", "green").slideDown(250);
                displayLoggedUser();
                stateManager("play");
            }
        }, 250);

        setTimeout(function(){
            buttonClickEnabled = true;
        }, 1000);
    }    
}

function displayLoggedUser()
{
    var loggedInId = (game.settings.loggedIn) ? "Logged in as: " + game.settings.username : "Not Logged In";           
    $("#loggeduser").children("div").html(loggedInId);
}

$("#logout-btn").on("click", function(){
    if(game.settings.loggedIn)
    {
        $.ajax({
                type        : 'POST',
                url         : 'destroy_ssn.php',
                dataType    : 'json',
                encode      : true
        })
        .done(function(data){        
            game.settings = data;
            displayLoggedUser();
            handleFormResult($("#logout-btn").attr("value"))
        });
    }
    else
        handleFormResult($("#logout-btn").attr("value"), "you are not logged in...");
});