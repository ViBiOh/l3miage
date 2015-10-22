'use strict';

class Average {
  static check(classNotes) {
    if (!Array.isArray(classNotes)) {
      throw new Error('Average requires an array of number');
    }
  }

  static compute(classNotes) {
    Average.check(classNotes);
    return classNotes.reduce((sum, value) => {
      return sum + value;
    }, 0) / classNotes.length;
  }
}

class Eleve {
  constructor(name, surname, email, company, classNotes) {
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.company = company;
    this.classNotes = classNotes;
  }

  toString() {
    return this.name +
             (this.surname ? ' ' + this.surname : '') +
             (this.company ? ' works at ' + this.company : '') +
             (this.email ? ' and can be emailed at ' + this.email : '') +
             (this.classNotes ? ' and have an average of ' + Average.compute(this.classNotes) : '');
  }
}

class EleveBuilder {
  static new() {
    return new EleveBuilder();
  }

  name(value) {
    this._name = value;
    return this;
  }

  surname(value) {
    this._surname = value;
    return this;
  }

  email(value) {
    this._email = value;
    return this;
  }

  company(value) {
    this._company = value;
    return this;
  }

  classNotes(value) {
    this._classNotes = value;
    return this;
  }

  build() {
    return new Eleve(this._name, this._surname, this._email, this._company, this._classNotes);
  }
}

const eleve = EleveBuilder.new()
  .name('Vincent')
  .company('Zenika')
  .email('vincent.boutour@gmail.com')
  .classNotes([10, 15, 18])
  .build();
console.log(eleve.toString());
