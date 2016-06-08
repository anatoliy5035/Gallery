(function(){
    var Gallery = function(container,options) {
        var defaults = {
            speed : 500,
            dots: true,
            counter: false
        };
        this.options = $.extend({}, defaults, options);
        this.container = container;
        this.track = this.container.find(".gallery__track");
        this.slides = this.container.find(".gallery__slide");
        this.slidesCount = this.slides.length;
        this.currentSlide = 0;
        this.init();
    };

    Gallery.prototype.init = function() {
        this.updateStyles();
        this.events();
        if(this.options.dots){
            this.createDots();
            this.updateDotsStyles();
        }
        if(this.options.counter){
            this.createCounter();
            this.updateCounter();
        }
        this.track.css('transition', 'transform ' + this.options.speed + 'ms ease');
    };
    Gallery.prototype.events = function() {
        this.container.on("click", this.clickHandler.bind(this));
        $(window).on('resize', this.updateStyles.bind(this));
    };

    Gallery.prototype.updateStyles = function() {
        var containerWidth = this.container.width();
        console.log("containerWidth=",containerWidth);
        this.container.addClass("js-gallery");
        this.track.width(containerWidth*this.slidesCount);
        this.slides.each(function(i,el){
            $(el).width(containerWidth);
        });
    };

    Gallery.prototype.moveSlide = function(pos) {
        this.track.css({transform: 'translate3d(' + (-pos) + 'px, 0, 0)'});
    };


    Gallery.prototype.slideTo = function(index) {
        if (index <0 || index >= this.slidesCount || index===null ) return;
        var nextSlide = this.slides.eq(index)[0].offsetLeft;
        this.moveSlide(nextSlide);
        this.currentSlide=index;
        this.container.trigger("slideChange",{currentSlide: index});
        this.updateCounter();

    };

    Gallery.prototype.clickHandler = function(e) {
        var target = e.target;
        if(target.tagName==="BUTTON") {
            if($(target).data("direction")==="next") {
                this.slideTo(this.currentSlide+1);
            }
            else{
                this.slideTo(this.currentSlide-1);
            }
        }
    };

    Gallery.prototype.createDots = function () {
        var dotsWrap = $(this.track).after($("<ul></ul>").addClass("gallery__dots-list"));
        this.dots = this.container.find(".gallery__dots-list");
        var self = this;
        for(var i=0; i<this.slidesCount; i++) {
            this.dots.append($("<li></li>").addClass("gallery__dot"));
            this.dots.find(".gallery__dot").eq(i).attr('index',i);
        }

        this.dots.on("click", function(e){
            var curSlide = e.target;
            var numberSlide = curSlide.getAttribute("index");
            self.slideTo(numberSlide);
        });
    };

    Gallery.prototype.updateDotsStyles = function() {
        this.dots.find(".gallery__dot").eq(this.currentSlide).addClass("is-active");
        this.container.on("slideChange", SetactiveDot);
        var self = this;
        function SetactiveDot(e,adata){
            self.dots.find(".gallery__dot")
                .removeClass('is-active')
                .eq(adata.currentSlide)
                .addClass("is-active") ;
        }
    };

    Gallery.prototype.createCounter = function(index) {
        this.container.find(".gallery__info").append($("<span></span>").addClass("badge"));
        this.counter = this.container.find(".badge");
    };

    Gallery.prototype.updateCounter = function () {
        this.counter[0].innerHTML=+this.currentSlide+1 +"/"+ this.slidesCount;
    };

    $.fn.JGallery = function(options) {
        new Gallery(this,options);
        return this;
    };
})();