import { C as CastAttribute } from './shared/pinia-orm.4ff2e12f.mjs';

class ArrayCast extends CastAttribute {
  /**
   * Create a new String attribute instance.
   */
  constructor(attributes) {
    super(attributes);
  }
  get(value) {
    return typeof value !== "string" ? value : JSON.parse(value);
  }
  /**
   * Make the value for the attribute.
   */
  set(value) {
    return JSON.stringify(value);
  }
}

class StringCast extends CastAttribute {
  /**
   * Create a new String attribute instance.
   */
  constructor(attributes) {
    super(attributes);
  }
  get(value) {
    return typeof value === "string" || value === void 0 || value === null ? value : `${value}`;
  }
  /**
   * Make the value for the attribute.
   */
  set(value) {
    return this.get(value);
  }
}

class BooleanCast extends CastAttribute {
  /**
   * Create a new String attribute instance.
   */
  constructor(attributes) {
    super(attributes);
  }
  get(value) {
    if (typeof value === "boolean" || value === void 0 || value === null) {
      return value;
    }
    if (typeof value === "string") {
      if (value.length === 0) {
        return false;
      }
      const int = Number.parseInt(value, 0);
      return Number.isNaN(int) ? true : !!int;
    }
    if (typeof value === "number") {
      return !!value;
    }
    return false;
  }
  /**
   * Make the value for the attribute.
   */
  set(value) {
    return this.get(value);
  }
}

class NumberCast extends CastAttribute {
  /**
   * Create a new String attribute instance.
   */
  constructor(attributes) {
    super(attributes);
  }
  get(value) {
    if (typeof value === "number" || value === void 0 || value === null) {
      return value;
    }
    if (typeof value === "string") {
      return Number.parseFloat(value);
    }
    if (typeof value === "boolean") {
      return value ? 1 : 0;
    }
    return 0;
  }
  /**
   * Make the value for the attribute.
   */
  set(value) {
    return this.get(value);
  }
}

class DateCast extends CastAttribute {
  /**
   * Create a new String attribute instance.
   */
  constructor(attributes) {
    super(attributes);
  }
  get(value) {
    return value === null ? null : new Date(value);
  }
  /**
   * Make the value for the attribute.
   */
  set(value) {
    if (value === null) {
      return null;
    }
    return (typeof value === "string" ? new Date(Date.parse(value)) : value).toISOString();
  }
}

export { ArrayCast, BooleanCast, DateCast, NumberCast, StringCast };
