# nettubebe

# Sources | Documentations
- [MySQL2](https://sidorares.github.io/node-mysql2/docs)
- [Dizzle](https://orm.drizzle.team/docs/get-started-mysql)
- [JsonWebToken](https://jwt.io/)
- [Bcrypt Generators](https://bcrypt-generator.com/)
- [Routing Process](https://dev.to/sulistef/how-to-set-up-routing-in-an-expressjs-project-using-typescript-51ib)

---

POST => localhost/api/verifyToken  
req.header: accessToken, refreshToken
jwt => verify => res.body {
   "status": true,
   "msg": "Đã thành công!"
}

res.body {
   "status": false,
   "msg": "ErrorLog!"
}

verify: token?, expired?, provided access+refresh
(+) decode: accessToken? => status 200OK true, msg success
  (-) refreshToken? =>status 200OK true, msg success, accessToken
=> Return 401 ~ 404 false, msg token expired

### TASK NOTE (alt + s: done)
- Services
  - Users
    - ~~create~~
      - ~~error handler~~
      - ~~encrypt/decrypt password~~
      - ~~accessToken/ refreshToken handler~~
    - ~~register~~
    - ~~login~~
  - Videos
    - schema
    - services
      - upload (create)
      - metadata (view)
      - delete
      - update
  - Avatars
    - schema
    - services
      - upload
      - getMeta
      - delete
- Libs
  - ~~bcrypt~~
    - ~~encrypt ~~
    - ~~decrypt~~
  - ~~jwt~~
    - ~~generate Tokens~~
    - ~~verify Tokens~~
    - ~~decode Tokens~~
    - ~~refresh Token~~
  - ~~CORS~~
  - Imgur
    - ~~client~~
    - ~~service~~
      - ~~upload~~
      - ~~get~~
      - delete
  - ~~Cloudinary
    - Upload
    - Get~~

### RewriteSchema
Users
Favorites
History
Imgs
Media
Contents
Genres
Countries
Person
Departments
Collections
Reviews
