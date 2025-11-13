import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FinVision AI
              </h3>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Smart Insights, Smarter Decisions. AI-powered personal finance management for a better financial future.
            </p>
          </div>
          
          {/* Project Info */}
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Project Info</h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>BTech CSE - Semester 7</li>
              <li>Guide: Dr. Deepa Joshi</li>
              <li>Domain: Web Development</li>
              <li>SDG Goal 17: Partnerships</li>
            </ul>
          </div>
          
          {/* Team */}
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Team Members</h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>Arav Kumar</li>
              <li>Abhinav Rana</li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>&copy; 2025 FinVision AI. Academic Project - All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
