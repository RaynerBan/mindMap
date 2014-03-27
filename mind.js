
var TopicArr = [];
var SubTopicArr = [];
var draw = SVG('drawbox')//.size(2000,1500);


function newTopic(content, x, y, w, h){
	
	

	var _content = content || 'newTopic';
	var x = x || 400,
		y = y || 30,
		w = w || 130,
		h = h || 30;
	var group = draw.group()//.attr('class','g-selected');
	var rect = group.rect(w,h).center(x,y).attr('class','r-selected');

	//console.log(_content,x,y,w,h,rect);
	
	rect.radius(20).fill('#ded').stroke('#ccd');

	var text = group.text(content).attr({'class':'g-text'}).move(x, y);
	text.font({
		family:'微软雅黑',
		size:20,
		'text-anchor':'middle',
		leading:1,		
	}).style('cursor:text;');

	

	group.click(function(e){
		e.stopPropagation();
		var $g = $(this.node);
		
		if(this.node.classList.contains('g-selected'))
			return ;

		$('#drawbox g').each(function(){	
		console.log('ggg');	
			this.classList.remove('g-selected');
		});
		this.node.classList.add('g-selected');
			
		var textLength;
		var t = $('text',$g).each(function(){
				bbox = this.getBBox();
				//console.log('before',bbox);

				//console.log('get text content:',this.instance.text());
				this.instance.text('select '+this.instance.text());
				
				this.instance.style('cursor:pointer;');
				
				bbox=this.getBBox();
				//console.log('after',bbox,this.getComputedTextLength());
				textLength = this.getComputedTextLength();
				//dmove(30,0)
				//translate(x,y)
			});
		var r = $('rect',$g).each(function(){
				this.instance.size(textLength+20,this.instance.height()).stroke('#211').radius(10).fill('#eee');	//.size(200,40)
			});

		});
	 return group;
		
}
$(document).click(function(e){
	alert('document');
});
$('#drawbox svg').click(function(e){
	alert('svg');
	e.stopPropagation();
});
//event 
$('#newTopic').bind('click',function(e){
	var topicLength = TopicArr.length;
	var x =400;
	var y = topicLength * 60 + 200;
	var subtopic = newTopic('new Topic',x,y);
	subtopic.attr('level',1);
	
	//console.log('g:',subtopic);
	//console.log('g.id:',subtopic.attr('id').toString());
	/*
	console.log('gn:',subtopic.node);
	console.log('gni:',subtopic.node.instance);
	console.log('child1',subtopic.node.childNodes[0]);
	subtopic.node.childNodes[1].instance.text('test');
	console.log('child2',subtopic.node.childNodes[1].instance);*/
	var mainTopic = {
		'content':subtopic,
		'children':[]
	}
	TopicArr.push(mainTopic);

	e.stopPropagation();
	
});
$('#subTopic').bind('click',function(e){
	e.stopPropagation();

	var g_parent = $('g.g-selected');
	if (g_parent.length==0) return;

	var g_level = g_parent.attr('level');
	console.log('g-level',g_level);

	var r = $('rect',g_parent);
	var pos_parent = {};
	var pos_child = {};
	r.each(function(){
		var _r = this.instance;
		
		pos_parent = {	
			x : _r.x(),
			y : _r.y(),
			w : _r.width(),
			h : _r.height() 
		};
	});

	var SubTopicLength = SubTopicArr.length;

	pos_child = {
		x : pos_parent.x + pos_parent.w * 2 *(SubTopicLength>4?-1:1),  //set new start_x for child
		y : pos_parent.y + pos_parent.h * 2 *(SubTopicLength-2),
		w : pos_parent.w,
		h : pos_parent.h 
	};
	//remember ths x,y is the center
	var subtopic = newTopic('subTopic', pos_child.x + pos_child.w/2, pos_child.y + pos_child.h/2);
	subtopic.attr('level',2);
	var second_topic = {
		'level':2,
		'content':subtopic,
		'children':[],
		'parent_id': g_parent.attr('id'),
		'self_id': subtopic.attr('id')
	}
	console.log('topic',second_topic);
	TopicArr.push(second_topic);
	//SubTopicArr.push(1);

	
	//alarm: it differs whether child is left of right->[child.x differs]
	drawPathArc(pos_parent.x+pos_parent.w/2, pos_parent.y+pos_parent.h/2,
		pos_child.x, pos_child.y+pos_child.h/2).back();
	drawPathLine(pos_parent.x+pos_parent.w/2, pos_parent.y+pos_parent.h/2,
		pos_child.x, pos_child.y+pos_child.h/2).back();

	//var x =  draw.rect(200,200).back().fill('#eee').move(300,20);
	
});

$('#edit').bind('click',function(e){
	
	var g_parent = $('g.g-selected');
	if (g_parent.length==0) return;


	var r = $('rect',g_parent);
	var t = $('text',g_parent);
	var textContent, textLength;
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
	var div_edit = $('<div></div>').click(function(e){e.stopPropagation();}).fadeIn();
	var textarea_edit = $('<textarea></textarea>').appendTo(div_edit);
	var button_ok = $('<button>ok</button>').appendTo(div_edit);
	var button_cancle = $('<button>cancle</button>').appendTo(div_edit);

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
	button_ok.click(function(e){
		textContent = textarea_edit.val();
		t.each(function(){
			this.instance.text(textContent);
			textLength = this.getComputedTextLength();
		});
		//update size of rect
		r.each(function(){
			this.instance.size(textLength+20,this.instance.height());
		});
		div_block.fadeOut();
		div_edit.fadeOut(function(){this.remove();});

		e.stopPropagation();
	});
	button_cancle.click(function(e){
		e.stopPropagation();
		div_block.fadeOut();
		div_edit.fadeOut(function(){this.remove();});
		
	});
	
	e.stopPropagation();
});

//zoom
//var zoom =draw.viewbox().zoom;
//console.log('zoom',zoom);

//draw arc path
function drawPathArc(parent_x,parent_y,child_x,child_y){
	var g = draw.group();
	//alarm: show half/total circle; recalculate x,y for child 
	//draw circle
	g.circle(10).center(child_x,child_y).attr({fill:'#5e3',stroke:'#3ee'});
	//draw Arc Path
	var w = (child_x-parent_x);
	var h = (child_y-parent_y);
	var flag_r = h  > 0 ? 0 : 1 ;
	var flag_l = w > 0 ? 0 : 1 ; //judge x_min -> x_max
	var path = g.path().attr({fill:'none',stroke:'#5e3','stroke-width':2});
	if(flag_l){
		path.M(child_x, child_y).A(w, h, 0, 0, flag_r, parent_x,parent_y);
	}else{
		path.M(parent_x, parent_y).A(w, h, 0, 0, flag_r, child_x,child_y);
    }
    
    
    return g;
}

function drawPathLine(parent_x,parent_y,child_x,child_y){
	var g = draw.group();
	//draw circle
	g.circle(10).center(child_x,child_y).attr({fill:'#5e3',stroke:'#3ee'});
	//draw line
	var line = g.path().attr({
		fill:'#5e3',
		stroke:'#5e3',
		'stroke-width':2,
		'stroke-linecap':'round',
		'stroke-linejoin':'round'
	}).M(parent_x,parent_y).L(child_x,child_y);
	return g;
}
function g2node(group){
	var node = {};

	var bbox = group.node.getBBox();
	//console.log('g2n',bbox);
	node.x = bbox.x;
	node.y = bbox.y;
	node.w = bbox.width;
	node.h = bbox.height;
	node.cx = node.x + node.w/2;
	node.cy = node.y + node.h/2;

	return node;
}