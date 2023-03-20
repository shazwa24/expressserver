var app = require('express')();
app.use(function (req, res, next) {
    console.log('\n\nALLWAYS');
    next();
});
app.get('/a', function (req, res) {
    console.log('/a: route terminated');    //a1
    res.send('a');
});
app.get('/a', function (req, res) {
    console.log('/a: never called');
});
app.get('/b', function (req, res, next) {
    console.log('/b: route not terminated'); //b1
    next();
});
app.use(function (req, res, next) {
    console.log('SOMETIMES');                //b2 //c1
    next();
});
app.get('/b', function (req, res, next) {
    console.log('/b (part 2): error thrown'); //b3
    throw new Error('b failed');
});
app.use('/b', function (err, req, res, next) {
    console.log('/b error detected and passed on');  //b4
    next(err);
});
app.get('/c', function (err, req) {
    console.log('/c: error thrown');                //c2
    throw new Error('c failed');
});
app.use('/c', function (err, req, res, next) {
    console.log('/c: error deteccted but not passed on');   //c3
    next();
});
app.use(function (err, req, res, next) {
    console.log('unhandled error detected: ' + err.message); //b5
    res.send('500 - server error');
});
app.use(function (req, res) {
    console.log('route not handled');               //c4
    res.send('404 - not found');
});
app.listen(3000, function () {
    console.log('listening on 3000');
});