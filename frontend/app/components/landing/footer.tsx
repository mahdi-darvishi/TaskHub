import { Layout } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-background py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Layout className="size-5" />
              </div>
              <span className="text-xl font-bold">TaskHub</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Simplify task management and team collaboration with our intuitive
              platform.
            </p>
          </div>

          {/* Footer Links */}
          {[
            {
              title: "Product",
              links: ["Features", "Pricing", "Integrations", "Updates"],
            },
            {
              title: "Company",
              links: ["About", "Careers", "Blog", "Contact"],
            },
            { title: "Legal", links: ["Privacy", "Terms", "Security"] },
          ].map((col, i) => (
            <div key={i} className="space-y-4">
              <h4 className="text-sm font-semibold">{col.title}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t pt-8 flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <p>© 2025 TaskHub Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <div className="size-5 bg-muted rounded-full hover:bg-primary/50 cursor-pointer transition-colors" />
            <div className="size-5 bg-muted rounded-full hover:bg-primary/50 cursor-pointer transition-colors" />
            <div className="size-5 bg-muted rounded-full hover:bg-primary/50 cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
