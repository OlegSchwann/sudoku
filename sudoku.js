"use strict";

// подсвечивает строки и столбцы, на которые наведён курсор.
for (let x = 0; x < 9; ++x) {
    for (let y = 0; y < 9; ++y) {
        let cell = document.getElementById("c_" + x + "_" + y);
        let neighbors_ids = [];
        for (let i = 0; i < x; ++i) {
            neighbors_ids.push("c_" + i + "_" + y);
        }
        for (let i = x + 1; i < 9; ++i) {
            neighbors_ids.push("c_" + i + "_" + y);
        }
        for (let i = 0; i < y; ++i) {
            neighbors_ids.push("c_" + x + "_" + i);
        }
        for (let i = y + 1; i < 9; ++i) {
            neighbors_ids.push("c_" + x + "_" + i);
        }
        cell.onmouseover = function (event) {
            for (let i in neighbors_ids) {
                document.getElementById(neighbors_ids[i]).style.backgroundColor = "#f0f0f0";
            }
        };
        cell.onmouseout = function (event) {
            for (let i in neighbors_ids) {
                document.getElementById(neighbors_ids[i]).style.backgroundColor = "inherit";
            }
        };
    }
}

// класс, содержащий актуальное поле, как в html отображено
class Sudoku {
    constructor() {
        this.actual_field = [
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""]
        ];

    }

    /*служебная функция, которая обнавляет поле, когда пользователь изменяет число в input*/
    update(x, y, value) {
        this.actual_field[y][x] = value;
        /*тут вызываем валидацию*/
    }

    /*обновляет в html представлении*/
    set_cell(x, y, value) {
        document.getElementById("c_" + x + "_" + y).value = value.toString();
        this.actual_field[x][y] = value.toString();
    }

    remove_readonly(x, y){
        document.getElementById("c_" + x + "_" + y).removeAttribute("readonly");
    }

    set_all_readonly(){
        for(let x = 0; x < 9; ++x){
            for(let y = 0; y < 9; ++y){
                document.getElementById("c_" + x + "_" + y).setAttribute("readonly", "");
            }
        }
    }

    /*одновляет всё поле от переданного*/
    update_field(field) {
        for(let i = 0; i < 9; ++i){
            for(let j = 0; j < 9; ++j){
                this.set_cell(i, j, field[i][j])
            }
        }
    }

    /*сделать валидацию - подсвечивает красной рамкой при обинаковых значениях*/

}

let sudoku = new Sudoku();

class Field {
    constructor() {
        // точно валидное поле, перобразованиями которого можно получить все остальные.
        this.valid_field = [
            ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
            ["4", "5", "6", "7", "8", "9", "1", "2", "3"],
            ["7", "8", "9", "1", "2", "3", "4", "5", "6"],
            ["2", "3", "4", "5", "6", "7", "8", "9", "1"],
            ["5", "6", "7", "8", "9", "1", "2", "3", "4"],
            ["8", "9", "1", "2", "3", "4", "5", "6", "7"],
            ["3", "4", "5", "6", "7", "8", "9", "1", "2"],
            ["6", "7", "8", "9", "1", "2", "3", "4", "5"],
            ["9", "1", "2", "3", "4", "5", "6", "7", "8"]
        ];

        this.change_field_functions = [
            ()=>{this.swap_row(0, 1);},
            ()=>{this.swap_row(0, 2);},
            ()=>{this.swap_row(1, 2);},
            ()=>{this.swap_row(3, 4);},
            ()=>{this.swap_row(3, 5);},
            ()=>{this.swap_row(4, 5);},
            ()=>{this.swap_row(6, 7);},
            ()=>{this.swap_row(6, 8);},
            ()=>{this.swap_row(7, 8);},
            ()=>{this.swap_column(0, 1);},
            ()=>{this.swap_column(0, 2);},
            ()=>{this.swap_column(1, 2);},
            ()=>{this.swap_column(3, 4);},
            ()=>{this.swap_column(3, 5);},
            ()=>{this.swap_column(4, 5);},
            ()=>{this.swap_column(6, 7);},
            ()=>{this.swap_column(6, 8);},
            ()=>{this.swap_column(7, 8);},
            ()=>{this.swap_region_row(0, 1);},
            ()=>{this.swap_region_row(0, 2);},
            ()=>{this.swap_region_row(1, 2);},
            ()=>{this.swap_region_column(0, 1);},
            ()=>{this.swap_region_column(0, 2);},
            ()=>{this.swap_region_column(1, 2);},
        ];
    }

    // преобразования поля
    // поле остаётся валидным при замене двух массивов внутри одного региона
    // при замене двух регионов

    //меняет 2 строки с номерами first, second
    swap_row(first, second) {
        [this.valid_field[first], this.valid_field[second]] =
            [this.valid_field[second], this.valid_field[first]];
    }

    swap_column(first, second) {
        for(let i = 0; i < this.valid_field.length; ++i){
            [this.valid_field[i][first], this.valid_field[i][second]] =
                [this.valid_field[i][second], this.valid_field[i][first]];
        }
    }

    swap_region_row(first, second) {
        [this.valid_field[first*3  ], this.valid_field[second*3  ]] =
            [this.valid_field[second*3  ], this.valid_field[first*3  ]];
        [this.valid_field[first*3+1], this.valid_field[second*3+1]] =
            [this.valid_field[second*3+1], this.valid_field[first*3+1]];
        [this.valid_field[first*3+2], this.valid_field[second*3+2]] =
            [this.valid_field[second*3+2], this.valid_field[first*3+2]];
    }

