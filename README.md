# File Uploader

A full stack application allowing the user to upload and organize files alike to remote file storage (Like GoogleDrive, OneDrive, etc...). Used stack includes EJS as template engine, Express.js for backend logic and PostgreSQL with Prisma ORM for persistent data storage handling.

## Features

- Create, Rename and Delete folders.
- Tree-like filesystem and link for easy retrieval.
- Upload files with limits in size (5MB by default) and mimetype
- Download files
- Share folder with all of its content for 3 days

## Motivations

- Implement Prisma ORM as interface for PostgreSQL database
- Utilize Passport.js Local Strategy for authentication in conjunction of Prisma to persist session
- Integrate multer middleware to handle file uploading
- Use responsive design with ejs ssr for the view
- Leverage Supabase Storage cloud service for file storage
- Simulate filesystem path for folders and files urls for convenience
- Implement access control to differentiate public shared folders from users' personal data

## To-Do's

- Make possible to modify folders and files location
- Give delete option to files aside from parent folder deletion
- Have more option for availability duration of shared folder (1 day to 7 days)
