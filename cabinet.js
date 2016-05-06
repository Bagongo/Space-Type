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

$(".deck-button").hover(function(){
    var $pushable = $(this).children().eq(1);
    var $label = $(this).children().eq(2);

    $pushable.attr("cy", "78");
    $pushable.attr("ry", "11");
    $pushable.attr("rx", "29");
    
    $label.attr("fill", "#fcfcb1")
    
}, function(){   
    var $pushable = $(this).children().eq(1);
    var $label = $(this).children().eq(2);
                 
    $pushable.attr("cy", "77");
    $pushable.attr("ry", "12");
    $pushable.attr("rx", "30");

    $label.attr("fill", "blue")
});

var buttonClickenabled = true;

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
    }, 3000)
});
