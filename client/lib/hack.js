String.prototype.strip = function strip() {
  return this.replace(/^\s+/, '').replace(/\s+$/, '');
};