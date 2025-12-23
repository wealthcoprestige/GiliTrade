"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

function ServicesPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");

  const serviceCategories = [
    { id: "all", name: "All Services", icon: "fas fa-star", count: 12 },
    {
      id: "immigration",
      name: "Immigration",
      icon: "fas fa-passport",
      count: 4,
    },
    {
      id: "employment",
      name: "Employment",
      icon: "fas fa-briefcase",
      count: 3,
    },
    {
      id: "education",
      name: "Education",
      icon: "fas fa-graduation-cap",
      count: 3,
    },
    { id: "support", name: "Support", icon: "fas fa-hands-helping", count: 2 },
  ];

  const services = [
    {
      id: 1,
      category: "immigration",
      icon: "fas fa-plane-departure",
      title: "Visa Processing & Consultation",
      description:
        "Complete visa application handling with expert guidance for higher approval rates",
      price: "From $299",
      duration: "4-8 weeks",
      successRate: "98%",
      features: [
        "Visa eligibility assessment",
        "Document preparation",
        "Application submission",
        "Interview coaching",
        "Approval tracking",
      ],
      image:
        "https://images.unsplash.com/photo-1551836026-d5cbc2f0c53a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      popular: true,
    },
    {
      id: 2,
      category: "employment",
      icon: "fas fa-briefcase",
      title: "Global Job Placement",
      description:
        "International career opportunities with comprehensive relocation support",
      price: "From $499",
      duration: "2-6 months",
      successRate: "95%",
      features: [
        "Job matching with global employers",
        "Resume optimization",
        "Interview preparation",
        "Relocation assistance",
        "Post-placement support",
      ],
      image:
        "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80",
      popular: false,
    },
    {
      id: 3,
      category: "education",
      icon: "fas fa-graduation-cap",
      title: "University Admissions",
      description:
        "Seamless university admissions and scholarship applications worldwide",
      price: "From $399",
      duration: "3-6 months",
      successRate: "96%",
      features: [
        "University selection",
        "Application processing",
        "Scholarship assistance",
        "Student visa processing",
        "Pre-departure briefing",
      ],
      image:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      popular: true,
    },
    {
      id: 4,
      category: "immigration",
      icon: "fas fa-users",
      title: "Family Immigration",
      description: "Complete family sponsorship and reunification services",
      price: "From $599",
      duration: "6-12 months",
      successRate: "97%",
      features: [
        "Family sponsorship applications",
        "Document verification",
        "Relationship evidence preparation",
        "Interview preparation",
        "Follow-up support",
      ],
      image:
        "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      popular: false,
    },
    {
      id: 5,
      category: "support",
      icon: "fas fa-home",
      title: "Relocation Assistance",
      description:
        "Complete relocation support including housing, banking, and settlement",
      price: "From $199",
      duration: "2-4 weeks",
      successRate: "99%",
      features: [
        "Accommodation arrangement",
        "Bank account setup",
        "Local registration",
        "Cultural orientation",
        "Community integration",
      ],
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1473&q=80",
      popular: false,
    },
    {
      id: 6,
      category: "employment",
      icon: "fas fa-file-contract",
      title: "Work Permit Processing",
      description:
        "Expert handling of work permits and employment authorization",
      price: "From $349",
      duration: "4-10 weeks",
      successRate: "94%",
      features: [
        "Work permit assessment",
        "Employer documentation",
        "Application processing",
        "Renewal services",
        "Compliance guidance",
      ],
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1511&q=80",
      popular: true,
    },
    {
      id: 7,
      category: "education",
      icon: "fas fa-language",
      title: "Language Training & Testing",
      description:
        "Comprehensive language preparation for immigration and education",
      price: "From $149",
      duration: "8-24 weeks",
      successRate: "92%",
      features: [
        "Language assessment",
        "Personalized training",
        "Test preparation",
        "Mock tests",
        "Certificate guidance",
      ],
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      popular: false,
    },
    {
      id: 8,
      category: "immigration",
      icon: "fas fa-shield-alt",
      title: "Document Verification",
      description:
        "Professional document authentication and verification services",
      price: "From $99",
      duration: "1-3 weeks",
      successRate: "100%",
      features: [
        "Document review",
        "Authentication guidance",
        "Translation services",
        "Notarization assistance",
        "Express processing",
      ],
      image:
        "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      popular: false,
    },
    {
      id: 9,
      category: "support",
      icon: "fas fa-hand-holding-usd",
      title: "Financial Planning",
      description:
        "Immigration financial planning and proof of funds assistance",
      price: "From $249",
      duration: "2-4 weeks",
      successRate: "98%",
      features: [
        "Financial assessment",
        "Funds documentation",
        "Bank statement preparation",
        "Investment guidance",
        "Tax planning",
      ],
      image:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      popular: false,
    },
  ];

  const filteredServices =
    activeCategory === "all"
      ? services
      : services.filter((service) => service.category === activeCategory);

  const successStats = [
    { number: "10,000+", label: "Successful Clients" },
    { number: "50+", label: "Countries Served" },
    { number: "98%", label: "Success Rate" },
    { number: "24/7", label: "Client Support" },
  ];

  const processSteps = [
    {
      step: "01",
      title: "Consultation",
      description: "Free initial assessment of your needs and eligibility",
      icon: "fas fa-comments",
    },
    {
      step: "02",
      title: "Service Selection",
      description: "Choose the perfect service package for your goals",
      icon: "fas fa-clipboard-list",
    },
    {
      step: "03",
      title: "Documentation",
      description: "Expert guidance in preparing your application documents",
      icon: "fas fa-file-alt",
    },
    {
      step: "04",
      title: "Processing",
      description: "Professional handling of your application process",
      icon: "fas fa-cogs",
    },
    {
      step: "05",
      title: "Success",
      description: "Achieve your immigration or career goals",
      icon: "fas fa-trophy",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
     

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-800 to-blue-600 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Comprehensive Global Services
          </h1>
          <p className="text-xl sm:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            End-to-end solutions for immigration, employment, and education
            abroad. Your complete partner for international success.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/book-interview")}
              className="bg-white text-blue-800 px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Explore Services
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("services")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-800 transition-all duration-300"
            >
              View All Services
            </button>
          </div>
        </div>
      </section>

      {/* Success Stats */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {successStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Service Categories
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Choose from our comprehensive range of specialized services
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
            {serviceCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-4 rounded-2xl transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-blue-600 text-white shadow-lg transform -translate-y-1"
                    : "bg-white text-gray-700 hover:shadow-md hover:-translate-y-1"
                }`}
              >
                <div className="text-2xl mb-2">
                  <i className={category.icon}></i>
                </div>
                <div className="font-semibold text-sm mb-1">
                  {category.name}
                </div>
                <div className="text-xs opacity-70">
                  {category.count} services
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Our Premium Services
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Professional services designed for your international success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={400}
                    height={192}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {service.successRate} Success
                  </div>
                  {service.popular && (
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    {service.duration}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <i
                        className={`${service.icon} text-blue-600 text-xl`}
                      ></i>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {service.price}
                      </div>
                      <div className="text-sm text-gray-500">Starting from</div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <i className="fas fa-check text-green-500 mr-3"></i>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => router.push("/book-interview")}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                      Get Started
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/service-details?id=${service.id}`)
                      }
                      className="px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <i className="fas fa-info"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gradient-to-br from-blue-800 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our Simple 5-Step Process
            </h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              A structured approach that ensures your success from start to
              finish
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-white group-hover:text-blue-600 transition-all duration-300">
                    <i className={`${step.icon} text-2xl`}></i>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {step.step}
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-1/2 w-full h-1 bg-white/30 transform translate-x-10">
                      <div className="h-1 bg-white/50 group-hover:bg-white transition-all duration-300"></div>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-green-100 text-xl mb-8 max-w-2xl mx-auto">
            Let our experts guide you to international success. Choose your
            service and begin today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/book-interview")}
              className="bg-white text-green-800 px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Book Free Consultation
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("services")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-green-800 transition-all duration-300"
            >
              View Services Again
            </button>
          </div>
          <p className="text-green-200 text-sm mt-6">
            ✅ 98% Success Rate • 🕐 20+ Years Experience • 🌍 50+ Countries
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sky-500 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-white">
                Dream Abroad
              </h3>
              <p className="text-white/80 leading-relaxed">
                Your trusted partner for global immigration, education, and
                career opportunities. 20+ years of expertise in international
                success.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-white">
                Our Services
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors duration-300"
                  >
                    Visa Processing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors duration-300"
                  >
                    Job Placement
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors duration-300"
                  >
                    University Admissions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors duration-300"
                  >
                    Relocation Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-white">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors duration-300"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors duration-300"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors duration-300"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors duration-300"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-white">
                Contact Experts
              </h3>
              <div className="space-y-3 text-white/80">
                <p className="flex items-center">
                  <i className="fas fa-phone mr-3"></i>
                  +44 7715 870911
                </p>
                <p className="flex items-center">
                  <i className="fas fa-envelope mr-3"></i>
                  info@dreamabroad.online
                </p>
                <p className="flex items-center">
                  <i className="fas fa-clock mr-3"></i>
                  Mon-Fri: 9AM-6PM
                </p>
              </div>
              <div className="flex space-x-4 mt-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-sky-500 transition-all duration-300"
                >
                  <i className="fab fa-whatsapp"></i>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-sky-500 transition-all duration-300"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-sky-500 transition-all duration-300"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/20 text-center text-white/80">
            <p>
              &copy; 2024 Dream Abroad Immigration Services. All rights
              reserved. Trusted by thousands for international success since
              2003.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ServicesPage;
