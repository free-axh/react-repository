export const switchSkin = (className) => {
  global.document.getElementsByTagName('body').className = className;
};