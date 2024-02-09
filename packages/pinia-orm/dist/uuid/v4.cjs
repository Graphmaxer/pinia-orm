'use strict';

const uuid = require('uuid');
const CastAttribute = require('../shared/pinia-orm.a7e3e0f3.cjs');

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class UidCast extends CastAttribute.CastAttribute {
  /**
   * Create a new String attribute instance.
   */
  constructor(attributes) {
    super(attributes);
  }
  static withParameters(parameters) {
    this.parameters = parameters;
    return this;
  }
  /**
   * Make the value for the attribute.
   */
  set(value) {
    return value ?? uuid.v4(this.$parameters);
  }
}
__publicField(UidCast, "parameters");

function Uid(options) {
  return (target, propertyKey) => {
    const self = target.$self();
    self.setCast(propertyKey, UidCast.withParameters(options));
    self.setRegistry(propertyKey, () => self.uid());
  };
}

exports.Uid = Uid;
exports.UidCast = UidCast;
