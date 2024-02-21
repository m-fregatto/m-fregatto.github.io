## Simple Calculator

This project includes a simple calculator that can add, subtract and multiply values in a set of registers. <br />

The syntax is: <br />
'register' 'operation' 'value' <br />
print register <br />
quit <br />

This calculator also supports using registers as values, with lazy evaluation (evaluated at print). Registers can be named anything consisting of alphanumeric characters. All input is case insensitive.<br />

Unsuported values include: scientific notation, Infinity and "NaN".<br />

When the calculator reaches a line with the command <b>quit</b>, it will log any remaining lines and disregard them from the calculations.<br />

The calculator also accepts .txt files as input. The maximum file size is 2 MB. When accepting input from file, it is not be necessary to include <b>quit</b>. The calculator will process all lines until EOF is reached. <br />

If possible, invalid commands will be logged and ignored. <br />

There are automated tests at: src\Tests
those tests are meant to verify some basic functionality os the program, such as input parsing, register evaluation and calculations.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
The app is ready to be deployed!
