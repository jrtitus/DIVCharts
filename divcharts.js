/*********************************************
DIVCharts - A bar chart plug-in using no SVG or Canvas elements

Copyright (c) 2014 Jeffrey Titus

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Requires:
- jquery.js (1.9.1+)
- jquery.hoverintent.js
- divcharts.css

***********************************************/
(function($){
	var methods = {
		init: function(options){
			var settings = $.extend({
				'width'	: '95%',
				'height'	: 300,
				'ymin'		: 0,
				'ymax'		: 100,
				'labels'	: [],
				'values'	: [],
				'colors'	: ['#AA4643','#89A54E', '#80699B', '#3D96AE', '#DB843D']
			}, options);
			var self = this;
			this.dcvars = {
				width 			: calculateDimension(self, settings.width),
				height 		: calculateDimension(self, settings.height),
				labels			: settings.labels,
				max 			: settings.ymax,
				min 				: settings.ymin,
				barHeights : [],
				currValues : settings.values
			};
			return this.each(function(){
				//Create the chart body
				$(self).append(
					'<div id="y-values"></div>\
					<div id="graph-container"></div>\
					<div id="x-values"></div>\
					<div id="val"></div>'
				);
				//Hide the value when leaving the container
				$('#graph-container', self).hover(function(){},function(){
					$('#val', self).hide();
				})
				//Set width and height of graph-container
				.width(self.dcvars.width).height(self.dcvars.height);

				//Add all bars to the chart first
				for(var i = 0; i < settings.labels.length; i++){
					$('#graph-container', self).append($('<div class="bar"></div>'));
					self.dcvars.barHeights.push(0);
				}
				var barWidth = $('div.bar', self).eq(0).width(),
					numBars = settings.labels.length,
					sectionSize = self.dcvars.width / numBars,
					offset = (sectionSize / 2) - (barWidth / 2),
					yLabelHeight = self.dcvars.height/5 - 1;
				//Set up y-axis
				$('#y-values').height(self.dcvars.height);
				var change = settings.ymax - settings.ymin;
				for(var y = 0; y < 6; y++){
					$('#y-values', self).append($('<div class="y">' + (settings.ymax - (change / 5 * y)) + '</div>')
						.height(y < 5 ? yLabelHeight : 'auto'));
				}
				for(var i = 0; i < numBars; i++){
					$('div.bar', self).eq(i).css({
						'left' : (i * sectionSize) + offset,
						'background' : settings.colors[i]
					}).hoverIntent({
						over: function(e){
							$('#val', self).text(Math.floor((($(this).height() + settings.ymin)/self.dcvars.height) * settings.ymax))
								.show()
								.css({'border-color':$(this).css('background-color')})
								.animate({left: e.clientX+10, top: e.clientY-10}, 'fast')
								 //Forces the value box to stay shown, otherwise mouseout event is triggered and it is hidden
								.hover(function(){$(this).show();});
						},
						//Hoverintent throws an error if out is not defined
						out: function(){},
						interval: 200,
						sensitivity: 10
					});
					var currentLabel = $('<div class="x">' + settings.labels[i] + '</div>', self).css({
						'margin-left' : (i * sectionSize) + offset + $('#y-values').width() + 7
					});
					$('#x-values', self).append(currentLabel);
				}
				self = self.DivChart('update', {values: settings.values});
			});
		},
		/**
			Remove the chart and clean up the polling mechanism
		*/
		destroy : function() {
			var self = this;
			return this.each(function(){
				$('#y-values', self).remove();
				$('#graph-container', self).remove();
				$('#x-values', self).remove();
				$('#val', self).remove();
				self.methods.stop();
			});
		},
		/**
			@desc Stop and clean up animations
		*/
		stop: function(){
			$('div.bar', this).clearQueue();
			return this;
		},
		/**
			@desc Update chart values
			@param options {values:[<real>], index: <int>}
				values parameter is an array of numbers
				index parameter is optional. It is the index to start the update at.
		*/
		update: function(options){
			if(typeof(options.index) === 'undefined'){
				options.index = 0;
			}
			if(!options.values){
				throw 'Values required for update to succeed';
			}
			if(typeof(options.values) === 'object'){
				for(var i = options.index, vi = 0; vi < options.values.length; i++, vi++){
					this.dcvars.currValues[i] = options.values[vi];
					this.dcvars.barHeights[i] = valueToHeight(options.values[vi], this.dcvars.max, this.dcvars.min, this.dcvars.height);
					$('div.bar', this).eq(i).animate({'height' : this.dcvars.barHeights[i]});
				}
			}/* else{
				this.dcvars.currValues[options.index] = options.values;
				this.dcvars.barHeights[options.index] = valueToHeight(options.values, this.dcvars.max, this.dcvars.min, this.dcvars.height);
				$('div.bar', this).eq(options.index).animate({'height' : this.dcvars.barHeights[options.index]});
			} */
			return this;
		}
	};

	function calculateDimension(container, val){
		if(typeof(val) === 'string' && val.match(/%$/)){
			val = val.substr(0, val.length - 1);
			val = parseInt(val, 10) / 100;
			return $(container).width() * val;
		}else{
			return parseInt(val, 10);
		}
	}
	function valueToHeight(value, max, min, containerHeight){
		return ((value/max) * containerHeight) - min;
	}

	$.fn.DivChart = function(method){
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.DivChart' );
		}
	};
})(jQuery);