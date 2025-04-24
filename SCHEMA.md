### Schema Provided
- Return Interfaces
  - status: true
  - msg: string
  - result: [...]
```json
{
   "status": true,
   "msg": "Đã thành công!"
   "result": [...]
}
```
nanoID https://www.npmjs.com/package/nanoid

## Class Diagram
```mermaid
---
config:
  theme: default
  layout: elk
  look: classic
---
classDiagram
    class Users {
        +_id: char(12) - PK
        +name: varchar(255) Unique
        +email: varchar(255) Unique
        +password: varchar(60)
        +avatar_id: char(12) FK
        +token: varchar(255)
        +roles: enum('user', 'admin', 'moderator')
        +gender: enum('male', 'female', 'none')
        +is_verified: bool
        +is_active: bool
    }
    Users --> Imgs : "avatar_id" as avatar

    class Favorite {
        +_id: char(12) - PK
        +user_id: char(12) - FK
        +content_id: char(12) - FK
        +favorited_at: date
    }
    Favorite --> Users : "user_id"
    Favorite --> Contents : "content_id"

    class History {
        _id: char(12) - PK
        user_id: char(12) - FK
        media_id: char(12) - FK
        watched_at: date
        progress: integer
    }
    History --> Users : "user_id"
    History --> Media : "media_id"

    class Imgs {
        +_id: char(12) - PK
        +imgurId: varchar(255) Unique
        +deleteHash: varchar(255)
        +path: varchar(255)
        +type: enum('avatar', 'person', 'thumbnail', 'banner')
        +metadata: json
    }

    class Media {
        +_id: char(12) - PK
        +episode: smallint(255)
        +season: tinyint(255)
        +public_id: varchar(255) Unique
        +title: varchar(255)
        +audio_type: enum('subtitle','original','voiceover')
    }

    class Contents {
        +_id: char(12) - PK
        +title: varchar(255)
        +origin_title: varchar(255)
        +english_title: varchar(255)
        +slug: varchar(255) Unique
        +overview: text(255)
        +imdb_rating: decimal(3,1)
        +lastest_episode: smallint(255)
        +lastest_season: tinyint(255)
        +rating: decimal(2,1)
        +runtime: smallint(10)
        +type: enum('movie','tvshow')
        +release_date: date()
        +year: smallint(10)
        +country_code: char(2)[] - FK
        +genres_id: varchar(100)[] - FK
        +contributors[]: char(12)[] - FK
        +publish: boolean
        +thumbnail_path: varchar(255)
        +banner_path: varchar(255)
        +status: enum('upcoming','finish','updating')
    }
    Contents --> Country : 'country_code[]'
    Contents --> Genres : 'genres_id[]'
    Contents --> Person : 'contributors[]'

    class Genres {
        +_id: char(12) - PK
        +name: varchar(100)
        +english_name: varchar(100) Unique
        +slug: varchar(100) Unique
    }

    class Country {
        +_id: char(12) - PK
        +name: varchar(100)
        +slug: varchar(100) Unique
        +code: char(2) Unique
    }

    class Person {
        +_id: char(12) - PK
        +name: varchar(255)
        +slug: varchar(255) Unique
        +profile_path: varchar(255)
        +department_id: char(12) FK
    }
    Person --> Department: 'department_id'

    class Department {
        +_id: char(12) - PK
        +name: varchar(100)
        +slug: varchar(100) Unique
    }

    class Collections {
        +_id: char(12) - PK
        +name: varchar(255)
        +description: text(255)
        +type: enum('topic','hot','features')
        +content_id: char(12)[] - FK
        +publish: boolean
        +create_at: date
    }
    Collections --> Contents: 'content_id[]'

    class Reviews {
        +_id: char(12) - PK
        +user_id: char(12) - FK
        +content_id: char(12) - FK
        +commend: text(255)
        +rating: decimal(2,1)
        +review_at: date
    }
    Reviews --> Users: 'user_id'
    Reviews --> Contents: 'content_id'
```

## Entities Relationship Diagram
```mermaid
---
config:
  theme: default
  layout: elk
  look: classic
---
erDiagram
     USERS ||--|| IMGS : "has avatar"
    USERS ||--o{ FAVORITE : "makes"
    CONTENTS ||--o{ FAVORITE : "featured in"
    USERS ||--o{ HISTORY : "creates"
    MEDIA ||--o{ HISTORY : "tracked in"
    CONTENTS ||--o{ MEDIA : "has"
    PERSON ||--o{ CONTENTS : "contributes to"
    PERSON }|--|| DEPARTMENT : "belongs to"
    CONTENTS ||--o{ COUNTRY : "available in"
    CONTENTS ||--o{ GENRES : "categorized under"
    COLLECTIONS ||--o{ CONTENTS : "contains"
    USERS ||--o{ REVIEWS : "writes"
    CONTENTS ||--o{ REVIEWS : "receives"
```