// emcc 'for_web_asm.c' -o 'for_web_asm.html' -s WASM=1 -s EXPORTED_FUNCTIONS='["_setCell", "_getCell", "_solveSudoku"]' -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]';

char field[9][9] = {
        {0, 0, 0, 0, 0, 0, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 0, 0}
};

// let setCell = Module.cwrap('setCell', 'null', ['number', 'number', 'number'])
void setCell(char x, char y, char value) {
    field[x][y] = value;
    return;
}

// let getCell = Module.cwrap('getCell', 'number', ['number', 'number']);
char getCell(char x, char y) {
    return field[x][y];
}

int sudokuHelper(char puzzle[9][9], int row, int column);

// let solveSudoku = Module.cwrap('solveSudoku', 'null', ['null']);
void solveSudoku(){
    sudokuHelper(field, 0, 0);
}

int isValid(int number, char puzzle[9][9], int row, int column);

/* A recursive function that does all the gruntwork in solving the puzzle. */
int sudokuHelper(char puzzle[9][9], int row, int column) {
    /* Have we advanced past the puzzle?
     * If so, hooray, all previous cells have valid contents! We're done! */
    if (9 == row) {
        return 1;
    }

    /* Is this element already set?  If so, we don't want to change it. */
    if (puzzle[row][column]) {
        if (column == 8) {
            if (sudokuHelper(puzzle, row + 1, 0)) return 1;
        } else {
            if (sudokuHelper(puzzle, row, column + 1)) return 1;
        }
        return 0;
    }

    /* Iterate through the possible numbers for this empty cell
     * and recurse for every valid one, to test if it's part
     * of the valid solution. */
    for (int nextNumber = 1; nextNumber < 10; nextNumber++) {
        if (isValid(nextNumber, puzzle, row, column)) {
            puzzle[row][column] = nextNumber;
            if (column == 8) {
                if (sudokuHelper(puzzle, row + 1, 0)) return 1;
            } else {
                if (sudokuHelper(puzzle, row, column + 1)) return 1;
            }
            puzzle[row][column] = 0;
        }
    }
    return 0;
}

/* Checks to see if a particular value is presently valid in a given position. */
int isValid(int number, char puzzle[9][9], int row, int column) {
    int modRow = 3 * (row / 3);
    int modCol = 3 * (column / 3);
    int row1 = (row + 2) % 3;
    int row2 = (row + 4) % 3;
    int col1 = (column + 2) % 3;
    int col2 = (column + 4) % 3;
    /* Check for the value in the given row and column */
    for (int i = 0; i < 9; i++) {
        if (puzzle[i][column] == number) return 0;
        if (puzzle[row][i] == number) return 0;
    }
    /* Check the remaining four spaces in this sector */
    if (puzzle[row1 + modRow][col1 + modCol] == number) return 0;
    if (puzzle[row2 + modRow][col1 + modCol] == number) return 0;
    if (puzzle[row1 + modRow][col2 + modCol] == number) return 0;
    if (puzzle[row2 + modRow][col2 + modCol] == number) return 0;
    return 1;
}