//(function(){
    var Gallery = function(options) {
        var defaults = {
            speed : 500,
            dots: true,
            counter: false
        };
        this.options = $.extend({}, defaults, options);
        this.container = $(".gallery");
        this.track = this.container.find(".gallery__track");
        this.slides = this.container.find(".gallery__slide");
        this.slidesCount = this.slides.length;
        this.currentSlide = 0;
        this.init();
    };

    Gallery.prototype.init = function() {
        this.updateStyles();
        this.events();
        if(this.options.dots==true){
            this.createDots();
            this.updateDotsStyles();
        }
        this.track.css('transition', 'transform ' + this.options.speed + 'ms ease');
    };

    Gallery.prototype.updateStyles = function() {
        var containerWidth = this.container.width();
        this.container.addClass("js-gallery");
        this.slides.each(function(i,el){
            $(el).width(containerWidth);
        });
        this.track.width(containerWidth*this.slidesCount);
    };

    Gallery.prototype.events = function() {
        this.container.on("click", this.clickHandler.bind(this));
    };

    Gallery.prototype.moveSlide = function(pos) {
        this.track.css({transform: 'translate3d(' + (-pos) + 'px, 0, 0)'});
    };


    Gallery.prototype.slideTo = function(index) {
        if (index <0 || index >= this.slidesCount ) return;
        var nextSlide = this.slides.eq(index)[0].offsetLeft;
        this.moveSlide(nextSlide);
        this.currentSlide=index;
        this.container.trigger("slideChange",{currentSlide: index})
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
        var self = this;
        for(var i=0; i<this.slidesCount; i++) {
            $(".gallery__dots-list").append($("<li></li>").addClass("gallery__dot"));
            $(".gallery__dot").eq(i).attr('index',i);
        }

        $(".gallery__dots-list").on("click", function(e){
            console.log(this)
            var curSlide = e.target;
            var numberSlide = curSlide.getAttribute("index");
            self.slideTo(numberSlide);
        });
    };

    Gallery.prototype.updateDotsStyles = function() {
        $(".gallery__dot").eq(this.currentSlide).addClass("is-active");
        this.container.on("slideChange", SetactiveDot);
        function SetactiveDot(e,adata){
            $(".gallery__dot")
                .removeClass('is-active')
                .eq(adata.currentSlide)
                .addClass("is-active") ;
        }
    };

    $.fn.JGallery = function(options) {
        new Gallery(options);
        return this;
    }
//})();