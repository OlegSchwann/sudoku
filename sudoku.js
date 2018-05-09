"use strict";

// подсвечивает строки и столбцы, на которые наведён курсор.
for (let x = 0; x < 9; ++x) {
    for (let y = 0; y < 9; ++y) {
        let cell = document.getElementById("c_" + x + "_" + y);
        cell.onmouseover = function (event) {
            for (let i = 0; i < 9; ++i) {
                document.getElementById("c_" + x + "_" + i).style.backgroundColor = "#f0f0f0";
                document.getElementById("c_" + i + "_" + y).style.backgroundColor = "#f0f0f0";
            }
        };
        cell.onmouseout = function (event) {
            for (let i = 0; i < 9; ++i) {
                document.getElementById("c_" + x + "_" + i).style.backgroundColor = "inherit";
                document.getElementById("c_" + i + "_" + y).style.backgroundColor = "inherit";
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

    remove_readonly(x, y) {
        document.getElementById("c_" + x + "_" + y).removeAttribute("readonly");
    }

    set_all_readonly() {
        for (let x = 0; x < 9; ++x) {
            for (let y = 0; y < 9; ++y) {
                document.getElementById("c_" + x + "_" + y).setAttribute("readonly", "");
            }
        }
    }

    /*одновляет всё поле от переданного*/
    update_field(field) {
        for (let i = 0; i < 9; ++i) {
            for (let j = 0; j < 9; ++j) {
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
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [4, 5, 6, 7, 8, 9, 1, 2, 3],
            [7, 8, 9, 1, 2, 3, 4, 5, 6],
            [2, 3, 4, 5, 6, 7, 8, 9, 1],
            [5, 6, 7, 8, 9, 1, 2, 3, 4],
            [8, 9, 1, 2, 3, 4, 5, 6, 7],
            [3, 4, 5, 6, 7, 8, 9, 1, 2],
            [6, 7, 8, 9, 1, 2, 3, 4, 5],
            [9, 1, 2, 3, 4, 5, 6, 7, 8]
        ];

        this.change_field_functions = [
            () => {
                this.swap_row(0, 1);
            },
            () => {
                this.swap_row(0, 2);
            },
            () => {
                this.swap_row(1, 2);
            },
            () => {
                this.swap_row(3, 4);
            },
            () => {
                this.swap_row(3, 5);
            },
            () => {
                this.swap_row(4, 5);
            },
            () => {
                this.swap_row(6, 7);
            },
            () => {
                this.swap_row(6, 8);
            },
            () => {
                this.swap_row(7, 8);
            },
            () => {
                this.swap_column(0, 1);
            },
            () => {
                this.swap_column(0, 2);
            },
            () => {
                this.swap_column(1, 2);
            },
            () => {
                this.swap_column(3, 4);
            },
            () => {
                this.swap_column(3, 5);
            },
            () => {
                this.swap_column(4, 5);
            },
            () => {
                this.swap_column(6, 7);
            },
            () => {
                this.swap_column(6, 8);
            },
            () => {
                this.swap_column(7, 8);
            },
            () => {
                this.swap_region_row(0, 1);
            },
            () => {
                this.swap_region_row(0, 2);
            },
            () => {
                this.swap_region_row(1, 2);
            },
            () => {
                this.swap_region_column(0, 1);
            },
            () => {
                this.swap_region_column(0, 2);
            },
            () => {
                this.swap_region_column(1, 2);
            },
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
        for (let i = 0; i < this.valid_field.length; ++i) {
            [this.valid_field[i][first], this.valid_field[i][second]] =
                [this.valid_field[i][second], this.valid_field[i][first]];
        }
    }

    swap_region_row(first, second) {
        [this.valid_field[first * 3], this.valid_field[second * 3]] =
            [this.valid_field[second * 3], this.valid_field[first * 3]];
        [this.valid_field[first * 3 + 1], this.valid_field[second * 3 + 1]] =
            [this.valid_field[second * 3 + 1], this.valid_field[first * 3 + 1]];
        [this.valid_field[first * 3 + 2], this.valid_field[second * 3 + 2]] =
            [this.valid_field[second * 3 + 2], this.valid_field[first * 3 + 2]];
    }

    swap_region_column(first, second) {
        for (let i = 0; i < this.valid_field.length; ++i) {
            [this.valid_field[i][first * 3], this.valid_field[i][second * 3]] =
                [this.valid_field[i][second * 3], this.valid_field[i][first * 3]];
            [this.valid_field[i][first * 3 + 1], this.valid_field[i][second * 3 + 1]] =
                [this.valid_field[i][second * 3 + 1], this.valid_field[i][first * 3 + 1]];
            [this.valid_field[i][first * 3 + 2], this.valid_field[i][second * 3 + 2]] =
                [this.valid_field[i][second * 3 + 2], this.valid_field[i][first * 3 + 2]];
        }
    }

    shake() {
        for (let i = 0; i < 100; ++i) {
            let index = Math.floor(Math.random() * this.change_field_functions.length);
            // console.debug(index);
            this.change_field_functions[index].call();
        }
    }

}

let field = new Field();


// обслуживание кнопки перестройки поля. #rebuild
document.getElementById("rebuild").onclick = () => {
    field.shake();
    sudoku.set_all_readonly();
    sudoku.update_field(field.valid_field);
    let number_of_remaining = parseInt(document.getElementById("erase-counter").value);
    for (let i = 0; i < 9 * 9 - number_of_remaining; ++i) {
        let x = Math.floor(Math.random() * 9);
        let y = Math.floor(Math.random() * 9);
        sudoku.set_cell(x, y, "");
        sudoku.remove_readonly(x, y)
    }
};


// обслуживание кнопки решить. #solve
document.getElementById("solve").onclick = () => {
    sudoku.update_field(solver.solve(sudoku.actual_field));
};