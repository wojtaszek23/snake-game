var canvas;
var context;
var time;

var body_x = new Array();
var body_y = new Array();
var body_direction = new Array();

var board_x = new Array();
var board_y = new Array();
var board_is_free = new Array();

var apple_x;
var apple_y;
var apple_img;
var apple_is_placed;

var snake_speed;
var snake_head_down_img;
var snake_head_right_img;
var snake_head_up_img;
var snake_head_left_img;
var snake_segment_down_img;
var snake_segment_right_img;
var snake_segment_up_img;
var snake_segment_left_img;
var snake_direction;

var cell_width=50;
var cell_height=50;

var started;

// TODO: Zmienić algorytm, aby jabłko ZAWSZE pojawiało się we właściwym miejscu (w wolnym miejscu na planszy, nie na ciele węża), po czym
// usunąć forsowanie prawidłowego miejsca dla jabłka w przypadku wystąpienia wyżej wymienionego błędu.

function bodyBuild(x,y,direction){
    body_x.unshift(x);
    body_y.unshift(y);
    body_direction.unshift(direction);
}

function boardInit(){
	for(var i = 0 ; i < 200 ; i++)
    {
		board_x.push((i%20)*50);
		board_y.push((Math.floor(i/20))*50);
		board_is_free.push(true);
    }
}

function appleInit(x,y,img_name){
    apple_x = x;
	apple_y = y;
	apple_img = null;
	apple_img = new Image()
	apple_img.src = img_name;
}

function appleReplace(){
    context.clearRect(apple_x,apple_y,cell_width,cell_height);
	var rand_id = Math.floor(Math.random() * (board_x.length-body_x.length));
	var calc_rand_id=0;
	var i = 0;
	for ( ; i<=rand_id ; i++ )
	{
		if (board_is_free[i] == false)
		{
			calc_rand_id++;
		}
	}
	
	if(rand_id!=i){
	rand_id = calcApplePlace(rand_id,calc_rand_id);}
	
	while(board_is_free[rand_id%200]==false)
	{
		rand_id++;
	}
	rand_id=rand_id%200;
	apple_x = board_x[rand_id];
	apple_y = board_y[rand_id];
	context.drawImage(apple_img,apple_x,apple_y);
	apple_is_placed = true;
}

function calcApplePlace(rand_id,calc_rand_id){
	var tmp = calc_rand_id;
	var i = rand_id 
    for( ; i < rand_id + calc_rand_id ; i++)
	{
		if ( board_is_free[i] == true )
		{
			calc_rand_id--;
		}
	}
	rand_id = i;
	if(calc_rand_id == 0)
	{
		return rand_id;
	}
    else
	{
		return calcApplePlace(rand_id,calc_rand_id);
	}
}

function gameInit(){
	boardInit();
	appleInit(8*cell_width,4*cell_height,"./apple.bmp");
	snakeInit();
	started = false;
	document.onkeydown = checkKey;
    
	context.beginPath();
    context.arc(0,0,1,0,2*Math.PI);
    context.fillStyle = "#FFF";
    context.fill();
    
	setTimeout(initialDrawing,50);
}

function initialDrawing(){
	context.drawImage(apple_img,apple_x,apple_y);
	context.drawImage(snake_head_right_img,body_x[0],body_y[0]);
	context.drawImage(snake_segment_right_img,body_x[1],body_y[1]);
	context.drawImage(snake_segment_right_img,body_x[2],body_y[2]);
	context.drawImage(snake_segment_right_img,body_x[3],body_y[3]);
}
	
checkKey = function(e){
    var willMove = true;
    if(e.keyCode == 37 && body_direction[0] != "left" && body_direction[0] != "right")
    {
        snake_direction = "left";
    }
    else if(e.keyCode == 38 && body_direction[0] != "up" && body_direction[0] != "down")
    {
        snake_direction = "up";
    }
    else if(e.keyCode == 39 && body_direction[0] != "right" && body_direction[0] != "left")
    {
        snake_direction = "right";       
    }
    else if(e.keyCode == 40 && body_direction[0] != "down" && body_direction[0] != "up")
    {
        snake_direction = "down";
    }
    else
    {
		if ( started == false && e.keyCode == 39 )
	    {
			started = true;
			snake_direction = "right";
		}
		else
		{
            willMove = false;
		}
    }

    if (willMove == true)
    {
        snakeMove();
    }
}
function end(){
    clearTimeout(time);
    document.onkeydown = null;
}
function snakeInit(){
    snake_speed=50;
    snake_head_down_img = null;
    snake_head_down_img = new Image();
    snake_head_down_img.src = './head_1.bmp';
	snake_head_right_img = null;
    snake_head_right_img = new Image();
    snake_head_right_img.src = './head_2.bmp';
	snake_head_up_img = null;
    snake_head_up_img = new Image();
    snake_head_up_img.src = './head_3.bmp';
	snake_head_left_img = null;
    snake_head_left_img = new Image();
    snake_head_left_img.src = './head_4.bmp';
	snake_segment_down_img = null;
	snake_segment_down_img = new Image();
	snake_segment_down_img.src = './segment_1.bmp';
	snake_segment_right_img = null;
	snake_segment_right_img = new Image();
	snake_segment_right_img.src = './segment_2.bmp';
	snake_segment_up_img = null;
	snake_segment_up_img = new Image();
	snake_segment_up_img.src = './segment_3.bmp';
	snake_segment_left_img = null;
	snake_segment_left_img = new Image();
	snake_segment_left_img.src = './segment_4.bmp';
    bodyBuild(1*cell_width,4*cell_height,"right");
	bodyBuild(2*cell_width,4*cell_height,"right");
	bodyBuild(3*cell_width,4*cell_height,"right");
	bodyBuild(4*cell_width,4*cell_height,"right");
	var id = body_x[0] / 50 + body_y[0] / 2.5;
	board_is_free[id] =  false;
	id = body_x[1] / 50 + body_y[1] / 2.5;
	board_is_free[id] =  false;
	id = body_x[2] / 50 + body_y[2] / 2.5;
	board_is_free[id] =  false;
	id = body_x[3] / 50 + body_y[3] / 2.5;
	board_is_free[id] =  false;
}

