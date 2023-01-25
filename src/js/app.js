import model from './modules/model';
import view from './modules/views/view';
import Controller from './modules/controller';

const app = new Controller(model, view);

app.init();
