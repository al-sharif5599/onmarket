# OnMarket - Online Shop System Specification

## 1. Project Overview

**Project Name:** OnMarket  
**Project Type:** E-commerce Web Application  
**Core Functionality:** A business listing platform where customers can post their businesses/products with images and videos, and administrators can manage and approve these listings.  
**Target Users:** Business owners (customers) and System Administrators

---

## 2. User Types & Capabilities

### 2.1 Customer (Business Owner)
- **Registration:** Full registration with username, email, and password
- **Login:** Login with email/username and password
- **Post Businesses:** Create business/product listings with:
  - Business name
  - Description
  - Images (multiple)
  - Videos
  - Category
  - Price
  - Contact information
- **View Own Listings:** See all businesses they've posted
- **Edit/Delete Own Listings:** Manage their own content

### 2.2 Administrator
- **Login:** Login with username and password
- **Post Businesses:** Create business/product listings (same as customer)
- **Approve Listings:** Review and approve/reject customer-submitted businesses
- **Manage Customers:** View, edit, and manage customer accounts
- **Dashboard:** Overview of all system activities

---

## 3. Technical Stack

### Backend
- **Framework:** Django 4.x
- **Database:** PostgreSQL
- **API:** Django REST Framework (DRF)
- **Authentication:** JWT (JSON Web Tokens)

### Frontend
- **Framework:** React 18+
- **State Management:** React Context API
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Styling:** Custom CSS with modern design

### Database Configuration
```
python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'online_shop_db'),
        'USER': os.getenv('DB_USER', 'postgres'),
        'PASSWORD': os.getenv('DB_PASSWORD', 'Al sharif'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}
```

---

## 4. UI/UX Specification

### 4.1 Design Theme
- **Primary Color:** #2563EB (Vibrant Blue)
- **Secondary Color:** #1E293B (Dark Slate)
- **Accent Color:** #F59E0B (Amber)
- **Background:** #F8FAFC (Light Gray)
- **Text Primary:** #1E293B
- **Text Secondary:** #64748B
- **Success:** #10B981
- **Error:** #EF4444
- **Warning:** #F59E0B

### 4.2 Typography
- **Headings:** 'Poppins', sans-serif
- **Body:** 'Inter', sans-serif

### 4.3 Layout Structure
- **Header:** Navigation bar with logo, menu items, user controls
- **Hero Section:** Featured businesses carousel
- **Content Areas:** Grid-based business listings
- **Footer:** Links, contact info, social media

---

## 5. Core Features

### 5.1 Authentication System
- User registration with validation
- Login with JWT token generation
- Password hashing with bcrypt
- Session management
- Role-based access control

### 5.2 Business Management
- Create business listing with images and videos
- Edit existing listings
- Delete listings
- View listing details
- Category-based filtering
- Search functionality

### 5.3 Admin Dashboard
- Overview statistics (total users, businesses, pending approvals)
- Pending business approvals list
- User management table
- Business management table

### 5.4 Media Handling
- Image upload and storage
- Video upload and storage
- Image preview
- Video playback

---

## 6. Required Python Libraries

### Django & REST Framework
- Django>=4.2
- djangorestframework>=3.14
- django-cors-headers>=4.3
- djangorestframework-simplejwt>=5.3

### Database
- psycopg2-binary>=2.9

### Media Handling
- Pillow>=10.0
- django-imagekit>=4.1

### Authentication
- PyJWT>=2.8
- bcrypt>=4.1

### Utilities
- python-dotenv>=1.0

---

## 7. Use Case Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      OnMarket System                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐         ┌──────────────┐                │
│  │   Customer   │         │    Admin      │                │
│  └──────┬───────┘         └──────┬───────┘                │
│         │                        │                         │
│         │  1. Register           │  1. Login              │
│         │  2. Login              │  2. Post Business      │
│         │  3. Post Business      │  3. Approve Business   │
│         │  4. View Own Business  │  4. Manage Users       │
│         │  5. Edit Business      │  5. View Dashboard     │
│         │  6. Delete Business    │                         │
│         │                        │                         │
│         └────────┬───────────────┘                         │
│                  │                                          │
│                  ▼                                          │
│         ┌────────────────┐                                  │
│         │  PostgreSQL    │                                  │
│         │    Database    │                                  │
│         └────────────────┘                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Data Flow Diagram

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Customer │────▶│  React   │────▶│  Django  │────▶│PostgreSQL│
│          │     │Frontend  │     │   API    │     │   DB     │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
      │               │               │                │
      │               │               │                │
      ▼               ▼               ▼                ▼
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Submit  │     │  Display │     │ Process  │     │  Store   │
│ Business │     │ Results  │     │ Request  │     │  Data    │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                              │
                                              ▼
                                       ┌──────────┐
                                       │  Admin   │
                                       │  Review  │
                                       └──────────┘
```

---

## 9. API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/refresh/` - Refresh JWT token
- `GET /api/auth/user/` - Get current user

### Businesses
- `GET /api/businesses/` - List all approved businesses
- `POST /api/businesses/` - Create new business
- `GET /api/businesses/{id}/` - Get business details
- `PUT /api/businesses/{id}/` - Update business
- `DELETE /api/businesses/{id}/` - Delete business

### Admin
- `GET /api/admin/pending/` - Get pending businesses
- `POST /api/admin/approve/{id}/` - Approve business
- `POST /api/admin/reject/{id}/` - Reject business
- `GET /api/admin/users/` - List all users
- `POST /api/admin/users/{id}/` - Update user

---

## 10. Database Models

### User
- id (PK)
- username (unique)
- email (unique)
- password (hashed)
- role (admin/customer)
- created_at
- updated_at

### Business
- id (PK)
- owner (FK to User)
- name
- description
- category
- price
- contact_email
- contact_phone
- images (JSON)
- videos (JSON)
- status (pending/approved/rejected)
- created_at
- updated_at

### Category
- id (PK)
- name
- description

---

## 11. Project Structure

```
onmarket/
├── backend/
│   ├── online_shop/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── businesses/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── admin.py
│   ├── accounts/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── public/
└── SPEC.md
