

(function(){
	var canvasWidth = 800,
		canvasHeight = 400;
		
	//Models
	var Canvas, 				// Layer of abstraction for the <canvas> element
		NoiseMaker, 			// generates random noise (numbers)
			PosGenerator, 		// generates a random position
			DimensionGenerator, // generates a random width & height size
		IdGenerator, 			// generates a new ID
		Box, 					// a box to be displayed onto the canvas
			Room, 				// a room which can contain doors and monsters
			Doors; 				// a child of a Room which allows passage through rooms.


	Canvas = Backbone.Model.extend({
		defaults : {
			element : null,
			ctx : null
		},
		x_index : [],
		y_index : [],
		draw : function(obj) {
			var ctx = this.get("ctx"),
				that = this,
				types = {
					box : function(box) {
						var pos = box.get("pos"),
							dims = box.get("dims"),
							oIndexObj = {pos : pos, dims : dims};
						//ctx.fillStyle = "rgb(0,0,0,0.3)";
						ctx.fillRect(
							pos.x, //x axis
							pos.y, //y axis
							dims.width, //width
							dims.height, // height
							box.opacity //opacity
						)
					},
					door : function(door) {
						
					}
				}
			
			
			
			types[obj.type](obj);
		},
		initialize : function(args) {
			this.set({element : args.element});
			this.set({ctx : this.get("element").getContext('2d')});
			this.x_index.length = canvasWidth;
			this.y_index.length = canvasHeight;
		}
	})
	
	NoiseMaker = Backbone.Model.extend({
		defaults : {
			canvasWidth : null,
			canvasHeight : null,
			minBoxHeight : 2,
			maxBoxHeight : 30,
			
			minBoxWidth : 7,
			maxBoxWidth : 10,
		},
		makeNoise : function() {
			return Math.random();
		}
	})
	
	PosGenerator = NoiseMaker.extend({
		getPos : function() {
			return {
				x : Math.floor(this.makeNoise()*this.get("canvasWidth")),
				y : Math.floor(this.makeNoise()*this.get("canvasHeight")),
			}
		}
	})
	
	DimensionGenerator = NoiseMaker.extend({
		getDims : function() {
			var midwidth = this.get("minBoxWidth"),
				maxwidth = this.get("maxBoxWidth"),
				minheight = this.get("minBoxHeight"),
				maxheight = this.get("maxBoxHeight"),
				that = this;
			
			function getWidth() {
				var widthnoise = that.makeNoise(),
					result = Math.floor(widthnoise*maxwidth);
				if (result<midwidth) {
					return getWidth();
				} else {
					return result;
				}
			}
			function getHeight() {
				
				var heightnoise = that.makeNoise(),
					result = Math.floor(heightnoise*maxheight);
				if (result<minheight) {
					return getHeight();
				} else {
					return result;
				}
			}
			
			return {
				width : getWidth(),
				height : getHeight(),
			}
		}
	})
	IdGenerator = Backbone.Model.extend({
		inc : 0,
		generate : function() {
			this.inc++;
			return this.inc;
		}
	})
	Box = Backbone.Model.extend({
		defaults : {
			pos : {
				x : null,
				y : null
			},
			dim : {
				width : null,
				height : null
			},
			opacity : 1,
			id : null
		},
		type : "box"
	})
	
	Room = Box.extend({
		defaults : {
			doors : [],
			monsters : []
		}
	})
	
	Door = Box.extend({
		open : false,
		blocked :  false
	})
	
	(function map_generator() {
		var idfactory,
			canvas,
			posgen,
			dimgen,
			ROOM_AMOUNT = 1500,
			iRoom=1,
			rejects=0,
			tallest_box=0,
			total_widths=0,
			current_y=0,
			current_x=0,
			oRoom;
		
		idfactory = new IdGenerator();
		
		canvas = new Canvas({
			element : document.getElementById("drawarea")
		})
		
		posgen = new PosGenerator({
			canvasWidth : canvasWidth,
			canvasHeight : canvasHeight
		});
		
		dimgen = new DimensionGenerator({
			canvasWidth : canvasWidth,
			canvasHeight : canvasHeight
		});
		
		
		
		(function makerooms() {
			if (iRoom>=ROOM_AMOUNT) return false;
			
			oRoom = new Room({
				pos : {x:current_x,y:current_y},
				dims : dimgen.getDims(),
				opacity : Math.random(),
				id : idfactory.generate()
			})
			
			if (oRoom.get("dims").height>tallest_box) tallest_box = oRoom.get("dims").height;
			
			current_x+=oRoom.get("dims").width;
			
			if (current_x>canvasWidth) {
				current_x=0;
				current_y+=tallest_box+10;
				tallest_box=0;
			}
			
			canvas.draw(oRoom);
				
			iRoom++;
			
			setTimeout(makerooms,1);
			//makerooms();
		}())
	}())
}())























