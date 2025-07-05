# Christ Apostolic Church Hours of Mercy Website

A modern, responsive React-based website for Christ Apostolic Church Hours of Mercy, located at 1480 Lincoln Ave, Dolton, Illinois, USA. This website serves as the primary digital presence for the congregation and community outreach.

## 🏛️ About the Church

Christ Apostolic Church Hours of Mercy is a vibrant community of believers committed to spreading God's love and mercy. Our name reflects our belief that every moment is an opportunity to experience and extend God's mercy to others.

## ✨ Features

### Core Functionality

- **Responsive Homepage** - Welcoming design with mission, values, and quick access to key information
- **Events Calendar** - Interactive calendar system for service times, prayer meetings, and special programs
- **Sermon Archive** - Audio/video streaming capabilities with searchable sermon library
- **Online Giving** - Secure donation processing with Stripe integration
- **Staff Directory** - Comprehensive information about pastoral team and staff
- **Ministry Pages** - Detailed information about youth programs, women's fellowship, men's ministry, and community service
- **Contact Section** - Service schedules, location mapping, and inquiry forms
- **Prayer Request System** - Secure submission and management of prayer requests
- **Member Portal** - Secure access to church resources and announcements

### Technical Features

- **Mobile-First Design** - Optimized for smartphones and tablets
- **Accessibility Compliance** - WCAG 2.1 AA standards
- **SEO Optimization** - Enhanced visibility for local search
- **Social Media Integration** - Facebook, Instagram, and YouTube integration
- **Newsletter Signup** - Email collection and management
- **Security** - Secure forms and payment processing
- **Performance** - Fast loading speeds and optimized assets

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with Vite
- **UI Library**: Material-UI (MUI) with custom theme
- **Routing**: React Router
- **Forms**: React Hook Form with Yup validation
- **Animations**: Framer Motion
- **Date/Time**: Day.js with MUI Date Pickers
- **Video/Audio**: React Player
- **Payments**: Stripe integration
- **SEO**: React Helmet Async
- **HTTP Client**: Axios

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd hours-of-mercy
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the website.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── components/
│   └── layout/
│       ├── Header.jsx          # Navigation header
│       └── Footer.jsx          # Site footer
├── pages/
│   ├── HomePage.jsx            # Welcome page with hero section
│   ├── AboutPage.jsx           # Church history and beliefs
│   ├── SermonPage.jsx          # Sermon archive with streaming
│   ├── EventsPage.jsx          # Events calendar
│   ├── MinistriesPage.jsx      # Ministry information
│   ├── GivingPage.jsx          # Online donation system
│   ├── ContactPage.jsx         # Contact forms and info
│   ├── PrayerRequestPage.jsx   # Prayer submission system
│   ├── MemberPortal.jsx        # Member resources
│   └── StaffDirectory.jsx      # Staff information
├── App.jsx                     # Main application component
├── main.jsx                    # Application entry point
└── index.css                   # Global styles
```

## 🎨 Design System

### Color Palette

- **Primary**: Deep Forest Green (#2c5530)
- **Secondary**: Golden Yellow (#d4af37)
- **Background**: Clean whites and light grays
- **Text**: Dark grays for optimal readability

### Typography

- **Headings**: Roboto with varied weights
- **Body Text**: Optimized for readability
- **Responsive**: Scales appropriately across devices

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
VITE_API_BASE_URL=your_api_base_url
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### Customization

The website is designed to be easily customizable:

1. **Theme**: Modify colors and typography in `App.jsx`
2. **Content**: Update text content in respective page components
3. **Images**: Replace placeholder images with actual church photos
4. **Features**: Add or modify features by updating components

## 📱 Responsive Design

The website is built with mobile-first approach:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px and above

## 🔐 Security Features

- Form validation and sanitization
- Secure payment processing with Stripe
- Privacy-focused prayer request handling
- Secure member authentication (planned)

## 🎯 SEO & Performance

- Server-side rendering capabilities
- Optimized images and assets
- Semantic HTML structure
- Meta tags and structured data
- Fast loading times with Vite

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software for Christ Apostolic Church Hours of Mercy.

## 📞 Support

For technical support or questions about the website:

- **Email**: admin@hoursofmercy.org
- **Phone**: (708) 555-0123
- **Address**: 1480 Lincoln Ave, Dolton, Illinois 60419

## 🙏 Acknowledgments

- Christ Apostolic Church Hours of Mercy community
- Open source contributors and maintainers
- Material-UI team for the excellent component library

---

**Built with ❤️ for the Kingdom of God**+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
