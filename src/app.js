const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middlewares/error.handler');

const app = express();