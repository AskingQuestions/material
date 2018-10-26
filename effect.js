Websom.Theme.handle(".theme-material", ".theme", function (config) {
	return {
		"/smallLoader": function () {
			return $("<div class='small-loader'></div>");
		},
		"textarea.input": {
			"keydown": function (e) {
				//$(this).height(($(this).val().split("\n").length + 2) * (16*1.5));
				//var base = this.scrollHeight / ($(this).val().split("\n").length+2);
				//console.log(base);
				this.scrollTop = 0;
				setTimeout(() => {
					this.scrollTop = 0;
					if ($(this).val().split("\n").length > 1)
						$(this).height(this.scrollHeight);
				});
			}
		},
		".tabs > ul > li": {
			click: function (e) {
				var that = $(this);
				var index = that.attr("data-tab");
				if (!index)
					index = "0";
				var root = that.parent().parent();
				var oldIndex = root.find("> div > div.open").attr("data-tab") || 0;
				if (oldIndex == index)
					return;

				root.find("> div > div").removeClass("open");
				root.find("> div > div[data-tab='" + index + "']").addClass("open");
				var head = that.parent().children("span");

				if (head.length == 0)
					head = $("<span class='tab-head'></span>").appendTo(that.parent());
				var flex = that.width();
				var first = "width";
				var last = "left";
				if (parseInt(index) < parseInt(oldIndex)) {
					head.css(first, (flex*2) + "px");
					head.css(last, flex*(parseInt(index)));
					setTimeout(() => {
						head.css(first, (flex) + "px");
					}, 200);
				}else{
					head.css(first, (flex*2) + "px");
					setTimeout(() => {
						head.css(last, flex*(parseInt(index)));
						head.css(first, (flex) + "px");
					}, 200);
				}
			}
		},
		".card.explode": {
			click: function (e) {
				if ($(".exploding").length > 0)
					return;

				let doDropback = true,
					time = 300;

				var card = $(this).closest(".card");
				var cRect = card[0].getBoundingClientRect();
				var attr = {
					top: cRect.top,
					left: cRect.left,
					width: cRect.width,
					height: cRect.height,
					transition: `top .3s,
						left .3s,
						width .3s,
						height .3s`
				};
				
				card.css(attr);
				card.attr(attr);
				

				let top, left, width, height;
				$("<div></div>").addClass("exploding-placeholder").css({display: "inline-block", width: card.outerWidth(true), height: card.outerHeight(true)}).insertAfter(card);
				if (card.hasClass("expandable")) {
					top = attr.top - 50;
					left = attr.left;
					width = attr.width;
					card.addClass("open");
					height = attr.height + card.children(".expand").outerHeight();
					
					if (top + height > window.innerHeight) {
						top = Math.max(0, top - Math.abs(top + height - window.innerHeight));
					}
					
					height = Math.min(height, window.innerHeight);

					card.removeClass("open");
					doDropback = false;
					time = 200;
					
					setTimeout(() => {
						card.css({top, left, width, height});
					}, 10);

					card.addClass("exploding");
					$("<div><i class='fas fa-times' style='top: 0; right: 0;'></i></div>").addClass("explode-back expandable").css({transition: ".1s", background: "rgba(0, 0, 0, 0.2)", position: "fixed", top: 0, left: 0, width: "100%", height: "100%"}).appendTo("body").css("opacity", "0").animate({opacity: "1"}, time, () => {card.addClass("open");});
					return;
				}else{
					top = 200;
					left = 200;
					width = window.innerWidth - left*2;
					height = window.innerHeight - top;
				}
				card.addClass("exploding");
				
				if (window.screen.width < 480) {
					top = 100;
					left = 0;
					width = window.screen.width - left*2;
					height = window.screen.height - top;
				}
				
				card.animate({
					/*top: top,
					left: left,
					width: width,
					height: height*/
				}, 300, function () {
					card.addClass("done");
				});

				var img = card.find("img.primary-image");
				if (img.length > 0) {
					img.attr({
						"data-top": img.offset().top - attr.top,
						"data-left": img.offset().left - attr.left,
						"data-width": img.width(),
						"data-height": img.height()
					});
					img.animate({
						top: "-64px",
						left: "10px",
						"max-width": "128px"
					}, time);
				}else{
					card.children(".content").children(".title").css("margin", "0");
				}

				if (doDropback)
					$("<div><i class='fas fa-times' style='top: 0; right: 0; '></i></div>").addClass("explode-back").appendTo("body").css("height", "0%").animate({height: "100%"}, time);
			}
		},
		".explode-back": {
			click: function(e) {
				let c = $(".exploding");

				if ($(this).closest(".explode-back").hasClass("expandable")) {
					c.removeClass("open");
					$(this).closest(".explode-back").animate({opacity: 0}, 300, function () {$(this).remove()});
					c.css({top: c.attr("top"), left: c.attr("left"), width: c.attr("width"), height: c.attr("height")});
					setTimeout(() => {
						$(".exploding-placeholder").remove();
						c.removeClass("exploding");
						c.removeAttr("style");
					}, 300);
					return;
				}

				$(this).closest(".explode-back").animate({height: "0%"}, function () {$(this).remove()});
				
				c.removeClass("done");
				c.css("transition", "");
				var cRect = c[0].getBoundingClientRect();
				var attr = {
					top: cRect.top,
					left: cRect.left,
					width: cRect.width,
					height: cRect.height
				};

				c.addClass("explode-reverse");
				c.css(attr);
				c.animate({top: c.attr("top"), left: c.attr("left"), width: c.attr("width"), height: c.attr("height")}, 300, function () {
					$(".exploding-placeholder").remove();
					c.removeAttr("style");
					c.removeClass("exploding done explode-reverse");
				});
				var i = c.find(".primary-image");
				
				i.animate({top: i.attr("data-top"), left: i.attr("data-left"), width: i.attr("data-width"), height: i.attr("data-height")}, 300, function () {
					i.removeAttr("style");
				});
			}
		},
		".accordion > li > div:nth-child(1)": {
			click: function (e) {
				var open = $(this).parent().hasClass("open");
				$($(this).parent().parent().children("li.open").children()[1]).animate({height: 0}, 200, function () {
					$(this).parent().removeClass("open");
					$(this).removeAttr("style");
				});

				if (!open) {
					$(this).parent().addClass("open");
					var body = $(this).parent().children()[1];
					var height = $(body).height();
					$(body).css({height: "0px"});
					$(body).animate({height: height + "px"}, 200, function () {
						$(this).removeAttr("style");
						$(this).parent().addClass("open");
					});
					$(this).parent().removeClass("open");
				}
			}
		},
	}
});