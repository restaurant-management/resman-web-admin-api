module.exports = [
  {
    "name": "production",
    "type": "postgres",
    "url": process.env.DATABASE_URL,
    "synchronize": false,
    "migrationsRun": false,
    "ssl": true,
    "logging": false,
    "entities": [
      "src/entity/**/*.ts"
    ],
    "migrations": [
      "src/migration/**/*.ts"
    ],
    "subscribers": [
      "src/subscriber/**/*.ts"
    ],
    "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
    }
  },
  {
    "name": "development",
    "type": "postgres",
    "url": process.env.DEV_DATABASE_URL,
    "synchronize": false,
    "migrationsRun": true,
    "ssl": true,
    "logging": false,
    "entities": [
      "src/entity/**/*.ts"
    ],
    "migrations": [
      "src/migration/**/*.ts"
    ],
    "subscribers": [
      "src/subscriber/**/*.ts"
    ],
    "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
    }
  },
  {
    "name": "test",
    "type": "postgres",
    "url": process.env.TEST_DATABASE_URL,
    "synchronize": false,
    "migrationsRun": false,
    "entities": [
      "src/entity/**/*.ts"
    ],
    "migrations": [
      "src/migration/**/*.ts"
    ],
    "subscribers": [
      "src/subscriber/**/*.ts"
    ],
    "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
    }
  }
];