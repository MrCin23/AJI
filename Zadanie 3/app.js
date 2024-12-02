var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var categoryRouter = require("./routes/category");
var orderRouter = require("./routes/order");
var statusRouter = require("./routes/status");

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/categories', categoryRouter);
app.use('/orders', orderRouter);
app.use('/status', statusRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// const sequelize = require('./src/orm/'); // Importujemy konfigurację Sequelize
// const { Category, Product, OrderStatus, Order } = require('./src/model/'); // Importujemy modele
//
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
//
// var app = express();
//
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');
//
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//
// // Routes
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
//
// // Test połączenia z bazą danych
// app.get('/test-db', async (req, res) => {
//   try {
//     await sequelize.authenticate();  // Sprawdzamy połączenie z bazą danych
//     res.send('Połączenie z bazą danych działa!');
//   } catch (error) {
//     res.status(500).send('Błąd połączenia z bazą danych: ' + error.message);
//   }
// });
//
// // Przykładowy endpoint do tworzenia kategorii
// app.post('/category', async (req, res) => {
//   try {
//     const { name } = req.body;
//     const category = await Category.create({ name });
//     res.status(201).json(category);
//   } catch (error) {
//     res.status(400).json({ message: 'Błąd tworzenia kategorii', error: error.message });
//   }
// });
//
// // Przykładowy endpoint do pobierania wszystkich produktów
// app.get('/products', async (req, res) => {
//   try {
//     const products = await Product.findAll();
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({ message: 'Błąd pobierania produktów', error: error.message });
//   }
// });
//
// // Przykładowy endpoint do tworzenia zamówienia
// app.post('/order', async (req, res) => {
//   try {
//     const { username, email, phoneNumber, orderedItems, status } = req.body;
//
//     const orderStatus = await OrderStatus.findOne({ where: { status } });
//     if (!orderStatus) {
//       return res.status(400).json({ message: 'Nieprawidłowy status zamówienia' });
//     }
//
//     const order = await Order.create({
//       username,
//       email,
//       phoneNumber,
//       status: orderStatus.id,
//       orderedItems: JSON.stringify(orderedItems), // Zakładam, że orderedItems to tablica
//     });
//
//     res.status(201).json(order);
//   } catch (error) {
//     res.status(400).json({ message: 'Błąd tworzenia zamówienia', error: error.message });
//   }
// });
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
//
// module.exports = app;
