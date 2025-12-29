import { motion } from "framer-motion";
import { Link } from "react-router";
import { Button } from "../ui/button";
const CtaSection = () => {
  return (
    <section className="bg-primary py-16 md:py-24 text-primary-foreground  ">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mx-auto px-4 text-center md:px-6"
      >
        <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
          Ready to boost your productivity?
        </h2>
        <p className="mx-auto mt-6 max-w-[600px] text-primary-foreground/80 md:text-xl">
          Join thousands of teams that use TaskHub to get more done, together.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link to="/sign-up" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="secondary"
              className="w-full h-12 px-8 font-bold text-primary"
            >
              Get Started for Free
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default CtaSection;
