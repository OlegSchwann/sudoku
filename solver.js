// этот класс является обёрткой над С.
// Он на столько странный, потому что передача массивов ужасно нетривиальная операция в Webasm.
// Надо было разобраться с указателями в js.

class Solver {
    constructor() {
        this.setCell = Module.cwrap('setCell', 'null', ['number', 'number', 'number']);
        this.solveSudoku = Module.cwrap('solveSudoku', 'null', ['null']);
        this.getCell = Module.cwrap('getCell', 'number', ['number', 'number']);
    }

    solve(field) {
        for (let x = 0; x < 9; ++x) {
            for (let y = 0; y < 9; ++y) {
                let cell = parseInt(field[x][y]);
                if (!isNaN(cell)) {
                    this.setCell(x, y, cell);
                } else {
                    this.setCell(x, y, 0);
                }
            }
        }
        this.solveSudoku();
        for (let x = 0; x < 9; ++x) {
            for (let y = 0; y < 9; ++y) {
                field[x][y] = this.getCell(x, y);
            }
        }
        return field;
    }


}

let solver = new Solver();
