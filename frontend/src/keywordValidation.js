import { supported_keyword_types } from './supportedKeywordTypes';

const processKeyword = (keyword) => {
  keyword = keyword.toLowerCase();

  const words = keyword.split(' ');

  if (words.length === 1 && !/[A-Z]/.test(keyword)) {
    return keyword;
  }

  return words.join('_');
};

const isValidKeyword = (keyword) => {
  keyword = processKeyword(keyword);

  for (const category in supported_keyword_types) {
    if (supported_keyword_types[category].includes(keyword)) {
      return true;
    }
  }
  return false;
};

export default isValidKeyword;