# AskCraft Furniture

A modern, full-stack web application for AskCraft Furniture, a premium custom furniture company. Built with Next.js 16, featuring a public landing page and an admin CMS for content management.

## Features

### Public Website
- **Landing Page**: Elegant homepage showcasing services, materials, and portfolio
- **Services Section**: Highlights design consultation, custom production, premium finishing, and installation
- **Materials Showcase**: Interactive display of wood, veneer, metal, and upholstery options
- **Portfolio Gallery**: Dynamic showcase of completed projects (images and videos)
- **Contact Form**: Integrated form for client inquiries and project briefs
- **Responsive Design**: Optimized for all devices with smooth animations

### Admin CMS
- **Authentication**: Secure login system with JWT tokens
- **User Management**: Manage team members with role-based access (Admin, Editor, User)
- **Article Management**: Create, edit, and publish blog articles
- **Media Library**: Upload and manage images and videos for the portfolio
- **Dashboard**: Overview of content and recent activities

### Technical Features
- **API Routes**: RESTful APIs for all CRUD operations
- **Database Integration**: Prisma ORM with MySQL
- **Form Handling**: React Hook Form with Zod validation
- **Authentication**: Password hashing with bcrypt, JWT tokens
- **File Uploads**: Media management system
- **SEO Optimized**: Server-side rendering and meta tags

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion (animations)
- **Backend**: Next.js API Routes
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT, bcrypt
- **Forms**: React Hook Form, Zod
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Prerequisites

- Node.js 18+
- MySQL database
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd askcraft
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
DATABASE_URL="mysql://username:password@localhost:3306/askcraft"
JWT_SECRET="your-secret-key-here"
NEXTAUTH_SECRET="your-nextauth-secret"
```

4. Set up the database:
```bash
npx prisma migrate dev
npx prisma db seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

### Development
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Database
```bash
npx prisma studio          # Open Prisma Studio
npx prisma migrate dev     # Run migrations
npx prisma db seed         # Seed database
```

## Project Structure

```
askcraft/
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts           # Database seeding
│   └── migrations/       # Database migrations
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── admin/        # Admin pages
│   │   ├── api/          # API routes
│   │   ├── login/        # Login page
│   │   └── page.tsx      # Landing page
│   ├── components/       # Reusable components
│   ├── lib/              # Utility functions
│   └── middleware.ts     # Next.js middleware
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Articles
- `GET /api/articles` - Get all articles
- `POST /api/articles` - Create new article
- `GET /api/articles/[id]` - Get article by ID
- `PUT /api/articles/[id]` - Update article
- `DELETE /api/articles/[id]` - Delete article

### Media
- `GET /api/media` - Get all media
- `POST /api/media` - Upload new media
- `GET /api/media/[id]` - Get media by ID
- `DELETE /api/media/[id]` - Delete media

### Members
- `GET /api/members` - Get all members
- `POST /api/members` - Create new member
- `GET /api/members/[id]` - Get member by ID
- `PUT /api/members/[id]` - Update member
- `DELETE /api/members/[id]` - Delete member

## Database Schema

### User
- `id`: String (CUID)
- `email`: String (unique)
- `password`: String (hashed)
- `name`: String (optional)
- `role`: Role (ADMIN, EDITOR, USER)
- `createdAt`, `updatedAt`: DateTime

### Article
- `id`: String (CUID)
- `title`: String
- `content`: String
- `slug`: String (unique)
- `imageUrl`: String (optional)
- `published`: Boolean
- `authorId`: String (foreign key to User)
- `createdAt`, `updatedAt`: DateTime

### Media
- `id`: String (CUID)
- `type`: MediaType (image, video)
- `url`: String (unique)
- `caption`: String (optional)
- `uploaderId`: String (foreign key to User)
- `createdAt`, `updatedAt`: DateTime

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is proprietary software owned by AskCraft Furniture.

## Contact

For questions or support, contact:
- Email: kresnasa22@gmail.com
- Phone: +62 859106296666
- Website: [askcraft.com](https://askcraft.com)
