import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Star } from "lucide-react";

const testimonialsData = [
  {
    name: "Sarah Chen",
    role: "Product Manager at TechFlow",
    content:
      "TaskHub has completely transformed how our engineering team operates. The clarity it provides is unmatched.",
  },
  {
    name: "Mark Wilson",
    role: "Founder at StartupX",
    content:
      "Simple enough for beginners, but powerful enough for power users. Best decision we made this year.",
  },
  {
    name: "Jessica Lee",
    role: "Design Lead at Creative",
    content:
      "The UI is beautiful and the performance is snappy. Finally, a project management tool that doesn't feel like a chore.",
  },
];
const TestimoialsSection = () => {
  return (
    <section
      id="testimonials"
      className="bg-slate-50 dark:bg-slate-950 py-16 md:py-24"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 md:mb-16 text-center">
          <Badge variant="outline" className="mb-4">
            Testimonials
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Trusted by modern teams
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonialsData.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                  <Avatar>
                    <AvatarImage
                      src={`https://i.pravatar.cc/150?u=${i}`}
                      alt={item.name}
                    />
                    <AvatarFallback>{item.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold leading-none">
                      {item.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.role}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="size-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm italic">
                    "{item.content}"
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimoialsSection;
