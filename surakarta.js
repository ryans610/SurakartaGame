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
    //method
    init:function(){
        //clear
        this.board.length=0;
        this.chess[1].length=0;
        this.chess[2].length=0;
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
    canDo:function(x1,y1,x2,y2){        //1 move,2 eat
        if(!this.hasChess(x1,y1)){      //no chess
            return 0;
        }
        if(!this.hasChess(x2,y2)){      //no chess
            if(x1==x2){
                if(Math.abs(y1-y2)==1){
                    return 1;
                }else{
                    return 0;
                }
            }else if(y1==y2){
                if(Math.abs(x1-x2)==1){
                    return 1;
                }else{
                    return 0;
                }
            }else{
                if(Math.abs(x1-x2)==1&&Math.abs(y1-y2)==1){
                    return 1;
                }else{
                    return 0;
                }
            }
        }else{                          //has chess
            if(this.hasChess(x1,y1)==this.hasChess(x2,y2)){ //same color
                return 0;
            }

        }
    },
    eatTravel:function(x,y,direction,arcs){     //direction 0~3:top,right,bottom,left
        if (x==0&&y==0&&||
            x==0&&y==5&&||
            x==5&&y==0&&||
            x==5&&y==5&&){    //corner
            return {
                x:x,
                y,y,
                arcs:0,
            };
        }
        if(direction==0){   //top
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
            }
            //no chess
            
        }
    },
    hasChess:function(x,y){
        return board[x][y].color;
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
};

//initial
Board.init();
