import { motion, type Variants } from "framer-motion";
import { Badge } from "../ui/badge";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { ArrowRight, CheckCircle2, Play } from "lucide-react";

// --- Animations ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};
const HeroSection = () => {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24 lg:py-32 md:px-6 mt-[3900px] sm:mt-[3500px]  md:mt-[3300px] lg:mt-[2000px]">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-6 text-center lg:text-left"
        >
          <motion.div
            variants={fadeInUp}
            className="flex justify-center lg:justify-start"
          >
            <Badge
              variant="secondary"
              className="rounded-full px-4 py-1 text-sm"
            >
              New v2.0 is live! 🚀
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
          >
            Manage projects
            <br />
            <span className="text-primary">without the chaos.</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mx-auto max-w-[600px] text-lg text-muted-foreground md:text-xl lg:mx-0"
          >
            TaskHub connects your teams, unifies your tasks, and drives projects
            forward. The modern platform for modern work.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col gap-3 sm:flex-row justify-center lg:justify-start"
          >
            <Link to="/sign-up" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-12 px-8 text-base">
                Start for free
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-12 px-8 text-base"
            >
              <Play className="mr-2 size-4" /> Watch Demo
            </Button>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-muted-foreground"
          >
            {["No credit card", "14-day free trial", "Cancel anytime"].map(
              (text) => (
                <div key={text} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" />
                  {text}
                </div>
              )
            )}
          </motion.div>
        </motion.div>

        {/* Hero Image / Placeholder */}
        <motion.div
          initial={{ opacity: 0, x: 50 }} // Reduced movement for mobile
          whileInView={{ opacity: 1, x: 0 }} // Changed to whileInView for better performance
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto w-full max-w-[500px] lg:max-w-none"
        >
          <div className="relative overflow-hidden rounded-xl border bg-background shadow-2xl">
            {/* --- Placeholder UI --- */}
            <div className="aspect-16/10 bg-slate-50 dark:bg-slate-900 p-4 flex flex-col gap-4">
              <div className="h-8 w-1/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              <div className="flex gap-4 h-full">
                <div className="w-1/4 h-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse hidden sm:block" />
                <div className="w-full sm:w-3/4 h-full flex flex-col gap-4">
                  <div className="h-1/3 bg-primary/10 rounded border border-primary/20" />
                  <div className="h-2/3 bg-slate-100 dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-700" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
