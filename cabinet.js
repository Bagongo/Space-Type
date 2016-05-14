
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
            setUser();
        }
    });

function setUser()
{
    $("#login-result").html(game.settings.username);
}
       
var logoContext = document.getElementById("logo").getContext("2d");

logoContext.shadowColor = "#209ac7";
logoContext.shadowOffsetX = 0; 
logoContext.shadowOffsetY = 5; 
logoContext.shadowBlur = 90;
logoContext.font = "bold 100px monaco";
logoContext.fillStyle = "#05a205";
logoContext.baseline = "middle";
logoContext.textAlign = "center";

logoContext.fillText("SpaceType", 400, 110);
logoContext.fillStyle = "green";
logoContext.fillText("SpaceType", 400, 105);

var buttonClickenabled = true;

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
    
    if(buttonClickenabled)
    {
        $(document).off();
        
        var labelText = $(this).children().eq(2).text().toLowerCase();

        if(game.state !== labelText)       
            stateManager(labelText);

        buttonClickenabled = false;
    }
    
    setTimeout(function(){
        buttonClickenabled = true;
    }, 2000);
});

$("form").submit(function(event) { //if buttonClickEnabled????

        // get the form data
        // there are many ways to get this data using jQuery (you can use the class or id also)
        var formData = {
            'submit'    : $(this).find('input[type=submit]').attr("value"),
            'username'              : $(this).find('input[name=username]').val(),
            'pw'             : $(this).find('input[name=pw]').val(),
            'confirmpw'    : $(this).find('input[name=confirmpw]').val()
        };

        $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : 'signup_login.php', // the url where we want to POST
            data        : formData, // our data object
            dataType    : 'json', // what type of data do we expect back from the server
                        encode          : true
        })
            .done(function(data) {
                        
                game.settings = data;                
                displayFormResult(formData.submit, data.errorMsg);
        });

        event.preventDefault();
    });

function displayFormResult(source, errormsg, username)
{
    if(buttonClickenabled)
    {
        
        buttonClickenabled = false;
        var $thisDisplayer = $("[value='"+source+"']").parent().siblings(".messagedisplayer"); 
        var successMsg;
            
        console.log($thisDisplayer.html())

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
            }
        }, 250);

        setTimeout(function(){
            buttonClickenabled = true;
        }, 1000);
    }    
}

$("#logout-btn").on("click", function(){
    //(if loggedIn) <-- add condition....
    document.cookie = 'auth_k=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    displayFormResult($(this).attr("value"));
});