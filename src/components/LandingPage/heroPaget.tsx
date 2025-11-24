"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import api from "../axios/axiosInsatance";
import Header from "./Header";

interface Category {
  id: string;
  name: string;
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  category: Category;
  location: string;
  duration: string;
  image: string;
  employment_type: string;
  experience_level: string;
  country: string;
  city: string;
  state: string;
  status: string;
  created_at: string;
  salary: string;
  remote: string;
}

interface MappedCampaign {
  id: string;
  title: string;
  description: string;
  type: string;
  location: string;
  duration: string;
  image: string;
  salary: string;
  deadline: string;
  employment_type: string;
  experience_level: string;
  country: string;
  city: string;
  state: string;
  status: string;
  days_remaining: number;
  category_name: string;
}

function HeroPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeFilter, setActiveFilter] = useState("All");
  const [savedOpportunities, setSavedOpportunities] = useState<Set<string>>(
    new Set()
  );
  const [healthcareSlide, setHealthcareSlide] = useState(0);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const router = useRouter();

  const handleScrollToOpportunities = () => {
    const opportunitiesSection = document.getElementById("opportunities");
    if (opportunitiesSection) {
      opportunitiesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const extractDataFromResponse = <T,>(response: unknown): T[] => {
    if (response && typeof response === "object" && "data" in response) {
      const data = response.data as { results?: T[] };
      if (
        data &&
        typeof data === "object" &&
        "results" in data &&
        Array.isArray(data.results)
      )
        return data.results as T[];
      if (Array.isArray(data)) return data as T[];
    }
    if (
      response &&
      typeof response === "object" &&
      "results" in response &&
      Array.isArray(response.results)
    )
      return response.results as T[];
    if (Array.isArray(response)) return response as T[];
    return [];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingMore(true);
        setLoading(true);
        const [campaignsResponse, categoriesResponse] = await Promise.all([
          api.get("/campaigns/"),
          api.get("/categories/"),
        ]);

        if (
          campaignsResponse &&
          typeof campaignsResponse === "object" &&
          "data" in campaignsResponse
        ) {
          const campaignDataContainer = campaignsResponse.data as {
            results?: Campaign[];
            next?: string | null;
          };
          if (
            campaignDataContainer &&
            typeof campaignDataContainer === "object" &&
            "results" in campaignDataContainer
          ) {
            setCampaigns(campaignDataContainer.results ?? []);
            setNextPageUrl(campaignDataContainer.next ?? null);
          } else if (Array.isArray(campaignDataContainer)) {
            setCampaigns(campaignDataContainer);
            setNextPageUrl(null);
          }
        } else {
          setCampaigns(extractDataFromResponse<Campaign>(campaignsResponse));
        }

        extractDataFromResponse<Category>(categoriesResponse);
        // setCategories(categoriesData); // categories is not used
      } catch {
        setError("Failed to load campaigns. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const loadMoreCampaigns = async () => {
    if (!nextPageUrl || loadingMore) return;

    setLoadingMore(true);
    try {
      const response = await api.get(nextPageUrl);
      if (response && typeof response === "object" && "data" in response) {
        const campaignDataContainer = response.data as {
          results?: Campaign[];
          next?: string | null;
        };
        if (
          campaignDataContainer &&
          typeof campaignDataContainer === "object" &&
          "results" in campaignDataContainer
        ) {
          setCampaigns((prev) => [
            ...prev,
            ...(campaignDataContainer.results ?? []),
          ]);
          setNextPageUrl(campaignDataContainer.next ?? null);
        }
      }
    } catch (err) {
      console.error("Failed to load more campaigns:", err);
      // Optionally set an error state for loading more
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        nextPageUrl &&
        !loadingMore &&
        window.innerHeight + document.documentElement.scrollTop + 1 >=
          document.documentElement.scrollHeight
      ) {
        loadMoreCampaigns();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextPageUrl, loadingMore]); // loadMoreCampaigns is a dependency, but adding it causes re-renders. Disabling the rule is a pragmatic choice here.

  const getImageUrl = (imagePath: string | undefined): string => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://127.0.0.1:8000${imagePath}`;
  };

  const getCategoryName = (category: Category): string => {
    return category ? category.name : "General";
  };

  const getDeadline = (createdAt: string): string => {
    const createdDate = new Date(createdAt);
    const deadline = new Date(createdDate);
    deadline.setMonth(deadline.getMonth() + 3);
    return deadline.toISOString().split("T")[0];
  };

  const getDaysRemaining = (deadline: string): number => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getEmploymentTypeIcon = (type: string): string => {
    const icons: Record<string, string> = {
      internship: "fas fa-graduation-cap",
      full_time: "fas fa-briefcase",
      contract: "fas fa-file-contract",
      temporary: "fas fa-clock",
    };
    return icons[type] || "fas fa-briefcase";
  };

  const handleApplyNow = (campaignId: string) => {
    router.push(`/details?campaign_id=${campaignId}`);
  };

  const mappedCampaigns: MappedCampaign[] = campaigns.map((campaign) => ({
    id: campaign.id,
    title: campaign.title,
    description: campaign.description,
    type: getCategoryName(campaign.category),
    location: campaign.location,
    duration: campaign.duration,
    image: getImageUrl(campaign.image),
    salary: campaign.salary || "Competitive",
    deadline: getDeadline(campaign.created_at),
    employment_type: campaign.employment_type,
    experience_level: campaign.experience_level,
    country: campaign.country,
    city: campaign.city,
    state: campaign.state,
    status: campaign.status,
    days_remaining: getDaysRemaining(getDeadline(campaign.created_at)),
    category_name: campaign.category.name,
  }));

  // Get unique category names for filter buttons
  const uniqueCategories = Array.from(
    new Set(mappedCampaigns.map((campaign) => campaign.category_name))
  );

  // Filter campaigns based on active filter
  const filteredOpportunities = mappedCampaigns.filter((opp) => {
    if (activeFilter === "All") return true;
    return opp.category_name === activeFilter;
  });

  const healthcareCampaigns = mappedCampaigns.filter(
    (campaign) =>
      campaign.category_name.toLowerCase().includes("health") ||
      campaign.category_name.toLowerCase().includes("care") ||
      campaign.title.toLowerCase().includes("nurse") ||
      campaign.title.toLowerCase().includes("doctor") ||
      campaign.title.toLowerCase().includes("medical") ||
      campaign.title.toLowerCase().includes("healthcare")
  );

  const slides = [
    {
      title: "Discover Your Global Career Path",
      description:
        "Find exciting international job opportunities tailored to your skills and aspirations. Your dream career abroad is within reach.",
      primaryBtn: "Explore Jobs",
      secondaryBtn: "Learn More",
      bgImage:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1470&q=80",
    },
    {
      title: "World-Class Education Awaits",
      description:
        "Access top universities and educational programs worldwide with our guidance and scholarship assistance.",
      primaryBtn: "Find Programs",
      secondaryBtn: "View Scholarships",
      bgImage:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1470&q=80",
    },
    {
      title: "Transform Your Life Through Travel",
      description:
        "Experience new cultures, build global connections, and create unforgettable memories with our curated travel programs.",
      primaryBtn: "Plan Your Journey",
      secondaryBtn: "View Destinations",
      bgImage:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1470&q=80",
    },
  ];

  const toggleSaveOpportunity = (id: string) => {
    const newSaved = new Set(savedOpportunities);
    if (newSaved.has(id)) newSaved.delete(id);
    else newSaved.add(id);
    setSavedOpportunities(newSaved);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHealthcareSlide(
        (prev) => (prev + 1) % Math.ceil(healthcareCampaigns.length / 3)
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [healthcareCampaigns.length]);

  const nextHealthcareSlide = () => {
    setHealthcareSlide(
      (prev) => (prev + 1) % Math.ceil(healthcareCampaigns.length / 3)
    );
  };

  const prevHealthcareSlide = () => {
    setHealthcareSlide(
      (prev) =>
        (prev - 1 + Math.ceil(healthcareCampaigns.length / 3)) %
        Math.ceil(healthcareCampaigns.length / 3)
    );
  };

  // Updated Campaign Card Component
  const CampaignCard = ({
    opportunity,
    isHealthcare = false,
  }: {
    opportunity: MappedCampaign;
    isHealthcare?: boolean;
  }) => {
    const cardColors = isHealthcare
      ? {
          gradient: "from-green-500 to-green-600",
          text: "text-green-600",
          bg: "bg-green-50",
          border: "border-green-100",
        }
      : {
          gradient: "from-blue-500 to-blue-600",
          text: "text-blue-600",
          bg: "bg-blue-50",
          border: "border-blue-100",
        };

    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100">
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={
              opportunity.image ||
              "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1470&q=80"
            }
            alt={opportunity.title}
            width={400}
            height={224}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <div
              className={`bg-white/90 backdrop-blur-sm ${cardColors.text} px-3 py-1.5 rounded-full text-xs font-semibold`}
            >
              <i
                className={`fas ${getEmploymentTypeIcon(
                  opportunity.employment_type
                )} mr-1`}
              ></i>
              {opportunity.employment_type?.replace("_", " ").toUpperCase()}
            </div>

            <div className="flex flex-col gap-2">
              <div
                className={`bg-gradient-to-r ${cardColors.gradient} text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg`}
              >
                {opportunity.type}
              </div>
              {opportunity.days_remaining < 7 && (
                <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold animate-pulse">
                  <i className="fas fa-clock mr-1"></i>
                  {opportunity.days_remaining} left
                </div>
              )}
            </div>
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex justify-between items-center text-white text-sm">
              <div className="flex items-center bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <i className="fas fa-map-marker-alt mr-1.5"></i>
                <span className="truncate max-w-[120px]">
                  {opportunity.location}
                </span>
              </div>
              <div className="flex items-center bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <i className="fas fa-dollar-sign mr-1.5"></i>
                <span>
                  {opportunity.salary?.split(" ")[0] || "Competitive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          {/* Title and Save */}
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-800 line-clamp-2 flex-1 mr-3 leading-tight">
              {opportunity.title}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSaveOpportunity(opportunity.id);
              }}
              className={`flex-shrink-0 transition-all duration-300 p-2 rounded-full ${
                savedOpportunities.has(opportunity.id)
                  ? `${cardColors.text} bg-${cardColors.bg.split("-")[1]}-50`
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              }`}
            >
              <i
                className={`${
                  savedOpportunities.has(opportunity.id) ? "fas" : "far"
                } fa-bookmark text-lg`}
              ></i>
            </button>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
            {opportunity.description}
          </p>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center text-gray-600 text-sm">
              <i className="fas fa-clock mr-2 text-gray-400"></i>
              <span>{opportunity.duration}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <i className="fas fa-user-tie mr-2 text-gray-400"></i>
              <span className="capitalize">{opportunity.experience_level}</span>
            </div>
          </div>

          {/* Progress Bar for Urgency */}
          {opportunity.days_remaining < 30 && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Application closing</span>
                <span>{opportunity.days_remaining} days left</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${
                    opportunity.days_remaining < 7
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  } h-2 rounded-full transition-all duration-500`}
                  style={{
                    width: `${Math.max(
                      10,
                      (opportunity.days_remaining / 30) * 100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <button
              onClick={() => handleApplyNow(opportunity.id)}
              className={`bg-gradient-to-r ${cardColors.gradient} hover:shadow-lg transform hover:-translate-y-0.5 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center group`}
            >
              Apply Now
              <i className="fas fa-arrow-right ml-2 text-xs group-hover:translate-x-1 transition-transform duration-300"></i>
            </button>
            <button
              onClick={() => handleApplyNow(opportunity.id)}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-300 flex items-center text-sm font-medium"
            >
              <i className="far fa-eye mr-2"></i>
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="relative h-[70vh] min-h-[600px] mt-16 overflow-hidden">
        <div className="relative h-full w-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === activeSlide ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url('${slide.bgImage}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-blue-600/60"></div>
              <div className="container mx-auto px-4 h-full flex items-center">
                <div
                  className={`max-w-2xl text-white transform transition-all duration-1000 ${
                    index === activeSlide
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                >
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleScrollToOpportunities}
                      className="bg-white text-blue-800 px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-lg"
                    >
                      {slide.primaryBtn}
                    </button>
                    <button
                      onClick={handleScrollToOpportunities}
                      className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-800 transition-all duration-300 text-lg"
                    >
                      {slide.secondaryBtn}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                index === activeSlide
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Healthcare Professionals Section */}
      {healthcareCampaigns.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center bg-green-100 text-green-800 px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
                <i className="fas fa-heartbeat mr-3 text-lg"></i>
                Healthcare Opportunities
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Healthcare Professionals
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover rewarding healthcare opportunities around the world.
                Join the global healthcare community and make a difference.
              </p>
            </div>

            <div className="relative">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${healthcareSlide * 100}%)`,
                  }}
                >
                  {Array.from({
                    length: Math.ceil(healthcareCampaigns.length / 3),
                  }).map((_, slideIndex) => (
                    <div
                      key={slideIndex}
                      className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2"
                    >
                      {healthcareCampaigns
                        .slice(slideIndex * 3, slideIndex * 3 + 3)
                        .map((opportunity) => (
                          <CampaignCard
                            key={opportunity.id}
                            opportunity={opportunity}
                            isHealthcare={true}
                          />
                        ))}
                    </div>
                  ))}
                </div>
              </div>

              {healthcareCampaigns.length > 3 && (
                <>
                  <button
                    onClick={prevHealthcareSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 z-10 hover:scale-110"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button
                    onClick={nextHealthcareSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 z-10 hover:scale-110"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </>
              )}

              <div className="flex justify-center mt-12 space-x-3">
                {Array.from({
                  length: Math.ceil(healthcareCampaigns.length / 3),
                }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setHealthcareSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === healthcareSlide
                        ? "bg-green-600 scale-125"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Opportunities Section */}
      <section
        id="opportunities"
        className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16">
            <div className="flex-1 mb-8 lg:mb-0">
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
                <i className="fas fa-star mr-3 text-lg"></i>
                Featured Opportunities
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Your Next Global Adventure Awaits
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                Explore a curated selection of international roles and
                scholarships, each chosen to match your unique skills and
                ambitions.
              </p>
            </div>

            {/* Filter Tabs - Dynamic based on available categories */}
            <div className="w-full lg:w-auto">
              <div className="flex flex-wrap gap-3 justify-center lg:justify-end">
                {/* "All" filter button */}
                <button
                  onClick={() => setActiveFilter("All")}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer border-2 ${
                    activeFilter === "All"
                      ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                  } text-sm md:text-base`}
                >
                  All
                </button>

                {/* Dynamic category filter buttons */}
                {uniqueCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveFilter(category)}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer border-2 ${
                      activeFilter === category
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                    } text-sm md:text-base`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredOpportunities.map((opportunity) => (
                <CampaignCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto">
                <div className="text-gray-400 text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  No opportunities found
                </h3>
                <p className="text-gray-600 mb-8">
                  {activeFilter === "All"
                    ? "There are currently no opportunities available. Please check back later."
                    : `No opportunities found in the ${activeFilter} category. Try selecting a different filter.`}
                </p>
                <button
                  onClick={() => setActiveFilter("All")}
                  className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Show All Opportunities
                </button>
              </div>
            </div>
          )}

          {/* Loading indicator for infinite scroll */}
          {loadingMore && nextPageUrl && (
            <div className="text-center py-8">
              <div className="inline-flex items-center text-gray-600">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                <span>Loading more opportunities...</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center text-2xl font-bold mb-6">
                <i className="fas fa-globe-americas mr-3 text-blue-200"></i>
                Dream Abroad
              </div>
              <p className="text-blue-100 mb-6 leading-relaxed text-lg">
                Connecting talented individuals with global opportunities. Your
                journey to international success starts here.
              </p>
              <div className="flex space-x-4">
                {["facebook", "twitter", "linkedin", "instagram"].map(
                  (social) => (
                    <button
                      key={social}
                      className="bg-white/10 hover:bg-white/20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    >
                      <i className={`fab fa-${social} text-lg`}></i>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-4">
                {[
                  "Home",
                  "About Us",
                  "Services",
                  "Jobs",
                  "Schools",
                  "Scholarships",
                ].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-blue-100 hover:text-white transition-colors duration-300 text-lg hover:underline"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Our Services</h3>
              <ul className="space-y-4">
                {[
                  "Job Placement",
                  "Education Consulting",
                  "Scholarship Guidance",
                  "Visa Assistance",
                  "Career Counseling",
                ].map((service) => (
                  <li key={service}>
                    <a
                      href="#"
                      className="text-blue-100 hover:text-white transition-colors duration-300 text-lg hover:underline"
                    >
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Contact Us</h3>
              <div className="space-y-4 text-lg">
                <div className="flex items-center">
                  <i className="fas fa-map-marker-alt mr-4 text-blue-200 text-xl"></i>
                  <span className="text-blue-100">
                    123 Global Street, City, Country
                  </span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-phone mr-4 text-blue-200 text-xl"></i>
                  <span className="text-blue-100">+44 7715 870911</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-envelope mr-4 text-blue-200 text-xl"></i>
                  <span className="text-blue-100">info@dreamabroad.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-blue-400 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-blue-100 text-lg mb-4 md:mb-0">
              © 2024 Dream Abroad. All rights reserved.
            </div>
            <div className="flex space-x-6 text-lg">
              <a
                href="#"
                className="text-blue-100 hover:text-white transition-colors duration-300 hover:underline"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-blue-100 hover:text-white transition-colors duration-300 hover:underline"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-blue-100 hover:text-white transition-colors duration-300 hover:underline"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HeroPage;
