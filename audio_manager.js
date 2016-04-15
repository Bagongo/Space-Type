var audio = (function(){
        
    var brakeFx = new Audio("sound/brake.ogg");
    var animationFx = new Audio("sound/swoosh_01.ogg"); 
    var engineFx = new Howl({
            src: ["sound/engine.ogg"],
            autoplay: false,
            loop: true,
            volume: 0.2,
            rate: 0.5
    });
    
    function init()
    {
        brakeFx.volume = 0.4;
        animationFx.volume = 0.4;
        engineFx.play();
    }
    
    init();
    
    function engineFxMan(time)
    {
        var boost = audio.engineFx.rate();
        
        if(boost < background.starAcceleration/5)
            boost += (background.starAcceleration/5 - boost) / 60;
        else if(boost > background.starAcceleration/5)
            boost -= (boost - background.starAcceleration/5) / 60;
        
        engineFx.rate(boost);
    }    
    
    return {
        brakeFx : brakeFx,
        animationFx : animationFx,
        engineFx : engineFx,
        engineFxMan : engineFxMan
    };
    
})();
    
   