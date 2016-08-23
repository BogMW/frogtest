/**
 * Created by BogMW on 02.06.2016.
 */
/*Оголошуємо розмір поля, початкові та кінцеві координати*/
var map_h = 10;                                             // Висота поля
var map_w = 16;                                             // Ширина поля
var start_h = 6;                                            // Початкова точка по висоті
var start_w = 10;                                           // Початкова точка по ширині
var end_h = 9;                                              // Кінцева точка по висоті
var end_w = 8;                                              // Кінцева точка по ширині

/*Створюємо масив, в якому будуть зберігатися 5 можливих стрибків жабки*/
var possible_moves = [
    [1, 2], [-2,  1], [-1,  2], [ 2,  1], [ 0, 3]];

/*Створюємо масив, в якому будуть зберігатися 5 можливих зворотніх стрибків жабки, згідно яких будемо шукати маршрут*/
var back_moves = [
    [-1,  -2],[-2,  -1], [1, -2], [ 2,  -1], [ 0, -3]];

/*Створюємо масив, в якому будуть зберігатися розташування дерев*/
var tree = [[5, 8], [9, 14]];

/*Створюємо масив, в який будемо записувати маршрут, відразу вказуємо кінцеву точку*/
var track = [];
track[0] = [end_h, end_w];

/*Створюємо 2-х вимірний масив, який буду імітувати поле, та заповнюємо його -1, щоб позначити точки в яких жабка ще не була*/
var map = new Array(map_h);
for(var i = 0; i < map_h; i++) {
    map[i] = new Array(map_w);
    for(var j = 0; j < map_w; j++) {
        map[i][j] = -1;
    }
}
map[start_h][start_w] = 0;                                   // Позначаємо початкову точку як 0
map[end_h][end_w] = 999;                                     // Кінцеву точку позначаємо як 999


for(var t = 0; t < tree.length; t++){                      // В наш уже створенний масив, який заповнений -1, вносимо -2, щоб позначити дерева, на які жабка не може стрибати
    map[tree[t][0]][tree[t][1]] = -2;
}

function makeJump() {
    var min_steps = 0;
    for(var i = 0; i < map_h*map_w; i++){                   // Головний цикл, ітерація на якій буде знайдено кінцеву точку, і буде мінімальною кількістю кроків
        for(var j = 0; j < map_h; j++){                     // Перебираємо усі стрічки
            for(var k = 0; k < map_w; k++){                 // Перебираємо кожну комірку в строці
                if(map[j][k] == i){                         // Шукаємо точку, з якої робити крок
                    /*Перебираємо тут усі кроки, та перевіряємо, щоб не виходило за межі*/
                    for(var z = 0; z < 5; z++){
                        if( (j+possible_moves[z][0] >= 0) && (j+possible_moves[z][0] < map_h)) {                        // Перевіряємо, щоб жабка не випригнула за межі поля
        if(k+possible_moves[z][1] > map_w){                                                                             // Перевіряємо, чи дійшла жабка кінця кола, в такому випадку, переміщаємо її на початок масиву, для імітації кола
                                if (map[j+possible_moves[z][0]][k+possible_moves[z][1]-map_w] == 999) {                 // Перевіряємо, чи після стрибка вона не попала в кінцеву точку
                                    min_steps = i+1;                                                                    // Якщо ми знайшли кінцеву точку
                                    return min_steps;
                                } else if(map[j+possible_moves[z][0]][k+possible_moves[z][1]-map_w] == -1){             // Перевіряємо чи можна стрибнути на дану комірку
                                    map[j+possible_moves[z][0]][k+possible_moves[z][1]-map_w] = i+1;                    // Якщо можна, записуємо в дану комірку номер головної ітерації + 1, щоб в подальшому згідно цього номеру жабка пригала з цієї комірки
                                }
                            } else {
                                if (map[j+possible_moves[z][0]][k+possible_moves[z][1]] == 999) {                       // Перевіряємо, чи після стрибка вона не попала в кінцеву точку
                                    min_steps = i+1;
                                    return min_steps;
                                } else if(map[j+possible_moves[z][0]][k+possible_moves[z][1]] == -1){
                                    map[j+possible_moves[z][0]][k+possible_moves[z][1]] = i+1;
                                }
                            }

                        }
                    }
                }
            }
        }
    }
}

function backJump(steps) {
    var counterr = steps;
    var tracks = [];
    for(var i = steps; i > 0; i--){
                if(steps == counterr) {
                    for(var z = 0; z < 5; z++) {
                        if( (end_h+back_moves[z][0] >= 0) && (end_h+back_moves[z][0] < map_h)) {
                            if (map[end_h + back_moves[z][0]][end_w + back_moves[z][1]] == steps - 1) {
                                tracks[tracks.length] = [end_h + back_moves[z][0], end_w + back_moves[z][1]];
                                steps = steps-1;
                            }
                        }
                    }
                        } else {
                        /*Перебираємо тут усі кроки, та перевіряємо, щоб не виходило за межі*/
                        for(z = 0; z < 5; z++){
                            if( (tracks[tracks.length-1][0]+back_moves[z][0] >= 0) && (tracks[tracks.length-1][0]+back_moves[z][0] < map_h)) {            // Перевіряємо, щоб жабка не випригнула за межі поля
                                if(tracks[tracks.length-1][1]+back_moves[z][1] < 0){                                                                           // Перевіряємо, чи дійшла жабка кінця кола, в такому випадку, переміщаємо її на початок масиву, для імітації кола
                                     if(map[tracks[tracks.length-1][0]+back_moves[z][0]][tracks[tracks.length-1][1]+back_moves[z][1]+map_w] == steps-1){
                                        tracks[tracks.length] = [ tracks[tracks.length-1][0]+back_moves[z][0] , tracks[tracks.length-1][1]+back_moves[z][1]+map_w ];
                                         steps--;
                                    }
                                } else {
                                    if(map[tracks[tracks.length-1][0]+back_moves[z][0]][tracks[tracks.length-1][1]+back_moves[z][1]] == steps-1){
                                        tracks[tracks.length] = [tracks[tracks.length-1][0]+back_moves[z][0] , tracks[tracks.length-1][1]+back_moves[z][1]];
                                        steps--;
                                    }
                                }
                            }
                        }
                }
    }
    tracks.unshift([end_h, end_w]);
    for (var tr = 0; tr < tracks.length; tr++) {
        tracks[tr][0] = tracks[tr][0]+1;                //  Добавляємо по 1, щоб збігалась нумерація на дошці з нумерацією в масиві
    tracks[tr][1] = (tracks[tr][1]+1) + "   ";          //
    }
    tracks.reverse();                                   // Перевертаємо масив, так як до цього маршрут зберігався у зворотньому порядку
    return tracks;
}

var steps = makeJump();
   alert('Мінімальна кількість кроків становить ' + steps);
   alert('Найкоротший маршрут пролягає через точки: ' + backJump(makeJump()).join('- '))  ;

