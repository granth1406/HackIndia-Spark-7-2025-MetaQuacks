import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatarUrl: string;
  delay: number;
}

const Testimonial: React.FC<TestimonialProps> = ({ 
  quote, 
  author, 
  role, 
  company, 
  avatarUrl,
  delay 
}) => {
  return (
    <motion.div 
      className="glass-card p-6 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="mb-6">
        <Quote className="h-8 w-8 text-accent-400 opacity-50" />
      </div>
      <p className="text-white/80 mb-6">{quote}</p>
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-primary-500/30">
          <img 
            src={avatarUrl} 
            alt={author} 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-white/60 text-sm">{role}, {company}</p>
        </div>
      </div>
    </motion.div>
  );
};

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "ProofPass has revolutionized our hiring process. We can now verify candidates' credentials instantly, saving weeks of background checks.",
      author: "Michael Chen",
      role: "Head of Talent Acquisition",
      company: "TechNova Inc",
      avatarUrl: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      quote: "As someone who's constantly applying for international positions, having my credentials securely stored and instantly verifiable is game-changing.",
      author: "Sophia Rodriguez",
      role: "Software Engineer",
      company: "Freelance",
      avatarUrl: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      quote: "The security features are impressive. Our university now issues all diplomas with ProofPass verification, eliminating credential fraud.",
      author: "Dr. James Wilson",
      role: "Dean of Admissions",
      company: "Global University",
      avatarUrl: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    }
  ];

  return (
    <section id="testimonials" className="section relative">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-dark-900/0 via-highlight-800/10 to-dark-900/0 pointer-events-none"></div>
      <div className="container-custom relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Trusted by <span className="gradient-text">Industry Leaders</span>
          </motion.h2>
          <motion.p 
            className="text-lg text-white/80"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            See how ProofPass is transforming credential verification across industries and changing how people manage their digital identity.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <Testimonial 
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              company={testimonial.company}
              avatarUrl={testimonial.avatarUrl}
              delay={index}
            />
          ))}
        </div>
        
        <motion.div 
          className="mt-20 glass-card p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-wrap justify-center gap-12 items-center">
            {['Acme Corp', 'TechGiant', 'Global University', 'Future Finance', 'Innovate Labs'].map((company, index) => (
              <div key={index} className="text-xl md:text-2xl font-semibold opacity-50 hover:opacity-100 transition-opacity">
                {company}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;