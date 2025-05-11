"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRef, useEffect } from "react";


const HeroSection = () => {
    
    const imageRef = useRef();
    useEffect(() => {
        const imageElement = imageRef.current;

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;

            if (scrollPosition > scrollThreshold){
                imageElement.classList.add("scrolled");
            }
            else{
                imageElement.classList.remove("scrolled");
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

  return (
    <div className="pb-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl font-extrabold leading-tight sm:text-6xl mb-6">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Your Financial Future
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600">
            Powered by Intelligence
          </span>
        </h1>
        <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
          An AI-powered finance platform that helps you track, analyze and optimize your expenses with real time insights.
        </p>
        <div className="mb-10">
          <Link href="/dashboard">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
        </div>
        <div className="hero-image-wrapper">
          <div
            ref={imageRef}
            className="hero-image transition-transform duration-500 ease-in-out">
            <Image
              src="/banner.jpeg"
              width={1200}
              height={720}
              alt="dashboard preview"
              className="rounded-lg shadow-2xl border mx-auto"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
