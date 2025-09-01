import "@typespec/http";
using TypeSpec.Http;

namespace PetStore;

@tag("Dogs")
@route("/dogs")
interface Dogs {
  @get
  @summary("Get dog by id")
  @doc("Get a dog by id")
  get(@path id: string): Dog;
}

@example(archie)
model Dog {
  id: string;
  name: string;
  breed: Breed;
}

@example(#[archie, amos])
model DogList is Dog[];

enum Breed {
  dachshund,
  dalmatian,
  poodle,
}

const archie: Dog = #{ id: "1", name: "Archie", breed: Breed.dachshund };
const amos: Dog = #{ id: "2", name: "Amos", breed: Breed.dachshund };
