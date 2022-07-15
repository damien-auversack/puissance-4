// Util ---------------------------------
const log = (text) =>{
    console.log(JSON.parse(JSON.stringify(text)));
};
const color = {
    RED:'🔴',
    YELLOW:'🟡',
    EMPTY:''
};

// Model ---------------------------------
const addToken = (grid, x,color) => {
    let y = findFreeY(grid, x);
    if(y!=-1) {
        grid[y][x] = color;
        return true;
    }
    return false;
};
const findFreeY = (grid, x) => {
    for (let y = grid.length-1; y >= 0; y--) {
        if(grid[y][x]===color.EMPTY) {
            return y;
        }
    }
    return -1
};
const getColorToken = (grid, tokenPosition) => {
    
    let elt = grid[tokenPosition.y][tokenPosition.x];
    if(elt == '🔴') return color.RED;
    else if(elt == '🟡') return color.YELLOW;
    else if(elt == '') return color.EMPTY;
};
const isWin = (grid, tokenPosition) => {
    if(countVertically(grid, tokenPosition)[0] >= 4) return [true, countVertically(grid, tokenPosition)[1]];
    if(countHorizontally(grid, tokenPosition)[0] >= 4) return [true, countHorizontally(grid, tokenPosition)[1]];
    if(countDiagonalBotLeftToTopRight(grid, tokenPosition)[0] >= 4) return [true, countDiagonalBotLeftToTopRight(grid, tokenPosition)[1]];
    if(countDiagonalTopLeftToBotRight(grid, tokenPosition)[0] >= 4) return [true, countDiagonalTopLeftToBotRight(grid, tokenPosition)[1]];

    return false;
};
const isWinMoreInfos = (tokenPosition) => {
    if(countVertically(tokenPosition)[0] >= 4) return 'Win Vertically';
    if(countHorizontally(tokenPosition)[0] >= 4) return 'Win Horizontally';
    if(countDiagonalBotLeftToTopRight(tokenPosition)[0] >= 4) return 'Win DiagonalBotLeftToTopRight';
    if(countDiagonalTopLeftToBotRight(tokenPosition)[0] >= 4) return 'Win DiagonalTopLeftToBotRight';

    return 'Pas gagné';
};
const isTokenPositionOK = (grid, tokenPosition) => {
    if(tokenPosition.x < 0 || tokenPosition.y < 0) return false;
    if(tokenPosition.y>grid.length-1) return false;
    if(tokenPosition.x > grid[0].length-1) return false;
    if(grid[tokenPosition.y][tokenPosition.x] == color.EMPTY) return false;

    return true;
};
const countVertically = (grid, tokenPosition) => {
    if(!isTokenPositionOK(grid, tokenPosition)) return 0;

    let winningPosition = [];
    let nbVertically = 0;
    let actualColor = grid[tokenPosition.y][tokenPosition.x];
    // Sup et egal
    for (let y = tokenPosition.y; y <= grid.length-1; y++) {  
        if(grid[y][tokenPosition.x] != actualColor) break;
        nbVertically++;
        winningPosition.push({x:tokenPosition.x,y:y});
    }
    // Inf
    for (let y = tokenPosition.y-1; y >= 0; y--) { 
        if(grid[y][tokenPosition.x] != actualColor) break;
        nbVertically++;
        winningPosition.push({x:tokenPosition.x,y:y});
    }
    return [nbVertically,winningPosition];
};
const countHorizontally = (grid, tokenPosition) => {
    if(!isTokenPositionOK(grid, tokenPosition)) return 0;

    let winningPosition = [];
    let nbHorizontally = 0;
    let actualColor = grid[tokenPosition.y][tokenPosition.x];
    // Sup et egal
    for (let x = tokenPosition.x; x <= grid[tokenPosition.y].length-1; x++) {  
        if(grid[tokenPosition.y][x] != actualColor) break;
        nbHorizontally++;
        winningPosition.push({x:x,y:tokenPosition.y});
    }
    // Inf
    for (let x = tokenPosition.x-1; x >= 0; x--) { 
        if(grid[tokenPosition.y][x] != actualColor) break;
        nbHorizontally++;
        winningPosition.push({x:x,y:tokenPosition.y});
    }
    return [nbHorizontally,winningPosition];
};
const countDiagonalBotLeftToTopRight = (grid, tokenPosition) => {
    if(!isTokenPositionOK(grid, tokenPosition)) return 0;

    let winningPosition = [];
    let nbDiagonalBotLeftToTopRight = 0;
    let actualColor = grid[tokenPosition.y][tokenPosition.x];
    // Sup et egal
    let y=tokenPosition.y, x= tokenPosition.x;
    while(true) {       
        if(!isTokenPositionOK(grid, {x:x,y:y})) break;
        if(grid[y][x] != actualColor) break;
        nbDiagonalBotLeftToTopRight++;
        winningPosition.push({x:x,y:y});
        y--;
        x++;
    }
    y=tokenPosition.y; x=tokenPosition.x;
    while(true) {    
        if(!isTokenPositionOK(grid, {x:x,y:y})) {
            nbDiagonalBotLeftToTopRight--;
            break;
        }
        if(grid[y][x] != actualColor) {
            nbDiagonalBotLeftToTopRight--;
            break;
        }
        nbDiagonalBotLeftToTopRight++;
        winningPosition.push({x:x,y:y});
        y++;
        x--;
    }
    return [nbDiagonalBotLeftToTopRight, winningPosition];
};
const countDiagonalTopLeftToBotRight = (grid, tokenPosition) => {
    if(!isTokenPositionOK(grid, tokenPosition)) return 0;

    let winningPosition = [];
    let nbDiagonalTopLeftToBotRight = 0;
    let actualColor = grid[tokenPosition.y][tokenPosition.x];
    // Sup et egal
    let y=tokenPosition.y, x= tokenPosition.x;
    while(true) {       
        if(!isTokenPositionOK(grid, {x:x,y:y})) break;
        
        if(grid[y][x] != actualColor) break;
        nbDiagonalTopLeftToBotRight++;
        winningPosition.push({x:x,y:y});
        y++;
        x++;
    }

    y=tokenPosition.y;
    x=tokenPosition.x;
    while(true) {    
        if(!isTokenPositionOK(grid, {x:x,y:y})) {
            nbDiagonalTopLeftToBotRight--;
            break;
        }
        if(grid[y][x] != actualColor) {
            nbDiagonalTopLeftToBotRight--;
            break;
        }
        nbDiagonalTopLeftToBotRight++;
        winningPosition.push({x:x,y:y});
        y--;
        x--;
    }
    return [nbDiagonalTopLeftToBotRight, winningPosition];
};

