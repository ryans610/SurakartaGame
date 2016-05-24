/*Surakarta Control*/
//Class Chess
var Chess={
    //constructor
    newChess:function(x,y){
        var chess={};
        //variable
        chess.chess=document.getElementById("chess-x"+x+"-y"+y);
        chess.color=0;
        chess.x=x;
        chess.y=y;
        //method
        chess.clear=function(){
            this.chess.classList.remove("has-chess","prompt","black","white");
            this.color=0;
        };
        chess.prompt=function(){
            this.chess.classList.add("prompt");
        };
        chess.notPrompt=function(){
            this.chess.classList.remove("prompt");
        };
        chess.setChess=function(color){
            this.chess.classList.add("has-chess",Chess.colors[color]);
            this.color=color;
        };
        //return
        return chess;
    },
    //static variable
    colors:[
        undefined,
        "black",
        "white",
    ],
};

//Board
var Board={
    //variable
    board:[],
    chess:[undefined,[],[]],
    prompt:[],
    //method
    init:function(){
        //clear
        this.board.length=0;
        this.chess[1].length=0;
        this.chess[2].length=0;
        this.prompt.length=0;
        //init
        for(var i=0;i<=5;i++){
            this.board.push([]);
            for(var j=0;j<=5;j++){
                this.board[i][j]=Chess.newChess(i,j);
                this.board[i][j].clear();
            }
        }
        for(var i=0;i<=5;i++){
            for(var j=0;j<=1;j++){
                this.board[i][j].setChess(1);
                this.chess[1].push(this.board[i][j]);
            }
            for(var j=4;j<=5;j++){
                this.board[i][j].setChess(2);
                this.chess[2].push(this.board[i][j]);
            }
        }
    },
    moveChess:function(x1,y1,x2,y2){
        var a=this.board[x1][y1];
        var b=this.board[x2][y2];
        var index=this.getChessIndex(a.color,x1,y1);
        b.setChess(a.color);
        this.chess[a.color][index]=b;
        a.clear();
    },
    eatChess:function(x1,y1,x2,y2){
        var a=this.board[x1][y1];
        var b=this.board[x2][y2];
        var indexA=this.getChessIndex(a.color,x1,y1);
        var indexB=this.getChessIndex(b.color,x2,y2);
        this.chess[b.color].splice(indexB,1);
        this.chess[a.color][indexA]=b;
        b.clear();
        b.setChess(a.color);
        a.clear();
    },
    canDo:function(x,y){
        var result={
            move:[],
            eat:[],
        };
        var color=this.hasChess(x,y);
        if(!color){
            return result;
        }
        //move
        if(x>0&&y>0&&this.canMove(x,y,x-1,y-1)){
            result.move.push({
                x:x-1,
                y:y-1,
            });
        }
        if(x>0&&this.canMove(x,y,x-1,y)){
            result.move.push({
                x:x-1,
                y:y,
            });
        }
        if(x>0&&y<5&&this.canMove(x,y,x-1,y+1)){
            result.move.push({
                x:x-1,
                y:y+1,
            });
        }
        if(y<5&&this.canMove(x,y,x,y+1)){
            result.move.push({
                x:x,
                y:y+1,
            });
        }
        if(x<5&&y<5&&this.canMove(x,y,x+1,y+1)){
            result.move.push({
                x:x+1,
                y:y+1,
            });
        }
        if(x<5&&this.canMove(x,y,x+1,y)){
            result.move.push({
                x:x+1,
                y:y,
            });
        }
        if(x<5&&y>0&&this.canMove(x,y,x+1,y-1)){
            result.move.push({
                x:x+1,
                y:y-1,
            });
        }
        if(y>0&&this.canMove(x,y,x,y-1)){
            result.move.push({
                x:x,
                y:y-1,
            });
        }
        //eat
        var t;
        t=this.eatTravel(x,y+1,0,0);
        if(t.arcs&&t.color!=color){
            result.eat.push({
                x:t.x,
                y:t.y,
            });
        }
        t=this.eatTravel(x+1,y,1,0);
        if(t.arcs&&t.color!=color){
            result.eat.push({
                x:t.x,
                y:t.y,
            });
        }
        t=this.eatTravel(x,y-1,2,0);
        if(t.arcs&&t.color!=color){
            result.eat.push({
                x:t.x,
                y:t.y,
            });
        }
        t=this.eatTravel(x-1,y,3,0);
        if(t.arcs&&t.color!=color){
            result.eat.push({
                x:t.x,
                y:t.y,
            });
        }
        //return
        return result;
    },
    canMove:function(x1,y1,x2,y2){
        if(!this.hasChess(x1,y1)){      //no chess
            return false;
        }
        if(this.hasChess(x2,y2)){       //has chess
            return false;
        }
        if(x1==x2){
            if(Math.abs(y1-y2)==1){
                return true;
            }else{
                return false;
            }
        }else if(y1==y2){
            if(Math.abs(x1-x2)==1){
                return true;
            }else{
                return false;
            }
        }else{
            if(Math.abs(x1-x2)==1&&Math.abs(y1-y2)==1){
                return true;
            }else{
                return false;
            }
        }
    },
    eatTravel:function(x,y,direction,arcs){     //direction 0~3:top,right,bottom,left
        //console.log(x+","+y+","+direction);
        if (x==0&&y==0||
            x==0&&y==5||
            x==5&&y==0||
            x==5&&y==5){    //corner
            return {
                x:x,
                y:y,
                arcs:0,
            };
        }
        if(direction==0){           //top
            var i=y;
            while(i<6){
                if(this.hasChess(x,i)){
                    return {
                        x:x,
                        y:i,
                        color:this.hasChess(x,i),
                        arcs:arcs,
                    };
                }
                i++;
            }
            i=5;
            //no chess
            var a,b;
            if((x<=2&&i<=2)||(x>2&&i>2)){
                a=i;
                b=x;
            }else{
                a=5-i;
                b=5-x;
            }
            return this.eatTravel(a,b,x<=2?1:3,arcs+1);
        }else if(direction==1){     //right
            var i=x;
            while(i<6){
                if(this.hasChess(i,y)){
                    return {
                        x:i,
                        y:y,
                        color:this.hasChess(i,y),
                        arcs:arcs,
                    };
                }
                i++;
            }
            i=5;
            //no chess
            var a,b;
            if((i<=2&&y<=2)||(i>2&&y>2)){
                a=y;
                b=i;
            }else{
                a=5-y;
                b=5-i;
            }
            return this.eatTravel(a,b,y<=2?0:2,arcs+1);
        }else if(direction==2){     //bottom
            var i=y;
            while(i>=0){
                if(this.hasChess(x,i)){
                    return {
                        x:x,
                        y:i,
                        color:this.hasChess(x,i),
                        arcs:arcs,
                    };
                }
                i--;
            }
            i=0;
            //no chess
            var a,b;
            if((x<=2&&i<=2)||(x>2&&i>2)){
                a=i;
                b=x;
            }else{
                a=5-i;
                b=5-x;
            }
            return this.eatTravel(a,b,x<=2?1:3,arcs+1);
        }else if(direction==3){     //left
            var i=x;
            while(i>=0){
                if(this.hasChess(i,y)){
                    return {
                        x:i,
                        y:y,
                        color:this.hasChess(i,y),
                        arcs:arcs,
                    };
                }
                i--;
            }
            i=0;
            //no chess
            var a,b;
            if((i<=2&&y<=2)||(i>2&&y>2)){
                a=y;
                b=i;
            }else{
                a=5-y;
                b=5-i;
            }
            return this.eatTravel(a,b,y<=2?0:2,arcs+1);
        }
    },
    hasChess:function(x,y){
        return this.board[x][y].color;
    },
    getChessIndex:function(color,x,y){
        var index=-1;
        for(var i=0;i<this.chess[color].length;i++){
            if(this.chess[color][i].x==x&&this.chess[color][i].y==y){
                index=i;
                break;
            }
        }
        return index;
    },
    promptChess:function(x,y){
        this.prompt.push(this.board[x][y]);
        this.board[x][y].prompt();
    },
    notPromptChess:function(x,y){
        for(var i=0;i<this.prompt.length;i++){
            if(this.prompt[i].x==x&&this.prompt[i].y==y){
                this.prompt[i].notPrompt();
                this.prompt.splice(i,1);
                break;
            }
        }
    },
};

