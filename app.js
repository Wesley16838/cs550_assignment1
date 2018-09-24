var readlineSync = require('readline-sync');
var fs = require('fs');

//Each player signs
var player = ['X', 'O', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'Y', 'Z'];

//Declare the board
var board = [];

//WTF is this?
var winner = '\0';

//var userName = readlineSync.question('May I have your name? ');

//Input x & y
var x, y = 0;
//Count round
var cnt = 0;
//Board length
var size = 0;
//Numbers of player
var players = 0;
//Win sequence
var wincount = 0;

//Current player's sequence
var winO = 0;

var gameend = false;


//Load savegame
if (readlineSync.question("Load game? (Yes/No)").toLowerCase() != "no") {
    var filename = readlineSync.question("Please enter a file name:(without .json): ");
    var file=filename+".json";
    
    if (fs.existsSync(file)){
        var loadgame = require('./' + filename + '.json');
        size = loadgame.size;
        players = loadgame.players;
        wincount = loadgame.wincount;
        cnt = loadgame.cnt;
    
        //Store previous board to current board
        for (let i = 0; i < size; i++) {
            board[i] = [];
            for (let j = 0; j < size; j++) {
                board[i][j] = loadgame.board[i][j];
            }
        }
    }else{
        
        do{
            
            var filename_new = readlineSync.question('Please re-enter a file name(without .json):');
            var file_new=filename_new+".json";
            
            if(fs.existsSync(file_new)){
                var loadgame = require('./' + filename_new + '.json');
                size = loadgame.size;
                players = loadgame.players;
                wincount = loadgame.wincount;
                cnt = loadgame.cnt;
            
                //Store previous board to current board
                for (let i = 0; i < size; i++) {
                    board[i] = [];
                    for (let j = 0; j < size; j++) {
                        board[i][j] = loadgame.board[i][j];
                    }
                }
            }else{
                console.log("The file doesn't existed.");
                continue;
            }
        }while(!fs.existsSync(file_new))
    }
   
}else {
    //Board Settings input from user
    // size = readlineSync.questionInt("Please enter the size of board:");
    while(true){
        size=readlineSync.questionInt('Please enter the size of board:');
        if(size>999){
            console.log("Size must be smaller than 999! Please ipnut again!");
        }else if(size<0){
            console.log("Size must be larger than 0! Please ipnut again!");
        }else{
            break;
        }
    }
    //Initialize the board
    for (let i = 0; i < size; i++) {
        board[i] = [];
        for (let j = 0; j < size; j++) {
            board[i][j] = '\0';
        }
    }

    while(true){
        players=readlineSync.questionInt('Please enter the amount players:');
        if(players > 26) {
            console.log("Players must be smaller than 26! Please ipnut again!");
        }else if(players<0){
            console.log("Players must be larger than 0! Please ipnut again!");
        }else{
            break;
        }
    }

    while(true){
        wincount=readlineSync.questionInt('Please enter the win sequence:');
        let numsize=parseInt(size);
        if(wincount > numsize) {
            console.log("Players must be smaller than"+size+"! Please ipnut again!");
        }else if(wincount<3){
            console.log("Players must be larger than 3! Please ipnut again!");
        }else{
            break;
        }
    }

}



