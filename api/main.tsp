// SKMTC CRM API - Main entry point

import "@typespec/openapi";
import "@typespec/json-schema";
import "@typespec/http";
import "./petstore-dogs.tsp";

using Http;

@service(#{ title: "Pet store - Dogs" })
@server("https://example.com")
namespace PetStore;
