/**
 * Object oriented programming basics in JavaScript
 */

/**
 * function objects
 */
const Person = function (firstName, birthDate) {
  this.firstName = firstName;
  this.birthDate = birthDate;
};

Person.prototype.getAge = function () {
  const current = new Date().getFullYear();
  return current - this.birthDate;
};

const person1 = new Person("Isma", 1996);

/**
 * Static methods for function objects
 */
Person.greed = function () {
  console.log("hello!");
};

/**
 * ES6 Clases
 */
class PersonCl {
  /**
   * Public & private fields
   */
  public_field = "public content"; // public fields
  #private_field = "private field"; // private fields

  constructor(fullName, birthDate) {
    this.fullName = fullName;
    this.birthDate = birthDate;
  }

  // class methods
  calcAge() {
    const current = new Date().getFullYear();
    return current - this.birthDate;
  }

  // getters & setters
  get age() {
    return new Date().getFullYear() - this.birthDate;
  }

  get fullName() {
    return this._fullName;
  }

  set fullName(name) {
    if (name.includes(" ")) {
      this._fullName = name;
    } else {
      alert("Given name is not a full name!");
    }
  }

  /**
   * Static methods for class objects
   */
  static greed() {
    console.log("Hello!");
  }

  /**
   * Private methods
   */
  #private_method() {
    console.log("i'm a private method!"); // not supported in all browsers!!
  }
}

const person2 = new PersonCL("Ismael Fuentes", 1996);

PersonCl.greed();

/**
 * Object.create()
 */
const PersonPrototype = {
  calcAge() {
    const current = new Date().getFullYear();
    return current - this.birthDate;
  },

  init(firstName, birthYear) {
    this.firstName = firstName;
    this.birthYear = birthYear;
  },
};

// returns a brand new object linked to PersonPrototype
const person3 = Object.create(PersonPrototype);
// "object construction"
person3.init("Ismael", 1996);

/**
 * Inheritance with function objects
 */
const Student = function (firstName, birthYear, course) {
  Person.call(this, firstName, birthYear);
  this.course = course;
};

// Linking prototypes
Student.prototype = Object.create(Person.prototype);
Student.prototype.costructor = Student;

/**
 * Inheritance between Classes
 */
class StudentCL extends PersonCl {
  constructor(firstName, birthDate, course) {
    // make a call to parent constructor first
    super(firstName, birthDate);
    this.course = course;
  }
}

/**
 * Inheritance with Object.create()
 */

const StudentPrototype = Object.create(PersonPrototype);
StudentPrototype.init = function (firstName, birthDate, course) {
  PersonPrototype.init.call(this, firstName, birthDate);
  this.course = course;
};

const person3 = Object.create(StudentPrototype);
person3.init("Isma", 1996);
