(function(){
BAN = {};
BAN.level_style = [	{'level':0,'default_style':{'w':200,'h':50,'bg_color':'#4ae','stroke':'#000','font_size':30,'font_offset':20}},
					{'level':1,'default_style':{'w':150,'h':30,'bg_color':'#4fe','stroke':'#000','font_size':20,'font_offset':10}},
					{'level':2,'default_style':{'w':100,'h':20,'bg_color':'#55e','stroke':'#000','font_size':15,'font_offset':10}}
				
];
//BAN = draw = SVG('drawbox');
BAN.MindMap = {
	drawbox : {},
	svgX : 0,
	svgY : 0,
	topicNodeArray : [],
	zoom : 1,
	layout : {},
	initMindMap: function(){ //for parement 'drawbox'
		this.svgX = $('#drawbox').width();
		this.svgY = $('#drawbox').height();
		this.drawbox = SVG('drawbox').size(this.svgX,this.svgY);

		this.setEventListener();		
	},
	addMainTopic : function(){
		//only one root is needed
		if(this.topicNodeArray.length>0)
			return ;
		var svgX = this.svgX;
		var svgY = this.svgY;
		this.drawbox.size(svgX,svgY);
		this.drawbox.circle(10).center(svgX/2,svgY/2).attr({fill:'#5e3',stroke:'#3ee'});
		//main topic default not need to move
		var new_node = this.addTopic('root',0,svgX/2,svgY/2,'MainTopic');
		//don't forget the 'g=selected'
		this.topicNodeArray.push(new_node);
					
	},
	addSubTopic : function(parent_id){
		
		//console.log('addSubtopic p_id:',parent_id);
		var parent_node = this.findNodeThroughID(parent_id);

		//console.log('addSubtopic find node:',parent_node);
		var parent_content = $(parent_id);
		var self_level = parent_node.level+1;

		var svgX = this.svgX;
		var svgY = this.svgY;
		var new_node = this.addTopic(parent_id,self_level,svgX/2+300,svgY/2,'SubTopic '+self_level);
		
		//console.log('addSubtopic new_node:',new_node);
		parent_node.children.push(new_node);
		this.resetTopicPos();
	},
	addSibingTopic : function(){

	},
	moveTopic : function(){

	},
	editTopic : function(){

	},
	removeTopic : function(){

	},
	expandTopic : function(){

	},
	setEventListener : function(){
		var mind_this = this;

		$(document).click(function(e){
			alert('document');
		});
		$('svg').click(function(e){
			alert('svg');
			e.stopPropagation();
		});
		
		$('#newTopic').bind('click',function(e){
			mind_this.addMainTopic();
			e.stopPropagation();
		});
		$('#subTopic').bind('click',function(e){
			e.stopPropagation();

			var g_parent = $('g.g-selected');
			if (g_parent.length==0) return;

			var parent_id = g_parent.attr('id');
			//console.log('now',parent_id);
			mind_this.addSubTopic(parent_id);
			
		});
		//edit topic content
		$('#edit').click(function(e){
			
			var g_parent = $('g.g-selected');
			if (g_parent.length==0) return;

			var parent_id = g_parent.attr('class');
			//console.log(parent_id);
			var r = $('rect',g_parent);
			var t = $('text',g_parent);
			var textContent, textLength;
			var rect_bbox, text_bbox;
			//insert div for editting
			var div_block = ($('#div_block').length==1) ? $('#div_block') : $('<div id="div_block"></div>').css({
				'display':'block',
				'position':'absolute',
				'width':'100%','height':'100%',
				'top':0,'left':0,
				'background':'rgb(60,125,125)',
				'opacity':'0.5',
				'-moz-opacity':'0.5',
				'filter':'alpha(opacity=50)',
				'z-index':'99'
			}).prependTo($('body')).click(function(e){e.stopPropagation();});
			div_block.fadeIn();
			var div_edit = $('<div id="div_edit"></div>').fadeIn().click(function(e){e.stopPropagation();});
			var textarea_edit = $('<textarea></textarea>').appendTo(div_edit);
			var button_ok = $('<button id="button_ok">ok</button>').appendTo(div_edit);
			var button_cancle = $('<button id="button_cancle">cancle</button>').appendTo(div_edit);

			t.each(function(){
				textContent = this.instance.text();
				textLength = this.getComputedTextLength();
		
			});

			textarea_edit.css({
				'width':'350px',
				'height':'50px',
				'padding':'10px'
			}).val(textContent);
			

			div_edit.css({
				'display':'block',
				'overflow':'hidden',
				'position':'absolute',
				'top':'100px',
				'left':'200px',
				'border':'2px solid #d21',
				'z-index':999
			}).appendTo($('#drawbox'));
			//finish edittind text
			//alarm:don't forget to bind 'enter' the same as 'ok'
			//instead of '\n'
			$('#button_ok').bind('click',function(e){
				e.stopPropagation();

				textContent = textarea_edit.val();
				t.each(function(){
					this.instance.text(textContent);
					textLength = this.getComputedTextLength();
				});
				//update size of rect
				
				r.each(function(){
					//rect_bbox = this.getBBox();
					text_bbox = t[0].getBBox();
					//console.log(rect_bbox);
					var centerX = text_bbox.x+ text_bbox.width/2;
					this.instance.size(textLength+50,this.instance.height()).center(centerX,this.instance.y()+this.instance.height()/2);
				});
				$('#div_block').fadeOut();
				$('#div_edit').fadeOut(function(){this.remove();});
				BAN.MindMap.updateNodeArray();

				
			});
			$('#button_cancle').click(function(e){
				e.stopPropagation();
				$('#div_block').fadeOut();
				$('#div_edit').fadeOut(function(){this.remove();});
				
			});
			
			e.stopPropagation();
		});	
	},
	addTopic : function(parent_id, level, cx, cy, content, font_offset){
		//create and return a node object contain parent
		var content = content || '';
		//if level is larger than 3, set as level 2
		var style = BAN.level_style[level>2?2:level].default_style;
		var g = this.drawbox.group().attr('class','group');
		g.rect(style.w, style.h).center(cx, cy).radius(10).attr({
			'fill':style.bg_color,
			'stroke':style.stroke,
			'stroke-width':2
		}).attr('class','rect');
		g.text(content).move(cx, cy - style.font_offset).font({
			family:'微软雅黑',
			size:style.font_size,
			'text-anchor':'middle',
		}).attr({'class':'text'});

		var topicNode ={
			id : g.attr('id'),
			parent_id : level == 0 ? 'none' : parent_id,//get parent how?
			level : level,
			content : g,
			children : [],
			expand : true,
			getText : function(){
				var text = this.content.node.childNodes[1].childNodes[0].childNodes[0];
				return text;
			},
			getNode : function(){
				return {
					rect : this.content.node.childNodes[0],
					text : this.content.node.childNodes[1]
				};
			},
			setNodePos : function(x,y){
				//var rect = this.content.node.childNodes[0];
				//var text = this.content.node.childNodes[1];
				var rect = this.getNode().rect;
				var text = this.getNode().text;
				var tbox = text.getBBox();
				var centerX = x + tbox.width/2;
				var centerY = y + tbox.height/2;
				rect.instance.center(centerX,centerY).size(tbox.width+50,tbox.height);
				text.instance.center(centerX+50,centerY);
			}
		}
		//bind click to group
		$('#drawbox g.group').on('click',function(e){	
			//set class 'g-selected' for group selected
			//and remove other groups' class
			e.stopPropagation();

			
			//console.log(this.instance.node.classList);
			//console.log(this.classList);

			if(this.classList.contains('g-selected'))
				return ;

			$('#drawbox g.group').each(function(){	
				//console.log('this,selected');	
				this.classList.remove('g-selected');
			});
			this.classList.add('g-selected');
				
		});
		
		return topicNode;
	},
	updateNodeArray : function(){ //update node in array when topic is changed outside
		//console.log('array',this.topicNodeArray.length);
		//console.log('text',this.topicNodeArray[0].getText());
		//this.topicNodeArray[0].setNodePos(100,100);
	},
	findNodeThroughID : function(target_id){
		if(this.topicNodeArray.length==0)
			return {};

		var rootNode = this.topicNodeArray[0];
		var target_node = this.loop_findNodeThroughID(rootNode,target_id);
		//console.log('target_node',target_node);
		return target_node;	
		
	},
	loop_findNodeThroughID : function(parent,target_id){
		if(parent.id == target_id){
			//console.log('find!',parent.id,parent);
			return parent;		
		}
		else{
			var l = parent.children.length;
			if(l != 0){
				for(var i=0; i<l; i++){//remember the 'return'!!!
					return BAN.MindMap.loop_findNodeThroughID(parent.children[i],target_id);
				}
			}
			else {
				return false;
			}
		}
	},
	resetTopicPos : function(){
		this.resetTopicPos_level1(this.topicNodeArray[0]);
		//this.resetTopicPos_level2();
	},
	resetTopicPos_level1 : function(root){
		var nodes = root.children;
		var length = nodes.length;
		console.log(length);
		var x = this.svgX/2+300;
		for(var i=0; i<length; i++){
			var y = (i+1)/(length+1)*this.svgY;
			nodes[i].setNodePos(x, y);
		}
	},
	resetTopicPos_level2 : function(root){
		var nodes = root.children;
		 
		var length = nodes.length;
		console.log(length);
		var x = this.svgX/2+300;
		for(var i=0; i<length; i++){
			var y = (i+1)/(length+1)*this.svgY;
			nodes[i].setNodePos(x, y);
		}
	}
	
};

})();
BAN.MindMap.initMindMap();