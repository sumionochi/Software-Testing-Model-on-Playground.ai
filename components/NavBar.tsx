"use client";

import React, { useState, useEffect } from 'react';
import logoImage from '@/assets/icons/linkedin.svg';
import MenuIcon from '@/assets/icons/menu.svg';
import Image from 'next/image';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from '../lib/utils';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { MousePointer2, MousePointerClick } from 'lucide-react';
import { Separator } from './ui/separator';
import { UserProfile } from './UserProfile';
import { createClient } from '@/utils/supabase/client';
import LoginButton from './Log';

type Props = {};

const NavBar = (props: Props) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [user, setUser] = useState<any>(null); // Track user authentication status
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, [supabase]);

  const toggleSheet = () => {
    setIsSheetOpen(!isSheetOpen);
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className='w-full sticky top-0 z-20 bg-white dark:bg-black p-4 border-b'>
      <div className='max-w-7xl w-full mx-auto'>
        <div className='flex flex-row w-full items-center justify-between'>
          <div className='relative gap-2 h-10 flex flex-row items-center justify-center'>
            <div
              onClick={handleScrollToTop}
              className='text-xl relative flex flex-row text-center duration-1000 cursor-pointer animate-title whitespace-normal items-center'
            >
              <p>InstaTryOn</p>
              <MousePointerClick className='w-6 h-6 ml-1 whitespace-nowrap' />
            </div>
          </div>
          <div className='flex flex-row items-center gap-2 sm:hidden'>
            <button onClick={toggleSheet}>
              <MenuIcon />
            </button>
          </div>
          <NavigationMenu className='hidden sm:flex'>
            <NavigationMenuList className='flex gap-6 items-center'>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <MousePointerClick className='w-7 h-7' />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            InstaTryOn
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            A BrandTech Company providing innovative solutions for seamless shopping experiences.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="#" title="Introduction">
                      Re-usable components built using Radix UI and Tailwind CSS.
                    </ListItem>
                    <ListItem href="#" title="Installation">
                      How to install dependencies and structure your app.
                    </ListItem>
                    <ListItem href="#" title="Typography">
                      Styles for headings, paragraphs, lists...etc.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {[
                      { title: "Solution 1", href: "#", description: "Description of solution 1." },
                      { title: "Solution 2", href: "#", description: "Description of solution 2." },
                      { title: "Solution 3", href: "#", description: "Description of solution 3." },
                    ].map((solution) => (
                      <ListItem key={solution.title} title={solution.title} href={solution.href}>
                        {solution.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>About us</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <ListItem href="#" title="Our Story">
                      Learn about our journey and mission.
                    </ListItem>
                    <ListItem href="#" title="Team">
                      Meet the talented individuals behind InstaTryOn.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
                  Documentation
                </NavigationMenuLink>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className='flex gap-0 pt-10 items-center w-full flex-col'>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription className='mb-2'>Navigation menu for mobile devices</SheetDescription>
            <Separator />
            {/* Mobile navigation accordion */}
            <Accordion type="single" collapsible className='w-full mt-6'>
              <AccordionItem value="solutions">
                <AccordionTrigger>Solutions</AccordionTrigger>
                <AccordionContent>
                  <ul className="grid gap-3 p-4">
                    {[
                      { title: "Solution 1", href: "#", description: "Description of solution 1." },
                      { title: "Solution 2", href: "#", description: "Description of solution 2." },
                      { title: "Solution 3", href: "#", description: "Description of solution 3." },
                    ].map((solution) => (
                      <li key={solution.title} className='p-2'>
                        <a href={solution.href} className="text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition">
                          <div className="text-sm font-medium">{solution.title}</div>
                          <p className="text-sm">{solution.description}</p>
                        </a>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="resources">
                <AccordionTrigger>Resources</AccordionTrigger>
                <AccordionContent>
                  <ul className="grid gap-3 p-4">
                    {[
                      { title: "Resource 1", href: "#", description: "Description of resource 1." },
                      { title: "Resource 2", href: "#", description: "Description of resource 2." },
                    ].map((resource) => (
                      <li key={resource.title} className='p-2'>
                        <a href={resource.href} className="text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition">
                          <div className="text-sm font-medium">{resource.title}</div>
                          <p className="text-sm">{resource.description}</p>
                        </a>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="about">
                <AccordionTrigger>About us</AccordionTrigger>
                <AccordionContent>
                  <ul className="grid gap-3 p-4">
                    <li className='p-2'>
                      <a href="#" className="text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition">
                        <div className="text-sm font-medium">Our Story</div>
                        <p className="text-sm">Learn about our journey and mission.</p>
                      </a>
                    </li>
                    <li className='p-2'>
                      <a href="#" className="text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition">
                        <div className="text-sm font-medium">Team</div>
                        <p className="text-sm">Meet the talented individuals behind InstaTryOn.</p>
                      </a>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default NavBar;