    swap_region_column(first, second) {
        for(let i = 0; i < this.valid_field.length; ++i){
            [this.valid_field[i][first*3  ], this.valid_field[i][second*3  ]] =
                [this.valid_field[i][second*3  ], this.valid_field[i][first*3  ]];
            [this.valid_field[i][first*3+1], this.valid_field[i][second*3+1]] =
                [this.valid_field[i][second*3+1], this.valid_field[i][first*3+1]];
            [this.valid_field[i][first*3+2], this.valid_field[i][second*3+2]] =
                [this.valid_field[i][second*3+2], this.valid_field[i][first*3+2]];
        }
    }

    shake(){
        for(let i = 0; i < 100; ++i){
            let index = Math.round(Math.random()*this.change_field_functions.length - 0.49);
            this.change_field_functions[index].call();
        }
    }

}

let field = new Field();

// class Validetor{
//     constructor(){
//         this.region_to_cell = [
//             [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]],
//             [[0, 3], [0, 4], [0, 5], [1, 3], [1, 4], [1, 5], [2, 3], [2, 4], [2, 5]],
//             [[0, 6], [0, 7], [0, 8], [1, 6], [1, 7], [1, 8], [2, 6], [2, 7], [2, 8]],
//             [[3, 0], [3, 1], [3, 2], [4, 0], [4, 1], [4, 2], [5, 0], [5, 1], [5, 2]],
//             [[3, 3], [3, 4], [3, 5], [4, 3], [4, 4], [4, 5], [5, 3], [5, 4], [5, 5]],
//             [[3, 6], [3, 7], [3, 8], [4, 6], [4, 7], [4, 8], [5, 6], [5, 7], [5, 8]],
//             [[6, 0], [6, 1], [6, 2], [7, 0], [7, 1], [7, 2], [8, 0], [8, 1], [8, 2]],
//             [[6, 3], [6, 4], [6, 5], [7, 3], [7, 4], [7, 5], [8, 3], [8, 4], [8, 5]],
//             [[6, 6], [6, 7], [6, 8], [7, 6], [7, 7], [7, 8], [8, 6], [8, 7], [8, 8]]
//         ];
//         this.cell_to_region = {
//             "[0, 0]": 0, "[0, 1]": 0, "[0, 2]": 0, "[1, 0]": 0, "[1, 1]": 0, "[1, 2]": 0, "[2, 0]": 0, "[2, 1]": 0, "[2, 2]": 0,
//             "[0, 3]": 1, "[0, 4]": 1, "[0, 5]": 1, "[1, 3]": 1, "[1, 4]": 1, "[1, 5]": 1, "[2, 3]": 1, "[2, 4]": 1, "[2, 5]": 1,
//             "[0, 6]": 2, "[0, 7]": 2, "[0, 8]": 2, "[1, 6]": 2, "[1, 7]": 2, "[1, 8]": 2, "[2, 6]": 2, "[2, 7]": 2, "[2, 8]": 2,
//             "[3, 0]": 3, "[3, 1]": 3, "[3, 2]": 3, "[4, 0]": 3, "[4, 1]": 3, "[4, 2]": 3, "[5, 0]": 3, "[5, 1]": 3, "[5, 2]": 3,
//             "[3, 3]": 4, "[3, 4]": 4, "[3, 5]": 4, "[4, 3]": 4, "[4, 4]": 4, "[4, 5]": 4, "[5, 3]": 4, "[5, 4]": 4, "[5, 5]": 4,
//             "[3, 6]": 5, "[3, 7]": 5, "[3, 8]": 5, "[4, 6]": 5, "[4, 7]": 5, "[4, 8]": 5, "[5, 6]": 5, "[5, 7]": 5, "[5, 8]": 5,
//             "[6, 0]": 6, "[6, 1]": 6, "[6, 2]": 6, "[7, 0]": 6, "[7, 1]": 6, "[7, 2]": 6, "[8, 0]": 6, "[8, 1]": 6, "[8, 2]": 6,
//             "[6, 3]": 7, "[6, 4]": 7, "[6, 5]": 7, "[7, 3]": 7, "[7, 4]": 7, "[7, 5]": 7, "[8, 3]": 7, "[8, 4]": 7, "[8, 5]": 7,
//             "[6, 6]": 8, "[6, 7]": 8, "[6, 8]": 8, "[7, 6]": 8, "[7, 7]": 8, "[7, 8]": 8, "[8, 6]": 8, "[8, 7]": 8, "[8, 8]": 8
//         }
//     }
//
// }

// обслуживание кнопки перестройки поля. #rebuild
document.getElementById("rebuild").onclick = ()=>{
    field.shake();
    sudoku.set_all_readonly();
    sudoku.update_field(field.valid_field);
    let number_of_remaining = parseInt(document.getElementById("erase-counter").value);
    for(let i = 0; i < 9*9 - number_of_remaining; ++i){
        let x = Math.round(Math.random()*9 - 0.49);
        let y = Math.round(Math.random()*9 - 0.49);
        sudoku.set_cell(x, y, "");
        sudoku.remove_readonly(x, y)
    }
};