//Game main loop (game start here)
while (cnt < size * size && !gameend) {
    printresult(size, board);

    //Store player current position
    console.log("Player" + ((cnt % players) + 1) + "(" + player[cnt % players] + "):");
    var input = readlineSync.question("Please enter X and Y with a space sperate then:");
    var arr = [0,0];
    var cnt_input=0;
    for(var x = 0 ; x < input.length ; x++){
        if(input[x] === ' '){
            cnt_input++;
            x++;
        }
        arr[cnt_input] = arr[cnt_input]*10 + parseInt(input[x]);
    }
    x = arr[0];
    y = arr[1];
    
    //If the entered position larger than board size
    if (x > size || y > size) {
        console.log("Wrong position!");
        continue;
    }

    //If the entered position is occupied by others
    if (board[x - 1][y - 1] == '\0') {
        board[x - 1][y - 1] = player[cnt % players];
        cnt++;
    }
    else {
        console.log("Wrong position!");
    }

    //Save game
    var inputtype=true;
    while(inputtype){
        switch(readlineSync.question("Save game? (Yes/No): ").toLowerCase()){
            case "no":
                inputtype=false;
                break;
            case "yes":
                inputtype=false;
            //Create a new array to store the board status (to avoid saving 999 x 999 array each time)
            let board_save = [];
            for (let i = 0; i < size; i++) {
                board_save[i] = [];
                for (let j = 0; j < size; j++) {
                    board_save[i][j] = board[i][j];
                }
            }
    
            let savegame = {
                size: size,
                players: players,
                wincount: wincount,
                cnt: cnt,
                board: board_save
            };
    
            let data = JSON.stringify(savegame);
    
            //
            var filename = readlineSync.question('Please enter a file name: ');
            var file=filename+".json"
            if (fs.existsSync(file)) {
                var ans = readlineSync.question('The file has existed. Do you want to overwrite it?(y/n)');
                if(ans.toLowerCase()=="y")
                {
                    fs.writeFile(file, data ,'utf8', function(err) {
                        if(err) {
                            console.log(err);
                        } else {
                            console.log("The file was saved!");
                        }
                    });
                }else{
                    do{
                        var filename_new = readlineSync.question('Please enter a different file name:');
                        var file_new=filename_new+".json"
                        if(fs.existsSync(file_new)==false){
                            
                            fs.writeFile(file_new , data ,'utf8', function(err) {
                                if(err) {
                                    console.log(err);
                                } else {
                                    console.log("The file was saved!");
                                }
                            });
                            break;
                        }else{
                            console.log("The file "+file_new+" has existed.");
                            continue;
                        }
                    }while(fs.existsSync(file_new))
                }
            }else{
                fs.writeFile(file, data ,'utf8', function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("The file was saved!");
                    }
                });
            }
            //
            return;
    
            default:
                console.log("please input yes or no!");
                
        }
    }
    

    //Calculate Win sequence (type 1)
    for (let b = 0; b < players; b++) {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size - wincount + 1; j++) {
                if (board[i][j] == player[b]) {
                    for (let a = 0; a < wincount; a++) {
                        if (board[i][j + a + 1] == player[b]) {
                            winO++;
                        }
                        else {
                            winO = 0;
                            break;
                        }
                        if (winO == wincount - 1) {
                            winner = player[b];
                            gameend = true;
                            break;
                        }
                        if (a == wincount && winO != wincount - 1) {
                            winO = 0;
                            break;
                        }
                    }
                }
            }
        }
    }

    //Calculate Win sequence (type 2)
    for (let b = 0; b < players; b++) {
        for (let j = 0; j < size; j++) {
            for (let i = 0; i < size - wincount + 1; i++) {
                if (board[i][j] == player[b]) {
                    for (let a = 0; a < wincount; a++) {
                        if (board[i + a + 1][j] == player[b]) {
                            winO++;
                        }
                        else {
                            winO = 0;
                            break;
                        }
                        if (winO == wincount - 1) {
                            winner = player[b];
                            gameend = true;
                            break;
                        }
                        if (a == wincount - 1 && winO != wincount - 1) {
                            winO = 0;
                            break;
                        }
                    }
                }
            }
        }
    }

    //Calculate Win sequence (type 3)
    for (let b = 0; b < players; b++) {
        for (let i = 0; i < size - wincount + 1; i++) {
            for (let j = 0; j < size - wincount + 1; j++) {
                if (board[i][j] == player[b]) {
                    for (let a = 0; a < wincount; a++) {
                        if (board[i + a + 1][j + a + 1] == player[b]) {
                            winO++;
                        }
                        else {
                            winO = 0;
                            break;
                        }
                        if (winO == wincount - 1) {
                            winner = player[b];
                            gameend = true;
                            break;
                        }
                        if (a == wincount && winO != wincount - 1) {
                            winO = 0;
                            break;
                        }
                    }
                }
            }
        }
    }

    //Calculate Win sequence (type 4)
    if(wincount == size) {
        for(b = 0 ; b < players ; b++) {
            
                if(board[size-1][0] == player[b]) {
                    for(a = 0 ; a < wincount ; a++) {
                        if(board[i-a][a+1] == player[b]) {
                            winO++;
                            }
                        else {
                            winO = 0;
                            break;
                            }
                        if(winO == wincount - 1) {
                            winner = player[b]; 
                            gameend = true; 
                            break;
                            }
                        if(a == wincount && winO != wincount - 1) {
                            winO = 0; 
                            break;
                            }
                    }
                }
            }
        }
        
        
    else {
    for(b = 0 ; b < players ; b++) {
        for(i = size-1 ; i >= size-wincount; i--) {
            for(j = 0 ; j < size-wincount+1 ; j++) {
                if(board[i][j] == player[b]) {
                    for(a = 0 ; a < wincount ; a++) {
                        if(board[i-a-1][j+a+1] == player[b]) {
                            winO++;
                            }
                        else {
                            winO = 0;
                            break;
                            }
                        if(winO == wincount - 1) {
                            winner = player[b]; 
                            gameend = true; 
                            break;
                            }
                        if(a == wincount && winO != wincount - 1) {
                            winO = 0; 
                            break;
                            }
                    }
                }
            }
        }
    }
    }
}

//Print Tie or Winner
printresult(size, board);
if (cnt == size * size) {
    process.stdout.write("\ntie");
}
else {
    process.stdout.write("\nwinner is:" + winner);
}

//Print result in format
function printresult(size, board) {

    //Print result
    process.stdout.write("    ");
    for (let i = 0; i < size; i++) {
        if (i < 9)
            process.stdout.write(" " + (i + 1) + "  ");
        else if (i >= 9 && i < 99)
            process.stdout.write(" " + (i + 1) + " ");
        else if (i >= 99)
            process.stdout.write((i + 1) + " ");
    }
    process.stdout.write("\n");

    for (let i = 0; i < size; i++) {
        if (i < 9)
            process.stdout.write((i + 1) + "    ");
        else if (i >= 9 && i < 99)
            process.stdout.write((i + 1) + "   ");
        else if (i >= 99)
            process.stdout.write((i + 1) + "  ");

        for (let j = 0; j < size; j++) {
            if (j == size - 1)
                process.stdout.write(board[i][j]);
            else
                process.stdout.write(board[i][j] + " | ");
        }
        if (i != size - 1) {
            process.stdout.write("\n");
            for (let j = 0; j < size; j++) {
                if (j == 0) {
                    if (i < 9)
                        process.stdout.write("    ---+");
                    else if (i >= 9 && i < 99)
                        process.stdout.write("    ---+");
                    else if (i >= 99)
                        process.stdout.write("    ---+");
                }
                else if (j == size - 1)
                    process.stdout.write("---");
                else
                    process.stdout.write("---+");
            }
        }
        process.stdout.write("\n");
    }
}