function snakeMove(){
    if( time != null )
    {
        clearTimeout(time);
    }
    snakeCalcBody();
    var last_segment_x = null;
	var last_segment_y = null;
    if (checkEat() == true || apple_is_placed == false)
    {
        appleReplace();
    }
    else
    {
        lastSegment_x = body_x.pop();
		lastSegment_y = body_y.pop();
    }
    
    if (checkCrashBorder() == true || checkCrashBody() == true)
    {
        end();
		body_direction[1] = body_direction[0];
		body_x.shift();
		body_y.shift();
		body_direction.shift();
		redrawSnake();
        return;
    }
    if ( lastSegment_x != null )
    {
        context.clearRect(lastSegment_x,lastSegment_y,50,50);
		var id = lastSegment_x/50 + lastSegment_y/2.5;
		board_is_free[id] =  true;
    }
    redrawSnake();
    
    time = setTimeout(snakeMove,250);
}

function redrawSnake(){
    context.clearRect(body_x[1],body_y[1],cell_width,cell_height);
	switch(body_direction[0])
	{
		case "right":
		    context.drawImage(snake_head_right_img,body_x[0],body_y[0]);
		    break;
		case "up":
		    context.drawImage(snake_head_up_img,body_x[0],body_y[0]);
		    break;
	    case "left":
		    context.drawImage(snake_head_left_img,body_x[0],body_y[0]);
		    break;
		case "down":
		    context.drawImage(snake_head_down_img,body_x[0],body_y[0]);
		    break;
	}
	switch(body_direction[1])
	{
		case "right":
		    context.drawImage(snake_segment_right_img,body_x[1],body_y[1]);
		    break;
		case "up":
		    context.drawImage(snake_segment_up_img,body_x[1],body_y[1]);
		    break;
	    case "left":
		    context.drawImage(snake_segment_left_img,body_x[1],body_y[1]);
		    break;
		case "down":
		    context.drawImage(snake_segment_down_img,body_x[1],body_y[1]);
		    break;
	}
}

function snakeCalcBody(){
    bodyBuild(body_x[0],body_y[0],snake_direction);
    switch (snake_direction)
    {
        case "up":
            body_y[0]=body_y[1]-snake_speed;
        break;
        case "down":
            body_y[0]=body_y[1]+snake_speed;
        break;
        case "right":
		    body_x[0]=body_x[1]+snake_speed;
        break;
        case "left":
            body_x[0]=body_x[1]-snake_speed;
        break;
        default:
        break;
    }
	board_is_free[(body_x[0]/50)+(body_y[0]/2.5)] = false;
    return;
}

function checkEat(){
    if ( checkCollision ( body_x[0], body_y[0], cell_width, cell_height,
apple_x, apple_y, cell_width, cell_height ) == true )
    {
        return true;
    }
    return false;
}

function checkCrashBorder(){
    var x1 = body_x[0];
    var y1 = body_y[0];
    var w1 = cell_width;
    var h1 = cell_height;
    if ( x1 < 0 || y1 < 0 || x1 + w1 > canvas.width || y1 + h1 > canvas.height )
    {
        return true;
    }
    else
    {
        return false;
    }
}

function checkCrashBody(){
    var x1 = body_x[0];
    var y1 = body_y[0];
    var w1 = cell_width;
    var h1 = cell_height;
    for ( var i = 4; i < body_x.length ; i++ )
    {
        var x2 = body_x[i];
        var y2 = body_y[i];
        var w2 = cell_width;
        var h2 = cell_height;
        if ( checkCollision(x1,y1,w1,h1,x2,y2,w2,h2) == true )
        {
            return true;
        }
    }
    return false;
}

function checkCollision(x1,y1,w1,h1,x2,y2,w2,h2){
    if ((y1+h1<=y2)||(y1>=y2+h2)||(x1+w1<=x2)||(x1>=x2+w2))
    {
        return false;
    }
	else
	{
		return true;
	}
}

document.addEventListener("DOMContentLoaded",function(event){
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    gameInit();
    });