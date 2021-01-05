
let buttonStart = document.getElementById("btn-start");
let buttonStop = document.getElementById("btn-stop");
let panelStart = document.getElementById("pnl-start");
let panelStop = document.getElementById("pnl-stop");
let buttonGenerer = document.getElementById("generer-tableau");

let tour = 0;
let panelTour = document.getElementById("pnl-tour");

// Tableau
let inputX = document.getElementById("taille");
let inputY = document.getElementById("taille");
let tableau = [[]];
let pnlTableau = document.getElementById("pnl-tableau");
let tableauX = 750;
let tableauY = 750;

// speed
let sliderSpeed = document.getElementById("slider-speed");
let outputSpeed = document.getElementById("output-speed");
let speed = sliderSpeed.value;
outputSpeed.innerHTML = (sliderSpeed.value/1000).toFixed(2) + "s";

sliderSpeed.oninput = function() {
    outputSpeed.innerHTML = (sliderSpeed.value/1000).toFixed(2) + "s";
    speed = sliderSpeed.value;
}

//non utilisé
let etat = 0; // 0 = Eteinds, 1 = En cours

buttonStart.addEventListener("click", start);
buttonStop.addEventListener("click", stop);
buttonGenerer.addEventListener("click", genererTableau);

init();

// fonction de base

function init() {
    genererTableau();
}

function start() {
    panelStart.style.display = "none";
    panelStop.style.display = "inline";
    etat = 1;

    setTimeout(update, speed);
}

function update() {
    if(etat != 0) {
        calculerUnTour();
        tour = tour + 1;
        updateTour(tour);
        setTimeout(update, speed);
    }
}

function stop() {
    panelStop.style.display = "none";
    panelStart.style.display = "inline";
    etat = 0;
    tour = 0;
    updateTour(tour);
}


// Fonction Jeu de la vie

function calculerUnTour() {
    let tableauClone = JSON.parse(JSON.stringify(tableau));
    for(let i = 0; i < tableau.length; i++) {
        for(let j = 0; j < tableau[i].length; j++) {
            let nbCellVivante = verifierNombreCelluleVivante(j, i);
            if(tableau[i][j] == 0) {
                if(nbCellVivante == 3) {
                    tableauClone[i][j] = 1;
                }
            } else {
                if(nbCellVivante < 2 || nbCellVivante > 3) {
                    tableauClone[i][j] = 0;
                }
            }
        }
    }
    tableau = tableauClone;
    afficherTableau();
}

function verifierNombreCelluleVivante(x, y) {
    let xMax = inputX.value;
    let yMax = inputY.value;
    let nbCellVivante = 0;

    if(y-1 >= 0) {
        nbCellVivante += verifCelluleVivante(x, y-1);
    }
    if(x-1 >= 0) {
        nbCellVivante += verifCelluleVivante(x-1, y);
    }
    if(y+1 < yMax) {
        nbCellVivante += verifCelluleVivante(x, y+1);
    }
    if(x+1 < xMax) {
        nbCellVivante += verifCelluleVivante(x+1, y);
    }
    if(y-1 >= 0 && x-1 >= 0) {
        nbCellVivante += verifCelluleVivante(x-1, y-1);
    }
    if(y-1 >= 0 && x+1 < xMax) {
        nbCellVivante += verifCelluleVivante(x+1, y-1);
    }
    if(y+1 < yMax && x-1 >= 0) {
        nbCellVivante += verifCelluleVivante(x-1, y+1);
    }
    if(y+1 < yMax && x+1 < xMax) {
        nbCellVivante += verifCelluleVivante(x+1, y+1);
    }
    return nbCellVivante;
}

function verifCelluleVivante(x, y) {
    return tableau[y][x] == 1 ? 1 : 0;
}



// Fonction Spécifique

function genererTableau() {
    // phase d'initialisation
    let x = inputX.value;
    let y = inputY.value;
    tableau = new Array(y);
    for(let i = 0; i < y; i++) {
        tableau[i] = new Array(x);
        for(let j = 0; j < x; j++) {
            tableau[i][j] = 0;
        }
    }
    afficherTableau();
}

function afficherTableau() {
    let ctnTableau = "<table id=\"ctn-table\">";
    let height = tableauY / tableau.length;
    for(let i = 0; i < tableau.length; i++) {
        ctnTableau += "<tr>";
        let width = tableauX / tableau[i].length;
        for(let j = 0; j < tableau[i].length; j++) {
            let style = "";
            if(tableau[i][j] == 1) {
                style = 'style="height:'+height + "px;width:" +width+ 'px;background-color: black;"'
            } else {
                style = 'style="height:'+height + "px;width:" +width+ 'px;"';
            }
            ctnTableau += "<td "+style+"></td>";
        }
        ctnTableau += "</tr>"
    }
    ctnTableau += "</table>";
    pnlTableau.innerHTML = ctnTableau;
    ajoutListener();
}

function ajoutListener() {
    let table = document.getElementById("ctn-table");
    if(table != null) {
        for(let i = 0; i < table.rows.length; i++) {
            for(let j = 0; j < table.rows[i].cells.length; j++) {
                table.rows[i].cells[j].onclick = function () {
                    updateCase(this, j, i);
                }
            }
        }
    }
}

function updateTour(tour) {
    panelTour.innerHTML = "Tour : " + tour;
}

function updateCase(cell, x, y) {
    if(etat != 1) {
        let val = tableau[y][x];
        if(val == 0) {
            tableau[y][x] = 1;
            cell.style.backgroundColor = "black";
        } else {
            tableau[y][x] = 0;
            cell.style.backgroundColor = "white";
        }
    }
}
