import moment from 'moment';
import { TimeoutError } from '../customErrors';

export const $el = selector => document.querySelector(selector);

export const $$el = selector => document.querySelectorAll(selector);

export const formatInput = string => string.trim().toLowerCase();

export const capitalize = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

export const generateId = () => Math.floor(Math.random() * Date.now());

export const timeout = seconds =>
  new Promise((_, reject) => {
    setTimeout(() => {
      reject(new TimeoutError('', seconds));
    }, seconds * 1000);
  });

const getDate = () => moment().format('lll');

const formatDate = date => date.replace(/\s/g, '-').replaceAll(',', '');

export const getFormattedDate = () => formatDate(getDate());

export const addListeners = (items, action) => {
  items.forEach(item => {
    item.events.forEach(event => {
      item.element.addEventListener(event, item.action || action);
    });
  });
};
