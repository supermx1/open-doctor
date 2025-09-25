/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7tx0rr97xtnvjqb")

  collection.name = "chats"
  collection.indexes = [
    "CREATE INDEX `idx_1wAgMrT` ON `chats` (\n  `appointment_id`,\n  `sender`\n)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7tx0rr97xtnvjqb")

  collection.name = "chat"
  collection.indexes = [
    "CREATE INDEX `idx_1wAgMrT` ON `chat` (\n  `appointment_id`,\n  `sender`\n)"
  ]

  return dao.saveCollection(collection)
})
