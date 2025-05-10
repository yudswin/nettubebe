<div align="center">
  
  <div>
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-drizzle-black?style=for-the-badge&logoColor=C5F74F&logo=drizzle&color=000000" alt="drizzleorm" />
    <img src="https://img.shields.io/badge/-PostgreSQL-black?style=for-the-badge&logoColor=white&logo=postgresql&color=4169E1" alt="postgresql" />
    <img src="https://img.shields.io/badge/-MySQL-black?style=for-the-badge&logoColor=white&logo=mysql&color=4479A1" alt="mysql" />
  </div>

  <h3 align="center">NETTUBE BACKEND</h3>

   <div align="center">
     This project implement with <a href="https://orm.drizzle.team/" target="_blank"><b>Drizzle ORM</b></a> 
    </div>
</div>

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
- [Database Setup](#database-setup)
- [API Endpoint](#api-endpoint)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [Development](#development)
- [Documentation References](#documentation-references)

## Overview
Nettubebe is a comprehensive media content management system offering user authentication, content streaming, favorites management, and more. The system supports multiple database environments (MySQL and Neon PostgreSQL) through Drizzle ORM.

## Features
- User authentication with JWT (access & refresh tokens)
- Media content management
- Video streaming
- User profiles with avatars
- Content favorites and watch history
- Reviews and ratings
- Genre and country categorization
- Collections and personalization

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MySQL (for local development)
- Neon PostgreSQL account (for production)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yudswin/nettubebe
cd nettubebe
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# Database
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=yourpassword
MYSQL_DATABASE=nettubebe

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret

# Cloudinary (for media storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Imgur (for image storage)
IMGUR_CLIENT_ID=your_client_id
IMGUR_CLIENT_SECRET=your_client_secret

```
4. Build the project:
```bash
npm run build
```

5. Start the server:
```bash
npm start
```

For developer mode:
```bash
npm run dev
```

## Database Setup
- Development Database (MySQL)
```bash
# Generate migration files
npm run migrate:dev:generate

# Apply migrations
npm run migrate:dev

# Seed database with initial data
npm run dev:seed
```
- Production Database (Neon PostgreSQL)
```bash
# Generate migration files
npm run migrate:prod:generate

# Push schema changes to production
npm run migrate:prod:push
```

## API Endpoint
<details>
<summary><code>API Endpoint path</code></summary>

```md
### User & Authentication
- `POST /api/user/auth/register` - Register a new user
- `POST /api/user/auth/login` - Login user
- `GET /api/user/getAll` - Get all users (admin only)
- `GET /api/user/me` - Get current user profile
- `PUT /api/user/update/:id` - Update user information
- `DELETE /api/user/delete/:id` - Delete user account

### User Avatar
- `POST /api/user/avatar/upload` - Upload user avatar
- `DELETE /api/user/avatar/delete` - Delete user avatar

### Watch History
- `POST /api/user/history` - Add media to watch history
- `GET /api/user/:userId` - Get user's watch history
- `GET /api/user/:userId/media/:mediaId` - Get specific history entry
- `GET /api/user/media/:mediaId` - Get all users who watched a media
- `PATCH /api/user/:userId/media/:mediaId` - Update watch history (progress)
- `DELETE /api/user/:userId/media/:mediaId` - Remove item from watch history

### Favorites
- `POST /api/user/favorite` - Add content to favorites
- `GET /api/user/:userId` - Get user's favorites
- `GET /api/user/:userId/content/:contentId` - Check if content is favorited
- `GET /api/user/content/:contentId` - Get all users who favorited a content
- `DELETE /api/user/:userId/content/:contentId` - Remove content from favorites

### Media Management
- `POST /api/media/upload/:contentId` - Upload video for content
- `GET /api/media/:contentId` - Get all media for content
- `GET /api/media/record/:mediaId` - Get specific video record (admin)
- `PUT /api/media/update/:mediaId` - Update video record (admin)
- `DELETE /api/media/delete/:mediaId` - Delete media (admin)

### Streaming
- `GET /v1/watch/:videoId` - Get streaming URLs for a video
- `GET /v1/manifest/:videoId` - Proxy HLS manifest file

### Content
- `POST /content` - Create new content
- `GET /content/list` - List all content
- `GET /content/:id` - Get content by ID
- `GET /content/slug/:slug` - Get content by slug
- `PATCH /content/:id` - Update content
- `DELETE /content/:id` - Delete content
- `GET /content/v1/search` - Search content

### Content Genres
- `POST /content/:contentId/genres` - Add genres to content
- `GET /content/:contentId/genres` - Get genres for content
- `DELETE /content/:contentId/genres` - Remove genres from content
- `PUT /content/:contentId/genres` - Set genres for content

### Content Countries
- `POST /content/:contentId/countries` - Add countries to content
- `GET /content/:contentId/countries` - Get countries for content
- `DELETE /content/:contentId/countries` - Remove countries from content
- `PUT /content/:contentId/countries` - Set countries for content

### Genres
- `POST /content/genre` - Create new genre
- `GET /content/genre/list` - List all genres
- `GET /content/genre/:id` - Get genre by ID
- `GET /content/genre/slug/:slug` - Get genre by slug
- `PATCH /content/genre/:id` - Update genre
- `DELETE /content/genre/:id` - Delete genre

### Countries
- `POST /content/country` - Create new country
- `GET /content/country/list` - List all countries
- `GET /content/country/:id` - Get country by ID
- `GET /content/country/code/:code` - Get country by code
- `GET /content/country/slug/:slug` - Get country by slug
- `PATCH /content/country/:id` - Update country
- `DELETE /content/country/:id` - Delete country

### Cast
- `POST /content/cast/:contentId` - Add cast to content
- `GET /content/cast/:contentId` - Get cast for content
- `GET /content/cast/v1/:personId` - Get content for actor
- `DELETE /content/cast/:contentId` - Remove cast from content
- `PUT /content/cast/:contentId` - Set cast for content

### Directors
- `POST /content/director/:contentId` - Add directors to content
- `GET /content/director/:contentId` - Get directors for content
- `GET /content/director/v1/:personId` - Get content directed by person
- `DELETE /content/director/:contentId` - Remove directors from content
- `PUT /content/director/:contentId` - Set directors for content

### Person
- `POST /person` - Create new person
- `GET /person/list` - List all persons
- `GET /person/:id` - Get person by ID
- `GET /person/slug/:slug` - Get person by slug
- `PATCH /person/:id` - Update person
- `DELETE /person/:id` - Delete person
- `GET /person/v1/search` - Search for people

### Person Departments
- `POST /person/:id/departments` - Add departments to person
- `GET /person/:id/departments` - Get person's departments
- `DELETE /person/:id/departments` - Remove departments from person
- `PUT /person/:id/departments` - Set departments for person

### Departments
- `POST /department` - Create new department
- `GET /department/list` - List all departments
- `GET /department/:id` - Get department by ID
- `GET /department/slug/:slug` - Get department by slug
- `PATCH /department/:id` - Update department
- `DELETE /department/:id` - Delete department
- `GET /department/v1/search` - Search departments

### Reviews
- `POST /review` - Create new review
- `GET /review` - Get all reviews
- `GET /review/:id` - Get review by ID
- `GET /review/user/:userId` - Get all reviews by user
- `GET /review/content/:contentId` - Get all reviews for content
- `PATCH /review/:id` - Update review
- `DELETE /review/:id` - Delete review

### Collections
- `POST /collection` - Create new collection
- `GET /collection/list` - List all collections
- `GET /collection/:id` - Get collection by ID
- `GET /collection/slug/:slug` - Get collection by slug
- `PATCH /collection/:id` - Update collection
- `DELETE /collection/:id` - Delete collection

### Collection Contents
- `POST /collection/:collectionId/contents/:contentId` - Add content to collection
- `GET /collection/:collectionId/contents` - Get all content in collection
- `PUT /collection/:collectionId/contents/:contentId/rank` - Update content rank in collection
- `DELETE /collection/:collectionId/contents/:contentId` - Remove content from collection
```
</details>

## Project Structure
```c#
src/
  ├── controllers/    # Request handlers
  ├── data/           # Static data for seeding
  ├── db/             # Database connections
  ├── libs/           # Utility functions
  │   ├── bcrypt      # Password encryption
  │   ├── jwt         # Token management
  │   ├── imgur       # Image hosting service
  │   └── cloudinary  # Media hosting service
  ├── middleware/     # Express middleware
  ├── models/         # Database schema
  ├── routes/         # API routes
  ├── services/       # Business logic
  ├── types/          # TypeScript interfaces
  ├── index.ts        # Application entry
  └── seed.ts         # Database seeding
```

## Technologies
- Express - Web framework
- TypeScript - Programming language
- Drizzle ORM - Database ORM
- MySQL2 - MySQL client
- JsonWebToken - Authentication
- Bcrypt - Password hashing
- Cloudinary - Media storage
- Imgur API - Image hosting

## Development
Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run dev:seed` - Seed development database

## Documentation References
- [MySQL2 Documentation](https://sidorares.github.io/node-mysql2/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/get-started-mysql)
- [JWT Documentation](https://jwt.io/)
- [Bcrypt Generators](https://bcrypt-generator.com/)
- [Express Routing with TypeScript](https://dev.to/sulistef/how-to-set-up-routing-in-an-expressjs-project-using-typescript-51ib)
