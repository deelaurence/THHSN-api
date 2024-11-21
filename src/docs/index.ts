import basicInfo from './basicInfo';
import servers from './servers';
import components from './components';
import tags from './tags';
import allDocs from './allDocs/index';

module.exports = {
  ...basicInfo,
  ...servers,
  ...components,
  ...tags,
  ...allDocs,
};
