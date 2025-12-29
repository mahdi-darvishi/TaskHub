import { motion, type Variants } from "framer-motion";
import { BarChart3, CheckCircle2, Users } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

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

const featuresData = [
  {
    title: "Team Collaboration",
    description:
      "Work together seamlessly in shared workspaces with real-time updates and live comments.",
    icon: <Users className="size-6" />,
  },
  {
    title: "Task Management",
    description:
      "Organize tasks with custom priorities, due dates, tags, and subtasks to stay on track.",
    icon: <CheckCircle2 className="size-6" />,
  },
  {
    title: "Progress Tracking",
    description:
      "Visualize project velocity with beautiful charts, burndown reports, and team insights.",
    icon: <BarChart3 className="size-6" />,
  },
];

const FeaturesSection = () => {
  return (
    <section
      id="features"
      className="bg-slate-50 dark:bg-slate-950 py-16 md:py-24"
    >
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mb-12 md:mb-16 text-center"
        >
          <Badge variant="outline" className="mb-4">
            Features
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Everything you need to ship faster
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg max-w-[800px] mx-auto">
            Powerful tools tailored for your team's workflow, designed to scale
            with your ambition.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid gap-8 md:grid-cols-3"
        >
          {featuresData.map((feature, i) => (
            <motion.div key={i} variants={fadeInUp}>
              <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
