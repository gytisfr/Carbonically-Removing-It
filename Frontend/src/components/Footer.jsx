import { Link } from "react-router-dom";
import ShapeBlur from './ShapeBlur';
import { motion } from "framer-motion";

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    },
  },
};

// New fade-in variant for About section
const aboutVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
  },
};

const Footer = () => {
  return (
    <footer className="w-full bg-carbonYellow text-black">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">

{/* Section 1 - About */}
<div>
  <h2 className="text-xl font-bold mb-4">About Carbon Removers</h2>
  <motion.p
    className="text-black font-benzin-medium"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    viewport={{ once: false, amount: 0.5 }}
  >
    Carbon Removers is dedicated to reducing carbon footprints and promoting sustainable solutions.  
    Join us in making a greener future!
  </motion.p>
</div>


        {/* Section 2 - Quick Links */}
        <div>
          <div className="flex justify-end">
            <h2 className="text-xl mr-auto font-bold mb-4">Quick Links</h2>
            <div className="flex justify-end h-10 overflow-hidden">
              <div className="w-10 h-10">
                <ShapeBlur
                  variation={0}
                  pixelRatioProp={window.devicePixelRatio || 1}
                  shapeSize={1}
                  roundness={0.5}
                  borderSize={0.125}
                  circleSize={0.25}
                  circleEdge={1}
                />
              </div>
              <div className="w-10 h-10">
                <ShapeBlur
                  variation={0}
                  pixelRatioProp={window.devicePixelRatio || 1}
                  shapeSize={1}
                  roundness={0.5}
                  borderSize={0.125}
                  circleSize={0.25}
                  circleEdge={1}
                />
              </div>
              <div className="w-10 h-10">
                <ShapeBlur
                  variation={0}
                  pixelRatioProp={window.devicePixelRatio || 1}
                  shapeSize={1}
                  roundness={0.5}
                  borderSize={0.125}
                  circleSize={0.25}
                  circleEdge={1}
                />
              </div>
            </div>
          </div>
          <motion.ul
            className="text-black space-y-0.5 font-benzin-medium"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
            variants={listVariants}
          >
            <motion.li variants={itemVariants}>
              <Link to="/" className="hover:opacity-50">Tracker</Link>
            </motion.li>
            <motion.li variants={itemVariants}>
              <Link to="/login" className="hover:opacity-50">Routes</Link>
            </motion.li>
            <motion.li variants={itemVariants}>
              <Link to="/about" className="hover:opacity-50">About</Link>
            </motion.li>
            <motion.li variants={itemVariants}>
              <Link to="/faq" className="hover:opacity-50">FAQ</Link>
            </motion.li>
          </motion.ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="bg-black text-carbonOrange text-center py-4">
        &copy; {new Date().getFullYear()} Carbon Removers. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
