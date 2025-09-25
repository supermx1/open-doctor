/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7tx0rr97xtnvjqb")

  collection.listRule = "@request.data.appointment_id = appointment_id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7tx0rr97xtnvjqb")

  collection.listRule = ""

  return dao.saveCollection(collection)
})
