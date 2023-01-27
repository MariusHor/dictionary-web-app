/* eslint-disable no-unused-vars */
import model from './modules/model';
import views from './modules/views';
import Presenter from './modules/presenter';

const app = new Presenter(model);
app.init();
