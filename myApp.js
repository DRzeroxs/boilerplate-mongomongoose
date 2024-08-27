let mongoose = require('mongoose');

require('dotenv').config();
require("mongoose");

const Schema = mongoose.Schema;

// Definición del esquema de la colección 'Person'
const personaSchema = new Schema({
  name: {type: String, require: true}, // Campo 'name', tipo String, requerido
  age : Number, // Campo 'age', tipo Number
  favoriteFoods : [String] // Campo 'favoriteFoods', es un array de Strings
});

// Conexión a la base de datos MongoDB utilizando variables de entorno y configuraciones de conexión adecuadas
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Modelo 'Person' basado en el esquema definido anteriormente
let Person = mongoose.model("Person", personaSchema);

// Endpoint para crear y guardar una nueva persona en la base de datos
// Este método instancia un nuevo documento de 'Person' con los datos proporcionados, 
// luego utiliza 'save()' para persistir el documento en la base de datos.
const createAndSavePerson = (done) => {
  let persona = new Person({
    name: "Miguel Grullon Reinoso",
    age: 20,
    favoriteFoods: ["pizza", "ice cream", "apple"]
  });

  // Guardar el documento en la base de datos
  persona.save(function(err, data){
    if (err) return console.error(err); // Manejo de errores en caso de fallo
    done(null, data); // Callback para indicar que la operación ha finalizado
  });
  
};

// Endpoint para crear varias personas a la vez en la base de datos
// Utiliza el método 'create()' de Mongoose, que permite crear varios documentos
// basados en un array de personas, y luego guarda todos en la colección.
const createManyPeople = (arrayOfPeople, done) => {

  // Crear múltiples personas y guardarlas
  Person.create(arrayOfPeople, function (err, people){
    if(err) return console.log(err); // Manejo de errores
    done(null , people); // Callback con los datos creados
  });
  
};

// Endpoint para buscar personas por nombre en la base de datos
// Usa 'find()', que busca en la colección todos los documentos que coincidan
// con el criterio proporcionado en el parámetro 'name'.
const findPeopleByName = (personName, done) => {

  // Buscar personas que coincidan con el nombre
  Person.find({name: personName}, function(err, personFound){
    if(err) return console.log(err); // Manejo de errores
    done(null, personFound); // Callback con los datos encontrados
  });
};

// Endpoint para buscar una persona por un alimento favorito
// Utiliza 'findOne()', que devuelve un único documento que coincide con el criterio.
// En este caso, busca en el array de 'favoriteFoods'.
const findOneByFood = (food, done) => {
  // Buscar una persona que tenga el alimento proporcionado en su lista de favoritos
  Person.findOne({favoriteFoods: food}, function(err, personFound){
    if (err) return console.log(err); // Manejo de errores
    done(null, personFound); // Callback con los datos encontrados
  });
};

// Endpoint para buscar una persona por su ID
// 'findById()' se utiliza para buscar un documento basado en el ID proporcionado.
const findPersonById = (personId, done) => {
  // Buscar persona por ID
  Person.findById({_id: personId}, function(err, personFound){
    if (err) return console.log(err); // Manejo de errores
    done(null, personFound); // Callback con los datos encontrados
  });
};

// Endpoint para encontrar una persona por ID, modificar su lista de alimentos favoritos,
// y guardar los cambios. Usa 'findById()' para encontrar al usuario y 'save()' para actualizarlo.
const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger"; // Alimento que se agregará

  // Buscar la persona por ID
  Person.findById(personId, (err, person) => {
    if (err) return console.log(err); // Manejo de errores

    // Agregar el alimento a la lista de favoritos
    person.favoriteFoods.push(foodToAdd);

    // Guardar el documento actualizado
    person.save((err, updatedPerson) => {
      if (err) return console.log(err); // Manejo de errores
      done(null, updatedPerson); // Callback con los datos actualizados
    });
  });
};

// Endpoint para buscar una persona por nombre y actualizar su edad
// Usa 'findOneAndUpdate()', que permite encontrar y actualizar un documento
// en una sola operación. Se pasa 'new: true' para que retorne el documento actualizado.
const findAndUpdate = (personName, done) => {
  const ageToSet = 20; // Nueva edad a establecer
  Person.findOneAndUpdate(
    {name: personName}, // Criterio de búsqueda
    {age: ageToSet}, // Actualización a realizar
    {new: true}, // Retornar el documento actualizado
    (err, updatedPerson) => {
      if(err) return console.log(err); // Manejo de errores
      done(null, updatedPerson); // Callback con el documento actualizado
    }
  );
};

// Endpoint para eliminar una persona por ID
// Utiliza 'findByIdAndRemove()', que elimina un documento de la colección basado en su ID.
const removeById = (personId, done) => {
  // Eliminar persona por ID
  Person.findByIdAndRemove({_id: personId}, (err, removedPerson) => {
    if (err) return console.log(err); // Manejo de errores
    done(null, removedPerson); // Callback con los datos eliminados
  });
};

// Endpoint para eliminar múltiples personas con el mismo nombre
// Usa 'deleteMany()', que elimina todos los documentos que coincidan con el criterio.
const removeManyPeople = (done) => {
  const nameToRemove = "Mary"; // Nombre de las personas a eliminar

  // Eliminar todas las personas que tengan el nombre proporcionado
  Person.deleteMany({name: nameToRemove}, (err, response) => {
    if (err) return console.log(err); // Manejo de errores
    done(null, response); // Callback con el resultado de la operación
  });
};

// Endpoint para buscar personas por un alimento favorito, ordenar el resultado,
// limitar la cantidad de resultados y seleccionar qué campos retornar.
// Usa 'find()', 'sort()', 'limit()', y 'select()', junto con 'exec()' para ejecutar la consulta.
const queryChain = (done) => {
  const foodToSearch = "burrito"; // Alimento a buscar

  // Buscar personas que tienen 'burrito' en su lista de alimentos favoritos
  Person.find({favoriteFoods: foodToSearch})
  .sort({ name: 1 }) // Ordenar por nombre de forma ascendente
  .limit(2) // Limitar a 2 resultados
  .select({ age: 0 }) // Excluir el campo 'age' de los resultados
  .exec(function(error, people) {
    if(error) return console.log(error); // Manejo de errores
    done(null , people); // Callback con los datos resultantes
  });
  
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
