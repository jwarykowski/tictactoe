[![Circle CI](https://circleci.com/gh/jonathanchrisp/tictactoe.svg?style=svg&circle-token=960481d1d2f3dbe7540f32ccd067690942ef745c)](https://circleci.com/gh/jonathanchrisp/tictactoe)
[![bitHound Overall Score](https://www.bithound.io/github/jonathanchrisp/tictactoe/badges/score.svg)](https://www.bithound.io/github/jonathanchrisp/tictactoe)
[![bitHound Dependencies](https://www.bithound.io/github/jonathanchrisp/tictactoe/badges/dependencies.svg)](https://www.bithound.io/github/jonathanchrisp/tictactoe/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/jonathanchrisp/tictactoe/badges/devDependencies.svg)](https://www.bithound.io/github/jonathanchrisp/tictactoe/master/dependencies/npm)
[![bitHound Code](https://www.bithound.io/github/jonathanchrisp/tictactoe/badges/code.svg)](https://www.bithound.io/github/jonathanchrisp/tictactoe)
[![Code Climate](https://codeclimate.com/github/jonathanchrisp/tictactoe/badges/gpa.svg)](https://codeclimate.com/github/jonathanchrisp/tictactoe)

# tic-tac-toe

![tictactoe](https://cloud.githubusercontent.com/assets/406799/13043596/ec8e86fc-d37d-11e5-8068-243c293a4d08.png)

## Synopsis
The Tic-tac-toe application is primarily built with the following frameworks/libraries:

* Client Side 
    * Backbone, Webpack, Karma, PhantomJS, Sinon and ESLint
* Server Side
    * Node (Express.js), Mocha, Sinon and ESLint

The client and server side both use ES6 features, by transpiling with Babel via Webpack and by using the latest version of Node (v4.3.0). The server side comes prebuilt with logging and configuration.

## Getting Started
### Development
To run the application in development mode:
```
npm install 
npm start
```
When running in development, the application will proxies all requests through to the Webpack Dev Server and will auto reload any changes.

### Production
To run the application in production mode:
```
npm install
npm run production
```
The above script will run `webpack -p --config webpack.production.config.js && NODE_ENV=production node index`.

### Testing
To run linter, client and server side tests:
```
npm test
```
The above scripts runs `eslint . && mocha && karma start --single-run`. If you only want to run the linter tests you can run `npm run lint`.

### Continuous Integration & Deployment
Every push and pull request will run tests on [CircleCi](https://circleci.com/gh/jonathanchrisp/tictactoe), subject to the test result the service will then deploy the code to [Heroku](https://tictactoe-jonathanchrisp.herokuapp.com/).

## Feedback
I would be more than happy to recieve feedback, please email me at: jonathan.chrisp@gmail.com or raise an issue.
