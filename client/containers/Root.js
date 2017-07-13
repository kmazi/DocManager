import RootDev from './RootDev';
import RootProd from './RootProd';

if (process.env.NODE_ENV === 'production') {
  module.exports = RootProd;
} else {
  module.exports = RootDev;
}