// View ---------------------------------
const colorWinTokens = (positionsArray) => {

    positionsArray.forEach(position => {
        let tokenPlace = document.getElementById('grid_r-'+(position.y+1)+'_c-'+(position.x+1));;
        tokenPlace.classList.add("winTokens");
    });
};
const createGridView = () => {
    let viewGrid = document.getElementById('grid');
    let table = document.createElement('table');

    for (let row = 1; row <= 7; row++) {
        let tr = document.createElement('tr');
        for (let column = 1; column <= 7; column++) {
            if(row==1) {
                let imgArrow = document.createElement('div');
                imgArrow.classList.add("arrowBtn");
                let th = document.createElement('th');
                th.classList.add("btn-tokenArrow", 'noselect');
                th.appendChild(imgArrow);
                tr.appendChild(th);
            }else {
                let td = document.createElement('td');
                td.id = 'grid_r-'+(row-1)+'_c-'+column;
                tr.appendChild(td);
            } 
        }
        table.appendChild(tr)
    }
    viewGrid.appendChild(table); 
};
const game = (grid, currentColor) => {
    let btnEvents = document.getElementsByClassName('btn-tokenArrow');
    let subtitle = document.getElementById('subtitle');
    let actualTokenPosition = {x:0,y:0};
    for (let i = 0; i < btnEvents.length; i++) {
        btnEvents[i].addEventListener('click', ()=> {
            if(isWin(grid, {x:actualTokenPosition.x,y:actualTokenPosition.y})[0]) return;
            
            actualTokenPosition = {x:i,y:findFreeY(grid, i)};
            if(actualTokenPosition.y<0)return;    
  
            addToken(grid, i,currentColor);
            let actualColorToken = getColorToken(grid, actualTokenPosition);
            if(currentColor==color.RED) {
                currentColor = color.YELLOW;
                subtitle.textContent = 'Tour du joueur '+((currentColor==color.RED)?'rouge : 🔴':'jaune : 🟡');      
                let tokenPlaceR = document.getElementById('grid_r-'+(actualTokenPosition.y+1)+'_c-'+(actualTokenPosition.x+1));
                tokenPlaceR.style.backgroundColor='red';
            }
            else {
                currentColor = color.RED;
                subtitle.textContent = 'Tour du joueur '+((currentColor==color.RED)?'rouge : 🔴':'jaune : 🟡');
                let tokenPlaceY = document.getElementById('grid_r-'+(actualTokenPosition.y+1)+'_c-'+(actualTokenPosition.x+1));
                tokenPlaceY.style.backgroundColor='yellow';
            };
            if(isWin(grid, {x:actualTokenPosition.x,y:actualTokenPosition.y})[0]) {
                let winningPosition = isWin(grid, {x:actualTokenPosition.x,y:actualTokenPosition.y})[1];
                colorWinTokens(winningPosition);
                subtitle.textContent = 'Victoire du joueur '+((actualColorToken==color.RED)?'rouge ! 🔴 ':'jaune ! 🟡');
            }
        });
    }
};

// Main ---------------------------------
const main = () => {
    
    let grid = [
        [color.EMPTY, color.EMPTY, color.EMPTY, color.EMPTY, color.EMPTY, color.EMPTY, color.EMPTY],
        [color.EMPTY, color.EMPTY, color.EMPTY, color.EMPTY, color.EMPTY, color.EMPTY, color.EMPTY],
        [color.EMPTY, color.EMPTY, color.EMPTY, color.EMPTY, color.EMPTY, color.EMPTY, color.EMPTY],
        [color.EMPTY, color.EMPTY, color.EMPTY, color.EMPTY, color.EMPTY, color.EMPTY, color.EMPTY],
        [color.EMPTY, color.EMPTY, color.EMPTY, color.EMPTY, color.EMPTY, color.EMPTY, color.EMPTY],
        [color.EMPTY, color.EMPTY, color.EMPTY, color.EMPTY, color.EMPTY, color.EMPTY, color.EMPTY]
    ];

    let currentColor = color.RED;
    let subtitle = document.getElementById('subtitle'); 
    subtitle.textContent = 'Tour du joueur '+((currentColor==color.RED)?'rouge : 🔴':'jaune : 🟡');

    createGridView();
    
    game(grid, currentColor);
};

main();
