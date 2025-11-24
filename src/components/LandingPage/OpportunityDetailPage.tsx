"use client";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError, AxiosResponse } from "axios";
import Image from "next/image";
import Header from "./Header";
import companyLogo from "../../../public/logo.png";
import api from "../axios/axiosInsatance";

interface CampaignData {
  campaign?: {
    id: number;
    title: string;
    employment_type: string;
    city: string;
    state: string;
    location: string;
    duration: string;
    description: string;
    image: string;
    salary?: string;
    category: {
      name: string;
    };
  };
  gallery?: Array<{
    image: string;
  }>;
  compaign_benefits?: Array<{
    full_description: string;
    requirements: string[];
    responsibilities: string[];
    benefit: string[];
  }>;
}

interface FormData {
  full_name: string;
  email: string;
  phone_number: string;
  location: string;
  passport_number: string;
  whats_app: string;
  nationality: string;
  id_card: string;
  card_image_front: File | null;
  card_image_back: File | null;
  date_of_birth: string;
  profile_photo: File | null;
  bio: string;
  linkedin_profile: string;
  website_or_portfolio: string;
  languages_spoken: string;
  education: string;
  resume: File | null;
  certification: File | null;
  cover_letter: File | null;
  available_start_date: string;
  qualification: string;
}

interface Opportunity {
  id: number;
  title: string;
  type: string;
  location: string;
  duration: string;
  salary: string;
  deadline: string;
  company: string;
  companyLogo: string;
  images: string[];
  description: string;
  fullDescription: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  applicationProcess: string[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  application_id?: string;
  applicant_id?: string;
}

interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxFileSize?: number;
}

// Mobile-optimized File Compressor
class MobileFileCompressor {
  static async compressImage(
    file: File,
    options: CompressionOptions = {}
  ): Promise<File> {
    const {
      maxWidth = 800, // Lower for mobile
      maxHeight = 800,
      quality = 0.6, // Lower quality for mobile
      maxFileSize = 1 * 1024 * 1024, // 1MB for mobile
    } = options;

    return new Promise((resolve, reject) => {
      // Skip compression for small files on mobile
      if (file.size <= maxFileSize) {
        resolve(this.sanitizeFileName(file));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        // Fix: Create Image with proper constructor and type assertion
        const img = document.createElement("img");
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let { width, height } = img;

          // Calculate mobile-optimized dimensions
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Canvas not supported"));
            return;
          }

          // Mobile-optimized compression
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Compression failed"));
                return;
              }

              const compressedFile = new File(
                [blob],
                this.sanitizeFileName(file).name,
                {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                }
              );

              resolve(compressedFile);
            },
            "image/jpeg",
            quality
          );
        };
        img.onerror = () => reject(new Error("Image loading failed"));
        if (e.target?.result) {
          img.src = e.target.result as string;
        } else {
          reject(new Error("File reading failed"));
        }
      };
      reader.onerror = () => reject(new Error("File reading failed"));
      reader.readAsDataURL(file);
    });
  }

  static async compressDocument(file: File): Promise<File> {
    const maxSize = 3 * 1024 * 1024; // 3MB for mobile
    if (file.size > maxSize) {
      throw new Error(`File too large. Maximum size is 3MB.`);
    }
    return this.sanitizeFileName(file);
  }

  static sanitizeFileName(file: File): File {
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9.\-_]/g, "_")
      .replace(/_+/g, "_")
      .substring(0, 50); // Shorter for mobile

    // Preserve file extension
    const lastDotIndex = sanitizedName.lastIndexOf(".");
    if (lastDotIndex > 0) {
      const name = sanitizedName.substring(0, lastDotIndex);
      const ext = sanitizedName.substring(lastDotIndex);
      const finalName = name.substring(0, 50 - ext.length) + ext;
      return new File([file], finalName, { type: file.type });
    }

    return new File([file], sanitizedName, { type: file.type });
  }

  static async compressFile(
    file: File,
    options: CompressionOptions = {}
  ): Promise<File> {
    try {
      const sanitizedFile = this.sanitizeFileName(file);

      if (file.type.startsWith("image/")) {
        return await this.compressImage(sanitizedFile, options);
      } else if (file.type === "application/pdf") {
        return await this.compressDocument(sanitizedFile);
      } else if (
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        return await this.compressDocument(sanitizedFile);
      }

      return sanitizedFile;
    } catch (error) {
      console.warn("Compression failed, using original file:", error);
      return this.sanitizeFileName(file);
    }
  }
}

