var SvgAnimation = function(settings){
    this.svg            = $(settings.elem);
    this.increaseBy     = settings.increaseBy !== undefined ? settings.increaseBy : 5;
    this.timeout        = settings.timeout !== undefined ? settings.timeout : 1;
    this.reverse        = settings.reverse !== undefined ? settings.reverse : false;

    this.totalPath      = $(settings.elem).find('path').length;
    this.currentPath    = this.reverse ? 1 : this.totalPath;

    this.init()
};

SvgAnimation.prototype.init = function(){
    var _that = this;

    this.svg.find('path').each( function(index, elm) {

        var pathLength = elm.getTotalLength();
        $(elm).attr({
            'stroke-dasharray' : pathLength+' '+pathLength,
            'stroke-dashoffset' : _that.reverse ? -pathLength : pathLength
        });

    });

};
SvgAnimation.prototype.animate = function(callback){

    if(typeof(callback) == 'function')this.callback = callback;
    this.animatePath();
}

SvgAnimation.prototype.animatePath = function(){
    var _that = this;


    var _path = _that.svg.find('path:eq('+ (_that.currentPath-1) +')'),
        _currentLength = parseFloat(_path.attr('stroke-dashoffset'));

     var _setInterval = setInterval(function(){
            if(_currentLength != 0){
                if(_that.reverse){
                     _currentLength = (-_currentLength < _that.increaseBy) ? 0 : _currentLength + _that.increaseBy;
                }else{
                    _currentLength = (_currentLength < _that.increaseBy) ? 0 : _currentLength - _that.increaseBy;
                }
                _path.attr('stroke-dashoffset', _currentLength);
            }else{
                clearInterval(_setInterval);

                if((_that.reverse == true && _that.currentPath<_that.totalPath) || (_that.reverse == false && _that.currentPath> 1) ){
                    _that.reverse ? _that.currentPath ++ : _that.currentPath --;
                    _that.animatePath();
                }else{
                    if(typeof(_that.callback) == 'function'){
                        _that.callback.call(_that);
                    }
                }
            }
        },_that.timeout);

}


jQuery(document).ready(function($) {
    var setting = {
        "elem" : "#svg-circle",
        "increaseBy" : 3,
        "timeout" : 1,
        "reverse" : true
    };
    var reverseSetting = {
        "elem" : "#svg-circle",
        "increaseBy" : 3,
        "timeout" : 1,
        "reverse" : false
    };


    $('.animate').click(function(){
        var circle = new SvgAnimation(setting);
        circle.animate();
    });

    $('.reverse').click(function(){
        var circle = new SvgAnimation(reverseSetting);
        circle.animate();
    });

});
