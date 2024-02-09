'use strict';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class CastAttribute {
  /**
   * Create a new Attribute instance.
   */
  constructor(attributes) {
    /**
     * Default parameters
     */
    __publicField(this, "$parameters", {});
    this.$self().attributes = attributes;
    this.$parameters = {
      ...this.$parameters,
      ...this.$self().parameters
    };
  }
  /**
   * Get the value for return.
   */
  get(value) {
    return value;
  }
  /**
   * Set the value for the store.
   */
  set(value) {
    return value;
  }
  static withParameters(parameters) {
    this.parameters = parameters;
    return this;
  }
  /**
   * Get the cast parameters
   */
  getParameters() {
    return this.$parameters;
  }
  /**
   * Get the constructor for this cast.
   */
  $self() {
    return this.constructor;
  }
  /**
   * Generate new instance of cast
   */
  static newRawInstance(attributes) {
    return new this(attributes);
  }
}
/**
 * The model instance.
 */
__publicField(CastAttribute, "attributes");
/**
 * Cast parameters
 */
__publicField(CastAttribute, "parameters");

exports.CastAttribute = CastAttribute;
