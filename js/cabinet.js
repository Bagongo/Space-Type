$.ajax({
    type        : 'POST',
    url         : '../php/check_user.php',
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

for(var i=1; i<=250; i++)
{   
    var x = getRandomInt(70, 730);
    var y = getRandomInt(20, 180);
    var size = getRandomInt(1,3);
    var colors = ["#bed9dd", "#b0dce3", "#8ecdd8" ];
    logoContext.fillStyle = colors[getRandomInt(1, 3)];
    logoContext.fillRect(x,y,size,size);
}

for (var i=1; i<=50; i++)
{
    var x;
    var y;
    
    if(i <= 20)
    { 
        y = i * 8 + 20;
        
        if(i % 2 === 0)
            x = getRandomInt(50, 100);
        else
            x = getRandomInt(680, 730);
    }
    
    if(i > 20)
    {
        x = (i-16) * 20;
        
        if(i % 2 === 0)
            y = getRandomInt(30, 50);
        else
            y = getRandomInt(160, 180);                
    }

    var charset = "abcdefghijklmnopqrstuvwxyz";
    var randLetter = charset.charAt(Math.floor(Math.random() * charset.length));
    logoContext.font = "bold " + getRandomInt(5, 12)+"px" + " monaco";
    logoContext.fillStyle = "#35f085";
    logoContext.fillText(randLetter, x, y);   
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
logoContext.shadowBlur = 150;
logoContext.font = "bold 100px monaco";
logoContext.fillStyle = "#24ef52";
logoContext.baseline = "middle";
logoContext.textAlign = "center";

logoContext.fillText("SpaceType", 400, 135);
logoContext.fillStyle = "green";
logoContext.fillText("SpaceType", 400, 130);

var buttonClickEnabled = true;

$(".deck-button").hover(function(){
    
    if($(this).hasClass("hover-enabled"))
    {   
        var $pushable = $(this).children().eq(1);
        var $label = $(this).children().eq(2);

        $pushable.attr("cy", "128");
        $pushable.attr("ry", "11");
        $pushable.attr("rx", "29");

        $label.attr("fill", "#fcfcb1");
    }
    
}, function(){ 
        if($(this).hasClass("hover-enabled"))
        {   
            var $pushable = $(this).children().eq(1);
            var $label = $(this).children().eq(2);

            $pushable.attr("cy", "127");
            $pushable.attr("ry", "12");
            $pushable.attr("rx", "30");

            $label.attr("fill", "#22356a");
        }
    });

$(".deck-button").on("click", function(){
    
    if(buttonClickEnabled)
    {
        $(document).off();
        
        $(".deck-button").each(function(){
            var $pushable = $(this).children().eq(1);
            var $label = $(this).children().eq(2);

            $pushable.attr("cy", "127");
            $pushable.attr("ry", "12");
            $pushable.attr("rx", "30");

            $label.attr("fill", "#22356a");
            
            $(this).addClass('hover-enabled');
        });
        
        var $pushable = $(this).children().eq(1);
        var $label = $(this).children().eq(2);

        $pushable.attr("cy", "128");
        $pushable.attr("ry", "11");
        $pushable.attr("rx", "29");    
        $label.attr("fill", "#fcfcb1");
        $(this).removeClass('hover-enabled');
      
        var labelText = $label.text().toLowerCase();

        if(game.state !== labelText)       
            stateManager(labelText);

        buttonClickEnabled = false;
    }
    
    setTimeout(function(){
        buttonClickEnabled = true;
    }, 2000);
});

$("form").submit(function(event) {
    
    event.preventDefault();

    if(buttonClickEnabled)
    {
        buttonClickEnabled = false;
        
        var formData = {
            'submit'    : $(this).find('input[type=submit]').attr("value"),
            'username'              : $(this).find('input[name=username]').val(),
            'pw'             : $(this).find('input[name=pw]').val(),
            'confirmpw'    : $(this).find('input[name=confirmpw]').val()
        };
    
        //console.log(formData.score);

        $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : '../php/signup_login.php', // the url where we want to POST
            data        : formData, // our data object
            dataType    : 'json', // what type of data do we expect back from the server
            encode      : true
        })
            .done(function(data) {
            
                if(!data.errorMsg)
                    game.settings = data;
                
            handleLogginAndSigning(formData.submit, data.errorMsg);
        });
        
        setTimeout(function(){
            buttonClickEnabled = true;
        }, 1000);
    }
});

function handleLogginAndSigning(source, errormsg)
{  
    var $thisDisplayer = $("[value='"+source+"']").parents("form").siblings(".messagedisplayer"); 

    var successMsg;

    $(".messagedisplayer").slideUp(250, function(){
        
        setTimeout(function(){
            
            if(errormsg)
                $thisDisplayer.html(errormsg).css("color", "red");
            else
            {               
                if(source === "Log In")
                    successMsg = "You successfully logged in as: " +game.settings.username;
                else if (source === "Sign Up")
                    successMsg = "You successfully signed up as: " +game.settings.username;
                else if(source === "Log Out")
                {
                    successMsg = "You successfully logged out.";
                    $thisDisplayer = $("#login-form").siblings(".messagedisplayer");
                }

                $thisDisplayer.html(successMsg).css("color", "green");
                $(".deck-button:first").click();
                displayLoggedUser();
            }

            $thisDisplayer.slideDown(250);
            
        }, 500);
    });
}    

function displayLoggedUser()
{ 
    var loggedInId = (game.settings.loggedIn) ? game.settings.username : "Not logged in";
    var color = (game.settings.loggedIn)? "green" : "orange";
    
    $("#loggeduser > div > div").fadeOut(250, function(){
        $(this).css("color", color);
        if(!game.settings.loggedIn)
            $(this).html(loggedInId).fadeIn();
        else
            $(this).html(loggedInId).css("margin-left", "-250px").fadeIn().animate({marginLeft : "0px"}, 250);
        
    });
}

$("#logout-btn").on("click", function(){
    
    $(".messagedisplayer").slideUp(250);

    if(game.settings.loggedIn)
    {
        $.ajax({
                type        : 'POST',
                url         : '../php/destroy_ssn.php',
                dataType    : 'json',
                encode      : true
        })
        .done(function(data){        
            game.settings = data;
            handleLogginAndSigning("Log Out");
        });
    }
    else
        displayLoggedUser();
});