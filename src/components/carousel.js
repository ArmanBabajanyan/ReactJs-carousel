import React, { Component } from 'react'
import { images } from "../imageData";
import $ from "jquery"



let time_1 = 2000; 

class Carousel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: images
        };
    }

    componentDidMount() {
        this.slide()
    }

    slide() {
        var banner = document.querySelector(".carousel-banner");
        var ul_1 = document.querySelector(".carousel-banner ul");
        ul_1.append(ul_1.innerHTML);
        var li_1 = document.querySelectorAll(".carousel-banner ul>li");
        var a_1 = document.querySelectorAll(".carousel-banner ul>li a");
        var prev = document.querySelector(".btn-banner.prev");
        var next = document.querySelector(".btn-banner.next");
        var ico_1 = document.querySelectorAll(".banner-ico-box a");
        var len = li_1.length;
        var orginLen = len / 2;
        var li_width = 0;
        var timer = null;
        var now = 0;
        var self = this;

        function bind(type, element, fn, userCapture) {
            if (element.addEventListener) {
                element.addEventListener(type, fn, userCapture);
            } else if (element.attachEvent) {
                element.attachEvent("on" + type, fn);
            }
        }

        function captureVpWidth(ev) {
            var event = ev || window.event;
            if (event.type) {
                clearInterval(timer);
            }
            var iBannerWidth = banner.offsetWidth;
            var iBannerHeight = banner.offsetHeight;
            $(li_1).css("width", iBannerWidth + "px");
            $(ul_1).css("width", iBannerWidth * li_1.length + "px");
            $(a_1).css("width", iBannerWidth + "px");
            $(a_1).css("height", iBannerHeight + "px");
            li_width = iBannerWidth;
            if (event.type) {
                if (now === len) {
                    ul_1.style.left = -li_width * 5 + "px";
                } else if (now === 0) {
                    ul_1.style.left = "0px";
                } else {
                    ul_1.style.left = -li_width * now + "px";
                }
                timer = setInterval(auto, time_1);
            }
        }

        function throttle(func, wait, options) {
            var context, args, result;
            var timeout = null;
            var previous = 0;
            if (!options) options = {};
            var later = function () {
                previous = options.leading === false ? 0 : +new Date();
                timeout = null;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            };
            return function () {
                var now = +new Date();
                if (!previous && options.leading === false) previous = now;
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0 || remaining > wait) {
                    if (timeout) {
                        clearTimeout(timeout);
                        timeout = null;
                    }
                    previous = now;
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                } else if (!timeout && options.trailing !== false) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        };

        function auto() {
            if (document.fireEvent) {
                var event = document.createEventObject();
                next.fireEvent('click', event);
            } else if (document.dispatchEvent) {
                var event = document.createEvent("HTMLEvents");
                event.initEvent("click", true, true);
                event.eventType = "click";
                next.dispatchEvent(event);
            }
        }


        function prev_1(ev) {
            if (now > 0) {
                now--;
            } else {
                now = self.state.images.length - 1;
                ul_1.style.left = -(li_width * orginLen) + 'px';
            }
            scroll();
        }

        function next_i(ev) {
            if (now < len - 1) {
                now++;
            } else {
                now = 0;
                ul_1.style.left = -(li_width * (orginLen - 1)) + 'px';
            }
            scroll();
        }


        function icoSwitch() {
            Array.prototype.slice.call(ico_1).forEach(function (ico) {
                ico.className = "";
            });
            ico_1[now % 6].className = "active";
        }

        function scroll() {
            act(ul_1, 'left', -li_width * now);
            icoSwitch();
        }

        function cssCapture(obj, attr) {
            if (obj.currentStyle) {
                return obj.currentStyle[attr];
            } else {
                return getComputedStyle(obj, null)[attr];
            }
        }

        function act(obj, attr, target, fn) {
            obj.timer && clearInterval(obj.timer);
            obj.timer = setInterval(function () {
                var stop = true;
                var curr = parseInt(cssCapture(obj, attr));
                var speed = (target - curr) / 8;
                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
                if (curr !== target) {
                    stop = false;
                    obj.style[attr] = curr + speed + "px";
                }
                if (stop) {
                    clearInterval(obj.timer);
                    obj.timer = null;
                    fn && fn();
                }
            }, 30);
        }

        bind("resize", window, throttle(captureVpWidth, 2000, {
            leading: true,
            trailing: true
        }), false);
            bind("load", window, captureVpWidth, false);
            bind("click", prev, prev_1, false);
            bind("click", next, next_i, false);
    }

    render() {
        return (
            <div className="wrapper">
                <div className="carousel-banner">
                    <ul>
                        {this.state.images.map((img, i) =>
                            <li key={i} >
                                <img src={img.url} alt={img.id} />
                            </li>
                        )}
                    </ul>
                    <div className="banner-ico-box">
                        {this.state.images.map((count, i) =>
                            <a key={i}></a>
                        )}
                    </div>
                    <a className="btn-banner prev">
                        {"<"}
                    </a>
                    <a className="btn-banner next">
                        >
                    </a>
                </div>
            </div>
        )
    }
}

export default Carousel;