//control
var step=0;         //0~3,1 chose,1 do,2 chose,2 do
var canDo;
var choseChess={x:null,y:null};
var eventList=[[],[],[]];
var useAI=[undefined,false,false];

function stepGo(){
    step++;
    if(step>3){
        step=0;
    }
}
function prompt(x,y){
    return function(e){
        Board.promptChess(x,y);
    };
}
function notPrompt(x,y){
    return function(e){
        Board.notPromptChess(x,y);
    };
}
function waitChose(){
    var color=Math.floor(step/2)+1;
    for(var i=0;i<Board.chess[color].length;i++){
        var t=Board.chess[color][i];
        eventList[0][i]=chose(t.x,t.y);
        t.chess.addEventListener("click",eventList[0][i]);
        eventList[1][i]=prompt(t.x,t.y);
        t.chess.addEventListener("mouseenter",eventList[1][i]);
        eventList[2][i]=notPrompt(t.x,t.y);
        t.chess.addEventListener("mouseleave",eventList[2][i]);
    }
}
function chose(x,y){
    return function(e){
        console.log("chose:"+x+","+y);
        choseChess.x=x;
        choseChess.y=y;
        var color=Math.floor(step/2)+1;
        for(var i=0;i<Board.chess[color].length;i++){
            Board.chess[color][i].chess.removeEventListener("click",eventList[0][i]);
            Board.chess[color][i].chess.removeEventListener("mouseenter",eventList[1][i]);
            Board.chess[color][i].chess.removeEventListener("mouseleave",eventList[2][i]);
        }
        eventList[0].length=0;
        eventList[1].length=0;
        eventList[2].length=0;
        canDo=Board.canDo(x,y);
        for(var i=0;i<canDo.move.length;i++){
            var t=Board.board[canDo.move[i].x][canDo.move[i].y];
            prompt(t.x,t.y)(0);
            eventList[0][i]=doTo(t.x,t.y,0);
            t.chess.addEventListener("click",eventList[0][i]);
        }
        for(var i=0;i<canDo.eat.length;i++){
            var t=Board.board[canDo.eat[i].x][canDo.eat[i].y];
            prompt(t.x,t.y)(0);
            eventList[1][i]=doTo(t.x,t.y,1);
            t.chess.addEventListener("click",eventList[1][i]);
        }
        stepGo();
    };
}
function doTo(x,y,action){          //action:0 move,1 eat
    return function(e){
        console.log("do:"+x+","+y+","+action);
        for(var i=0;i<canDo.move.length;i++){
            var t=Board.board[canDo.move[i].x][canDo.move[i].y];
            notPrompt(t.x,t.y)(0);
            t.chess.removeEventListener("click",eventList[0][i]);
        }
        for(var i=0;i<canDo.eat.length;i++){
            var t=Board.board[canDo.eat[i].x][canDo.eat[i].y];
            notPrompt(t.x,t.y)(0);
            t.chess.removeEventListener("click",eventList[1][i]);
        }
        eventList[0].length=0;
        eventList[1].length=0;
        if(action==0){          //move
            Board.moveChess(choseChess.x,choseChess.y,x,y);
        }else if(action==1){    //eat
            Board.eatChess(choseChess.x,choseChess.y,x,y)
        }
        choseChess.x=null;
        choseChess.y=null;
        canDo=undefined;
        stepGo();
        waitChose();
    };
}
function reset(){
    for(var i=0;i<6;i++){
        for(var j=0;j<6;j++){
            var t=Board.board[i][j].chess;
            var n=t.cloneNode();
            t.parentNode.replaceChild(n,t);
        }
    }
    Board.init();
    step=0;
    canDo=undefined;
    choseChess.x=null;
    choseChess.y=null;
    eventList[0].length=0;
    eventList[1].length=0;
    eventList[2].length=0;
    waitChose();
}

//AI control

//initial
document.getElementById("use-ai-1").addEventListener("change",function(){
    useAI[1]=this.checked;
    reset();
});
document.getElementById("use-ai-2").addEventListener("change",function(){
    useAI[2]=this.checked;
    reset();
});
document.getElementById("reset").addEventListener("click",reset);
Board.init();
waitChose();
