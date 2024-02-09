import { customAlphabet, nanoid } from 'nanoid';
import { C as CastAttribute } from '../shared/pinia-orm.4ff2e12f.mjs';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class UidCast extends CastAttribute {
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
    const nanoid$1 = this.$parameters?.alphabet ? customAlphabet(this.$parameters.alphabet) : nanoid;
    return value ?? nanoid$1(this.$parameters?.size);
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

export { Uid, UidCast };
