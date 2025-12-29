import { motion } from "framer-motion";
const stepsData = [
  {
    title: "Create an account",
    description:
      "Sign up for free and set up your first workspace in less than 30 seconds.",
  },
  {
    title: "Invite your team",
    description:
      "Send invites via email or share a secure link to get everyone on board.",
  },
  {
    title: "Start Shipping",
    description:
      "Create projects, assign tasks, and watch your productivity soar.",
  },
];
const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 container mx-auto">
      <div className="mx-auto px-4 md:px-6">
        <div className="mb-12 md:mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            From idea to launch in minutes
          </h2>
        </div>

        <div className="grid gap-12 grid-cols-1 lg:grid-cols-3">
          {stepsData.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground shadow-lg shadow-primary/30 z-10 relative">
                {i + 1}
              </div>
              <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
              <p className="text-muted-foreground max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
