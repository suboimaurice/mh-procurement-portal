MH Procurement Portal
======================

##📋 Overview
The MH Procurement Portal is a Progressive Web App (PWA) designed to streamline the sourcing of medical supplies, lab equipment, pharmaceuticals, and office materials for the Municipal Hospital's Outpatient Services Department. Built with a focus on speed and reliability, this PWA offers a fast, app-like experience to users, including full offline access to core content.


##✨ Features
#Offline-First Experience: 
The application is available offline, allowing hospital staff to access procurement information even with an unstable internet connection.
Installable App: As a PWA, users can install the application on their mobile or desktop devices for quick and easy access.

#Efficient Sourcing: 
Provides categorized browsing and a powerful search feature to help users find the items they need quickly.

#Reusable Components: 
The application uses a component-based architecture for the header and footer, making maintenance straightforward.

#Fast & Responsive Design: 
Built using Tailwind CSS, the interface is modern, responsive, and performs well across different devices.


##🚀 Technologies Used
#HTML: 
For the structure of the web pages.

#Tailwind CSS: 
A utility-first CSS framework for building custom, responsive designs.

#JavaScript: 
Used for dynamic content loading, PWA functionality, and event handling.
#Service Workers: 
Enables the offline capabilities and asset caching.
#Web App Manifest: 
Provides app-like features and metadata for installation.
#npm & npx: 
Used for package management and running the Tailwind CLI.


##⚙️ Installation and Setup
#Prerequisites
Node.js and npm installed on your machine.

Local Development
Clone the repository:

git clone https://github.com/suboimaurice/mh-procurement-portal.git

Navigate to the project directory:
cd mh-procurement-portal

Install dependencies:
npm install

Start the Tailwind build process:
npx tailwindcss -i ./assets/css/style.css -o ./assets/css/output.css --watch

Open the project:
With the build running, open your index.html file in a browser (or use a Live Server extension) to see the site.

#PWA Installation
After deploying the app to a web server (e.g., GitHub Pages), users can install it:
On Android (Chrome): Visit the site, tap the three-dot menu, and select "Install app."
On iOS (Safari): Visit the site, tap the Share icon, and select "Add to Home Screen."
On Desktop (Chrome): An install icon will appear in the address bar.


##🌐 Deployment with GitHub Pages
This project is designed for easy deployment with GitHub Pages.
Update Manifest and Service Worker:
Adjust the start_url and scope in your manifest.json and the registration path in main.js to account for the subdirectory on GitHub Pages.

// index.js
navigator.serviceWorker.register('/mh-procurement-portal/service-worker.js');

#Commit and Push: 
Commit your changes and push to your main branch.

#Enable Pages: 
Go to your repository Settings > Pages and enable GitHub Pages, selecting the main branch as the source.


##📄 License
This project is licensed under the MIT License. See the LICENSE file for more details.


##🤝 Contributing
Contributions are welcome! If you find a bug or have a feature request, please open an issue or submit a pull request.