// Mobile-optimized API client
class MobileApiClient {
  static async submitApplication(
    url: string,
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<AxiosResponse> {
    const submitData = new FormData();

    // Add all form fields
    for (const key in formData) {
      const value = formData[key as keyof FormData];
      if (value instanceof File) {
        submitData.append(key, value);
      } else if (value !== null && value !== "") {
        submitData.append(key, value as string);
      }
    }

    const axios = (await import("axios")).default;

    return axios.post(url, submitData, {
      baseURL:
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://backend.dreamabroad.online/api/v2/",
      timeout: 120000, // 2 minutes, more accommodating for mobile compression + upload
      maxContentLength: 100 * 1024 * 1024,
      maxBodyLength: 100 * 1024 * 1024,
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(Math.round(progress));
        }
      },
    });
  }
}

const extractDataFromResponse = (response: unknown): CampaignData | null => {
  if (response && typeof response === "object" && "data" in response) {
    return (response as { data: CampaignData }).data;
  }
  if (response && typeof response === "object") {
    return response as CampaignData;
  }
  return null;
};

function OpportunityDetailPage() {
  const [showApplicationForm, setShowApplicationForm] =
    useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [compressing, setCompressing] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    email: "",
    phone_number: "",
    location: "",
    whats_app: "",
    passport_number: "",
    nationality: "",
    id_card: "",
    card_image_front: null,
    card_image_back: null,
    date_of_birth: "",
    profile_photo: null,
    bio: "",
    linkedin_profile: "",
    website_or_portfolio: "",
    languages_spoken: "",
    education: "",
    resume: null,
    certification: null,
    cover_letter: null,
    available_start_date: "",
    qualification: "",
  });

  const searchParams = useSearchParams();
  const campaignId = searchParams.get("campaign_id");
  const router = useRouter();

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== "undefined") {
        const mobile =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          ) || window.innerWidth < 768;
        setIsMobile(mobile);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!campaignId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/compaign/details/${campaignId}`);
        const responseData = extractDataFromResponse(response);
        setCampaignData(responseData);
      } catch (error) {
        console.error("Error fetching campaign data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [campaignId]);

  const getImageUrl = (imagePath: string | undefined): string => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `https://backend.dreamabroad.online/media/${imagePath}`;
  };

  const opportunity: Opportunity = campaignData
    ? {
        id: campaignData.campaign?.id || 0,
        title: campaignData.campaign?.title || "Opportunity Title",
        type: campaignData.campaign?.employment_type || "Full-time",
        location:
          `${campaignData.campaign?.city || ""}, ${
            campaignData.campaign?.state || ""
          }`.trim() ||
          campaignData.campaign?.location ||
          "Location not specified",
        duration: campaignData.campaign?.duration || "Permanent",
        salary: campaignData.campaign?.salary || "Competitive Salary",
        deadline: "2024-12-31",
        company: campaignData.campaign?.title || "Company not specified",
        companyLogo: getImageUrl(campaignData.campaign?.image),
        images:
          campaignData.gallery?.map((item) => getImageUrl(item.image)) ||
          [getImageUrl(campaignData.campaign?.image)].filter(Boolean),
        description:
          campaignData.campaign?.description ||
          "Join our team for an exciting opportunity.",
        fullDescription:
          campaignData.compaign_benefits?.[0]?.full_description ||
          campaignData.campaign?.description ||
          "This position offers great opportunities for professional growth and development.",
        requirements: Array.isArray(
          campaignData.compaign_benefits?.[0]?.requirements
        )
          ? campaignData.compaign_benefits[0].requirements
          : [
              "Relevant qualifications and experience",
              "Strong communication skills",
              "Team player mentality",
            ],
        responsibilities: Array.isArray(
          campaignData.compaign_benefits?.[0]?.responsibilities
        )
          ? campaignData.compaign_benefits[0].responsibilities
          : [
              "Perform duties as required",
              "Collaborate with team members",
              "Maintain professional standards",
            ],
        benefits: Array.isArray(campaignData.compaign_benefits?.[0]?.benefit)
          ? campaignData.compaign_benefits[0].benefit
          : [
              "Competitive compensation",
              "Professional development",
              "Great work environment",
            ],
        applicationProcess: [
          "Submit online application",
          "Initial screening",
          "Interview process",
          "Offer and onboarding",
        ],
      }
    : {
        id: 7,
        title: "Loading...",
        type: "Loading...",
        location: "Loading...",
        duration: "Loading...",
        salary: "Loading...",
        deadline: "2024-12-31",
        company: "Loading...",
        companyLogo: "",
        images: [],
        description: "Loading...",
        fullDescription: "Loading...",
        requirements: ["Loading..."],
        responsibilities: ["Loading..."],
        benefits: ["Loading..."],
        applicationProcess: ["Loading..."],
      };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    fieldName: keyof FormData
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file) {
        try {
          setCompressing(true);

          // Mobile-optimized compression
          const compressedFile = await MobileFileCompressor.compressFile(file, {
            maxWidth: isMobile ? 800 : 1200,
            maxHeight: isMobile ? 800 : 1200,
            quality: isMobile ? 0.6 : 0.7,
            maxFileSize: isMobile ? 1 * 1024 * 1024 : 2 * 1024 * 1024,
          });

          setFormData((prev) => ({ ...prev, [fieldName]: compressedFile }));

          if (isMobile && compressedFile.size < file.size) {
            console.log(
              `Mobile compression: ${file.name} reduced by ${(
                (1 - compressedFile.size / file.size) *
                100
              ).toFixed(1)}%`
            );
          }
        } catch (error) {
          console.error(`Error compressing ${fieldName}:`, error);
          // Always fall back to original file
          setFormData((prev) => ({ ...prev, [fieldName]: file }));
        } finally {
          setCompressing(false);
        }
      }
    }
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof FormData)[] = [
      "full_name",
      "email",
      "phone_number",
      "location",
      "passport_number",
      "nationality",
      "id_card",
      "resume",
      "card_image_front",
      "card_image_back",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        setSubmitError(`Please fill in the ${field.replace(/_/g, " ")} field`);
        return false;
      }
    }

    // Mobile-optimized file validation
    const resumeFile = formData.resume;
    if (resumeFile) {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!validTypes.includes(resumeFile.type)) {
        setSubmitError("Resume must be a PDF or Word document");
        return false;
      }

      const maxSize = isMobile ? 3 * 1024 * 1024 : 5 * 1024 * 1024;
      if (resumeFile.size > maxSize) {
        setSubmitError(`Resume must be less than ${isMobile ? "3MB" : "5MB"}`);
        return false;
      }
    }

    return true;
  };

  const compressAllFiles = async (): Promise<FormData> => {
    const compressedFormData = { ...formData };
    const fileFields: (keyof FormData)[] = [
      "resume",
      "certification",
      "cover_letter",
      "card_image_front",
      "card_image_back",
      "profile_photo",
    ];

    for (const field of fileFields) {
      const file = compressedFormData[field];
      if (file instanceof File) {
        try {
          const compressedFile = await MobileFileCompressor.compressFile(file, {
            maxWidth: isMobile ? 800 : 1200,
            maxHeight: isMobile ? 800 : 1200,
            quality: isMobile ? 0.6 : 0.7,
            maxFileSize: isMobile ? 1 * 1024 * 1024 : 2 * 1024 * 1024,
          });
          // Fix: Use type assertion to handle File assignment
          (
            compressedFormData as Record<
              keyof FormData,
              FormData[keyof FormData]
            >
          )[field] = compressedFile;
        } catch (_error) {
          console.warn(`Compression failed for ${field}, using original file`);
          // Keep original file if compression fails
        }
      }
    }

    return compressedFormData;
  };

  const handleSubmitApplication = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setUploadProgress(0);

    if (!validateForm()) {
      return;
    }

    if (!campaignId) {
      setSubmitError("No campaign selected");
      return;
    }

    setSubmitting(true);

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    const isAuthenticated = !!token;

    try {
      let finalFormData = formData;

      // Always compress files for mobile, compress for desktop if unauthenticated
      if (isMobile || !isAuthenticated) {
        setCompressing(true);
        finalFormData = await compressAllFiles();
        setCompressing(false);
      }

      if (isAuthenticated) {
        const authSubmitData = new FormData();
        authSubmitData.append("resume", finalFormData.resume || "");
        authSubmitData.append(
          "certification",
          finalFormData.certification || ""
        );
        authSubmitData.append("cover_letter", finalFormData.cover_letter || "");
        authSubmitData.append(
          "available_start_date",
          finalFormData.available_start_date
        );
        authSubmitData.append("qualification", finalFormData.qualification);

        const response: AxiosResponse = await api.post(
          `applicant/application/auth/${campaignId}`,
          authSubmitData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (response.status === 200 || response.status === 201) {
          setSubmitSuccess(true);
          setTimeout(() => router.push("/dashboard"), 2000);
        }
      } else {
        // Mobile-optimized unauthenticated submission
        const response = await MobileApiClient.submitApplication(
          `create/applicant/application/unauthenticated/${campaignId}`,
          finalFormData,
          (progress) => setUploadProgress(progress)
        );

        if (response.status === 201) {
          const responseData = response.data as ApiResponse;
          if (responseData.success) {
            sessionStorage.setItem(
              "login_message",
              "Application successful! Please check your email for your default password and log in to continue."
            );
            router.push("/accounts/login");
          } else {
            setSubmitError(
              responseData.message || "Application submission failed"
            );
          }
        } else {
          setSubmitError("Failed to submit application. Please try again.");
        }
      }
    } catch (error) {
      console.error("Submission error:", error);

      if (error instanceof AxiosError) {
        if (error.response) {
          // Server responded with error
          const errorData = error.response.data as {
            errors?: Record<string, string[] | string>;
            message?: string;
            applicant?: string[];
          };
          if (errorData.errors) {
            const firstError = Object.values(errorData.errors)[0];
            setSubmitError(
              Array.isArray(firstError)
                ? (firstError as string[])[0]
                : String(firstError)
            );
          } else if (errorData.message) {
            setSubmitError(errorData.message);
          } else if (
            errorData.applicant &&
            Array.isArray(errorData.applicant)
          ) {
            setSubmitError(errorData.applicant[0]);
          } else if (error.response.status === 413) {
            setSubmitError(
              "File size too large. Please try with smaller files."
            );
          } else {
            setSubmitError(
              `Server error (${error.response.status}). Please try again.`
            );
          }
        } else if (error.request) {
          // Network error
          if (typeof navigator !== "undefined" && !navigator.onLine) {
            setSubmitError("You are offline. Please check your connection.");
          } else if (error.code === "ECONNABORTED") {
            setSubmitError("Request timeout. Please try again.");
          } else {
            setSubmitError(
              "Network error. Please check your connection and try again."
            );
          }
        } else {
          setSubmitError("Application error. Please try again.");
        }
      } else {
        setSubmitError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setSubmitting(false);
      setCompressing(false);
      setUploadProgress(0);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading opportunity details...</p>
        </div>
      </div>
    );
  }

  if (!campaignId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Campaign Not Found
          </h2>
          <p className="text-gray-600">
            No campaign ID provided. Please go back and select an opportunity.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 bg-blue-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {submitSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <i className="fas fa-check-circle mr-2"></i>
            Application submitted successfully! Redirecting...
          </div>
        </div>
      )}

      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              <div className="relative h-96 overflow-hidden">
                {opportunity.images.length > 0 ? (
                  <Image
                    src={opportunity.images[selectedImage]}
                    alt={opportunity.title}
                    width={800}
                    height={384}
                    className="w-full h-full object-contain"
                    priority={true}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <i className="fas fa-image text-gray-400 text-6xl"></i>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-blue-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {campaignData?.campaign?.category?.name}
                </div>
              </div>

              {opportunity.images.length > 1 && (
                <div className="p-4 bg-gray-50">
                  <div className="grid grid-cols-4 gap-2">
                    {opportunity.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                          selectedImage === index
                            ? "border-blue-600"
                            : "border-transparent"
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          width={200}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center space-x-4">
                {opportunity.companyLogo && (
                  <Image
                    src={companyLogo}
                    alt={opportunity.company}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {opportunity.company}
                  </h3>
                  <p className="text-gray-600">
                    {campaignData?.campaign?.category?.name || "Healthcare"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Position Overview
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  {opportunity.description}
                </p>
                <div className="whitespace-pre-line text-gray-600 leading-relaxed">
                  {opportunity.fullDescription}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Requirements & Qualifications
              </h2>
              <ul className="space-y-3">
                {opportunity.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <i className="fas fa-check text-green-500 mt-1 mr-3"></i>
                    <span className="text-gray-600">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Key Responsibilities
              </h2>
              <ul className="space-y-3">
                {opportunity.responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start">
                    <i className="fas fa-circle text-blue-500 text-xs mt-2 mr-3"></i>
                    <span className="text-gray-600">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Apply for this Position
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <i className="fas fa-map-marker-alt mr-3 text-blue-600"></i>
                    <span>{opportunity.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <i className="fas fa-clock mr-3 text-blue-600"></i>
                    <span>{opportunity.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <i className="fas fa-dollar-sign mr-3 text-blue-600"></i>
                    <span>{opportunity.salary}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <i className="fas fa-calendar-alt mr-3 text-blue-600"></i>
                    <span>
                      Apply by{" "}
                      {new Date(opportunity.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowApplicationForm(true)}
                  disabled={submitting || compressing}
                  className="w-full bg-gradient-to-r from-blue-800 to-blue-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting || compressing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                      {compressing ? "Processing..." : "Applying..."}
                    </div>
                  ) : (
                    "Apply Now"
                  )}
                </button>

                <button
                  onClick={() => router.push("/")}
                  className="w-full border-2 border-blue-600 text-blue-600 py-4 rounded-xl font-semibold mt-3 hover:bg-blue-50 transition-all duration-300"
                >
                  <i className="far fa-compass mr-2"></i>
                  Explore Other Opportunities
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Benefits & Perks
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {opportunity.benefits.slice(0, 6).map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <i className="fas fa-check-circle text-green-500 mr-3"></i>
                      <span className="text-gray-600 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Apply for {opportunity.title}
                </h2>
                <button
                  onClick={() => setShowApplicationForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
                  disabled={submitting || compressing}
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                {opportunity.company} • {opportunity.location}
              </p>

              {submitError && (
                <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  {submitError}
                </div>
              )}

              {(submitting || compressing) && (
                <div className="mt-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
                      {compressing
                        ? "Compressing files..."
                        : "Submitting application..."}
                    </div>
                    {uploadProgress > 0 && (
                      <span className="text-sm font-medium">
                        {uploadProgress}%
                      </span>
                    )}
                  </div>
                  {uploadProgress > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmitApplication} className="p-6">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      required
                      disabled={submitting || compressing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={submitting || compressing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      required
                      disabled={submitting || compressing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      name="whats_app"
                      value={formData.whats_app}
                      onChange={handleInputChange}
                      disabled={submitting || compressing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                      placeholder="Enter your WhatsApp number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      disabled={submitting || compressing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                      placeholder="Enter your location"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Passport Number *
                    </label>
                    <input
                      type="text"
                      name="passport_number"
                      value={formData.passport_number}
                      onChange={handleInputChange}
                      required
                      disabled={submitting || compressing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                      placeholder="Enter passport number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nationality *
                    </label>
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      required
                      disabled={submitting || compressing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                      placeholder="Enter your nationality"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID Card Number *
                    </label>
                    <input
                      type="text"
                      name="id_card"
                      value={formData.id_card}
                      onChange={handleInputChange}
                      required
                      disabled={submitting || compressing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                      placeholder="Enter ID card number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      disabled={submitting || compressing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                  Documents & Files
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resume/CV *
                    </label>
                    <input
                      type="file"
                      name="resume"
                      onChange={(e) => handleFileUpload(e, "resume")}
                      required
                      accept=".pdf,.doc,.docx"
                      disabled={submitting || compressing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOC, DOCX (Max {isMobile ? "3MB" : "5MB"})
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certifications
                    </label>
                    <input
                      type="file"
                      name="certification"
                      onChange={(e) => handleFileUpload(e, "certification")}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      disabled={submitting || compressing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOC, DOCX, JPG, PNG
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID Card Front *
                    </label>
                    <input
                      type="file"
                      name="card_image_front"
                      onChange={(e) => handleFileUpload(e, "card_image_front")}
                      required
                      accept=".jpg,.jpeg,.png"
                      disabled={submitting || compressing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG (Max {isMobile ? "1MB" : "2MB"})
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID Card Back *
                    </label>
                    <input
                      type="file"
                      name="card_image_back"
                      onChange={(e) => handleFileUpload(e, "card_image_back")}
                      required
                      accept=".jpg,.jpeg,.png"
                      disabled={submitting || compressing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG (Max {isMobile ? "1MB" : "2MB"})
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Photo
                    </label>
                    <input
                      type="file"
                      name="profile_photo"
                      onChange={(e) => handleFileUpload(e, "profile_photo")}
                      accept=".jpg,.jpeg,.png"
                      disabled={submitting || compressing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Letter
                    </label>
                    <input
                      type="file"
                      name="cover_letter"
                      onChange={(e) => handleFileUpload(e, "cover_letter")}
                      accept=".pdf,.doc,.docx"
                      disabled={submitting || compressing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                  Additional Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      disabled={submitting || compressing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                      placeholder="Brief summary about yourself..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualifications
                    </label>
                    <textarea
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      rows={3}
                      disabled={submitting || compressing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                      placeholder="List your relevant qualifications..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education
                    </label>
                    <textarea
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      rows={3}
                      disabled={submitting || compressing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                      placeholder="Your education background..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        name="linkedin_profile"
                        value={formData.linkedin_profile}
                        onChange={handleInputChange}
                        disabled={submitting || compressing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website/Portfolio
                      </label>
                      <input
                        type="url"
                        name="website_or_portfolio"
                        value={formData.website_or_portfolio}
                        onChange={handleInputChange}
                        disabled={submitting || compressing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                        placeholder="https://yourportfolio.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Languages Spoken
                      </label>
                      <input
                        type="text"
                        name="languages_spoken"
                        value={formData.languages_spoken}
                        onChange={handleInputChange}
                        disabled={submitting || compressing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                        placeholder="English, Spanish, French..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Start Date
                      </label>
                      <input
                        type="date"
                        name="available_start_date"
                        value={formData.available_start_date}
                        onChange={handleInputChange}
                        disabled={submitting || compressing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 disabled:opacity-50"
                  disabled={submitting || compressing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || compressing}
                  className="flex-1 bg-gradient-to-r from-blue-800 to-blue-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting || compressing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                      {compressing ? "Processing..." : "Submitting..."}
                    </div>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default OpportunityDetailPage;

