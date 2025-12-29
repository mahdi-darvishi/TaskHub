import { Layout, Menu, X } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import { useState } from "react";

const menuVariants: Variants = {
  closed: { opacity: 0, height: 0 },
  open: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
};
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  return (
    <header className="sticky top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 ">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Layout className="size-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">TaskHub</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link to="#features" className="hover:text-primary transition-colors">
            Features
          </Link>
          <Link
            to="#how-it-works"
            className="hover:text-primary transition-colors"
          >
            How it Works
          </Link>
          <Link
            to="#testimonials"
            className="hover:text-primary transition-colors"
          >
            Testimonials
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/sign-in">
            <Button variant="ghost" className="font-semibold">
              Log in
            </Button>
          </Link>
          <Link to="/sign-up">
            <Button>Get Started</Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-primary"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden border-b bg-background px-4 py-4 shadow-lg"
          >
            <nav className="flex flex-col gap-4 text-sm font-medium">
              <a
                onClick={toggleMenu}
                href="#features"
                className="block p-2 hover:bg-muted rounded-md"
              >
                Features
              </a>
              <a
                onClick={toggleMenu}
                href="#how-it-works"
                className="block p-2 hover:bg-muted rounded-md"
              >
                How it Works
              </a>
              <a
                onClick={toggleMenu}
                href="#testimonials"
                className="block p-2 hover:bg-muted rounded-md"
              >
                Testimonials
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t">
                <Link to="/sign-in" onClick={toggleMenu}>
                  <Button variant="ghost" className="w-full justify-start">
                    Log in
                  </Button>
                </Link>
                <Link to="/sign-up" onClick={toggleMenu}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
