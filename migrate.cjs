const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const srcDir = path.join(baseDir, 'src');
const oldAuthDir = path.join(srcDir, 'auth-old');
const oldHooksDir = path.join(srcDir, 'hooks-old');
const oldPagesDir = path.join(srcDir, 'pages-old');
const oldComponentsDir = path.join(srcDir, 'components-old');
const featuresDir = path.join(srcDir, 'features');

// Ensure features directories exist
const dirs = [
  'about/components', 'services/components', 'contact', 
  'decorators', 'auth', 'profile', 'customer/components', 
  'decorator-dashboard', 'admin'
];

dirs.forEach(d => fs.mkdirSync(path.join(featuresDir, d), { recursive: true }));

// Helper to copy and replace imports
function migrate(oldPath, newPath, replacements = []) {
  if (!fs.existsSync(oldPath)) {
    console.error('File not found:', oldPath);
    return;
  }
  let content = fs.readFileSync(oldPath, 'utf8');
  
  // Apply specific replacements
  replacements.forEach(r => {
    content = content.split(r.from).join(r.to);
  });
  
  // Apply general replacements
  content = content.replace(/..\/..\/..\/Hooks\/useAxiosSecure/g, '../../hooks/useAxiosSecure');
  content = content.replace(/..\/..\/Hooks\/useAxiosSecure/g, '../../hooks/useAxiosSecure');
  content = content.replace(/..\/..\/..\/Authentication\/AuthContext/g, '../auth/AuthContext');
  content = content.replace(/..\/..\/Authentication\/AuthContext/g, '../auth/AuthContext');
  content = content.replace(/..\/Authentication\/AuthContext/g, './AuthContext');
  content = content.replace(/..\/..\/..\/Components\/UxComponents\/Loading\/Spinner/g, '../home/components/Spinner');
  content = content.replace(/..\/..\/Components\/UxComponents\/Loading\/Spinner/g, '../home/components/Spinner');

  fs.writeFileSync(newPath, content, 'utf8');
  console.log('Migrated:', newPath);
}

// 1. About
const aboutOldComps = path.join(oldComponentsDir, 'Pages/PublicPages/AboutComponents');
const aboutNewComps = path.join(featuresDir, 'about/components');
['TopSection.jsx', 'Intro.jsx', 'Values.jsx', 'Stats.jsx', 'CallToAction.jsx'].forEach(f => {
  migrate(path.join(aboutOldComps, f), path.join(aboutNewComps, f));
});
migrate(path.join(aboutOldComps, 'HowItWorks.jsx'), path.join(aboutNewComps, 'HowItWorks.jsx'), [
  { from: '../../../../Authentication/AuthContext', to: '../../auth/AuthContext' }
]);

const aboutPageContent = `import React from "react";
import { useLoaderData } from "react-router";
import TopSection from "./components/TopSection";
import Stats from "./components/Stats";
import Intro from "./components/Intro";
import Values from "./components/Values";
import CallToAction from "./components/CallToAction";
import HowItWorks from "./components/HowItWorks";

const About = () => {
  const data = useLoaderData();
  const stats = data.stats;
  const values = data.values;
  const steps = data.steps;

  return (
    <div className="min-h-screen bg-base-100 dark:bg-gray-900">
      <TopSection></TopSection>
      <Stats stats={stats}></Stats>
      <Intro></Intro>
      <Values values={values}></Values>
      <HowItWorks steps={steps}></HowItWorks>
      <CallToAction></CallToAction>
    </div>
  );
};

export default About;`;
fs.writeFileSync(path.join(featuresDir, 'about/About.page.jsx'), aboutPageContent);


// 2. Services
const srvOldComps = path.join(oldComponentsDir, 'Pages/PublicPages/ServiceComponents');
const srvNewComps = path.join(featuresDir, 'services/components');
['ServiceCard.jsx', 'TopSection.jsx'].forEach(f => {
  migrate(path.join(srvOldComps, f), path.join(srvNewComps, f));
});

migrate(path.join(oldPagesDir, 'public/Services.jsx'), path.join(featuresDir, 'services/Services.page.jsx'), [
  { from: '../../Components/Pages/PublicPages/ServiceComponents/ServiceCard', to: './components/ServiceCard' },
  { from: '../../Components/Pages/PublicPages/ServiceComponents/TopSection', to: './components/TopSection' },
  { from: '../../Components/UxComponents/Loading/Spinner', to: '../home/components/Spinner' }
]);

migrate(path.join(oldPagesDir, 'public/ServiceDetails.jsx'), path.join(featuresDir, 'services/ServiceDetails.page.jsx'));

// 3. Contact
migrate(path.join(oldPagesDir, 'public/Contact.jsx'), path.join(featuresDir, 'contact/Contact.page.jsx'));

// 4. Decorators
migrate(path.join(oldPagesDir, 'public/TopDecorators.jsx'), path.join(featuresDir, 'decorators/TopDecorators.page.jsx'));
migrate(path.join(oldPagesDir, 'public/JoinAsDecorator.jsx'), path.join(featuresDir, 'decorators/JoinAsDecorator.page.jsx'));

// 5. Auth
migrate(path.join(oldPagesDir, 'public/LogIn.jsx'), path.join(featuresDir, 'auth/Login.page.jsx'));
migrate(path.join(oldPagesDir, 'public/Register.jsx'), path.join(featuresDir, 'auth/Register.page.jsx'));

// 6. Profile
migrate(path.join(oldPagesDir, 'private/MyProfile.jsx'), path.join(featuresDir, 'profile/MyProfile.page.jsx'));

// 7. Customer
migrate(path.join(oldComponentsDir, 'Pages/PublicPages/MyBookingsComponents/BookingNotFound.jsx'), path.join(featuresDir, 'customer/components/BookingNotFound.jsx'));
migrate(path.join(oldPagesDir, 'private/customer/MyBookings.jsx'), path.join(featuresDir, 'customer/MyBookings.page.jsx'), [
  { from: '../../../Components/Pages/PublicPages/MyBookingsComponents/BookingNotFound', to: './components/BookingNotFound' }
]);
migrate(path.join(oldPagesDir, 'private/customer/ServiceBooking.jsx'), path.join(featuresDir, 'customer/ServiceBooking.page.jsx'));
migrate(path.join(oldPagesDir, 'private/customer/Transactions.jsx'), path.join(featuresDir, 'customer/Transactions.page.jsx'));
migrate(path.join(oldPagesDir, 'private/customer/PaymentSuccess.jsx'), path.join(featuresDir, 'customer/PaymentSuccess.page.jsx'));

// 8. Decorator Dashboard
migrate(path.join(oldPagesDir, 'private/decorator/ManageService.jsx'), path.join(featuresDir, 'decorator-dashboard/ManageService.page.jsx'));
migrate(path.join(oldPagesDir, 'private/decorator/MyProjects.jsx'), path.join(featuresDir, 'decorator-dashboard/MyProjects.page.jsx'));
migrate(path.join(oldPagesDir, 'private/decorator/MyEarnings.jsx'), path.join(featuresDir, 'decorator-dashboard/MyEarnings.page.jsx'));

// 9. Admin
migrate(path.join(oldPagesDir, 'private/admin/Analytics.jsx'), path.join(featuresDir, 'admin/Analytics.page.jsx'));
migrate(path.join(oldPagesDir, 'private/admin/ManageBookings.jsx'), path.join(featuresDir, 'admin/ManageBookings.page.jsx'));
migrate(path.join(oldPagesDir, 'private/admin/ManageDecorator.jsx'), path.join(featuresDir, 'admin/ManageDecorator.page.jsx'));

console.log("Migration complete!");
